"""
Admin URL Structures Routes - Generate and manage URL structures for listing pages
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/admin/url-structures", tags=["Admin URL Structures"])

# Database reference
db = None

def set_database(database):
    global db
    db = database

def get_db():
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return db

# Data
STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
]

CITIES_BY_STATE = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Navi Mumbai"],
    "Delhi": ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Kharagpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Ghaziabad", "Noida", "Greater Noida"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
    "Chandigarh": ["Chandigarh"],
    "Puducherry": ["Puducherry", "Karaikal"],
}

STREAMS = [
    "Engineering", "Medical", "Management", "Law", "Arts", "Science", "Commerce",
    "Pharmacy", "Architecture", "Design", "Agriculture", "Education", "Nursing",
    "Dental", "Hotel Management", "Mass Communication", "Computer Applications",
    "Aviation", "Animation", "Fashion Design", "Interior Design", "Journalism"
]

COURSES = [
    "B.Tech", "B.E", "M.Tech", "M.E", "MBBS", "BDS", "BAMS", "BHMS", "B.Pharm", "D.Pharm",
    "MBA", "BBA", "PGDM", "BMS", "BBM", "B.Com", "M.Com", "CA", "CS",
    "B.Sc", "M.Sc", "BA", "MA", "BCA", "MCA", "LLB", "LLM", "BA LLB", "BBA LLB",
    "B.Arch", "M.Arch", "B.Des", "M.Des", "BJMC", "BHM", "B.Ed", "M.Ed", "PhD"
]

def generate_slug(name):
    return name.lower().replace(' ', '-').replace('.', '').replace('/', '-').replace(',', '')


class GenerateRequest(BaseModel):
    type: str

class UrlUpdate(BaseModel):
    name: Optional[str] = None
    link: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


@router.get("")
async def get_url_structures(type: Optional[str] = None, skip: int = 0, limit: int = 500):
    """Get all URL structures"""
    try:
        database = get_db()
        query = {}
        if type and type != 'all':
            query["type"] = type
        
        structures = await database.url_structures.find(query, {"_id": 0}).sort("display_order", 1).skip(skip).limit(limit).to_list(limit)
        return structures
    except Exception as e:
        print(f"Error fetching URL structures: {e}")
        return []


@router.post("/generate")
async def generate_url_structures(request: GenerateRequest):
    """Generate URL structures based on type"""
    try:
        database = get_db()
        url_type = request.type
        now = datetime.now(timezone.utc).isoformat()
        structures = []
        
        # Delete existing of this type
        await database.url_structures.delete_many({"type": url_type})
        
        if url_type == "college_state":
            # Colleges by State: /{state}-colleges
            for idx, state in enumerate(STATES, 1):
                slug = generate_slug(state)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{state} Colleges",
                    "slug": slug,
                    "type": "college_state",
                    "state": state,
                    "link": f"/{slug}-colleges",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "college_city":
            # Colleges by City: /{city}-colleges
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city} Colleges",
                        "slug": slug,
                        "type": "college_city",
                        "state": state,
                        "city": city,
                        "link": f"/{slug}-colleges",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "college_state_city":
            # Colleges by State+City: /{state}/{city}-colleges
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city}, {state} Colleges",
                        "slug": f"{state_slug}/{city_slug}",
                        "type": "college_state_city",
                        "state": state,
                        "city": city,
                        "link": f"/{state_slug}/{city_slug}-colleges",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "school_state":
            # Schools by State: /{state}-schools
            for idx, state in enumerate(STATES, 1):
                slug = generate_slug(state)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{state} Schools",
                    "slug": slug,
                    "type": "school_state",
                    "state": state,
                    "link": f"/{slug}-schools",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "school_city":
            # Schools by City: /{city}-schools
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city} Schools",
                        "slug": slug,
                        "type": "school_city",
                        "state": state,
                        "city": city,
                        "link": f"/{slug}-schools",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "school_state_city":
            # Schools by State+City: /{state}/{city}-schools
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city}, {state} Schools",
                        "slug": f"{state_slug}/{city_slug}",
                        "type": "school_state_city",
                        "state": state,
                        "city": city,
                        "link": f"/{state_slug}/{city_slug}-schools",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "university_state":
            # Universities by State: /{state}-universities
            for idx, state in enumerate(STATES, 1):
                slug = generate_slug(state)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{state} Universities",
                    "slug": slug,
                    "type": "university_state",
                    "state": state,
                    "link": f"/{slug}-universities",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "university_city":
            # Universities by City: /{city}-universities
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city} Universities",
                        "slug": slug,
                        "type": "university_city",
                        "state": state,
                        "city": city,
                        "link": f"/{slug}-universities",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "university_state_city":
            # Universities by State+City: /{state}/{city}-universities
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{city}, {state} Universities",
                        "slug": f"{state_slug}/{city_slug}",
                        "type": "university_state_city",
                        "state": state,
                        "city": city,
                        "link": f"/{state_slug}/{city_slug}-universities",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "stream":
            # Streams: /india-colleges/{stream}
            for idx, stream in enumerate(STREAMS, 1):
                slug = generate_slug(stream)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": stream,
                    "slug": slug,
                    "type": "stream",
                    "link": f"/india-colleges/{slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "course":
            # Courses: /india-colleges?course={course}
            for idx, course in enumerate(COURSES, 1):
                slug = generate_slug(course)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": course,
                    "slug": slug,
                    "type": "course",
                    "link": f"/india-colleges?course={slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown URL type: {url_type}")
        
        if structures:
            await database.url_structures.insert_many(structures)
        
        return {"success": True, "count": len(structures), "type": url_type}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating URL structures: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{url_id}")
async def update_url_structure(url_id: str, data: UrlUpdate):
    """Update URL structure"""
    try:
        database = get_db()
        
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await database.url_structures.update_one(
            {"id": url_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="URL not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to update")


@router.delete("/{url_id}")
async def delete_url_structure(url_id: str):
    """Delete URL structure"""
    try:
        database = get_db()
        result = await database.url_structures.delete_one({"id": url_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="URL not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete")
