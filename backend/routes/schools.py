"""Schools CRUD API"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Schools"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# School Model
class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    board: str  # CBSE, ICSE, State Board, IB, IGCSE
    school_type: str  # Government, Private, International
    medium: str  # English, Hindi, Regional Language
    city: str
    state: str
    address: Optional[str] = None
    pincode: Optional[str] = None
    established_year: Optional[int] = None
    
    # Display Priority for listing pages (lower number = appears first, 0 = default)
    display_priority: int = 0
    
    # Admission Partner
    is_admission_partner: bool = False
    
    # Institution-specific admission fees (overrides default entity fees)
    admission_fees: Optional[Dict] = None  # { form_fee, platform_fee, gst_percentage }
    
    # Academic Info
    classes_offered: List[str] = []
    streams_offered: List[str] = []
    
    # Infrastructure
    total_area: Optional[str] = None
    total_students: Optional[int] = None
    student_teacher_ratio: Optional[str] = None
    facilities: List[str] = []
    
    # Fees
    admission_fee: Optional[float] = None
    annual_fee: Optional[float] = None
    
    # Ratings & Stats
    rating: float = 0.0
    total_reviews: int = 0
    academic_excellence: float = 0.0
    infrastructure_rating: float = 0.0
    extracurricular_rating: float = 0.0
    
    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@router.get("/schools", response_model=List[School])
async def get_schools(
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    board: Optional[str] = None,
    school_type: Optional[str] = None,
    medium: Optional[str] = None,
    sort: str = "rating",
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    """Get all schools with optional filters - queries colleges collection with institution_type=School"""
    query = {
        "institution_type": "School",
        "status": "published"
    }
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if city:
        query["$or"] = query.get("$or", []) + [
            {"city": {"$regex": city, "$options": "i"}},
            {"location.city": {"$regex": city, "$options": "i"}}
        ]
    if state:
        state_query = [
            {"state": {"$regex": state, "$options": "i"}},
            {"location.state": {"$regex": state, "$options": "i"}}
        ]
        if "$or" in query:
            query["$and"] = [{"$or": query.pop("$or")}, {"$or": state_query}]
        else:
            query["$or"] = state_query
    if board:
        query["board"] = board
    if school_type:
        query["type"] = school_type
    if medium:
        query["medium"] = medium
    
    sort_field = "rating" if sort == "rating" else "name"
    sort_order = -1 if sort == "rating" else 1
    
    # Query from colleges collection with institution_type filter
    schools = await db.colleges.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    
    # Re-sort to put items with display_priority > 0 first
    prioritized = [s for s in schools if s.get('display_priority', 0) > 0]
    non_prioritized = [s for s in schools if s.get('display_priority', 0) == 0]
    prioritized.sort(key=lambda x: x.get('display_priority', 0))
    schools = prioritized + non_prioritized
    
    return schools


@router.get("/schools/featured", response_model=List[School])
async def get_featured_schools(limit: int = Query(8, ge=1, le=50)):
    """Get featured schools for homepage - prioritizes manually selected schools from homepage settings"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_schools_ids", []) if settings else []
    
    featured_schools = []
    
    # Get schools from homepage settings (in specified order)
    if featured_ids:
        for school_id in featured_ids[:limit]:
            school = await db.schools.find_one({"id": school_id}, {"_id": 0})
            if school:
                featured_schools.append(school)
    
    # If not enough, fill with top rated schools
    if len(featured_schools) < limit:
        existing_ids = [s.get('id') for s in featured_schools]
        additional = await db.schools.find(
            {"id": {"$nin": existing_ids}}, 
            {"_id": 0}
        ).sort("rating", -1).limit(limit - len(featured_schools)).to_list(limit - len(featured_schools))
        featured_schools.extend(additional)
    
    return featured_schools


@router.get("/schools/{school_id}", response_model=School)
async def get_school(school_id: str):
    """Get a specific school by ID"""
    school = await db.schools.find_one({"id": school_id}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return School(**school)


@router.post("/schools", response_model=School)
async def create_school(school: School):
    """Create a new school (admin only)"""
    school_dict = school.model_dump()
    await db.schools.insert_one(school_dict)
    return school


@router.put("/schools/{school_id}", response_model=School)
async def update_school(school_id: str, school: School):
    """Update a school (admin only)"""
    school_dict = school.model_dump()
    await db.schools.update_one({"id": school_id}, {"$set": school_dict})
    return school


@router.delete("/schools/{school_id}")
async def delete_school(school_id: str):
    """Delete a school (admin only)"""
    result = await db.schools.delete_one({"id": school_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="School not found")
    return {"success": True}
