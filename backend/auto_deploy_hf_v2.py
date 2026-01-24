from playwright.sync_api import sync_playwright
import time

def deploy_hf_space_v2():
    print("🤖 TITAN HF DEPLOYER V2")
    print("=======================")
    print("Launching Browser...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context()
        page = context.new_page()

        # 1. LOGIN PHASE
        print("1. Going to Login Page...")
        page.goto("https://huggingface.co/login")
        
        # Attempt to click "Sign in with Google" if visible
        try:
            # Common selector for social auth buttons
            print("   (Attempting to click 'Sign in with Google' for you...)")
            # This selector looks for the Google button form/button
            # Adjust based on current HF DOM
            google_btn = page.query_selector("form[action='/login/google'] button")
            if google_btn:
                google_btn.click()
                print("   ✅ Clicked Google Sign-In.")
            else:
                 print("   ℹ️ Google button not found via selector, please click it manually.")
        except Exception as e:
            print(f"   ⚠️ Could not click Google button: {e}")

        print("   >> WAITING FOR YOU TO COMPLETE LOGIN <<")
        print("   (I am watching the URL. Once you are logged in, I will proceed automatically.)")
        
        # Wait for login loop
        max_retries = 120 # 2 minutes
        for i in range(max_retries):
            current_url = page.url
            # If we are NOT on login page anymore, assume success (or user navigated away)
            if "/login" not in current_url and "huggingface.co" in current_url:
                print("✅ Login Detected!")
                break
            time.sleep(1)
        else:
            print("❌ Login Timed Out.")
            browser.close()
            return

        # 2. CREATION PHASE
        print("2. Navigate to New Space...")
        page.goto("https://huggingface.co/new-space")
        
        print("   Auto-Filling Form...")
        # Name
        page.fill("input[name='name']", "IIM2026")
        
        # SDK (Docker)
        # Using a click on the label/div that contains 'Docker'
        # HF often uses cards.
        try:
            # Try to click the literal text "Docker" which is usually in the SDK selection card
            page.click("text=Docker") 
            print("   ✅ Selected 'Docker' SDK.")
        except:
             print("   ⚠️ Could not auto-select Docker. Please select 'Docker' manually.")

        print("   ✅ Form Ready.")
        print("   >> CLICK 'CREATE SPACE' NOW. I WILL WATCH. <<")
        
        # We wait for the user to click Create, passing control back
        # Or checking if URL changes to the new space URL
        
        for i in range(60):
            if "/IIM2026" in page.url and "/new-space" not in page.url:
                 print("✅ SPACE CREATED!")
                 break
            time.sleep(1)
            
        print("3. Connecting Repo (Instructions Only)...")
        print("   Once Space is active:")
        print("   Settings -> Repositories -> Connect 'sandeepksp-prog/IIMA'")
        
        time.sleep(10) # Give user a moment to read
        # browser.close() # Keep open? user might need it. 
        # Closing to end script process but browser usually dies.
        # Actually with playwright script exit, browser closes. 
        # We will wait a bit long.
        time.sleep(60)

if __name__ == "__main__":
    deploy_hf_space_v2()
