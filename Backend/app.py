import os
import re
import math
import joblib
import json
import pandas as pd
import numpy as np
import urllib.parse
import tldextract
import traceback
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'users.json')
HISTORY_FILE = os.path.join(BASE_DIR, 'history.json')

# Initialize storage files
for file_path in [USERS_FILE, HISTORY_FILE]:
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump({}, f)

print("⚙️ Loading ML Models...")
try:
    model = joblib.load(os.path.join(BASE_DIR, 'phishing_hybrid_model.pkl'))
    scaler = joblib.load(os.path.join(BASE_DIR, 'feature_scaler.pkl'))
    print("✅ Models loaded successfully.")
except Exception as e:
    print(f"❌ CRITICAL ERROR: {e}")
    model, scaler = None, None

# --- TRUSTED WHITELIST ---
WHITELISTED_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
    "instagram.com", "linkedin.com", "wikipedia.org", "yahoo.com", "amazon.com",
    "reddit.com", "netflix.com", "microsoft.com", "apple.com", "github.com",
    "stackoverflow.com", "bing.com", "twitch.tv", "discord.com", "whatsapp.com",
    "tiktok.com", "paypal.com", "adobe.com", "nytimes.com", "cnn.com",
    "flaticon.com", "sourcecodehub.com", "eosc-synergy.eu"
]


def get_entropy(text):
    if not text:
        return 0
    p, lns = Counter(text), float(len(text))
    return -sum(count/lns * math.log2(count/lns) for count in p.values())


def extract_live_features(url):
    u = url if url.startswith(('http://', 'https://')) else 'http://' + url
    parsed = urllib.parse.urlparse(u)
    ext = tldextract.extract(u)
    trusted_tlds = ['com', 'org', 'net', 'edu',
                    'gov', 'io', 'eu', 'uk', 'ca', 'de']

    return {
        'url_length': len(url),
        'dot_count': url.count('.'),
        'https_flag': 1 if url.startswith('https') else 0,
        'has_ip_address': 1 if re.search(r'\d{1,3}\.\d{1,3}', url) else 0,
        'path_length': len(parsed.path),
        'token_count': len([t for t in re.split(r'[^a-zA-Z0-9]', url) if t]),
        'number_of_digits': sum(c.isdigit() for c in url),
        'percentage_numeric_chars': (sum(c.isdigit() for c in url) / len(url)) if len(url) > 0 else 0,
        'url_entropy': get_entropy(url),
        'subdomain_count': len(ext.subdomain.split('.')) if ext.subdomain else 0,
        'query_param_count': len(urllib.parse.parse_qs(parsed.query)),
        'tld_length': len(ext.suffix),
        'has_hyphen_in_domain': 1 if '-' in ext.domain else 0,
        'domain_name_length': len(ext.domain),
        'tld_popularity': 1 if ext.suffix in trusted_tlds else 0,
        'suspicious_file_extension': 1 if parsed.path.lower().endswith(('.exe', '.zip', '.php')) else 0
    }

# --- AUTH ROUTES ---


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email, password, name = data.get('email'), data.get(
        'password'), data.get('full_name')
    with open(USERS_FILE, 'r') as f:
        users = json.load(f)
    if email in users:
        return jsonify({"error": "User exists"}), 400
    users[email] = {"password": generate_password_hash(
        password), "full_name": name}
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)
    return jsonify({"message": "User registered"})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    with open(USERS_FILE, 'r') as f:
        users = json.load(f)
    user = users.get(email)
    if user and check_password_hash(user['password'], password):
        return jsonify({"user": {"email": email, "full_name": user['full_name']}})
    return jsonify({"error": "Invalid credentials"}), 401

# --- SCANNING ROUTE ---


@app.route('/scan', methods=['POST'])
def scan_url():
    if not model or not scaler:
        return jsonify({"error": "ML Service Offline"}), 500

    data = request.get_json()
    raw_url = data.get('url', '').strip().lower()
    user_email = data.get('email')

    try:
        # 1. IMMEDIATE WHITELIST BYPASS
        ext = tldextract.extract(raw_url)
        domain_only = f"{ext.domain}.{ext.suffix}"
        if domain_only in WHITELISTED_DOMAINS:
            return finalize_scan({"target_url": raw_url, "verdict": "safe", "status": "safe", "confidence": 100.0, "threat_level": "LOW"}, user_email)

        # 2. EXTRACT FEATURES
        features = extract_live_features(raw_url)

        # 3. DEFINE "CLEAN STRUCTURE" (Human Logic)
        # These are sites that are structurally very unlikely to be phishing.
        is_structurally_clean = (
            features['https_flag'] == 1 and
            features['url_length'] < 65 and
            features['number_of_digits'] < 4 and
            features['dot_count'] <= 3 and
            features['has_ip_address'] == 0 and
            not any(bad in raw_url for bad in [
                    'login', 'verify', 'account', 'secure', 'signin', 'update'])
        )

        # 4. AI ANALYSIS
        live_df = pd.DataFrame([features]).reindex(
            columns=scaler.feature_names_in_, fill_value=0)
        scaled_data = scaler.transform(live_df)
        probs = model.predict_proba(scaled_data)[0]
        phishing_prob = float(probs[1])

        print(
            f"🔍 URL: {raw_url} | AI Score: {phishing_prob:.4f} | Clean Structure: {is_structurally_clean}")

        # 5. THE DECISION ENGINE (AI Neuter)
        # If AI is highly aggressive (90%+) but the URL is structurally clean, we OVERRIDE to Safe.
        if is_structurally_clean and phishing_prob > 0.85:
            print(f"⚠️ Overriding AI False Positive for {raw_url}")
            prediction = 0
            final_conf = 97.5  # Forced safe confidence
        else:
            # Otherwise, use standard AI threshold
            prediction = 1 if phishing_prob > 0.90 else 0
            final_conf = round(
                float(phishing_prob if prediction == 1 else probs[0]) * 100, 2)

        result = {
            "target_url": raw_url,
            "verdict": "phishing" if prediction == 1 else "safe",
            "status": "malicious" if prediction == 1 else "safe",
            "confidence": final_conf,
            "threat_level": "CRITICAL" if (prediction == 1 and final_conf > 95) else "HIGH" if prediction == 1 else "LOW"
        }
        return finalize_scan(result, user_email)

    except Exception:
        print(traceback.format_exc())
        return jsonify({"error": "Scan failed"}), 500


def finalize_scan(result, user_email):
    if user_email:
        try:
            with open(HISTORY_FILE, 'r+') as f:
                history = json.load(f)
                history.setdefault(user_email, []).append(result)

                f.seek(0)
                json.dump(history, f)
                f.truncate()
        except Exception:
            pass
    return jsonify(result)


@app.route('/history', methods=['GET'])
def get_history():
    email = request.args.get('email')
    with open(HISTORY_FILE, 'r') as f:
        history = json.load(f)
    return jsonify(history.get(email, []))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
