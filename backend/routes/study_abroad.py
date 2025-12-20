"""Study Abroad Universities API"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Study Abroad"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Models
class StudyAbroadUniversity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    city: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    ranking: Optional[int] = None
    established_year: Optional[int] = None
    website: Optional[str] = None
    programs: List[str] = []
    tuition_range: Optional[str] = None
    acceptance_rate: Optional[float] = None
    student_population: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StudyAbroadListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "study-abroad-listing-page"
    
    # Hero Section
    hero_title: str = "Study Abroad"
    hero_subtitle: str = "Explore top universities around the world and find your perfect study destination"
    hero_bg_gradient: str = "from-indigo-600 to-purple-700"
    hero_image: Optional[str] = None
    
    # Stats
    stats: List[Dict[str, Any]] = [
        {"label": "Partner Universities", "value": "500+", "icon": "university"},
        {"label": "Countries", "value": "50+", "icon": "globe"},
        {"label": "Students Placed", "value": "10K+", "icon": "students"},
        {"label": "Scholarship Value", "value": "$50M+", "icon": "money"}
    ]
    
    # Featured Countries
    featured_countries: List[Dict[str, Any]] = [
        {"name": "USA", "flag": "us", "universities": 100, "description": "World-class education system"},
        {"name": "UK", "flag": "gb", "universities": 80, "description": "Rich academic heritage"},
        {"name": "Canada", "flag": "ca", "universities": 60, "description": "Multicultural environment"},
        {"name": "Australia", "flag": "au", "universities": 50, "description": "Quality lifestyle"}
    ]
    
    # Filter Options
    show_country_filter: bool = True
    show_ranking_filter: bool = True
    show_tuition_filter: bool = True
    show_program_filter: bool = True
    
    # Program Types
    program_types: List[Dict[str, Any]] = [
        {"id": "undergraduate", "name": "Undergraduate", "icon": "book"},
        {"id": "postgraduate", "name": "Postgraduate", "icon": "graduation"},
        {"id": "phd", "name": "PhD/Research", "icon": "research"},
        {"id": "mba", "name": "MBA", "icon": "briefcase"}
    ]
    
    # CTA Section
    cta_title: str = "Need Help Choosing the Right University?"
    cta_subtitle: str = "Our expert counselors can help you find the perfect study abroad destination"
    cta_button_text: str = "Get Free Counseling"
    cta_button_link: str = "/counseling"
    
    # Why Study Abroad Section
    why_study_abroad: List[Dict[str, Any]] = [
        {"title": "Global Recognition", "description": "Degrees recognized worldwide", "icon": "globe"},
        {"title": "Career Opportunities", "description": "Better job prospects globally", "icon": "briefcase"},
        {"title": "Cultural Exposure", "description": "Experience diverse cultures", "icon": "culture"},
        {"title": "Personal Growth", "description": "Develop independence and skills", "icon": "rocket"}
    ]
    
    # SEO
    auto_generate_seo: bool = True
    meta_title: str = "Study Abroad 2025 - Top Universities Worldwide | Admissionbuddy"
    meta_description: str = "Explore 500+ top universities in USA, UK, Canada, Australia. Get expert guidance for your study abroad journey. Apply now!"
    meta_keywords: List[str] = ["study abroad", "international universities", "USA universities", "UK universities", "study in Canada"]
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    twitter_card: str = "summary_large_image"
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    schema_type: str = "WebPage"
    robots: str = "index, follow"
    
    # FAQs
    faqs: List[Dict[str, Any]] = []
    
    updated_at: Optional[datetime] = None


# ============================================
# Study Abroad University Endpoints
# ============================================

@router.get("/study-abroad", response_model=List[StudyAbroadUniversity])
async def get_study_abroad_universities(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    country: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all study abroad universities with optional filters"""
    query = {}
    
    if country:
        query["country"] = country
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    universities = await db.study_abroad.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for uni in universities:
        if isinstance(uni.get('created_at'), str):
            uni['created_at'] = datetime.fromisoformat(uni['created_at'])
    
    return universities


@router.get("/study-abroad/countries/list")
async def get_countries():
    """Get list of all countries with study abroad universities"""
    countries = await db.study_abroad.distinct("country")
    return {"countries": sorted(countries)}


@router.get("/study-abroad/{university_id}", response_model=StudyAbroadUniversity)
async def get_study_abroad_university(university_id: str):
    """Get a specific study abroad university by ID"""
    university = await db.study_abroad.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    if isinstance(university.get('created_at'), str):
        university['created_at'] = datetime.fromisoformat(university['created_at'])
    
    return StudyAbroadUniversity(**university)


@router.post("/study-abroad")
async def create_study_abroad_university(university: StudyAbroadUniversity):
    """Create a new study abroad university (admin only)"""
    uni_dict = university.model_dump()
    if isinstance(uni_dict.get('created_at'), datetime):
        uni_dict['created_at'] = uni_dict['created_at'].isoformat()
    await db.study_abroad.insert_one(uni_dict)
    uni_dict.pop('_id', None)
    return uni_dict


@router.put("/study-abroad/{university_id}")
async def update_study_abroad_university(university_id: str, university: StudyAbroadUniversity):
    """Update a study abroad university (admin only)"""
    uni_dict = university.model_dump()
    if isinstance(uni_dict.get('created_at'), datetime):
        uni_dict['created_at'] = uni_dict['created_at'].isoformat()
    await db.study_abroad.update_one({"id": university_id}, {"$set": uni_dict})
    uni_dict.pop('_id', None)
    return uni_dict


@router.delete("/study-abroad/{university_id}")
async def delete_study_abroad_university(university_id: str):
    """Delete a study abroad university (admin only)"""
    await db.study_abroad.delete_one({"id": university_id})
    return {"success": True}


# ============================================
# Study Abroad Listing Page Settings
# ============================================

@router.get("/study-abroad-listing-settings")
async def get_study_abroad_listing_settings():
    """Get study abroad listing page settings"""
    settings = await db.study_abroad_listing_settings.find_one({"id": "study-abroad-listing-page"}, {"_id": 0})
    if not settings:
        return StudyAbroadListingPageSettings().model_dump()
    return settings


@router.put("/study-abroad-listing-settings")
async def update_study_abroad_listing_settings(settings: StudyAbroadListingPageSettings):
    """Update study abroad listing page settings (admin only)"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.study_abroad_listing_settings.update_one(
        {"id": "study-abroad-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
