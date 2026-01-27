from playwright.sync_api import sync_playwright
import os

def run():
    print("🔌 INITIALIZING NATIVE BRIDGE PROTOCOL...")
    
    # 1. VISUAL OVERRIDE: INJECT OVERLAY
    js_overlay = """
        const borderId = 'agent-visual-overlay';
        const existing = document.getElementById(borderId);
        if (existing) existing.remove();

        // 1. Blue Border
        document.body.style.border = '10px solid #00AAFF';
        document.body.style.boxSizing = 'border-box';
        document.body.style.minHeight = '100vh';

        // 2. Agent Overlay Badge
        const overlay = document.createElement('div');
        overlay.id = borderId;
        overlay.textContent = '⚡ GOD MODE ACTIVE';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.right = '0';
        overlay.style.background = '#00AAFF';
        overlay.style.color = '#000';
        overlay.style.fontWeight = '900';
        overlay.style.fontFamily = 'monospace';
        overlay.style.fontSize = '12px';
        overlay.style.padding = '4px 12px';
        overlay.style.zIndex = '9999999';
        overlay.style.boxShadow = '0 0 10px #00AAFF';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
        
        console.log("✅ Visuals Injected");
    """

    try:
        with sync_playwright() as p:
            # Connect to existing Chrome on Port 9222
            print("   - Connecting to Chrome (Port 9222)...")
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            
            # Find or Open Localhost
            page = None
            if context.pages:
                for p_obj in context.pages:
                    if "localhost:5173" in p_obj.url:
                        page = p_obj
                        break
            
            if not page:
                if context.pages:
                    page = context.pages[0]
                else:
                    page = context.new_page()
            
            # Navigate if needed
            if "localhost:5173" not in page.url:
                print(f"   - Redirecting {page.url} to Localhost...")
                page.goto("http://localhost:5173")
            else:
                print("   - Refreshing Target...")
                page.reload()

            # Execute Visual Injection
            page.evaluate(js_overlay)
            page.bring_to_front()
            
            print(f"✅ CONTROL ESTABLISHED: {page.title()}")
            print("   - Visual Overlay: ACTIVE")

    except Exception as e:
        print(f"❌ BRIDGE FAILURE: {e}")
        print("   - Ensure 'python core_launcher.py' is running.")

if __name__ == "__main__":
    run()
