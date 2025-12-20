"""
Admin Rewards Management Routes
Handles review approval, redemption processing, user points management
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4
import os
import jwt

router = APIRouter(prefix="/admin/rewards", tags=["Admin Rewards Management"])
security = HTTPBearer(auto_error=False)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

# Database reference
_db = None

def set_database(database):
    global _db
    _db = database

async def get_db():
    if _db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return _db

# Points configuration
POINTS_CONFIG = {
    "review_base": 50,
    "review_detailed": 50,
    "review_with_photos": 30,
    "review_verified": 50,
    "answer_approved": 10,
    "referral_success": 100,
    "points_to_rupees": 0.5
}

# ============ AUTH HELPER ============

async def verify_admin(credentials: HTTPAuthorizationCredentials, db):
    """Verify admin token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") not in ["super_admin", "content_manager", "admin"]:
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ MODELS ============

class ReviewApprovalAction(BaseModel):
    action: str  # approve, reject
    admin_notes: Optional[str] = None

class AnswerApprovalAction(BaseModel):
    action: str  # approve, reject
    admin_notes: Optional[str] = None

class RedemptionProcessAction(BaseModel):
    action: str  # complete, reject
    transaction_id: Optional[str] = None
    admin_notes: Optional[str] = None

class PointsAdjustment(BaseModel):
    user_id: str
    points: int
    reason: str

# ============ DASHBOARD STATS ============

