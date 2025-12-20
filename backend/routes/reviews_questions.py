"""Reviews and Q&A API"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Reviews & Q&A"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    rating: int  # 1-5
    review_text: Optional[str] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    placements_rating: Optional[int] = None
    infrastructure_rating: Optional[int] = None
    faculty_rating: Optional[int] = None
    status: str = "pending"  # pending, approved, rejected
    earnings: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Question(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    college_id: str
    user_id: str
    user_name: str
    question: str
    answers: List[dict] = []
    is_answered: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================
# Review Endpoints (Public Read)
# ============================================

@router.get("/reviews/college/{college_id}", response_model=List[Review])
async def get_college_reviews(
    college_id: str, 
    skip: int = Query(0, ge=0), 
    limit: int = Query(20, ge=1, le=100)
):
    """Get all reviews for a college (Public)"""
    reviews = await db.reviews.find(
        {"college_id": college_id, "status": "approved"}, 
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews


@router.get("/reviews/stats/{college_id}")
async def get_review_stats(college_id: str):
    """Get review statistics for a college"""
    reviews = await db.reviews.find(
        {"college_id": college_id, "status": "approved"}, 
        {"_id": 0, "rating": 1, "placements_rating": 1, "infrastructure_rating": 1, "faculty_rating": 1}
    ).to_list(1000)
    
    if not reviews:
        return {
            "total_reviews": 0,
            "average_rating": 0,
            "rating_breakdown": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0},
            "category_ratings": {
                "placements": 0,
                "infrastructure": 0,
                "faculty": 0
            }
        }
    
    total = len(reviews)
    avg_rating = sum(r.get('rating', 0) for r in reviews) / total
    
    rating_breakdown = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    placements_total = 0
    infrastructure_total = 0
    faculty_total = 0
    count_placements = 0
    count_infrastructure = 0
    count_faculty = 0
    
    for r in reviews:
        rating_str = str(r.get('rating', 3))
        if rating_str in rating_breakdown:
            rating_breakdown[rating_str] += 1
        
        if r.get('placements_rating'):
            placements_total += r['placements_rating']
            count_placements += 1
        if r.get('infrastructure_rating'):
            infrastructure_total += r['infrastructure_rating']
            count_infrastructure += 1
        if r.get('faculty_rating'):
            faculty_total += r['faculty_rating']
            count_faculty += 1
    
    return {
        "total_reviews": total,
        "average_rating": round(avg_rating, 1),
        "rating_breakdown": rating_breakdown,
        "category_ratings": {
            "placements": round(placements_total / count_placements, 1) if count_placements > 0 else 0,
            "infrastructure": round(infrastructure_total / count_infrastructure, 1) if count_infrastructure > 0 else 0,
            "faculty": round(faculty_total / count_faculty, 1) if count_faculty > 0 else 0
        }
    }


# ============================================
# Question Endpoints (Public Read)
# ============================================

@router.get("/questions/college/{college_id}", response_model=List[Question])
async def get_college_questions(
    college_id: str, 
    skip: int = Query(0, ge=0), 
    limit: int = Query(20, ge=1, le=100)
):
    """Get all questions for a college (Public)"""
    questions = await db.questions.find(
        {"college_id": college_id}, 
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for question in questions:
        if isinstance(question.get('created_at'), str):
            question['created_at'] = datetime.fromisoformat(question['created_at'])
    
    return questions


@router.get("/questions/{question_id}")
async def get_question(question_id: str):
    """Get a single question with answers"""
    question = await db.questions.find_one({"id": question_id}, {"_id": 0})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if isinstance(question.get('created_at'), str):
        question['created_at'] = datetime.fromisoformat(question['created_at'])
    
    return question


# ============================================
# Admin Review Management
# ============================================

@router.get("/admin/reviews/pending")
async def get_pending_reviews(limit: int = Query(50, ge=1, le=200)):
    """Get pending reviews for admin approval"""
    reviews = await db.reviews.find(
        {"status": "pending"}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews


@router.patch("/reviews/{review_id}/approve")
async def approve_review(review_id: str):
    """Approve a review (Admin only)"""
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"status": "approved"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review approved", "status": "approved"}


@router.patch("/reviews/{review_id}/reject")
async def reject_review(review_id: str):
    """Reject a review (Admin only)"""
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"status": "rejected"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review rejected", "status": "rejected"}
