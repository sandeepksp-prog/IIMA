import webbrowser
import time
import sys

def launch_mission_control():
    print("🚀 LAUNCHING MISSION CONTROL (Default Browser)")
    print("==========================================")
    print("Opening your authenticated browser (Comet/Chrome)...")
    
    urls = [
        ("Render (Backend)", "https://dashboard.render.com/select-repo?type=web"),
        ("Vercel (Frontend)", "https://vercel.com/new"),
        ("GitHub Codespaces (Database)", "https://github.com/sandeepksp-prog/IIMA/codespaces")
    ]

    for name, url in urls:
        print(f"\n🔗 Opening: {name}")
        webbrowser.open(url)
        time.sleep(2) # Brief pause between tabs
        
    print("\n✅ All systems active in your browser.")
    print("   Please Login/Deploy in the tabs that just opened.")

if __name__ == "__main__":
    launch_mission_control()
