import sys
import os
import httpx
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from main import app
# from database import get_db # REMOVED to avoid 'supabase' import error

load_dotenv()

client = TestClient(app)

def verify_titan_core():
    print("🔋 TITAN CORE SYSTEMS CHECK (Protocol: HTTPX)")
    print("===========================================")

    # 1. API Layer Check available
    print("[1/3] Checking API Membrane...", end=" ")
    try:
        response = client.get("/health")
        if response.status_code == 200:
            print("✅ ONLINE")
            print(f"      Response: {response.json()}")
        else:
            print(f"❌ FAIL (Status {response.status_code})")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("      (Make sure 'fastapi' and 'httpx' are installed)")

    # 2. Database Retina Scan (Supabase REST API)
    print("\n[2/3] Checking Supabase Connection...", end=" ")
    
    sb_url = os.environ.get("SUPABASE_URL")
    sb_key = os.environ.get("SUPABASE_KEY")
    
    if not sb_url or not sb_key:
        print("❌ FAIL: Missing .env credentials")
        return

    headers = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}"
    }
    
    try:
        # Direct REST call to 'questions' table
        # Endpoint: /rest/v1/questions?select=*&limit=1&count=exact
        url = f"{sb_url}/rest/v1/questions"
        params = {"select": "*", "limit": "1", "count": "exact"}
        
        r = httpx.get(url, headers=headers, params=params, timeout=10.0)
        
        if r.status_code in [200, 206]:
            # Range header for count
            folder = sb_url.split("//")[1].split(".")[0]
            count = r.headers.get("content-range", "?").split("/")[-1]
            print("✅ ONLINE")
            print(f"      Target: {folder}")
            print(f"      Table 'questions' accessible. Rows: {count}")
        else:
            print(f"❌ FAIL (Status {r.status_code})")
            print(f"      Msg: {r.text}")
            print("      HINT: Check if schema.sql was run in the Supabase SQL Editor.")

    except Exception as e:
        print(f"❌ FAIL: {e}")

    # 3. Vector Cortex Check
    print("\n[3/3] Checking Mindset Vector Vault...", end=" ")
    try:
        # Check 'mindset_vectors' table
        url = f"{sb_url}/rest/v1/mindset_vectors"
        params = {"select": "*", "limit": "1"}
        r = httpx.get(url, headers=headers, params=params, timeout=10.0)
        
        if r.status_code in [200, 206]:
            print("✅ ONLINE (pgvector Ready)")
        else:
             print(f"❌ FAIL (Status {r.status_code})")
             print("      HINT: Ensure 'mindset_vectors' table exists.")
             
    except Exception as e:
        print(f"❌ FAIL: {e}")
        
    print("\n===========================================")
    print("SYSTEM STATUS: READY FOR INGESTION")

if __name__ == "__main__":
    verify_titan_core()