@router.get("/stats")
async def get_rewards_stats(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    """Get rewards system statistics"""
    await verify_admin(credentials, db)
    
    # Review stats
    pending_reviews = await db.reviews.count_documents({"status": "pending"})
    approved_reviews = await db.reviews.count_documents({"status": "approved"})
    rejected_reviews = await db.reviews.count_documents({"status": "rejected"})
    
    # Answer stats
    pending_answers = await db.user_answers.count_documents({"status": "pending"})
    approved_answers = await db.user_answers.count_documents({"status": "approved"})
    
    # Redemption stats
    pending_redemptions = await db.redemption_requests.count_documents({"status": "pending"})
    completed_redemptions = await db.redemption_requests.count_documents({"status": "completed"})
    
    # Calculate total payouts
    completed_reqs = await db.redemption_requests.find(
        {"status": "completed"},
        {"_id": 0, "amount": 1}
    ).to_list(10000)
    total_payouts = sum([r.get("amount", 0) for r in completed_reqs])
    
    pending_reqs = await db.redemption_requests.find(
        {"status": "pending"},
        {"_id": 0, "amount": 1}
    ).to_list(1000)
    pending_payout = sum([r.get("amount", 0) for r in pending_reqs])
    
    # Active users with points
    users_with_points = await db.users.count_documents({"points": {"$gt": 0}})
    
    # Total referrals
    total_referrals = await db.referrals.count_documents({})
    successful_referrals = await db.referrals.count_documents({"status": "completed"})
    
    return {
        "reviews": {
            "pending": pending_reviews,
            "approved": approved_reviews,
            "rejected": rejected_reviews
        },
        "answers": {
            "pending": pending_answers,
            "approved": approved_answers
        },
        "redemptions": {
            "pending": pending_redemptions,
            "completed": completed_redemptions,
            "total_payouts": total_payouts,
            "pending_payout": pending_payout
        },
        "referrals": {
            "total": total_referrals,
            "successful": successful_referrals
        },
        "users_with_points": users_with_points
    }

# ============ PENDING REVIEWS ============

@router.get("/pending-reviews")
async def get_pending_reviews(
    limit: int = 50,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get all pending reviews for approval"""
    await verify_admin(credentials, db)
    
    total = await db.reviews.count_documents({"status": "pending"})
    
    reviews = await db.reviews.find(
        {"status": "pending"},
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "reviews": reviews,
        "limit": limit,
        "offset": offset
    }

@router.post("/reviews/{review_id}/action")
async def process_review(
    review_id: str,
    action: ReviewApprovalAction,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Approve or reject a review"""
    admin = await verify_admin(credentials, db)
    
    review = await db.reviews.find_one({"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if review.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Review is not pending")
    
    new_status = "approved" if action.action == "approve" else "rejected"
    
    # Update review status
    await db.reviews.update_one(
        {"id": review_id},
        {
            "$set": {
                "status": new_status,
                "admin_notes": action.admin_notes,
                "processed_by": admin.get("sub"),
                "processed_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    # Award points if approved
    if action.action == "approve":
        user_id = review.get("user_id")
        points_earned = review.get("points_earned", POINTS_CONFIG["review_base"])
        
        # Update user points
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"points": points_earned}}
        )
        
        # Create point transaction
        await db.point_transactions.insert_one({
            "id": f"pt_{uuid4().hex[:12]}",
            "user_id": user_id,
            "type": "review",
            "points": points_earned,
            "description": f"Review approved for {review.get('college_name', 'college')}",
            "reference_id": review_id,
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Check if this is user's first review and they were referred
        reviews_count = await db.reviews.count_documents({
            "user_id": user_id,
            "status": "approved"
        })
        
        if reviews_count == 1:  # First approved review
            # Check if user was referred
            user = await db.users.find_one({"id": user_id})
            referred_by = user.get("referred_by")
            
            if referred_by:
                # Award referral bonus to referrer
                await db.users.update_one(
                    {"id": referred_by},
                    {"$inc": {"points": POINTS_CONFIG["referral_success"]}}
                )
                
                # Create point transaction for referrer
                await db.point_transactions.insert_one({
                    "id": f"pt_{uuid4().hex[:12]}",
                    "user_id": referred_by,
                    "type": "referral",
                    "points": POINTS_CONFIG["referral_success"],
                    "description": f"Referral bonus - {user.get('name', 'User')} submitted first review",
                    "reference_id": user_id,
                    "status": "completed",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
                
                # Update referral status
                await db.referrals.update_one(
                    {"referrer_id": referred_by, "referred_id": user_id},
                    {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}}
                )
        
        return {
            "message": "Review approved and points awarded",
            "points_awarded": points_earned
        }
    else:
        return {"message": "Review rejected"}

# ============ PENDING ANSWERS ============

@router.get("/pending-answers")
async def get_pending_answers(
    limit: int = 50,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get all pending answers for approval"""
    await verify_admin(credentials, db)
    
    total = await db.user_answers.count_documents({"status": "pending"})
    
    answers = await db.user_answers.find(
        {"status": "pending"},
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "answers": answers,
        "limit": limit,
        "offset": offset
    }

@router.post("/answers/{answer_id}/action")
async def process_answer(
    answer_id: str,
    action: AnswerApprovalAction,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Approve or reject an answer"""
    admin = await verify_admin(credentials, db)
    
    answer = await db.user_answers.find_one({"id": answer_id})
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    
    new_status = "approved" if action.action == "approve" else "rejected"
    
    # Update answer status
    await db.user_answers.update_one(
        {"id": answer_id},
        {
            "$set": {
                "status": new_status,
                "admin_notes": action.admin_notes,
                "processed_by": admin.get("sub"),
                "processed_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    # Also update in questions collection
    await db.questions.update_one(
        {"id": answer.get("question_id"), "answers.id": answer_id},
        {"$set": {"answers.$.status": new_status}}
    )
    
    # Award points if approved
    if action.action == "approve":
        user_id = answer.get("user_id")
        points = POINTS_CONFIG["answer_approved"]
        
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"points": points}}
        )
        
        await db.point_transactions.insert_one({
            "id": f"pt_{uuid4().hex[:12]}",
            "user_id": user_id,
            "type": "answer",
            "points": points,
            "description": "Answer approved",
            "reference_id": answer_id,
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"message": "Answer approved and points awarded", "points_awarded": points}
    else:
        return {"message": "Answer rejected"}

# ============ REDEMPTION MANAGEMENT ============

@router.get("/redemptions")
async def get_redemption_requests(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get redemption requests"""
    await verify_admin(credentials, db)
    
    query = {}
    if status:
        query["status"] = status
    
    total = await db.redemption_requests.count_documents(query)
    
    requests = await db.redemption_requests.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "requests": requests,
        "limit": limit,
        "offset": offset
    }

@router.post("/redemptions/{redemption_id}/process")
async def process_redemption(
    redemption_id: str,
    action: RedemptionProcessAction,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Process a redemption request (complete payment or reject)"""
    admin = await verify_admin(credentials, db)
    
    redemption = await db.redemption_requests.find_one({"id": redemption_id})
    if not redemption:
        raise HTTPException(status_code=404, detail="Redemption request not found")
    
    if redemption.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Redemption is not pending")
    
    if action.action == "complete":
        # Mark as completed
        await db.redemption_requests.update_one(
            {"id": redemption_id},
            {
                "$set": {
                    "status": "completed",
                    "transaction_id": action.transaction_id or f"TXN{uuid4().hex[:10].upper()}",
                    "admin_notes": action.admin_notes,
                    "processed_by": admin.get("sub"),
                    "processed_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Update point transaction status
        await db.point_transactions.update_one(
            {"reference_id": redemption_id, "type": "redemption"},
            {"$set": {"status": "completed"}}
        )
        
        return {
            "message": "Redemption completed successfully",
            "amount": redemption.get("amount"),
            "upi_id": redemption.get("upi_id")
        }
    else:
        # Reject and refund points
        await db.redemption_requests.update_one(
            {"id": redemption_id},
            {
                "$set": {
                    "status": "rejected",
                    "admin_notes": action.admin_notes,
                    "processed_by": admin.get("sub"),
                    "processed_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Refund points
        user_id = redemption.get("user_id")
        points = redemption.get("points", 0)
        
        await db.users.update_one(
            {"id": user_id},
            {"$inc": {"points": points}}
        )
        
        # Update point transaction
        await db.point_transactions.update_one(
            {"reference_id": redemption_id, "type": "redemption"},
            {"$set": {"status": "rejected", "description": "Redemption rejected - points refunded"}}
        )
        
        # Add refund transaction
        await db.point_transactions.insert_one({
            "id": f"pt_{uuid4().hex[:12]}",
            "user_id": user_id,
            "type": "refund",
            "points": points,
            "description": "Refund for rejected redemption",
            "reference_id": redemption_id,
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"message": "Redemption rejected and points refunded", "points_refunded": points}

# ============ ALL REVIEWS MANAGEMENT ============

@router.get("/all-reviews")
async def get_all_reviews(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get all reviews with optional status filter"""
    await verify_admin(credentials, db)
    
    query = {}
    if status:
        query["status"] = status
    
    total = await db.reviews.count_documents(query)
    
    reviews = await db.reviews.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "reviews": reviews,
        "limit": limit,
        "offset": offset
    }

@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Delete a review"""
    await verify_admin(credentials, db)
    
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"message": "Review deleted successfully"}

# ============ POINTS ADJUSTMENT ============

@router.post("/adjust-points")
async def adjust_user_points(
    adjustment: PointsAdjustment,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Manually adjust user points (admin only)"""
    admin = await verify_admin(credentials, db)
    
    user = await db.users.find_one({"id": adjustment.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update points
    await db.users.update_one(
        {"id": adjustment.user_id},
        {"$inc": {"points": adjustment.points}}
    )
    
    # Create transaction
    await db.point_transactions.insert_one({
        "id": f"pt_{uuid4().hex[:12]}",
        "user_id": adjustment.user_id,
        "type": "admin_adjustment",
        "points": adjustment.points,
        "description": adjustment.reason,
        "reference_id": f"admin_{admin.get('sub')}",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "message": "Points adjusted successfully",
        "user_id": adjustment.user_id,
        "points_change": adjustment.points,
        "new_balance": user.get("points", 0) + adjustment.points
    }

# ============ USER POINTS REPORT ============

@router.get("/users-report")
async def get_users_points_report(
    limit: int = 100,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get users with points for reporting, including payment details"""
    await verify_admin(credentials, db)
    
    total = await db.users.count_documents({"points": {"$gt": 0}})
    
    users = await db.users.find(
        {"points": {"$gt": 0}},
        {"_id": 0, "id": 1, "name": 1, "email": 1, "phone": 1, "points": 1, "referral_code": 1, "created_at": 1, "payment_details": 1}
    ).sort("points", -1).skip(offset).limit(limit).to_list(limit)
    
    return {
        "total": total,
        "users": users,
        "limit": limit,
        "offset": offset
    }

@router.get("/user/{user_id}/payment-details")
async def get_user_payment_details(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get user's saved payment details for admin"""
    await verify_admin(credentials, db)
    
    user = await db.users.find_one(
        {"id": user_id},
        {"_id": 0, "id": 1, "name": 1, "email": 1, "phone": 1, "payment_details": 1}
    )
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# ============ PAYMENT HISTORY ============

@router.get("/payment-history")
async def get_payment_history(
    limit: int = 100,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_db)
):
    """Get completed payment history"""
    await verify_admin(credentials, db)
    
    payments = await db.redemption_requests.find(
        {"status": "completed"},
        {"_id": 0}
    ).sort("processed_at", -1).limit(limit).to_list(limit)
    
    total_paid = sum([p.get("amount", 0) for p in payments])
    
    return {
        "total_paid": total_paid,
        "payment_count": len(payments),
        "payments": payments
    }
