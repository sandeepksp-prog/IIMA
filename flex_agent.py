import time
from playwright.sync_api import sync_playwright

def run():
    print("🤖 FLEX AGENT ACTIVATED.")
    try:
        with sync_playwright() as p:
            print("🔌 Connecting to Commander's Browser (Port 9222)...")
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            
            # 1. CONTROL EXISTING TAB (Localhost)
            pages = context.pages
            dashboard_page = None
            for page in pages:
                if "localhost:5173" in page.url or "Vite" in page.title():
                    dashboard_page = page
                    break
            
            if not dashboard_page:
                print("⚠️ Dashboard not found, opening it...")
                dashboard_page = context.new_page()
                dashboard_page.goto("http://localhost:5173")
            
            # FORCE FOCUS
            dashboard_page.bring_to_front()
            print("⚓ Localhost Target Acquired. Bringing to Front.")
            time.sleep(2)

            # NAVIGATE TABS (Slower for visual effect)
            print("👉 Clicking 'Full Mocks'...")
            try:
                dashboard_page.click("text=FULL MOCKS", timeout=2000)
            except:
                dashboard_page.click("text=Full Mocks") # Fallback
            time.sleep(2)

            print("👉 Clicking 'Sectionals'...")
            try:
                 dashboard_page.click("text=SECTIONALS", timeout=2000)
            except:
                 dashboard_page.click("text=Sectionals")
            time.sleep(2)

            print("👉 Clicking 'Practice Tests'...")
            dashboard_page.click("text=PRACTICE TESTS")
            time.sleep(1.5)

            print("👉 Clicking Back to 'War Room'...")
            dashboard_page.click("text=WAR ROOM")
            time.sleep(1)

            # 2. OPEN NEW TAB & TYPE MESSAGE
            print("✨ Opening New Communication Channel...")
            new_page = context.new_page()
            new_page.goto("https://www.google.com")
            
            print("⌨️  Typing Message...")
            # Wait for search box (Google's textarea)
            new_page.wait_for_selector("textarea[name='q']")
            new_page.click("textarea[name='q']")
            
            message = "I LOVE YOU COMMANDER"
            for char in message:
                new_page.keyboard.type(char)
                time.sleep(0.1) # Typewriter effect
            
            time.sleep(1)
            new_page.keyboard.press("Enter")
            
            print("🫡 Message Sent via Search.")
            time.sleep(5) # Let the user see it
            
            # Clean up (Optional, or leave it open for effect)
            # new_page.close()
            # dashboard_page.bring_to_front()

            print("✅ FLEX COMPLETE.")

    except Exception as e:
        print(f"❌ FLEX FAILED: {e}")

if __name__ == "__main__":
    run()
