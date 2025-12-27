"""
Homepage Settings Routes
Manages all homepage configuration and section visibility
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import jwt
import os

# Create router
homepage_settings_router = APIRouter(prefix="/api", tags=["Homepage Settings"])

# Security
security = HTTPBearer()
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def verify_admin_token(token: str):
    """Verify JWT token and check admin role"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current admin user"""
    token = credentials.credentials
    return verify_admin_token(token)

# Database will be injected from main app
db = None

def set_database(database):
    """Set the database instance from main app"""
    global db
    db = database


# ============================================
# Institute Search API (for Hero Slider)
# ============================================

@homepage_settings_router.get("/institutes/search")
async def search_institutes(
    search: str = Query(..., min_length=2),
    type: Optional[str] = Query(None, description="Filter by type: college, school, university, or all"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Search all institutes (colleges, schools, universities) for hero slider selection.
    Returns banner_url, name, type, location, rating, slug automatically.
    """
    results = []
    search_query = {"$regex": search, "$options": "i"}
    
    # Projection for minimal but complete data
    projection = {
        "_id": 0, "id": 1, "name": 1, "slug": 1, 
        "banner_url": 1, "logo_url": 1,
        "institution_type": 1, "type": 1,
        "location": 1, "city": 1, "state": 1,
        "rating": 1, "reviews_count": 1
    }
    
    # Search colleges (if type is college, all, or not specified)
    if not type or type in ["college", "all"]:
        colleges = await db.colleges.find(
            {"name": search_query, "institution_type": {"$in": ["College", "college", None]}},
            projection
        ).limit(limit).to_list(limit)
        
        for c in colleges:
            location = c.get('location', {})
            city = location.get('city', c.get('city', '')) if isinstance(location, dict) else c.get('city', '')
            state = location.get('state', c.get('state', '')) if isinstance(location, dict) else c.get('state', '')
            
            results.append({
                "id": c.get("id"),
                "name": c.get("name"),
                "slug": c.get("slug", ""),
                "type": "college",
                "institution_type": c.get("institution_type", "College"),
                "banner_url": c.get("banner_url", ""),
                "logo_url": c.get("logo_url", ""),
                "location": f"{city}, {state}".strip(", ") if city or state else "",
                "city": city,
                "state": state,
                "rating": c.get("rating", 0),
                "reviews_count": c.get("reviews_count", 0)
            })
    
    # Search schools
    if not type or type in ["school", "all"]:
        schools = await db.colleges.find(
            {"name": search_query, "institution_type": {"$in": ["School", "school"]}},
            projection
        ).limit(limit).to_list(limit)
        
        for s in schools:
            location = s.get('location', {})
            city = location.get('city', s.get('city', '')) if isinstance(location, dict) else s.get('city', '')
            state = location.get('state', s.get('state', '')) if isinstance(location, dict) else s.get('state', '')
            
            results.append({
                "id": s.get("id"),
                "name": s.get("name"),
                "slug": s.get("slug", ""),
                "type": "school",
                "institution_type": "School",
                "banner_url": s.get("banner_url", ""),
                "logo_url": s.get("logo_url", ""),
                "location": f"{city}, {state}".strip(", ") if city or state else "",
                "city": city,
                "state": state,
                "rating": s.get("rating", 0),
                "reviews_count": s.get("reviews_count", 0)
            })
    
    # Search universities
    if not type or type in ["university", "all"]:
        universities = await db.colleges.find(
            {"name": search_query, "institution_type": {"$in": ["University", "university"]}},
            projection
        ).limit(limit).to_list(limit)
        
        for u in universities:
            location = u.get('location', {})
            city = location.get('city', u.get('city', '')) if isinstance(location, dict) else u.get('city', '')
            state = location.get('state', u.get('state', '')) if isinstance(location, dict) else u.get('state', '')
            
            results.append({
                "id": u.get("id"),
                "name": u.get("name"),
                "slug": u.get("slug", ""),
                "type": "university",
                "institution_type": "University",
                "banner_url": u.get("banner_url", ""),
                "logo_url": u.get("logo_url", ""),
                "location": f"{city}, {state}".strip(", ") if city or state else "",
                "city": city,
                "state": state,
                "rating": u.get("rating", 0),
                "reviews_count": u.get("reviews_count", 0)
            })
    
    # Sort by name and limit
    results.sort(key=lambda x: x.get("name", ""))
    return results[:limit]


@homepage_settings_router.get("/institutes/{institute_id}")
async def get_institute_details(institute_id: str):
    """Get full details of an institute by ID for hero slider"""
    institute = await db.colleges.find_one({"id": institute_id}, {"_id": 0})
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")
    
    location = institute.get('location', {})
    city = location.get('city', institute.get('city', '')) if isinstance(location, dict) else institute.get('city', '')
    state = location.get('state', institute.get('state', '')) if isinstance(location, dict) else institute.get('state', '')
    
    inst_type = institute.get("institution_type", "College")
    type_lower = "school" if inst_type in ["School", "school"] else "university" if inst_type in ["University", "university"] else "college"
    
    return {
        "id": institute.get("id"),
        "name": institute.get("name"),
        "slug": institute.get("slug", ""),
        "type": type_lower,
        "institution_type": inst_type,
        "banner_url": institute.get("banner_url", ""),
        "logo_url": institute.get("logo_url", ""),
        "location": f"{city}, {state}".strip(", ") if city or state else "",
        "city": city,
        "state": state,
        "rating": institute.get("rating", 0),
        "reviews_count": institute.get("reviews_count", 0)
    }

# ============================================
# Pydantic Model
# ============================================

class HomepageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "homepage-settings"
    
    # Hero Section
    hero_title: str = "Find Your Dream"
    hero_rotating_texts: List[str] = ["Exams", "Colleges", "Courses", "Schools", "Universities", "Scholarships"]
    hero_subtitle: str = "Explore 10,000+ Colleges, Universities & Schools across India"
    hero_bg_gradient: str = "from-purple-900 via-indigo-900 to-blue-900"
    
    # Hero Slides (Banner Carousel) - Enhanced with institute search
    hero_slides: List[Dict[str, Any]] = [
        {
            "institute_id": "",           # Link to actual institute (for auto-fill)
            "image": "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=400&fit=crop", 
            "type": "college", 
            "name": "IIT Bombay", 
            "rating": 4.8, 
            "reviews": 2847, 
            "location": "Mumbai, Maharashtra", 
            "slug": "iit-bombay-002",
            "priority": 1,                # Display order (lower = first)
            "start_date": "",             # Optional: scheduling start (YYYY-MM-DD)
            "end_date": "",               # Optional: scheduling end (YYYY-MM-DD)
            "is_active": True             # Enable/disable slide
        },
        {
            "institute_id": "",
            "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=400&fit=crop", 
            "type": "school", 
            "name": "Delhi Public School", 
            "rating": 4.6, 
            "reviews": 1523, 
            "location": "New Delhi, Delhi", 
            "slug": "dps-rk-puram-001",
            "priority": 2,
            "start_date": "",
            "end_date": "",
            "is_active": True
        },
        {
            "institute_id": "",
            "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=400&fit=crop", 
            "type": "university", 
            "name": "Delhi University", 
            "rating": 4.5, 
            "reviews": 3256, 
            "location": "New Delhi, Delhi", 
            "slug": "delhi-university-001",
            "priority": 3,
            "start_date": "",
            "end_date": "",
            "is_active": True
        }
    ]
    
    # Quick Actions Section
    quick_actions: List[Dict[str, Any]] = [
        {"id": "apply", "title": "Apply Now", "subtitle": "Quick admission", "icon": "FiSend", "gradient": "from-orange-500 to-orange-600"},
        {"id": "question", "title": "Ask Question", "subtitle": "Get expert help", "icon": "FiMessageCircle", "gradient": "from-blue-500 to-blue-600"},
        {"id": "counselling", "title": "Counselling", "subtitle": "Free guidance", "icon": "FiPhone", "gradient": "from-purple-500 to-purple-600"}
    ]
    
    # Study Goals Section
    study_goals_title: str = "What do you want to study?"
    study_goals: List[Dict[str, Any]] = [
        {"name": "Engineering", "icon": "FiTool", "courses": "B.Tech, M.Tech", "count": "5000+", "color": "text-blue-600"},
        {"name": "Management", "icon": "FiBriefcase", "courses": "MBA, PGDM", "count": "3000+", "color": "text-purple-600"},
        {"name": "Medical", "icon": "FiActivity", "courses": "MBBS, BDS", "count": "2000+", "color": "text-red-600"},
        {"name": "Commerce", "icon": "FiTrendingUp", "courses": "B.Com, M.Com", "count": "2500+", "color": "text-green-600"},
        {"name": "Arts", "icon": "FiFeather", "courses": "BA, MA", "count": "1800+", "color": "text-pink-600"},
        {"name": "Science", "icon": "FiCpu", "courses": "B.Sc, M.Sc", "count": "2200+", "color": "text-indigo-600"},
        {"name": "Law", "icon": "FiShield", "courses": "LLB, LLM", "count": "1000+", "color": "text-yellow-600"},
        {"name": "Design", "icon": "FiLayout", "courses": "B.Des, M.Des", "count": "800+", "color": "text-orange-600"}
    ]
    
    # Quick Links/Programs Section
    programs_title: str = "Explore Programs"
    programs: List[Dict[str, Any]] = [
        {"title": "College Ranking", "subtitle": "Find Top Colleges", "icon": "FiAward", "color": "bg-orange-100", "iconColor": "text-orange-600", "link": "/colleges"},
        {"title": "Exams", "subtitle": "JEE, NEET, CAT", "icon": "FiFileText", "color": "bg-blue-100", "iconColor": "text-blue-600", "link": "/exams"},
        {"title": "Compare Colleges", "subtitle": "Side by Side", "icon": "FiBarChart2", "color": "bg-green-100", "iconColor": "text-green-600", "link": "/compare"},
        {"title": "Course Finder", "subtitle": "Find Best Courses", "icon": "FiCompass", "color": "bg-purple-100", "iconColor": "text-purple-600", "link": "/course-finder"}
    ]
    
    # Cities Section
    cities_title: str = "Top Study Destinations"
    cities: List[Dict[str, Any]] = [
        {"name": "Delhi", "image": "/assets/cities/New Delhi.svg"},
        {"name": "Mumbai", "image": "/assets/cities/Mumbai.svg"},
        {"name": "Bangalore", "image": "/assets/cities/Bangalore.svg"},
        {"name": "Hyderabad", "image": "/assets/cities/Hyderabad.svg"},
        {"name": "Chennai", "image": "/assets/cities/Chennai.svg"},
        {"name": "Pune", "image": "/assets/cities/Pune.svg"},
        {"name": "Kolkata", "image": "/assets/cities/Kolkata.svg"},
        {"name": "Bhopal", "image": "/assets/cities/Bhopal.svg"}
    ]
    
    # Ranking Agencies
    ranking_agencies: List[str] = ["India Today", "NIRF", "The Week", "Outlook"]
    
    # Quick Links Section
    quick_links_title: str = "Quick Links"
    quick_links: List[Dict[str, Any]] = [
        {"name": "Top Colleges", "icon": "FiBookOpen", "link": "/india-colleges", "bg_color": "bg-blue-100", "icon_color": "text-blue-600"},
        {"name": "Top Schools", "icon": "FiBook", "link": "/india-schools", "bg_color": "bg-red-100", "icon_color": "text-red-600"},
        {"name": "Top Exams", "icon": "FiFileText", "link": "/exams", "bg_color": "bg-green-100", "icon_color": "text-green-600"},
        {"name": "Top Courses", "icon": "FiBookOpen", "link": "/courses", "bg_color": "bg-purple-100", "icon_color": "text-purple-600"},
        {"name": "Education Loans", "icon": "FiTrendingUp", "link": "/loans", "bg_color": "bg-pink-100", "icon_color": "text-pink-600"},
        {"name": "Study Materials", "icon": "FiZap", "link": "/study-materials", "bg_color": "bg-indigo-100", "icon_color": "text-indigo-600"}
    ]
    
    # Top Universities Section
    top_universities_title: str = "Top Universities & Colleges"
    featured_colleges_ids: List[str] = []
    
    # Top Schools Section
    top_schools_title: str = "Top Schools in India"
    featured_schools_ids: List[str] = []
    
    # Top Exams Section
    featured_exams_ids: List[str] = []
    
    # Latest News Section
    featured_news_ids: List[str] = []
    
    # Top Colleges by Stream Section
    stream_colleges: Dict[str, List[str]] = {
        "Engineering": [],
        "Medical": [],
        "Management": [],
        "Law": []
    }
    
    top_schools: List[Dict[str, Any]] = [
        {"name": "Delhi Public School (DPS)", "location": "Multiple Locations", "board": "CBSE", "rating": 4.8, "fees": "2.5L", "type": "Day School", "rank": 1},
        {"name": "Sanskriti School", "location": "New Delhi", "board": "CBSE", "rating": 4.7, "fees": "3.2L", "type": "Day School", "rank": 5},
        {"name": "The Doon School", "location": "Dehradun", "board": "ICSE", "rating": 4.9, "fees": "8L", "type": "Boarding", "rank": 2},
        {"name": "Mayo College", "location": "Ajmer", "board": "CBSE", "rating": 4.8, "fees": "7.5L", "type": "Boarding", "rank": 3}
    ]
    
    # College Rankings Section
    college_rankings_title: str = "College Rankings"
    college_rankings_years: List[str] = ["2024", "2023", "2022"]
    college_rankings_data: List[Dict[str, Any]] = [
        {"rank": 1, "name": "IIT Bombay", "location": "Mumbai", "rating": 4.9, "fees": "2.5L", "type": "Engineering"},
        {"rank": 2, "name": "IIT Delhi", "location": "New Delhi", "rating": 4.8, "fees": "2.5L", "type": "Engineering"},
        {"rank": 3, "name": "IIT Madras", "location": "Chennai", "rating": 4.8, "fees": "2.5L", "type": "Engineering"},
        {"rank": 4, "name": "IIT Kanpur", "location": "Kanpur", "rating": 4.7, "fees": "2.5L", "type": "Engineering"},
        {"rank": 5, "name": "IIT Kharagpur", "location": "Kharagpur", "rating": 4.7, "fees": "2.5L", "type": "Engineering"}
    ]
    
    # Newsletter Section
    newsletter_title: str = "Subscribe to Our Newsletter"
    newsletter_subtitle: str = "Get the latest updates on college admissions, exams, and education news"
    newsletter_button_text: str = "Subscribe"
    
    # Section Visibility
    show_hero_slider: bool = True
    show_quick_links: bool = True
    show_quick_actions: bool = True
    show_study_goals: bool = True
    show_programs: bool = True
    show_top_universities: bool = True
    show_top_schools: bool = True
    show_college_rankings: bool = True
    show_cities: bool = True
    show_newsletter: bool = True
    show_sponsored_colleges: bool = True
    show_top_colleges_by_stream: bool = True
    show_top_exams: bool = True
    show_location_search: bool = True
    show_latest_news: bool = True
    
    # CTA Section
    cta_enabled: bool = True
    cta_title: str = "Start Your Journey Today"
    cta_subtitle: str = "Join millions of students who found their dream college through Admissionbuddy"
    cta_button_text: str = "Explore Colleges"
    cta_button_link: str = "/india-colleges"
    
    # SEO
    auto_generate_seo: bool = True
    meta_title: str = "Admissionbuddy - Top Colleges, Universities & Institutes in India | Admission 2025"
    meta_description: str = "Find detailed information about 10,000+ colleges, universities, courses, exams in India."
    meta_keywords: List[str] = ["colleges in india", "top universities", "engineering colleges"]
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    
    updated_at: Optional[datetime] = None


# ============================================
# API Endpoints
# ============================================

@homepage_settings_router.get("/homepage-settings")
async def get_homepage_settings():
    """Get homepage settings"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    if not settings:
        return HomepageSettings().model_dump()
    return settings

@homepage_settings_router.put("/homepage-settings")
async def update_homepage_settings(settings: HomepageSettings):
    """Update homepage settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.homepage_settings.update_one(
        {"id": "homepage-settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
