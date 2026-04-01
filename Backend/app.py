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

# Initialize storage files if they don't exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump({}, f)

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, 'w') as f:
        json.dump({}, f)

print("⚙️ Loading ML Models...")
try:
    model_path = os.path.join(BASE_DIR, 'phishing_hybrid_model.pkl')
    scaler_path = os.path.join(BASE_DIR, 'feature_scaler.pkl')
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    print("✅ Models loaded successfully.")
except Exception as e:
    print(f"❌ CRITICAL ERROR: {e}")
    model, scaler = None, None

# --- THE TOP 100+ WHITELIST ---
WHITELISTED_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
    "instagram.com", "linkedin.com", "wikipedia.org", "yahoo.com", "amazon.com",
    "reddit.com", "netflix.com", "microsoft.com", "apple.com", "github.com",
    "stackoverflow.com", "bing.com", "twitch.tv", "discord.com", "whatsapp.com",
    "zoom.us", "tiktok.com", "pinterest.com", "ebay.com", "paypal.com",
    "quora.com", "imdb.com", "yelp.com", "craigslist.org", "zillow.com",
    "adobe.com", "wordpress.com", "blogspot.com", "tumblr.com", "vimeo.com",
    "soundcloud.com", "spotify.com", "nytimes.com", "cnn.com", "bbc.com",
    "theguardian.com", "washingtonpost.com", "foxnews.com", "forbes.com",
    "bloomberg.com", "wsj.com", "reuters.com", "espn.com", "nfl.com",
    "nba.com", "weather.com", "outbrain.com", "taboola.com", "cnbc.com",
    "hulu.com", "disneyplus.com", "hbomax.com", "canva.com", "dropbox.com",
    "box.com", "slack.com", "asana.com", "trello.com", "jira.com",
    "salesforce.com", "hubspot.com", "shopify.com", "stripe.com", "squareup.com",
    "zendesk.com", "intercom.com", "aws.amazon.com", "azure.microsoft.com",
    "cloudflare.com", "fastly.com", "akamai.com", "github.io", "medium.com",
    "substack.com", "patreon.com", "kickstarter.com", "indiegogo.com",
    "etsy.com", "wayfair.com", "homedepot.com", "lowes.com", "target.com",
    "walmart.com", "bestbuy.com", "costco.com", "ikea.com", "alibaba.com",
    "aliexpress.com", "jd.com", "baidu.com", "qq.com", "wechat.com",
    "weibo.com", "bilibili.com", "zhihu.com", "duckduckgo.com", "openai.com",
    "chatgpt.com", "anthropic.com", "eosc-synergy.eu"
]


def get_entropy(text):
    if not text:
        return 0
    p, lns = Counter(text), float(len(text))
    return -sum(count/lns * math.log2(count/lns) for count in p.values())


def extract_live_features(url):
    # Ensure URL has a scheme for parsing, but features should reflect the input
    if not url.startswith(('http://', 'https://')):
        url_for_parsing = 'http://' + url
    else:
        url_for_parsing = url

    parsed = urllib.parse.urlparse(url_for_parsing)
    ext = tldextract.extract(url_for_parsing)

    return {
        'url_length': len(url),
        'dot_count': url.count('.'),
        'https_flag': 1 if url.startswith('https') else 0,
        'has_ip_address': 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0,
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
        'tld_popularity': 1 if ext.suffix in ['com', 'org', 'net'] else 0,
        'suspicious_file_extension': 1 if parsed.path.endswith(('.exe', '.zip', '.php', '.bin', '.html')) else 0
    }

# --- AUTH ENDPOINTS ---


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')

    if not email or not password or not full_name:
        return jsonify({"error": "Missing required fields"}), 400

    with open(USERS_FILE, 'r') as f:
        users = json.load(f)

    if email in users:
        return jsonify({"error": "User already exists"}), 400

    users[email] = {
        "password": generate_password_hash(password),
        "full_name": full_name
    }

    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

    return jsonify({"message": "Registration successful", "user": {"email": email, "full_name": full_name}})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    with open(USERS_FILE, 'r') as f:
        users = json.load(f)

    user = users.get(email)
    if user and check_password_hash(user['password'], password):
        return jsonify({
            "message": "Login successful",
            "user": {"email": email, "full_name": user['full_name']}
        })

    return jsonify({"error": "Invalid credentials"}), 401

# --- SCAN & HISTORY ENDPOINTS ---


@app.route('/scan', methods=['POST'])
def scan_url():
    if not model or not scaler:
        return jsonify({"error": "Models offline"}), 500

    data = request.get_json()
    raw_url = data.get('url', '').strip()
    user_email = data.get('email')

    if not raw_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # 1. Whitelist Check (Fast Path)
        url_for_parse = raw_url if raw_url.startswith(
            ('http://', 'https://')) else 'https://' + raw_url
        try:
            parsed_url = urllib.parse.urlparse(url_for_parse)
            hostname = parsed_url.hostname.lower() if parsed_url.hostname else ""
            is_whitelisted = any(hostname == d or hostname.endswith(
                '.' + d) for d in WHITELISTED_DOMAINS)

            if is_whitelisted:
                result = {
                    "target_url": raw_url,
                    "verdict": "safe",
                    "status": "safe",
                    "confidence": 99.99,
                    "threat_level": "LOW (Verified Whitelist)"
                }
                return finalize_scan(result, user_email)
        except:
            pass

        # 2. ML Analysis
        features = extract_live_features(raw_url)
        live_df = pd.DataFrame([features])
        expected_features = scaler.feature_names_in_
        live_df = live_df.reindex(columns=expected_features, fill_value=0)

        scaled_features = scaler.transform(live_df)
        scaled_df = pd.DataFrame(scaled_features, columns=expected_features)

        # Use a more conservative threshold if the model is biased
        probs = model.predict_proba(scaled_df)[0]
        phishing_prob = float(probs[1])

        # --- BIAS CORRECTION ---
        # If the domain is a popular TLD and has very low suspicious features,
        # require a much higher threshold to flag as phishing.
        final_threshold = 0.9
        if features['tld_popularity'] == 1 and features['url_length'] < 30 and features['dot_count'] <= 2:
            # For short, popular TLD domains, increase the threshold significantly
            final_threshold = 0.999
        
        # INCREASE THRESHOLD: Only flag as malicious if prob > final_threshold
        prediction = 1 if phishing_prob > final_threshold else 0
        conf = phishing_prob if prediction == 1 else probs[0]

        result = {
            "target_url": raw_url,
            "verdict": "phishing" if prediction == 1 else "safe",
            "status": "malicious" if prediction == 1 else "safe",
            "confidence": round(float(conf) * 100, 2),
            "threat_level": "CRITICAL" if (prediction == 1 and conf > 0.95) else "HIGH" if prediction == 1 else "LOW"
        }

        return finalize_scan(result, user_email)

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


def finalize_scan(result, user_email):
    # Save to history if user is provided
    if user_email:
        try:
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)

            if user_email not in history:
                history[user_email] = []

            history[user_email].append(result)

            with open(HISTORY_FILE, 'w') as f:
                json.dump(history, f)
        except:
            pass

    return jsonify(result)


@app.route('/history', methods=['GET'])
def get_history():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400

    try:
        with open(HISTORY_FILE, 'r') as f:
            history = json.load(f)
    except:
        history = {}

    user_history = history.get(email, [])
    return jsonify(user_history)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
