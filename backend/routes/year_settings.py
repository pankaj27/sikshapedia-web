"""Year Configuration Settings - Centralized year management for the platform"""
from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import jwt

from core.database import db
from core.config import settings

year_settings_router = APIRouter(prefix="/year-settings", tags=["Year Settings"])

# ============================================
# Helper Functions
# ============================================

async def get_current_admin(request: Request):
    """Get current authenticated admin user"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("role") != "admin":
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

def get_auto_year():
    """Calculate year automatically based on current date
    Logic: If current month >= July, show next year (for upcoming admissions)
    """
    now = datetime.now()
    current_year = now.year
    current_month = now.month
    
    # Academic year logic: July onwards = next year admissions
    if current_month >= 7:  # July onwards
        return current_year + 1
    return current_year

# ============================================
# Models
# ============================================

class YearSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "year-settings"
    
    # Mode: "auto" or "manual"
    mode: str = "auto"
    
    # Manual year (used when mode is "manual")
    manual_year: int = 2025
    
    # Display formats
    format_single: str = "{year}"  # e.g., "2025"
    format_academic: str = "{year}-{next_year_short}"  # e.g., "2025-26"
    format_admission: str = "Admissions {year}"  # e.g., "Admissions 2025"
    
    # Auto-switch settings
    auto_switch_month: int = 7  # July
    
    # Meta
    updated_at: Optional[str] = None
    updated_by: Optional[str] = None

class YearResponse(BaseModel):
    """Response model for public year endpoint"""
    year: int
    year_short: str  # "25"
    next_year: int
    next_year_short: str  # "26"
    academic_year: str  # "2025-26"
    admission_text: str  # "Admissions 2025"
    mode: str  # "auto" or "manual"

# ============================================
# Routes
# ============================================

@year_settings_router.get("")
async def get_current_year():
    """Get current year settings (public endpoint for frontend)"""
    settings_doc = await db.year_settings.find_one({"id": "year-settings"}, {"_id": 0})
    
    if not settings_doc:
        settings_doc = YearSettings().model_dump()
    
    # Calculate the year to use
    if settings_doc.get("mode") == "auto":
        year = get_auto_year()
    else:
        year = settings_doc.get("manual_year", datetime.now().year)
    
    next_year = year + 1
    
    return YearResponse(
        year=year,
        year_short=str(year)[-2:],
        next_year=next_year,
        next_year_short=str(next_year)[-2:],
        academic_year=f"{year}-{str(next_year)[-2:]}",
        admission_text=f"Admissions {year}",
        mode=settings_doc.get("mode", "auto")
    )

@year_settings_router.get("/admin")
async def get_year_settings_admin(request: Request, current_admin: dict = Depends(get_current_admin)):
    """Get year settings for admin panel"""
    settings_doc = await db.year_settings.find_one({"id": "year-settings"}, {"_id": 0})
    
    if not settings_doc:
        settings_doc = YearSettings().model_dump()
    
    # Add computed current year for display
    auto_year = get_auto_year()
    settings_doc["computed_auto_year"] = auto_year
    settings_doc["current_active_year"] = auto_year if settings_doc.get("mode") == "auto" else settings_doc.get("manual_year", auto_year)
    
    return settings_doc

@year_settings_router.put("")
async def update_year_settings(year_settings: YearSettings, request: Request, current_admin: dict = Depends(get_current_admin)):
    """Update year settings"""
    settings_dict = year_settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_admin.get("sub") or current_admin.get("id")
    
    await db.year_settings.update_one(
        {"id": "year-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    
    # Return with computed values
    auto_year = get_auto_year()
    settings_dict["computed_auto_year"] = auto_year
    settings_dict["current_active_year"] = auto_year if settings_dict.get("mode") == "auto" else settings_dict.get("manual_year", auto_year)
    
    return settings_dict

@year_settings_router.post("/preview")
async def preview_year(year: int):
    """Preview how a specific year would be displayed"""
    next_year = year + 1
    return {
        "year": year,
        "formats": {
            "single": str(year),
            "academic": f"{year}-{str(next_year)[-2:]}",
            "admission": f"Admissions {year}",
            "with_next": f"{year}-{next_year}",
            "colleges_title": f"Top Colleges {year}",
            "courses_title": f"Best Courses {year}",
            "exam_title": f"Entrance Exams {year}"
        }
    }
