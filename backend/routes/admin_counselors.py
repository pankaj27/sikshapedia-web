"""
Admin Counselors Routes - CRUD for counselors management
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/admin/counselors", tags=["Admin Counselors"])

# Database reference
db = None

def set_database(database):
    global db
    db = database

def get_db():
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return db

# Models
class CounselorCreate(BaseModel):
    name: str
    photo_url: Optional[str] = None
    specialization: str
    experience_years: int = 0
    rating: float = 4.5
    total_sessions: int = 0
    price_per_session: int = 0
    available_modes: List[str] = ["Video"]
    bio: Optional[str] = None
    qualifications: Optional[str] = None
    languages: str = "English, Hindi"
    available_slots: List[dict] = []
    is_active: bool = True

class CounselorUpdate(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    rating: Optional[float] = None
    total_sessions: Optional[int] = None
    price_per_session: Optional[int] = None
    available_modes: Optional[List[str]] = None
    bio: Optional[str] = None
    qualifications: Optional[str] = None
    languages: Optional[str] = None
    available_slots: Optional[List[dict]] = None
    is_active: Optional[bool] = None


@router.get("")
async def get_all_counselors(skip: int = 0, limit: int = 50, active_only: bool = False):
    """Get all counselors for admin"""
    try:
        database = get_db()
        query = {"is_active": True} if active_only else {}
        counselors = await database.counselors.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
        return counselors
    except Exception as e:
        print(f"Error fetching counselors: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch counselors")


@router.get("/{counselor_id}")
async def get_counselor(counselor_id: str):
    """Get single counselor by ID"""
    try:
        database = get_db()
        counselor = await database.counselors.find_one({"id": counselor_id}, {"_id": 0})
        if not counselor:
            raise HTTPException(status_code=404, detail="Counselor not found")
        return counselor
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching counselor: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch counselor")


@router.post("")
async def create_counselor(counselor: CounselorCreate):
    """Create new counselor"""
    try:
        database = get_db()
        
        counselor_data = {
            "id": str(uuid.uuid4()),
            **counselor.model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await database.counselors.insert_one(counselor_data)
        
        # Return without _id
        counselor_data.pop('_id', None)
        return counselor_data
    except Exception as e:
        print(f"Error creating counselor: {e}")
        raise HTTPException(status_code=500, detail="Failed to create counselor")


@router.put("/{counselor_id}")
async def update_counselor(counselor_id: str, counselor: CounselorUpdate):
    """Update counselor"""
    try:
        database = get_db()
        
        # Get existing counselor
        existing = await database.counselors.find_one({"id": counselor_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Counselor not found")
        
        # Build update data (only non-None fields)
        update_data = {k: v for k, v in counselor.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        await database.counselors.update_one(
            {"id": counselor_id},
            {"$set": update_data}
        )
        
        # Return updated counselor
        updated = await database.counselors.find_one({"id": counselor_id}, {"_id": 0})
        return updated
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating counselor: {e}")
        raise HTTPException(status_code=500, detail="Failed to update counselor")


@router.delete("/{counselor_id}")
async def delete_counselor(counselor_id: str):
    """Delete counselor"""
    try:
        database = get_db()
        
        result = await database.counselors.delete_one({"id": counselor_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Counselor not found")
        
        return {"success": True, "message": "Counselor deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting counselor: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete counselor")
