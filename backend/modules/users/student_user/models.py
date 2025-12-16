from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class StudentUser(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    email: str
    name: str
    role: str = 'user'
    status: str = 'active'  # active, suspended
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    education_level: Optional[str] = None
    preferred_stream: Optional[str] = None
    preferred_city: Optional[str] = None
    saved_colleges: List[str] = []
    applied_colleges: List[str] = []
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
