import joblib
import warnings
import os
from sklearn.exceptions import InconsistentVersionWarning

# Silence the warning while we perform the update
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Your specific filenames
model_files = [
    'phishing_hybrid_model.pkl',
    'feature_scaler.pkl'
]

print("🔄 Updating model versions to 1.8.0...")

for file in model_files:
    if os.path.exists(file):
        try:
            # Load the old 1.6.1 version
            data = joblib.load(file)
            # Save it back using the current 1.8.0 version
            joblib.dump(data, file)
            print(f"✅ {file} is now updated.")
        except Exception as e:
            print(f"❌ Error updating {file}: {e}")
    else:
        print(f"⚠️ Could not find {file} in the current directory.")

print("\nDone! Now run your app.")
