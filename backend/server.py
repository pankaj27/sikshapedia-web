from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

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
    fees: float
    total_fees: float
    seats: Optional[int] = None
    eligibility: Optional[str] = None
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
    slug: str
    full_name: str
    description: str
    conducting_body: str
    exam_level: str  # National, State, University
    exam_type: str  # Entrance, Eligibility
    streams: List[str] = []  # Engineering, Medical, Management, etc.
    
    # Exam Details
    exam_mode: str  # Online, Offline, Both
    exam_duration: str
    total_marks: int
    num_questions: int
    exam_pattern: Dict
    syllabus: Optional[str] = None
    
    # Important Dates
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    exam_date: Optional[str] = None
    result_date: Optional[str] = None
    counseling_date: Optional[str] = None
    
    # Eligibility
    eligibility: Dict
    age_limit: Optional[str] = None
    
    # Fees & Cutoffs
    application_fee: Dict  # General, OBC, SC/ST
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
    fee_range: Dict  # min, max
    
    # Eligibility
    eligibility: str
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
    slug: str
    location: Dict
    established_year: int
    type: str  # Government, Private, Deemed
    affiliation: Optional[str] = None
    
    # Rankings
    nirf_ranking: Optional[int] = None
    india_today_ranking: Optional[int] = None
    outlook_ranking: Optional[int] = None
    
    # Fees & Courses
    average_fees: float
    total_courses: int
    courses: List[Course] = []
    
    # Facilities & Infrastructure
    facilities: List[str] = []
    hostel_info: Optional[Dict] = None
    campus_size: Optional[str] = None
    
    # Contact & Media
    contact_info: Dict
    images: List[str] = []
    videos: List[str] = []
    brochure_url: Optional[str] = None
    virtual_tour_url: Optional[str] = None
    
    # Content
    description: str
    highlights: List[str] = []
    admission_process: Optional[str] = None
    admission_dates: Optional[Dict] = None
    
    # Accreditations & Approvals
    accreditations: List[str] = []
    approvals: List[str] = []
    
    # Placements
    placement_stats: List[PlacementStats] = []
    
    # Faculty
    faculty: List[Faculty] = []
    
    # Scholarships
    scholarships: List[Scholarship] = []
    
    # Ratings & Reviews
    rating: float = 0.0
    total_reviews: int = 0
    rating_breakdown: Dict = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
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
    
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user_doc['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_doc.pop('password_hash', None)
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
    
    return colleges

@api_router.get("/colleges/featured", response_model=List[College])
async def get_featured_colleges(limit: int = Query(8, ge=1, le=20)):
    colleges = await db.colleges.find({}, {"_id": 0}).sort("nirf_ranking", 1).limit(limit).to_list(limit)
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return colleges

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
    
    review = Review(**review_data.model_dump(), user_id=current_user.id, user_name=current_user.name)
    review_dict = review.model_dump()
    review_dict['created_at'] = review_dict['created_at'].isoformat()
    
    await db.reviews.insert_one(review_dict)
    
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
    limit: int = Query(20, ge=1, le=100),
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
async def create_exam(exam_data: ExamCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create exams")
    
    exam = Exam(**exam_data.model_dump())
    exam_dict = exam.model_dump()
    exam_dict['created_at'] = exam_dict['created_at'].isoformat()
    
    await db.exams.insert_one(exam_dict)
    return exam

# ============================================
# Course Routes
# ============================================

@api_router.get("/courses", response_model=List[CourseDetail])
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
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

@api_router.post("/courses", response_model=CourseDetail)
async def create_course(course_data: CourseDetailCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create courses")
    
    course = CourseDetail(**course_data.model_dump())
    course_dict = course.model_dump()
    course_dict['created_at'] = course_dict['created_at'].isoformat()
    
    await db.courses.insert_one(course_dict)
    return course

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

# ============================================
# User Dashboard Routes
# ============================================

@api_router.get("/dashboard/stats")
async def get_user_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_applications = await db.applications.count_documents({"user_id": current_user.id})
    total_reviews = await db.reviews.count_documents({"user_id": current_user.id})
    saved_colleges_count = len(current_user.saved_colleges)
    
    recent_applications = await db.applications.find(
        {"user_id": current_user.id}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    for app in recent_applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app.get('updated_at'), str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return {
        "total_applications": total_applications,
        "total_reviews": total_reviews,
        "saved_colleges": saved_colleges_count,
        "recent_applications": recent_applications
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
# Stats Route
# ============================================

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

# Include the router in the main app
app.include_router(api_router)

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
