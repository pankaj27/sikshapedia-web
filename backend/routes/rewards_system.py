"""
Rewards System Routes - Points, Redemptions, Referrals, User Activities
Handles the complete points and earnings system
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4

router = APIRouter(prefix="/rewards", tags=["Rewards System"])

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

# ============ CONSTANTS ============
POINTS_CONFIG = {
    "review_base": 50,           # Base points for review
    "review_detailed": 50,       # Bonus for 200+ char review
    "review_with_photos": 30,    # Bonus for photos
    "review_verified": 50,       # Bonus for verified student
    "answer_approved": 10,       # Points for approved answer
    "referral_success": 100,     # Points when referral submits first review
    "min_redemption_points": 200,  # Minimum points to redeem
    "points_to_rupees": 0.5      # 100 points = ₹50 → 1 point = ₹0.5
}

# ============ AUTH HELPER ============

async def get_current_user(request: Request, db):
    """Get current authenticated user from session"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
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
    
    user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# ============ MODELS ============

class RedemptionRequest(BaseModel):
    points: int = Field(..., ge=200, description="Minimum 200 points")
    upi_id: str = Field(..., min_length=5, description="UPI ID for payment")

class AnswerSubmit(BaseModel):
    question_id: str
    answer_text: str = Field(..., min_length=10)

class CommentSubmit(BaseModel):
    entity_type: str  # college, review, question, blog
    entity_id: str
    comment_text: str = Field(..., min_length=3)
    parent_id: Optional[str] = None

# ============ POINTS SUMMARY ============

