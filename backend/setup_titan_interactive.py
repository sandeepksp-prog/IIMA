import os
import sys

# Try to import psycopg2, if not present, warn user
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

def setup_titan():
    print("🤖 TITAN PROTOCOL: INTERACTIVE BOOTSTRAP")
    print("=========================================")
    print("I need a few keys to activate the Neural Core.")

    # 1. Load existing .env
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    current_env = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line:
                    k, v = line.strip().split('=', 1)
                    current_env[k] = v

    # 2. Prompt for Missing Keys
    updates = {}
    
    # GROQ
    if not current_env.get('GROQ_API_KEY'):
        print("\n[AI] Enter GROQ_API_KEY (for Speed Layer):")
        val = input("> ").strip()
        if val: updates['GROQ_API_KEY'] = val

    # HF
    if not current_env.get('HUGGINGFACE_API_KEY'):
        print("\n[AI] Enter HUGGINGFACE_API_KEY (for Critic Layer):")
        val = input("> ").strip()
        if val: updates['HUGGINGFACE_API_KEY'] = val

    # DB PASSWORD (For Schema Migration)
    db_password = None
    print("\n[DB] Enter Supabase DB Password (to run Schema Migration):")
    print("     (Leave empty if you already ran schema.sql manually)")
    val = input("> ").strip()
    if val: db_password = val

    # 3. Update .env
    if updates:
        print("\n📝 Updating .env...")
        with open(env_path, 'a') as f:
            f.write("\n")
            for k, v in updates.items():
                f.write(f"{k}={v}\n")
                current_env[k] = v # Update local dict
        print("✅ Credentials Saved.")

    # 4. Attempt Schema Migration (The Hands)
    if db_password and HAS_POSTGRES:
        print("\n🛠️ Attempting Database Migration...")
        # Construct Postgres Connection String
        # URL format: https://[project_ref].supabase.co
        project_ref = current_env.get('SUPABASE_URL', '').split('//')[1].split('.')[0]
        # Standard Supabase connection string: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
        # Region usually 'us-east-1' or similar, but the host alias is often `db.[ref].supabase.co`
        
        # TRY HOST: db.[ref].supabase.co
        host = f"db.{project_ref}.supabase.co"
        conn_str = f"postgresql://postgres:{db_password}@{host}:5432/postgres"
        
        try:
            conn = psycopg2.connect(conn_str)
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            
            # Read Schema
            schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
            with open(schema_path, 'r') as f:
                 sql = f.read()
            
            print(f"   Executing SQL from {schema_path}...")
            cursor.execute(sql)
            print("✅ MIGRATION SUCCESSFUL! Tables Created.")
            conn.close()
            
        except Exception as e:
            print(f"❌ MIGRATION FAILED: {e}")
            print("   (You may need to run schema.sql manually in the Supabase Dashboard)")
    elif db_password and not HAS_POSTGRES:
        print("\n❌ Missing 'psycopg2'. Run: pip install psycopg2-binary")
    
    print("\n✅ TITAN SETUP COMPLETE. Run 'python backend/tests/verify_titan.py' to confirm.")

if __name__ == "__main__":
    setup_titan()
