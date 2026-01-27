import time
from playwright.sync_api import sync_playwright
import os

def run():
    print("🚀 Titan Eyes: Engaging Visual Probe...")
    with sync_playwright() as p:
        try:
            # Launch browser (HEADED for User Visibility)
            print("👁️ Launching Visible Browser...")
            browser = p.chromium.launch(headless=False, slow_mo=1000) 
            page = browser.new_page()

            # CAPTURE CONSOLE LOGS
            page.on("console", lambda msg: print(f"📜 CONSOLE: {msg.text}"))
            page.on("pageerror", lambda exc: print(f"❌ PAGE ERROR: {exc}"))
            
            # 1. Navigate to Dashboard
            print("🔗 Connecting to localhost:5173...")
            page.goto("http://localhost:5173", timeout=30000)
            
            # DEBUG: Print Root Content
            root_content = page.eval_on_selector("#root", "el => el.innerHTML")
            print(f"🕵️ ROOT CONTENT LENGTH: {len(root_content)}")
            if len(root_content) < 50:
                 print(f"❌ ROOT CONTENT EMPTY/TINY: {root_content}")
            else:
                 print("✅ ROOT CONTENT DETECTED.")

            page.wait_for_load_state("networkidle")
            
            # Check for White Screen (Body should not be empty)
            content = page.content()
            if "root" not in content:
                print("❌ FATAL: Root element missing!")
                return
            
            # Screenshot 1: Dashboard
            print("📸 Capturing: Dashboard (War Room)")
            page.screenshot(path="frontend/visual_proof/1_dashboard.png")
            
            # 2. Navigate to Daily Targets
            print("👉 Clicking: Daily Targets")
            page.click("text=DAILY TARGETS")
            time.sleep(2)
            print("📸 Capturing: Daily Targets (Top)")
            page.screenshot(path="frontend/visual_proof/2_daily_top.png")
            
            # Scroll Down
            page.evaluate("window.scrollBy(0, 500)")
            time.sleep(1)
            print("📸 Capturing: Daily Targets (Middle)")
            page.screenshot(path="frontend/visual_proof/2_daily_mid.png")

            page.evaluate("window.scrollBy(0, 500)")
            time.sleep(1)
            print("📸 Capturing: Daily Targets (Bottom)")
            page.screenshot(path="frontend/visual_proof/2_daily_bot.png")

            # 3. Navigate to Mocks
            print("👉 Clicking: Full Mocks")
            page.click("text=FULL MOCKS")
            time.sleep(2)
            print("📸 Capturing: Full Mocks")
            page.screenshot(path="frontend/visual_proof/3_mocks.png")
            
            # 3. Navigate to Sectionals
            print("👉 Clicking: Sectionals")
            page.click("text=SECTIONALS")
            time.sleep(2)
            print("📸 Capturing: Sectionals")
            page.screenshot(path="frontend/visual_proof/3_sectionals.png")
            
             # 4. Navigate to Practice
            print("👉 Clicking: Practice Tests")
            page.click("text=PRACTICE TESTS")
            time.sleep(2)
            print("📸 Capturing: Practice Tests")
            page.screenshot(path="frontend/visual_proof/4_practice.png")

            print("✅ Visual Verification Complete. Screenshots saved in visual_proof/.")
            browser.close()
            
        except Exception as e:
            print(f"❌ Titan Eyes Failure: {e}")

if __name__ == "__main__":
    run()
