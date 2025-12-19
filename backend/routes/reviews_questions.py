"""
Reviews and Questions Routes
Handles user reviews and Q&A for colleges/schools
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import os
import jwt

# Create router
reviews_router = APIRouter(prefix="/api", tags=["Reviews & Questions"])
security = HTTPBearer(auto_error=False)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

# Database will be injected from main app
db = None

def set_database(database):
    """Set the database instance from main app"""
    global db
    db = database

# ============================================
# Pydantic Models
# ============================================

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    rating: float
    review_text: str
    pros: List[str] = []
    cons: List[str] = []
    placement_rating: Optional[float] = None
    faculty_rating: Optional[float] = None
    infrastructure_rating: Optional[float] = None
    campus_life_rating: Optional[float] = None
    value_for_money_rating: Optional[float] = None
    helpful_count: int = 0
    status: str = "pending"
    earnings: float = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    college_id: str
    rating: float
    review_text: str
    pros: List[str] = []
    cons: List[str] = []
    placement_rating: Optional[float] = None
    faculty_rating: Optional[float] = None
    infrastructure_rating: Optional[float] = None
    campus_life_rating: Optional[float] = None
    value_for_money_rating: Optional[float] = None

class Question(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    question_text: str
    answers: List[dict] = []
    helpful_count: int = 0
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuestionCreate(BaseModel):
    college_id: str
    question_text: str


# ============================================
# Helper Functions
# ============================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return type('User', (), user)()
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============================================
# Review Endpoints
# ============================================

@reviews_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user = Depends(get_current_user)):
    """Create a new review for a college"""
    college = await db.colleges.find_one({"id": review_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    existing_review = await db.reviews.find_one({
        "college_id": review_data.college_id,
        "user_id": current_user.id
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this college")
    
    # Calculate review earnings
    review_earnings = 50.0
    if review_data.review_text and len(review_data.review_text) > 200:
        review_earnings = 100.0
    
    review = Review(
        **review_data.model_dump(), 
        user_id=current_user.id, 
        user_name=current_user.name,
        earnings=review_earnings,
        status="approved"
    )
    review_dict = review.model_dump()
    if isinstance(review_dict.get('created_at'), datetime):
        review_dict['created_at'] = review_dict['created_at'].isoformat()
    
    await db.reviews.insert_one(review_dict)
    
    # Update user earnings
    await db.users.update_one(
        {"id": current_user.id},
        {"$inc": {"total_earnings": review_earnings}}
    )
    
    review_dict.pop('_id', None)
    return review_dict

@reviews_router.get("/reviews/college/{college_id}", response_model=List[Review])
async def get_college_reviews(college_id: str, limit: int = 20):
    """Get reviews for a specific college"""
    reviews = await db.reviews.find(
        {"college_id": college_id, "status": "approved"},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return reviews

@reviews_router.get("/reviews/pending")
async def get_pending_reviews(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get pending reviews for admin approval"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") not in ["super_admin", "content_manager"]:
            raise HTTPException(status_code=403, detail="Admin access required")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    reviews = await db.reviews.find({"status": "pending"}, {"_id": 0}).to_list(100)
    return reviews

@reviews_router.patch("/reviews/{review_id}/approve")
async def approve_review(review_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Approve a pending review"""
    await db.reviews.update_one({"id": review_id}, {"$set": {"status": "approved"}})
    return {"success": True}

@reviews_router.patch("/reviews/{review_id}/reject")
async def reject_review(review_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Reject a pending review"""
    await db.reviews.update_one({"id": review_id}, {"$set": {"status": "rejected"}})
    return {"success": True}

@reviews_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Delete a review"""
    await db.reviews.delete_one({"id": review_id})
    return {"success": True}


# ============================================
# Question Endpoints
# ============================================

@reviews_router.post("/questions", response_model=Question)
async def create_question(question_data: QuestionCreate, current_user = Depends(get_current_user)):
    """Create a new question for a college"""
    question = Question(
        **question_data.model_dump(),
        user_id=current_user.id,
        user_name=current_user.name
    )
    question_dict = question.model_dump()
    if isinstance(question_dict.get('created_at'), datetime):
        question_dict['created_at'] = question_dict['created_at'].isoformat()
    
    await db.questions.insert_one(question_dict)
    question_dict.pop('_id', None)
    return question_dict

@reviews_router.get("/questions/college/{college_id}", response_model=List[Question])
async def get_college_questions(college_id: str, limit: int = 20):
    """Get questions for a specific college"""
    questions = await db.questions.find(
        {"college_id": college_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return questions

@reviews_router.post("/questions/answer")
async def answer_question(answer_data: dict, current_user = Depends(get_current_user)):
    """Add an answer to a question"""
    question_id = answer_data.get("question_id")
    answer_text = answer_data.get("answer_text")
    
    if not question_id or not answer_text:
        raise HTTPException(status_code=400, detail="Question ID and answer text required")
    
    answer = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "user_name": current_user.name,
        "answer_text": answer_text,
        "helpful_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.questions.update_one(
        {"id": question_id},
        {"$push": {"answers": answer}}
    )
    
    return {"success": True, "answer": answer}
