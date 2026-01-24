from fastapi import APIRouter, HTTPException, Query
from database import get_db
from models import Question, UserAttempt
from typing import List, Optional

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_metrics(user_id: str = "test-user"): # Defaults to test-user for now
    """
    Feeds the Main Dashboard:
    1. Global KPIs (Accuracy, Attempts, etc.)
    2. Heatmap Data (Tag Mastery)
    """
    admin_client = get_db()
    
    # 1. Fetch Tag Mastery from the SQL View
    # Note: 'user_tag_mastery' is a view we created in init_db.py
    try:
        response = admin_client.table("user_tag_mastery").select("*").eq("user_id", user_id).execute()
        mastery_data = response.data
    except Exception as e:
        # Fallback if DB not ready logic for dev flow
        print(f"DB Error: {e}")
        return {"error": "Database connectivity issue", "details": str(e)}

    # Calculate Global Aggregates from the granular view data
    total_attempts = sum(item['total_attempts'] for item in mastery_data)
    total_correct = sum(item['correct_count'] for item in mastery_data)
    global_accuracy = (total_correct / total_attempts * 100) if total_attempts > 0 else 0

    return {
        "global_kpis": {
            "accuracy": round(global_accuracy, 1),
            "total_attempts": total_attempts,
            "mastery_score": 0, # Placeholder logic
            "streak": 0 # Placeholder
        },
        "heatmap_data": mastery_data
    }

@router.get("/forensics")
def get_forensics_data(
    user_id: str = "test-user",
    granularity: str = Query("topic", enum=["topic", "sub_topic"])
):
    """
    Feeds the Forensics Engine:
    1. Scatter Plot (Accuracy vs Time/Volume)
    2. Weakness Zones
    """
    admin_client = get_db()

    # Fetch simple attempt log for scatter plot
    # In a real scenario, we might aggregate this by tag for the scatter plot bubbles
    try:
        response = admin_client.table("user_tag_mastery").select("*").eq("user_id", user_id).execute()
        tag_data = response.data
    except Exception as e:
         return {"error": "Database connectivity issue", "details": str(e)}

    scatter_points = []
    for item in tag_data:
        scatter_points.append({
            "x": item['total_attempts'],     # Volume
            "y": item['accuracy'],           # Accuracy
            "label": item['tag_name'],
            "z": item['correct_count']       # Size/Confidence
        })

    return {
        "scatter_plot": scatter_points,
        "raw_data": tag_data
    }
