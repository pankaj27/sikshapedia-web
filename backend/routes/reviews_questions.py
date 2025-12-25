"""Reviews and Q&A API"""
from fastapi import APIRouter, HTTPException, Query, Depends, Header
from typing import Optional, List, Any
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
    """Get current user from Authorization header - supports both JWT and session tokens"""
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "")
        
        # Check if it's a session token (from Google OAuth)
        if token.startswith("session_"):
            # Lookup session in database
            session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
            if not session:
                return None
            user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
            return user
        
        # Otherwise, treat as JWT token
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")  # Token uses 'sub' for user_id
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        return user
    except Exception:
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
    pros: Optional[Any] = None  # Can be string or list
    cons: Optional[Any] = None  # Can be string or list
    placements_rating: Optional[int] = None
    infrastructure_rating: Optional[int] = None
    faculty_rating: Optional[int] = None
    status: str = "pending"  # pending, approved, rejected
    earnings: float = 0.0
    likes: int = 0  # Like count
    liked_by: List[str] = []  # List of user IDs who liked
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


class ReviewCreate(BaseModel):
    college_id: str
    rating: int
    review_title: Optional[str] = None
    review_text: str
    course: Optional[str] = None
    year_of_study: Optional[str] = None
    graduation_year: Optional[str] = None
    ratings: Optional[dict] = {}
    pros: Optional[str] = None
    cons: Optional[str] = None
    placements_rating: Optional[int] = None
    infrastructure_rating: Optional[int] = None
    faculty_rating: Optional[int] = None
    facilities_rating: Optional[dict] = None
    verification_document: Optional[str] = None
    is_verified_student: Optional[bool] = False
    photos: Optional[list] = []


class EarningTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # review, referral
    amount: float
    description: str
    reference_id: str  # review_id or referral_user_id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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
    
    # Enrich reviews with college/institute names
    for review in reviews:
        college_id = review.get("college_id")
        if college_id:
            # Try to find in colleges, schools, or universities
            college = await db.colleges.find_one({"id": college_id}, {"_id": 0, "name": 1})
            if not college:
                college = await db.schools.find_one({"id": college_id}, {"_id": 0, "name": 1})
            if not college:
                college = await db.universities.find_one({"id": college_id}, {"_id": 0, "name": 1})
            
            review["college_name"] = college.get("name") if college else "Unknown Institute"
        else:
            review["college_name"] = "N/A"
    
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
# Review Write Endpoints (Requires Auth)
# ============================================

@router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, authorization: str = Header(None)):
    """Create a new review (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to write a review")
    
    user = await get_current_user_from_header(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to write a review")
    
    # Verify college/institution exists
    college = await db.colleges.find_one({"id": review_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Check for existing review
    existing_review = await db.reviews.find_one({
        "college_id": review_data.college_id,
        "user_id": user["id"]
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this college")
    
    # Calculate potential review earnings based on review quality (awarded on approval)
    review_earnings = 50.0  # Base earning for review
    if review_data.review_text and len(review_data.review_text) > 200:
        review_earnings = 100.0  # Higher earning for detailed reviews
    
    # Calculate potential points (awarded on approval)
    # Base: 50 points, Bonus: +50 for 200+ characters
    review_text_length = len(review_data.review_text or "")
    review_points = 50  # Base points
    if review_text_length >= 200:
        review_points = 100  # Base (50) + Bonus (50) for detailed review
    
    # Create review with pending status - points/earnings awarded ONLY after admin approval
    review = Review(
        college_id=review_data.college_id,
        user_id=user["id"],
        user_name=user.get("name", "Anonymous"),
        rating=review_data.rating,
        review_text=review_data.review_text,
        pros=review_data.pros,
        cons=review_data.cons,
        placements_rating=review_data.placements_rating,
        infrastructure_rating=review_data.infrastructure_rating,
        faculty_rating=review_data.faculty_rating,
        earnings=review_earnings,
        status="pending"  # Requires admin approval before points are awarded
    )
    review_dict = review.model_dump()
    review_dict['created_at'] = review_dict['created_at'].isoformat()
    review_dict['college_name'] = college.get('name', 'Unknown Institute')
    review_dict['points_earned'] = review_points  # Store for later awarding
    review_dict['review_title'] = review_data.review_title
    review_dict['course'] = review_data.course
    
    await db.reviews.insert_one(review_dict)
    
    # NOTE: Points and earnings are NOT awarded here
    # They will be awarded when admin approves the review via /reviews/{id}/approve
    
    # Create notification about submission (not earnings yet)
    notification = Notification(
        user_id=user["id"],
        type="review_submitted",
        title="Review Submitted for Approval!",
        message=f"Your review for {college['name']} has been submitted. You'll earn {review_points} points once approved!",
        link="/dashboard?tab=reviews"
    )
    notif_dict = notification.model_dump()
    notif_dict['created_at'] = notif_dict['created_at'].isoformat()
    await db.notifications.insert_one(notif_dict)
    
    return review


# ============================================
# Review Like Endpoints
# ============================================

@router.post("/reviews/{review_id}/like")
async def like_review(review_id: str, authorization: str = Header(None)):
    """Like a review (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to like reviews")
    
    user = await get_current_user_from_header(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to like reviews")
    
    review = await db.reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    liked_by = review.get("liked_by", [])
    user_id = user["id"]
    
    if user_id in liked_by:
        # Already liked - unlike it
        liked_by.remove(user_id)
        message = "Review unliked"
    else:
        # Like it
        liked_by.append(user_id)
        message = "Review liked"
    
    await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"liked_by": liked_by, "likes": len(liked_by)}}
    )
    
    return {
        "success": True, 
        "message": message, 
        "likes": len(liked_by),
        "liked": user_id in liked_by
    }


