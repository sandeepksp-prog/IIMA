from playwright.sync_api import sync_playwright
import sys
import time

try:
    with sync_playwright() as p:
        print("Playwright launching (Visible Mode)...")
        # Launch with headless=False to show the UI
        browser = p.chromium.launch(headless=False, slow_mo=1000) 
        page = browser.new_page()
        page.goto("https://www.google.com")
        print(f"Browser Engine: PASS - Title: {page.title()}")
        print("You should see Chrome open on your screen now.")
        time.sleep(5) # Keep open for 5 seconds
        browser.close()
except Exception as e:
    print(f"Browser Engine: FAIL - Error: {e}")
