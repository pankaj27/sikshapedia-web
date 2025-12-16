from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class Course(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    name: str
    slug: str
    status: str = 'draft'
    description: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None  # UG, PG, Diploma, etc.
    stream: Optional[str] = None
    eligibility: Optional[str] = None
    average_fees: Optional[float] = None
    colleges_count: int = 0
    career_prospects: List[str] = []
    syllabus: List[Dict[str, Any]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CourseCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    status: str = 'draft'
    description: Optional[str] = None
