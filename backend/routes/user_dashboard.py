"""
User Dashboard Routes - Profile, Applications, Reviews, Favorites, Referrals, Points
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
import jwt
import os

router = APIRouter(prefix="/user", tags=["User Dashboard"])

# JWT Configuration (must match server.py)
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

# Database reference - will be set by main app
_db = None

def set_database(database):
    """Set database reference from main app"""
    global _db
    _db = database

async def get_db():
    """Get database reference"""
    if _db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return _db

# ============ AUTH HELPER ============

async def get_current_user(request: Request, db):
    """Get current authenticated user from JWT token, session token, or session cookie"""
    # First try Authorization header
    auth_header = request.headers.get("Authorization")
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        
        # Check if it's a session token (starts with "session_")
        if token.startswith("session_"):
            # Session-based auth via header
            session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
            if session:
                expires_at = datetime.fromisoformat(session["expires_at"])
                if expires_at.tzinfo is None:
                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                if expires_at < datetime.now(timezone.utc):
                    raise HTTPException(status_code=401, detail="Session expired")
                
                user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0, "password_hash": 0, "password": 0})
                if user:
                    return user
        else:
            # Try JWT token
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub")
                if user_id:
                    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0, "password": 0})
                    if user:
                        return user
            except jwt.ExpiredSignatureError:
                raise HTTPException(status_code=401, detail="Token has expired")
            except jwt.exceptions.DecodeError:
                pass  # Try cookie next
            except Exception:
                pass  # Try cookie next
    
    # Fallback to session-based auth (cookies)
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = datetime.fromisoformat(session["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0, "password_hash": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# ============ MODELS ============

class AdmissionFormSubmit(BaseModel):
    college_id: str
    college_name: str
    course: str
    student_name: str
    father_name: str
    mother_name: str
    date_of_birth: str
    gender: str
    email: EmailStr
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    previous_qualification: str
    previous_marks: Optional[str] = None
    category: Optional[str] = None
    documents: Optional[List[str]] = []
    message: Optional[str] = None

class QuestionSubmit(BaseModel):
    college_id: Optional[str] = None
    college_name: Optional[str] = None
    title: str
    question: str
    category: Optional[str] = "general"

class ReviewSubmit(BaseModel):
    college_id: str
    college_name: str
    rating: int
    title: str
    review: str
    pros: Optional[List[str]] = []
    cons: Optional[List[str]] = []
    photos: Optional[List[str]] = []
    is_verified_student: bool = False

class CommentSubmit(BaseModel):
    entity_type: str  # review, question, blog
    entity_id: str
    comment: str
    parent_comment_id: Optional[str] = None

# ============ USER PROFILE ============

@router.get("/profile")
async def get_user_profile(request: Request, db=Depends(get_db)):
    """Get current user profile"""
    user = await get_current_user(request, db)
    return user

@router.put("/profile")
async def update_user_profile(request: Request, db=Depends(get_db)):
    """Update user profile including payment details (UPI, bank info)"""
    user = await get_current_user(request, db)
    
    # Get the update data from request body
    try:
        profile_data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body")
    
    # Build update dict - handle payment_details specially
    update_data = {}
    
    for key, value in profile_data.items():
        if key == "payment_details" and value:
            # Merge with existing payment details instead of replacing
            existing_payment = user.get("payment_details", {}) or {}
            payment_update = {k: v for k, v in value.items() if v is not None}
            update_data["payment_details"] = {**existing_payment, **payment_update}
        elif key not in ["id", "_id", "email", "password", "created_at"] and value is not None:
            update_data[key] = value
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Update user
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_data}
    )
    
    # Return updated user
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return updated_user

# ============ DASHBOARD OVERVIEW ============

@router.get("/dashboard")
async def get_dashboard(request: Request, db=Depends(get_db)):
    """Get comprehensive user dashboard data"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    # Get counts
    applications_count = await db.admission_forms.count_documents({"user_id": user_id})
    reviews_count = await db.reviews.count_documents({"user_id": user_id})
    questions_count = await db.questions.count_documents({"user_id": user_id})
    comments_count = await db.comments.count_documents({"user_id": user_id})
    favorites_count = await db.favorites.count_documents({"user_id": user_id})
    liked_count = await db.likes.count_documents({"user_id": user_id, "entity_type": "college"})
    referrals_count = await db.referral_tracking.count_documents({"referrer_id": user_id})
    
    # Get application status breakdown
    status_breakdown = {}
    for status in ["submitted", "under_review", "accepted", "rejected"]:
        count = await db.admission_forms.count_documents({"user_id": user_id, "status": status})
        status_breakdown[status] = count
    
    # Get total points/earnings
    total_points = user.get("points", 0)
    earnings_cursor = db.earnings.find({"user_id": user_id}, {"_id": 0, "amount": 1})
    total_earnings = sum([e.get("amount", 0) async for e in earnings_cursor])
    
    # Recent applications
    recent_applications = await db.admission_forms.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    # Recent reviews
    recent_reviews = await db.reviews.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "user": user,
        "stats": {
            "applications": applications_count,
            "reviews": reviews_count,
            "questions": questions_count,
            "comments": comments_count,
            "favorites": favorites_count,
            "liked_colleges": liked_count,
            "referrals": referrals_count,
            "points": total_points,
            "total_earnings": total_earnings
        },
        "application_status_breakdown": status_breakdown,
        "recent_applications": recent_applications,
        "recent_reviews": recent_reviews,
        "referral_code": user.get("referral_code", "")
    }

