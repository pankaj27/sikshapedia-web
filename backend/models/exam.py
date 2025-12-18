"""Exam-related Pydantic models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime, timezone
import uuid


class Exam(BaseModel):
    """Quick entry exam model for listing pages"""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    full_name: Optional[str] = None
    description: Optional[str] = None
    conducting_body: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    exam_level: Optional[str] = None
    exam_type: Optional[str] = None
    streams: List[str] = []
    
    # Exam Details
    exam_mode: Optional[str] = None
    exam_duration: Optional[str] = None
    total_marks: Optional[int] = None
    num_questions: Optional[int] = None
    exam_pattern: Optional[Dict] = None
    syllabus: Optional[str] = None
    
    # Important Dates
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    exam_date: Optional[str] = None
    result_date: Optional[str] = None
    counseling_date: Optional[str] = None
    
    # Eligibility
    eligibility: Optional[Dict] = None
    age_limit: Optional[str] = None
    
    # Fees & Cutoffs
    application_fee: Optional[Dict] = None
    previous_year_cutoffs: List[Dict] = []
    
    # Study Materials
    study_materials: List[Dict] = []
    sample_papers: List[Dict] = []
    important_topics: List[str] = []
    
    # Stats
    total_applicants: Optional[int] = None
    total_seats: Optional[int] = None
    difficulty_level: Optional[str] = None
    
    # Related
    accepting_colleges: List[str] = []
    official_website: Optional[str] = None
    
    # Approval Status
    status: str = "draft"
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None
    approved_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ExamCreate(BaseModel):
    """Model for creating a new exam"""
    name: str
    slug: str
    full_name: str
    description: str
    conducting_body: str
    exam_level: str
    exam_type: str
    streams: List[str]
    exam_mode: str
    exam_duration: str
    total_marks: int
    num_questions: int
    exam_pattern: Dict
    eligibility: Dict
    application_fee: Dict


class ExamDetailedWidget(BaseModel):
    """Widget configuration for exam detail page sidebar"""
    enabled: bool = True
    title: Optional[str] = None
    subtitle: Optional[str] = None
    items: List[Dict] = []
    files: List[Dict] = []


class ExamDetailedWidgets(BaseModel):
    """All widgets for a menu item or page"""
    quick_facts: Optional[ExamDetailedWidget] = None
    quick_nav: Optional[ExamDetailedWidget] = None
    contact_cta: Optional[ExamDetailedWidget] = None
    related_exams: Optional[ExamDetailedWidget] = None
    download_widget: Optional[ExamDetailedWidget] = None


class ExamDetailedMenuItem(BaseModel):
    """Menu item with full content support"""
    id: str
    label: str
    enabled: bool = True
    page_heading: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    content: Optional[str] = None
    toc: List[Dict] = []
    tables: List[Dict] = []
    images: List[Dict] = []
    videos: List[Dict] = []
    faqs: List[Dict] = []
    widgets: Optional[ExamDetailedWidgets] = None


class ExamDetailedMenuConfig(BaseModel):
    """Menu configuration with items"""
    items: List[ExamDetailedMenuItem] = []


class ExamDetailed(BaseModel):
    """Comprehensive exam model for detailed entry form"""
    model_config = ConfigDict(extra="allow")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    full_name: Optional[str] = None
    description: Optional[str] = None
    conducting_body: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    exam_level: Optional[str] = None
    exam_type: Optional[str] = None
    streams: List[str] = []
    
    # Basic Exam Details
    exam_mode: Optional[str] = None
    exam_duration: Optional[str] = None
    total_marks: Optional[int] = None
    num_questions: Optional[int] = None
    exam_pattern: Optional[Dict] = None
    syllabus: Optional[str] = None
    
    # Important Dates
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    exam_date: Optional[str] = None
    result_date: Optional[str] = None
    counseling_date: Optional[str] = None
    
    # Eligibility & Fees
    eligibility: Optional[Dict] = None
    age_limit: Optional[str] = None
    application_fee: Optional[Dict] = None
    previous_year_cutoffs: List[Dict] = []
    
    # Study Materials
    study_materials: List[Dict] = []
    sample_papers: List[Dict] = []
    important_topics: List[str] = []
    
    # Stats
    total_applicants: Optional[int] = None
    total_seats: Optional[int] = None
    difficulty_level: Optional[str] = None
    
    # Related
    accepting_colleges: List[str] = []
    official_website: Optional[str] = None
    
    # Exam Logo & Media
    logo_url: Optional[str] = None
    content_images: List[Dict] = []
    content_videos: List[Dict] = []
    
    # Question Papers
    question_papers: List[Dict] = []
    
    # SEO Fields
    seo_toc: List[Dict] = []
    seo_tables: List[Dict] = []
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    
    # Menu Configuration
    menu_config: Optional[ExamDetailedMenuConfig] = None
    
    # SEO Content Fields
    seo_intro: Optional[str] = None
    seo_full_content: Optional[str] = None
    seo_images: List[Dict] = []
    seo_video_url: Optional[str] = None
    seo_video_title: Optional[str] = None
    seo_video_description: Optional[str] = None
    seo_faqs: List[Dict] = []
    
    # Popular & Featured
    is_popular: bool = False
    is_featured: bool = False
    popular_order: int = 0
    
    # Key Summary
    key_summary: List[str] = []
    
    # Approval Status
    status: str = "draft"
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None
    approved_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
