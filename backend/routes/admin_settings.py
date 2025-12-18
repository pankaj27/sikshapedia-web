"""Admin settings routes for listing pages"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone

from core.database import db
from core.auth import get_current_user

admin_settings_router = APIRouter(prefix="/admin-settings", tags=["Admin Settings"])

# ============================================
# Course Listing Settings
# ============================================

class CourseListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "course-listing-page"
    hero_title: str = "Explore Courses"
    hero_subtitle: str = "Find the perfect course for your career"
    stats: List[dict] = []
    categories: List[dict] = []
    show_popular: bool = True
    popular_title: str = "Popular Courses"
    show_trending: bool = True
    trending_title: str = "Trending Courses"
    meta_title: str = "Courses | Find Your Perfect Course"
    meta_description: str = "Explore courses across various streams."
    meta_keywords: List[str] = []
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[dict] = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

@admin_settings_router.get("/course-listing")
async def get_course_listing_settings():
    """Get course listing page settings"""
    settings = await db.course_listing_settings.find_one({"id": "course-listing-page"}, {"_id": 0})
    if not settings:
        return CourseListingPageSettings().model_dump()
    return settings

@admin_settings_router.put("/course-listing")
async def update_course_listing_settings(settings: CourseListingPageSettings, current_user: dict = Depends(get_current_user)):
    """Update course listing page settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.course_listing_settings.update_one(
        {"id": "course-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict

# ============================================
# Exam Listing Settings
# ============================================

class ExamListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "exam-listing-page"
    hero_title: str = "Entrance Exams"
    hero_subtitle: str = "Find information about all major entrance exams"
    stats: List[dict] = []
    categories: List[dict] = []
    show_upcoming: bool = True
    upcoming_title: str = "Upcoming Exams"
    meta_title: str = "Entrance Exams | Exam Information"
    meta_description: str = "Find information about entrance exams."
    meta_keywords: List[str] = []
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[dict] = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

@admin_settings_router.get("/exam-listing")
async def get_exam_listing_settings():
    """Get exam listing page settings"""
    settings = await db.exam_listing_settings.find_one({"id": "exam-listing-page"}, {"_id": 0})
    if not settings:
        return ExamListingPageSettings().model_dump()
    return settings

@admin_settings_router.put("/exam-listing")
async def update_exam_listing_settings(settings: ExamListingPageSettings, current_user: dict = Depends(get_current_user)):
    """Update exam listing page settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.exam_listing_settings.update_one(
        {"id": "exam-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict

# ============================================
# Admin Authors Route
# ============================================

@admin_settings_router.get("/authors")
async def get_authors():
    """Get list of team members who can be authors"""
    team_members = await db.team_members.find(
        {"status": "active"},
        {"_id": 0, "id": 1, "name": 1, "designation": 1, "image": 1, "email": 1}
    ).to_list(100)
    return team_members
