# PhishGuard: AI-Powered Phishing Detection System

PhishGuard is a high-performance web application designed to detect malicious URLs using a hybrid approach that combines Machine Learning (Random Forest/XGBoost) with heuristic structural analysis.

## 🚀 Technical Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Radix UI / Shadcn UI
- **Icons:** Lucide React
- **State Management:** React Context API (Auth & Theme)

### Backend
- **Framework:** Python Flask
- **Machine Learning:** Scikit-learn, Joblib
- **Data Processing:** Pandas, NumPy
- **URL Analysis:** TLDextract, Urllib.parse
- **Security:** Werkzeug (Password Hashing)

## 🧠 Machine Learning & Logic

### 1. The Model (Hybrid Architecture)
PhishGuard uses a **Random Forest / Gradient Boosting Hybrid Model** trained on a dataset of over 100,000+ labeled URLs (Safe vs. Malicious). 

### 2. Feature Extraction (16+ Metrics)
For every URL submitted, the system extracts live features including:
- **Lexical Analysis:** URL length, dot count, number of digits, and token count.
- **Security Indicators:** HTTPS flag, presence of IP addresses in hostname.
- **Domain Reputation:** TLD length, TLD popularity (Common vs. Rare suffixes), and hyphen counts.
- **Complexity Metrics:** URL Entropy (detecting random/generated strings) and Query parameter count.

### 3. The Decision Engine (AI + Heuristics)
The system employs a "Safety First" override logic:
- **AI Verdict:** The model provides a probability score.
- **Heuristic Bypass:** If a URL is structurally "clean" (short, HTTPS, low digit count, no suspicious keywords like 'login') but the AI is aggressive, a heuristic layer overrides the result to prevent False Positives.
- **Whitelist:** Immediate bypass for top-tier trusted domains (Google, Microsoft, etc.).

## 🏗️ System Architecture

1. **Client Tier:** React/Next.js handles the UI and session management.
2. **API Tier:** Flask REST API manages authentication, URL scanning, and log retrieval.
3. **Data Tier:** 
   - `users.json`: Persistent user credentials.
   - `history.json`: Per-user scan results.
   - `system_logs.json`: Global audit trail for logins and detections.
4. **ML Tier:** Joblib-loaded `.pkl` models and feature scalers.

## 🛠️ Setup & Installation

### Backend
1. Navigate to `/Backend`.
2. Create a virtual environment: `python -m venv .venv`.
3. Activate it: `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`.
5. Run: `python app.py`.

### Frontend
1. Install dependencies: `npm install` or `pnpm install`.
2. Run development server: `npm run dev`.

---
*Developed for advanced cybersecurity protection.*