@router.get("/points-summary")
async def get_points_summary(request: Request, db=Depends(get_db)):
    """Get comprehensive points summary for user"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    # Get all point transactions
    transactions = await db.point_transactions.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(500)
    
    # Calculate totals by type
    review_points = sum([t.get("points", 0) for t in transactions if t.get("type") == "review"])
    referral_points = sum([t.get("points", 0) for t in transactions if t.get("type") == "referral"])
    answer_points = sum([t.get("points", 0) for t in transactions if t.get("type") == "answer"])
    redeemed_points = sum([abs(t.get("points", 0)) for t in transactions if t.get("type") == "redemption"])
    
    # Current balance
    current_points = user.get("points", 0)
    
    # Pending reviews count
    pending_reviews = await db.reviews.count_documents({
        "user_id": user_id,
        "status": "pending"
    })
    
    # Calculate cash value
    cash_value = current_points * POINTS_CONFIG["points_to_rupees"]
    can_redeem = current_points >= POINTS_CONFIG["min_redemption_points"]
    
    return {
        "current_points": current_points,
        "cash_value": cash_value,
        "can_redeem": can_redeem,
        "min_redemption_points": POINTS_CONFIG["min_redemption_points"],
        "breakdown": {
            "from_reviews": review_points,
            "from_referrals": referral_points,
            "from_answers": answer_points,
            "redeemed": redeemed_points
        },
        "pending_reviews": pending_reviews,
        "recent_transactions": transactions[:10]
    }

@router.get("/points-history")
async def get_points_history(
    request: Request, 
    limit: int = 50,
    offset: int = 0,
    type_filter: Optional[str] = None,
    db=Depends(get_db)
):
    """Get detailed points transaction history"""
    user = await get_current_user(request, db)
    
    query = {"user_id": user["id"]}
    if type_filter:
        query["type"] = type_filter
    
    total = await db.point_transactions.count_documents(query)
    
    transactions = await db.point_transactions.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "transactions": transactions,
        "limit": limit,
        "offset": offset
    }

# ============ REDEMPTION ============

@router.post("/redeem")
async def request_redemption(redemption: RedemptionRequest, request: Request, db=Depends(get_db)):
    """Request points redemption via UPI"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    current_points = user.get("points", 0)
    
    # Validate points
    if redemption.points > current_points:
        raise HTTPException(status_code=400, detail=f"Insufficient points. You have {current_points} points.")
    
    if redemption.points < POINTS_CONFIG["min_redemption_points"]:
        raise HTTPException(status_code=400, detail=f"Minimum {POINTS_CONFIG['min_redemption_points']} points required for redemption")
    
    # Check for pending redemption
    pending = await db.redemption_requests.find_one({
        "user_id": user_id,
        "status": "pending"
    })
    if pending:
        raise HTTPException(status_code=400, detail="You have a pending redemption request. Please wait for it to be processed.")
    
    # Calculate amount
    amount = redemption.points * POINTS_CONFIG["points_to_rupees"]
    
    # Create redemption request
    redemption_doc = {
        "id": f"rdm_{uuid4().hex[:12]}",
        "user_id": user_id,
        "user_name": user.get("name"),
        "user_email": user.get("email"),
        "points": redemption.points,
        "amount": amount,
        "upi_id": redemption.upi_id,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "processed_at": None,
        "transaction_id": None,
        "admin_notes": None
    }
    
    await db.redemption_requests.insert_one(redemption_doc)
    
    # Deduct points immediately (hold)
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"points": -redemption.points}}
    )
    
    # Create point transaction
    await db.point_transactions.insert_one({
        "id": f"pt_{uuid4().hex[:12]}",
        "user_id": user_id,
        "type": "redemption",
        "points": -redemption.points,
        "description": f"Redemption request - ₹{amount} to {redemption.upi_id}",
        "reference_id": redemption_doc["id"],
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    redemption_doc.pop("_id", None)
    return {
        "message": "Redemption request submitted successfully",
        "redemption": redemption_doc,
        "note": "Your request will be processed within 24-48 hours"
    }

@router.get("/redemptions")
async def get_user_redemptions(request: Request, db=Depends(get_db)):
    """Get user's redemption history"""
    user = await get_current_user(request, db)
    
    redemptions = await db.redemption_requests.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Calculate totals
    total_redeemed = sum([r.get("amount", 0) for r in redemptions if r.get("status") == "completed"])
    pending_amount = sum([r.get("amount", 0) for r in redemptions if r.get("status") == "pending"])
    
    return {
        "total_redeemed": total_redeemed,
        "pending_amount": pending_amount,
        "redemptions": redemptions
    }

# ============ REFERRALS ============

@router.get("/referral-info")
async def get_referral_info(request: Request, db=Depends(get_db)):
    """Get user's referral code and stats"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    referral_code = user.get("referral_code", "")
    
    # If no referral code, generate one
    if not referral_code:
        referral_code = f"AB{user_id[:6].upper()}"
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"referral_code": referral_code}}
        )
    
    # Get referral stats
    total_referrals = await db.referrals.count_documents({"referrer_id": user_id})
    successful_referrals = await db.referrals.count_documents({
        "referrer_id": user_id,
        "status": "completed"
    })
    pending_referrals = await db.referrals.count_documents({
        "referrer_id": user_id,
        "status": "pending"
    })
    
    # Get referral list
    referrals = await db.referrals.find(
        {"referrer_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Calculate earnings from referrals
    referral_earnings = successful_referrals * POINTS_CONFIG["referral_success"]
    
    # Generate share link
    base_url = str(request.base_url).rstrip("/").replace("/api", "")
    share_link = f"{base_url}/signup?ref={referral_code}"
    
    return {
        "referral_code": referral_code,
        "share_link": share_link,
        "points_per_referral": POINTS_CONFIG["referral_success"],
        "stats": {
            "total_referrals": total_referrals,
            "successful": successful_referrals,
            "pending": pending_referrals,
            "total_earnings": referral_earnings
        },
        "referrals": referrals,
        "share_message": f"Join Admission Buddy and earn rewards! Use my referral code: {referral_code}. Sign up: {share_link}"
    }

# ============ ANSWERS ============

@router.post("/answer")
async def submit_answer(answer: AnswerSubmit, request: Request, db=Depends(get_db)):
    """Submit an answer to a question - earns points on approval"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    # Check if question exists
    question = await db.questions.find_one({"id": answer.question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Check if already answered by this user
    existing_answers = question.get("answers", [])
    for ans in existing_answers:
        if ans.get("user_id") == user_id:
            raise HTTPException(status_code=400, detail="You have already answered this question")
    
    answer_doc = {
        "id": f"ans_{uuid4().hex[:12]}",
        "user_id": user_id,
        "user_name": user.get("name"),
        "answer_text": answer.answer_text,
        "status": "pending",  # Needs admin approval for points
        "helpful_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Add answer to question
    await db.questions.update_one(
        {"id": answer.question_id},
        {
            "$push": {"answers": answer_doc},
            "$inc": {"answers_count": 1}
        }
    )
    
    # Also store in separate collection for easier admin management
    await db.user_answers.insert_one({
        **answer_doc,
        "question_id": answer.question_id,
        "question_text": question.get("question_text", question.get("title", "")),
        "college_id": question.get("college_id"),
        "college_name": question.get("college_name")
    })
    
    return {
        "message": "Answer submitted successfully. Points will be awarded after approval.",
        "answer": answer_doc,
        "potential_points": POINTS_CONFIG["answer_approved"]
    }

# ============ COMMENTS ============

@router.post("/comment")
async def submit_comment(comment: CommentSubmit, request: Request, db=Depends(get_db)):
    """Submit a comment on various entities"""
    user = await get_current_user(request, db)
    
    comment_doc = {
        "id": f"cmt_{uuid4().hex[:12]}",
        "user_id": user["id"],
        "user_name": user.get("name"),
        "entity_type": comment.entity_type,
        "entity_id": comment.entity_id,
        "comment_text": comment.comment_text,
        "parent_id": comment.parent_id,
        "likes": 0,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.comments.insert_one(comment_doc)
    
    comment_doc.pop("_id", None)
    return {"message": "Comment posted successfully", "comment": comment_doc}

@router.get("/comments/{entity_type}/{entity_id}")
async def get_comments(entity_type: str, entity_id: str, db=Depends(get_db)):
    """Get comments for an entity"""
    comments = await db.comments.find(
        {
            "entity_type": entity_type,
            "entity_id": entity_id,
            "status": "active"
        },
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"comments": comments, "total": len(comments)}

# ============ LIKES ============

@router.post("/like/{entity_type}/{entity_id}")
async def toggle_like(entity_type: str, entity_id: str, request: Request, db=Depends(get_db)):
    """Toggle like on an entity (college, review, comment)"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    existing = await db.likes.find_one({
        "user_id": user_id,
        "entity_type": entity_type,
        "entity_id": entity_id
    })
    
    if existing:
        # Unlike
        await db.likes.delete_one({"id": existing["id"]})
        return {"message": "Unliked", "liked": False}
    else:
        # Like
        like_doc = {
            "id": f"like_{uuid4().hex[:12]}",
            "user_id": user_id,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.likes.insert_one(like_doc)
        return {"message": "Liked", "liked": True}

@router.get("/liked/{entity_type}")
async def get_liked_entities(entity_type: str, request: Request, db=Depends(get_db)):
    """Get all liked entities of a type for current user"""
    user = await get_current_user(request, db)
    
    likes = await db.likes.find(
        {"user_id": user["id"], "entity_type": entity_type},
        {"_id": 0}
    ).to_list(500)
    
    return {"likes": likes, "entity_ids": [l["entity_id"] for l in likes]}

# ============ FAVORITES ============

@router.post("/favorite/{college_id}")
async def toggle_favorite(college_id: str, request: Request, db=Depends(get_db)):
    """Toggle favorite for a college"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    existing = await db.favorites.find_one({
        "user_id": user_id,
        "college_id": college_id
    })
    
    if existing:
        # Remove from favorites
        await db.favorites.delete_one({"id": existing["id"]})
        return {"message": "Removed from favorites", "favorited": False}
    else:
        # Get college name
        college = await db.colleges.find_one({"id": college_id}, {"_id": 0, "name": 1})
        
        fav_doc = {
            "id": f"fav_{uuid4().hex[:12]}",
            "user_id": user_id,
            "college_id": college_id,
            "college_name": college.get("name") if college else "Unknown",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.favorites.insert_one(fav_doc)
        return {"message": "Added to favorites", "favorited": True}

@router.get("/favorites")
async def get_favorites(request: Request, db=Depends(get_db)):
    """Get all favorite colleges"""
    user = await get_current_user(request, db)
    
    favorites = await db.favorites.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Get college details
    college_ids = [f["college_id"] for f in favorites]
    colleges = await db.colleges.find(
        {"id": {"$in": college_ids}},
        {"_id": 0, "id": 1, "name": 1, "logo_url": 1, "location": 1, "rating": 1}
    ).to_list(100)
    
    colleges_map = {c["id"]: c for c in colleges}
    
    result = []
    for fav in favorites:
        college = colleges_map.get(fav["college_id"], {})
        result.append({**fav, "college": college})
    
    return {"favorites": result, "total": len(result)}

# ============ USER ACTIVITY REPORT ============

@router.get("/activity-report")
async def get_activity_report(request: Request, db=Depends(get_db)):
    """Get comprehensive activity report for user dashboard"""
    user = await get_current_user(request, db)
    user_id = user["id"]
    
    # Reviews
    reviews = await db.reviews.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    approved_reviews = [r for r in reviews if r.get("status") == "approved"]
    pending_reviews = [r for r in reviews if r.get("status") == "pending"]
    
    # Answers
    answers = await db.user_answers.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    approved_answers = [a for a in answers if a.get("status") == "approved"]
    pending_answers = [a for a in answers if a.get("status") == "pending"]
    
    # Questions asked
    questions = await db.questions.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    # Comments
    comments = await db.comments.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    # Likes given
    likes = await db.likes.find({"user_id": user_id}, {"_id": 0}).to_list(500)
    
    # Favorites
    favorites = await db.favorites.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    # Referrals
    referrals = await db.referrals.find({"referrer_id": user_id}, {"_id": 0}).to_list(100)
    
    # Redemptions
    redemptions = await db.redemption_requests.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    
    # Points breakdown
    points_transactions = await db.point_transactions.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {
        "user": {
            "id": user_id,
            "name": user.get("name"),
            "email": user.get("email"),
            "points": user.get("points", 0),
            "referral_code": user.get("referral_code", "")
        },
        "reviews": {
            "total": len(reviews),
            "approved": len(approved_reviews),
            "pending": len(pending_reviews),
            "list": reviews[:5]
        },
        "answers": {
            "total": len(answers),
            "approved": len(approved_answers),
            "pending": len(pending_answers),
            "list": answers[:5]
        },
        "questions": {
            "total": len(questions),
            "list": questions[:5]
        },
        "comments": {
            "total": len(comments),
            "list": comments[:5]
        },
        "engagement": {
            "likes_given": len(likes),
            "favorites": len(favorites)
        },
        "referrals": {
            "total": len(referrals),
            "successful": len([r for r in referrals if r.get("status") == "completed"]),
            "pending": len([r for r in referrals if r.get("status") == "pending"])
        },
        "earnings": {
            "total_points": user.get("points", 0),
            "cash_value": user.get("points", 0) * POINTS_CONFIG["points_to_rupees"],
            "total_redeemed": sum([r.get("amount", 0) for r in redemptions if r.get("status") == "completed"]),
            "pending_redemption": sum([r.get("amount", 0) for r in redemptions if r.get("status") == "pending"])
        },
        "recent_points": points_transactions[:10]
    }
