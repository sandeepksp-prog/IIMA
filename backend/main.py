import os
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize Firebase Admin
cred_path = os.path.join(os.path.dirname(__file__), "service_account_key.json")
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase Admin Initialized (Backend)")
else:
    print("⚠️ WARNING: service_account_key.json not found. Database features will fail.")
    db = None

# 2. Setup FastAPI
app = FastAPI(title="CAT Agentic Brain")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Routes
@app.get("/health")
async def health_check():
    return {"status": "Brain Online", "database": "Connected" if db else "Disconnected"}

class Query(BaseModel):
    query: str

@app.post("/api/generate")
async def generate_response(q: Query):
    # Placeholder for Agentic Logic
    return {
        "response": f"Agent Received: {q.query}. Logic Core not yet fully linked.",
        "metadata": {"source": "Titan Backend"}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
