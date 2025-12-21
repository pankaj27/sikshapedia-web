"""Write Review Page Settings - Admin controllable content"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone

from core.database import db
from core.auth import get_current_user

write_review_settings_router = APIRouter(prefix="/write-review-settings", tags=["Write Review Settings"])

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
    min_review_characters: int = 200

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
    model_config = ConfigDict(extra="ignore")
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
    return settings

@write_review_settings_router.get("/admin")
async def get_write_review_settings_admin(current_user: dict = Depends(get_current_user)):
    """Get write review page settings (admin endpoint)"""
    settings = await db.write_review_settings.find_one({"id": "write-review-settings"}, {"_id": 0})
    if not settings:
        return WriteReviewSettings().model_dump()
    return settings

@write_review_settings_router.put("")
async def update_write_review_settings(settings: WriteReviewSettings, current_user: dict = Depends(get_current_user)):
    """Update write review page settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.write_review_settings.update_one(
        {"id": "write-review-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict

@write_review_settings_router.post("/reset")
async def reset_write_review_settings(current_user: dict = Depends(get_current_user)):
    """Reset write review settings to defaults"""
    default_settings = WriteReviewSettings()
    settings_dict = default_settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.write_review_settings.update_one(
        {"id": "write-review-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