@router.get("/reviews/{review_id}/likes")
async def get_review_likes(review_id: str, authorization: str = Header(None)):
    """Get like count and check if current user liked"""
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0, "likes": 1, "liked_by": 1})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    user_liked = False
    if authorization:
        user = await get_current_user_from_header(authorization)
        if user:
            user_liked = user["id"] in review.get("liked_by", [])
    
    return {
        "likes": review.get("likes", 0),
        "liked": user_liked
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
# Question Write Endpoints (Requires Auth)
# ============================================

@router.post("/questions", response_model=Question)
async def create_question(question_data: QuestionCreate, authorization: str = Header(None)):
    """Create a new question (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to ask a question")
    
    user = await get_current_user_from_header(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to ask a question")
    
    # Verify college exists
    college = await db.colleges.find_one({"id": question_data.college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    question = Question(
        college_id=question_data.college_id,
        question=question_data.question,
        user_id=user["id"],
        user_name=user.get("name", "Anonymous")
    )
    question_dict = question.model_dump()
    question_dict['created_at'] = question_dict['created_at'].isoformat()
    
    await db.questions.insert_one(question_dict)
    return question


@router.post("/questions/answer")
async def create_answer(answer_data: AnswerCreate, authorization: str = Header(None)):
    """Add an answer to a question (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to answer")
    
    user = await get_current_user_from_header(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to answer")
    
    question = await db.questions.find_one({"id": answer_data.question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Determine user name based on who's answering
    user_name = user.get("name", "Anonymous")
    is_institute_answer = False
    
    if answer_data.answered_by == "institute" and answer_data.institute_name:
        user_name = answer_data.institute_name
        is_institute_answer = True
    
    answer = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "user_name": user_name,
        "answer": answer_data.answer,
        "answered_by": answer_data.answered_by or "user",
        "is_official": is_institute_answer,
        "is_institute_answer": is_institute_answer,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.questions.update_one(
        {"id": answer_data.question_id},
        {
            "$push": {"answers": answer},
            "$set": {"is_answered": True}
        }
    )
    
    return {"message": "Answer added successfully", "answer": answer}


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
    """Approve a review and award points to user (Admin only)"""
    # Get the review first
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if already approved (prevent double points)
    if review.get("status") == "approved":
        return {"message": "Review already approved", "status": "approved"}
    
    # Update review status
    await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"status": "approved", "approved_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Now award points and earnings to the user
    user_id = review.get("user_id")
    review_points = review.get("points_earned", 50)
    review_earnings = review.get("earnings", 50.0)
    college_name = review.get("college_name", "Institute")
    
    if user_id:
        # Add earnings transaction
        earning_transaction = EarningTransaction(
            user_id=user_id,
            type="review",
            amount=review_earnings,
            description=f"Review for {college_name} (Approved)",
            reference_id=review_id
        )
        earn_dict = earning_transaction.model_dump()
        earn_dict['created_at'] = earn_dict['created_at'].isoformat()
        await db.earnings.insert_one(earn_dict)
        
        # Update user total earnings
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"total_earnings": review_earnings}}
        )
        
        # Add points to user
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"points": review_points}}
        )
        
        # Add point transaction for rewards tracking
        point_transaction = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "review",
            "points": review_points,
            "description": f"Review for {college_name} (Approved)",
            "reference_id": review_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.point_transactions.insert_one(point_transaction)
        
        # Create notification about approval and earnings
        notification = Notification(
            user_id=user_id,
            type="review_approved",
            title="Review Approved! Points Earned!",
            message=f"Your review for {college_name} has been approved. You earned {review_points} points!",
            link="/dashboard?tab=reviews"
        )
        notif_dict = notification.model_dump()
        notif_dict['created_at'] = notif_dict['created_at'].isoformat()
        await db.notifications.insert_one(notif_dict)
    
    # Update college rating (only count approved reviews)
    college_id = review.get("college_id")
    if college_id:
        approved_reviews = await db.reviews.find(
            {"college_id": college_id, "status": "approved"}
        ).to_list(1000)
        
        if approved_reviews:
            avg_rating = sum(r['rating'] for r in approved_reviews) / len(approved_reviews)
            
            # Update rating breakdown
            rating_breakdown = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
            for r in approved_reviews:
                rating_str = str(r.get('rating', 3))
                if rating_str in rating_breakdown:
                    rating_breakdown[rating_str] += 1
            
            await db.colleges.update_one(
                {"id": college_id},
                {"$set": {
                    "rating": round(avg_rating, 1),
                    "total_reviews": len(approved_reviews),
                    "rating_breakdown": rating_breakdown
                }}
            )
    
    return {"message": "Review approved", "status": "approved", "points_awarded": review_points}


