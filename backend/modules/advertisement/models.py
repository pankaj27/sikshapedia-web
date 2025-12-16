from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class Advertisement(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    title: str
    status: str = 'draft'  # draft, active, paused, expired
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    position: str = 'sidebar'  # top, content-top, content-middle, content-bottom, sidebar, popup, floating
    pages: List[str] = []  # Target pages
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    priority: int = 0
    impressions: int = 0
    clicks: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
