from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, Request, UploadFile, File, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime, timezone, timedelta

# Fix bcrypt/passlib compatibility issue - must be before passlib import
import bcrypt
if not hasattr(bcrypt, "__about__"):
    class _about:
        __version__ = bcrypt.__version__
    bcrypt.__about__ = _about

import jwt
from passlib.context import CryptContext
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import shutil
from PIL import Image
import io
import asyncio

# Resend Email
import resend

# Twilio WhatsApp
from twilio.rest import Client as TwilioClient

# Import modular architecture
import sys
sys.path.insert(0, str(Path(__file__).parent))

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Stripe Configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# Fixed subscription packages - NEVER accept amounts from frontend
SUBSCRIPTION_PACKAGES = {
    "premium-monthly": {"amount": 299.0, "name": "Premium Monthly", "duration_days": 30},
    "premium-yearly": {"amount": 2999.0, "name": "Premium Yearly", "duration_days": 365}
}

# Resend Email Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER', '')
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception as e:
        logging.error(f"Failed to initialize Twilio client: {e}")

# Create the main app
app = FastAPI(title="Sikshapedia API", version="2.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ============================================
# Models
# ============================================

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "student"
    profile_photo: Optional[str] = None  # URL to profile photo
    job_title: Optional[str] = None  # User's job title/designation
    bio: Optional[str] = None  # Short bio/description
    saved_colleges: List[str] = []
    total_earnings: float = 0.0  # Total earnings from reviews and referrals
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    referral_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# College Models
class PlacementStats(BaseModel):
    year: int
    highest_package: float
    average_package: float
    median_package: float
    total_offers: int
    companies_participated: int
    top_recruiters: List[str] = []

class Cutoff(BaseModel):
    year: int
    exam_name: str
    round: str
    category: str
    opening_rank: int
    closing_rank: int

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    degree_type: str
    duration: str
    description: Optional[str] = None
    stream: Optional[str] = None  # Engineering, Medical, Arts, etc.
    full_name: Optional[str] = None
    slug: Optional[str] = None
    fees: Optional[float] = None
    total_fees: Optional[float] = None
    average_fees: Optional[float] = None
    eligibility: Optional[str] = None
    exams_accepted: List[str] = []  # List of exam names accepted for admission
    cutoffs: List[Cutoff] = []

class Faculty(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    designation: str
    department: str
    qualification: str
    experience: Optional[int] = None
    specialization: Optional[str] = None

class Scholarship(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    scholarship_type: Optional[str] = None
    education_level: Optional[str] = None
    provider: Optional[str] = None
    provider_type: Optional[str] = None
    amount: Optional[str] = None
    amount_type: Optional[str] = None
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    short_description: Optional[str] = None
    
    # Eligibility
    min_percentage: Optional[str] = None
    max_family_income: Optional[str] = None
    age_limit: Optional[str] = None
    gender: Optional[str] = None
    eligibility_criteria: List[str] = []
    documents_required: List[str] = []
    category: List[str] = []
    states: List[str] = []
    courses_applicable: List[str] = []
    
    # Media
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None
    provider_logo: Optional[str] = None
    gallery_images: List[str] = []
    
    # Content
    content: Optional[str] = None
    benefits: List[str] = []
    application_process: Optional[str] = None
    selection_process: Optional[str] = None
    
    # TOC & Tables
    toc_enabled: bool = False
    toc_items: List[Dict] = []
    tables: List[Dict] = []
    
    # Contact & Links
    official_website: Optional[str] = None
    application_link: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    auto_generate_seo: bool = True
    schema_type: Optional[str] = "Scholarship"
    
    # Status
    is_active: bool = True
    is_featured: bool = False
    views: int = 0
    applications: int = 0
    
    # FAQs
    faqs: List[Dict] = []
    
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Legacy fields for backward compatibility
    eligibility: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    requirements: List[str] = []
    website: Optional[str] = None

# Exam Models
class Exam(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    full_name: Optional[str] = None
    description: Optional[str] = None
    conducting_body: Optional[str] = None
    type: Optional[str] = None  # Entrance, Eligibility - Short field name
    level: Optional[str] = None  # National, State, University - Short field name
    exam_level: Optional[str] = None  # National, State, University - Alias for level
    exam_type: Optional[str] = None  # Entrance, Eligibility - Alias for type
    streams: List[str] = []  # Engineering, Medical, Management, etc.
    
    # Display Priority for listing pages (lower number = appears first, 0 = default)
    display_priority: int = 0
    
    # Exam Details
    exam_mode: Optional[str] = None  # Online, Offline, Both
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
    application_fee: Optional[Dict] = None  # General, OBC, SC/ST
    previous_year_cutoffs: List[Dict] = []
    
    # Study Materials
    study_materials: List[Dict] = []  # name, type, url
    sample_papers: List[Dict] = []
    important_topics: List[str] = []
    
    # Stats
    total_applicants: Optional[int] = None
    total_seats: Optional[int] = None
    difficulty_level: Optional[str] = None
    
    # Related
    accepting_colleges: List[str] = []  # College IDs
    official_website: Optional[str] = None
    
    # Approval Status
    status: str = "draft"  # draft, pending, published, rejected
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None
    approved_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExamCreate(BaseModel):
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

# Exam Detailed Model (for comprehensive exam entry form)
class ExamDetailedWidget(BaseModel):
    model_config = ConfigDict(extra="allow")
    enabled: bool = True
    title: Optional[str] = None
    subtitle: Optional[str] = None
    exams: Optional[List[Dict]] = []
    files: Optional[List[Dict]] = []

class ExamDetailedWidgets(BaseModel):
    model_config = ConfigDict(extra="allow")
    quick_facts: Optional[ExamDetailedWidget] = None
    quick_nav: Optional[ExamDetailedWidget] = None
    contact_cta: Optional[ExamDetailedWidget] = None
    related_exams: Optional[ExamDetailedWidget] = None
    download_widget: Optional[ExamDetailedWidget] = None

class ExamDetailedMenuItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str
    label: str
    icon: Optional[str] = None
    enabled: bool = True
    order: int = 0
    content: Optional[str] = ""
    page_heading: Optional[str] = ""
    meta_title: Optional[str] = ""
    meta_description: Optional[str] = ""
    toc: Optional[List[Dict]] = []  # [{title, anchor, content}]
    tables: Optional[List[Dict]] = []  # [{title, headers, rows}]
    images: Optional[List[Dict]] = []  # [{url, title, alt, caption}]
    videos: Optional[List[Dict]] = []  # [{url, title, description, alt}]
    faqs: Optional[List[Dict]] = []  # [{question, answer}]
    widgets: Optional[ExamDetailedWidgets] = None

class ExamDetailedMenuConfig(BaseModel):
    model_config = ConfigDict(extra="allow")
    use_custom_menu: bool = False
    auto_from_toc: bool = True
    items: List[ExamDetailedMenuItem] = []

class ExamDetailed(BaseModel):
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
    
    # ========== NEW FIELDS ==========
    # Exam Logo
    logo_url: Optional[str] = None
    
    # Content Images & Videos (for main content area)
    content_images: List[Dict] = []  # [{url, title, alt}]
    content_videos: List[Dict] = []  # [{url, title, description}]
    
    # Question Papers
    question_papers: List[Dict] = []  # [{year, name, file_url, external_link}]
    
    # SEO Fields (Page Level)
    seo_toc: List[Dict] = []  # [{title, anchor}]
    seo_tables: List[Dict] = []  # Full table data [{title, headers, rows}]
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    
    # Menu Configuration (with nested content)
    menu_config: Optional[ExamDetailedMenuConfig] = None
    
    # Popular & Featured
    is_popular: bool = False  # Mark as popular exam
    is_featured: bool = False  # Featured on homepage
    popular_order: int = 0  # Order in popular list (lower = higher priority)
    
    # Key Summary (editable bullet points)
    key_summary: List[str] = []  # Custom key highlights/summary points
    
    # Approval Status
    status: str = "draft"
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None
    approved_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

# Course Models (Enhanced)
class CourseDetail(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    full_name: str
    description: str
    degree_type: str  # UG, PG, Diploma, Certificate
    stream: str  # Engineering, Medical, Management, etc.
    sub_stream: Optional[str] = None
    
    # Duration & Fees
    duration: str
    average_fees: float
    fee_range: Optional[Dict] = None  # min, max
    
    # Eligibility
    eligibility: Optional[str] = None
    eligibility_level: str = "after-12th"  # after-10th, after-12th, after-graduation, professional
    course_mode: str = "Full Time"  # Full Time, Part Time, Distance, Online
    entrance_exams: List[str] = []  # Exam IDs
    
    # Curriculum
    syllabus: Optional[List[Dict]] = []  # [{semester: str, subjects: [str]}]
    subjects: List[str] = []
    specializations: List[str] = []
    
    # Highlights & Related
    highlights: Optional[List[str]] = []  # Course badges/highlights
    related_courses: Optional[List[str]] = []  # Related course names
    
    # Top Colleges & Age Limit
    top_colleges: Optional[List[Dict]] = []  # [{name, location, rating, fees, rank}]
    age_limit: Optional[str] = None  # Age limit text
    
    # Career
    career_options: List[str] = []
    average_salary: Optional[float] = None
    top_recruiters: List[str] = []
    
    # Colleges Offering
    total_colleges: int = 0
    
    # Stats
    popularity_score: int = 0
    difficulty_level: Optional[str] = None
    
    # Approval Status
    status: str = "draft"  # draft, pending, published, rejected
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None
    approved_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CourseDetailCreate(BaseModel):
    name: str
    slug: str
    full_name: str
    description: str
    degree_type: str
    stream: str
    duration: str
    average_fees: float
    eligibility: str
    entrance_exams: List[str]
    career_options: List[str]

# Application/Inquiry Models (Enhanced)
class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    college_id: str
    course_id: str
    
    # Student Info
    student_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    category: str  # General, OBC, SC, ST
    
    # Academic Info
    class_10_percentage: float
    class_12_percentage: float
    entrance_exam: Optional[str] = None
    entrance_exam_score: Optional[float] = None
    
    # Application Status
    status: str = "submitted"  # submitted, under_review, accepted, rejected
    application_number: str = Field(default_factory=lambda: f"APP{str(uuid.uuid4())[:8].upper()}")
    
    # Additional
    preferred_course: str
    message: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplicationCreate(BaseModel):
    college_id: str
    course_id: str
    student_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    category: str
    class_10_percentage: float
    class_12_percentage: float
    entrance_exam: Optional[str] = None
    entrance_exam_score: Optional[float] = None
    preferred_course: str
    message: Optional[str] = None

# Study Abroad Models
class StudyAbroadUniversity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    country: str
    city: str
    description: str
    ranking: Dict = {}
    programs: List[str] = []
    tuition_fees: Dict = {}  # Currency, min, max
    living_cost: Dict = {}
    application_deadline: Optional[str] = None
    application_fee: Optional[str] = None
    language_requirements: Dict = {}  # IELTS, TOEFL scores
    acceptance_rate: Optional[float] = None
    images: List[str] = []
    logo: Optional[str] = None
    website: Optional[str] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    auto_generate_seo: bool = True
    
    # Status
    is_featured: bool = False
    is_active: bool = True
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Scholarship Models
class ScholarshipProgram(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    provider: str
    description: str
    amount: str
    type: str  # Merit-based, Need-based, Sports, Research
    eligibility: str
    level: str  # UG, PG, PhD
    application_deadline: Optional[str] = None
    fields_of_study: List[str] = []
    countries: List[str] = []
    requirements: List[str] = []
    how_to_apply: str
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Loan Models
class LoanProvider(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # Bank, NBFC, Government
    description: str
    interest_rate: str
    max_amount: str
    loan_tenure: str
    processing_fee: str
    eligibility: str
    documents_required: List[str] = []
    special_features: List[str] = []
    website: Optional[str] = None
    contact: Dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Facility Models
class Facility(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    icon: str
    description: str
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Blog/Article Models
class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    author_id: str
    author_name: str
    category: str  # Admissions, Exams, Career, Study Tips, College Life
    tags: List[str] = []
    featured_image: Optional[str] = None
    views: int = 0
    likes: int = 0
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleCreate(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    category: str
    tags: List[str] = []
    featured_image: Optional[str] = None

class College(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    serial_number: Optional[int] = None  # Unique sequential number for URL (001, 002, etc.)
    location: Optional[Dict] = None
    established: Optional[str] = None
    established_year: Optional[int] = None
    type: Optional[str] = None  # Government, Private, Deemed
    affiliation: Optional[str] = None
    institution_type: Optional[str] = None  # College, School, University
    
    # Display Priority for listing pages (lower number = appears first, 0 = default/no priority)
    display_priority: int = 0  # National/India level priority
    state_priority: Dict[str, int] = {}  # State-wise priority e.g., {"Maharashtra": 1, "Karnataka": 2}
    city_priority: Dict[str, int] = {}  # City-wise priority e.g., {"Mumbai": 1, "Pune": 3}
    
    # Badges & Status
    status: str = "draft"  # draft, pending, published, rejected
    rejection_reason: Optional[str] = None  # Reason for rejection
    reviewed_by: Optional[str] = None  # ID of reviewer
    reviewed_by_name: Optional[str] = None  # Name of reviewer
    reviewed_at: Optional[datetime] = None  # When reviewed
    submitted_at: Optional[datetime] = None  # When submitted for review
    is_verified: bool = False  # Verified institution badge
    is_preferred: bool = False  # Preferred/Featured badge
    is_featured: bool = False  # Featured badge
    featured_at: Optional[datetime] = None  # When marked as featured (for priority sorting)
    featured_priority_months: int = 2  # How many months to keep priority (default 2)
    is_trending: bool = False  # Trending badge
    is_top_rated: bool = False  # Top rated badge
    is_sponsored: bool = False  # Sponsored badge
    is_admission_partner: bool = False  # Admission Partner badge
    is_no_cost_emi: bool = False  # No Cost EMI available badge
    is_admission_open: bool = False  # Admission open badge
    admission_open_at: Optional[datetime] = None  # When marked as admission open (for priority sorting)
    admission_open_priority_months: int = 2  # How many months to keep priority (default 2)
    admission_deadline: Optional[str] = None  # Admission deadline date
    badge_text: Optional[str] = None  # Custom badge text (e.g., "Top Ranked", "New")
    
    # Recognition & Affiliations
    recognized_by: List[str] = []  # UGC, AICTE, NBA, NAAC
    affiliated_to: Optional[str] = None
    board: Optional[str] = None  # For Schools: CBSE, ICSE, State Board, etc.
    memberships: List[str] = []  # AIU, ACU, IUAC
    
    # Rankings - Multiple agencies
    nirf_ranking: Optional[int] = None
    india_today_ranking: Optional[int] = None
    outlook_ranking: Optional[int] = None
    ranking: Optional[Dict] = None
    rankings: List = []  # Can be List[Dict] or empty
    
    # Fees & Courses
    average_fees: Optional[float] = None
    total_courses: Optional[int] = None
    courses: List = []  # Can be List[str] (legacy) or List[Dict] (new format)
    
    # Facilities & Infrastructure - Detailed
    facilities: List = []  # Can be List[str] (legacy) or List[Dict] (new format)
    hostel_info: Optional[Dict] = None
    campus_size: Optional[str] = None
    campus_images: List = []  # Can be List[str] (legacy) or List[Dict] with {url, alt} (new format)
    campus_video_url: Optional[str] = None
    campus_video_title: Optional[str] = None  # Video title for accessibility
    campus_video_description: Optional[str] = None  # Video description for accessibility
    
    # Contact & Media
    contact_info: Optional[Dict] = None
    contact: Optional[Dict] = None
    logo_url: Optional[str] = None  # Institution logo
    logo_title: Optional[str] = None  # Logo title for auto-generating alt text
    logo_alt: Optional[str] = None  # Logo alt text for SEO/accessibility
    banner_url: Optional[str] = None  # Institution banner
    banner_title: Optional[str] = None  # Banner title for auto-generating alt text
    banner_alt: Optional[str] = None  # Banner alt text for SEO/accessibility
    images: List[str] = []  # Additional images (legacy support)
    videos: List = []  # Can be List[str] (legacy) or List[Dict] with {url, title, description}
    brochure_url: Optional[str] = None
    virtual_tour_url: Optional[str] = None
    virtual_tour_title: Optional[str] = None  # Title for accessibility
    virtual_tour_description: Optional[str] = None  # Description for accessibility
    
    # Content
    description: Optional[str] = None
    description_tables: List = []  # [{title, headers: [], rows: [[]]}] Tables for description
    highlights: List[str] = []
    admission_process: Optional[str] = None
    admission_dates: Optional[Any] = None  # Can be List[Dict], Dict, or None
    
    # SEO Meta Tags for Search Visibility
    meta_title: Optional[str] = None  # Browser tab & search results (60 chars)
    meta_description: Optional[str] = None  # Search snippet (150-160 chars)
    meta_keywords: Optional[str] = None  # Comma-separated keywords
    og_title: Optional[str] = None  # Social media share title
    og_description: Optional[str] = None  # Social media share description
    og_image_url: Optional[str] = None  # Social share thumbnail
    canonical_url: Optional[str] = None  # Prevent duplicate content
    robots_meta: Optional[str] = "index, follow"  # Index control
    schema_type: Optional[str] = "EducationalOrganization"  # Rich snippets
    
    # SEO Content for Detail Page
    seo_intro: Optional[str] = None  # Short intro text (3-4 lines)
    seo_full_content: Optional[str] = None  # Full detailed content paragraphs
    seo_images: List = []  # [{url, title, alt, caption}] Images for SEO content
    seo_toc: List = []  # [{title, anchor, content}] Table of Contents for SEO content
    seo_tables: List = []  # [{title, headers: [], rows: [[]]}] Tables for SEO content
    seo_video_url: Optional[str] = None  # Embedded video URL
    
    # Detail Page TOC - Used for Auto Menu from TOC
    detail_page_toc: List = []  # [{title, anchor, content, icon}] TOC sections for detail page menu
    
    # Menu Configuration for Detail Page
    menu_config: Optional[Dict] = {
        "use_custom_menu": False,  # If false, use default menu
        "auto_from_toc": True,  # Auto-generate from detail_page_toc
        "items": []  # [{id, label, icon, enabled, order}]
    }
    seo_video_title: Optional[str] = None  # Video title for accessibility
    seo_video_description: Optional[str] = None  # Video description for accessibility
    seo_faqs: List = []  # [{ question, answer }]
    
    # Sidebar Widgets Configuration
    sidebar_widgets: Optional[Dict] = {
        # Quick Actions Widget
        "quick_actions": {
            "enabled": True,
            "apply_now_btn": True,
            "apply_now_url": "",
            "download_brochure_btn": True,
            "compare_btn": True,
            "enquiry_btn": True
        },
        # Quick Facts Widget
        "quick_facts": {
            "enabled": True,
            "show_established": True,
            "show_type": True,
            "show_approval": True,
            "show_student_count": True,
            "show_faculty_count": True,
            "custom_facts": []  # [{label, value}]
        },
        # Important Dates Widget
        "important_dates": {
            "enabled": True,
            "dates": []  # [{title, date, description}]
        },
        # Fee Summary Widget
        "fee_summary": {
            "enabled": True,
            "show_range": True,
            "custom_text": ""
        },
        # Contact Card Widget
        "contact_card": {
            "enabled": True,
            "show_phone": True,
            "show_email": True,
            "show_address": True,
            "show_map_link": True
        },
        # Counselor CTA Widget
        "counselor_cta": {
            "enabled": True,
            "title": "Need Help?",
            "subtitle": "Talk to our expert counselor",
            "phone": "",
            "show_callback_form": True
        },
        # Ad Banner Widget
        "ad_banner": {
            "enabled": False,
            "position": "top",  # top, middle, bottom
            "ad_code": ""
        },
        # Social Share Widget
        "social_share": {
            "enabled": True,
            "platforms": ["facebook", "twitter", "whatsapp", "linkedin"]
        },
        # Rating Widget
        "rating_widget": {
            "enabled": True,
            "show_stars": True,
            "show_review_count": True
        },
        # Related Colleges Widget
        "related_colleges": {
            "enabled": True,
            "show_count": 3,
            "criteria": "same_city"  # same_city, same_course, manual
        }
    }
    
    # Accreditations & Approvals
    accreditations: List[str] = []
    accreditation: Optional[Union[List[str], str]] = None
    approvals: List[str] = []
    
    @field_validator('accreditation', mode='before')
    @classmethod
    def convert_accreditation_to_list(cls, v):
        if isinstance(v, str):
            return [v] if v else []
        return v if v is not None else []
    
    # Placements - Comprehensive
    placement_stats: Optional[List] = []
    placements: Optional[Dict] = None
    placement: Optional[Dict] = None  # { highest, average, percentage, students_participated, companies_participated, total_offers, top_recruiters }
    
    # Cutoff Data
    cutoff_data: List = []  # Can be List[Dict] or empty
    
    # Faculty
    faculty: Optional[List] = []
    
    # Scholarships - Detailed
    scholarships: List = []  # Can be List[Dict] or empty
    
    # Updates & News
    updates: List = []  # Can be List[Dict] or empty
    
    # Students
    total_students: Optional[int] = None
    
    # Ratings & Reviews
    rating: float = 0.0
    total_reviews: int = 0
    rating_breakdown: Dict = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    
    # User tracking
    created_by: Optional[str] = None  # User ID who created
    created_by_name: Optional[str] = None  # User name who created
    updated_by: Optional[str] = None  # User ID who last updated
    updated_by_name: Optional[str] = None  # User name who last updated
    
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class CollegeCreate(BaseModel):
    name: str
    slug: str
    location: Dict
    established_year: int
    type: str
    affiliation: Optional[str] = None
    nirf_ranking: Optional[int] = None
    average_fees: float
    courses: List[Course] = []
    facilities: List[str] = []
    contact_info: Dict
    logo_url: Optional[str] = None
    logo_title: Optional[str] = None
    logo_alt: Optional[str] = None
    banner_url: Optional[str] = None
    banner_title: Optional[str] = None
    banner_alt: Optional[str] = None
    images: List[str] = []
    description: str
    highlights: List[str] = []
    accreditations: List[str] = []
    placement_stats: List[PlacementStats] = []

# Review Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    rating: int
    review_title: str
    review_text: str
    course: Optional[str] = None
    year_of_study: Optional[str] = None
    ratings: Dict = {
        "academics": 0,
        "placements": 0,
        "infrastructure": 0,
        "faculty": 0,
        "campus_life": 0
    }
    helpful_count: int = 0
    earnings: float = 0.0  # Earnings from this review
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    college_id: str
    rating: int
    review_title: str
    review_text: str
    course: Optional[str] = None
    year_of_study: Optional[str] = None
    ratings: Dict = {}

# Q&A Models
class Question(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    question: str
    answers: List[Dict] = []
    views: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuestionCreate(BaseModel):
    college_id: str
    question: str

class AnswerCreate(BaseModel):
    question_id: str
    answer: str

# Notification Models
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # admission_alert, exam_alert, application_update, review_earning
    title: str
    message: str
    link: Optional[str] = None
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NotificationCreate(BaseModel):
    user_id: str
    type: str
    title: str
    message: str
    link: Optional[str] = None

# Earnings Models
class EarningTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # review, referral
    amount: float
    description: str
    reference_id: str  # review_id or referral_user_id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Education Loan Models
class EducationLoan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bank_name: str
    loan_type: str  # Domestic, International
    interest_rate: float
    max_loan_amount: float
    repayment_period: int  # in years
    processing_fee: float
    collateral_required: bool
    features: List[str] = []
    eligibility_criteria: str
    documents_required: List[str] = []
    website_url: Optional[str] = None
    contact_number: Optional[str] = None
    rating: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoanApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    loan_id: str
    bank_name: str
    
    # Applicant Details
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    
    # Education Details
    course_name: str
    college_name: str
    course_fees: float
    course_duration: int  # in years
    
    # Financial Details
    loan_amount_required: float
    annual_family_income: float
    existing_loans: Optional[str] = None
    
    # Documents
    documents_submitted: List[str] = []
    
    # Status
    status: str = "submitted"  # submitted, under_review, approved, rejected
    application_number: str = Field(default_factory=lambda: f"LOAN{str(uuid.uuid4())[:8].upper()}")
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoanApplicationCreate(BaseModel):
    loan_id: str
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    course_name: str
    college_name: str
    course_fees: float
    course_duration: int
    loan_amount_required: float
    annual_family_income: float
    existing_loans: Optional[str] = None

# Scholarship Models (main Scholarship model defined at top of file)
class ScholarshipApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    scholarship_id: str
    scholarship_name: str
    
    # Applicant Details
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    category: str  # General, OBC, SC, ST
    
    # Academic Details
    current_course: str
    current_college: str
    current_year: str
    cgpa: float
    class_10_percentage: float
    class_12_percentage: float
    
    # Financial Details
    annual_family_income: float
    
    # Additional Info
    achievements: Optional[str] = None
    why_deserve_scholarship: str
    
    # Status
    status: str = "submitted"  # submitted, under_review, approved, rejected
    application_number: str = Field(default_factory=lambda: f"SCH{str(uuid.uuid4())[:8].upper()}")
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ScholarshipApplicationCreate(BaseModel):
    scholarship_id: str
    full_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    gender: str
    category: str
    current_course: str
    current_college: str
    current_year: str
    cgpa: float
    class_10_percentage: float
    class_12_percentage: float
    annual_family_income: float
    achievements: Optional[str] = None
    why_deserve_scholarship: str

# Study Materials Models
class StudyMaterial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    exam_name: str  # JEE, NEET, CAT, GATE, etc.
    subject: str
    topic: Optional[str] = None
    material_type: str  # Notes, Sample Paper, Previous Year, Mock Test, Video
    description: str
    file_url: Optional[str] = None
    external_link: Optional[str] = None
    is_premium: bool = False
    downloads: int = 0
    rating: float = 0.0
    total_ratings: int = 0
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StudyMaterialCreate(BaseModel):
    title: str
    exam_name: str
    subject: str
    topic: Optional[str] = None
    material_type: str
    description: str
    file_url: Optional[str] = None
    external_link: Optional[str] = None
    is_premium: bool = False
    tags: List[str] = []

# Counseling Models
class Counselor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    specialization: List[str] = []  # Career, Exam, Course Selection, Study Abroad
    qualifications: str
    experience_years: int
    rating: float = 0.0
    total_reviews: int = 0
    bio: str
    availability: Dict = {}  # day: time slots
    session_fee: float = 0.0  # 0 for free sessions
    total_sessions: int = 0
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CounselingSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    counselor_id: str
    counselor_name: str
    session_type: str  # Career, Exam, Course, Study Abroad
    session_date: str
    session_time: str
    duration: int = 30  # minutes
    mode: str = "Video"  # Video, Phone, Chat
    status: str = "scheduled"  # scheduled, completed, cancelled
    
    # Student Details
    student_name: str
    student_email: EmailStr
    student_phone: str
    current_education: str
    
    # Session Info
    query_description: str
    notes: Optional[str] = None
    feedback: Optional[str] = None
    rating: Optional[int] = None
    
    booking_number: str = Field(default_factory=lambda: f"COUN{str(uuid.uuid4())[:8].upper()}")
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CounselingSessionCreate(BaseModel):
    counselor_id: str
    session_type: str
    session_date: str
    session_time: str
    mode: str
    student_name: str
    student_email: EmailStr
    student_phone: str
    current_education: str
    query_description: str

# Payment & Subscription Models
class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_type: str  # Premium Monthly, Premium Yearly
    amount: float
    start_date: datetime
    end_date: datetime
    status: str = "active"  # active, expired, cancelled
    payment_id: Optional[str] = None
    features: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    transaction_type: str  # subscription, material_purchase, premium_upgrade
    amount: float
    currency: str = "INR"
    payment_method: str  # stripe, razorpay
    payment_id: str
    status: str  # pending, completed, failed
    item_id: Optional[str] = None
    item_name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReferralTracking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_id: str
    referrer_name: str
    referred_user_id: str
    referred_user_name: str
    referred_user_email: EmailStr
    status: str = "pending"  # pending, completed, failed
    earnings_amount: float = 200.0
    earnings_paid: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Institution Models
class Institution(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    college_id: str  # Link to college in colleges collection
    contact_person: str
    designation: str
    subscription_plan: str = "basic"  # basic, pro, enterprise
    applications_received: int = 0
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Inquiry Models
class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    student_name: str
    email: EmailStr
    phone: str
    course_interested: str
    message: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InquiryCreate(BaseModel):
    college_id: str
    student_name: str
    email: EmailStr
    phone: str
    course_interested: str
    message: str

# School Models
class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    board: str  # CBSE, ICSE, State Board, IB, IGCSE
    school_type: str  # Government, Private, International
    medium: str  # English, Hindi, Regional Language
    city: str
    state: str
    address: Optional[str] = None
    pincode: Optional[str] = None
    established_year: Optional[int] = None
    
    # Display Priority for listing pages (lower number = appears first, 0 = default)
    display_priority: int = 0
    
    # Academic Info
    classes_offered: List[str] = []  # ["Nursery", "LKG", "UKG", "1-10", "11-12"]
    streams_offered: List[str] = []  # ["Science", "Commerce", "Arts"]
    
    # Infrastructure
    total_area: Optional[str] = None
    total_students: Optional[int] = None
    student_teacher_ratio: Optional[str] = None
    facilities: List[str] = []
    
    # Fees
    admission_fee: Optional[float] = None
    annual_fee: Optional[float] = None
    
    # Ratings & Stats
    rating: float = 0.0
    total_reviews: int = 0
    academic_excellence: float = 0.0
    infrastructure_rating: float = 0.0
    extracurricular_rating: float = 0.0
    
    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# University Models
class University(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    university_type: str  # Central, State, Private, Deemed
    accreditation: str  # NAAC A++, NAAC A+, etc.
    city: str
    state: str
    address: Optional[str] = None
    established_year: Optional[int] = None
    
    # Academic Info
    streams: List[str] = []  # Engineering, Medical, Management, etc.
    total_courses: int = 0
    total_colleges: int = 0
    
    # Stats
    total_students: Optional[int] = None
    total_faculty: Optional[int] = None
    
    # Rankings & Ratings
    nirf_rank: Optional[int] = None
    rating: float = 0.0
    total_reviews: int = 0
    
    # Placements
    placement_percentage: Optional[float] = None
    highest_package: Optional[float] = None
    average_package: Optional[float] = None
    
    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# News Models
class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    category: str  # Admission, Exams, Results, Events, Policy
    summary: str
    content: str
    
    # Media
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None  # Auto-generated SEO alt text
    video_url: Optional[str] = None  # YouTube/Vimeo embed URL
    video_thumbnail: Optional[str] = None
    gallery_images: List[Dict] = []  # [{url, alt, caption}]
    
    # Author Info
    author: str
    author_image: Optional[str] = None
    author_designation: Optional[str] = None
    
    # Table of Contents
    toc_enabled: bool = False
    toc_items: List[Dict] = []  # [{id, title, level}]
    
    # Custom Tables
    tables: List[Dict] = []  # [{title, headers: [], rows: [[]], style}]
    
    # Widgets Configuration
    show_related_articles: bool = True
    show_related_exams: bool = True
    show_related_colleges: bool = True
    show_newsletter: bool = True
    show_cta_banner: bool = False
    cta_banner: Optional[Dict] = None  # {title, subtitle, button_text, button_link, gradient}
    
    # Tags & Related
    tags: List[str] = []
    related_colleges: List[str] = []
    related_exams: List[str] = []
    related_articles: List[str] = []  # Article IDs
    
    # Stats
    views: int = 0
    shares: int = 0
    
    # SEO - Auto-generate options
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    auto_generate_seo: bool = True  # Auto-generate meta from content
    
    # Schema Markup
    schema_type: str = "NewsArticle"  # NewsArticle, BlogPosting, Article
    
    # Status & Approval
    published: bool = True
    featured: bool = False
    display_priority: int = 0  # Display priority for listing pages (lower number = appears first, 0 = no priority)
    status: str = "draft"  # draft, pending, published, rejected
    rejection_reason: Optional[str] = None
    submitted_by: Optional[dict] = None  # {id, name, email}
    submitted_at: Optional[datetime] = None
    approved_by: Optional[dict] = None  # {id, name, email}
    approved_at: Optional[datetime] = None
    
    # Timestamps
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Lead/Inquiry Models
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # User Info
    name: str
    email: EmailStr
    mobile: str
    city: str
    course_interested: str
    
    # College Info (for college-specific forms)
    college_id: Optional[str] = None
    college_name: Optional[str] = None
    
    # Source & Tracking
    source: str = "general"  # general, college, homepage_cta, listing_page
    form_heading: Optional[str] = None  # For general forms
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    
    # Status & Follow-up
    status: str = "new"  # new, contacted, converted, closed
    notes: Optional[str] = None
    assigned_to: Optional[str] = None  # Admin user ID
    contacted_at: Optional[datetime] = None
    converted_at: Optional[datetime] = None
    
    # Notifications
    email_sent: bool = False
    whatsapp_sent: bool = False
    whatsapp_message_sid: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    city: str
    course_interested: str
    college_id: Optional[str] = None
    college_name: Optional[str] = None
    source: str = "general"
    form_heading: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

class LeadSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "lead-settings"
    
    # General Form Settings
    general_form_heading: str = "Get Expert Counselling"
    general_form_subheading: str = "Fill the form and our team will get back to you within 24 hours"
    general_form_enabled: bool = True
    
    # CTA Button Settings
    cta_button_text: str = "Apply Now"
    cta_button_color: str = "#f97316"  # Orange
    show_floating_cta: bool = True
    show_header_cta: bool = True
    
    # Notification Settings
    notification_emails: List[str] = []  # List of admin emails to notify
    default_notification_email: str = ""  # Fallback email
    enable_email_notifications: bool = True
    enable_whatsapp_notifications: bool = True
    whatsapp_business_number: str = ""  # Business WhatsApp number for wa.me links
    
    # Auto-response Messages
    email_subject: str = "Thank you for your inquiry - {college_name}"
    email_template: str = """
Dear {name},

Thank you for your interest in {college_name}!

We have received your inquiry for {course_interested}. Our counselling team will contact you shortly.

Your Details:
- Name: {name}
- Email: {email}
- Mobile: {mobile}
- City: {city}
- Course: {course_interested}

Best regards,
Admissionbuddy Team
    """
    
    whatsapp_message_template: str = """
Hello {name}! 👋

Thank you for your interest in {college_name}!

We've received your inquiry for *{course_interested}*. Our expert counsellor will contact you shortly on {mobile}.

📞 For immediate assistance, reply to this message.

- Team Admissionbuddy
    """
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Admin User Model
class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str
    role: str = "super_admin"  # super_admin, content_manager, data_entry
    profile_photo: Optional[str] = None  # URL to profile photo
    job_title: Optional[str] = None  # Job title/designation
    bio: Optional[str] = None  # Short bio
    is_active: bool = True  # Can disable team members
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

# Role permissions mapping
ROLE_PERMISSIONS = {
    "super_admin": {
        "manage_team": True,
        "manage_colleges": True,
        "delete_colleges": True,
        "manage_listing_pages": True,
        "manage_news": True,
        "manage_reviews": True,
        "manage_ads": True,
        "manage_settings": True,
        "view_analytics": True,
    },
    "content_manager": {
        "manage_team": False,
        "manage_colleges": True,
        "delete_colleges": True,
        "manage_listing_pages": True,
        "manage_news": True,
        "manage_reviews": True,
        "manage_ads": False,
        "manage_settings": False,
        "view_analytics": True,
    },
    "data_entry": {
        "manage_team": False,
        "manage_colleges": True,
        "delete_colleges": False,
        "manage_listing_pages": False,
        "manage_news": False,
        "manage_reviews": False,
        "manage_ads": False,
        "manage_settings": False,
        "view_analytics": False,
    },
}

def has_permission(role: str, permission: str) -> bool:
    """Check if a role has a specific permission"""
    return ROLE_PERMISSIONS.get(role, {}).get(permission, False)

# ============================================
# Content Approval System
# ============================================

# Approval statuses
APPROVAL_STATUS = {
    "draft": "Draft",
    "pending": "Pending Review",
    "published": "Published",
    "rejected": "Rejected"
}

def can_approve_content(role: str) -> bool:
    """Check if role can approve content"""
    return role in ["super_admin", "content_manager"]

def can_direct_publish(role: str) -> bool:
    """Check if role can publish without approval"""
    return role == "super_admin"

class TeamMemberCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str = "data_entry"
    job_title: Optional[str] = None

class ContentApproval(BaseModel):
    """Model for approval action"""
    action: str  # approve, reject
    comment: Optional[str] = None

# ============================================
# Taxonomy & Master Data Models
# ============================================

# Stream Model
class Stream(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Engineering, Medical, Management, etc.
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Sub-Stream Model
class SubStream(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    stream_id: str  # Parent stream reference
    name: str  # Computer Science, Mechanical, MBBS, etc.
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Board Model (for Schools)
class Board(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # CBSE, ICSE, State Board, etc.
    full_name: Optional[str] = None
    slug: str
    type: str = "State"  # National, State, International
    state: Optional[str] = None  # For state boards
    description: Optional[str] = None
    headquarters: Optional[str] = None
    established: Optional[int] = None
    website: Optional[str] = None
    recognition: Optional[str] = None
    medium_of_instruction: List[str] = []
    exam_pattern: Optional[str] = None
    grading_system: Optional[str] = None
    key_features: List[str] = []
    total_schools: int = 0
    country: str = "India"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# College Type Model
class CollegeType(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Government, Private, Deemed, Autonomous, etc.
    slug: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Affiliation Model
class Affiliation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # University name or board name
    slug: str
    type: str  # University, Board, Council
    description: Optional[str] = None
    website: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Recognition Model
class Recognition(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # UGC, AICTE, MCI, etc.
    slug: str
    full_name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Accreditation Model
class Accreditation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # NAAC A++, NBA, etc.
    slug: str
    full_name: Optional[str] = None
    grade: Optional[str] = None  # A++, A+, A, B++, etc.
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Accreditation Level Model
class AccreditationLevel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # A++, A+, A, B++, B+, B, C, etc.
    slug: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Rank Category Model
class RankCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Overall, Engineering, Medical, Management, etc.
    slug: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Ranking Model
class Ranking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # NIRF, QS World, Times Higher Education
    full_name: Optional[str] = None
    slug: str
    type: str = "National"  # National, International, School
    institution_type: str = "Higher Education"  # Higher Education, School, Both
    year: int
    category: Optional[str] = None  # Overall, Engineering, Medical, etc.
    description: Optional[str] = None
    methodology: Optional[str] = None
    website: Optional[str] = None
    headquarters: Optional[str] = None
    established: Optional[int] = None
    key_parameters: List[str] = []
    coverage: Optional[str] = None  # India, Global, Asia, etc.
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Loan Model (Scholarship model defined at top of file)
class Loan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    bank_name: Optional[str] = None
    bank_type: Optional[str] = None
    bank_logo: Optional[str] = None
    loan_type: Optional[str] = None
    short_description: Optional[str] = None
    
    # Loan Details
    min_amount: Optional[str] = None
    max_amount: Optional[str] = None
    interest_rate_min: Optional[str] = None
    interest_rate_max: Optional[str] = None
    interest_type: Optional[str] = None
    processing_fee: Optional[str] = None
    tenure_min: Optional[str] = None
    tenure_max: Optional[str] = None
    moratorium_period: Optional[str] = None
    
    # Eligibility
    age_min: Optional[str] = None
    age_max: Optional[str] = None
    nationality: Optional[str] = None
    eligibility_criteria: List[str] = []
    courses_covered: List[str] = []
    countries_covered: List[str] = []
    documents_required: List[str] = []
    
    # Media
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None
    gallery_images: List[str] = []
    
    # Content
    content: Optional[str] = None
    benefits: List[str] = []
    key_features: List[str] = []
    application_process: Optional[str] = None
    repayment_options: Optional[str] = None
    
    # TOC & Tables
    toc_enabled: bool = False
    toc_items: List[Dict] = []
    tables: List[Dict] = []
    
    # Contact & Links
    official_website: Optional[str] = None
    apply_link: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    branch_locator_link: Optional[str] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    auto_generate_seo: bool = True
    schema_type: Optional[str] = "FinancialProduct"
    
    # Status
    is_active: bool = True
    is_featured: bool = False
    views: int = 0
    applications: int = 0
    
    # FAQs
    faqs: List[Dict] = []
    
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Legacy fields for backward compatibility
    provider: Optional[str] = None
    loan_amount_min: Optional[float] = None
    loan_amount_max: Optional[float] = None
    interest_rate: Optional[float] = None
    eligibility: Optional[str] = None
    description: Optional[str] = None
    features: List[str] = []
    how_to_apply: Optional[str] = None
    website: Optional[str] = None

# Comment Model
class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    entity_type: str  # college, course, exam, news
    entity_id: str
    comment: str
    parent_id: Optional[str] = None  # For nested comments
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Blog Model
class Blog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    category: str  # Tips, News, Guide, etc.
    author: str
    author_image: Optional[str] = None
    featured_image: str
    excerpt: str
    content: str
    tags: List[str] = []
    views: int = 0
    likes: int = 0
    is_featured: bool = False
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Study Material Model
class StudyMaterial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subject: str
    exam: str  # JEE, NEET, CAT, etc.
    class_level: Optional[str] = None  # Class 11, Class 12, etc.
    topic: str
    material_type: str  # PDF, Video, Notes, Question Paper
    file_url: Optional[str] = None
    description: str
    downloads: int = 0
    is_premium: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Counseling Session Model
class CounselingSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_name: str
    email: str
    phone: str
    preferred_stream: str
    preferred_date: datetime
    preferred_time: str
    query: str
    status: str = "pending"  # pending, scheduled, completed, cancelled
    counselor_assigned: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Banner/Slider Model
class Banner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    button_text: Optional[str] = None
    position: str = "home"  # home, colleges, courses, etc.
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Testimonial Model
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_name: str
    college_name: str
    course: str
    image_url: Optional[str] = None
    testimonial: str
    rating: float = 5.0
    is_featured: bool = False
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# FAQ Model
class FAQ(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str  # Admission, Fees, Courses, etc.
    page: str = "general"  # general, college, course, exam
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# City Model
class City(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    state: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    total_colleges: int = 0
    is_featured: bool = False
    display_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Contact Inquiry Model
class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    subject: str
    message: str
    status: str = "new"  # new, in_progress, resolved
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============================================
# Relationship/Tagging Models
# ============================================

# Course-College Tagging
class CourseCollegeTag(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    college_id: str
    fees: Optional[float] = None
    duration: Optional[str] = None
    seats: Optional[int] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Exam-Course Tagging
class ExamCourseTag(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exam_id: str
    course_id: str
    is_mandatory: bool = False
    cutoff_score: Optional[float] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Advertisement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Basic Info
    name: str  # Ad campaign name
    title: Optional[str] = None  # Display title
    description: Optional[str] = None
    
    # Ad Content
    ad_type: str  # banner, popup, sidebar, floating
    image_url: str  # Ad image
    link_url: str  # Redirect URL when clicked
    open_in_new_tab: bool = True
    
    # Placement
    pages: List[str] = []  # Page names where ad should show: home, colleges, college-detail, etc.
    position: str = "top"  # top, bottom, sidebar, popup
    
    # Scheduling
    start_date: datetime
    end_date: datetime
    is_active: bool = True  # Manual active/inactive toggle
    
    # Priority & Display
    priority: int = 0  # Higher priority ads show first
    max_impressions_per_user: Optional[int] = None  # Limit impressions per user
    
    # Analytics
    impressions: int = 0  # Total times ad was shown
    clicks: int = 0  # Total times ad was clicked
    
    # Metadata
    created_by: Optional[str] = None  # Admin user ID
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Listing Page Content - For managing content on listing pages (india, state, city, stream, course)
class ListingPageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # URL Configuration
    url_slug: str  # e.g., "india-colleges", "maharashtra-colleges", "engineering"
    page_type: str  # "india", "state", "city", "stream", "course", "type", "accreditation"
    institution_type: str = "colleges"  # "colleges", "schools", "universities"
    
    # Location/Filter Info (for reference)
    state: Optional[str] = None
    city: Optional[str] = None
    stream: Optional[str] = None
    course: Optional[str] = None
    college_type: Optional[str] = None  # government, private, etc.
    
    # SEO Meta Tags
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    
    # Page Content
    page_title: Optional[str] = None  # H1 heading
    page_subtitle: Optional[str] = None
    introduction: Optional[str] = None  # Rich text introduction
    
    # Table of Contents
    table_of_contents: List[Dict[str, str]] = []  # [{title, anchor}]
    
    # Main Content Sections (Rich Text with media)
    content_sections: List[Dict[str, Any]] = []  # [{title, content, type, media_url, media_alt, table_data, order}]
    
    # Standalone Tables
    tables: List[Dict[str, Any]] = []  # [{title, headers, rows}]
    
    # FAQs
    faqs: List[Dict[str, str]] = []  # [{question, answer}]
    
    # Related Links
    related_pages: List[Dict[str, str]] = []  # [{title, url}]
    
    # Widgets Configuration
    widgets: Dict[str, Any] = {
        "ask_question": {"enabled": False, "title": "Have a Question?"},
        "comments": {"enabled": False, "title": "Comments"}
    }
    
    # Status & Approval
    status: str = "draft"  # draft, pending, published, rejected
    is_published: bool = False
    rejection_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_by_name: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    
    # Content Team / Author Info
    created_by: Optional[str] = None  # User ID
    created_by_name: Optional[str] = None  # User Name
    created_by_email: Optional[str] = None  # User Email
    created_by_photo: Optional[str] = None  # Profile photo
    updated_by: Optional[str] = None  # Last updated by User ID
    updated_by_name: Optional[str] = None  # Last updated by User Name
    updated_by_photo: Optional[str] = None  # Profile photo
    
    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Exam Listing Page Settings Model
class ExamListingPageSettings(BaseModel):
    """Settings for the /exams listing page - editable from admin"""
    model_config = ConfigDict(extra="allow")
    id: str = "exam-listing-page"  # Singleton - only one settings document
    
    # Hero Section
    hero_title: str = "Entrance Exams in India 2025-26"
    hero_subtitle: str = "Complete guide to 200+ entrance exams for Engineering, Medical, Management, Law & more"
    hero_search_placeholder: str = "Search exams (JEE, NEET, CAT, GATE...)"
    
    # Quick Stats (shown in hero)
    stats: List[Dict] = [
        {"label": "Total Exams", "value": "200+"},
        {"label": "Categories", "value": "24"},
        {"label": "Updates Daily", "value": "50+"},
        {"label": "Students Helped", "value": "10M+"}
    ]
    
    # Latest News/Updates Section
    show_news_section: bool = True
    news_section_title: str = "Latest Exam Updates"
    news_items: List[Dict] = []  # [{title, date, tag, link}]
    
    # Popular Exams Sidebar
    show_popular_sidebar: bool = True
    popular_sidebar_title: str = "Popular Exams"
    
    # SEO Settings
    meta_title: str = "Entrance Exams in India 2025-26 | Complete Guide"
    meta_description: str = "Find all entrance exams in India for Engineering, Medical, Management, Law and more. Get exam dates, eligibility, syllabus and preparation tips."
    meta_keywords: List[str] = ["entrance exams", "india exams", "JEE", "NEET", "CAT", "GATE"]
    
    # Additional Content Sections
    intro_content: Optional[str] = None  # HTML content below hero
    bottom_content: Optional[str] = None  # HTML content at bottom
    faqs: List[Dict] = []  # [{question, answer}]
    
    # Category Customization
    show_all_categories: bool = True
    featured_categories: List[str] = []  # Categories to highlight
    
    # Timestamps
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


# News Listing Page Settings Model
class NewsListingPageSettings(BaseModel):
    """Settings for the /news listing page - editable from admin"""
    model_config = ConfigDict(extra="allow")
    id: str = "news-listing-page"  # Singleton - only one settings document
    
    # Hero Section
    hero_title: str = "Latest News & Updates"
    hero_subtitle: str = "Stay updated with the latest news on admissions, exams, colleges and education"
    
    # Quick Stats (shown in hero)
    stats: List[Dict] = [
        {"label": "News Articles", "value": "500+"},
        {"label": "Categories", "value": "5"},
        {"label": "Daily Updates", "value": "20+"},
        {"label": "Subscribers", "value": "50K+"}
    ]
    
    # Categories Configuration
    categories: List[Dict] = [
        {"id": "all", "label": "ALL NEWS", "enabled": True},
        {"id": "admission", "label": "ADMISSION ALERT", "enabled": True},
        {"id": "college", "label": "COLLEGE NEWS", "enabled": True},
        {"id": "exam", "label": "EXAM NEWS", "enabled": True},
        {"id": "latest", "label": "LATEST ALERTS", "enabled": True}
    ]
    
    # Sidebar Configuration
    show_big_stories: bool = True
    big_stories_title: str = "The Big Stories"
    big_stories_count: int = 5
    
    show_trending_tags: bool = True
    trending_tags_title: str = "#Trending search"
    trending_tags: List[str] = [
        "CAT 2025", "JEE Main", "NEET UG", "GATE 2026", "UPSC",
        "IIT Admission", "MBA Colleges", "CUET", "NTA", "Engineering"
    ]
    
    show_newsletter: bool = True
    newsletter_title: str = "Subscribe to our newsletter"
    newsletter_subtitle: str = "Get our latest news about exams, colleges and others"
    newsletter_button_text: str = "Subscribe"
    
    # SEO Settings
    meta_title: str = "Latest News & Updates | Education News"
    meta_description: str = "Stay updated with the latest news on admissions, exams, colleges and education in India."
    meta_keywords: List[str] = ["education news", "admission news", "exam news", "college news"]
    
    # Additional Content
    intro_content: Optional[str] = None  # HTML content below hero
    bottom_content: Optional[str] = None  # HTML content at bottom
    faqs: List[Dict] = []  # [{question, answer}]
    
    # Timestamps
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


# Blog Listing Page Settings Model
class BlogListingPageSettings(BaseModel):
    """Settings for the /blog listing page - editable from admin"""
    model_config = ConfigDict(extra="allow")
    id: str = "blog-listing-page"  # Singleton
    
    # Hero Section
    hero_title: str = "Our Blog"
    hero_subtitle: str = "Insights, tips and guides for students and parents"
    
    # Quick Stats
    stats: List[Dict] = [
        {"label": "Articles", "value": "200+"},
        {"label": "Categories", "value": "10"},
        {"label": "Authors", "value": "15+"},
        {"label": "Readers", "value": "50K+"}
    ]
    
    # Categories
    categories: List[Dict] = [
        {"id": "all", "label": "All Posts", "enabled": True},
        {"id": "career", "label": "Career Guidance", "enabled": True},
        {"id": "study-tips", "label": "Study Tips", "enabled": True},
        {"id": "college-life", "label": "College Life", "enabled": True},
        {"id": "exam-prep", "label": "Exam Preparation", "enabled": True}
    ]
    
    # Sidebar
    show_popular_posts: bool = True
    popular_posts_title: str = "Popular Posts"
    popular_posts_count: int = 5
    
    show_categories_sidebar: bool = True
    categories_sidebar_title: str = "Categories"
    
    show_tags_cloud: bool = True
    tags_cloud_title: str = "Popular Tags"
    popular_tags: List[str] = ["Career", "Study Tips", "College Life", "Exams", "Scholarships", "Abroad Study"]
    
    show_newsletter: bool = True
    newsletter_title: str = "Subscribe to our Blog"
    newsletter_subtitle: str = "Get the latest articles delivered to your inbox"
    newsletter_button_text: str = "Subscribe"
    
    # SEO
    meta_title: str = "Blog | Education Insights & Tips"
    meta_description: str = "Read our blog for career guidance, study tips, college life insights and exam preparation strategies."
    meta_keywords: List[str] = ["education blog", "career guidance", "study tips", "college life"]
    
    # Additional Content
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[Dict] = []
    
    # Timestamps
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


# Course Listing Page Settings Model
class CourseListingPageSettings(BaseModel):
    """Settings for the /courses main listing page - editable from admin"""
    model_config = ConfigDict(extra="allow")
    id: str = "course-listing-page"  # Singleton
    
    # Hero Section
    hero_title: str = "Explore Courses in India"
    hero_subtitle: str = "Find the perfect course for your career - from diploma to doctorate"
    hero_search_placeholder: str = "Search courses (B.Tech, MBA, MBBS...)"
    
    # Popular Tags (shown in hero)
    popular_tags: List[Dict] = [
        {"name": "B.Tech", "link": "/courses/engineering", "color": "bg-blue-500"},
        {"name": "MBA", "link": "/courses/management", "color": "bg-purple-500"},
        {"name": "MBBS", "link": "/courses/medical", "color": "bg-red-500"},
        {"name": "B.Sc", "link": "/courses/science", "color": "bg-green-500"},
        {"name": "B.Com", "link": "/courses/commerce", "color": "bg-yellow-500"},
        {"name": "BA", "link": "/courses/arts", "color": "bg-pink-500"},
        {"name": "BCA", "link": "/courses/computer", "color": "bg-indigo-500"},
        {"name": "LLB", "link": "/courses/law", "color": "bg-gray-600"}
    ]
    
    # Level-based Courses Section
    level_courses: List[Dict] = [
        {"title": "After 10th", "subtitle": "Diploma & Vocational", "icon": "🎓", "gradient": "from-emerald-400 to-cyan-500", "link": "/courses/after-10th", "stats": "200+ Courses", "popular": ["ITI", "Polytechnic", "Vocational"]},
        {"title": "After 12th", "subtitle": "Undergraduate Programs", "icon": "📚", "gradient": "from-blue-500 to-purple-600", "link": "/courses/after-12th", "stats": "500+ Courses", "popular": ["B.Tech", "MBBS", "B.Com", "BA"]},
        {"title": "Diploma", "subtitle": "Professional Certifications", "icon": "📜", "gradient": "from-orange-400 to-pink-500", "link": "/courses/diploma", "stats": "150+ Courses", "popular": ["Engineering", "Pharmacy", "Nursing"]},
        {"title": "Postgraduate", "subtitle": "Masters & PG Programs", "icon": "🎯", "gradient": "from-purple-500 to-indigo-600", "link": "/courses/pg", "stats": "400+ Courses", "popular": ["MBA", "M.Tech", "M.Sc", "MA"]},
        {"title": "PhD & Research", "subtitle": "Doctoral Programs", "icon": "🔬", "gradient": "from-rose-400 to-red-500", "link": "/courses/phd", "stats": "100+ Programs", "popular": ["Science", "Engineering", "Arts"]},
        {"title": "Certificate", "subtitle": "Short-term Courses", "icon": "✨", "gradient": "from-amber-400 to-orange-500", "link": "/courses/certificate", "stats": "300+ Courses", "popular": ["IT", "Management", "Design"]}
    ]
    
    # Stream Categories Section
    stream_categories: List[Dict] = [
        {"name": "Engineering", "icon": "HiOutlineDesktopComputer", "link": "/courses/engineering", "courses": ["B.Tech", "B.E", "M.Tech", "Polytechnic"], "count": "250+"},
        {"name": "Medical", "icon": "HiOutlineHeart", "link": "/courses/medical", "courses": ["MBBS", "BDS", "BAMS", "Nursing"], "count": "150+"},
        {"name": "Management", "icon": "HiOutlineOfficeBuilding", "link": "/courses/management", "courses": ["MBA", "BBA", "PGDM", "BMS"], "count": "200+"},
        {"name": "Science", "icon": "HiOutlineBeaker", "link": "/courses/science", "courses": ["B.Sc", "M.Sc", "BCA", "MCA"], "count": "180+"},
        {"name": "Commerce", "icon": "HiOutlineCurrencyRupee", "link": "/courses/commerce", "courses": ["B.Com", "M.Com", "CA", "CS"], "count": "120+"},
        {"name": "Arts", "icon": "HiOutlinePencilAlt", "link": "/courses/arts", "courses": ["BA", "MA", "BFA", "Journalism"], "count": "150+"},
        {"name": "Law", "icon": "HiOutlineScale", "link": "/courses/law", "courses": ["LLB", "BA LLB", "LLM"], "count": "80+"},
        {"name": "Computer", "icon": "HiOutlineDesktopComputer", "link": "/courses/computer", "courses": ["BCA", "MCA", "B.Tech CSE"], "count": "100+"}
    ]
    
    # Featured Courses Section
    featured_courses: List[Dict] = []  # [{name, description, duration, link, image}]
    
    # Trending Section
    trending_badge: str = "🔥 TRENDING NOW"
    trending_title: str = "High-Demand Courses"
    trending_subtitle: str = "Courses with the highest career growth potential in 2025"
    trending_courses: List[Dict] = [
        {"name": "Data Science", "growth": "+45%", "icon": "📊", "link": "/courses/search?q=Data%20Science"},
        {"name": "Artificial Intelligence", "growth": "+62%", "icon": "🤖", "link": "/courses/search?q=Artificial%20Intelligence"},
        {"name": "Digital Marketing", "growth": "+38%", "icon": "📱", "link": "/courses/search?q=Digital%20Marketing"},
        {"name": "Cyber Security", "growth": "+52%", "icon": "🔒", "link": "/courses/search?q=Cyber%20Security"},
        {"name": "Cloud Computing", "growth": "+41%", "icon": "☁️", "link": "/courses/search?q=Cloud%20Computing"},
        {"name": "Machine Learning", "growth": "+58%", "icon": "🧠", "link": "/courses/search?q=Machine%20Learning"}
    ]
    
    # Quick Stats Section
    stats_courses: str = "10,000+"
    stats_colleges: str = "5,000+"
    stats_streams: str = "50+"
    stats_students: str = "2M+"
    
    # SEO Settings
    meta_title: str = "Courses in India 2025 - UG, PG, Diploma, PhD Programs"
    meta_description: str = "Explore 1000+ courses in India across Engineering, Medical, Management, Science, Commerce, Arts, Law and more."
    meta_keywords: List[str] = ["courses in india", "ug courses", "pg courses", "diploma", "degree"]
    
    # Additional Content
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[Dict] = []
    
    # Timestamps
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


# Individual Course Page Settings (for /courses/engineering, /courses/medical, etc.)
class CoursePageSettings(BaseModel):
    """Settings for individual course listing pages like /courses/engineering, /courses/after-10th"""
    model_config = ConfigDict(extra="allow")
    id: str  # Page slug (e.g., "engineering", "after-10th", "medical")
    
    # Page Identity
    page_type: str = "stream"  # "stream", "level", or "degree"
    is_active: bool = True
    
    # Hero Section
    title: str
    subtitle: str
    icon: str = "📚"
    badge: str = ""
    
    # Theme
    theme: str = "from-blue-600 via-blue-700 to-indigo-700"  # Gradient classes
    theme_light: str = "blue"  # Color key for accents
    
    # Course Filter (how to fetch courses)
    filter_key: str = "stream"  # "stream", "degree_type", "eligibility_level"
    filter_value: str = ""  # "Engineering", "PG", "after-10th"
    
    # Display
    duration: str = "3-4 Years"
    benefits: List[str] = []
    popular_courses: List[str] = []
    related_pages: List[str] = []
    
    # FAQs
    faqs: List[Dict] = []  # [{question, answer}]
    
    # SEO
    meta_title: str = ""
    meta_description: str = ""
    meta_keywords: List[str] = []
    
    # Sidebar Content
    sidebar_cta_title: str = "Need Guidance?"
    sidebar_cta_text: str = "Get expert counselling"
    sidebar_cta_button: str = "Get Free Counselling"
    sidebar_cta_link: Optional[str] = None
    
    # Additional Content
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None


# Default configurations for course pages
DEFAULT_COURSE_PAGE_CONFIGS = {
    "after-10th": {
        "page_type": "level",
        "title": "Courses After 10th Class",
        "subtitle": "Explore diploma, certificate & vocational courses to kickstart your career after class 10th",
        "icon": "🎓",
        "badge": "Diploma & Vocational",
        "theme": "from-orange-600 via-orange-500 to-amber-500",
        "theme_light": "orange",
        "filter_key": "eligibility_level",
        "filter_value": "after-10th",
        "duration": "6 Months - 3 Years",
        "benefits": ["Early career start", "Practical skills", "Lower fees", "Job-ready training", "Government job options"],
        "popular_courses": ["Diploma in Engineering", "ITI Electrician", "Diploma in Pharmacy", "ANM Nursing", "Polytechnic"],
        "related_pages": ["/courses/after-12th", "/courses/diploma", "/courses/certificate"],
        "faqs": [
            {"question": "What are the best courses after 10th?", "answer": "Popular courses include Diploma in Engineering, ITI courses, Diploma in Pharmacy, ANM Nursing, and various certificate programs."},
            {"question": "Can I do diploma after 10th?", "answer": "Yes, you can pursue polytechnic diploma courses in various streams like Engineering, Pharmacy, and Hotel Management after completing 10th class."}
        ],
        "meta_title": "Courses After 10th - Best Diploma & Certificate Courses 2025",
        "meta_description": "Explore 50+ diploma, certificate and ITI courses after 10th class. Find the best career-oriented courses in Engineering, Medical, IT, Design and more."
    },
    "after-12th": {
        "page_type": "level",
        "title": "Courses After 12th Class",
        "subtitle": "Discover undergraduate programs and professional courses after completing 12th standard",
        "icon": "📚",
        "badge": "Undergraduate Programs",
        "theme": "from-blue-600 via-indigo-600 to-purple-600",
        "theme_light": "blue",
        "filter_key": "eligibility_level",
        "filter_value": "after-12th",
        "duration": "3-5 Years",
        "benefits": ["Wide career options", "Higher education path", "Professional degrees", "Better salary", "Specialization opportunities"],
        "popular_courses": ["B.Tech", "MBBS", "B.Com", "BA", "BBA", "BCA", "B.Sc"],
        "related_pages": ["/courses/after-10th", "/courses/pg", "/courses/engineering"],
        "faqs": [
            {"question": "What are the best courses after 12th?", "answer": "Popular courses include B.Tech, MBBS, B.Com, BA, BBA, BCA depending on your stream and interests."},
            {"question": "Which stream has more career options?", "answer": "All streams have good options. Science opens doors to engineering/medical, Commerce to finance/business, Arts to humanities/civil services."}
        ],
        "meta_title": "Courses After 12th - Best UG Programs 2025",
        "meta_description": "Find the best courses after 12th class. Explore B.Tech, MBBS, B.Com, BA, BBA programs with eligibility, fees, and career options."
    },
    "diploma": {
        "page_type": "degree",
        "title": "Diploma Courses in India",
        "subtitle": "Professional diploma programs for skill-based education and career advancement",
        "icon": "📜",
        "badge": "Professional Certification",
        "theme": "from-orange-500 via-amber-500 to-yellow-500",
        "theme_light": "amber",
        "filter_key": "degree_type",
        "filter_value": "Diploma",
        "duration": "1-3 Years",
        "benefits": ["Practical training", "Quick completion", "Industry focused", "Affordable", "Job ready"],
        "popular_courses": ["Diploma in Engineering", "Diploma in Pharmacy", "Diploma in Nursing", "DMLT", "DHM"],
        "related_pages": ["/courses/after-10th", "/courses/certificate", "/courses/engineering"],
        "faqs": [
            {"question": "Is diploma better than degree?", "answer": "Diploma offers quicker job entry with practical skills. Degree provides broader knowledge and higher positions."},
            {"question": "Can I do degree after diploma?", "answer": "Yes, you can pursue lateral entry to B.Tech/degree programs after completing diploma."}
        ],
        "meta_title": "Diploma Courses in India 2025 - Professional Programs",
        "meta_description": "Explore diploma courses in India. Find engineering, pharmacy, nursing diploma programs with duration, fees, and career options."
    },
    "pg": {
        "page_type": "degree",
        "title": "PG Courses in India",
        "subtitle": "Explore postgraduate courses including MBA, M.Tech, MA, M.Sc, M.Com and more",
        "icon": "🎓",
        "badge": "Masters & Postgraduate",
        "theme": "from-violet-600 via-purple-600 to-indigo-600",
        "theme_light": "violet",
        "filter_key": "degree_type",
        "filter_value": "PG",
        "duration": "1-2 Years",
        "benefits": ["Higher salary potential", "Specialization", "Research opportunities", "Leadership roles", "Global recognition"],
        "popular_courses": ["MBA", "M.Tech", "M.Sc", "MA", "M.Com", "MCA", "LLM"],
        "related_pages": ["/courses/after-12th", "/courses/phd", "/courses/management"],
        "faqs": [
            {"question": "What are the best PG courses?", "answer": "Popular PG courses include MBA, M.Tech, M.Sc, MA, M.Com, MCA, and specialized masters programs."},
            {"question": "What is eligibility for PG courses?", "answer": "Generally need bachelor's degree with 50% marks. Some require entrance exams like CAT, GATE."}
        ],
        "meta_title": "PG Courses in India 2025 - Masters & Postgraduate Programs",
        "meta_description": "Find 500+ postgraduate courses in India. Explore MBA, M.Tech, MA, M.Sc programs with eligibility, fees, and top colleges."
    },
    "phd": {
        "page_type": "degree",
        "title": "PhD Programs in India",
        "subtitle": "Discover doctoral research programs across various disciplines",
        "icon": "🔬",
        "badge": "Doctoral Research",
        "theme": "from-slate-700 via-slate-800 to-gray-900",
        "theme_light": "slate",
        "filter_key": "degree_type",
        "filter_value": "PhD",
        "duration": "3-5 Years",
        "benefits": ["Research excellence", "Academic career", "Industry research", "Expert recognition", "Innovation leadership"],
        "popular_courses": ["PhD in Science", "PhD in Engineering", "PhD in Management", "PhD in Arts", "PhD in Commerce"],
        "related_pages": ["/courses/pg", "/courses/science"],
        "faqs": [
            {"question": "How to apply for PhD in India?", "answer": "Clear entrance exams like NET/GATE, apply to universities, submit research proposal, and appear for interviews."},
            {"question": "What is PhD duration?", "answer": "PhD typically takes 3-5 years including coursework, research, and thesis submission."}
        ],
        "meta_title": "PhD Programs in India 2025 - Doctoral Research Courses",
        "meta_description": "Explore PhD programs in India. Find research opportunities in Science, Engineering, Arts, Management with top universities."
    },
    "certificate": {
        "page_type": "degree",
        "title": "Certificate Courses in India",
        "subtitle": "Short-term skill-based courses for quick career advancement",
        "icon": "✨",
        "badge": "Short-Term Certification",
        "theme": "from-amber-500 via-orange-500 to-red-500",
        "theme_light": "amber",
        "filter_key": "degree_type",
        "filter_value": "Certificate",
        "duration": "3-12 Months",
        "benefits": ["Quick completion", "Skill focused", "Affordable", "Industry recognized", "Flexible learning"],
        "popular_courses": ["Digital Marketing", "Data Analytics", "Web Development", "Graphic Design", "Financial Modeling"],
        "related_pages": ["/courses/diploma", "/courses/after-10th", "/courses/computer"],
        "faqs": [
            {"question": "Are certificate courses valuable?", "answer": "Yes, certificate courses from reputed institutions are valued by employers for specific skill sets."},
            {"question": "What is certificate course duration?", "answer": "Certificate courses typically range from 3 months to 1 year depending on the program."}
        ],
        "meta_title": "Certificate Courses in India 2025 - Short Term Programs",
        "meta_description": "Explore certificate courses in IT, Design, Marketing, Finance. Short-term programs for skill development and career growth."
    },
    "engineering": {
        "page_type": "stream",
        "title": "Engineering Courses in India",
        "subtitle": "B.Tech, B.E, M.Tech and other engineering programs",
        "icon": "⚙️",
        "badge": "Technical Education",
        "theme": "from-blue-600 via-blue-700 to-indigo-700",
        "theme_light": "blue",
        "filter_key": "stream",
        "filter_value": "Engineering",
        "duration": "4 Years (B.Tech)",
        "benefits": ["High demand", "Innovation driven", "Global opportunities", "Diverse specializations", "High salary"],
        "popular_courses": ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Civil", "M.Tech"],
        "related_pages": ["/courses/after-12th", "/courses/diploma", "/courses/pg"],
        "faqs": [
            {"question": "Which engineering branch is best?", "answer": "CSE, ECE, and Mechanical are popular. Choose based on interest and job market."},
            {"question": "What is B.Tech eligibility?", "answer": "10+2 with PCM, minimum 50% marks, and clearing JEE Main/State entrance exams."}
        ],
        "meta_title": "Engineering Courses in India 2025 - B.Tech, BE, M.Tech",
        "meta_description": "Explore engineering courses in India. Find B.Tech, BE, M.Tech programs in CSE, ECE, Mechanical, Civil with top colleges."
    },
    "medical": {
        "page_type": "stream",
        "title": "Medical Courses in India",
        "subtitle": "MBBS, BDS, Nursing, Pharmacy and healthcare programs",
        "icon": "🏥",
        "badge": "Healthcare & Medicine",
        "theme": "from-red-600 via-rose-600 to-pink-600",
        "theme_light": "red",
        "filter_key": "stream",
        "filter_value": "Medical",
        "duration": "4-5.5 Years",
        "benefits": ["Noble profession", "Job security", "High respect", "Global opportunities", "Life-saving impact"],
        "popular_courses": ["MBBS", "BDS", "BAMS", "BHMS", "B.Sc Nursing", "B.Pharm"],
        "related_pages": ["/courses/after-12th", "/courses/pg", "/courses/science"],
        "faqs": [
            {"question": "How to become a doctor?", "answer": "Complete 10+2 with PCB, clear NEET, get MBBS admission, complete internship, register with MCI."},
            {"question": "What are alternative medical courses?", "answer": "BAMS, BHMS, BDS, B.Pharm, Nursing are good alternatives to MBBS."}
        ],
        "meta_title": "Medical Courses in India 2025 - MBBS, BDS, Nursing",
        "meta_description": "Explore medical courses in India. Find MBBS, BDS, BAMS, Nursing, Pharmacy programs with eligibility and top medical colleges."
    },
    "management": {
        "page_type": "stream",
        "title": "Management Courses in India",
        "subtitle": "BBA, MBA, PGDM and business management programs",
        "icon": "📊",
        "badge": "Business & Management",
        "theme": "from-purple-600 via-violet-600 to-indigo-600",
        "theme_light": "purple",
        "filter_key": "stream",
        "filter_value": "Management",
        "duration": "2-3 Years",
        "benefits": ["Leadership skills", "High salary", "Entrepreneurship", "Global network", "Diverse careers"],
        "popular_courses": ["MBA", "BBA", "PGDM", "BMS", "BBM", "Executive MBA"],
        "related_pages": ["/courses/commerce", "/courses/after-12th", "/courses/pg"],
        "faqs": [
            {"question": "Which is better BBA or B.Com?", "answer": "BBA focuses on management, B.Com on accounting/finance. Choose based on career goals."},
            {"question": "How to get into top MBA colleges?", "answer": "Score well in CAT/XAT, have good academics, work experience, prepare for GD-PI."}
        ],
        "meta_title": "Management Courses in India 2025 - BBA, MBA, PGDM",
        "meta_description": "Explore management courses in India. Find BBA, MBA, PGDM programs with specializations in Finance, Marketing, HR."
    },
    "science": {
        "page_type": "stream",
        "title": "Science Courses in India",
        "subtitle": "B.Sc, M.Sc and research-oriented science programs",
        "icon": "🔬",
        "badge": "Pure & Applied Sciences",
        "theme": "from-cyan-600 via-teal-600 to-emerald-600",
        "theme_light": "cyan",
        "filter_key": "stream",
        "filter_value": "Science",
        "duration": "3 Years (B.Sc)",
        "benefits": ["Research foundation", "Analytical skills", "Diverse fields", "Higher studies", "Innovation"],
        "popular_courses": ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "B.Sc Biology", "B.Sc Computer Science"],
        "related_pages": ["/courses/after-12th", "/courses/engineering", "/courses/pg"],
        "faqs": [
            {"question": "What can I do after B.Sc?", "answer": "Pursue M.Sc, MBA, B.Ed, or enter jobs in research, teaching, pharma, IT."},
            {"question": "Which science stream has best scope?", "answer": "Computer Science, Biotechnology, Data Science have excellent prospects."}
        ],
        "meta_title": "Science Courses in India 2025 - BSc, MSc Programs",
        "meta_description": "Explore science courses in India. Find B.Sc, M.Sc programs in Physics, Chemistry, Biology with top universities."
    },
    "commerce": {
        "page_type": "stream",
        "title": "Commerce Courses in India",
        "subtitle": "B.Com, CA, CS, CMA and finance-related programs",
        "icon": "💰",
        "badge": "Finance & Accounting",
        "theme": "from-emerald-600 via-green-600 to-teal-600",
        "theme_light": "emerald",
        "filter_key": "stream",
        "filter_value": "Commerce",
        "duration": "3 Years (B.Com)",
        "benefits": ["Financial expertise", "Stable careers", "Professional certifications", "Business acumen", "High demand"],
        "popular_courses": ["B.Com", "B.Com (Hons)", "CA", "CS", "CMA", "BBA", "M.Com"],
        "related_pages": ["/courses/management", "/courses/after-12th", "/courses/pg"],
        "faqs": [
            {"question": "What is better CA or MBA?", "answer": "CA is specialized in accounting, MBA is broader management. CA has higher entry barrier but assured career."},
            {"question": "What are best commerce courses?", "answer": "B.Com, CA, CS, CMA, BBA, and certifications like CFA are highly valued."}
        ],
        "meta_title": "Commerce Courses in India 2025 - BCom, CA, CS",
        "meta_description": "Explore commerce courses in India. Find B.Com, CA, CS, CMA programs with career options in accounting, finance."
    },
    "arts": {
        "page_type": "stream",
        "title": "Arts & Humanities Courses",
        "subtitle": "BA, MA and liberal arts programs across disciplines",
        "icon": "🎨",
        "badge": "Liberal Arts & Humanities",
        "theme": "from-pink-600 via-rose-600 to-red-600",
        "theme_light": "pink",
        "filter_key": "stream",
        "filter_value": "Arts",
        "duration": "3 Years (BA)",
        "benefits": ["Critical thinking", "Communication skills", "Creativity", "Diverse careers", "Cultural understanding"],
        "popular_courses": ["BA English", "BA Psychology", "BA Economics", "BA History", "BA Political Science"],
        "related_pages": ["/courses/after-12th", "/courses/law", "/courses/education"],
        "faqs": [
            {"question": "What jobs with BA degree?", "answer": "Content writing, journalism, teaching, HR, civil services, social work."},
            {"question": "Is arts a good stream?", "answer": "Yes! Arts graduates excel in media, law, civil services, teaching."}
        ],
        "meta_title": "Arts Courses in India 2025 - BA, MA Programs",
        "meta_description": "Explore arts and humanities courses in India. Find BA, MA programs in English, History, Psychology."
    },
    "computer": {
        "page_type": "stream",
        "title": "Computer & IT Courses",
        "subtitle": "BCA, MCA, B.Tech CS and information technology programs",
        "icon": "💻",
        "badge": "Information Technology",
        "theme": "from-indigo-600 via-blue-600 to-violet-600",
        "theme_light": "indigo",
        "filter_key": "stream",
        "filter_value": "Computer Applications",
        "duration": "3-4 Years",
        "benefits": ["High demand", "Remote work", "Innovation", "Global opportunities", "Excellent salary"],
        "popular_courses": ["B.Tech CSE", "BCA", "MCA", "B.Sc IT", "Data Science", "AI/ML"],
        "related_pages": ["/courses/engineering", "/courses/after-12th", "/courses/certificate"],
        "faqs": [
            {"question": "BCA or B.Tech CSE?", "answer": "B.Tech CSE is more comprehensive (4 years), BCA (3 years) is application focused."},
            {"question": "What programming languages to learn?", "answer": "Python, JavaScript, Java, SQL are essential."}
        ],
        "meta_title": "Computer Courses in India 2025 - BCA, MCA, IT Programs",
        "meta_description": "Explore computer and IT courses in India. Find BCA, MCA, B.Tech CSE, Data Science programs."
    },
    "law": {
        "page_type": "stream",
        "title": "Law Courses in India",
        "subtitle": "LLB, BA LLB, LLM and legal education programs",
        "icon": "⚖️",
        "badge": "Legal Education",
        "theme": "from-amber-600 via-yellow-600 to-orange-600",
        "theme_light": "amber",
        "filter_key": "stream",
        "filter_value": "Law",
        "duration": "3-5 Years",
        "benefits": ["Prestigious career", "Advocacy", "Corporate law", "Judiciary", "Social impact"],
        "popular_courses": ["BA LLB", "BBA LLB", "LLB", "LLM", "B.Com LLB"],
        "related_pages": ["/courses/arts", "/courses/after-12th", "/courses/pg"],
        "faqs": [
            {"question": "How to become a lawyer?", "answer": "Complete 12th, clear CLAT/LSAT, get LLB degree, enroll with Bar Council."},
            {"question": "3-year or 5-year LLB?", "answer": "5-year integrated BA LLB after 12th is comprehensive. 3-year LLB for graduates."}
        ],
        "meta_title": "Law Courses in India 2025 - LLB, BALLB, LLM",
        "meta_description": "Explore law courses in India. Find LLB, BA LLB, LLM programs with eligibility and top law colleges."
    },
    "education": {
        "page_type": "stream",
        "title": "Education & Teaching Courses",
        "subtitle": "B.Ed, D.El.Ed, M.Ed and teacher training programs",
        "icon": "📖",
        "badge": "Teacher Training",
        "theme": "from-sky-600 via-cyan-600 to-blue-600",
        "theme_light": "sky",
        "filter_key": "stream",
        "filter_value": "Education",
        "duration": "1-2 Years",
        "benefits": ["Noble profession", "Job security", "Work-life balance", "Government jobs", "Shape future"],
        "popular_courses": ["B.Ed", "D.El.Ed", "M.Ed", "B.P.Ed", "NTT"],
        "related_pages": ["/courses/arts", "/courses/pg", "/courses/after-12th"],
        "faqs": [
            {"question": "How to become a teacher?", "answer": "Complete graduation, clear entrance, complete B.Ed/D.El.Ed, clear TET/CTET."},
            {"question": "B.Ed vs D.El.Ed?", "answer": "B.Ed for classes 6-12 (after graduation). D.El.Ed for classes 1-5 (after 12th)."}
        ],
        "meta_title": "Education Courses in India 2025 - BEd, DEd, MEd",
        "meta_description": "Explore education and teaching courses. Find B.Ed, D.El.Ed, M.Ed programs with eligibility and career in teaching."
    }
}


# ============================================
# Helper Functions
# ============================================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    role = payload.get("role", "student")
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Check if user is admin - check both admins collection and users collection
    if role == "admin":
        # First try admins collection
        admin = await db.admins.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if admin is None:
            # Fallback: Check users collection for users with admin role
            admin = await db.users.find_one({"id": user_id, "role": "admin"}, {"_id": 0, "password_hash": 0})
        
        if admin is None:
            raise HTTPException(status_code=401, detail="Admin not found")
        
        # Return a User object with admin properties
        return User(
            id=admin["id"],
            email=admin["email"],
            name=admin["name"],
            role="admin",
            profile_photo=admin.get("profile_photo"),
            job_title=admin.get("job_title"),
            bio=admin.get("bio"),
            saved_colleges=[],
            total_earnings=0.0,
            referral_code=admin.get("referral_code", ""),
            referral_count=0,
            created_at=admin.get("created_at", datetime.now(timezone.utc))
        )
    
    # Regular user lookup
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

# ============================================
# Auth Routes
# ============================================

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password_hash'] = password_hash.decode('utf-8')
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Handle both 'password' and 'password_hash' field names
    password_hash = user_doc.get('password_hash') or user_doc.get('password')
    if not password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password using pwd_context
    if not pwd_context.verify(credentials.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_doc.pop('password_hash', None)
    user_doc.pop('password', None)
    user_doc.pop('_id', None)
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    user = User(**user_doc)
    
    # Include role in token for authorization
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    profile_photo: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None

@api_router.put("/auth/profile", response_model=User)
async def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    """Update user profile - name, photo, job title, bio"""
    update_data = {}
    
    if profile_data.name is not None:
        update_data['name'] = profile_data.name
    if profile_data.profile_photo is not None:
        update_data['profile_photo'] = profile_data.profile_photo
    if profile_data.job_title is not None:
        update_data['job_title'] = profile_data.job_title
    if profile_data.bio is not None:
        update_data['bio'] = profile_data.bio
    
    if update_data:
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one({"id": current_user.id}, {"$set": update_data})
    
    # Fetch and return updated user
    updated_user = await db.users.find_one({"id": current_user.id}, {"_id": 0, "password_hash": 0})
    return User(**updated_user)

# ============================================
# Admin Routes
# ============================================

@api_router.post("/auth/admin-login", response_model=Token)
async def admin_login(credentials: UserLogin):
    """Admin login endpoint"""
    admin_doc = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if not admin_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(credentials.password, admin_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    admin = AdminUser(**admin_doc)
    access_token = create_access_token(data={"sub": admin.id, "role": "admin"})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=User(
            id=admin.id,
            email=admin.email,
            name=admin.name,
            role="admin",
            profile_photo=admin.profile_photo,
            job_title=admin.job_title,
            bio=admin.bio,
            saved_colleges=[],
        )
    )

@api_router.get("/admin/profile")
async def get_admin_profile(current_user: User = Depends(get_current_user)):
    """Get admin profile"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin_doc = await db.admins.find_one({"id": current_user.id}, {"_id": 0, "password_hash": 0})
    if not admin_doc:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    return admin_doc

class AdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    profile_photo: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None

@api_router.put("/admin/profile")
async def update_admin_profile(profile_data: AdminProfileUpdate, current_user: User = Depends(get_current_user)):
    """Update admin profile - name, photo, job title, bio"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {}
    
    if profile_data.name is not None:
        update_data['name'] = profile_data.name
    if profile_data.profile_photo is not None:
        update_data['profile_photo'] = profile_data.profile_photo
    if profile_data.job_title is not None:
        update_data['job_title'] = profile_data.job_title
    if profile_data.bio is not None:
        update_data['bio'] = profile_data.bio
    
    if update_data:
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        # Update admins collection
        await db.admins.update_one({"id": current_user.id}, {"$set": update_data})
        
        # Also sync to users collection if admin exists there (for content team display)
        admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
        if admin:
            new_name = update_data.get('name', admin.get('name'))
            new_photo = update_data.get('profile_photo', admin.get('profile_photo'))
            
            await db.users.update_one(
                {"email": admin.get("email")},
                {"$set": {
                    "name": new_name,
                    "profile_photo": new_photo,
                    "job_title": update_data.get('job_title', admin.get('job_title')),
                    "bio": update_data.get('bio', admin.get('bio')),
                }}
            )
            
            # Also update listing pages where this admin is the creator/updater
            await db.listing_pages.update_many(
                {"$or": [{"created_by": current_user.id}, {"updated_by": current_user.id}]},
                {"$set": {
                    "updated_by_name": new_name,
                    "updated_by_photo": new_photo,
                }}
            )
            
            # Update colleges where this admin is the creator/updater
            await db.colleges.update_many(
                {"$or": [{"created_by": current_user.id}, {"updated_by": current_user.id}]},
                {"$set": {
                    "updated_by_name": new_name,
                    "updated_by_photo": new_photo,
                }}
            )
    
    # Fetch and return updated admin
    updated_admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0, "password_hash": 0})
    return updated_admin

# ============================================
# Team Management APIs
# ============================================

@api_router.get("/admin/authors")
async def get_authors_for_content(current_user: User = Depends(get_current_user)):
    """Get team members for author selection in content forms (any admin)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get all active team members (exclude password_hash only)
    authors_cursor = db.admins.find({"is_active": {"$ne": False}}, {"_id": 0, "password_hash": 0})
    authors = await authors_cursor.to_list(100)
    return authors


@api_router.get("/admin/team")
async def get_team_members(current_user: User = Depends(get_current_user)):
    """Get all team members (super_admin only)"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check permission
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not has_permission(admin.get("role", "data_entry"), "manage_team"):
        raise HTTPException(status_code=403, detail="You don't have permission to manage team")
    
    team = await db.admins.find({}, {"_id": 0, "password_hash": 0}).to_list(100)
    return team

@api_router.post("/admin/team")
async def create_team_member(member: TeamMemberCreate, current_user: User = Depends(get_current_user)):
    """Create a new team member (super_admin only)"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check permission
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not has_permission(admin.get("role", "data_entry"), "manage_team"):
        raise HTTPException(status_code=403, detail="You don't have permission to manage team")
    
    # Check if email already exists
    existing = await db.admins.find_one({"email": member.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Validate role
    if member.role not in ["super_admin", "content_manager", "data_entry"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Create team member
    new_member = AdminUser(
        email=member.email,
        name=member.name,
        password_hash=pwd_context.hash(member.password),
        role=member.role,
        job_title=member.job_title,
        is_active=True
    )
    
    member_dict = new_member.model_dump()
    member_dict['created_at'] = member_dict['created_at'].isoformat()
    await db.admins.insert_one(member_dict)
    
    # Return without password and _id (MongoDB adds _id during insert)
    member_dict.pop('password_hash', None)
    member_dict.pop('_id', None)
    return member_dict

@api_router.put("/admin/team/{member_id}")
async def update_team_member(member_id: str, update_data: dict, current_user: User = Depends(get_current_user)):
    """Update a team member (super_admin only)"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check permission
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not has_permission(admin.get("role", "data_entry"), "manage_team"):
        raise HTTPException(status_code=403, detail="You don't have permission to manage team")
    
    # Check if member exists
    member = await db.admins.find_one({"id": member_id})
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    # Prevent modifying own role
    if member_id == current_user.id and "role" in update_data:
        raise HTTPException(status_code=400, detail="Cannot modify your own role")
    
    # Hash password if being updated
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = pwd_context.hash(update_data["password"])
        del update_data["password"]
    
    # Remove password_hash if empty
    if "password" in update_data:
        del update_data["password"]
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.admins.update_one({"id": member_id}, {"$set": update_data})
    
    updated = await db.admins.find_one({"id": member_id}, {"_id": 0, "password_hash": 0})
    return updated

@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, current_user: User = Depends(get_current_user)):
    """Delete a team member (super_admin only)"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check permission
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not has_permission(admin.get("role", "data_entry"), "manage_team"):
        raise HTTPException(status_code=403, detail="You don't have permission to manage team")
    
    # Prevent self-deletion
    if member_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    result = await db.admins.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    return {"message": "Team member deleted successfully"}

@api_router.get("/admin/permissions")
async def get_my_permissions(current_user: User = Depends(get_current_user)):
    """Get current user's permissions"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0, "password_hash": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    role = admin.get("role", "data_entry")
    permissions = ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["data_entry"])
    
    return {
        "role": role,
        "role_display": role.replace("_", " ").title(),
        "permissions": permissions
    }

# ============================================
# Content Approval APIs
# ============================================

@api_router.get("/admin/pending-approvals")
async def get_pending_approvals(current_user: User = Depends(get_current_user)):
    """Get all content pending approval"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not can_approve_content(admin.get("role", "data_entry")):
        raise HTTPException(status_code=403, detail="You don't have permission to approve content")
    
    pending_items = []
    
    # Get pending colleges
    colleges = await db.colleges.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for c in colleges:
        pending_items.append({
            "id": c.get("id"),
            "type": "college",
            "type_label": c.get("institution_type", "College"),
            "name": c.get("name"),
            "submitted_by": c.get("created_by_name"),
            "submitted_at": c.get("submitted_at") or c.get("created_at"),
            "url": f"/admin/colleges?edit={c.get('id')}"
        })
    
    # Get pending listing pages
    listings = await db.listing_pages.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for l in listings:
        pending_items.append({
            "id": l.get("id"),
            "type": "listing_page",
            "type_label": "Listing Page",
            "name": l.get("page_title") or l.get("url_slug"),
            "submitted_by": l.get("created_by_name"),
            "submitted_at": l.get("submitted_at") or l.get("created_at"),
            "url": f"/admin/listing-pages?edit={l.get('id')}"
        })
    
    # Get pending news
    news = await db.news.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for n in news:
        pending_items.append({
            "id": n.get("id"),
            "type": "news",
            "type_label": "News Article",
            "name": n.get("title"),
            "submitted_by": n.get("created_by_name"),
            "submitted_at": n.get("submitted_at") or n.get("created_at"),
            "url": f"/admin/news?edit={n.get('id')}"
        })
    
    # Get pending courses
    courses = await db.courses_detailed.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for c in courses:
        pending_items.append({
            "id": c.get("id"),
            "type": "course",
            "type_label": "Course",
            "name": c.get("name"),
            "submitted_by": c.get("created_by_name"),
            "submitted_at": c.get("submitted_at") or c.get("created_at"),
            "url": f"/admin/courses-detail?edit={c.get('id')}"
        })
    
    # Get pending exams
    exams = await db.exams_detailed.find({"status": "pending"}, {"_id": 0}).to_list(100)
    for e in exams:
        pending_items.append({
            "id": e.get("id"),
            "type": "exam",
            "type_label": "Exam",
            "name": e.get("name"),
            "submitted_by": e.get("created_by_name"),
            "submitted_at": e.get("submitted_at") or e.get("created_at"),
            "url": f"/admin/exams-detail?edit={e.get('id')}"
        })
    
    # Sort by submitted_at descending
    pending_items.sort(key=lambda x: x.get("submitted_at") or "", reverse=True)
    
    return {
        "total": len(pending_items),
        "items": pending_items
    }

@api_router.post("/admin/approve/{content_type}/{content_id}")
async def approve_content(content_type: str, content_id: str, approval: ContentApproval, current_user: User = Depends(get_current_user)):
    """Approve or reject content"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not can_approve_content(admin.get("role", "data_entry")):
        raise HTTPException(status_code=403, detail="You don't have permission to approve content")
    
    # Map content type to collection
    collection_map = {
        "college": "colleges",
        "listing_page": "listing_pages",
        "news": "news",
        "course": "courses_detailed",
        "exam": "exams_detailed",
        "blog": "blogs"
    }
    
    collection_name = collection_map.get(content_type)
    if not collection_name:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    collection = db[collection_name]
    
    # Check if content exists
    content = await collection.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    if approval.action == "approve":
        update_data = {
            "status": "published",
            "is_published": True,
            "reviewed_by": current_user.id,
            "reviewed_by_name": current_user.name,
            "reviewed_at": now,
            "rejection_reason": None
        }
        message = "Content approved and published"
    elif approval.action == "reject":
        update_data = {
            "status": "rejected",
            "is_published": False,
            "reviewed_by": current_user.id,
            "reviewed_by_name": current_user.name,
            "reviewed_at": now,
            "rejection_reason": approval.comment or "No reason provided"
        }
        message = "Content rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'approve' or 'reject'")
    
    await collection.update_one({"id": content_id}, {"$set": update_data})
    
    return {"message": message, "status": update_data["status"]}

@api_router.post("/admin/submit-for-review/{content_type}/{content_id}")
async def submit_for_review(content_type: str, content_id: str, current_user: User = Depends(get_current_user)):
    """Submit content for review"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection_map = {
        "college": "colleges",
        "listing_page": "listing_pages",
        "news": "news",
        "course": "courses_detailed",
        "exam": "exams_detailed",
        "blog": "blogs"
    }
    
    collection_name = collection_map.get(content_type)
    if not collection_name:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    collection = db[collection_name]
    
    content = await collection.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    await collection.update_one(
        {"id": content_id},
        {"$set": {
            "status": "pending",
            "submitted_at": now,
            "rejection_reason": None
        }}
    )
    
    return {"message": "Content submitted for review", "status": "pending"}

@api_router.post("/admin/direct-publish/{content_type}/{content_id}")
async def direct_publish(content_type: str, content_id: str, current_user: User = Depends(get_current_user)):
    """Directly publish content (Super Admin only)"""
    if current_user.role != "admin" and current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    if not admin or not can_direct_publish(admin.get("role", "data_entry")):
        raise HTTPException(status_code=403, detail="Only Super Admins can directly publish content")
    
    collection_map = {
        "college": "colleges",
        "listing_page": "listing_pages",
        "news": "news",
        "course": "courses_detailed",
        "exam": "exams_detailed",
        "blog": "blogs"
    }
    
    collection_name = collection_map.get(content_type)
    if not collection_name:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    collection = db[collection_name]
    
    content = await collection.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    await collection.update_one(
        {"id": content_id},
        {"$set": {
            "status": "published",
            "is_published": True,
            "reviewed_by": current_user.id,
            "reviewed_by_name": current_user.name,
            "reviewed_at": now
        }}
    )
    
    return {"message": "Content published", "status": "published"}

# ============================================
# Image Optimization Helper
# ============================================

def optimize_image(file_content: bytes, image_type: str, max_size_kb: int = 500) -> bytes:
    """
    Resize and compress image to optimize for web
    
    Args:
        file_content: Original image bytes
        image_type: Type of image (logo, banner, campus)
        max_size_kb: Maximum file size in KB (default 500KB)
    
    Returns:
        Optimized image bytes
    """
    # Open image from bytes
    img = Image.open(io.BytesIO(file_content))
    
    # Convert RGBA to RGB if needed (for JPEG)
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Define max dimensions based on type
    # Recommended sizes:
    # - logo: 400x400 (square, ~50KB)
    # - banner: 1600x400 (wide, ~200KB)
    # - campus: 1200x900 (gallery, ~300KB)
    # - content: 800x600 (article images, ~150KB)
    # - seo: 1200x630 (OG images, ~200KB)
    if image_type == "logo":
        max_width, max_height = 400, 400  # Square logos
    elif image_type == "banner":
        max_width, max_height = 1600, 400  # Wide banners
    elif image_type == "content":
        max_width, max_height = 800, 600  # Article/content images
    elif image_type == "seo":
        max_width, max_height = 1200, 630  # OG images (social sharing)
    else:  # campus
        max_width, max_height = 1200, 900  # Standard gallery images
    
    # Resize image maintaining aspect ratio
    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    # Compress and save to bytes
    output = io.BytesIO()
    
    # Try different quality levels to meet size target
    for quality in [85, 75, 65, 55]:
        output.seek(0)
        output.truncate()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        
        size_kb = output.tell() / 1024
        if size_kb <= max_size_kb or quality == 55:
            break
    
    return output.getvalue()

# ============================================
# File Upload Routes
# ============================================

@api_router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    type: str = Query(..., description="Type: logo, banner, or campus"),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Upload an image file (logo, banner, or campus gallery) - Admin/Content Manager access"""
    # Verify token and role
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role", "")
        # Allow admin, content_manager, data_entry, and super_admin roles
        allowed_roles = ["admin", "super_admin", "content_manager", "data_entry"]
        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied. Required roles: admin, content_manager, or data_entry")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Validate type parameter
    valid_types = ["logo", "banner", "campus", "content", "seo", "profile"]
    if type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Type must be one of: {', '.join(valid_types)}")
    
    # Read file content
    file_content = await file.read()
    
    # Optimize image (resize and compress)
    try:
        optimized_content = optimize_image(file_content, type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")
    
    # Generate unique filename (always use .jpg for optimized images)
    unique_filename = f"{uuid.uuid4()}.jpg"
    
    # Determine upload directory
    type_to_dir = {
        "logo": "logos",
        "banner": "banners", 
        "campus": "campus",
        "content": "content",
        "seo": "seo"
    }
    upload_subdir = type_to_dir.get(type, "content")
    file_path = UPLOAD_DIR / upload_subdir / unique_filename
    
    # Save optimized file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(optimized_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the URL with /api prefix for Kubernetes ingress routing
    file_url = f"/api/static/uploads/{upload_subdir}/{unique_filename}"
    
    return {
        "success": True,
        "url": file_url,
        "filename": unique_filename,
        "type": type
    }


@api_router.post("/upload/images/bulk")
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    type: str = Query(..., description="Type: campus"),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Upload multiple image files for campus gallery - Admin only"""
    # Verify admin token
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate type parameter
    if type not in ["campus"]:
        raise HTTPException(status_code=400, detail="Bulk upload only supported for 'campus' type")
    
    uploaded_files = []
    failed_files = []
    
    for file in files:
        try:
            # Validate file type
            if not file.content_type or not file.content_type.startswith("image/"):
                failed_files.append({"filename": file.filename, "error": "Not an image file"})
                continue
            
            # Read and optimize image
            file_content = await file.read()
            optimized_content = optimize_image(file_content, "campus")
            
            # Generate unique filename (always .jpg for optimized)
            unique_filename = f"{uuid.uuid4()}.jpg"
            
            # Save optimized file
            upload_subdir = "campus"
            file_path = UPLOAD_DIR / upload_subdir / unique_filename
            
            with open(file_path, "wb") as buffer:
                buffer.write(optimized_content)
            
            # Use /api prefix for Kubernetes ingress routing
            file_url = f"/api/static/uploads/{upload_subdir}/{unique_filename}"
            uploaded_files.append({
                "original_name": file.filename,
                "url": file_url,
                "filename": unique_filename
            })
            
        except Exception as e:
            failed_files.append({"filename": file.filename, "error": str(e)})
    
    return {
        "success": True,
        "uploaded": len(uploaded_files),
        "failed": len(failed_files),
        "files": uploaded_files,
        "errors": failed_files
    }





@api_router.post("/upload/brochure")
async def upload_brochure(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Upload a brochure file (PDF, DOC, DOCX) - Admin only"""
    # Verify admin token
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate file type (PDF, DOC, DOCX)
    allowed_types = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if not file.content_type or file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, DOC, or DOCX files are allowed")
    
    # Read file content
    file_content = await file.read()
    
    # Generate unique filename
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    
    # Save to brochures directory
    file_path = UPLOAD_DIR / "brochures" / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the URL with /api prefix for Kubernetes ingress routing
    file_url = f"/api/static/uploads/brochures/{unique_filename}"
    
    return {
        "success": True,
        "url": file_url,
        "filename": unique_filename,
        "original_name": file.filename,
        "file_type": file_ext
    }

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: User = Depends(get_current_user)):
    """Get platform statistics for admin dashboard"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    total_colleges = await db.colleges.count_documents({})
    total_schools = await db.schools.count_documents({})
    total_universities = await db.universities.count_documents({})
    total_users = await db.users.count_documents({})
    total_reviews = await db.reviews.count_documents({})
    total_exams = await db.exams.count_documents({})
    total_courses = await db.courses.count_documents({})
    total_news = await db.news.count_documents({})
    
    return {
        "total_colleges": total_colleges,
        "total_schools": total_schools,
        "total_universities": total_universities,
        "total_users": total_users,
        "total_reviews": total_reviews,
        "total_exams": total_exams,
        "total_courses": total_courses,
        "total_news": total_news
    }

# ============================================
# College Routes
# ============================================

@api_router.get("/")
async def root():
    return {"message": "Sikshapedia API - College Discovery Platform"}

@api_router.post("/colleges/assign-serial-numbers")
async def assign_serial_numbers():
    """Assign unique serial numbers to all colleges that don't have one"""
    # Get all colleges without serial_number, sorted by created_at
    colleges = await db.colleges.find(
        {"$or": [{"serial_number": {"$exists": False}}, {"serial_number": None}]},
        {"_id": 0, "id": 1}
    ).sort("created_at", 1).to_list(1000)
    
    if not colleges:
        return {"message": "All colleges already have serial numbers", "updated": 0}
    
    # Get current max serial number
    max_doc = await db.colleges.find_one(
        {"serial_number": {"$exists": True, "$ne": None}},
        {"serial_number": 1},
        sort=[("serial_number", -1)]
    )
    current_max = max_doc.get("serial_number", 0) if max_doc else 0
    
    # Assign serial numbers
    updated_count = 0
    for college in colleges:
        current_max += 1
        await db.colleges.update_one(
            {"id": college["id"]},
            {"$set": {"serial_number": current_max}}
        )
        updated_count += 1
    
    return {"message": f"Assigned serial numbers to {updated_count} colleges", "updated": updated_count}

# Minimal projection for listing pages - reduces payload by ~80%
COLLEGE_MINIMAL_PROJECTION = {
    "_id": 0, "id": 1, "name": 1, "slug": 1, "serial_number": 1,
    "institution_type": 1, "type": 1, "location": 1, "logo_url": 1,
    "rating": 1, "average_fees": 1, "courses": 1, "is_featured": 1,
    "is_admission_open": 1, "is_admission_partner": 1, "is_no_cost_emi": 1,
    "is_verified": 1, "display_priority": 1, "state_priority": 1,
    "city_priority": 1, "accreditation": 1, "ranking": 1, "established_year": 1
}

@api_router.get("/colleges")
async def get_colleges(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    type: Optional[str] = None,
    institution_type: Optional[str] = None,  # College, School, University
    stream: Optional[str] = None,  # Engineering, Medical, etc.
    sub_stream: Optional[str] = None,  # Computer Science, Mechanical, etc.
    min_fees: Optional[float] = None,
    max_fees: Optional[float] = None,
    course: Optional[str] = None,
    sort_by: Optional[str] = Query("nirf_ranking", regex="^(name|nirf_ranking|average_fees|rating)$"),
    include_drafts: Optional[str] = Query(None),  # Admin can set to "true" to see drafts
    is_featured: Optional[bool] = None,  # Filter by featured status
    is_admission_open: Optional[bool] = None,  # Filter by admission open status
    fields: Optional[str] = Query(None)  # "minimal" for listing pages, None for full data
):
    query = {}
    
    # Only show published colleges on frontend (unless admin requests drafts)
    # Handle both string "true" and boolean True
    show_drafts = include_drafts and include_drafts.lower() == "true"
    if not show_drafts:
        query["status"] = "published"
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if city:
        query["location.city"] = {"$regex": city, "$options": "i"}
    
    if state:
        query["location.state"] = {"$regex": state, "$options": "i"}
    
    if type:
        query["type"] = type
    
    # Filter by institution type (College, School, University)
    if institution_type:
        query["institution_type"] = {"$regex": f"^{institution_type}$", "$options": "i"}
    
    # Filter by stream (searches in courses array)
    if stream:
        # Match stream in courses array or description
        query["$or"] = query.get("$or", []) + [
            {"courses": {"$regex": stream, "$options": "i"}},
            {"description": {"$regex": stream, "$options": "i"}}
        ]
    
    # Filter by sub-stream
    if sub_stream:
        sub_stream_conditions = [
            {"courses": {"$regex": sub_stream, "$options": "i"}},
            {"description": {"$regex": sub_stream, "$options": "i"}}
        ]
        if "$or" in query:
            # Combine with AND logic
            query["$and"] = [{"$or": query.pop("$or")}, {"$or": sub_stream_conditions}]
        else:
            query["$or"] = sub_stream_conditions
    
    if min_fees is not None or max_fees is not None:
        query["average_fees"] = {}
        if min_fees is not None:
            query["average_fees"]["$gte"] = min_fees
        if max_fees is not None:
            query["average_fees"]["$lte"] = max_fees
    
    if course:
        query["courses.name"] = {"$regex": course, "$options": "i"}
    
    # Filter by featured status
    if is_featured is not None:
        query["is_featured"] = is_featured
    
    # Filter by admission open status
    if is_admission_open is not None:
        query["is_admission_open"] = is_admission_open
    
    sort_order = 1 if sort_by == "name" else 1 if sort_by == "nirf_ranking" else -1
    
    # Define projection based on fields parameter
    projection = COLLEGE_MINIMAL_PROJECTION if fields == "minimal" else {"_id": 0}
    
    # Fetch colleges
    colleges = await db.colleges.find(query, projection).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
    
    # Apply location-specific priority sorting
    def get_priority(college):
        # Check city priority first (most specific)
        if city and college.get('city_priority', {}).get(city, 0) > 0:
            return college['city_priority'][city]
        # Then state priority
        if state and college.get('state_priority', {}).get(state, 0) > 0:
            return college['state_priority'][state]
        # Finally national/default priority
        return college.get('display_priority', 0)
    
    # Separate prioritized and non-prioritized
    prioritized = [c for c in colleges if get_priority(c) > 0]
    non_prioritized = [c for c in colleges if get_priority(c) == 0]
    
    # Sort prioritized by their priority (lower number = first)
    prioritized.sort(key=lambda x: get_priority(x))
    
    colleges = prioritized + non_prioritized
    
    # Return minimal data directly without model conversion for better performance
    if fields == "minimal":
        return colleges
    
    # Full data - convert through model for validation
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return [College(**college) for college in colleges]

@api_router.get("/colleges/featured")
async def get_featured_colleges(limit: int = Query(12, ge=1, le=50), fields: Optional[str] = Query(None)):
    """
    Get featured colleges for homepage display.
    Priority: 
      1) Colleges from homepage settings featured_colleges_ids (in exact order)
      2) Colleges marked as is_featured=True (sorted by featured_at desc)
      3) Fallback to top colleges by NIRF ranking
    """
    projection = COLLEGE_MINIMAL_PROJECTION if fields == "minimal" else {"_id": 0}
    
    # First check homepage settings for manually selected colleges
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_colleges_ids", []) if settings else []
    
    featured_colleges = []
    
    # Get colleges from homepage settings (in specified order)
    if featured_ids:
        for college_id in featured_ids[:limit]:
            college = await db.colleges.find_one({"id": college_id, "status": "published"}, projection)
            if college:
                featured_colleges.append(college)
    
    # If not enough, get colleges marked as is_featured
    if len(featured_colleges) < limit:
        existing_ids = [c.get('id') for c in featured_colleges]
        additional = await db.colleges.find(
            {"status": "published", "is_featured": True, "id": {"$nin": existing_ids}}, 
            projection
        ).sort("featured_at", -1).limit(limit - len(featured_colleges)).to_list(limit - len(featured_colleges))
        featured_colleges.extend(additional)
    
    # If still not enough, fill with top ranked colleges
    if len(featured_colleges) < limit:
        existing_ids = [c.get('id') for c in featured_colleges]
        additional = await db.colleges.find(
            {"status": "published", "id": {"$nin": existing_ids}}, 
            projection
        ).sort("nirf_ranking", 1).limit(limit - len(featured_colleges)).to_list(limit - len(featured_colleges))
        featured_colleges.extend(additional)
    
    return featured_colleges

@api_router.get("/colleges/featured-priority", response_model=List[College])
async def get_featured_priority_colleges(limit: int = Query(6, ge=1, le=20)):
    """
    Get featured colleges sorted by priority:
    - Colleges within their priority period (default 2 months) appear first, sorted by featured_at (newest first)
    - After priority period expires, sorted by nirf_ranking
    """
    # Get all featured published colleges
    colleges = await db.colleges.find(
        {"status": "published", "is_featured": True}, 
        {"_id": 0}
    ).to_list(100)
    
    now = datetime.now(timezone.utc)
    priority_colleges = []
    regular_colleges = []
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
        
        featured_at = college.get('featured_at')
        priority_months = college.get('featured_priority_months', 2)
        
        # Check if within priority period
        if featured_at:
            if isinstance(featured_at, str):
                featured_at = datetime.fromisoformat(featured_at.replace('Z', '+00:00'))
            if not featured_at.tzinfo:
                featured_at = featured_at.replace(tzinfo=timezone.utc)
            
            months_passed = (now - featured_at).days / 30
            if months_passed <= priority_months:
                priority_colleges.append((college, featured_at))
            else:
                regular_colleges.append(college)
        else:
            regular_colleges.append(college)
    
    # Sort priority colleges by featured_at (newest first)
    priority_colleges.sort(key=lambda x: x[1], reverse=True)
    priority_colleges = [c[0] for c in priority_colleges]
    
    # Sort regular colleges by nirf_ranking
    regular_colleges.sort(key=lambda x: x.get('nirf_ranking') or 9999)
    
    # Combine: priority first, then regular
    result = priority_colleges + regular_colleges
    
    return [College(**college) for college in result[:limit]]

@api_router.get("/colleges/by-stream-featured")
async def get_colleges_by_stream_featured():
    """Get featured colleges by stream for homepage - prioritizes admin-selected colleges"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    stream_colleges = settings.get("stream_colleges", {}) if settings else {}
    
    streams = ["Engineering", "Medical", "Management", "Law"]
    result = {}
    
    for stream in streams:
        college_ids = stream_colleges.get(stream, [])
        colleges = []
        
        # Get admin-selected colleges first
        if college_ids:
            for cid in college_ids[:4]:
                college = await db.colleges.find_one({"id": cid, "status": "published"}, {"_id": 0, "name": 1, "id": 1})
                if college:
                    colleges.append(college.get("name", ""))
        
        # If not enough, fetch from database by stream
        if len(colleges) < 4:
            additional = await db.colleges.find(
                {"status": "published", "type": {"$regex": stream, "$options": "i"}},
                {"_id": 0, "name": 1}
            ).limit(4 - len(colleges)).to_list(4 - len(colleges))
            colleges.extend([c.get("name", "") for c in additional])
        
        result[stream] = colleges[:4]
    
    return result

@api_router.get("/colleges/admission-open-priority", response_model=List[College])
async def get_admission_open_priority_colleges(limit: int = Query(6, ge=1, le=20)):
    """
    Get admission open colleges sorted by priority:
    - Colleges within their priority period (default 2 months) appear first, sorted by admission_open_at (newest first)
    - After priority period expires, sorted by nirf_ranking
    """
    # Get all admission open published colleges
    colleges = await db.colleges.find(
        {"status": "published", "is_admission_open": True}, 
        {"_id": 0}
    ).to_list(100)
    
    now = datetime.now(timezone.utc)
    priority_colleges = []
    regular_colleges = []
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
        
        admission_open_at = college.get('admission_open_at')
        priority_months = college.get('admission_open_priority_months', 2)
        
        # Check if within priority period
        if admission_open_at:
            if isinstance(admission_open_at, str):
                admission_open_at = datetime.fromisoformat(admission_open_at.replace('Z', '+00:00'))
            if not admission_open_at.tzinfo:
                admission_open_at = admission_open_at.replace(tzinfo=timezone.utc)
            
            months_passed = (now - admission_open_at).days / 30
            if months_passed <= priority_months:
                priority_colleges.append((college, admission_open_at))
            else:
                regular_colleges.append(college)
        else:
            regular_colleges.append(college)
    
    # Sort priority colleges by admission_open_at (newest first)
    priority_colleges.sort(key=lambda x: x[1], reverse=True)
    priority_colleges = [c[0] for c in priority_colleges]
    
    # Sort regular colleges by nirf_ranking
    regular_colleges.sort(key=lambda x: x.get('nirf_ranking') or 9999)
    
    # Combine: priority first, then regular
    result = priority_colleges + regular_colleges
    
    return [College(**college) for college in result[:limit]]

# ========== SPONSORED ADS MANAGEMENT ==========

class SponsoredCollegeEntry(BaseModel):
    college_id: str
    college_name: str
    college_logo: Optional[str] = None
    college_location: Optional[str] = None
    college_type: Optional[str] = None
    college_nirf: Optional[int] = None
    college_rating: Optional[float] = None
    college_fees: Optional[float] = None
    serial_order: int = 1
    start_date: str  # ISO date string
    end_date: str    # ISO date string
    is_active: bool = True

# SponsoredAdsConfig, Multi-placement ads, and Advertisement models moved to routes/sponsored_ads.py

@api_router.get("/colleges/{college_id}", response_model=College)
async def get_college(college_id: str):
    college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    if isinstance(college.get('created_at'), str):
        college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return College(**college)

@api_router.post("/colleges", response_model=College)
async def create_college(college_data: CollegeCreate, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create colleges")
    
    # Auto-assign serial number (find max and increment)
    max_serial = await db.colleges.find_one(
        {"serial_number": {"$exists": True}},
        {"serial_number": 1},
        sort=[("serial_number", -1)]
    )
    next_serial = (max_serial.get("serial_number", 0) if max_serial else 0) + 1
    
    # Get admin role to determine initial status
    admin = await db.admins.find_one({"id": current_user.id}, {"_id": 0})
    admin_role = admin.get("role", "data_entry") if admin else "data_entry"
    
    # Super admin can publish directly, others create as draft
    initial_status = "draft"
    
    college = College(
        **college_data.model_dump(), 
        total_courses=len(college_data.courses), 
        serial_number=next_serial,
        status=initial_status,
        created_by=current_user.id,
        created_by_name=current_user.name,
        created_by_photo=current_user.profile_photo,
        updated_by=current_user.id,
        updated_by_name=current_user.name,
        updated_by_photo=current_user.profile_photo
    )
    college_dict = college.model_dump()
    college_dict['created_at'] = college_dict['created_at'].isoformat()
    college_dict['updated_at'] = college_dict['updated_at'].isoformat()
    
    await db.colleges.insert_one(college_dict)
    
    # Generate institute credentials if contact info available
    try:
        from routes.institute_auth import create_institute_credentials
        contact = getattr(college_data, 'contact', None) or {}
        contact_email = contact.get('email', '') if isinstance(contact, dict) else ''
        contact_phone = contact.get('phone', '') if isinstance(contact, dict) else ''
        if contact_email or contact_phone:
            await create_institute_credentials(
                db, 
                college.id, 
                college.name, 
                contact_email, 
                contact_phone,
                background_tasks
            )
            logging.info(f"✅ Institute credentials created for {college.name}")
    except Exception as e:
        logging.warning(f"⚠️ Could not create institute credentials: {e}")
    
    return college

@api_router.put("/colleges/{college_id}", response_model=College)
async def update_college(college_id: str, college_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update colleges")
    
    existing_college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not existing_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Update the college with user tracking
    college_data['total_courses'] = len(college_data.get('courses', []))
    college_data['updated_by'] = current_user.id
    college_data['updated_by_name'] = current_user.name
    college_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.colleges.update_one({"id": college_id}, {"$set": college_data})
    
    # Fetch and return updated college
    updated_college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    return College(**updated_college)

@api_router.delete("/colleges/{college_id}")
async def delete_college(college_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete colleges")
    
    result = await db.colleges.delete_one({"id": college_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="College not found")
    
    return {"message": "College deleted successfully"}

@api_router.post("/colleges/{college_id}/generate-credentials")
async def generate_college_credentials(college_id: str, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)):
    """Generate institute login credentials for an existing college"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can generate credentials")
    
    college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Check if credentials already exist
    existing = await db.institute_credentials.find_one({"institution_id": college_id}, {"_id": 0})
    if existing:
        return {"message": "Credentials already exist", "login_id": existing.get("login_id")}
    
    try:
        from routes.institute_auth import create_institute_credentials
        contact = college.get('contact') or {}
        contact_email = contact.get('email', '') if isinstance(contact, dict) else ''
        contact_phone = contact.get('phone', '') if isinstance(contact, dict) else ''
        
        credentials = await create_institute_credentials(
            db, 
            college_id, 
            college.get('name', 'Unknown Institution'), 
            contact_email, 
            contact_phone,
            background_tasks
        )
        
        return {
            "message": "Credentials generated successfully",
            "login_id": credentials.get("login_id"),
            "password": credentials.get("password"),  # Only shown once
            "note": "Credentials have been sent via email and WhatsApp if contact info was available"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating credentials: {str(e)}")

@api_router.get("/admin/credential-reports")
async def get_all_credential_reports(current_user: User = Depends(get_current_user)):
    """Get all credential reports (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view credential reports")
    
    reports = await db.credential_reports.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return reports

# ============================================
# Review Routes
# ============================================

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: User = Depends(get_current_user)):
    college = await db.colleges.find_one({"id": review_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    existing_review = await db.reviews.find_one({
        "college_id": review_data.college_id,
        "user_id": current_user.id
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this college")
    
    # Calculate review earnings based on review quality
    review_earnings = 50.0  # Base earning for review
    if review_data.review_text and len(review_data.review_text) > 200:
        review_earnings = 100.0  # Higher earning for detailed reviews
    
    review = Review(
        **review_data.model_dump(), 
        user_id=current_user.id, 
        user_name=current_user.name,
        earnings=review_earnings,
        status="approved"  # Auto-approve for now
    )
    review_dict = review.model_dump()
    review_dict['created_at'] = review_dict['created_at'].isoformat()
    
    await db.reviews.insert_one(review_dict)
    
    # Add earnings transaction
    earning_transaction = EarningTransaction(
        user_id=current_user.id,
        type="review",
        amount=review_earnings,
        description=f"Review for {college['name']}",
        reference_id=review.id
    )
    earn_dict = earning_transaction.model_dump()
    earn_dict['created_at'] = earn_dict['created_at'].isoformat()
    await db.earnings.insert_one(earn_dict)
    
    # Update user total earnings
    await db.users.update_one(
        {"id": current_user.id},
        {"$inc": {"total_earnings": review_earnings}}
    )
    
    # Create notification
    notification = Notification(
        user_id=current_user.id,
        type="review_earning",
        title="Review Earnings Added!",
        message=f"You earned ₹{review_earnings} for your review. Keep writing quality reviews to earn more!",
        link="/dashboard"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    # Update college rating
    reviews = await db.reviews.find({"college_id": review_data.college_id}).to_list(1000)
    avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
    
    # Update rating breakdown
    rating_breakdown = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    for r in reviews:
        rating_breakdown[str(r['rating'])] += 1
    
    await db.colleges.update_one(
        {"id": review_data.college_id},
        {"$set": {
            "rating": round(avg_rating, 1),
            "total_reviews": len(reviews),
            "rating_breakdown": rating_breakdown
        }}
    )
    
    return review

@api_router.get("/reviews/college/{college_id}", response_model=List[Review])
async def get_college_reviews(college_id: str, skip: int = 0, limit: int = 20):
    reviews = await db.reviews.find({"college_id": college_id}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews

# ============================================
# Q&A Routes
# ============================================

@api_router.post("/questions", response_model=Question)
async def create_question(question_data: QuestionCreate, current_user: User = Depends(get_current_user)):
    college = await db.colleges.find_one({"id": question_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    question = Question(**question_data.model_dump(), user_id=current_user.id, user_name=current_user.name)
    question_dict = question.model_dump()
    question_dict['created_at'] = question_dict['created_at'].isoformat()
    
    await db.questions.insert_one(question_dict)
    return question

@api_router.get("/questions/college/{college_id}", response_model=List[Question])
async def get_college_questions(college_id: str, skip: int = 0, limit: int = 20):
    questions = await db.questions.find({"college_id": college_id}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for question in questions:
        if isinstance(question.get('created_at'), str):
            question['created_at'] = datetime.fromisoformat(question['created_at'])
    
    return questions

@api_router.post("/questions/answer")
async def create_answer(answer_data: AnswerCreate, current_user: User = Depends(get_current_user)):
    question = await db.questions.find_one({"id": answer_data.question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    answer = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "user_name": current_user.name,
        "answer": answer_data.answer,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.questions.update_one(
        {"id": answer_data.question_id},
        {"$push": {"answers": answer}}
    )
    
    return {"message": "Answer added successfully", "answer": answer}

# ============================================
# Inquiry Routes
# ============================================

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    college = await db.colleges.find_one({"id": inquiry_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    inquiry = Inquiry(**inquiry_data.model_dump())
    inquiry_dict = inquiry.model_dump()
    inquiry_dict['created_at'] = inquiry_dict['created_at'].isoformat()
    
    await db.inquiries.insert_one(inquiry_dict)
    return inquiry

# ============================================
# User Actions
# ============================================

@api_router.post("/users/save-college/{college_id}")
async def save_college(college_id: str, current_user: User = Depends(get_current_user)):
    college = await db.colleges.find_one({"id": college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    await db.users.update_one(
        {"id": current_user.id},
        {"$addToSet": {"saved_colleges": college_id}}
    )
    
    return {"message": "College saved successfully"}

@api_router.delete("/users/save-college/{college_id}")
async def unsave_college(college_id: str, current_user: User = Depends(get_current_user)):
    await db.users.update_one(
        {"id": current_user.id},
        {"$pull": {"saved_colleges": college_id}}
    )
    
    return {"message": "College removed from saved list"}

@api_router.get("/users/saved-colleges", response_model=List[College])
async def get_saved_colleges(current_user: User = Depends(get_current_user)):
    colleges = await db.colleges.find({"id": {"$in": current_user.saved_colleges}}, {"_id": 0}).to_list(100)
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return colleges

# ============================================
# Exam Listing Page Settings Routes
# ============================================

@api_router.get("/exam-listing-settings")
async def get_exam_listing_settings():
    """Get exam listing page settings (public)"""
    settings = await db.exam_listing_settings.find_one({"id": "exam-listing-page"}, {"_id": 0})
    if not settings:
        # Return default settings if none exist
        default_settings = ExamListingPageSettings()
        return default_settings.model_dump()
    return settings

@api_router.get("/course-listing-settings")
async def get_course_listing_settings():
    """Get course listing page settings (public)"""
    settings = await db.course_listing_settings.find_one({"id": "course-listing-page"}, {"_id": 0})
    if not settings:
        # Return default settings if none exist
        default_settings = CourseListingPageSettings()
        return default_settings.model_dump()
    return settings

@api_router.put("/course-listing-settings")
async def update_course_listing_settings(
    settings: CourseListingPageSettings,
    current_user: User = Depends(get_current_user)
):
    """Update course listing page settings (admin only)"""
    # Check if user is admin
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    settings.id = "course-listing-page"  # Ensure singleton ID
    settings.updated_at = datetime.now(timezone.utc)
    settings.updated_by = current_user.email
    
    settings_dict = settings.model_dump()
    
    # Upsert - create if not exists, update if exists
    await db.course_listing_settings.update_one(
        {"id": "course-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    
    return settings_dict


# ============================================
# Course Page Settings APIs (Individual Pages)
# ============================================

@api_router.get("/course-pages")
async def get_all_course_pages():
    """Get all course page configurations"""
    # Get all pages from database
    db_pages = await db.course_page_settings.find({}, {"_id": 0}).to_list(100)
    
    # Create a map of existing pages
    db_pages_map = {p["id"]: p for p in db_pages}
    
    # Merge with defaults to ensure all pages are returned
    all_pages = []
    for page_id, default_config in DEFAULT_COURSE_PAGE_CONFIGS.items():
        if page_id in db_pages_map:
            # Use database version
            all_pages.append(db_pages_map[page_id])
        else:
            # Use default with id
            page_data = {"id": page_id, **default_config}
            all_pages.append(page_data)
    
    return all_pages


@api_router.get("/course-pages/{page_id}")
async def get_course_page(page_id: str):
    """Get a specific course page configuration"""
    # Try to get from database first
    page = await db.course_page_settings.find_one({"id": page_id}, {"_id": 0})
    
    if page:
        return page
    
    # Fall back to default if exists
    if page_id in DEFAULT_COURSE_PAGE_CONFIGS:
        return {"id": page_id, **DEFAULT_COURSE_PAGE_CONFIGS[page_id]}
    
    raise HTTPException(status_code=404, detail="Course page not found")


@api_router.put("/course-pages/{page_id}")
async def update_course_page(
    page_id: str,
    settings: CoursePageSettings,
    current_user: User = Depends(get_current_user)
):
    """Update a course page configuration (admin only)"""
    # Check if user is admin
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    settings.id = page_id
    settings.updated_at = datetime.now(timezone.utc)
    settings.updated_by = current_user.email
    
    settings_dict = settings.model_dump()
    
    # Upsert the page settings
    await db.course_page_settings.update_one(
        {"id": page_id},
        {"$set": settings_dict},
        upsert=True
    )
    
    return settings_dict


@api_router.post("/course-pages/{page_id}/reset")
async def reset_course_page(
    page_id: str,
    current_user: User = Depends(get_current_user)
):
    """Reset a course page to default configuration"""
    # Check if user is admin
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if page_id not in DEFAULT_COURSE_PAGE_CONFIGS:
        raise HTTPException(status_code=404, detail="Default configuration not found")
    
    # Delete custom settings
    await db.course_page_settings.delete_one({"id": page_id})
    
    return {"id": page_id, **DEFAULT_COURSE_PAGE_CONFIGS[page_id]}


@api_router.put("/exam-listing-settings")
async def update_exam_listing_settings(
    settings: ExamListingPageSettings,
    current_user: User = Depends(get_current_user)
):
    """Update exam listing page settings (admin only)"""
    # Check if user is admin
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    settings.id = "exam-listing-page"  # Ensure singleton ID
    settings.updated_at = datetime.now(timezone.utc)
    settings.updated_by = current_user.email
    
    settings_dict = settings.model_dump()
    
    # Upsert - create if not exists, update if exists
    await db.exam_listing_settings.update_one(
        {"id": "exam-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    
    return settings_dict


# ============================================
# News Listing Page Settings Routes
# ============================================

@api_router.get("/news-listing-settings")
async def get_news_listing_settings():
    """Get news listing page settings (public)"""
    settings = await db.news_listing_settings.find_one({"id": "news-listing-page"}, {"_id": 0})
    if not settings:
        # Return default settings if none exist
        default_settings = NewsListingPageSettings()
        return default_settings.model_dump()
    return settings


@api_router.put("/news-listing-settings")
async def update_news_listing_settings(
    settings: NewsListingPageSettings,
    current_user: User = Depends(get_current_user)
):
    """Update news listing page settings (admin only)"""
    # Check if user is admin
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    settings.id = "news-listing-page"  # Ensure singleton ID
    settings.updated_at = datetime.now(timezone.utc)
    settings.updated_by = current_user.email
    
    settings_dict = settings.model_dump()
    
    # Upsert - create if not exists, update if exists
    await db.news_listing_settings.update_one(
        {"id": "news-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    
    return settings_dict


# ============================================
# Blog Listing Page Settings Routes
# ============================================

@api_router.get("/blog-listing-settings")
async def get_blog_listing_settings():
    """Get blog listing page settings (public)"""
    settings = await db.blog_listing_settings.find_one({"id": "blog-listing-page"}, {"_id": 0})
    if not settings:
        default_settings = BlogListingPageSettings()
        return default_settings.model_dump()
    return settings


@api_router.put("/blog-listing-settings")
async def update_blog_listing_settings(
    settings: BlogListingPageSettings,
    current_user: User = Depends(get_current_user)
):
    """Update blog listing page settings (admin only)"""
    admin = await db.admins.find_one({"email": current_user.email})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    settings.id = "blog-listing-page"
    settings.updated_at = datetime.now(timezone.utc)
    settings.updated_by = current_user.email
    
    settings_dict = settings.model_dump()
    
    await db.blog_listing_settings.update_one(
        {"id": "blog-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    
    return settings_dict


# ============================================
# Loans Listing Page Settings
# ============================================

class LoansListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "loans-listing-page"
    hero_title: str = "Education Loans"
    hero_subtitle: str = "Find the best education loan options for your studies"
    hero_bg_gradient: str = "from-blue-600 to-indigo-700"
    stats: List[Dict[str, Any]] = []
    loan_types: List[Dict[str, Any]] = []
    show_calculator: bool = True
    calculator_title: str = "EMI Calculator"
    show_eligibility_checker: bool = True
    eligibility_title: str = "Check Your Eligibility"
    cta_title: str = "Need Help Choosing?"
    cta_subtitle: str = "Our experts can help you find the right loan"
    cta_button_text: str = "Get Free Consultation"
    cta_button_link: str = "/contact"
    meta_title: str = "Education Loans - Compare & Apply | Admissionbuddy"
    meta_description: str = "Compare education loans from top banks."
    meta_keywords: List[str] = []
    faqs: List[Dict[str, Any]] = []
    updated_at: Optional[datetime] = None

@api_router.get("/loans-listing-settings")
async def get_loans_listing_settings():
    settings = await db.loans_listing_settings.find_one({"id": "loans-listing-page"}, {"_id": 0})
    if not settings:
        return LoansListingPageSettings().model_dump()
    return settings

@api_router.put("/loans-listing-settings")
async def update_loans_listing_settings(settings: LoansListingPageSettings):
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.loans_listing_settings.update_one(
        {"id": "loans-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict


# ============================================
# Scholarships Listing Page Settings
# ============================================

class ScholarshipsListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "scholarships-listing-page"
    hero_title: str = "Scholarships & Financial Aid"
    hero_subtitle: str = "Find scholarships to fund your education dreams"
    hero_bg_gradient: str = "from-green-600 to-teal-600"
    stats: List[Dict[str, Any]] = []
    scholarship_types: List[Dict[str, Any]] = []
    education_levels: List[Dict[str, Any]] = []
    show_deadline_filter: bool = True
    show_amount_filter: bool = True
    cta_title: str = "Need Help Finding Scholarships?"
    cta_subtitle: str = "Our experts can guide you to the right opportunities"
    cta_button_text: str = "Get Free Guidance"
    cta_button_link: str = "/contact"
    meta_title: str = "Scholarships 2025 - Find & Apply | Admissionbuddy"
    meta_description: str = "Discover 500+ scholarships for Indian students."
    meta_keywords: List[str] = []
    faqs: List[Dict[str, Any]] = []
    updated_at: Optional[datetime] = None

@api_router.get("/scholarships-listing-settings")
async def get_scholarships_listing_settings():
    settings = await db.scholarships_listing_settings.find_one({"id": "scholarships-listing-page"}, {"_id": 0})
    if not settings:
        return ScholarshipsListingPageSettings().model_dump()
    return settings

@api_router.put("/scholarships-listing-settings")
async def update_scholarships_listing_settings(settings: ScholarshipsListingPageSettings):
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.scholarships_listing_settings.update_one(
        {"id": "scholarships-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict


# ============================================
# Study Materials Listing Page Settings
# ============================================

class StudyMaterialsListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "study-materials-listing-page"
    hero_title: str = "Study Materials"
    hero_subtitle: str = "Free notes, sample papers, and mock tests"
    hero_bg_gradient: str = "from-purple-600 to-indigo-700"
    stats: List[Dict[str, Any]] = []
    material_types: List[Dict[str, Any]] = []
    exam_categories: List[Dict[str, Any]] = []
    show_filters: bool = True
    show_premium_badge: bool = True
    premium_cta_text: str = "Unlock Premium Materials"
    cta_title: str = "Need More Resources?"
    cta_subtitle: str = "Get access to premium study materials"
    cta_button_text: str = "Upgrade to Premium"
    cta_button_link: str = "/premium"
    meta_title: str = "Study Materials - Free Notes & Mock Tests | Admissionbuddy"
    meta_description: str = "Download free study materials for competitive exams."
    meta_keywords: List[str] = []
    faqs: List[Dict[str, Any]] = []
    updated_at: Optional[datetime] = None

@api_router.get("/study-materials-listing-settings")
async def get_study_materials_listing_settings():
    settings = await db.study_materials_listing_settings.find_one({"id": "study-materials-listing-page"}, {"_id": 0})
    if not settings:
        return StudyMaterialsListingPageSettings().model_dump()
    return settings

@api_router.put("/study-materials-listing-settings")
async def update_study_materials_listing_settings(settings: StudyMaterialsListingPageSettings):
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.study_materials_listing_settings.update_one(
        {"id": "study-materials-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict


# ============================================
# Study Materials CRUD
# ============================================

class StudyMaterial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    exam_name: str
    subject: str
    material_type: str  # Notes, Sample Paper, Previous Year, Mock Test, Video
    description: str
    file_url: Optional[str] = None
    external_link: Optional[str] = None
    thumbnail: Optional[str] = None
    author: Optional[str] = None
    pages: Optional[int] = None
    duration: Optional[str] = None
    downloads: int = 0
    views: int = 0
    is_premium: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.get("/study-materials")
async def get_study_materials(
    exam: Optional[str] = None,
    material_type: Optional[str] = None,
    subject: Optional[str] = None,
    is_premium: Optional[bool] = None,
    limit: int = 50
):
    query = {}
    if exam:
        query["exam_name"] = exam
    if material_type:
        query["material_type"] = material_type
    if subject:
        query["subject"] = subject
    if is_premium is not None:
        query["is_premium"] = is_premium
    
    materials = await db.study_materials.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return materials

@api_router.get("/study-materials/{material_id}")
async def get_study_material(material_id: str):
    material = await db.study_materials.find_one({"id": material_id}, {"_id": 0})
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    # Increment views
    await db.study_materials.update_one({"id": material_id}, {"$inc": {"views": 1}})
    return material

@api_router.post("/study-materials")
async def create_study_material(material: StudyMaterial):
    material_dict = material.model_dump()
    material_dict["created_at"] = material_dict["created_at"].isoformat()
    await db.study_materials.insert_one(material_dict)
    return material_dict

@api_router.put("/study-materials/{material_id}")
async def update_study_material(material_id: str, material: StudyMaterial):
    material_dict = material.model_dump()
    await db.study_materials.update_one({"id": material_id}, {"$set": material_dict})
    return {"message": "Study material updated"}

@api_router.delete("/study-materials/{material_id}")
async def delete_study_material(material_id: str):
    await db.study_materials.delete_one({"id": material_id})
    return {"message": "Study material deleted"}


# ============================================
# Exam Routes
# ============================================

@api_router.get("/exams", response_model=List[Exam])
async def get_exams(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    exam_level: Optional[str] = None,
    exam_type: Optional[str] = None
):
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if stream:
        query["streams"] = {"$in": [stream]}
    
    if exam_level:
        query["exam_level"] = exam_level
    
    if exam_type:
        query["exam_type"] = exam_type
    
    exams = await db.exams.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # Re-sort to put items with display_priority > 0 first
    prioritized = [e for e in exams if e.get('display_priority', 0) > 0]
    non_prioritized = [e for e in exams if e.get('display_priority', 0) == 0]
    prioritized.sort(key=lambda x: x.get('display_priority', 0))
    exams = prioritized + non_prioritized
    
    for exam in exams:
        if isinstance(exam.get('created_at'), str):
            exam['created_at'] = datetime.fromisoformat(exam['created_at'])
        
        # Fix data validation issues - convert invalid types to None
        if exam.get('exam_pattern') is not None and not isinstance(exam.get('exam_pattern'), dict):
            exam['exam_pattern'] = None
        if exam.get('eligibility') is not None and not isinstance(exam.get('eligibility'), dict):
            exam['eligibility'] = None
        if exam.get('application_fee') is not None and not isinstance(exam.get('application_fee'), dict):
            exam['application_fee'] = None
    
    return exams

@api_router.get("/exams/featured", response_model=List[Exam])
async def get_featured_exams(limit: int = Query(6, ge=1, le=20)):
    """Get featured exams for homepage - prioritizes manually selected exams from homepage settings"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_exams_ids", []) if settings else []
    
    featured_exams = []
    
    # Get exams from homepage settings (in specified order)
    if featured_ids:
        for exam_id in featured_ids[:limit]:
            exam = await db.exams.find_one({"id": exam_id, "status": "published"}, {"_id": 0})
            if exam:
                featured_exams.append(exam)
    
    # If not enough, fill with published exams
    if len(featured_exams) < limit:
        existing_ids = [e.get('id') for e in featured_exams]
        additional = await db.exams.find(
            {"status": "published", "id": {"$nin": existing_ids}}, 
            {"_id": 0}
        ).sort("total_applicants", -1).limit(limit - len(featured_exams)).to_list(limit - len(featured_exams))
        featured_exams.extend(additional)
    
    return featured_exams

@api_router.get("/exams/{exam_id}", response_model=Exam)
async def get_exam(exam_id: str):
    exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    if isinstance(exam.get('created_at'), str):
        exam['created_at'] = datetime.fromisoformat(exam['created_at'])
    
    return Exam(**exam)

@api_router.post("/exams", response_model=Exam)
async def create_exam(exam_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create exams")
    
    # Generate ID if not provided
    if 'id' not in exam_data:
        exam_data['id'] = str(uuid.uuid4())
    
    # Set default values for required arrays
    if 'streams' not in exam_data:
        exam_data['streams'] = []
    if 'previous_year_cutoffs' not in exam_data:
        exam_data['previous_year_cutoffs'] = []
    if 'study_materials' not in exam_data:
        exam_data['study_materials'] = []
    if 'sample_papers' not in exam_data:
        exam_data['sample_papers'] = []
    if 'important_topics' not in exam_data:
        exam_data['important_topics'] = []
    if 'accepting_colleges' not in exam_data:
        exam_data['accepting_colleges'] = []
    
    # Set created_at if not provided
    if 'created_at' not in exam_data:
        exam_data['created_at'] = datetime.now(timezone.utc)
    
    # Insert into database
    await db.exams.insert_one(exam_data)
    
    # Return the created exam
    created_exam = await db.exams.find_one({"id": exam_data['id']}, {"_id": 0})
    
    # Convert datetime to ISO format for response
    if isinstance(created_exam.get('created_at'), datetime):
        created_exam['created_at'] = created_exam['created_at'].isoformat()
    
    return Exam(**created_exam)

@api_router.put("/exams/{exam_id}", response_model=Exam)
async def update_exam(exam_id: str, exam_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update exams")
    
    existing_exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    if not existing_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Remove id from update data if present
    exam_data.pop('id', None)
    
    await db.exams.update_one({"id": exam_id}, {"$set": exam_data})
    updated_exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    
    # Convert datetime for response
    if isinstance(updated_exam.get('created_at'), datetime):
        updated_exam['created_at'] = updated_exam['created_at'].isoformat()
    
    return Exam(**updated_exam)

@api_router.delete("/exams/{exam_id}")
async def delete_exam(exam_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete exams")
    
    result = await db.exams.delete_one({"id": exam_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    return {"message": "Exam deleted successfully"}

# ============================================
# Course Routes
# ============================================

@api_router.get("/courses", response_model=List[Course])
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    degree_type: Optional[str] = None
):
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if stream:
        query["stream"] = {"$regex": stream, "$options": "i"}
    
    if degree_type:
        query["degree_type"] = degree_type
    
    courses = await db.courses.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for course in courses:
        if isinstance(course.get('created_at'), str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return courses

@api_router.get("/courses/{course_id}", response_model=CourseDetail)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if isinstance(course.get('created_at'), str):
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return CourseDetail(**course)

@api_router.post("/courses", response_model=Course)
async def create_course(course_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create courses")
    
    # Generate ID if not provided
    if 'id' not in course_data:
        course_data['id'] = str(uuid.uuid4())
    
    # Set cutoffs to empty array if not provided
    if 'cutoffs' not in course_data:
        course_data['cutoffs'] = []
    
    # Insert into database
    await db.courses.insert_one(course_data)
    
    # Return the created course
    created_course = await db.courses.find_one({"id": course_data['id']}, {"_id": 0})
    return Course(**created_course)

@api_router.put("/courses/{course_id}", response_model=Course)
async def update_course(course_id: str, course_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update courses")
    
    existing_course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Remove id from update data if present
    course_data.pop('id', None)
    
    await db.courses.update_one({"id": course_id}, {"$set": course_data})
    updated_course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    
    return Course(**updated_course)

@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete courses")
    
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {"message": "Course deleted successfully"}

# ============================================
# Courses Detail Routes (Separate Collection)
# ============================================

@api_router.get("/courses-detail", response_model=List[CourseDetail])
async def get_courses_detail(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    eligibility_level: Optional[str] = None,  # after-10th, after-12th, after-graduation
    stream: Optional[str] = None,
    degree_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    
    if eligibility_level:
        query["eligibility_level"] = eligibility_level
    if stream:
        query["stream"] = stream
    if degree_type:
        query["degree_type"] = degree_type
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    courses = await db.courses_detailed.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for course in courses:
        if isinstance(course.get('created_at'), str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return courses

@api_router.get("/courses-detail/{course_id}", response_model=CourseDetail)
async def get_course_detail(course_id: str):
    course = await db.courses_detailed.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if isinstance(course.get('created_at'), str):
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return CourseDetail(**course)

@api_router.post("/courses-detail", response_model=CourseDetail)
async def create_course_detail(course_data: CourseDetailCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create courses")
    
    course = CourseDetail(**course_data.model_dump())
    course_dict = course.model_dump()
    course_dict['created_at'] = course_dict['created_at'].isoformat()
    
    await db.courses_detailed.insert_one(course_dict)
    return course

@api_router.put("/courses-detail/{course_id}", response_model=CourseDetail)
async def update_course_detail(course_id: str, course_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update courses")
    
    existing_course = await db.courses_detailed.find_one({"id": course_id}, {"_id": 0})
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    await db.courses_detailed.update_one({"id": course_id}, {"$set": course_data})
    updated_course = await db.courses_detailed.find_one({"id": course_id}, {"_id": 0})
    
    if isinstance(updated_course.get('created_at'), str):
        updated_course['created_at'] = datetime.fromisoformat(updated_course['created_at'])
    
    return CourseDetail(**updated_course)

@api_router.delete("/courses-detail/{course_id}")
async def delete_course_detail(course_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete courses")
    
    result = await db.courses_detailed.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {"message": "Course deleted successfully"}

# ============================================
# Exams Detail Routes (Separate Collection)
# ============================================

@api_router.get("/exams-detail")
async def get_exams_detail(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    status: Optional[str] = Query(None)
):
    query = {}
    if status:
        query['status'] = status
    
    exams = await db.exams_detailed.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return exams

@api_router.get("/exams-detail/{exam_id}")
async def get_exam_detail(exam_id: str):
    exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    return exam

@api_router.post("/exams-detail")
async def create_exam_detail(exam_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create exams")
    
    # Generate ID if not provided
    if 'id' not in exam_data or not exam_data['id']:
        exam_data['id'] = str(uuid.uuid4())
    
    # Set timestamps
    exam_data['created_at'] = datetime.now(timezone.utc).isoformat()
    exam_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Handle menu_config - ensure proper structure
    if 'menu_config' in exam_data and exam_data['menu_config']:
        # Ensure items have proper structure
        items = exam_data['menu_config'].get('items', [])
        for item in items:
            # Ensure widgets is properly structured
            if 'widgets' not in item or item['widgets'] is None:
                item['widgets'] = {
                    'quick_facts': {'enabled': True},
                    'quick_nav': {'enabled': True},
                    'contact_cta': {'enabled': True, 'title': 'Need Help?', 'subtitle': 'Get expert guidance'},
                    'related_exams': {'enabled': False, 'exams': []},
                    'download_widget': {'enabled': False, 'title': 'Download Resources', 'files': []}
                }
    
    await db.exams_detailed.insert_one(exam_data)
    
    # Return without _id
    created_exam = await db.exams_detailed.find_one({"id": exam_data['id']}, {"_id": 0})
    return created_exam

@api_router.put("/exams-detail/{exam_id}")
async def update_exam_detail(exam_id: str, exam_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update exams")
    
    existing_exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    if not existing_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Update timestamp
    exam_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Preserve original id and created_at
    exam_data['id'] = exam_id
    if 'created_at' not in exam_data:
        exam_data['created_at'] = existing_exam.get('created_at')
    
    # Handle menu_config - ensure proper structure
    if 'menu_config' in exam_data and exam_data['menu_config']:
        items = exam_data['menu_config'].get('items', [])
        for item in items:
            # Initialize missing arrays
            for field in ['toc', 'tables', 'images', 'videos', 'faqs']:
                if field not in item or item[field] is None:
                    item[field] = []
            # Initialize widgets if missing
            if 'widgets' not in item or item['widgets'] is None:
                item['widgets'] = {
                    'quick_facts': {'enabled': True},
                    'quick_nav': {'enabled': True},
                    'contact_cta': {'enabled': True, 'title': 'Need Help?', 'subtitle': 'Get expert guidance'},
                    'related_exams': {'enabled': False, 'exams': []},
                    'download_widget': {'enabled': False, 'title': 'Download Resources', 'files': []}
                }
    
    await db.exams_detailed.update_one({"id": exam_id}, {"$set": exam_data})
    updated_exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    
    return updated_exam

@api_router.delete("/exams-detail/{exam_id}")
async def delete_exam_detail(exam_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete exams")
    
    result = await db.exams_detailed.delete_one({"id": exam_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    return {"message": "Exam deleted successfully"}

    
    return {"message": "Course deleted successfully"}

# ============================================
# Application Routes
# ============================================

@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate, current_user: User = Depends(get_current_user)):
    college = await db.colleges.find_one({"id": app_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    application = Application(**app_data.model_dump(), user_id=current_user.id)
    app_dict = application.model_dump()
    app_dict['created_at'] = app_dict['created_at'].isoformat()
    app_dict['updated_at'] = app_dict['updated_at'].isoformat()
    
    await db.applications.insert_one(app_dict)
    return application

@api_router.get("/applications/my", response_model=List[Application])
async def get_my_applications(current_user: User = Depends(get_current_user)):
    applications = await db.applications.find({"user_id": current_user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

@api_router.get("/applications/{application_id}", response_model=Application)
async def get_application(application_id: str, current_user: User = Depends(get_current_user)):
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application['user_id'] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this application")
    
    if isinstance(application.get('created_at'), str):
        application['created_at'] = datetime.fromisoformat(application['created_at'])
    if isinstance(application.get('updated_at'), str):
        application['updated_at'] = datetime.fromisoformat(application['updated_at'])
    
    return Application(**application)

@api_router.patch("/applications/{application_id}/status")
async def update_application_status(
    application_id: str, 
    status: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update application status")
    
    valid_statuses = ["submitted", "under_review", "accepted", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get application to send notification
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    
    # Create notification for user
    notification = Notification(
        user_id=application['user_id'],
        type="application_update",
        title=f"Application {status.replace('_', ' ').title()}",
        message=f"Your application {application['application_number']} status has been updated to {status}",
        link=f"/dashboard"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    return {"message": "Application status updated successfully", "status": status}

# ============================================
# Notifications Routes
# ============================================

@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user.id}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    for notif in notifications:
        if isinstance(notif.get('created_at'), str):
            notif['created_at'] = datetime.fromisoformat(notif['created_at'])
    
    return notifications

@api_router.get("/notifications/unread-count")
async def get_unread_notifications_count(current_user: User = Depends(get_current_user)):
    count = await db.notifications.count_documents({"user_id": current_user.id, "read": False})
    return {"count": count}

@api_router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user)):
    result = await db.notifications.update_one(
        {"id": notification_id, "user_id": current_user.id},
        {"$set": {"read": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}

@api_router.post("/notifications/mark-all-read")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user.id, "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}

# ============================================
# Earnings Routes
# ============================================

@api_router.get("/earnings")
async def get_earnings(current_user: User = Depends(get_current_user)):
    transactions = await db.earnings.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for trans in transactions:
        if isinstance(trans.get('created_at'), str):
            trans['created_at'] = datetime.fromisoformat(trans['created_at'])
    
    # Calculate totals by type
    review_earnings = sum(t['amount'] for t in transactions if t['type'] == 'review')
    referral_earnings = sum(t['amount'] for t in transactions if t['type'] == 'referral')
    
    return {
        "total_earnings": current_user.total_earnings,
        "review_earnings": review_earnings,
        "referral_earnings": referral_earnings,
        "transactions": transactions
    }

# ============================================
# User Dashboard Routes
# ============================================

@api_router.get("/dashboard/stats")
async def get_user_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_applications = await db.applications.count_documents({"user_id": current_user.id})
    total_reviews = await db.reviews.count_documents({"user_id": current_user.id})
    saved_colleges_count = len(current_user.saved_colleges)
    unread_notifications = await db.notifications.count_documents({"user_id": current_user.id, "read": False})
    
    recent_applications = await db.applications.find(
        {"user_id": current_user.id}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    for app in recent_applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    # Get application status breakdown
    status_breakdown = {
        "submitted": await db.applications.count_documents({"user_id": current_user.id, "status": "submitted"}),
        "under_review": await db.applications.count_documents({"user_id": current_user.id, "status": "under_review"}),
        "accepted": await db.applications.count_documents({"user_id": current_user.id, "status": "accepted"}),
        "rejected": await db.applications.count_documents({"user_id": current_user.id, "status": "rejected"})
    }
    
    return {
        "total_applications": total_applications,
        "total_reviews": total_reviews,
        "saved_colleges": saved_colleges_count,
        "total_earnings": current_user.total_earnings,
        "unread_notifications": unread_notifications,
        "referral_code": current_user.referral_code,
        "referral_count": current_user.referral_count,
        "application_status_breakdown": status_breakdown,
        "recent_applications": recent_applications
    }

# ============================================
# Education Loan Routes
# ============================================

@api_router.get("/education-loans")
async def get_education_loans(
    loan_type: Optional[str] = None,
    max_interest_rate: Optional[float] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000)
):
    query = {}
    
    if loan_type:
        query["loan_type"] = loan_type
    
    if max_interest_rate:
        query["interest_rate"] = {"$lte": max_interest_rate}
    
    # Get loans from education_loans collection
    education_loans = await db.education_loans.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # Also get loans from loans collection (admin-created entries)
    admin_loans = await db.loans.find({}, {"_id": 0}).to_list(100)
    
    # Transform admin loans to match EducationLoan format for frontend
    transformed_admin_loans = []
    for loan in admin_loans:
        # Parse interest rate from string like "9.85%" to float
        interest_rate_min = loan.get('interest_rate_min', '0')
        if isinstance(interest_rate_min, str):
            interest_rate_min = float(interest_rate_min.replace('%', '').strip() or 0)
        
        # Parse max amount from string like "₹1 Crore" 
        max_amount = loan.get('max_amount', '0')
        max_loan_amount = 0
        if isinstance(max_amount, str):
            if 'Crore' in max_amount or 'crore' in max_amount:
                try:
                    num = float(''.join(c for c in max_amount if c.isdigit() or c == '.') or 0)
                    max_loan_amount = num * 10000000  # 1 crore = 10 million
                except:
                    max_loan_amount = 10000000
            elif 'Lakh' in max_amount or 'lakh' in max_amount:
                try:
                    num = float(''.join(c for c in max_amount if c.isdigit() or c == '.') or 0)
                    max_loan_amount = num * 100000
                except:
                    max_loan_amount = 100000
        
        # Parse tenure from string like "15 Years"
        tenure_max = loan.get('tenure_max', '10')
        repayment_period = 10
        if isinstance(tenure_max, str):
            try:
                repayment_period = int(''.join(c for c in tenure_max if c.isdigit()) or 10)
            except:
                repayment_period = 10
        
        # Parse processing fee
        processing_fee_str = loan.get('processing_fee', '1%')
        processing_fee = 1.0
        if isinstance(processing_fee_str, str):
            try:
                processing_fee = float(''.join(c for c in processing_fee_str if c.isdigit() or c == '.') or 1)
            except:
                processing_fee = 1.0
        
        transformed = {
            'id': loan.get('id'),
            'bank_name': loan.get('bank_name') or loan.get('name', 'Unknown Bank'),
            'loan_type': loan.get('loan_type', 'Domestic'),
            'interest_rate': interest_rate_min,
            'max_loan_amount': max_loan_amount,
            'repayment_period': repayment_period,
            'processing_fee': processing_fee,
            'collateral_required': False,  # Default
            'features': loan.get('key_features', []) or loan.get('benefits', []),
            'eligibility_criteria': ', '.join(loan.get('eligibility_criteria', [])) if isinstance(loan.get('eligibility_criteria'), list) else loan.get('eligibility_criteria', ''),
            'documents_required': loan.get('documents_required', []),
            'website_url': loan.get('official_website') or loan.get('apply_link'),
            'contact_number': loan.get('contact_phone'),
            'rating': 4.0,  # Default rating
            'created_at': loan.get('created_at')
        }
        
        # Apply filters if present
        if loan_type and transformed['loan_type'] != loan_type:
            continue
        if max_interest_rate and transformed['interest_rate'] > max_interest_rate:
            continue
            
        transformed_admin_loans.append(transformed)
    
    # Combine both lists
    all_loans = education_loans + transformed_admin_loans
    
    return all_loans

@api_router.get("/education-loans/{loan_id}", response_model=EducationLoan)
async def get_education_loan(loan_id: str):
    loan = await db.education_loans.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(status_code=404, detail="Education loan not found")
    
    if isinstance(loan.get('created_at'), str):
        loan['created_at'] = datetime.fromisoformat(loan['created_at'])
    
    return EducationLoan(**loan)

@api_router.post("/loan-applications", response_model=LoanApplication)
async def create_loan_application(app_data: LoanApplicationCreate, current_user: User = Depends(get_current_user)):
    loan = await db.education_loans.find_one({"id": app_data.loan_id})
    if not loan:
        raise HTTPException(status_code=404, detail="Education loan not found")
    
    application = LoanApplication(
        **app_data.model_dump(),
        user_id=current_user.id,
        bank_name=loan['bank_name']
    )
    app_dict = application.model_dump()
    app_dict['created_at'] = app_dict['created_at'].isoformat()
    app_dict['updated_at'] = app_dict['updated_at'].isoformat()
    
    await db.loan_applications.insert_one(app_dict)
    
    # Create notification
    notification = Notification(
        user_id=current_user.id,
        type="application_update",
        title="Loan Application Submitted!",
        message=f"Your loan application {application.application_number} for {loan['bank_name']} has been submitted successfully. We'll notify you once it's reviewed.",
        link="/dashboard"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    return application

@api_router.get("/loan-applications/my", response_model=List[LoanApplication])
async def get_my_loan_applications(current_user: User = Depends(get_current_user)):
    applications = await db.loan_applications.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

# ============================================
# Scholarship Routes
# ============================================

# Removed duplicate scholarship routes - using routes defined at bottom of file

@api_router.post("/scholarship-applications", response_model=ScholarshipApplication)
async def create_scholarship_application(app_data: ScholarshipApplicationCreate, current_user: User = Depends(get_current_user)):
    scholarship = await db.scholarships.find_one({"id": app_data.scholarship_id})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    # Check if user already applied
    existing = await db.scholarship_applications.find_one({
        "user_id": current_user.id,
        "scholarship_id": app_data.scholarship_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this scholarship")
    
    application = ScholarshipApplication(
        **app_data.model_dump(),
        user_id=current_user.id,
        scholarship_name=scholarship['name']
    )
    app_dict = application.model_dump()
    app_dict['created_at'] = app_dict['created_at'].isoformat()
    app_dict['updated_at'] = app_dict['updated_at'].isoformat()
    
    await db.scholarship_applications.insert_one(app_dict)
    

# ============================================
# Facilities Routes
# ============================================

@api_router.get("/facilities", response_model=List[Facility])
async def get_facilities(
    category: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    query = {}
    
    if category:
        query["category"] = category
    
    facilities = await db.facilities.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for facility in facilities:
        if isinstance(facility.get('created_at'), str):
            facility['created_at'] = datetime.fromisoformat(facility['created_at'])
    
    return facilities

@api_router.get("/facilities/{facility_id}", response_model=Facility)
async def get_facility(facility_id: str):
    facility = await db.facilities.find_one({"id": facility_id}, {"_id": 0})
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    if isinstance(facility.get('created_at'), str):
        facility['created_at'] = datetime.fromisoformat(facility['created_at'])
    
    return facility

    # Create notification
    notification = Notification(
        user_id=current_user.id,
        type="application_update",
        title="Scholarship Application Submitted!",
        message=f"Your application {application.application_number} for {scholarship['name']} has been submitted. Check your email for further updates.",
        link="/dashboard"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    return application

@api_router.get("/scholarship-applications/my", response_model=List[ScholarshipApplication])
async def get_my_scholarship_applications(current_user: User = Depends(get_current_user)):
    applications = await db.scholarship_applications.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

@api_router.get("/scholarship-applications/check-eligibility")
async def check_scholarship_eligibility(
    cgpa: float,
    annual_income: float,
    category: str,
    current_user: User = Depends(get_current_user)
):
    # Get all active scholarships
    scholarships = await db.scholarships.find({"active": True}, {"_id": 0}).to_list(100)
    
    eligible_scholarships = []
    
    for scholarship in scholarships:
        # Basic eligibility logic (can be enhanced)
        is_eligible = True
        
        # Income-based scholarships (need-based)
        if scholarship['scholarship_type'] == 'Need-based' and annual_income > 500000:
            is_eligible = False
        
        # Merit-based scholarships
        if scholarship['scholarship_type'] == 'Merit-based' and cgpa < 7.5:
            is_eligible = False
        
        if is_eligible:
            eligible_scholarships.append({
                "id": scholarship['id'],
                "name": scholarship['name'],
                "amount": scholarship['amount'],
                "provider": scholarship['provider'],
                "deadline": scholarship['deadline']
            })
    
    return {
        "eligible_count": len(eligible_scholarships),
        "scholarships": eligible_scholarships
    }

# ============================================
# Study Materials Routes
# ============================================

@api_router.get("/study-materials", response_model=List[StudyMaterial])
async def get_study_materials(
    exam_name: Optional[str] = None,
    subject: Optional[str] = None,
    material_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000)
):
    query = {}
    
    if exam_name:
        query["exam_name"] = exam_name
    
    if subject:
        query["subject"] = subject
    
    if material_type:
        query["material_type"] = material_type
    
    materials = await db.study_materials.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for material in materials:
        if isinstance(material.get('created_at'), str):
            material['created_at'] = datetime.fromisoformat(material['created_at'])
    
    return materials

@api_router.get("/study-materials/{material_id}", response_model=StudyMaterial)
async def get_study_material(material_id: str):
    material = await db.study_materials.find_one({"id": material_id}, {"_id": 0})
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    
    # Increment download count
    await db.study_materials.update_one(
        {"id": material_id},
        {"$inc": {"downloads": 1}}
    )
    
    if isinstance(material.get('created_at'), str):
        material['created_at'] = datetime.fromisoformat(material['created_at'])
    
    return StudyMaterial(**material)

@api_router.post("/study-materials", response_model=StudyMaterial)
async def create_study_material(material_data: StudyMaterialCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create study materials")
    
    material = StudyMaterial(**material_data.model_dump())
    material_dict = material.model_dump()
    material_dict['created_at'] = material_dict['created_at'].isoformat()
    
    await db.study_materials.insert_one(material_dict)
    return material

# ============================================
# Counseling Routes
# ============================================

@api_router.get("/counselors", response_model=List[Counselor])
async def get_counselors(
    specialization: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000)
):
    query = {}
    
    if specialization:
        query["specialization"] = {"$in": [specialization]}
    
    counselors = await db.counselors.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for counselor in counselors:
        if isinstance(counselor.get('created_at'), str):
            counselor['created_at'] = datetime.fromisoformat(counselor['created_at'])
    
    return counselors

@api_router.get("/counselors/{counselor_id}", response_model=Counselor)
async def get_counselor(counselor_id: str):
    counselor = await db.counselors.find_one({"id": counselor_id}, {"_id": 0})
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    if isinstance(counselor.get('created_at'), str):
        counselor['created_at'] = datetime.fromisoformat(counselor['created_at'])
    
    return Counselor(**counselor)

@api_router.post("/counseling-sessions", response_model=CounselingSession)
async def book_counseling_session(session_data: CounselingSessionCreate, current_user: User = Depends(get_current_user)):
    counselor = await db.counselors.find_one({"id": session_data.counselor_id})
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    # Check if slot is available (simplified check)
    existing_session = await db.counseling_sessions.find_one({
        "counselor_id": session_data.counselor_id,
        "session_date": session_data.session_date,
        "session_time": session_data.session_time,
        "status": "scheduled"
    })
    
    if existing_session:
        raise HTTPException(status_code=400, detail="This slot is already booked. Please choose another time.")
    
    session = CounselingSession(
        **session_data.model_dump(),
        user_id=current_user.id,
        counselor_name=counselor['name']
    )
    session_dict = session.model_dump()
    session_dict['created_at'] = session_dict['created_at'].isoformat()
    session_dict['updated_at'] = session_dict['updated_at'].isoformat()
    
    await db.counseling_sessions.insert_one(session_dict)
    
    # Update counselor's total sessions
    await db.counselors.update_one(
        {"id": session_data.counselor_id},
        {"$inc": {"total_sessions": 1}}
    )
    
    # Create notification
    notification = Notification(
        user_id=current_user.id,
        type="application_update",
        title="Counseling Session Booked!",
        message=f"Your counseling session {session.booking_number} with {counselor['name']} is scheduled for {session_data.session_date} at {session_data.session_time}",
        link="/dashboard"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    return session

@api_router.get("/counseling-sessions/my", response_model=List[CounselingSession])
async def get_my_counseling_sessions(current_user: User = Depends(get_current_user)):
    sessions = await db.counseling_sessions.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("session_date", -1).to_list(100)
    
    for session in sessions:
        if isinstance(session.get('created_at'), str):
            session['created_at'] = datetime.fromisoformat(session['created_at'])
        if isinstance(session.get('updated_at'), str):
            session['updated_at'] = datetime.fromisoformat(session['updated_at'])
    
    return sessions

@api_router.patch("/counseling-sessions/{session_id}/status")
async def update_session_status(
    session_id: str,
    status: str,
    current_user: User = Depends(get_current_user)
):
    valid_statuses = ["scheduled", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status")
    
    session = await db.counseling_sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session['user_id'] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.counseling_sessions.update_one(
        {"id": session_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Session status updated successfully"}

# ============================================
# Payment & Subscription Routes
# ============================================

@api_router.get("/subscription-plans")
async def get_subscription_plans():
    plans = [
        {
            "id": "premium-monthly",
            "name": "Premium Monthly",
            "price": 299,
            "duration": "1 month",
            "features": [
                "Access to all premium study materials",
                "Unlimited downloads",
                "Priority counseling sessions",
                "Advanced eligibility checker",
                "Ad-free experience",
                "Early access to new features"
            ]
        },
        {
            "id": "premium-yearly",
            "name": "Premium Yearly",
            "price": 2999,
            "duration": "12 months",
            "features": [
                "All Monthly features",
                "Save 17% compared to monthly",
                "Free career assessment (worth ₹1000)",
                "Exclusive webinars and workshops",
                "Dedicated support",
                "Lifetime access to recorded sessions"
            ],
            "popular": True
        }
    ]
    return plans

@api_router.post("/create-checkout-session")
async def create_checkout_session(
    request: Request,
    plan_id: str,
    origin_url: str,
    current_user: User = Depends(get_current_user)
):
    # Validate plan exists
    if plan_id not in SUBSCRIPTION_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    # Get amount from server-side definition only (NEVER from frontend)
    plan = SUBSCRIPTION_PACKAGES[plan_id]
    
    # Initialize Stripe Checkout
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Build URLs from provided origin
    success_url = f"{origin_url}/premium/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/premium"
    
    # Create checkout session request
    checkout_request = CheckoutSessionRequest(
        amount=plan["amount"],
        currency="inr",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user.id,
            "user_email": current_user.email,
            "plan_id": plan_id,
            "plan_name": plan["name"]
        }
    )
    
    # Create checkout session
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record BEFORE redirecting user
    transaction = PaymentTransaction(
        user_id=current_user.id,
        transaction_type="subscription",
        amount=plan["amount"],
        payment_method="stripe",
        payment_id=session.session_id,
        status="pending",
        item_name=plan["name"]
    )
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.payment_transactions.insert_one(trans_dict)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/checkout-status/{session_id}")
async def get_checkout_status(
    request: Request,
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    # Initialize Stripe Checkout
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Get checkout session status from Stripe
    checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    
    # Check if payment was already processed (to prevent double processing)
    existing_transaction = await db.payment_transactions.find_one(
        {"payment_id": session_id, "status": "completed"}
    )
    
    if checkout_status.payment_status == "paid" and not existing_transaction:
        # Extract metadata
        plan_id = checkout_status.metadata.get("plan_id")
        user_id = checkout_status.metadata.get("user_id")
        
        if plan_id not in SUBSCRIPTION_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid plan in metadata")
        
        plan = SUBSCRIPTION_PACKAGES[plan_id]
        
        # Create subscription
        subscription = Subscription(
            user_id=user_id,
            plan_type=plan["name"],
            amount=plan["amount"],
            start_date=datetime.now(timezone.utc),
            end_date=datetime.now(timezone.utc) + timedelta(days=plan["duration_days"]),
            status="active",
            payment_id=session_id,
            features=["premium_materials", "unlimited_downloads", "priority_support"]
        )
        
        sub_dict = subscription.model_dump()
        sub_dict['start_date'] = sub_dict['start_date'].isoformat()
        sub_dict['end_date'] = sub_dict['end_date'].isoformat()
        sub_dict['created_at'] = sub_dict['created_at'].isoformat()
        
        await db.subscriptions.insert_one(sub_dict)
        
        # Update payment transaction status
        await db.payment_transactions.update_one(
            {"payment_id": session_id},
            {"$set": {"status": "completed"}}
        )
        
        # Update user subscription status
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"subscription_status": "premium", "subscription_end": sub_dict['end_date']}}
        )
        
        # Create notification
        notification = Notification(
            user_id=user_id,
            type="application_update",
            title="Premium Subscription Activated!",
            message=f"Your {plan['name']} subscription is now active. Enjoy premium features!",
            link="/dashboard"
        )
        notif_dict = notification.model_dump()
        notif_dict['created_at'] = notif_dict['created_at'].isoformat()
        await db.notifications.insert_one(notif_dict)
    
    return {
        "status": checkout_status.status,
        "payment_status": checkout_status.payment_status,
        "amount_total": checkout_status.amount_total,
        "currency": checkout_status.currency,
        "metadata": checkout_status.metadata
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    # Initialize Stripe Checkout
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Get webhook body and signature
    body_bytes = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body_bytes, signature)
        
        # Process the webhook event if payment was successful
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            
            # Check if already processed
            existing = await db.payment_transactions.find_one(
                {"payment_id": session_id, "status": "completed"}
            )
            
            if not existing:
                # Extract metadata
                plan_id = webhook_response.metadata.get("plan_id")
                user_id = webhook_response.metadata.get("user_id")
                
                if plan_id in SUBSCRIPTION_PACKAGES:
                    plan = SUBSCRIPTION_PACKAGES[plan_id]
                    
                    # Create subscription
                    subscription = Subscription(
                        user_id=user_id,
                        plan_type=plan["name"],
                        amount=plan["amount"],
                        start_date=datetime.now(timezone.utc),
                        end_date=datetime.now(timezone.utc) + timedelta(days=plan["duration_days"]),
                        status="active",
                        payment_id=session_id,
                        features=["premium_materials", "unlimited_downloads", "priority_support"]
                    )
                    
                    sub_dict = subscription.model_dump()
                    sub_dict['start_date'] = sub_dict['start_date'].isoformat()
                    sub_dict['end_date'] = sub_dict['end_date'].isoformat()
                    sub_dict['created_at'] = sub_dict['created_at'].isoformat()
                    
                    await db.subscriptions.insert_one(sub_dict)
                    
                    # Update transaction
                    await db.payment_transactions.update_one(
                        {"payment_id": session_id},
                        {"$set": {"status": "completed"}}
                    )
                    
                    # Update user
                    await db.users.update_one(
                        {"id": user_id},
                        {"$set": {"subscription_status": "premium", "subscription_end": sub_dict['end_date']}}
                    )
        
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

@api_router.get("/my-subscription")
async def get_my_subscription(current_user: User = Depends(get_current_user)):
    subscription = await db.subscriptions.find_one(
        {"user_id": current_user.id, "status": "active"},
        {"_id": 0}
    )
    
    if not subscription:
        return {"status": "none", "message": "No active subscription"}
    
    if isinstance(subscription.get('start_date'), str):
        subscription['start_date'] = datetime.fromisoformat(subscription['start_date'])
    if isinstance(subscription.get('end_date'), str):
        subscription['end_date'] = datetime.fromisoformat(subscription['end_date'])
    if isinstance(subscription.get('created_at'), str):
        subscription['created_at'] = datetime.fromisoformat(subscription['created_at'])
    
    return subscription

# ============================================
# Referral System Routes
# ============================================

@api_router.post("/apply-referral-code")
async def apply_referral_code(referral_code: str, current_user: User = Depends(get_current_user)):
    # Find user with this referral code
    referrer = await db.users.find_one({"referral_code": referral_code}, {"_id": 0})
    
    if not referrer:
        raise HTTPException(status_code=404, detail="Invalid referral code")
    
    if referrer['id'] == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot use your own referral code")
    
    # Check if already applied a referral
    existing = await db.referral_tracking.find_one({"referred_user_id": current_user.id})
    if existing:
        raise HTTPException(status_code=400, detail="You have already used a referral code")
    
    # Create referral tracking
    referral = ReferralTracking(
        referrer_id=referrer['id'],
        referrer_name=referrer['name'],
        referred_user_id=current_user.id,
        referred_user_name=current_user.name,
        referred_user_email=current_user.email,
        status="completed",
        earnings_amount=200.0,
        earnings_paid=True
    )
    ref_dict = referral.model_dump()
    ref_dict['created_at'] = ref_dict['created_at'].isoformat()
    await db.referral_tracking.insert_one(ref_dict)
    
    # Add earnings to referrer
    earning_transaction = EarningTransaction(
        user_id=referrer['id'],
        type="referral",
        amount=200.0,
        description=f"Referral bonus for {current_user.name}",
        reference_id=current_user.id
    )
    earn_dict = earning_transaction.model_dump()
    earn_dict['created_at'] = earn_dict['created_at'].isoformat()
    await db.earnings.insert_one(earn_dict)
    
    # Update referrer's totals
    await db.users.update_one(
        {"id": referrer['id']},
        {
            "$inc": {"total_earnings": 200.0, "referral_count": 1}
        }
    )
    
    # Give bonus to referred user
    await db.users.update_one(
        {"id": current_user.id},
        {"$inc": {"total_earnings": 100.0}}
    )
    
    referred_earning = EarningTransaction(
        user_id=current_user.id,
        type="referral",
        amount=100.0,
        description=f"Sign-up bonus via referral code",
        reference_id=referrer['id']
    )
    ref_earn_dict = referred_earning.model_dump()
    ref_earn_dict['created_at'] = ref_earn_dict['created_at'].isoformat()
    await db.earnings.insert_one(ref_earn_dict)
    
    # Notifications
    notif_referrer = Notification(
        user_id=referrer['id'],
        type="review_earning",
        title="Referral Bonus Earned!",
        message=f"You earned ₹200 for referring {current_user.name}",
        link="/dashboard"
    )
    notif_ref_dict = notif_referrer.model_dump()
    notif_ref_dict['created_at'] = notif_ref_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_ref_dict)
    
    notif_referred = Notification(
        user_id=current_user.id,
        type="review_earning",
        title="Welcome Bonus!",
        message=f"You received ₹100 sign-up bonus",
        link="/dashboard"
    )
    notif_ref2_dict = notif_referred.model_dump()
    notif_ref2_dict['created_at'] = notif_ref2_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_ref2_dict)
    
    return {"message": "Referral applied successfully! You received ₹100 bonus"}

@api_router.get("/my-referrals")
async def get_my_referrals(current_user: User = Depends(get_current_user)):
    referrals = await db.referral_tracking.find(
        {"referrer_id": current_user.id},
        {"_id": 0}
    ).to_list(100)
    
    for ref in referrals:
        if isinstance(ref.get('created_at'), str):
            ref['created_at'] = datetime.fromisoformat(ref['created_at'])
    
    total_earnings = sum(r['earnings_amount'] for r in referrals if r['earnings_paid'])
    
    return {
        "total_referrals": len(referrals),
        "total_earnings": total_earnings,
        "referrals": referrals
    }

# ============================================
# Institution Panel Routes
# ============================================

@api_router.post("/institution/register")
async def register_institution(
    name: str,
    email: EmailStr,
    password: str,
    phone: str,
    college_id: str,
    contact_person: str,
    designation: str
):
    # Check if institution exists
    existing = await db.institutions.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Institution already registered")
    
    # Verify college exists
    college = await db.colleges.find_one({"id": college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Create institution account
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    institution = Institution(
        name=name,
        email=email,
        phone=phone,
        college_id=college_id,
        contact_person=contact_person,
        designation=designation,
        subscription_plan="basic"
    )
    
    inst_dict = institution.model_dump()
    inst_dict['created_at'] = inst_dict['created_at'].isoformat()
    inst_dict['password'] = hashed_password.decode('utf-8')
    inst_dict['role'] = 'institution'
    
    await db.institutions.insert_one(inst_dict)
    
    return {"message": "Institution registered successfully", "email": email}

@api_router.post("/institution/login")
async def institution_login(email: EmailStr, password: str):
    institution = await db.institutions.find_one({"email": email})
    
    if not institution:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(password.encode('utf-8'), institution['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.institutions.update_one(
        {"email": email},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_access_token({"sub": email, "role": "institution", "id": institution['id']})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "institution": {
            "id": institution['id'],
            "name": institution['name'],
            "email": institution['email'],
            "college_id": institution['college_id'],
            "role": "institution"
        }
    }

@api_router.get("/institution/dashboard")
async def get_institution_dashboard(current_user: User = Depends(get_current_user)):
    if current_user.role != "institution":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get institution data
    institution = await db.institutions.find_one({"id": current_user.id}, {"_id": 0})
    
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    # Get applications for this college
    applications = await db.applications.find(
        {"college_id": institution['college_id']},
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    # Count by status
    status_counts = {
        "submitted": 0,
        "under_review": 0,
        "accepted": 0,
        "rejected": 0
    }
    
    for app in applications:
        status_counts[app.get('status', 'submitted')] += 1
    
    return {
        "institution": institution,
        "total_applications": len(applications),
        "status_breakdown": status_counts,
        "recent_applications": applications[:10]
    }

# ============================================
# Study Abroad Routes
# ============================================

@api_router.get("/study-abroad", response_model=List[StudyAbroadUniversity])
async def get_study_abroad_universities(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    country: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    
    if country:
        query["country"] = country
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    universities = await db.study_abroad.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for uni in universities:
        if isinstance(uni.get('created_at'), str):
            uni['created_at'] = datetime.fromisoformat(uni['created_at'])
    
    return universities

@api_router.get("/study-abroad/{university_id}", response_model=StudyAbroadUniversity)
async def get_study_abroad_university(university_id: str):
    university = await db.study_abroad.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    if isinstance(university.get('created_at'), str):
        university['created_at'] = datetime.fromisoformat(university['created_at'])
    
    return StudyAbroadUniversity(**university)

@api_router.get("/study-abroad/countries/list")
async def get_countries():
    countries = await db.study_abroad.distinct("country")
    return {"countries": sorted(countries)}

@api_router.post("/study-abroad")
async def create_study_abroad_university(university: StudyAbroadUniversity):
    uni_dict = university.model_dump()
    if isinstance(uni_dict.get('created_at'), datetime):
        uni_dict['created_at'] = uni_dict['created_at'].isoformat()
    await db.study_abroad.insert_one(uni_dict)
    uni_dict.pop('_id', None)
    return uni_dict

@api_router.put("/study-abroad/{university_id}")
async def update_study_abroad_university(university_id: str, university: StudyAbroadUniversity):
    uni_dict = university.model_dump()
    if isinstance(uni_dict.get('created_at'), datetime):
        uni_dict['created_at'] = uni_dict['created_at'].isoformat()
    await db.study_abroad.update_one({"id": university_id}, {"$set": uni_dict})
    uni_dict.pop('_id', None)
    return uni_dict

@api_router.delete("/study-abroad/{university_id}")
async def delete_study_abroad_university(university_id: str):
    await db.study_abroad.delete_one({"id": university_id})
    return {"success": True}


# ============================================
# Study Abroad Listing Page Settings
# ============================================

class StudyAbroadListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "study-abroad-listing-page"
    
    # Hero Section
    hero_title: str = "Study Abroad"
    hero_subtitle: str = "Explore top universities around the world and find your perfect study destination"
    hero_bg_gradient: str = "from-indigo-600 to-purple-700"
    hero_image: Optional[str] = None
    
    # Stats
    stats: List[Dict[str, Any]] = [
        {"label": "Partner Universities", "value": "500+", "icon": "🏛️"},
        {"label": "Countries", "value": "50+", "icon": "🌍"},
        {"label": "Students Placed", "value": "10K+", "icon": "👨‍🎓"},
        {"label": "Scholarship Value", "value": "$50M+", "icon": "💰"}
    ]
    
    # Featured Countries
    featured_countries: List[Dict[str, Any]] = [
        {"name": "USA", "flag": "🇺🇸", "universities": 100, "description": "World-class education system"},
        {"name": "UK", "flag": "🇬🇧", "universities": 80, "description": "Rich academic heritage"},
        {"name": "Canada", "flag": "🇨🇦", "universities": 60, "description": "Multicultural environment"},
        {"name": "Australia", "flag": "🇦🇺", "universities": 50, "description": "Quality lifestyle"}
    ]
    
    # Filter Options
    show_country_filter: bool = True
    show_ranking_filter: bool = True
    show_tuition_filter: bool = True
    show_program_filter: bool = True
    
    # Program Types
    program_types: List[Dict[str, Any]] = [
        {"id": "undergraduate", "name": "Undergraduate", "icon": "📚"},
        {"id": "postgraduate", "name": "Postgraduate", "icon": "🎓"},
        {"id": "phd", "name": "PhD/Research", "icon": "🔬"},
        {"id": "mba", "name": "MBA", "icon": "💼"}
    ]
    
    # CTA Section
    cta_title: str = "Need Help Choosing the Right University?"
    cta_subtitle: str = "Our expert counselors can help you find the perfect study abroad destination"
    cta_button_text: str = "Get Free Counseling"
    cta_button_link: str = "/counseling"
    
    # Why Study Abroad Section
    why_study_abroad: List[Dict[str, Any]] = [
        {"title": "Global Recognition", "description": "Degrees recognized worldwide", "icon": "🌐"},
        {"title": "Career Opportunities", "description": "Better job prospects globally", "icon": "💼"},
        {"title": "Cultural Exposure", "description": "Experience diverse cultures", "icon": "🎭"},
        {"title": "Personal Growth", "description": "Develop independence and skills", "icon": "🚀"}
    ]
    
    # SEO
    auto_generate_seo: bool = True
    meta_title: str = "Study Abroad 2025 - Top Universities Worldwide | Admissionbuddy"
    meta_description: str = "Explore 500+ top universities in USA, UK, Canada, Australia. Get expert guidance for your study abroad journey. Apply now!"
    meta_keywords: List[str] = ["study abroad", "international universities", "USA universities", "UK universities", "study in Canada"]
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    twitter_card: str = "summary_large_image"
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    schema_type: str = "WebPage"
    robots: str = "index, follow"
    
    # FAQs
    faqs: List[Dict[str, Any]] = []
    
    updated_at: Optional[datetime] = None

@api_router.get("/study-abroad-listing-settings")
async def get_study_abroad_listing_settings():
    settings = await db.study_abroad_listing_settings.find_one({"id": "study-abroad-listing-page"}, {"_id": 0})
    if not settings:
        return StudyAbroadListingPageSettings().model_dump()
    return settings

@api_router.put("/study-abroad-listing-settings")
async def update_study_abroad_listing_settings(settings: StudyAbroadListingPageSettings):
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.study_abroad_listing_settings.update_one(
        {"id": "study-abroad-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict


# ============================================
# Homepage Settings
# ============================================

# HomepageSettings model and routes moved to routes/homepage_settings.py
# Scholarship and Loan routes moved to routes/financial_aid.py

# ============================================
# Blog/Article Routes
# ============================================

@api_router.get("/articles", response_model=List[Article])
async def get_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    category: Optional[str] = None,
    search: Optional[str] = None
):
    query = {"published": True}
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for article in articles:
        if isinstance(article.get('created_at'), str):
            article['created_at'] = datetime.fromisoformat(article['created_at'])
        if isinstance(article.get('updated_at'), str):
            article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    return articles

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment views
    await db.articles.update_one({"id": article_id}, {"$inc": {"views": 1}})
    article['views'] = article.get('views', 0) + 1
    
    if isinstance(article.get('created_at'), str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    if isinstance(article.get('updated_at'), str):
        article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    return Article(**article)

@api_router.post("/articles", response_model=Article)
async def create_article(article_data: ArticleCreate, current_user: User = Depends(get_current_user)):
    article = Article(
        **article_data.model_dump(),
        author_id=current_user.id,
        author_name=current_user.name
    )
    article_dict = article.model_dump()
    article_dict['created_at'] = article_dict['created_at'].isoformat()
    article_dict['updated_at'] = article_dict['updated_at'].isoformat()
    
    await db.articles.insert_one(article_dict)
    return article

@api_router.get("/articles/category/{category}")
async def get_articles_by_category(category: str, limit: int = Query(10, ge=1, le=50)):
    articles = await db.articles.find(
        {"category": category, "published": True}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    for article in articles:
        if isinstance(article.get('created_at'), str):
            article['created_at'] = datetime.fromisoformat(article['created_at'])
    
    return articles

# ============================================
# Stats Route
# ============================================

@api_router.get("/locations/states")
async def get_states():
    """Get all unique states with college count"""
    pipeline = [
        {"$group": {"_id": "$location.state", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$ne": None}}},
        {"$sort": {"count": -1}},
        {"$limit": 30}
    ]
    states = await db.colleges.aggregate(pipeline).to_list(30)
    return [{"state": s["_id"], "college_count": s["count"]} for s in states]

@api_router.get("/locations/cities")
async def get_cities(state: Optional[str] = None):
    """Get all unique cities with college count"""
    match_stage = {}
    if state:
        match_stage = {"location.state": state}
    
    pipeline = [
        {"$match": match_stage} if match_stage else {"$match": {}},
        {"$group": {"_id": {"city": "$location.city", "state": "$location.state"}, "count": {"$sum": 1}}},
        {"$match": {"_id.city": {"$ne": None}}},
        {"$sort": {"count": -1}},
        {"$limit": 50}
    ]
    cities = await db.colleges.aggregate(pipeline).to_list(50)
    return [{"city": c["_id"]["city"], "state": c["_id"]["state"], "college_count": c["count"]} for c in cities]

@api_router.get("/locations/countries")
async def get_countries():
    """Get all unique countries for study abroad"""
    pipeline = [
        {"$group": {"_id": "$country", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$ne": None}}},
        {"$sort": {"count": -1}}
    ]
    countries = await db.study_abroad.aggregate(pipeline).to_list(100)
    return [{"country": c["_id"], "university_count": c["count"]} for c in countries]

@api_router.get("/stats")
async def get_stats():
    total_colleges = await db.colleges.count_documents({})
    total_reviews = await db.reviews.count_documents({})
    total_users = await db.users.count_documents({})
    total_exams = await db.exams.count_documents({})
    total_courses = await db.courses.count_documents({})
    total_scholarships = await db.scholarships.count_documents({})
    total_study_abroad = await db.study_abroad.count_documents({})
    
    return {
        "total_colleges": total_colleges,
        "total_reviews": total_reviews,
        "total_users": total_users,
        "total_exams": total_exams,
        "total_courses": total_courses,
        "total_scholarships": total_scholarships,
        "total_study_abroad": total_study_abroad
    }

# ============================================
# Schools Routes
# ============================================

@api_router.get("/schools", response_model=List[School])
async def get_schools(
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    board: Optional[str] = None,
    school_type: Optional[str] = None,
    medium: Optional[str] = None,
    sort: str = "rating",
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    """Get all schools with optional filters"""
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if city:
        query["city"] = city
    if state:
        query["state"] = state
    if board:
        query["board"] = board
    if school_type:
        query["school_type"] = school_type
    if medium:
        query["medium"] = medium
    
    sort_field = "rating" if sort == "rating" else "name"
    sort_order = -1 if sort == "rating" else 1
    
    schools = await db.schools.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    
    # Re-sort to put items with display_priority > 0 first
    prioritized = [s for s in schools if s.get('display_priority', 0) > 0]
    non_prioritized = [s for s in schools if s.get('display_priority', 0) == 0]
    prioritized.sort(key=lambda x: x.get('display_priority', 0))
    schools = prioritized + non_prioritized
    
    return schools

@api_router.get("/schools/featured", response_model=List[School])
async def get_featured_schools(limit: int = Query(8, ge=1, le=50)):
    """Get featured schools for homepage - prioritizes manually selected schools from homepage settings"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_schools_ids", []) if settings else []
    
    featured_schools = []
    
    # Get schools from homepage settings (in specified order)
    if featured_ids:
        for school_id in featured_ids[:limit]:
            school = await db.schools.find_one({"id": school_id}, {"_id": 0})
            if school:
                featured_schools.append(school)
    
    # If not enough, fill with top rated schools
    if len(featured_schools) < limit:
        existing_ids = [s.get('id') for s in featured_schools]
        additional = await db.schools.find(
            {"id": {"$nin": existing_ids}}, 
            {"_id": 0}
        ).sort("rating", -1).limit(limit - len(featured_schools)).to_list(limit - len(featured_schools))
        featured_schools.extend(additional)
    
    return featured_schools

@api_router.get("/schools/{school_id}", response_model=School)
async def get_school(school_id: str):
    """Get a specific school by ID"""
    school = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return School(**school)

@api_router.post("/schools", response_model=School)
async def create_school(school: School):
    """Create a new school (admin only)"""
    school_dict = school.model_dump()
    await db.schools.insert_one(school_dict)
    return school

# ============================================
# Universities Routes
# ============================================

@api_router.get("/universities", response_model=List[University])
async def get_universities(
    city: Optional[str] = None,
    state: Optional[str] = None,
    university_type: Optional[str] = None,
    accreditation: Optional[str] = None,
    stream: Optional[str] = None,
    sort: str = "rating",
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    """Get all universities with optional filters"""
    query = {}
    if city:
        query["city"] = city
    if state:
        query["state"] = state
    if university_type:
        query["university_type"] = university_type
    if accreditation:
        query["accreditation"] = accreditation
    if stream:
        query["streams"] = stream
    
    sort_field = "rating" if sort == "rating" else "nirf_rank" if sort == "ranking" else "name"
    sort_order = -1 if sort == "rating" else 1
    
    universities = await db.universities.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    return universities

@api_router.get("/universities/{university_id}", response_model=University)
async def get_university(university_id: str):
    """Get a specific university by ID"""
    university = await db.universities.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    return University(**university)

@api_router.post("/universities", response_model=University)
async def create_university(university: University):
    """Create a new university (admin only)"""
    university_dict = university.model_dump()
    await db.universities.insert_one(university_dict)
    return university

# ============================================
# News Routes
# ============================================

@api_router.get("/news", response_model=List[News])
async def get_news(
    search: Optional[str] = None,
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    tag: Optional[str] = None,
    sort: str = "latest",
    limit: int = Query(20, ge=1, le=200),
    skip: int = Query(0, ge=0),
    all_status: bool = False  # If true, return all news (for admin)
):
    """Get all news articles with optional filters"""
    query = {} if all_status else {"published": True}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if tag:
        query["tags"] = tag
    
    sort_field = "published_at" if sort == "latest" else "views"
    sort_order = -1
    
    news = await db.news.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    
    # Apply display_priority sorting - items with priority > 0 come first
    prioritized = [n for n in news if n.get('display_priority', 0) > 0]
    non_prioritized = [n for n in news if n.get('display_priority', 0) == 0]
    prioritized.sort(key=lambda x: x.get('display_priority', 0))
    
    return prioritized + non_prioritized

@api_router.get("/news/featured", response_model=List[News])
async def get_featured_news(limit: int = Query(4, ge=1, le=20)):
    """Get featured news for homepage - prioritizes manually selected news from homepage settings"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_news_ids", []) if settings else []
    
    featured_news = []
    
    # Get news from homepage settings (in specified order)
    if featured_ids:
        for news_id in featured_ids[:limit]:
            news = await db.news.find_one({"id": news_id, "status": "published"}, {"_id": 0})
            if news:
                featured_news.append(news)
    
    # If not enough, fill with latest published news
    if len(featured_news) < limit:
        existing_ids = [n.get('id') for n in featured_news]
        additional = await db.news.find(
            {"status": "published", "id": {"$nin": existing_ids}}, 
            {"_id": 0}
        ).sort("published_at", -1).limit(limit - len(featured_news)).to_list(limit - len(featured_news))
        featured_news.extend(additional)
    
    return featured_news

@api_router.get("/news/{news_id}", response_model=News)
async def get_news_article(news_id: str):
    """Get a specific news article by ID or slug"""
    # Try to find by ID first, then by slug
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        news = await db.news.find_one({"slug": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    
    # Increment view count
    await db.news.update_one({"id": news.get("id")}, {"$inc": {"views": 1}})
    
    return News(**news)

@api_router.post("/news", response_model=News)
async def create_news(news: News):
    """Create a new news article (admin only)"""
    news_dict = news.model_dump()
    await db.news.insert_one(news_dict)
    return news

@api_router.put("/news/{news_id}", response_model=News)
async def update_news(news_id: str, news: News):
    """Update a news article (admin only)"""
    news_dict = news.model_dump()
    await db.news.update_one({"id": news_id}, {"$set": news_dict})
    return news

@api_router.patch("/news/{news_id}")
async def patch_news(news_id: str, updates: dict):
    """Partially update news article (admin only)"""
    await db.news.update_one({"id": news_id}, {"$set": updates})
    return {"success": True}

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str):
    """Delete a news article (admin only)"""
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"success": True}

# ============================================
# Additional Admin CRUD Routes
# ============================================

@api_router.put("/schools/{school_id}", response_model=School)
async def update_school(school_id: str, school: School):
    """Update a school (admin only)"""
    school_dict = school.model_dump()
    await db.schools.update_one({"id": school_id}, {"$set": school_dict})
    return school

@api_router.delete("/schools/{school_id}")
async def delete_school(school_id: str):
    """Delete a school (admin only)"""
    result = await db.schools.delete_one({"id": school_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="School not found")
    return {"success": True}

@api_router.put("/universities/{university_id}", response_model=University)
async def update_university(university_id: str, university: University):
    """Update a university (admin only)"""
    university_dict = university.model_dump()
    await db.universities.update_one({"id": university_id}, {"$set": university_dict})
    return university

@api_router.delete("/universities/{university_id}")
async def delete_university(university_id: str):
    """Delete a university (admin only)"""
    result = await db.universities.delete_one({"id": university_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    return {"success": True}

@api_router.patch("/reviews/{review_id}/approve")
async def approve_review(review_id: str):
    """Approve a review (admin only)"""
    await db.reviews.update_one({"id": review_id}, {"$set": {"status": "approved"}})
    return {"success": True, "status": "approved"}

@api_router.patch("/reviews/{review_id}/reject")
async def reject_review(review_id: str):
    """Reject a review (admin only)"""
    await db.reviews.update_one({"id": review_id}, {"$set": {"status": "rejected"}})
    return {"success": True, "status": "rejected"}

# ============================================
# Taxonomy & Master Data Routes
# ============================================

# Streams
@api_router.get("/streams")
async def get_streams(limit: int = 100):
    streams = await db.streams.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return streams

@api_router.post("/streams", response_model=Stream)
async def create_stream(stream: Stream):
    await db.streams.insert_one(stream.model_dump())
    return stream

@api_router.put("/streams/{stream_id}")
async def update_stream(stream_id: str, stream: Stream):
    await db.streams.update_one({"id": stream_id}, {"$set": stream.model_dump()})
    return stream

@api_router.delete("/streams/{stream_id}")
async def delete_stream(stream_id: str):
    await db.streams.delete_one({"id": stream_id})
    return {"success": True}

# Sub-Streams
@api_router.get("/sub-streams")
async def get_sub_streams(limit: int = 100):
    sub_streams = await db.sub_streams.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return sub_streams

@api_router.post("/sub-streams", response_model=SubStream)
async def create_sub_stream(sub_stream: SubStream):
    await db.sub_streams.insert_one(sub_stream.model_dump())
    return sub_stream

@api_router.put("/sub-streams/{sub_stream_id}")
async def update_sub_stream(sub_stream_id: str, sub_stream: SubStream):
    await db.sub_streams.update_one({"id": sub_stream_id}, {"$set": sub_stream.model_dump()})
    return sub_stream

@api_router.delete("/sub-streams/{sub_stream_id}")
async def delete_sub_stream(sub_stream_id: str):
    await db.sub_streams.delete_one({"id": sub_stream_id})
    return {"success": True}

# Boards
@api_router.get("/boards")
async def get_boards(limit: int = 100):
    boards = await db.boards.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return boards

@api_router.post("/boards", response_model=Board)
async def create_board(board: Board):
    await db.boards.insert_one(board.model_dump())
    return board

@api_router.put("/boards/{board_id}")
async def update_board(board_id: str, board: Board):
    await db.boards.update_one({"id": board_id}, {"$set": board.model_dump()})
    return board

@api_router.delete("/boards/{board_id}")
async def delete_board(board_id: str):
    await db.boards.delete_one({"id": board_id})
    return {"success": True}

# College Types
@api_router.get("/college-types")
async def get_college_types(limit: int = 100):
    college_types = await db.college_types.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return college_types

@api_router.post("/college-types", response_model=CollegeType)
async def create_college_type(college_type: CollegeType):
    await db.college_types.insert_one(college_type.model_dump())
    return college_type

@api_router.put("/college-types/{type_id}")
async def update_college_type(type_id: str, college_type: CollegeType):
    await db.college_types.update_one({"id": type_id}, {"$set": college_type.model_dump()})
    return college_type

@api_router.delete("/college-types/{type_id}")
async def delete_college_type(type_id: str):
    await db.college_types.delete_one({"id": type_id})
    return {"success": True}

# Affiliations
@api_router.get("/affiliations")
async def get_affiliations(limit: int = 500):
    # Allow higher limit for affiliations since we have many entries (241+)
    affiliations = await db.affiliations.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return affiliations

@api_router.post("/affiliations", response_model=Affiliation)
async def create_affiliation(affiliation: Affiliation):
    await db.affiliations.insert_one(affiliation.model_dump())
    return affiliation

@api_router.put("/affiliations/{affiliation_id}")
async def update_affiliation(affiliation_id: str, affiliation: Affiliation):
    await db.affiliations.update_one({"id": affiliation_id}, {"$set": affiliation.model_dump()})
    return affiliation

@api_router.delete("/affiliations/{affiliation_id}")
async def delete_affiliation(affiliation_id: str):
    await db.affiliations.delete_one({"id": affiliation_id})
    return {"success": True}

# Recognitions
@api_router.get("/recognitions")
async def get_recognitions(limit: int = 100):
    recognitions = await db.recognitions.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return recognitions

@api_router.post("/recognitions", response_model=Recognition)
async def create_recognition(recognition: Recognition):
    await db.recognitions.insert_one(recognition.model_dump())
    return recognition

@api_router.put("/recognitions/{recognition_id}")
async def update_recognition(recognition_id: str, recognition: Recognition):
    await db.recognitions.update_one({"id": recognition_id}, {"$set": recognition.model_dump()})
    return recognition

@api_router.delete("/recognitions/{recognition_id}")
async def delete_recognition(recognition_id: str):
    await db.recognitions.delete_one({"id": recognition_id})
    return {"success": True}

# Accreditations
@api_router.get("/accreditations")
async def get_accreditations(limit: int = 100):
    accreditations = await db.accreditations.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return accreditations

@api_router.post("/accreditations", response_model=Accreditation)
async def create_accreditation(accreditation: Accreditation):
    await db.accreditations.insert_one(accreditation.model_dump())
    return accreditation

@api_router.put("/accreditations/{accreditation_id}")
async def update_accreditation(accreditation_id: str, accreditation: Accreditation):
    await db.accreditations.update_one({"id": accreditation_id}, {"$set": accreditation.model_dump()})
    return accreditation

@api_router.delete("/accreditations/{accreditation_id}")
async def delete_accreditation(accreditation_id: str):
    await db.accreditations.delete_one({"id": accreditation_id})
    return {"success": True}

# Accreditation Levels
@api_router.get("/accreditation-levels")
async def get_accreditation_levels(limit: int = 100):
    levels = await db.accreditation_levels.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return levels

@api_router.post("/accreditation-levels", response_model=AccreditationLevel)
async def create_accreditation_level(level: AccreditationLevel):
    await db.accreditation_levels.insert_one(level.model_dump())
    return level

@api_router.put("/accreditation-levels/{level_id}")
async def update_accreditation_level(level_id: str, level: AccreditationLevel):
    await db.accreditation_levels.update_one({"id": level_id}, {"$set": level.model_dump()})
    return level

@api_router.delete("/accreditation-levels/{level_id}")
async def delete_accreditation_level(level_id: str):
    await db.accreditation_levels.delete_one({"id": level_id})
    return {"success": True}

# Rank Categories
@api_router.get("/rank-categories")
async def get_rank_categories(limit: int = 100):
    categories = await db.rank_categories.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return categories

@api_router.post("/rank-categories", response_model=RankCategory)
async def create_rank_category(category: RankCategory):
    await db.rank_categories.insert_one(category.model_dump())
    return category

@api_router.put("/rank-categories/{category_id}")
async def update_rank_category(category_id: str, category: RankCategory):
    await db.rank_categories.update_one({"id": category_id}, {"$set": category.model_dump()})
    return category

@api_router.delete("/rank-categories/{category_id}")
async def delete_rank_category(category_id: str):
    await db.rank_categories.delete_one({"id": category_id})
    return {"success": True}

# Rankings
@api_router.get("/rankings")
async def get_rankings(limit: int = 100):
    rankings = await db.rankings.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return rankings

@api_router.post("/rankings", response_model=Ranking)
async def create_ranking(ranking: Ranking):
    await db.rankings.insert_one(ranking.model_dump())
    return ranking

@api_router.put("/rankings/{ranking_id}")
async def update_ranking(ranking_id: str, ranking: Ranking):
    await db.rankings.update_one({"id": ranking_id}, {"$set": ranking.model_dump()})
    return ranking

@api_router.delete("/rankings/{ranking_id}")
async def delete_ranking(ranking_id: str):
    await db.rankings.delete_one({"id": ranking_id})
    return {"success": True}

# Scholarships
# Scholarships and Loans moved to routes/financial_aid.py

# Comments
@api_router.get("/comments")
async def get_comments(limit: int = 100):
    comments = await db.comments.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return comments

@api_router.post("/comments", response_model=Comment)
async def create_comment(comment: Comment):
    await db.comments.insert_one(comment.model_dump())
    return comment

@api_router.put("/comments/{comment_id}")
async def update_comment(comment_id: str, comment: Comment):
    await db.comments.update_one({"id": comment_id}, {"$set": comment.model_dump()})
    return comment

@api_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str):
    await db.comments.delete_one({"id": comment_id})
    return {"success": True}

# Course-College Tags
@api_router.get("/course-college-tags")
async def get_course_college_tags(limit: int = 1000):
    tags = await db.course_college_tags.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return tags

@api_router.post("/course-college-tags", response_model=CourseCollegeTag)
async def create_course_college_tag(tag: CourseCollegeTag):
    await db.course_college_tags.insert_one(tag.model_dump())
    return tag

@api_router.delete("/course-college-tags/{tag_id}")
async def delete_course_college_tag(tag_id: str):
    await db.course_college_tags.delete_one({"id": tag_id})
    return {"success": True}

# Exam-Course Tags
@api_router.get("/exam-course-tags")
async def get_exam_course_tags(limit: int = 1000):
    tags = await db.exam_course_tags.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return tags

@api_router.post("/exam-course-tags", response_model=ExamCourseTag)
async def create_exam_course_tag(tag: ExamCourseTag):
    await db.exam_course_tags.insert_one(tag.model_dump())
    return tag

@api_router.delete("/exam-course-tags/{tag_id}")
async def delete_exam_course_tag(tag_id: str):
    await db.exam_course_tags.delete_one({"id": tag_id})
    return {"success": True}

# Users Management
@api_router.get("/users")
async def get_all_users(limit: int = 100):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).limit(limit).to_list(limit)
    return users

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    await db.users.delete_one({"id": user_id})
    return {"success": True}

# ============================================
# Frontend Content Management Routes
# ============================================

# Blogs
@api_router.get("/blogs")
async def get_blogs(category: Optional[str] = None, featured: Optional[bool] = None, limit: int = 20):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured
    blogs = await db.blogs.find(query, {"_id": 0}).sort("published_at", -1).limit(limit).to_list(limit)
    return blogs

@api_router.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    # Increment views
    await db.blogs.update_one({"id": blog_id}, {"$inc": {"views": 1}})
    return Blog(**blog)

@api_router.post("/blogs", response_model=Blog)
async def create_blog(blog: Blog):
    await db.blogs.insert_one(blog.model_dump())
    return blog

@api_router.put("/blogs/{blog_id}")
async def update_blog(blog_id: str, blog: Blog):
    await db.blogs.update_one({"id": blog_id}, {"$set": blog.model_dump()})
    return blog

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str):
    await db.blogs.delete_one({"id": blog_id})
    return {"success": True}

# Study Materials
@api_router.get("/study-materials")
async def get_study_materials(exam: Optional[str] = None, subject: Optional[str] = None, limit: int = 50):
    query = {}
    if exam:
        query["exam"] = exam
    if subject:
        query["subject"] = subject
    materials = await db.study_materials.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return materials

@api_router.post("/study-materials", response_model=StudyMaterial)
async def create_study_material(material: StudyMaterial):
    await db.study_materials.insert_one(material.model_dump())
    return material

@api_router.delete("/study-materials/{material_id}")
async def delete_study_material(material_id: str):
    await db.study_materials.delete_one({"id": material_id})
    return {"success": True}

# Counseling Sessions
@api_router.get("/counseling-sessions")
async def get_counseling_sessions(limit: int = 100):
    sessions = await db.counseling_sessions.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return sessions

@api_router.post("/counseling-sessions", response_model=CounselingSession)
async def book_counseling_session(session: CounselingSession):
    await db.counseling_sessions.insert_one(session.model_dump())
    return session

@api_router.patch("/counseling-sessions/{session_id}")
async def update_counseling_session_status(session_id: str, status: str, counselor: Optional[str] = None):
    update_data = {"status": status}
    if counselor:
        update_data["counselor_assigned"] = counselor
    await db.counseling_sessions.update_one({"id": session_id}, {"$set": update_data})
    return {"success": True}

# Banners
@api_router.get("/banners")
async def get_banners(position: Optional[str] = None):
    query = {"is_active": True}
    if position:
        query["position"] = position
    banners = await db.banners.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    return banners

@api_router.post("/banners", response_model=Banner)
async def create_banner(banner: Banner):
    await db.banners.insert_one(banner.model_dump())
    return banner

@api_router.put("/banners/{banner_id}")
async def update_banner(banner_id: str, banner: Banner):
    await db.banners.update_one({"id": banner_id}, {"$set": banner.model_dump()})
    return banner

@api_router.delete("/banners/{banner_id}")
async def delete_banner(banner_id: str):
    await db.banners.delete_one({"id": banner_id})
    return {"success": True}

# Testimonials
@api_router.get("/testimonials")
async def get_testimonials(featured: Optional[bool] = None):
    query = {"is_active": True}
    if featured is not None:
        query["is_featured"] = featured
    testimonials = await db.testimonials.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: Testimonial):
    await db.testimonials.insert_one(testimonial.model_dump())
    return testimonial

@api_router.put("/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, testimonial: Testimonial):
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": testimonial.model_dump()})
    return testimonial

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    await db.testimonials.delete_one({"id": testimonial_id})
    return {"success": True}

# FAQs
@api_router.get("/faqs")
async def get_faqs(category: Optional[str] = None, page: Optional[str] = None):
    query = {"is_active": True}
    if category:
        query["category"] = category
    if page:
        query["page"] = page
    faqs = await db.faqs.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    return faqs

@api_router.post("/faqs", response_model=FAQ)
async def create_faq(faq: FAQ):
    await db.faqs.insert_one(faq.model_dump())
    return faq

@api_router.put("/faqs/{faq_id}")
async def update_faq(faq_id: str, faq: FAQ):
    await db.faqs.update_one({"id": faq_id}, {"$set": faq.model_dump()})
    return faq

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str):
    await db.faqs.delete_one({"id": faq_id})
    return {"success": True}

# Cities
@api_router.get("/cities")
async def get_cities(featured: Optional[bool] = None):
    query = {}
    if featured is not None:
        query["is_featured"] = featured
    cities = await db.cities.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    return cities

@api_router.post("/cities", response_model=City)
async def create_city(city: City):
    await db.cities.insert_one(city.model_dump())
    return city

@api_router.put("/cities/{city_id}")
async def update_city(city_id: str, city: City):
    await db.cities.update_one({"id": city_id}, {"$set": city.model_dump()})
    return city

@api_router.delete("/cities/{city_id}")
async def delete_city(city_id: str):
    await db.cities.delete_one({"id": city_id})
    return {"success": True}

# Contact Inquiries
@api_router.get("/contact-inquiries")
async def get_contact_inquiries(limit: int = 100):
    inquiries = await db.contact_inquiries.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return inquiries

@api_router.post("/contact-inquiries", response_model=ContactInquiry)
async def submit_contact_inquiry(inquiry: ContactInquiry):
    await db.contact_inquiries.insert_one(inquiry.model_dump())
    return inquiry

@api_router.patch("/contact-inquiries/{inquiry_id}")
async def update_inquiry_status(inquiry_id: str, status: str):
    await db.contact_inquiries.update_one({"id": inquiry_id}, {"$set": {"status": status}})
    return {"success": True}

# Include the router in the main app
# ============================================
# Advertisement Management Routes
# ============================================

@api_router.get("/advertisements", response_model=List[Advertisement])
async def get_advertisements(current_user: User = Depends(get_current_user)):
    """Get all advertisements (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    ads = await db.advertisements.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for ad in ads:
        if isinstance(ad.get('created_at'), str):
            ad['created_at'] = datetime.fromisoformat(ad['created_at'])
        if isinstance(ad.get('updated_at'), str):
            ad['updated_at'] = datetime.fromisoformat(ad['updated_at'])
        if isinstance(ad.get('start_date'), str):
            ad['start_date'] = datetime.fromisoformat(ad['start_date'])
        if isinstance(ad.get('end_date'), str):
            ad['end_date'] = datetime.fromisoformat(ad['end_date'])
    return ads

@api_router.get("/advertisements/active/{page_name}")
async def get_active_advertisements(page_name: str):
    """Get active advertisements for a specific page (Public)"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Query for active ads - pages is an array, so use $in
    query = {
        "is_active": True,
        "$or": [
            {"pages": page_name},  # Exact match in array
            {"pages": {"$in": [page_name]}},  # In array
        ]
    }
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("priority", -1).to_list(100)
    
    # Filter by date (handle string dates)
    filtered_ads = []
    for ad in ads:
        start = ad.get('start_date', '')
        end = ad.get('end_date', '')
        
        # Handle datetime objects
        if hasattr(start, 'strftime'):
            start = start.strftime("%Y-%m-%d")
        if hasattr(end, 'strftime'):
            end = end.strftime("%Y-%m-%d")
        
        # Convert ISO format strings
        if start and 'T' in str(start):
            start = str(start).split('T')[0]
        if end and 'T' in str(end):
            end = str(end).split('T')[0]
        
        # Check if within date range
        if start and end and start <= today <= end:
            filtered_ads.append(ad)
        elif not start or not end:
            # If no dates set, include ad
            filtered_ads.append(ad)
    
    return filtered_ads

@api_router.get("/advertisements/{ad_id}", response_model=Advertisement)
async def get_advertisement(ad_id: str, current_user: User = Depends(get_current_user)):
    """Get a single advertisement"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    if isinstance(ad.get('created_at'), str):
        ad['created_at'] = datetime.fromisoformat(ad['created_at'])
    if isinstance(ad.get('updated_at'), str):
        ad['updated_at'] = datetime.fromisoformat(ad['updated_at'])
    if isinstance(ad.get('start_date'), str):
        ad['start_date'] = datetime.fromisoformat(ad['start_date'])
    if isinstance(ad.get('end_date'), str):
        ad['end_date'] = datetime.fromisoformat(ad['end_date'])
    
    return Advertisement(**ad)

@api_router.post("/advertisements", response_model=Advertisement)
async def create_advertisement(ad_data: dict, current_user: User = Depends(get_current_user)):
    """Create a new advertisement"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Convert date strings to datetime objects
    if 'start_date' in ad_data and isinstance(ad_data['start_date'], str):
        ad_data['start_date'] = datetime.fromisoformat(ad_data['start_date'].replace('Z', '+00:00'))
    if 'end_date' in ad_data and isinstance(ad_data['end_date'], str):
        ad_data['end_date'] = datetime.fromisoformat(ad_data['end_date'].replace('Z', '+00:00'))
    
    # Set timestamps
    ad_data['created_at'] = datetime.now(timezone.utc)
    ad_data['updated_at'] = datetime.now(timezone.utc)
    
    ad = Advertisement(**ad_data, created_by=current_user.id)
    ad_dict = ad.model_dump()
    
    # Convert datetime objects to ISO strings for MongoDB
    if isinstance(ad_dict.get('created_at'), datetime):
        ad_dict['created_at'] = ad_dict['created_at'].isoformat()
    if isinstance(ad_dict.get('updated_at'), datetime):
        ad_dict['updated_at'] = ad_dict['updated_at'].isoformat()
    if isinstance(ad_dict.get('start_date'), datetime):
        ad_dict['start_date'] = ad_dict['start_date'].isoformat()
    if isinstance(ad_dict.get('end_date'), datetime):
        ad_dict['end_date'] = ad_dict['end_date'].isoformat()
    
    await db.advertisements.insert_one(ad_dict)
    return ad

@api_router.put("/advertisements/{ad_id}", response_model=Advertisement)
async def update_advertisement(ad_id: str, ad_data: dict, current_user: User = Depends(get_current_user)):
    """Update an advertisement"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    existing_ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not existing_ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    # Convert date strings to datetime objects
    if 'start_date' in ad_data and isinstance(ad_data['start_date'], str):
        ad_data['start_date'] = datetime.fromisoformat(ad_data['start_date'].replace('Z', '+00:00'))
    if 'end_date' in ad_data and isinstance(ad_data['end_date'], str):
        ad_data['end_date'] = datetime.fromisoformat(ad_data['end_date'].replace('Z', '+00:00'))
    
    ad_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.advertisements.update_one({"id": ad_id}, {"$set": ad_data})
    updated_ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    
    if isinstance(updated_ad.get('created_at'), str):
        updated_ad['created_at'] = datetime.fromisoformat(updated_ad['created_at'])
    if isinstance(updated_ad.get('updated_at'), str):
        updated_ad['updated_at'] = datetime.fromisoformat(updated_ad['updated_at'])
    if isinstance(updated_ad.get('start_date'), str):
        updated_ad['start_date'] = datetime.fromisoformat(updated_ad['start_date'])
    if isinstance(updated_ad.get('end_date'), str):
        updated_ad['end_date'] = datetime.fromisoformat(updated_ad['end_date'])
    
    return Advertisement(**updated_ad)

@api_router.delete("/advertisements/{ad_id}")
async def delete_advertisement(ad_id: str, current_user: User = Depends(get_current_user)):
    """Delete an advertisement"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.advertisements.delete_one({"id": ad_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    return {"message": "Advertisement deleted successfully"}

@api_router.post("/advertisements/{ad_id}/impression")
async def track_impression(ad_id: str):
    """Track an impression for an advertisement (Public)"""
    result = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"impressions": 1}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    return {"message": "Impression tracked"}

@api_router.post("/advertisements/{ad_id}/click")
async def track_click(ad_id: str):
    """Track a click for an advertisement (Public)"""
    result = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"clicks": 1}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    return {"message": "Click tracked"}

@api_router.get("/advertisements/reports/stats")
async def get_advertisement_reports(current_user: User = Depends(get_current_user)):
    """Get advertisement performance reports (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    ads = await db.advertisements.find({}, {"_id": 0}).to_list(1000)
    
    # Calculate CTR and organize data
    report_data = []
    for ad in ads:
        impressions = ad.get('impressions', 0)
        clicks = ad.get('clicks', 0)
        ctr = (clicks / impressions * 100) if impressions > 0 else 0
        
        # Check if ad is currently active
        now = datetime.now(timezone.utc)
        start_date = ad.get('start_date')
        end_date = ad.get('end_date')
        
        # Parse dates and ensure timezone awareness
        if isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        if isinstance(end_date, str):
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        
        # Make dates timezone-aware if they aren't
        if start_date and start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)
        if end_date and end_date.tzinfo is None:
            end_date = end_date.replace(tzinfo=timezone.utc)
        
        is_currently_active = False
        if ad.get('is_active', False) and start_date and end_date:
            try:
                is_currently_active = start_date <= now <= end_date
            except TypeError:
                is_currently_active = False
        
        report_data.append({
            "id": ad.get('id'),
            "name": ad.get('name'),
            "ad_type": ad.get('ad_type'),
            "pages": ad.get('pages', []),
            "impressions": impressions,
            "clicks": clicks,
            "ctr": round(ctr, 2),
            "start_date": start_date.isoformat() if start_date else None,
            "end_date": end_date.isoformat() if end_date else None,
            "is_active": ad.get('is_active'),
            "is_currently_active": is_currently_active,
            "priority": ad.get('priority', 0)
        })
    
    # Sort by impressions descending
    report_data.sort(key=lambda x: x['impressions'], reverse=True)
    
    # Calculate summary stats
    total_impressions = sum(ad['impressions'] for ad in report_data)
    total_clicks = sum(ad['clicks'] for ad in report_data)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    active_count = sum(1 for ad in report_data if ad['is_currently_active'])
    
    return {
        "summary": {
            "total_ads": len(report_data),
            "active_ads": active_count,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "average_ctr": round(avg_ctr, 2)
        },
        "advertisements": report_data
    }

# ============================================
# Listing Page Content API - Manage content for listing pages
# ============================================

@api_router.get("/listing-pages")
async def get_listing_pages(
    page_type: Optional[str] = None,
    institution_type: Optional[str] = None,
    is_published: Optional[bool] = None,
    limit: int = 100
):
    """Get all listing page content with optional filters"""
    query = {}
    if page_type:
        query["page_type"] = page_type
    if institution_type:
        query["institution_type"] = institution_type
    if is_published is not None:
        query["is_published"] = is_published
    
    pages = await db.listing_pages.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return pages

@api_router.get("/listing-pages/by-slug/{url_slug:path}")
async def get_listing_page_by_slug(url_slug: str):
    """Get listing page content by URL slug"""
    page = await db.listing_pages.find_one({"url_slug": url_slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page content not found")
    return page

@api_router.get("/listing-pages/{page_id}")
async def get_listing_page(page_id: str):
    """Get listing page content by ID"""
    page = await db.listing_pages.find_one({"id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page content not found")
    return page

@api_router.post("/listing-pages", response_model=ListingPageContent)
async def create_listing_page(page: ListingPageContent, current_user: User = Depends(get_current_user)):
    """Create new listing page content"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if slug already exists
    existing = await db.listing_pages.find_one({"url_slug": page.url_slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this URL slug already exists")
    
    page_dict = page.model_dump()
    page_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    page_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    page_dict["created_by"] = current_user.id
    page_dict["created_by_name"] = current_user.name
    page_dict["created_by_photo"] = current_user.profile_photo
    page_dict["updated_by"] = current_user.id
    page_dict["updated_by_name"] = current_user.name
    page_dict["updated_by_photo"] = current_user.profile_photo
    await db.listing_pages.insert_one(page_dict)
    return page

@api_router.put("/listing-pages/{page_id}")
async def update_listing_page(page_id: str, page_data: dict, current_user: User = Depends(get_current_user)):
    """Update listing page content"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    page_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    page_data["updated_by"] = current_user.id
    page_data["updated_by_name"] = current_user.name
    page_data["updated_by_photo"] = current_user.profile_photo
    result = await db.listing_pages.update_one(
        {"id": page_id},
        {"$set": page_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page updated successfully"}

@api_router.delete("/listing-pages/{page_id}")
async def delete_listing_page(page_id: str):
    """Delete listing page content"""
    result = await db.listing_pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted successfully"}

@api_router.post("/listing-pages/bulk-create")
async def bulk_create_listing_pages(pages: List[dict]):
    """Bulk create listing pages for states/cities/streams"""
    created = 0
    skipped = 0
    for page_data in pages:
        existing = await db.listing_pages.find_one({"url_slug": page_data.get("url_slug")})
        if not existing:
            page = ListingPageContent(**page_data)
            page_dict = page.model_dump()
            page_dict["created_at"] = datetime.now(timezone.utc).isoformat()
            page_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
            await db.listing_pages.insert_one(page_dict)
            created += 1
        else:
            skipped += 1
    return {"message": f"Created {created} pages, skipped {skipped} existing"}

# ============= ADVANCED ADVERTISING API ENDPOINTS =============

@api_router.get("/advertisements")
async def get_advertisements(
    status: str = Query(None),
    ad_type: str = Query(None),
    target_url: str = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Get all advertisements with optional filters"""
    query = {}
    if status:
        query["status"] = status
    if ad_type:
        query["ad_type"] = ad_type
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return ads

@api_router.get("/advertisements/{ad_id}")
async def get_advertisement(ad_id: str):
    """Get single advertisement by ID"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return ad

@api_router.post("/advertisements")
async def create_advertisement(ad: Advertisement, current_user: dict = Depends(get_current_user)):
    """Create a new advertisement"""
    ad.created_at = datetime.now(timezone.utc)
    ad.updated_at = datetime.now(timezone.utc)
    ad.created_by = current_user.email if hasattr(current_user, 'email') else "admin"
    
    ad_dict = ad.model_dump()
    await db.advertisements.insert_one(ad_dict)
    return {"success": True, "id": ad.id, "message": "Advertisement created successfully"}

@api_router.put("/advertisements/{ad_id}")
async def update_advertisement(ad_id: str, ad_data: dict, current_user: dict = Depends(get_current_user)):
    """Update an advertisement"""
    existing = await db.advertisements.find_one({"id": ad_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    ad_data["updated_at"] = datetime.now(timezone.utc)
    ad_data["updated_by"] = current_user.email if hasattr(current_user, 'email') else "admin"
    
    await db.advertisements.update_one({"id": ad_id}, {"$set": ad_data})
    return {"success": True, "message": "Advertisement updated successfully"}

@api_router.delete("/advertisements/{ad_id}")
async def delete_advertisement(ad_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an advertisement"""
    result = await db.advertisements.delete_one({"id": ad_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return {"success": True, "message": "Advertisement deleted successfully"}

@api_router.post("/advertisements/{ad_id}/track")
async def track_ad_event(ad_id: str, request: Request, event_type: str = Query("impression")):
    """Track ad impression or click"""
    ad = await db.advertisements.find_one({"id": ad_id})
    if not ad:
        return {"success": False, "error": "Ad not found"}
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Create tracking event
    event = {
        "id": str(uuid.uuid4()),
        "ad_id": ad_id,
        "event_type": event_type,
        "url": request.headers.get("referer", ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent", ""),
    }
    await db.ad_tracking_events.insert_one(event)
    
    # Update ad stats
    stats_update = {}
    if event_type == "impression":
        stats_update = {
            "$inc": {"stats.impressions": 1},
            "$set": {"stats.last_impression": datetime.now(timezone.utc).isoformat()}
        }
    elif event_type == "click":
        stats_update = {
            "$inc": {"stats.clicks": 1},
            "$set": {"stats.last_click": datetime.now(timezone.utc).isoformat()}
        }
    
    if stats_update:
        await db.advertisements.update_one({"id": ad_id}, stats_update)
        
        # Update daily stats
        await db.advertisements.update_one(
            {"id": ad_id},
            {"$inc": {f"stats.{event_type}s_by_date.{today}": 1}}
        )
        
        # Update budget spent if CPC/CPM model
        if event_type == "click" and ad.get("budget", {}).get("cost_per_click", 0) > 0:
            cpc = ad["budget"]["cost_per_click"]
            await db.advertisements.update_one(
                {"id": ad_id},
                {"$inc": {"budget.spent_total": cpc, "budget.spent_today": cpc}}
            )
        elif event_type == "impression" and ad.get("budget", {}).get("cost_per_impression", 0) > 0:
            cpm = ad["budget"]["cost_per_impression"] / 1000  # CPM is per 1000 impressions
            await db.advertisements.update_one(
                {"id": ad_id},
                {"$inc": {"budget.spent_total": cpm, "budget.spent_today": cpm}}
            )
    
    return {"success": True}

@api_router.get("/advertisements/serve/{placement}")
async def serve_ads(
    placement: str,
    url: str = Query(""),
    limit: int = Query(5, ge=1, le=20),
    ad_type: str = Query(None)
):
    """Serve ads for a specific placement with rotation and budget checks"""
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M")
    day_of_week = now.weekday()
    
    # Build query for active, non-exhausted ads
    query = {
        "is_active": True,
        "is_paused": False,
        "is_budget_exhausted": False,
        "start_date": {"$lte": today},
        "end_date": {"$gte": today},
        "$or": [
            {"target_urls": {"$size": 0}},  # No specific URLs = show everywhere
            {"target_urls": url},  # Exact URL match
            {"section_type": placement}  # Placement match
        ]
    }
    
    if ad_type:
        query["ad_type"] = ad_type
    
    # Get matching ads sorted by priority and rotation
    ads = await db.advertisements.find(query, {"_id": 0}).sort([
        ("priority", -1),
        ("serial_order", 1),
        ("stats.impressions", 1)  # Show less-viewed ads first for rotation
    ]).to_list(limit * 2)  # Get more than needed for filtering
    
    # Filter by time and day of week
    filtered_ads = []
    for ad in ads:
        # Check time window
        start_time = ad.get("start_time", "00:00")
        end_time = ad.get("end_time", "23:59")
        if not (start_time <= current_time <= end_time):
            continue
        
        # Check day of week
        allowed_days = ad.get("days_of_week", [0, 1, 2, 3, 4, 5, 6])
        if day_of_week not in allowed_days:
            continue
        
        # Check budget
        budget = ad.get("budget", {})
        if budget.get("total_budget", 0) > 0:
            if budget.get("spent_total", 0) >= budget.get("total_budget", 0):
                # Mark as exhausted
                await db.advertisements.update_one(
                    {"id": ad["id"]},
                    {"$set": {"is_budget_exhausted": True, "status": "completed"}}
                )
                continue
        
        if budget.get("daily_budget", 0) > 0:
            if budget.get("spent_today", 0) >= budget.get("daily_budget", 0):
                continue  # Skip today, will reset tomorrow
        
        # Check rotation limits
        rotation = ad.get("rotation", {})
        if rotation.get("enabled", False):
            if rotation.get("max_impressions", 0) > 0:
                if ad.get("stats", {}).get("impressions", 0) >= rotation.get("max_impressions", 0):
                    continue
            if rotation.get("max_clicks", 0) > 0:
                if ad.get("stats", {}).get("clicks", 0) >= rotation.get("max_clicks", 0):
                    continue
        
        filtered_ads.append(ad)
        if len(filtered_ads) >= limit:
            break
    
    return filtered_ads[:limit]

@api_router.get("/advertisements/analytics/summary")
async def get_ads_analytics_summary(current_user: dict = Depends(get_current_user)):
    """Get overall advertising analytics summary"""
    # Get all ads
    ads = await db.advertisements.find({}, {"_id": 0}).to_list(1000)
    
    total_impressions = sum(ad.get("stats", {}).get("impressions", 0) for ad in ads)
    total_clicks = sum(ad.get("stats", {}).get("clicks", 0) for ad in ads)
    total_spent = sum(ad.get("budget", {}).get("spent_total", 0) for ad in ads)
    
    active_ads = len([ad for ad in ads if ad.get("is_active") and not ad.get("is_paused")])
    paused_ads = len([ad for ad in ads if ad.get("is_paused")])
    completed_ads = len([ad for ad in ads if ad.get("status") == "completed"])
    
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    
    # Get today's stats
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_impressions = sum(ad.get("stats", {}).get("impressions_by_date", {}).get(today, 0) for ad in ads)
    today_clicks = sum(ad.get("stats", {}).get("clicks_by_date", {}).get(today, 0) for ad in ads)
    
    # Get last 7 days data
    last_7_days = []
    for i in range(7):
        date = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        day_impressions = sum(ad.get("stats", {}).get("impressions_by_date", {}).get(date, 0) for ad in ads)
        day_clicks = sum(ad.get("stats", {}).get("clicks_by_date", {}).get(date, 0) for ad in ads)
        last_7_days.append({
            "date": date,
            "impressions": day_impressions,
            "clicks": day_clicks
        })
    
    # Top performing ads
    top_ads = sorted(ads, key=lambda x: x.get("stats", {}).get("clicks", 0), reverse=True)[:5]
    
    return {
        "summary": {
            "total_ads": len(ads),
            "active_ads": active_ads,
            "paused_ads": paused_ads,
            "completed_ads": completed_ads,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_spent": total_spent,
            "avg_ctr": round(avg_ctr, 2)
        },
        "today": {
            "impressions": today_impressions,
            "clicks": today_clicks
        },
        "last_7_days": list(reversed(last_7_days)),
        "top_ads": [{
            "id": ad.get("id"),
            "name": ad.get("name"),
            "ad_type": ad.get("ad_type"),
            "impressions": ad.get("stats", {}).get("impressions", 0),
            "clicks": ad.get("stats", {}).get("clicks", 0),
            "ctr": round((ad.get("stats", {}).get("clicks", 0) / max(ad.get("stats", {}).get("impressions", 0), 1)) * 100, 2)
        } for ad in top_ads]
    }

@api_router.get("/advertisements/analytics/{ad_id}")
async def get_ad_analytics(ad_id: str, current_user: dict = Depends(get_current_user)):
    """Get detailed analytics for a specific ad"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    # Get tracking events for this ad
    events = await db.ad_tracking_events.find({"ad_id": ad_id}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    
    # Group by date
    impressions_by_date = {}
    clicks_by_date = {}
    for event in events:
        date = event.get("timestamp", "")[:10]
        if event.get("event_type") == "impression":
            impressions_by_date[date] = impressions_by_date.get(date, 0) + 1
        elif event.get("event_type") == "click":
            clicks_by_date[date] = clicks_by_date.get(date, 0) + 1
    
    # Group by URL
    impressions_by_url = {}
    clicks_by_url = {}
    for event in events:
        url = event.get("url", "unknown")
        if event.get("event_type") == "impression":
            impressions_by_url[url] = impressions_by_url.get(url, 0) + 1
        elif event.get("event_type") == "click":
            clicks_by_url[url] = clicks_by_url.get(url, 0) + 1
    
    return {
        "ad": ad,
        "analytics": {
            "impressions_by_date": impressions_by_date,
            "clicks_by_date": clicks_by_date,
            "impressions_by_url": impressions_by_url,
            "clicks_by_url": clicks_by_url,
            "total_events": len(events)
        }
    }

@api_router.post("/advertisements/reset-daily-budgets")
async def reset_daily_budgets():
    """Reset daily budget spent - should be called by a cron job at midnight"""
    result = await db.advertisements.update_many(
        {},
        {"$set": {"budget.spent_today": 0, "budget.last_reset_date": datetime.now(timezone.utc).strftime("%Y-%m-%d")}}
    )
    return {"success": True, "updated": result.modified_count}

# ============================================
# Static Pages CMS
# ============================================

class PageWidget(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # hero, rich_text, faq, cta_cards, stats, gallery, contact_form
    title: Optional[str] = None
    enabled: bool = True
    order: int = 0
    settings: Dict[str, Any] = {}
    content: Any = None  # Widget-specific content

class StaticPage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str  # about, contact, privacy, terms, admission-schools, admission-colleges, admission-universities
    page_title: str
    
    # Hero Section
    hero_enabled: bool = True
    hero_title: str = ""
    hero_subtitle: str = ""
    hero_background_type: str = "gradient"  # gradient, image, color
    hero_background_value: str = "from-purple-600 to-indigo-700"
    hero_cta_text: Optional[str] = None
    hero_cta_link: Optional[str] = None
    hero_image: Optional[str] = None
    
    # Widgets/Content Blocks
    widgets: List[Dict] = []
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    auto_generate_seo: bool = True
    schema_type: str = "WebPage"
    
    # Settings
    show_breadcrumb: bool = True
    show_sidebar: bool = False
    sidebar_widgets: List[Dict] = []
    custom_css: Optional[str] = None
    
    # Status
    is_published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = None

# Static Pages API
@api_router.get("/static-pages")
async def get_static_pages():
    pages = await db.static_pages.find({}, {"_id": 0}).to_list(100)
    return pages

@api_router.get("/static-pages/{slug}")
async def get_static_page(slug: str):
    page = await db.static_pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        # Return default page structure if not found
        return {
            "slug": slug,
            "page_title": slug.replace("-", " ").title(),
            "hero_enabled": True,
            "hero_title": slug.replace("-", " ").title(),
            "hero_subtitle": "",
            "widgets": [],
            "is_published": False
        }
    return page

@api_router.post("/static-pages")
async def create_static_page(page: StaticPage):
    page_dict = page.model_dump()
    if isinstance(page_dict.get('created_at'), datetime):
        page_dict['created_at'] = page_dict['created_at'].isoformat()
    if isinstance(page_dict.get('updated_at'), datetime):
        page_dict['updated_at'] = page_dict['updated_at'].isoformat()
    
    # Check if page with slug exists
    existing = await db.static_pages.find_one({"slug": page.slug})
    if existing:
        # Update existing
        await db.static_pages.update_one({"slug": page.slug}, {"$set": page_dict})
    else:
        await db.static_pages.insert_one(page_dict)
    
    page_dict.pop('_id', None)
    return page_dict

@api_router.put("/static-pages/{slug}")
async def update_static_page(slug: str, page: StaticPage):
    page_dict = page.model_dump()
    page_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    if isinstance(page_dict.get('created_at'), datetime):
        page_dict['created_at'] = page_dict['created_at'].isoformat()
    
    await db.static_pages.update_one({"slug": slug}, {"$set": page_dict}, upsert=True)
    page_dict.pop('_id', None)
    return page_dict

@api_router.delete("/static-pages/{slug}")
async def delete_static_page(slug: str):
    await db.static_pages.delete_one({"slug": slug})
    return {"success": True}

app.include_router(api_router)

# Include modular routes
try:
    from routes.auth import auth_router
    from routes.blogs import blogs_router
    from routes.news import news_router
    from routes.admin_settings import admin_settings_router
    from routes.leads import leads_router, set_database as set_leads_db
    from routes.financial_aid import financial_aid_router, set_database as set_financial_db
    from routes.homepage_settings import homepage_settings_router, set_database as set_homepage_db
    from routes.sponsored_ads import sponsored_ads_router, set_database as set_sponsored_db
    from routes.user_auth import router as user_auth_router, set_database as set_user_auth_db
    from routes.user_dashboard import router as user_dashboard_router, set_database as set_user_dashboard_db
    from routes.institute_auth import router as institute_router, set_database as set_institute_db
    from routes.admission_booking import router as admission_booking_router, set_database as set_admission_booking_db
    
    # Set database for modular routers
    set_leads_db(db)
    set_financial_db(db)
    set_homepage_db(db)
    set_sponsored_db(db)
    set_user_auth_db(db)
    set_user_dashboard_db(db)
    set_institute_db(db)
    set_admission_booking_db(db)
    
    # Include routers with /api prefix
    app.include_router(auth_router, prefix="/api")
    app.include_router(blogs_router, prefix="/api")
    app.include_router(news_router, prefix="/api")
    app.include_router(admin_settings_router, prefix="/api")
    app.include_router(leads_router)  # Already has /api prefix
    app.include_router(financial_aid_router)  # Already has /api prefix
    app.include_router(homepage_settings_router)  # Already has /api prefix
    app.include_router(sponsored_ads_router)  # Already has /api prefix
    app.include_router(user_auth_router, prefix="/api")  # User auth routes
    app.include_router(user_dashboard_router, prefix="/api")  # User dashboard routes
    app.include_router(institute_router, prefix="/api")  # Institute auth & dashboard routes
    app.include_router(admission_booking_router, prefix="/api")  # Admission booking routes
    logging.info("✅ Modular routes loaded: auth, blogs, news, admin_settings, leads, financial_aid, homepage_settings, sponsored_ads, user_auth, user_dashboard, institute, admission_booking")
except ImportError as e:
    logging.warning(f"⚠️ Modular routes not loaded: {e}")

# Include modular architecture routers
try:
    from modules.router import api_router as modules_router
    app.include_router(modules_router, prefix="/api")
    logging.info("✅ Modular architecture loaded successfully")
except ImportError as e:
    logging.warning(f"⚠️ Modular architecture not loaded: {e}")

# Mount static files for uploads - accessible at /api/static/ for Kubernetes ingress
UPLOAD_DIR = Path(__file__).parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/api/static", StaticFiles(directory=str(Path(__file__).parent / "static")), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
