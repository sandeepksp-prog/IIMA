import os

# AI ROLE ASSIGNMENTS
# Strategy: Unified Groq Stack (Speed + Context + Logic)
# Reason: HF Inference API instability.

AI_CONFIG = {
    "SPEED_LAYER": {
        "role": "Interface & Quick Logic",
        "provider": "groq",
        "model": "llama-3.3-70b-versatile",
        "api_key_env": "GROQ_API_KEY",
        "latency_target_ms": 200
    },
    "DEEP_LAYER": {
        "role": "Context Eater & Pattern Decoder",
        "provider": "groq",
        "model": "mixtral-8x7b-32768", # 32k Context Window
        "api_key_env": "GROQ_API_KEY",
        "chunk_strategy": "recursive_30k"
    },
    "HANDS_LAYER": {
        "role": "Autonomous Engineer",
        "provider": "local",
        "tool": "open-interpreter",
        "capabilities": ["file_system", "web_scraping", "testing"]
    },
    "CRITIC_LAYER": {
        "role": "Quality Gate & Hallucination Check",
        "provider": "groq", # Fallback to Groq for reliability
        "model": "llama-3.1-8b-instant",
        "api_key_env": "GROQ_API_KEY"
    }
}

def get_model_config(layer_name):
    return AI_CONFIG.get(layer_name, AI_CONFIG["SPEED_LAYER"])
