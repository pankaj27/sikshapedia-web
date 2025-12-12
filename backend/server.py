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
# Stats Route
# ============================================

@api_router.get("/stats")
async def get_stats():
    total_colleges = await db.colleges.count_documents({})
    total_reviews = await db.reviews.count_documents({})
    total_users = await db.users.count_documents({})
    
    return {
        "total_colleges": total_colleges,
        "total_reviews": total_reviews,
        "total_users": total_users
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