# ============ APPLICATIONS ============

@router.get("/applications")
async def get_applications(request: Request, db=Depends(get_db)):
    """Get all user applications"""
    user = await get_current_user(request, db)
    
    applications = await db.admission_forms.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return applications

@router.post("/applications")
async def submit_admission_form(form: AdmissionFormSubmit, request: Request, db=Depends(get_db)):
    """Submit admission form"""
    user = await get_current_user(request, db)
    
    # Generate application number
    count = await db.admission_forms.count_documents({})
    application_number = f"AB{datetime.now().year}{count + 1:06d}"
    
    application = {
        "id": f"app_{uuid4().hex[:12]}",
        "application_number": application_number,
        "user_id": user["id"],
        "user_name": user.get("name"),
        "user_email": user.get("email"),
        **form.dict(),
        "status": "submitted",
        "status_history": [{
            "status": "submitted",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "note": "Application submitted by user"
        }],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.admission_forms.insert_one(application)
    
    # Also create a lead entry for the institute
    lead = {
        "id": f"lead_{uuid4().hex[:12]}",
        "name": form.student_name,
        "email": form.email,
        "phone": form.phone,
        "city": form.city,
        "course_interested": form.course,
        "college_id": form.college_id,
        "college_name": form.college_name,
        "source": "admission_form",
        "source_detail": "User Dashboard - Admission Form",
        "application_id": application["id"],
        "user_id": user["id"],
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.leads.insert_one(lead)
    
    application.pop("_id", None)
    return {"message": "Application submitted successfully", "application": application}

@router.get("/applications/{application_id}")
async def get_application(application_id: str, request: Request, db=Depends(get_db)):
    """Get specific application details"""
    user = await get_current_user(request, db)
    
    application = await db.admission_forms.find_one(
        {"id": application_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

# ============ REVIEWS ============

@router.get("/reviews")
async def get_user_reviews(request: Request, db=Depends(get_db)):
    """Get all reviews by user with college details"""
    user = await get_current_user(request, db)
    
    reviews = await db.reviews.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # ALWAYS enrich reviews with college details for proper URL generation
    for review in reviews:
        college_id = review.get("college_id")
        if college_id:
            # Fetch college details from database
            college = await db.colleges.find_one(
                {"id": college_id},
                {"_id": 0, "name": 1, "slug": 1, "institution_type": 1, "serial_number": 1}
            )
            if college:
                # Always update these fields for consistent URL generation
                review["college_name"] = college.get("name", review.get("college_name", "Institute"))
                review["college_slug"] = college.get("slug")
                review["institution_type"] = college.get("institution_type", "college")
                review["serial_number"] = college.get("serial_number")
    
    return reviews

@router.post("/reviews")
async def submit_review(review: ReviewSubmit, request: Request, db=Depends(get_db)):
    """Submit a college review and earn points"""
    user = await get_current_user(request, db)
    
    # Check if already reviewed this college
    existing = await db.reviews.find_one({
        "user_id": user["id"],
        "college_id": review.college_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this college")
    
    # Calculate points
    points = 50  # Base points
    if len(review.review) >= 200:
        points += 50  # Detailed review bonus
    if review.is_verified_student:
        points += 50  # Verified student bonus
    if review.photos and len(review.photos) > 0:
        points += 30  # Photos bonus
    
    review_doc = {
        "id": f"rev_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "user_name": user.get("name"),
        "user_email": user.get("email"),
        **review.dict(),
        "points_earned": points,
        "status": "pending",  # Admin approval
        "helpful_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reviews.insert_one(review_doc)
    
    # Award points after admin approval (for now, award immediately)
    await db.users.update_one(
        {"id": user["id"]},
        {"$inc": {"points": points}}
    )
    
    # Create earning record
    await db.earnings.insert_one({
        "id": f"earn_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "type": "review",
        "amount": points,
        "description": f"Review for {review.college_name}",
        "reference_id": review_doc["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    review_doc.pop("_id", None)
    return {"message": "Review submitted successfully", "review": review_doc, "points_earned": points}

# ============ QUESTIONS ============

@router.get("/questions")
async def get_user_questions(request: Request, db=Depends(get_db)):
    """Get all questions by user with institute details"""
    user = await get_current_user(request, db)
    
    questions = await db.questions.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Enrich questions with college/institute details
    for question in questions:
        college_id = question.get("college_id")
        if college_id:
            college = await db.colleges.find_one(
                {"id": college_id},
                {"_id": 0, "name": 1, "slug": 1, "institution_type": 1, "serial_number": 1}
            )
            if college:
                question["college_name"] = college.get("name", "Institute")
                question["institution_type"] = college.get("institution_type", "college")
                question["serial_number"] = college.get("serial_number")
    
    return questions

@router.post("/questions")
async def submit_question(question: QuestionSubmit, request: Request, db=Depends(get_db)):
    """Submit a question"""
    user = await get_current_user(request, db)
    
    question_doc = {
        "id": f"q_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "user_name": user.get("name"),
        **question.dict(),
        "status": "open",
        "answers_count": 0,
        "upvotes": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.questions.insert_one(question_doc)
    
    question_doc.pop("_id", None)
    return {"message": "Question submitted successfully", "question": question_doc}

# ============ COMMENTS ============

# Helper function to generate institution URL
def generate_institution_url(inst_type, serial_number, name):
    """Generate proper institution URL: /{type}/{serial-padded}-{slug}"""
    import re
    type_path = "university" if inst_type and inst_type.lower() == "university" else \
                "schools" if inst_type and inst_type.lower() == "school" else "colleges"
    serial_padded = str(serial_number).zfill(3) if serial_number else "000"
    # Generate slug from name
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') if name else "institute"
    return f"/{type_path}/{serial_padded}-{slug}"

@router.get("/comments")
async def get_user_comments(request: Request, db=Depends(get_db)):
    """Get all comments by user with entity details"""
    user = await get_current_user(request, db)
    
    comments = await db.comments.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Enrich comments with entity details
    for comment in comments:
        entity_type = comment.get("entity_type", "")
        entity_id = comment.get("entity_id", "")
        
        # Try to get entity name based on type
        if entity_type == "college" and entity_id:
            college = await db.colleges.find_one(
                {"id": entity_id}, 
                {"_id": 0, "name": 1, "slug": 1, "institution_type": 1, "serial_number": 1}
            )
            if college:
                comment["entity_name"] = college.get("name", "College")
                comment["institution_type"] = college.get("institution_type", "college")
                comment["serial_number"] = college.get("serial_number")
                comment["entity_link"] = generate_institution_url(
                    college.get("institution_type"),
                    college.get("serial_number"),
                    college.get("name")
                )
        elif entity_type == "review" and entity_id:
            review = await db.reviews.find_one({"id": entity_id}, {"_id": 0, "college_name": 1, "college_id": 1})
            if review:
                college_id = review.get('college_id', '')
                college = await db.colleges.find_one(
                    {"id": college_id}, 
                    {"_id": 0, "name": 1, "institution_type": 1, "serial_number": 1}
                ) if college_id else None
                comment["entity_name"] = f"Review on {review.get('college_name', 'College')}"
                if college:
                    comment["institution_type"] = college.get("institution_type", "college")
                    comment["serial_number"] = college.get("serial_number")
                    comment["entity_link"] = generate_institution_url(
                        college.get("institution_type"),
                        college.get("serial_number"),
                        college.get("name")
                    )
                else:
                    comment["entity_link"] = "#"
        elif entity_type == "question" and entity_id:
            question = await db.questions.find_one({"id": entity_id}, {"_id": 0, "question": 1, "college_id": 1})
            if question:
                college_id = question.get('college_id', '')
                college = await db.colleges.find_one(
                    {"id": college_id}, 
                    {"_id": 0, "name": 1, "institution_type": 1, "serial_number": 1}
                ) if college_id else None
                comment["entity_name"] = f"Q&A: {question.get('question', 'Question')[:50]}..."
                if college:
                    comment["institution_type"] = college.get("institution_type", "college")
                    comment["serial_number"] = college.get("serial_number")
                    comment["entity_link"] = generate_institution_url(
                        college.get("institution_type"),
                        college.get("serial_number"),
                        college.get("name")
                    )
                else:
                    comment["entity_link"] = "#"
        elif entity_type == "exam" and entity_id:
            exam = await db.exams.find_one({"id": entity_id}, {"_id": 0, "name": 1, "slug": 1, "serial_number": 1})
            if exam:
                comment["entity_name"] = exam.get("name", "Exam")
                serial = str(exam.get("serial_number", "")).zfill(3) if exam.get("serial_number") else ""
                slug = exam.get("slug", entity_id)
                comment["entity_link"] = f"/exams/{serial}-{slug}" if serial else f"/exams/{slug}"
        elif entity_type == "blog" and entity_id:
            blog = await db.blogs.find_one({"id": entity_id}, {"_id": 0, "title": 1, "slug": 1})
            if blog:
                comment["entity_name"] = blog.get("title", "Blog")
                comment["entity_link"] = f"/blogs/{blog.get('slug', entity_id)}"
        elif entity_type == "news" and entity_id:
            news = await db.news.find_one({"id": entity_id}, {"_id": 0, "title": 1, "slug": 1})
            if news:
                comment["entity_name"] = news.get("title", "News")
                comment["entity_link"] = f"/news/{news.get('slug', entity_id)}"
        
        # Default if no entity found
        if "entity_name" not in comment:
            comment["entity_name"] = entity_type.title() if entity_type else "Post"
            comment["entity_link"] = "#"
    
    return comments

@router.post("/comments")
async def submit_comment(comment: CommentSubmit, request: Request, db=Depends(get_db)):
    """Submit a comment"""
    user = await get_current_user(request, db)
    
    comment_doc = {
        "id": f"cmt_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "user_name": user.get("name"),
        **comment.dict(),
        "likes": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.comments.insert_one(comment_doc)
    
    comment_doc.pop("_id", None)
    return {"message": "Comment submitted successfully", "comment": comment_doc}

# ============ FAVORITES & LIKES ============

@router.get("/favorites")
async def get_favorites(request: Request, db=Depends(get_db)):
    """Get favorite colleges"""
    user = await get_current_user(request, db)
    
    favorites = await db.favorites.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Get college details
    college_ids = [f["college_id"] for f in favorites]
    colleges = await db.colleges.find(
        {"id": {"$in": college_ids}},
        {"_id": 0, "id": 1, "name": 1, "logo_url": 1, "location": 1, "institution_type": 1, "slug": 1, "serial_number": 1}
    ).to_list(100)
    
    colleges_map = {c["id"]: c for c in colleges}
    
    result = []
    for fav in favorites:
        college = colleges_map.get(fav["college_id"], {})
        result.append({**fav, "college": college})
    
    return result

@router.post("/favorites/{college_id}")
async def add_favorite(college_id: str, request: Request, db=Depends(get_db)):
    """Add college to favorites"""
    user = await get_current_user(request, db)
    
    # Check if already favorited
    existing = await db.favorites.find_one({
        "user_id": user["id"],
        "college_id": college_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    # Get college name
    college = await db.colleges.find_one({"id": college_id}, {"_id": 0, "name": 1})
    
    favorite = {
        "id": f"fav_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "college_id": college_id,
        "college_name": college.get("name") if college else "Unknown",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.favorites.insert_one(favorite)
    
    return {"message": "Added to favorites"}

@router.delete("/favorites/{college_id}")
async def remove_favorite(college_id: str, request: Request, db=Depends(get_db)):
    """Remove college from favorites"""
    user = await get_current_user(request, db)
    
    await db.favorites.delete_one({
        "user_id": user["id"],
        "college_id": college_id
    })
    
    return {"message": "Removed from favorites"}

@router.get("/liked")
async def get_liked_colleges(request: Request, db=Depends(get_db)):
    """Get liked colleges with full details for URL generation"""
    user = await get_current_user(request, db)
    
    likes = await db.likes.find(
        {"user_id": user["id"], "entity_type": "college"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Get college details including serial_number and institution_type for URL generation
    college_ids = [like_item["entity_id"] for like_item in likes]
    colleges = await db.colleges.find(
        {"id": {"$in": college_ids}},
        {"_id": 0, "id": 1, "name": 1, "logo_url": 1, "location": 1, "institution_type": 1, "serial_number": 1}
    ).to_list(100)
    
    colleges_map = {c["id"]: c for c in colleges}
    
    result = []
    for like in likes:
        college = colleges_map.get(like["entity_id"], {})
        result.append({**like, "college": college})
    
    return result

@router.post("/like/{entity_type}/{entity_id}")
async def like_entity(entity_type: str, entity_id: str, request: Request, db=Depends(get_db)):
    """Like an entity (college, review, etc.)"""
    user = await get_current_user(request, db)
    
    existing = await db.likes.find_one({
        "user_id": user["id"],
        "entity_type": entity_type,
        "entity_id": entity_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Already liked")
    
    like = {
        "id": f"like_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "entity_type": entity_type,
        "entity_id": entity_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.likes.insert_one(like)
    
    return {"message": "Liked successfully"}

@router.delete("/like/{entity_type}/{entity_id}")
async def unlike_entity(entity_type: str, entity_id: str, request: Request, db=Depends(get_db)):
    """Unlike an entity"""
    user = await get_current_user(request, db)
    
    await db.likes.delete_one({
        "user_id": user["id"],
        "entity_type": entity_type,
        "entity_id": entity_id
    })
    
    return {"message": "Unliked successfully"}

# ============ REFERRALS & EARNINGS ============

@router.get("/referrals")
async def get_referrals(request: Request, db=Depends(get_db)):
    """Get user referrals"""
    user = await get_current_user(request, db)
    
    # Query referral_tracking collection (where referrals are stored)
    referrals = await db.referral_tracking.find(
        {"referrer_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {
        "referral_code": user.get("referral_code", ""),
        "total_referrals": len(referrals),
        "referrals": referrals
    }

@router.get("/earnings")
async def get_earnings(request: Request, db=Depends(get_db)):
    """Get user earnings/points history"""
    user = await get_current_user(request, db)
    
    earnings = await db.earnings.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Calculate totals by type
    review_earnings = sum([e.get("amount", 0) for e in earnings if e.get("type") == "review"])
    referral_earnings = sum([e.get("amount", 0) for e in earnings if e.get("type") == "referral"])
    
    return {
        "total_points": user.get("points", 0),
        "total_earnings": review_earnings + referral_earnings,
        "review_earnings": review_earnings,
        "referral_earnings": referral_earnings,
        "transactions": earnings
    }

# ============ SHARE LINK ============

@router.get("/share-link")
async def get_share_link(request: Request, db=Depends(get_db)):
    """Get shareable referral link"""
    user = await get_current_user(request, db)
    
    # Get base URL from request
    base_url = str(request.base_url).rstrip("/")
    # Remove /api if present
    base_url = base_url.replace("/api", "")
    
    referral_code = user.get("referral_code", "")
    share_link = f"{base_url}/?ref={referral_code}"
    
    return {
        "referral_code": referral_code,
        "share_link": share_link,
        "share_message": f"Join Admission Buddy and get ₹100 signup bonus! Use my referral code: {referral_code}. Sign up now: {share_link}"
    }
