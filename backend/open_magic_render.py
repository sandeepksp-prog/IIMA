import webbrowser
import time

def launch_render_blueprint():
    print("🚀 LAUNCHING RENDER BLUEPRINT")
    print("================================")
    print("This 'Magic Link' will read your render.yaml and auto-configure the service.")
    
    # URL that triggers Blueprint Deployment
    # Required: Repo must be Public
    repo="https://github.com/sandeepksp-prog/IIMA"
    magic_url = f"https://render.com/deploy?repo={repo}"
    
    print(f"🔗 Opening: {magic_url}")
    webbrowser.open(magic_url)
    
    print("\n✅ ACTION REQUIED:")
    print("1. If prompted for 'Blueprint Name', type: titan-backend")
    print("2. Click 'Apply' or 'Create'.")
    print("3. Wait for the green checkmark.")

if __name__ == "__main__":
    launch_render_blueprint()
