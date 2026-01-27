import webbrowser
import time

def open_frontend():
    print("🚀 LAUNCHING FRONTEND (UI Only)")
    print("=================================")
    url = "http://localhost:5173"
    print(f"🔗 Opening: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    open_frontend()
