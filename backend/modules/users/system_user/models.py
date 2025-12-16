from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class SystemUser(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    email: str
    name: str
    role: str = 'admin'  # admin, super_admin, moderator
    status: str = 'active'  # active, suspended
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    permissions: List[str] = []  # Full permissions for admin
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
