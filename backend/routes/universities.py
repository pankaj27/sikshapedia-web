"""Universities CRUD API"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Universities"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# University Model
class University(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    university_type: str  # Central, State, Private, Deemed
    accreditation: str  # NAAC A++, NAAC A+, etc.
    city: str
    state: str
    address: Optional[str] = None
    established_year: Optional[int] = None
    
    # Admission Partner
    is_admission_partner: bool = False
    
    # Institution-specific admission fees (overrides default entity fees)
    admission_fees: Optional[Dict] = None  # { form_fee, platform_fee, gst_percentage }
    
    # Academic Info
    streams: List[str] = []  # Engineering, Medical, Management, etc.
    total_courses: int = 0
    total_colleges: int = 0
    
    # Stats
    total_students: Optional[int] = None
    total_faculty: Optional[int] = None
    
    # Rankings & Ratings
    nirf_rank: Optional[int] = None
    rating: float = 0.0
    total_reviews: int = 0
    
    # Placements
    placement_percentage: Optional[float] = None
    highest_package: Optional[float] = None
    average_package: Optional[float] = None
    
    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@router.get("/universities", response_model=List[University])
async def get_universities(
    city: Optional[str] = None,
    state: Optional[str] = None,
    university_type: Optional[str] = None,
    accreditation: Optional[str] = None,
    stream: Optional[str] = None,
    course: Optional[str] = None,
    sort: str = "rating",
    limit: int = Query(50, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    """Get all universities with optional filters"""
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if state:
        query["state"] = {"$regex": state, "$options": "i"}
    if university_type:
        query["university_type"] = university_type
    if accreditation:
        query["accreditation"] = accreditation
    if stream:
        query["streams"] = {"$regex": stream, "$options": "i"}
    if course:
        # Search in courses array - can be list of strings or list of dicts
        query["$or"] = [
            {"courses": {"$regex": course, "$options": "i"}},
            {"courses.name": {"$regex": course, "$options": "i"}},
            {"courses.degree_type": {"$regex": course, "$options": "i"}}
        ]
    
    sort_field = "rating" if sort == "rating" else "nirf_rank" if sort == "ranking" else "name"
    sort_order = -1 if sort == "rating" else 1
    
    universities = await db.universities.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    return universities


@router.get("/universities/{university_id}", response_model=University)
async def get_university(university_id: str):
    """Get a specific university by ID"""
    university = await db.universities.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    return University(**university)


@router.post("/universities", response_model=University)
async def create_university(university: University):
    """Create a new university (admin only)"""
    university_dict = university.model_dump()
    await db.universities.insert_one(university_dict)
    return university


@router.put("/universities/{university_id}", response_model=University)
async def update_university(university_id: str, university: University):
    """Update a university (admin only)"""
    university_dict = university.model_dump()
    await db.universities.update_one({"id": university_id}, {"$set": university_dict})
    return university


@router.delete("/universities/{university_id}")
async def delete_university(university_id: str):
    """Delete a university (admin only)"""
    result = await db.universities.delete_one({"id": university_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    return {"success": True}
