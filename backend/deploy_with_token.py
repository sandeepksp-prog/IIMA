import os
import httpx
from dotenv import load_dotenv

load_dotenv()

def deploy_schema_via_api():
    print("🚀 TITAN DEPLOYMENT (Management API Mode)")
    print("=========================================")
    
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    project_url = os.environ.get("SUPABASE_URL", "")
    
    if not token or not project_url:
        print("❌ FAIL: Missing Access Token or URL in .env")
        return

    # Extract Project Ref from URL (https://[ref].supabase.co)
    project_ref = project_url.split("//")[1].split(".")[0]
    
    # Endpoint: POST https://api.supabase.com/v1/projects/{ref}/query
    # Note: Requires the P.A.T, not the Service Key.
    
    api_url = f"https://api.supabase.com/v1/projects/{project_ref}/query"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Read Schema
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    try:
        with open(schema_path, 'r') as f:
            sql_content = f.read()
    except Exception as e:
        print(f"❌ FAIL: Could not read schema.sql: {e}")
        return

    payload = {
        "query": sql_content
    }
    
    print(f"   Target Project: {project_ref}")
    print("   Sending Schema to Management API...")
    
    try:
        # Using a longer timeout as creating extensions/tables might take a sec
        r = httpx.post(api_url, headers=headers, json=payload, timeout=30.0)
        
        if r.status_code == 200 or r.status_code == 201:
            print("✅ SUCCESS: Schema Applied.")
            print(f"   Response: {r.json()}")
        else:
            print(f"❌ FAIL (Status {r.status_code})")
            print(f"   Msg: {r.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    deploy_schema_via_api()
