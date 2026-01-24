import webbrowser
import os
import time

def launch_hf_protocol():
    print("🤗 LAUNCHING HUGGING FACE PROTOCOL (No Card Required)")
    print("====================================================")
    print("1. We added a 'Dockerfile' to your repo.")
    print("2. You need to push this to GitHub first.")
    print("3. Then we deploy on HF Spaces.")

    # URL to Create New Space
    hf_url = "https://huggingface.co/new-space"
    
    print(f"\n🔗 Opening: {hf_url}")
    webbrowser.open(hf_url)
    
    print("\n✅ INSTRUCTIONS FOR BROWSER:")
    print("1. Space Name: 'titan-backend'")
    print("2. SDK: Select 'Docker'")
    print("3. Create Space.")
    print("4. ONCE CREATED: Go to 'Settings' -> 'Repositories' -> Connect 'sandeepksp-prog/IIMA'")
    print("   (Or just manually upload the Dockerfile if you prefer)")

if __name__ == "__main__":
    launch_hf_protocol()
