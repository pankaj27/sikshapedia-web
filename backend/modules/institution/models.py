from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class College(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    id: str
    name: str
    slug: str
    institution_type: str = 'College'  # College, School, University
    type: Optional[str] = None
    description: Optional[str] = None
    established_year: Optional[int] = None
    
    # Status
    status: str = 'draft'  # draft, published
    is_verified: bool = False
    is_preferred: bool = False
    is_featured: bool = False
    is_trending: bool = False
    is_top_rated: bool = False
    is_sponsored: bool = False
    is_admission_open: bool = False
    admission_deadline: Optional[str] = None
    badge_text: Optional[str] = None
    
    # Location
    location: Optional[Dict[str, Any]] = None
    
    # Contact
    contact_info: Optional[Dict[str, Any]] = None
    
    # Rankings & Ratings
    nirf_ranking: Optional[int] = None
    rating: float = 0.0
    total_reviews: int = 0
    
    # Fees & Courses
    average_fees: Optional[float] = None
    courses: List[Dict[str, Any]] = []
    
    # Media
    logo: Optional[str] = None
    banner_image: Optional[str] = None
    gallery: List[str] = []
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    
    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CollegeCreate(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    name: str
    slug: Optional[str] = None
    institution_type: str = 'College'
    type: Optional[str] = None
    description: Optional[str] = None
    status: str = 'draft'
