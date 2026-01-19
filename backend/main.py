import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load Environment
load_dotenv()

# Initialize Brain
app = FastAPI(title="CAT Agentic Brain", version="1.0.0")

# CORS - Allow Frontend Access
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class AgentRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    metadata: Dict[str, Any]

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """
    Heartbeat signal for the engine.
    """
    return {
        "status": "Brain Online", 
        "mode": "Local",
        "services": {
            "database": "Supabase (Pending)",
            "llm": "LangChain (Ready)"
        }
    }

@app.post("/api/generate", response_model=AgentResponse)
async def generate_response(request: AgentRequest):
    """
    Placeholder for the LangGraph Agent Orchestrator.
    Currently returns a static 'Agentic' response.
    """
    # TODO: Connect to LangGraph Supervisor Node
    print(f"Received Query: {request.query}")
    
    dummy_response = (
        f"Thinking process initialized... User asked: '{request.query}'. "
        "Routing to [Mock Generator Agent]. Response: This is a simulated intelligent response from the Agentic Core."
    )
    
    return AgentResponse(
        response=dummy_response,
        metadata={
            "agent": "Supervisor",
            "confidence": 0.99,
            "latency": "12ms"
        }
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
