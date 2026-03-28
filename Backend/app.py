import os
import re
import math
import joblib
import pandas as pd
import numpy as np
import urllib.parse
import tldextract
import traceback
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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


def get_entropy(text):
    if not text:
        return 0
    p, lns = Counter(text), float(len(text))
    return -sum(count/lns * math.log2(count/lns) for count in p.values())


def extract_live_features(url):
    if not url.startswith('http'):
        url = 'http://' + url
    parsed = urllib.parse.urlparse(url)
    ext = tldextract.extract(url)
    return {
        'url_length': len(url), 'dot_count': url.count('.'),
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


@app.route('/scan', methods=['POST'])
def scan_url():
    if not model or not scaler:
        return jsonify({"error": "Models offline"}), 500
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "No URL"}), 400

    raw_url = data['url'].strip()
    try:
        features = extract_live_features(raw_url)
        live_df = pd.DataFrame([features])
        expected_features = scaler.feature_names_in_
        live_df = live_df.reindex(columns=expected_features, fill_value=0)

        scaled_features = scaler.transform(live_df)
        scaled_df = pd.DataFrame(scaled_features, columns=expected_features)

        prediction = int(model.predict(scaled_df)[0])
        prob = model.predict_proba(scaled_df)[0]
        conf = prob[1] if prediction == 1 else prob[0]

        return jsonify({
            "target_url": raw_url,
            "verdict": "phishing" if prediction == 1 else "safe",
            "status": "malicious" if prediction == 1 else "safe",
            "confidence": round(conf * 100, 2),
            "threat_level": "CRITICAL" if (prediction == 1 and conf > 0.8) else "HIGH" if prediction == 1 else "LOW"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
