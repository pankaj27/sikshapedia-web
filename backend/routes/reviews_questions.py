"""Reviews and Q&A API"""
from fastapi import APIRouter, HTTPException, Query, Depends, Header
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid
import jwt
import os

router = APIRouter(prefix="/api", tags=["Reviews & Q&A"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database


# ============================================
# Auth Helper
# ============================================

async def get_current_user_from_header(authorization: str = Header(None)):
    """Get current user from Authorization header"""
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "")
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload.get("user_id")}, {"_id": 0})
        return user
    except:
        return None


# ============================================
# Models
# ============================================

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


class QuestionCreate(BaseModel):
    college_id: str
    question: str


class AnswerCreate(BaseModel):
    question_id: str
    answer: str
    answered_by: Optional[str] = "user"  # user or institute
    institute_name: Optional[str] = None


# ============================================
# Review Endpoints (Public Read)
# ============================================

@router.get("/reviews")
async def get_all_reviews(
    status: str = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Get all reviews (Admin - for moderation)"""
    query = {}
    if status:
        query["status"] = status
    
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return reviews


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


@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str):
    """Delete a review (Admin only)"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True, "message": "Review deleted"}


@router.delete("/questions/{question_id}")
async def delete_question(question_id: str):
    """Delete a question (Admin only)"""
    result = await db.questions.delete_one({"id": question_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"success": True, "message": "Question deleted"}


@router.delete("/questions/{question_id}/answers/{answer_index}")
async def delete_answer(question_id: str, answer_index: int):
    """Delete an answer from a question (Admin only)"""
    question = await db.questions.find_one({"id": question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    answers = question.get("answers", [])
    if answer_index < 0 or answer_index >= len(answers):
        raise HTTPException(status_code=404, detail="Answer not found")
    
    answers.pop(answer_index)
    await db.questions.update_one(
        {"id": question_id},
        {"$set": {"answers": answers, "is_answered": len(answers) > 0}}
    )
    return {"success": True, "message": "Answer deleted"}


# ============================================
# Institute Reviews/Questions (For Institute Dashboard)
# ============================================

@router.get("/institute/reviews/{institute_id}")
async def get_institute_reviews(institute_id: str, status: str = Query(None)):
    """Get all reviews for an institute (Institute Dashboard)"""
    query = {"college_id": institute_id}
    if status:
        query["status"] = status
    
    reviews = await db.reviews.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reviews


@router.get("/institute/questions/{institute_id}")
async def get_institute_questions(institute_id: str):
    """Get all questions for an institute (Institute Dashboard)"""
    questions = await db.questions.find(
        {"college_id": institute_id}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return questions


@router.get("/admin/questions/pending")
async def get_pending_questions(limit: int = Query(50, ge=1, le=200)):
    """Get all questions for admin moderation"""
    questions = await db.questions.find(
        {}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(limit)
    return questions


# ============================================
# Review Link Generation (For Institutes)
# ============================================

class ReviewLinkCreate(BaseModel):
    institute_id: str
    institute_type: str  # college, school, university


class ReviewLink(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institute_id: str
    institute_type: str
    link_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views: int = 0
    submissions: int = 0


@router.post("/institute/review-link")
async def generate_review_link(data: ReviewLinkCreate):
    """Generate a shareable review link for an institute"""
    # Check if institute exists
    collection_map = {
        "college": "colleges",
        "school": "schools", 
        "university": "universities"
    }
    
    collection = collection_map.get(data.institute_type)
    if not collection:
        raise HTTPException(status_code=400, detail="Invalid institute type")
    
    institute = await db[collection].find_one({"id": data.institute_id}, {"_id": 0, "id": 1, "name": 1})
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")
    
    # Check for existing active link
    existing = await db.review_links.find_one({
        "institute_id": data.institute_id,
        "is_active": True
    }, {"_id": 0})
    
    if existing:
        return {
            "link_code": existing["link_code"],
            "institute_name": institute.get("name"),
            "is_new": False
        }
    
    # Create new link
    review_link = ReviewLink(
        institute_id=data.institute_id,
        institute_type=data.institute_type
    )
    
    link_dict = review_link.model_dump()
    link_dict["created_at"] = link_dict["created_at"].isoformat()
    
    await db.review_links.insert_one(link_dict)
    
    return {
        "link_code": review_link.link_code,
        "institute_name": institute.get("name"),
        "is_new": True
    }


@router.get("/institute/review-link/{institute_id}")
async def get_institute_review_link(institute_id: str):
    """Get existing review link for an institute"""
    link = await db.review_links.find_one({
        "institute_id": institute_id,
        "is_active": True
    }, {"_id": 0})
    
    if not link:
        return {"has_link": False}
    
    return {
        "has_link": True,
        "link_code": link["link_code"],
        "views": link.get("views", 0),
        "submissions": link.get("submissions", 0),
        "created_at": link.get("created_at")
    }


@router.get("/review/{link_code}")
async def get_review_page_data(link_code: str):
    """Get institute data for review page (Public)"""
    link = await db.review_links.find_one({"link_code": link_code, "is_active": True}, {"_id": 0})
    if not link:
        raise HTTPException(status_code=404, detail="Review link not found or expired")
    
    # Increment view count
    await db.review_links.update_one(
        {"link_code": link_code},
        {"$inc": {"views": 1}}
    )
    
    # Get institute data
    collection_map = {
        "college": "colleges",
        "school": "schools",
        "university": "universities"
    }
    
    collection = collection_map.get(link["institute_type"])
    institute = await db[collection].find_one(
        {"id": link["institute_id"]},
        {"_id": 0, "id": 1, "name": 1, "logo_url": 1, "cover_image": 1, "city": 1, "state": 1, "type": 1}
    )
    
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")
    
    return {
        "institute": institute,
        "institute_type": link["institute_type"],
        "link_code": link_code
    }


@router.post("/review/{link_code}/submit")
async def submit_review_via_link(link_code: str, review_data: dict):
    """Submit a review via shareable link (requires login)"""
    link = await db.review_links.find_one({"link_code": link_code, "is_active": True}, {"_id": 0})
    if not link:
        raise HTTPException(status_code=404, detail="Review link not found or expired")
    
    # Create review
    review = Review(
        college_id=link["institute_id"],
        user_id=review_data.get("user_id", "anonymous"),
        user_name=review_data.get("user_name", "Anonymous"),
        rating=review_data.get("rating", 5),
        review_text=review_data.get("review_text"),
        pros=review_data.get("pros"),
        cons=review_data.get("cons"),
        placements_rating=review_data.get("placements_rating"),
        infrastructure_rating=review_data.get("infrastructure_rating"),
        faculty_rating=review_data.get("faculty_rating"),
        status="pending"  # Needs approval
    )
    
    review_dict = review.model_dump()
    review_dict["created_at"] = review_dict["created_at"].isoformat()
    review_dict["source"] = "review_link"
    review_dict["link_code"] = link_code
    
    await db.reviews.insert_one(review_dict)
    
    # Increment submission count
    await db.review_links.update_one(
        {"link_code": link_code},
        {"$inc": {"submissions": 1}}
    )
    
    return {"success": True, "message": "Review submitted successfully. It will be visible after approval."}
