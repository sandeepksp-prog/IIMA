from playwright.sync_api import sync_playwright
import time
import sys

def auto_deploy():
    print("🤖 TITAN AUTO-DEPLOY PROTOCOL")
    print("============================")
    print("I am taking control of a Chrome window to guide you through the Cloud Launch.")
    print("Please login when prompted.")

    try:
        with sync_playwright() as p:
            # Launch Visible Browser
            browser = p.chromium.launch(headless=False, executable_path=None) # Uses bundled chromium
            context = browser.new_context()
            page = context.new_page()

            # 1. RENDER (Backend)
            print("\n[1/3] Backend: Navigating to Render...")
            page.goto("https://dashboard.render.com/select-repo?type=web")
            print("   ACTION: Login (if needed) -> Click 'sandeepksp-prog/IIMA' -> Create Service.")
            print("   (I will wait 60s for you to do this)")
            time.sleep(60)

            # 2. VERCEL (Frontend)
            print("\n[2/3] Frontend: Navigating to Vercel...")
            page.goto("https://vercel.com/new")
            print("   ACTION: Import 'sandeepksp-prog/IIMA' -> Deploy.")
            print("   (I will wait 60s for you to do this)")
            time.sleep(60)

            # 3. GITHUB CODESPACES (Database)
            print("\n[3/3] Database: Navigating to GitHub Codespaces...")
            page.goto("https://github.com/sandeepksp-prog/IIMA/codespaces")
            print("   ACTION: Create Codespace -> Run 'python backend/setup_titan_interactive.py'")
            print("   (I will wait 120s for you to do this)")
            time.sleep(120)

            print("\n✅ SEQUENCE COMPLETE. Closing Browser.")
            browser.close()
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("   (Ensure you closed the previous Chrome window if using a customized path)")

if __name__ == "__main__":
    auto_deploy()
