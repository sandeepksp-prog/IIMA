import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

def attempt_migration(password):
    print(f"🕵️ TITAN MIGRATION PROBE (Password: {password})")
    
    # Construct Connection String
    # Host format: db.[project_ref].supabase.co
    project_ref = os.environ.get('SUPABASE_URL', '').split('//')[1].split('.')[0]
    host = f"db.{project_ref}.supabase.co"
    user = "postgres"
    dbname = "postgres"
    
    conn_str = f"postgresql://{user}:{password}@{host}:5432/{dbname}"
    
    try:
        print(f"   Connecting to {host}...")
        conn = psycopg2.connect(conn_str, connect_timeout=10)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Read Schema
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
                sql = f.read()
        
        print(f"   Applying Schema...")
        cursor.execute(sql)
        print("✅ SUCCESS: Tables Created.")
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False

if __name__ == "__main__":
    # Candidate password passed as arg or hardcoded for the test
    candidate = sys.argv[1] if len(sys.argv) > 1 else "IIM2026"
    success = attempt_migration(candidate)
    if not success:
        sys.exit(1)
