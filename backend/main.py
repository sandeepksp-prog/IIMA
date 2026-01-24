from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analytics

app = FastAPI(title="Cat Agentic Engine API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Frontend Dev Server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "cat-agentic-engine-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
