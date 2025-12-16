from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class Exam(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    name: str
    slug: str
    status: str = 'draft'
    description: Optional[str] = None
    conducting_body: Optional[str] = None
    exam_level: Optional[str] = None  # National, State, University
    exam_mode: Optional[str] = None  # Online, Offline, Both
    exam_duration: Optional[str] = None
    registration_start: Optional[str] = None
    registration_end: Optional[str] = None
    exam_date: Optional[str] = None
    result_date: Optional[str] = None
    eligibility: Optional[str] = None
    syllabus: List[Dict[str, Any]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
