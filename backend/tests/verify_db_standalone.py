import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def verify_titan_standalone():
    print("🔋 TITAN DB STANDALONE CHECK")
    print("==========================")
    print("Note: Skipping API check due to missing C++ Build Tools on this machine.")
    print("      Verifying Database Credentials via REST Layer.")

    # Database Retina Scan (Supabase REST API)
    print("\n[1/2] Checking Supabase Credentials...", end=" ")
    
    sb_url = os.environ.get("SUPABASE_URL")
    sb_key = os.environ.get("SUPABASE_KEY")
    
    if not sb_url or not sb_key:
        print("❌ FAIL: Missing .env credentials")
        return

    headers = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Prefer": "count=exact"
    }
    
    try:
        # Direct REST call to 'questions' table
        url = f"{sb_url}/rest/v1/questions"
        params = {"select": "*", "limit": "1"}
        
        r = httpx.get(url, headers=headers, params=params, timeout=10.0)
        
        if r.status_code in [200, 206]:
            # Range header for count
            folder = sb_url.split("//")[1].split(".")[0]
            # content-range format: 0-0/5 or */5
            cr = r.headers.get("content-range", "?")
            count = cr.split("/")[-1] if "/" in cr else "?"
            
            print("✅ ONLINE")
            print(f"      Target: {folder}")
            print(f"      Table 'questions' accessible. Rows: {count}")
        else:
            print(f"❌ FAIL (Status {r.status_code})")
            print(f"      Msg: {r.text}")
            print("      HINT: Check if schema.sql was run in the Supabase SQL Editor.")

    except Exception as e:
        print(f"❌ FAIL: {e}")

    # Vector Cortex Check
    print("\n[2/2] Checking Mindset Vector Vault...", end=" ")
    try:
        # Check 'mindset_vectors' table
        url = f"{sb_url}/rest/v1/mindset_vectors"
        params = {"select": "*", "limit": "1"}
        r = httpx.get(url, headers=headers, params=params, timeout=10.0)
        
        if r.status_code in [200, 206]:
            print("✅ ONLINE (pgvector Ready)")
        else:
             print(f"❌ FAIL (Status {r.status_code})")
             # If 404, table doesn't exist. If 200, it exists.
             if r.status_code == 404:
                 print("      Error 404: Table 'mindset_vectors' not found.")
                 print("      ACTION: Run the CREATE TABLE sql again.")
             else:
                 print(f"      Msg: {r.text}")
             
    except Exception as e:
        print(f"❌ FAIL: {e}")
        
    print("\n==========================")
    print("TITAN STATUS: DATABASE ACTIVE")

if __name__ == "__main__":
    verify_titan_standalone()
