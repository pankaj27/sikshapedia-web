from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class InstitutionUser(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    email: str
    name: str
    role: str = 'institution'
    status: str = 'pending'  # pending, active, suspended
    institution_id: Optional[str] = None
    institution_name: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    permissions: List[str] = []
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
