from playwright.sync_api import sync_playwright

def run():
    print("📸 DEBUG SNAPSHOT")
    try:
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            page = context.pages[0]
            page.set_viewport_size({"width": 1920, "height": 1080})
            page.bring_to_front()
            
            print(f"Title: {page.title()}")
            page.screenshot(path="frontend/visual_proof/debug_snapshot.png", full_page=True)
            print("✅ Snapshot saved to debug_snapshot.png")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    run()
