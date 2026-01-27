from playwright.sync_api import sync_playwright
import time

def run_frontend_tour():
    print("🎬 FRONTEND UX TOUR (Visual Check)")
    print("==================================")
    print("Launching Browser to inspect 'http://localhost:5173'...")

    with sync_playwright() as p:
        # Launch Headed (Visible)
        browser = p.chromium.launch(headless=False, slow_mo=1500)
        page = browser.new_page()

        try:
            # 1. Dashboard (Home)
            print("[1/4] Visiting Dashboard...")
            page.goto("http://localhost:5173")
            time.sleep(2)
            
            # Check for "Performance Nexus" or main title
            title = page.title()
            print(f"      Title: {title}")
            
            # 2. Deep Forensics route
            print("[2/4] Clicking 'Deep Forensics'...")
            # Try finding the link/button. Adjust selector as needed.
            # Assuming there's a nav link or card.
            # We'll try generic text match if specific ID missing.
            try:
                page.click("text=Deep Forensics", timeout=3000)
            except:
                print("      (Link 'Deep Forensics' not found, trying URL directly)")
                page.goto("http://localhost:5173/forensics")
            
            # 3. Practice/War Room
            print("[3/4] Clicking 'War Room' (Practice)...")
            try:
                page.click("text=War Room", timeout=3000)
            except:
                 print("      (Link 'War Room' not found, trying URL directly)")
                 page.goto("http://localhost:5173/practice")

            # 4. Titan/AI
            print("[4/4] Checking AI Chat...")
            # Just verify if element exists
            if page.query_selector("text=Titan"):
                print("      ✅ Titan AI interface detected.")
            
            print("\n✅ TOUR COMPLETE.")
            print("   Please review the open window. Is this the updated version?")
            print("   (Closing in 10s...)")
            time.sleep(10)

        except Exception as e:
            print(f"❌ TOUR ERROR: {e}")
            print("   (Is the dev server running on 5173?)")
        
        browser.close()

if __name__ == "__main__":
    run_frontend_tour()
