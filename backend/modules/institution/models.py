from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class College(BaseModel):
    """
    Flexible College model that handles both legacy and new data formats.
    Uses 'extra=allow' to accept any additional fields from the database.
    """
    model_config = ConfigDict(extra='allow')
    
    id: str
    name: str
    slug: Optional[str] = None  # Made optional for legacy data
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
    
    # Fees & Courses - flexible type to handle both List[str] and List[Dict]
    average_fees: Optional[float] = None
    courses: Optional[List[Any]] = []  # Accept any list format
    
    # Media
    logo: Optional[str] = None
    banner_image: Optional[str] = None
    gallery: Optional[List[str]] = []
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    
    # Timestamps
    created_at: Optional[Any] = None  # Accept both datetime and string
    updated_at: Optional[Any] = None
    
    @field_validator('courses', mode='before')
    @classmethod
    def convert_courses(cls, v):
        """Handle both List[str] and List[Dict] formats"""
        if v is None:
            return []
        return v

class CollegeCreate(BaseModel):
    model_config = ConfigDict(extra='allow')
    
    name: str
    slug: Optional[str] = None
    institution_type: str = 'College'
    type: Optional[str] = None
    description: Optional[str] = None
    status: str = 'draft'
