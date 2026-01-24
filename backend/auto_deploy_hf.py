from playwright.sync_api import sync_playwright
import time

def deploy_hf_space():
    print("🤖 TITAN HF DEPLOYER")
    print("====================")
    print("I am launching Chrome. Please LOGIN to Hugging Face when it opens.")

    with sync_playwright() as p:
        # Launch Visible Browser
        browser = p.chromium.launch(headless=False, slow_mo=1000)
        context = browser.new_context()
        page = context.new_page()

        # 1. Login Phase
        print("   Navigating to Login...")
        page.goto("https://huggingface.co/login")
        print("   >> PLEASE LOGIN NOW. I WILL WAIT 45 SECONDS. <<")
        time.sleep(45)

        # 2. Creation Phase
        print("   Navigating to New Space...")
        page.goto("https://huggingface.co/new-space")
        
        # Fill Form
        print("   Applying Configuration:")
        print("   - Name: IIM2026")
        print("   - SDK: Docker")
        
        try:
            # Target inputs by name/placeholder/text
            # Note: Selectors might vary, attempting robust ones
            page.fill("input[name='name']", "IIM2026")
            page.fill("input[name='title']", "CAT PREP PLATFORM") # Just in case it asks for title
            
            # Select Docker SDK
            # Often these are cards or buttons. Attempting text match.
            page.click("text=Docker")
            
            # Select Public/Private (Defaulting to Public for ease, or Private)
            # page.click("text=Public")
            
            print("✅ FORM FILLED.")
            print("   >> PLEASE CLICK 'CREATE SPACE' NOW. I WILL WAIT 30s. <<")
            time.sleep(30)
            
            # 3. Connection Phase (Optional - Advanced)
            # If we could redirect to settings...
             
        except Exception as e:
            print(f"⚠️ Auto-Fill Issue: {e}")
            print("   Please finish filling the form manually.")
            time.sleep(60)

        print("Browser closing...")
        browser.close()

if __name__ == "__main__":
    deploy_hf_space()
