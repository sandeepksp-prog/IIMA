import os
import sys
import time
import httpx
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv()

def verify_ai_cortex():
    print("🧠 TITAN AI CORTEX CHECK")
    print("========================")

    # 1. GROQ CHECK (Speed Layer)
    print("[1/2] Testing Speed Layer (Groq)...", end=" ")
    groq_key = os.environ.get("GROQ_API_KEY")
    if not groq_key:
        print("❌ FAIL: Missing GROQ_API_KEY")
    else:
        try:
            start = time.time()
            # Direct REST call to Groq
            headers = {
                "Authorization": f"Bearer {groq_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile", # UPDATED MODEL
                "messages": [{"role": "user", "content": "Ping"}],
                "max_tokens": 10
            }
            r = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=10.0)
            
            if r.status_code == 200:
                latency = (time.time() - start) * 1000
                print(f"✅ ONLINE ({latency:.0f}ms)")
                print(f"      Response: {r.json()['choices'][0]['message']['content']}")
            else:
                print(f"❌ FAIL (Status {r.status_code})")
                print(f"      Msg: {r.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

    # 2. CRITIC LAYER CHECK (Groq 8B)
    print("\n[2/2] Testing Critic Layer (Groq 8B)...", end=" ")
    groq_key = os.environ.get("GROQ_API_KEY")
    if not groq_key:
        print("❌ FAIL: Missing GROQ_API_KEY")
    else:
        try:
            # Direct REST call to Groq
            headers = {
                "Authorization": f"Bearer {groq_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.1-8b-instant", # Critic Model
                "messages": [{"role": "system", "content": "You are a Critic."}, {"role": "user", "content": "Rate: 5/5"}],
                "max_tokens": 10
            }
            r = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=10.0)
            
            if r.status_code == 200:
                print("✅ ONLINE")
                print(f"      Response: {r.json()['choices'][0]['message']['content']}")
            else:
                print(f"❌ FAIL (Status {r.status_code})")
                print(f"      Msg: {r.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

    print("\n========================")
    print("AI SYSTEM STATUS: READY")

if __name__ == "__main__":
    verify_ai_cortex()
