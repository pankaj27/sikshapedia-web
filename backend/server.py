from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, Request, UploadFile, File
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
import bcrypt
import jwt
from passlib.context import CryptContext
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import shutil
from PIL import Image
import io

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
    saved_colleges: List[str] = []
    total_earnings: float = 0.0  # Total earnings from reviews and referrals
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    referral_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: str
    eligibility: str
    description: str

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
    entrance_exams: List[str] = []  # Exam IDs
    
    # Curriculum
    syllabus: Optional[str] = None
    subjects: List[str] = []
    specializations: List[str] = []
    
    # Career
    career_options: List[str] = []
    average_salary: Optional[float] = None
    top_recruiters: List[str] = []
    
    # Colleges Offering
    total_colleges: int = 0
    top_colleges: List[str] = []  # College IDs
    
    # Stats
    popularity_score: int = 0
    difficulty_level: Optional[str] = None
    
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
    country: str
    city: str
    description: str
    ranking: Dict
    programs: List[str] = []
    tuition_fees: Dict  # Currency, min, max
    living_cost: Dict
    application_deadline: Optional[str] = None
    language_requirements: Dict  # IELTS, TOEFL scores
    acceptance_rate: Optional[float] = None
    images: List[str] = []
    website: Optional[str] = None
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
    location: Optional[Dict] = None
    established: Optional[str] = None
    established_year: Optional[int] = None
    type: Optional[str] = None  # Government, Private, Deemed
    affiliation: Optional[str] = None
    institution_type: Optional[str] = None  # College, School, University
    
    # Recognition & Affiliations
    recognized_by: List[str] = []  # UGC, AICTE, NBA, NAAC
    affiliated_to: Optional[str] = None
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
    seo_video_url: Optional[str] = None  # Embedded video URL
    seo_video_title: Optional[str] = None  # Video title for accessibility
    seo_video_description: Optional[str] = None  # Video description for accessibility
    seo_faqs: List = []  # [{ question, answer }]
    
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
    
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# Scholarship Models
class Scholarship(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    provider: str  # Government, Private, College
    scholarship_type: str  # Merit-based, Need-based, Sports, etc.
    amount: float
    eligibility: str
    applicable_courses: List[str] = []
    education_level: str  # UG, PG, PhD
    deadline: str
    application_link: Optional[str] = None
    documents_required: List[str] = []
    description: str
    benefits: List[str] = []
    selection_process: str
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    featured_image: Optional[str] = None
    
    # Author Info
    author: str
    author_image: Optional[str] = None
    
    # Tags & Related
    tags: List[str] = []
    related_colleges: List[str] = []
    related_exams: List[str] = []
    
    # Stats
    views: int = 0
    shares: int = 0
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    
    # Status
    published: bool = True
    featured: bool = False
    
    # Timestamps
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Admin User Model
class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    slug: str
    description: Optional[str] = None
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
    slug: str
    year: int
    category: Optional[str] = None  # Overall, Engineering, Medical, etc.
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Scholarship Model
class Scholarship(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    provider: str  # Government, Private, College
    amount: Optional[float] = None
    amount_type: str = "Fixed"  # Fixed, Variable, Percentage
    eligibility: str
    description: str
    how_to_apply: str
    deadline: Optional[datetime] = None
    website: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Loan Model
class Loan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    provider: str  # Bank name or NBFC
    loan_amount_min: Optional[float] = None
    loan_amount_max: Optional[float] = None
    interest_rate: Optional[float] = None
    eligibility: str
    description: str
    features: List[str] = []
    how_to_apply: str
    website: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    role = payload.get("role", "student")
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Check if user is admin
    if role == "admin":
        admin = await db.admins.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if admin is None:
            raise HTTPException(status_code=401, detail="Admin not found")
        # Return a User object with admin properties
        return User(
            id=admin["id"],
            email=admin["email"],
            name=admin["name"],
            role="admin",
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
    
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

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
            phone="",
            enrolled_courses=[],
            saved_colleges=[],
            saved_courses=[],
            is_premium=True
        )
    )

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
    if image_type == "logo":
        max_width, max_height = 400, 400  # Square logos
    elif image_type == "banner":
        max_width, max_height = 1600, 400  # Wide banners
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
    """Upload an image file (logo, banner, or campus gallery) - Admin only"""
    # Verify admin token
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Validate type parameter
    if type not in ["logo", "banner", "campus"]:
        raise HTTPException(status_code=400, detail="Type must be 'logo', 'banner', or 'campus'")
    
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
    upload_subdir = "logos" if type == "logo" else ("banners" if type == "banner" else "campus")
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
async def get_admin_stats():
    """Get platform statistics for admin dashboard"""
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

@api_router.get("/colleges", response_model=List[College])
async def get_colleges(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    type: Optional[str] = None,
    min_fees: Optional[float] = None,
    max_fees: Optional[float] = None,
    course: Optional[str] = None,
    sort_by: Optional[str] = Query("nirf_ranking", regex="^(name|nirf_ranking|average_fees|rating)$")
):
    query = {}
    
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
    
    if min_fees is not None or max_fees is not None:
        query["average_fees"] = {}
        if min_fees is not None:
            query["average_fees"]["$gte"] = min_fees
        if max_fees is not None:
            query["average_fees"]["$lte"] = max_fees
    
    if course:
        query["courses.name"] = {"$regex": course, "$options": "i"}
    
    sort_order = 1 if sort_by == "name" else 1 if sort_by == "nirf_ranking" else -1
    
    colleges = await db.colleges.find(query, {"_id": 0}).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return [College(**college) for college in colleges]

@api_router.get("/colleges/featured", response_model=List[College])
async def get_featured_colleges(limit: int = Query(8, ge=1, le=20)):
    colleges = await db.colleges.find({}, {"_id": 0}).sort("nirf_ranking", 1).limit(limit).to_list(limit)
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return [College(**college) for college in colleges]

@api_router.get("/colleges/{college_id}", response_model=College)
async def get_college(college_id: str):
    college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    if isinstance(college.get('created_at'), str):
        college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return College(**college)

@api_router.post("/colleges", response_model=College)
async def create_college(college_data: CollegeCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create colleges")
    
    college = College(**college_data.model_dump(), total_courses=len(college_data.courses))
    college_dict = college.model_dump()
    college_dict['created_at'] = college_dict['created_at'].isoformat()
    
    await db.colleges.insert_one(college_dict)
    return college

@api_router.put("/colleges/{college_id}", response_model=College)
async def update_college(college_id: str, college_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update colleges")
    
    existing_college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not existing_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Update the college
    college_data['total_courses'] = len(college_data.get('courses', []))
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
    
    for exam in exams:
        if isinstance(exam.get('created_at'), str):
            exam['created_at'] = datetime.fromisoformat(exam['created_at'])
    
    return exams

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
    limit: int = Query(20, ge=1, le=100)
):
    courses = await db.courses_detailed.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
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

@api_router.get("/exams-detail", response_model=List[Exam])
async def get_exams_detail(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    exams = await db.exams_detailed.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for exam in exams:
        if isinstance(exam.get('created_at'), str):
            exam['created_at'] = datetime.fromisoformat(exam['created_at'])
    
    return exams

@api_router.get("/exams-detail/{exam_id}", response_model=Exam)
async def get_exam_detail(exam_id: str):
    exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    if isinstance(exam.get('created_at'), str):
        exam['created_at'] = datetime.fromisoformat(exam['created_at'])
    
    return Exam(**exam)

@api_router.post("/exams-detail", response_model=Exam)
async def create_exam_detail(exam_data: ExamCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create exams")
    
    exam = Exam(**exam_data.model_dump())
    exam_dict = exam.model_dump()
    exam_dict['created_at'] = exam_dict['created_at'].isoformat()
    
    await db.exams_detailed.insert_one(exam_dict)
    return exam

@api_router.put("/exams-detail/{exam_id}", response_model=Exam)
async def update_exam_detail(exam_id: str, exam_data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update exams")
    
    existing_exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    if not existing_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    await db.exams_detailed.update_one({"id": exam_id}, {"$set": exam_data})
    updated_exam = await db.exams_detailed.find_one({"id": exam_id}, {"_id": 0})
    
    if isinstance(updated_exam.get('created_at'), str):
        updated_exam['created_at'] = datetime.fromisoformat(updated_exam['created_at'])
    
    return Exam(**updated_exam)

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

@api_router.get("/education-loans", response_model=List[EducationLoan])
async def get_education_loans(
    loan_type: Optional[str] = None,
    max_interest_rate: Optional[float] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    query = {}
    
    if loan_type:
        query["loan_type"] = loan_type
    
    if max_interest_rate:
        query["interest_rate"] = {"$lte": max_interest_rate}
    
    loans = await db.education_loans.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for loan in loans:
        if isinstance(loan.get('created_at'), str):
            loan['created_at'] = datetime.fromisoformat(loan['created_at'])
    
    return loans

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

@api_router.get("/scholarships", response_model=List[ScholarshipProgram])
async def get_scholarships(
    scholarship_type: Optional[str] = None,
    provider: Optional[str] = None,
    education_level: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    query = {}
    
    if scholarship_type:
        query["scholarship_type"] = scholarship_type
    
    if provider:
        query["provider"] = provider
    
    if education_level:
        query["education_level"] = education_level
    
    scholarships = await db.scholarships.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for scholarship in scholarships:
        if isinstance(scholarship.get('created_at'), str):
            scholarship['created_at'] = datetime.fromisoformat(scholarship['created_at'])
    
    return scholarships

@api_router.get("/scholarships/{scholarship_id}", response_model=Scholarship)
async def get_scholarship(scholarship_id: str):
    scholarship = await db.scholarships.find_one({"id": scholarship_id}, {"_id": 0})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    if isinstance(scholarship.get('created_at'), str):
        scholarship['created_at'] = datetime.fromisoformat(scholarship['created_at'])
    
    return Scholarship(**scholarship)

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
    limit: int = Query(20, ge=1, le=100)
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
    limit: int = Query(20, ge=1, le=100)
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
    limit: int = Query(20, ge=1, le=100),
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

# ============================================
# Scholarship Routes
# ============================================

@api_router.get("/scholarships", response_model=List[ScholarshipProgram])
async def get_scholarships(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    
    if type:
        query["type"] = type
    
    if level:
        query["level"] = level
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"provider": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    scholarships = await db.scholarships.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for scholarship in scholarships:
        if isinstance(scholarship.get('created_at'), str):
            scholarship['created_at'] = datetime.fromisoformat(scholarship['created_at'])
    
    return scholarships

@api_router.get("/scholarships/{scholarship_id}", response_model=ScholarshipProgram)
async def get_scholarship(scholarship_id: str):
    scholarship = await db.scholarships.find_one({"id": scholarship_id}, {"_id": 0})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    if isinstance(scholarship.get('created_at'), str):
        scholarship['created_at'] = datetime.fromisoformat(scholarship['created_at'])
    
    return ScholarshipProgram(**scholarship)

# ============================================
# Loan Routes
# ============================================

@api_router.get("/loans", response_model=List[LoanProvider])
async def get_loan_providers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = None
):
    query = {}
    
    if type:
        query["type"] = type
    
    loans = await db.loans.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for loan in loans:
        if isinstance(loan.get('created_at'), str):
            loan['created_at'] = datetime.fromisoformat(loan['created_at'])
    
    return loans

@api_router.get("/loans/{loan_id}", response_model=LoanProvider)
async def get_loan_provider(loan_id: str):
    loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(status_code=404, detail="Loan provider not found")
    
    if isinstance(loan.get('created_at'), str):
        loan['created_at'] = datetime.fromisoformat(loan['created_at'])
    
    return LoanProvider(**loan)

# ============================================
# Blog/Article Routes
# ============================================

@api_router.get("/articles", response_model=List[Article])
async def get_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
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
    city: Optional[str] = None,
    state: Optional[str] = None,
    board: Optional[str] = None,
    school_type: Optional[str] = None,
    medium: Optional[str] = None,
    sort: str = "rating",
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get all schools with optional filters"""
    query = {}
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
    return schools

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
    limit: int = Query(50, ge=1, le=100),
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
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    tag: Optional[str] = None,
    sort: str = "latest",
    limit: int = Query(20, ge=1, le=50),
    skip: int = Query(0, ge=0)
):
    """Get all news articles with optional filters"""
    query = {"published": True}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if tag:
        query["tags"] = tag
    
    sort_field = "published_at" if sort == "latest" else "views"
    sort_order = -1
    
    news = await db.news.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    return news

@api_router.get("/news/{news_id}", response_model=News)
async def get_news_article(news_id: str):
    """Get a specific news article by ID"""
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    
    # Increment view count
    await db.news.update_one({"id": news_id}, {"$inc": {"views": 1}})
    
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
@api_router.get("/scholarships")
async def get_scholarships(limit: int = 100):
    scholarships = await db.scholarships.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return scholarships

@api_router.post("/scholarships", response_model=Scholarship)
async def create_scholarship(scholarship: Scholarship):
    await db.scholarships.insert_one(scholarship.model_dump())
    return scholarship

@api_router.put("/scholarships/{scholarship_id}")
async def update_scholarship(scholarship_id: str, scholarship: Scholarship):
    await db.scholarships.update_one({"id": scholarship_id}, {"$set": scholarship.model_dump()})
    return scholarship

@api_router.delete("/scholarships/{scholarship_id}")
async def delete_scholarship(scholarship_id: str):
    await db.scholarships.delete_one({"id": scholarship_id})
    return {"success": True}

# Loans
@api_router.get("/loans")
async def get_loans(limit: int = 100):
    loans = await db.loans.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return loans

@api_router.post("/loans", response_model=Loan)
async def create_loan(loan: Loan):
    await db.loans.insert_one(loan.model_dump())
    return loan

@api_router.put("/loans/{loan_id}")
async def update_loan(loan_id: str, loan: Loan):
    await db.loans.update_one({"id": loan_id}, {"$set": loan.model_dump()})
    return loan

@api_router.delete("/loans/{loan_id}")
async def delete_loan(loan_id: str):
    await db.loans.delete_one({"id": loan_id})
    return {"success": True}

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
    now = datetime.now(timezone.utc)
    
    # Query for active ads
    query = {
        "is_active": True,
        "pages": page_name,
        "start_date": {"$lte": now},
        "end_date": {"$gte": now}
    }
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("priority", -1).to_list(100)
    
    for ad in ads:
        if isinstance(ad.get('start_date'), str):
            ad['start_date'] = datetime.fromisoformat(ad['start_date'])
        if isinstance(ad.get('end_date'), str):
            ad['end_date'] = datetime.fromisoformat(ad['end_date'])
    
    return ads

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
    
    ad = Advertisement(**ad_data, created_by=current_user.id)
    ad_dict = ad.model_dump()
    ad_dict['created_at'] = ad_dict['created_at'].isoformat()
    ad_dict['updated_at'] = ad_dict['updated_at'].isoformat()
    ad_dict['start_date'] = ad_dict['start_date'].isoformat()
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
        
        if isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date)
        if isinstance(end_date, str):
            end_date = datetime.fromisoformat(end_date)
        
        is_currently_active = (
            ad.get('is_active', False) and 
            start_date <= now <= end_date
        )
        
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

app.include_router(api_router)

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
