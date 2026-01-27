import time
from playwright.sync_api import sync_playwright

def run():
    print("🕵️ AGENTIC TOUR STARTED: DAILY TARGETS")
    try:
        with sync_playwright() as p:
            print("🔌 Connecting to Commander's Browser (Port 9222)...")
            try:
                browser = p.chromium.connect_over_cdp("http://localhost:9222")
            except Exception as e:
                print(f"❌ Could not connect to browser: {e}")
                print("⚠️ Please ensure Chrome is running on port 9222 (run core_launcher.py if needed).")
                return

            context = browser.contexts[0]
            
            # Find or Open Localhost
            pages = context.pages
            dashboard_page = None
            for page in pages:
                if "localhost:5173" in page.url:
                    dashboard_page = page
                    break
            
            if not dashboard_page:
                print("✨ Opening new Localhost tab...")
                dashboard_page = context.new_page()
                dashboard_page.goto("http://localhost:5173")
            else:
                print("✅ Found existing Localhost tab.")
                dashboard_page.reload() # Refresh to load new code
                time.sleep(2)

            # Listen for Console Logs
            dashboard_page.on("console", lambda msg: print(f"📜 CONSOLE: {msg.text}"))
            dashboard_page.on("pageerror", lambda err: print(f"❌ PAGE ERROR: {err}"))
            
            # FORCE DESKTOP VIEWPORT
            dashboard_page.set_viewport_size({"width": 1920, "height": 1080})
            
            print("⏳ Waiting for network idle...")
            try:
                dashboard_page.wait_for_load_state("networkidle", timeout=5000)
            except:
                print("⚠️ Network idle timed out, proceeding...")

            dashboard_page.bring_to_front()
            time.sleep(1)

            # 1. VISUAL CHECK: DASHBOARD
            print("📸 Capturing: Dashboard")
            dashboard_page.screenshot(path="frontend/visual_proof/1_dashboard_real.png")

            # 2. NAVIGATE: DAILY TARGETS
            print("👉 Clicking: Daily Targets")
            try:
                dashboard_page.click("button:has-text('Daily Targets')", timeout=5000)
            except:
                print("⚠️ 'Daily Targets' button not found, trying 'TARGET' icon...")
                # Try clicking by index if text fails (3rd item is Daily Targets)
                # War Room, Daily Targets, Full Mocks...
                dashboard_page.locator("nav button").nth(1).click()
            
            time.sleep(2)
            print("✅ Navigated to Daily Targets")
            
            # 3. SCROLL & CAPTURE
            print("📸 Capturing: Top")
            dashboard_page.screenshot(path="frontend/visual_proof/2_daily_top_real.png")
            
            print("📜 Scrolling...")
            dashboard_page.evaluate("window.scrollBy(0, 600)")
            time.sleep(1)
            print("📸 Capturing: Middle")
            dashboard_page.screenshot(path="frontend/visual_proof/2_daily_mid_real.png")
            
            print("📜 Scrolling...")
            dashboard_page.evaluate("window.scrollBy(0, 600)")
            time.sleep(1)
            print("📸 Capturing: Bottom")
            dashboard_page.screenshot(path="frontend/visual_proof/2_daily_bot_real.png")

            print("✅ MISSION COMPLETE. Proofs saved.")

    except Exception as e:
        print(f"❌ FATAL ERROR: {e}")

if __name__ == "__main__":
    run()
