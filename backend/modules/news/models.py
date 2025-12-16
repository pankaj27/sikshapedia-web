from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class News(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    title: str
    slug: str
    status: str = 'draft'
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    featured_image: Optional[str] = None
    author: Optional[str] = None
    views: int = 0
    is_featured: bool = False
    published_date: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
