"""
Sponsored Ads Routes
Manages sponsored content placements and advertising
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime, timezone
import uuid
import os
import jwt

# Create router
sponsored_ads_router = APIRouter(prefix="/api", tags=["Sponsored Ads"])
security = HTTPBearer(auto_error=False)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

# Database will be injected from main app
db = None

def set_database(database):
    """Set the database instance from main app"""
    global db
    db = database

# ============================================
# Pydantic Models
# ============================================

class SponsoredCollegeEntry(BaseModel):
    college_id: str
    serial_order: int = 1
    start_date: str
    end_date: str
    is_active: bool = True

class SponsoredAdsConfig(BaseModel):
    id: str = "sponsored_ads_config"
    featured_colleges: List[SponsoredCollegeEntry] = []
    admission_open_colleges: List[SponsoredCollegeEntry] = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class SponsoredAdItem(BaseModel):
    item_id: str
    item_name: str
    item_image: Optional[str] = None
    item_location: Optional[str] = None
    item_type: Optional[str] = None
    item_rating: Optional[float] = None
    item_fees: Optional[float] = None
    content_type: str = "college"
    serial_order: int = 1
    start_date: str
    end_date: str
    is_active: bool = True

class MultiSponsoredAdsConfig(BaseModel):
    id: str = "multi_sponsored_ads_config"
    placements: dict = {}
    custom_placements: list = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class AdBudget(BaseModel):
    total_budget: float = 0
    daily_budget: float = 0
    cost_per_click: float = 0
    cost_per_impression: float = 0
    spent_total: float = 0
    spent_today: float = 0
    last_reset_date: str = ""

class AdStats(BaseModel):
    impressions: int = 0
    clicks: int = 0
    unique_impressions: int = 0
    unique_clicks: int = 0
    ctr: float = 0
    last_impression: Optional[str] = None
    last_click: Optional[str] = None
    impressions_by_date: dict = {}
    clicks_by_date: dict = {}
    impressions_by_url: dict = {}
    clicks_by_url: dict = {}

class AdRotationSettings(BaseModel):
    enabled: bool = False
    max_impressions: int = 0
    max_clicks: int = 0
    rotation_type: str = "sequential"
    weight: int = 1

class Advertisement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    ad_type: str = "banner"
    image_url: Optional[str] = None
    image_alt: Optional[str] = None
    banner_size: str = "728x90"
    headline: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_thumbnail: Optional[str] = None
    video_duration: Optional[int] = None
    html_content: Optional[str] = None
    college_id: Optional[str] = None
    click_url: str = ""
    click_url_target: str = "_blank"
    target_urls: List[str] = []
    target_url_pattern: str = ""
    section_type: str = "banner"
    placement_position: str = "top"
    start_date: Union[str, datetime] = ""
    end_date: Union[str, datetime] = ""
    start_time: str = "00:00"
    end_time: str = "23:59"
    days_of_week: List[int] = [0, 1, 2, 3, 4, 5, 6]
    budget: AdBudget = Field(default_factory=AdBudget)
    stats: AdStats = Field(default_factory=AdStats)
    rotation: AdRotationSettings = Field(default_factory=AdRotationSettings)
    is_active: bool = True
    is_paused: bool = False
    is_budget_exhausted: bool = False
    status: str = "active"
    priority: int = 1
    serial_order: int = 1
    advertiser_id: Optional[str] = None
    advertiser_name: Optional[str] = None
    campaign_id: Optional[str] = None
    campaign_name: Optional[str] = None
    tags: List[str] = []
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None


# Helper to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============================================
# API Endpoints
# ============================================

@sponsored_ads_router.get("/sponsored-ads")
async def get_sponsored_ads():
    """Get the sponsored ads configuration"""
    config = await db.sponsored_ads.find_one({"id": "sponsored_ads_config"}, {"_id": 0})
    if not config:
        return {"featured_colleges": [], "admission_open_colleges": []}
    return config

@sponsored_ads_router.post("/sponsored-ads")
async def save_sponsored_ads(config: SponsoredAdsConfig, current_user: dict = Depends(get_current_user)):
    """Save the sponsored ads configuration (admin only)"""
    config.id = "sponsored_ads_config"
    config.updated_at = datetime.now(timezone.utc)
    config.updated_by = current_user.get("email", "admin")
    
    await db.sponsored_ads.update_one(
        {"id": "sponsored_ads_config"},
        {"$set": config.dict()},
        upsert=True
    )
    return {"success": True, "message": "Sponsored ads saved successfully"}

@sponsored_ads_router.get("/sponsored-ads/featured-active")
async def get_active_featured_colleges(limit: int = Query(6, ge=1, le=20)):
    """Get currently active featured colleges for display on frontend"""
    config = await db.sponsored_ads.find_one({"id": "sponsored_ads_config"}, {"_id": 0})
    if not config:
        return []
    
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    active_colleges = []
    
    for entry in config.get("featured_colleges", []):
        if entry.get("is_active") and entry.get("start_date") <= now <= entry.get("end_date"):
            college = await db.colleges.find_one({"id": entry["college_id"]}, {"_id": 0})
            if college:
                college['_sponsored_order'] = entry.get("serial_order", 999)
                active_colleges.append(college)
    
    active_colleges.sort(key=lambda x: x.get('_sponsored_order', 999))
    
    for c in active_colleges:
        c.pop('_sponsored_order', None)
    
    return active_colleges[:limit]

@sponsored_ads_router.get("/sponsored-ads/admission-open-active")
async def get_active_admission_open_colleges(limit: int = Query(6, ge=1, le=20)):
    """Get currently active admission open colleges for display on frontend"""
    config = await db.sponsored_ads.find_one({"id": "sponsored_ads_config"}, {"_id": 0})
    if not config:
        return []
    
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    active_colleges = []
    
    for entry in config.get("admission_open_colleges", []):
        if entry.get("is_active") and entry.get("start_date") <= now <= entry.get("end_date"):
            college = await db.colleges.find_one({"id": entry["college_id"]}, {"_id": 0})
            if college:
                college['_sponsored_order'] = entry.get("serial_order", 999)
                active_colleges.append(college)
    
    active_colleges.sort(key=lambda x: x.get('_sponsored_order', 999))
    
    for c in active_colleges:
        c.pop('_sponsored_order', None)
    
    return active_colleges[:limit]

@sponsored_ads_router.get("/sponsored-ads-multi")
async def get_multi_sponsored_ads():
    """Get the multi-placement sponsored ads configuration"""
    config = await db.sponsored_ads_multi.find_one({"id": "multi_sponsored_ads_config"}, {"_id": 0})
    if not config:
        return {"placements": {}, "custom_placements": []}
    return config

@sponsored_ads_router.get("/sponsored-ads-by-url")
async def get_sponsored_ads_by_url(url: str = Query(...), section_type: str = Query("featured")):
    """Get sponsored ads for a specific URL path with fallback to general placement"""
    config = await db.sponsored_ads_multi.find_one({"id": "multi_sponsored_ads_config"}, {"_id": 0})
    if not config:
        return []
    
    # Normalize URL - remove leading/trailing slashes and replace remaining slashes
    normalized_url = url.strip('/').replace('/', '_')
    custom_placement_id = f"custom_{normalized_url}_{section_type}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Also check for legacy format with double underscore (from leading slash)
    legacy_placement_id = f"custom__{normalized_url}_{section_type}"
    
    # Check both formats
    placement_to_use = None
    if custom_placement_id in config.get("placements", {}):
        placement_to_use = custom_placement_id
    elif legacy_placement_id in config.get("placements", {}):
        placement_to_use = legacy_placement_id
    
    if placement_to_use:
        active_items = []
        for entry in config["placements"].get(custom_placement_id, []):
            if entry.get("is_active") and entry.get("start_date", "") <= now <= entry.get("end_date", ""):
                item = await db.colleges.find_one({"id": entry.get("item_id")}, {"_id": 0})
                if item:
                    active_items.append({**item, "serial_number": entry.get("serial_order", 0)})
        if active_items:
            return sorted(active_items, key=lambda x: x.get("serial_number", 0))
    
    fallback_placement = None
    if "college" in url.lower() or "india-colleges" in url.lower():
        fallback_placement = f"college_listing_{section_type}" if section_type != "sponsored" else "college_listing_featured"
    elif "school" in url.lower() or "india-schools" in url.lower():
        fallback_placement = f"school_listing_{section_type}" if section_type != "sponsored" else "school_listing_featured"
    elif "universit" in url.lower():
        fallback_placement = "university_listing_featured"
    
    if fallback_placement and fallback_placement in config.get("placements", {}):
        active_items = []
        for entry in config["placements"].get(fallback_placement, []):
            if entry.get("is_active") and entry.get("start_date", "") <= now <= entry.get("end_date", ""):
                item = await db.colleges.find_one({"id": entry.get("item_id")}, {"_id": 0})
                if item:
                    active_items.append({**item, "serial_number": entry.get("serial_order", 0)})
        return sorted(active_items, key=lambda x: x.get("serial_number", 0))
    
    return []

@sponsored_ads_router.post("/sponsored-ads-multi")
async def save_multi_sponsored_ads(config: MultiSponsoredAdsConfig, current_user: dict = Depends(get_current_user)):
    """Save the multi-placement sponsored ads configuration (admin only)"""
    config.id = "multi_sponsored_ads_config"
    config.updated_at = datetime.now(timezone.utc)
    config.updated_by = current_user.get("email", "admin") if isinstance(current_user, dict) else "admin"
    
    await db.sponsored_ads_multi.update_one(
        {"id": "multi_sponsored_ads_config"},
        {"$set": config.dict()},
        upsert=True
    )
    return {"success": True, "message": "Sponsored ads saved successfully"}

@sponsored_ads_router.get("/sponsored-ads-multi/{placement_id}")
async def get_sponsored_ads_by_placement(placement_id: str, limit: int = Query(6, ge=1, le=20)):
    """Get active sponsored ads for a specific placement"""
    config = await db.sponsored_ads_multi.find_one({"id": "multi_sponsored_ads_config"}, {"_id": 0})
    if not config or placement_id not in config.get("placements", {}):
        return []
    
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    active_items = []
    
    for entry in config["placements"].get(placement_id, []):
        if entry.get("is_active") and entry.get("start_date", "") <= now <= entry.get("end_date", ""):
            content_type = entry.get("content_type", "college")
            item_id = entry.get("item_id")
            
            if content_type == "college":
                item = await db.colleges.find_one({"id": item_id}, {"_id": 0})
            elif content_type == "school":
                item = await db.schools.find_one({"id": item_id}, {"_id": 0})
            elif content_type == "university":
                item = await db.colleges.find_one({"id": item_id, "institution_type": "University"}, {"_id": 0})
            elif content_type == "course":
                item = await db.courses_detailed.find_one({"id": item_id}, {"_id": 0})
            elif content_type == "exam":
                item = await db.exams_detailed.find_one({"id": item_id}, {"_id": 0})
            else:
                item = None
            
            if item:
                item['_sponsored_order'] = entry.get("serial_order", 999)
                active_items.append(item)
    
    active_items.sort(key=lambda x: x.get('_sponsored_order', 999))
    
    for item in active_items:
        item.pop('_sponsored_order', None)
    
    return active_items[:limit]
