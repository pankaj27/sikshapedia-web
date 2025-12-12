from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
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

# Create the main app without a prefix
app = FastAPI(title="Sikshapedia API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# ============================================
# Models
# ============================================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "student"  # student, admin
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

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    degree_type: str  # BTech, MTech, MBA, MBBS, etc.
    duration: str  # "4 years", "2 years"
    fees: float
    seats: Optional[int] = None
    eligibility: Optional[str] = None

class College(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    location: dict  # {city, state, country}
    established_year: int
    type: str  # Government, Private, Deemed
    affiliation: Optional[str] = None
    ranking: Optional[int] = None
    average_fees: float
    total_courses: int
    courses: List[Course] = []
    facilities: List[str] = []
    contact_info: dict  # {phone, email, website, address}
    images: List[str] = []
    description: str
    admission_process: Optional[str] = None
    accreditations: List[str] = []
    rating: float = 0.0
    total_reviews: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CollegeCreate(BaseModel):
    name: str
    slug: str
    location: dict
    established_year: int
    type: str
    affiliation: Optional[str] = None
    ranking: Optional[int] = None
    average_fees: float
    courses: List[Course] = []
    facilities: List[str] = []
    contact_info: dict
    images: List[str] = []
    description: str
    admission_process: Optional[str] = None
    accreditations: List[str] = []

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    rating: int  # 1-5
    review_text: str
    helpful_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    college_id: str
    rating: int
    review_text: str

class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    student_name: str
    email: EmailStr
    phone: str
    course_interested: str
    message: str
    status: str = "pending"  # pending, contacted, closed
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
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password_hash'] = password_hash.decode('utf-8')
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user_doc['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create user object
    user_doc.pop('password_hash', None)
    user_doc.pop('_id', None)
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    user = User(**user_doc)
    
    # Create token
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
    return {"message": "Sikshapedia API - College Listing Portal"}

@api_router.post("/colleges", response_model=College)
async def create_college(college_data: CollegeCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create colleges")
    
    college = College(**college_data.model_dump(), total_courses=len(college_data.courses))
    college_dict = college.model_dump()
    college_dict['created_at'] = college_dict['created_at'].isoformat()
    
    await db.colleges.insert_one(college_dict)
    return college

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
    sort_by: Optional[str] = Query("name", regex="^(name|ranking|average_fees|rating)$")
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
    
    # Sorting
    sort_order = 1 if sort_by in ["name"] else -1
    
    colleges = await db.colleges.find(query, {"_id": 0}).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return colleges

@api_router.get("/colleges/featured", response_model=List[College])
async def get_featured_colleges(limit: int = Query(6, ge=1, le=20)):
    colleges = await db.colleges.find({}, {"_id": 0}).sort("rating", -1).limit(limit).to_list(limit)
    
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

@api_router.get("/colleges/slug/{slug}", response_model=College)
async def get_college_by_slug(slug: str):
    college = await db.colleges.find_one({"slug": slug}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    if isinstance(college.get('created_at'), str):
        college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return College(**college)

@api_router.put("/colleges/{college_id}", response_model=College)
async def update_college(college_id: str, college_data: CollegeCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update colleges")
    
    existing_college = await db.colleges.find_one({"id": college_id})
    if not existing_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    college_dict = college_data.model_dump()
    college_dict['total_courses'] = len(college_data.courses)
    
    await db.colleges.update_one({"id": college_id}, {"$set": college_dict})
    
    updated_college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if isinstance(updated_college.get('created_at'), str):
        updated_college['created_at'] = datetime.fromisoformat(updated_college['created_at'])
    
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
    # Check if college exists
    college = await db.colleges.find_one({"id": review_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Check if user already reviewed
    existing_review = await db.reviews.find_one({
        "college_id": review_data.college_id,
        "user_id": current_user.id
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this college")
    
    review = Review(
        **review_data.model_dump(),
        user_id=current_user.id,
        user_name=current_user.name
    )
    review_dict = review.model_dump()
    review_dict['created_at'] = review_dict['created_at'].isoformat()
    
    await db.reviews.insert_one(review_dict)
    
    # Update college rating
    reviews = await db.reviews.find({"college_id": review_data.college_id}).to_list(1000)
    avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
    
    await db.colleges.update_one(
        {"id": review_data.college_id},
        {"$set": {"rating": round(avg_rating, 1), "total_reviews": len(reviews)}}
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
# Inquiry Routes
# ============================================

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    # Check if college exists
    college = await db.colleges.find_one({"id": inquiry_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    inquiry = Inquiry(**inquiry_data.model_dump())
    inquiry_dict = inquiry.model_dump()
    inquiry_dict['created_at'] = inquiry_dict['created_at'].isoformat()
    
    await db.inquiries.insert_one(inquiry_dict)
    return inquiry

@api_router.get("/inquiries/college/{college_id}", response_model=List[Inquiry])
async def get_college_inquiries(college_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view inquiries")
    
    inquiries = await db.inquiries.find({"college_id": college_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for inquiry in inquiries:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    
    return inquiries

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

# ============================================
# User Actions (Save College)
# ============================================

@api_router.post("/users/save-college/{college_id}")
async def save_college(college_id: str, current_user: User = Depends(get_current_user)):
    # Check if college exists
    college = await db.colleges.find_one({"id": college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Add to saved colleges
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
