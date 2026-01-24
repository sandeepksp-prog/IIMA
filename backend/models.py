from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

class Tag(BaseModel):
    id: uuid.UUID
    name: str
    parent_id: Optional[uuid.UUID] = None

class Question(BaseModel):
    id: uuid.UUID
    content: str
    options: List[str]  # JSONB in DB
    correct_option: str
    difficulty: str

class QuestionTag(BaseModel):
    question_id: uuid.UUID
    tag_id: uuid.UUID
    weight: float

class UserAttempt(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    question_id: uuid.UUID
    selected_option: Optional[str]
    is_correct: bool
    time_spent_seconds: int
    attempted_at: datetime
