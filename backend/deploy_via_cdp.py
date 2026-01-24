from playwright.sync_api import sync_playwright
import time
import sys

def deploy_with_cdp():
    print("💉 TITAN LIVE INJECTION (CDP Mode)")
    print("==================================")
    print("Attempting to connect to your running Chrome (Port 9222)...")

    try:
        with sync_playwright() as p:
            # CONNECT to existing browser via CDP
            try:
                browser = p.chromium.connect_over_cdp("http://localhost:9222")
            except Exception as e:
                print(f"❌ CONNECTION FAILED: {e}")
                print("   ensure you ran: chrome.exe --remote-debugging-port=9222")
                return

            # Get the active context/page
            if not browser.contexts:
                context = browser.new_context()
            else:
                context = browser.contexts[0]
            
            if not context.pages:
                page = context.new_page()
            else:
                # Use the first page or find a relevant one
                page = context.pages[0]
                
            print("✅ Identity Restored. Connected to your session.")
            
            # Navigate to New Space
            print("   Navigating to Hugging Face...")
            page.goto("https://huggingface.co/new-space")
            
            # Identify if logged in
            if "/login" in page.url:
                print("⚠️ You are NOT logged in even on your main browser.")
                print("   Please Login manually now. I will wait.")
                time.sleep(30)
            else:
                print("✅ Authenticated Session Detected.")

            # Auto-Fill
            print("   Auto-Filling Form (IIM2026 / Docker)...")
            try:
                page.fill("input[name='name']", "IIM2026")
                page.click("text=Docker")
                print("✅ Form Filled.")
                
                print("   >> CLICK 'CREATE SPACE'. I WILL WAIT. <<")
                
                # Monitor for success
                for i in range(60):
                     if "/IIM2026" in page.url and "/new-space" not in page.url:
                         print("✅ SPACE CREATED CONFIRMED!")
                         break
                     time.sleep(1)
            except Exception as e:
                print(f"⚠️ Interaction Error (You may need to do it manually): {e}")

            print("Disconnecting CDP (Browser stays open)...")
            browser.close() # In CDP, this disconnects, doesn't always kill.

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")

if __name__ == "__main__":
    deploy_with_cdp()
