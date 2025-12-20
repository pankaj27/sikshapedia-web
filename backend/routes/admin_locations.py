"""
Admin Locations Routes - CRUD for managing locations (states, cities, countries)
For the "Find Colleges by Location" section on homepage
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/admin/locations", tags=["Admin Locations"])

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
class LocationCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    type: str  # 'state', 'city', 'country'
    image_url: Optional[str] = None
    college_count: int = 0
    link: Optional[str] = None
    display_order: int = 0
    is_featured: bool = True
    is_active: bool = True
    parent_state: Optional[str] = None  # For cities

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None
    college_count: Optional[int] = None
    link: Optional[str] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    parent_state: Optional[str] = None


@router.get("/states")
async def get_admin_states():
    """Get all states for admin"""
    try:
        database = get_db()
        print(f"[admin_locations] Database: {database}, Collection: {database.managed_locations}")
        states = await database.managed_locations.find(
            {"type": "state"}, {"_id": 0}
        ).sort("display_order", 1).to_list(100)
        print(f"[admin_locations] Found {len(states)} states")
        return states
    except Exception as e:
        print(f"Error fetching states: {e}")
        import traceback
        traceback.print_exc()
        return []


@router.get("/cities")
async def get_admin_cities():
    """Get all cities for admin"""
    try:
        database = get_db()
        cities = await database.managed_locations.find(
            {"type": "city"}, {"_id": 0}
        ).sort("display_order", 1).to_list(500)
        return cities
    except Exception as e:
        print(f"Error fetching cities: {e}")
        return []


@router.get("/streams")
async def get_admin_streams():
    """Get all streams for admin"""
    try:
        database = get_db()
        streams = await database.managed_locations.find(
            {"type": "stream"}, {"_id": 0}
        ).sort("display_order", 1).to_list(100)
        return streams
    except Exception as e:
        print(f"Error fetching streams: {e}")
        return []


@router.get("/courses")
async def get_admin_courses():
    """Get all courses for admin"""
    try:
        database = get_db()
        courses = await database.managed_locations.find(
            {"type": "course"}, {"_id": 0}
        ).sort("display_order", 1).to_list(200)
        return courses
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return []


@router.get("/countries")
async def get_admin_countries():
    """Get all countries for admin"""
    try:
        database = get_db()
        countries = await database.managed_locations.find(
            {"type": "country"}, {"_id": 0}
        ).sort("display_order", 1).to_list(100)
        return countries
    except Exception as e:
        print(f"Error fetching countries: {e}")
        return []


@router.get("/{location_id}")
async def get_location(location_id: str):
    """Get single location by ID"""
    try:
        database = get_db()
        location = await database.managed_locations.find_one({"id": location_id}, {"_id": 0})
        if not location:
            raise HTTPException(status_code=404, detail="Location not found")
        return location
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching location: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch location")


@router.post("")
async def create_location(location: LocationCreate):
    """Create new location"""
    try:
        database = get_db()
        
        # Generate slug if not provided
        slug = location.slug or location.name.lower().replace(' ', '-').replace(',', '')
        
        # Generate link if not provided
        if not location.link:
            if location.type == 'state':
                link = f"/{slug}-colleges"
            elif location.type == 'city':
                link = f"/{slug}-colleges"
            else:
                link = f"/study-abroad?country={slug}"
        else:
            link = location.link
        
        location_data = {
            "id": str(uuid.uuid4()),
            "name": location.name,
            "slug": slug,
            "type": location.type,
            "image_url": location.image_url,
            "college_count": location.college_count,
            "link": link,
            "display_order": location.display_order,
            "is_featured": location.is_featured,
            "is_active": location.is_active,
            "parent_state": location.parent_state,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await database.managed_locations.insert_one(location_data)
        location_data.pop('_id', None)
        return location_data
    except Exception as e:
        print(f"Error creating location: {e}")
        raise HTTPException(status_code=500, detail="Failed to create location")


@router.put("/{location_id}")
async def update_location(location_id: str, location: LocationUpdate):
    """Update location"""
    try:
        database = get_db()
        
        existing = await database.managed_locations.find_one({"id": location_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Location not found")
        
        update_data = {k: v for k, v in location.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        await database.managed_locations.update_one(
            {"id": location_id},
            {"$set": update_data}
        )
        
        updated = await database.managed_locations.find_one({"id": location_id}, {"_id": 0})
        return updated
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating location: {e}")
        raise HTTPException(status_code=500, detail="Failed to update location")


@router.delete("/{location_id}")
async def delete_location(location_id: str):
    """Delete location"""
    try:
        database = get_db()
        
        result = await database.managed_locations.delete_one({"id": location_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Location not found")
        
        return {"success": True, "message": "Location deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting location: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete location")
