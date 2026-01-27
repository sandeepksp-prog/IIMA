from playwright.sync_api import sync_playwright
import time
import os

def capture_evidence():
    print("📸 CAPTURING EVIDENCE (Screenshots)")
    print("==================================")
    
    # Ensure dir exists
    if not os.path.exists("frontend/visual_proof"):
        os.makedirs("frontend/visual_proof")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 720})

        try:
            # 1. Dashboard
            print("[1/3] Dashboard...")
            page.goto("http://localhost:5173", timeout=60000) # Wait for Vite
            time.sleep(3) # Let React render
            page.screenshot(path="frontend/visual_proof/1_dashboard.png")
            print("      📸 Snap 1 Saved.")

            # 2. Forensics
            print("[2/3] Deep Forensics...")
            # Click navigation if possible, else direct
            try:
                page.click("text=Deep Forensics")
            except:
                page.goto("http://localhost:5173/forensics")
            time.sleep(3)
            page.screenshot(path="frontend/visual_proof/2_forensics.png")
            print("      📸 Snap 2 Saved.")

            # 3. Practice
            print("[3/3] War Room...")
            try:
                page.click("text=War Room")
            except:
                page.goto("http://localhost:5173/practice")
            time.sleep(3)
            page.screenshot(path="frontend/visual_proof/3_war_room.png")
            print("      📸 Snap 3 Saved.")

            print("\n✅ EVIDENCE SECURED in 'frontend/visual_proof/'")
            
        except Exception as e:
            print(f"❌ CAPTURE FAILED: {e}")
        
        browser.close()

if __name__ == "__main__":
    capture_evidence()
