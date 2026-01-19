import subprocess
import time
import os
import signal
import sys
import webbrowser

def start_engine():
    print("🚀 IGNITING CAT AGENTIC ENGINE...")
    print("-----------------------------------")
    
    # 1. Start Backend
    print("🧠 Starting Brain (FastAPI)...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"],
        creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
    )
    
    # 2. Start Frontend
    print("💻 Starting Face (Vite React)...")
    # Using 'npm.cmd' for Windows
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    frontend_process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd="frontend",
        creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
    )

    print("-----------------------------------")
    print("✅ Engine Room Built. Ready to ignite.")
    print("   Backend: http://localhost:8000/health")
    print("   Frontend: http://localhost:5173")
    print("-----------------------------------")
    
    # Optional: Open Browser
    time.sleep(3) # Wait for startup
    webbrowser.open("http://localhost:5173")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down engine...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    start_engine()
