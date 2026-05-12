import sys
import os

# Add the current directory to sys.path to allow importing 'app'
sys.path.append(os.getcwd())

try:
    from app.main import app
    print("Backend imports successful!")
except Exception as e:
    print(f"Backend import failed: {e}")
    import traceback
    traceback.print_exc()
