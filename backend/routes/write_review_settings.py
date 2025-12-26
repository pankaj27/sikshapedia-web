"""Write Review Page Settings - Admin controllable content"""
from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import jwt
import os

from core.database import db
from core.config import settings

write_review_settings_router = APIRouter(prefix="/write-review-settings", tags=["Write Review Settings"])

# Helper function for admin authentication
async def get_current_admin(request: Request):
    """Get current authenticated admin user"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Check if admin role
        if payload.get("role") != "admin":
            # Also check if it's a user token - look up the user
            user_id = payload.get("sub")
            user = await db.users.find_one({"id": user_id}, {"_id": 0})
            if user and user.get("role") == "admin":
                return user
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================
# Models
# ============================================

class BenefitCard(BaseModel):
    title: str
    description: str
    icon: str = "award"  # award, check, star

class NextStep(BaseModel):
    step_number: int
    text: str

class PointsConfig(BaseModel):
    base_points: int = 50
    detailed_review_bonus: int = 50  # For reviews with 200+ chars
    verified_student_bonus: int = 50
    photos_bonus: int = 30
    min_review_characters: int = 50  # Minimum chars required (50), bonus at 200

class HeaderSettings(BaseModel):
    title: str = "Write a Review & Earn ₹300*"
    subtitle: str = "Share your experience and help thousands of students"
    badge_texts: List[str] = ["Verified Reviews", "Earn Rewards", "Help Students"]

class SuccessPageSettings(BaseModel):
    title: str = "Review Submitted Successfully!"
    message: str = "Thank you for sharing your experience. Your review is being verified and will be published shortly."
    points_label: str = "Points Earned!"
    reward_note: str = "≈ ₹{amount} reward value"
    next_steps_title: str = "What Happens Next?"
    next_steps: List[NextStep] = [
        {"step_number": 1, "text": "Our team will verify your review within 48 hours"},
        {"step_number": 2, "text": "You'll receive a verification email once approved"},
        {"step_number": 3, "text": "Points will be added to your account after approval"},
        {"step_number": 4, "text": "Redeem points for cash via UPI once you have 200+ points"}
    ]
    button_write_another: str = "Write Another Review"
    button_view_reviews: str = "View My Reviews"

class BenefitsSection(BaseModel):
    title: str = "Why Write a Review?"
    cards: List[BenefitCard] = [
        {"title": "Earn Rewards", "description": "Get up to ₹300 for every verified review", "icon": "award"},
        {"title": "Help Students", "description": "Guide future students in making informed decisions", "icon": "check"},
        {"title": "Shape Education", "description": "Your feedback helps colleges improve", "icon": "star"}
    ]

class WriteReviewSettings(BaseModel):
    model_config = ConfigDict(extra="allow")  # Allow extra fields to pass through
    id: str = "write-review-settings"
    
    # Header Section
    header: HeaderSettings = HeaderSettings()
    
    # Points Configuration
    points_config: PointsConfig = PointsConfig()
    
    # Success Page
    success_page: SuccessPageSettings = SuccessPageSettings()
    
    # Benefits Section
    benefits_section: BenefitsSection = BenefitsSection()
    
    # Meta
    is_active: bool = True
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

# ============================================
# Routes
# ============================================

@write_review_settings_router.get("")
async def get_write_review_settings():
    """Get write review page settings (public endpoint for frontend)"""
    settings = await db.write_review_settings.find_one({"id": "write-review-settings"}, {"_id": 0})
    if not settings:
        # Return defaults
        return WriteReviewSettings().model_dump()
    
    # Ensure min_review_characters defaults to 50 (fix for live site having 200)
    if settings.get("points_config"):
        if settings["points_config"].get("min_review_characters") is None or settings["points_config"].get("min_review_characters") == 200:
            settings["points_config"]["min_review_characters"] = 50
    else:
        settings["points_config"] = PointsConfig().model_dump()
    
    return settings

@write_review_settings_router.get("/admin")
async def get_write_review_settings_admin(request: Request, current_admin: dict = Depends(get_current_admin)):
    """Get write review page settings (admin endpoint)"""
    page_settings = await db.write_review_settings.find_one({"id": "write-review-settings"}, {"_id": 0})
    if not page_settings:
        return WriteReviewSettings().model_dump()
    return page_settings

@write_review_settings_router.put("")
async def update_write_review_settings(page_settings: WriteReviewSettings, request: Request, current_admin: dict = Depends(get_current_admin)):
    """Update write review page settings"""
    settings_dict = page_settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_admin.get("sub") or current_admin.get("id")
    
    await db.write_review_settings.update_one(
        {"id": "write-review-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict

@write_review_settings_router.post("/reset")
async def reset_write_review_settings(request: Request, current_admin: dict = Depends(get_current_admin)):
    """Reset write review settings to defaults"""
    default_settings = WriteReviewSettings()
    settings_dict = default_settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_admin.get("sub") or current_admin.get("id")
    
    await db.write_review_settings.update_one(
        {"id": "write-review-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