class RejectReviewRequest(BaseModel):
    reason: Optional[str] = None


@router.patch("/reviews/{review_id}/reject")
async def reject_review(review_id: str, reject_data: RejectReviewRequest = None):
    """Reject a review with optional reason (Admin only)"""
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    rejection_reason = reject_data.reason if reject_data else None
    
    await db.reviews.update_one(
        {"id": review_id},
        {"$set": {
            "status": "rejected",
            "rejection_reason": rejection_reason,
            "rejected_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Notify user about rejection
    user_id = review.get("user_id")
    college_name = review.get("college_name", "Institute")
    
    if user_id:
        message = f"Your review for {college_name} was not approved."
        if rejection_reason:
            message += f" Reason: {rejection_reason}"
        
        notification = Notification(
            user_id=user_id,
            type="review_rejected",
            title="Review Not Approved",
            message=message,
            link="/dashboard?tab=reviews"
        )
        notif_dict = notification.model_dump()
        notif_dict['created_at'] = notif_dict['created_at'].isoformat()
        await db.notifications.insert_one(notif_dict)
    
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
    
    # Enrich questions with entity names
    for question in questions:
        entity_id = question.get("college_id")
        if entity_id:
            # Try to find in colleges, schools, universities, courses, or exams
            entity = await db.colleges.find_one({"id": entity_id}, {"_id": 0, "name": 1})
            entity_type = "College"
            
            if not entity:
                entity = await db.schools.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                entity_type = "School"
            if not entity:
                entity = await db.universities.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                entity_type = "University"
            if not entity:
                entity = await db.courses.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                entity_type = "Course"
            if not entity:
                entity = await db.exams.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                entity_type = "Exam"
            
            question["entity_name"] = entity.get("name") if entity else "Unknown"
            question["entity_type_label"] = entity_type if entity else "Unknown"
        else:
            question["entity_name"] = "N/A"
            question["entity_type_label"] = "N/A"
    
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
