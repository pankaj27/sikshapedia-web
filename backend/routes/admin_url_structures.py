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


@router.get("/stats")
async def get_url_stats():
    """Get URL structure counts by type"""
    try:
        database = get_db()
        pipeline = [
            {"$group": {"_id": "$type", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        results = await database.url_structures.aggregate(pipeline).to_list(100)
        stats = {item["_id"]: item["count"] for item in results if item["_id"]}
        total = sum(stats.values())
        return {"stats": stats, "total": total}
    except Exception as e:
        print(f"Error fetching URL stats: {e}")
        return {"stats": {}, "total": 0}


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
        
        # =============================================
        # COLLEGE COURSE & STREAM URL STRUCTURES
        # =============================================
        
        elif url_type == "college_india_course":
            # India + Course: /india-colleges/{course}
            for idx, course in enumerate(COURSES, 1):
                slug = generate_slug(course)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{course} Colleges in India",
                    "slug": slug,
                    "type": "college_india_course",
                    "course": course,
                    "link": f"/india-colleges/{slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "college_india_stream":
            # India + Stream: /india-colleges/{stream}
            for idx, stream in enumerate(STREAMS, 1):
                slug = generate_slug(stream)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{stream} Colleges in India",
                    "slug": slug,
                    "type": "college_india_stream",
                    "stream": stream,
                    "link": f"/india-colleges/{slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "college_india_stream_course":
            # India + Stream + Course: /india-colleges/{stream}/{course}
            idx = 1
            for stream in STREAMS:
                stream_slug = generate_slug(stream)
                for course in COURSES:
                    course_slug = generate_slug(course)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{course} in {stream} - India",
                        "slug": f"{stream_slug}/{course_slug}",
                        "type": "college_india_stream_course",
                        "stream": stream,
                        "course": course,
                        "link": f"/india-colleges/{stream_slug}/{course_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "college_state_course":
            # State + Course: /{state}/{course}
            idx = 1
            for state in STATES:
                state_slug = generate_slug(state)
                for course in COURSES:
                    course_slug = generate_slug(course)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{course} Colleges in {state}",
                        "slug": f"{state_slug}/{course_slug}",
                        "type": "college_state_course",
                        "state": state,
                        "course": course,
                        "link": f"/{state_slug}/{course_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "college_city_course":
            # City + Course: /{city}/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    city_slug = generate_slug(city)
                    for course in COURSES:
                        course_slug = generate_slug(course)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{course} Colleges in {city}",
                            "slug": f"{city_slug}/{course_slug}",
                            "type": "college_city_course",
                            "state": state,
                            "city": city,
                            "course": course,
                            "link": f"/{city_slug}/{course_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "college_state_city_course":
            # State + City + Course: /{state}/{city}/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    for course in COURSES:
                        course_slug = generate_slug(course)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{course} Colleges in {city}, {state}",
                            "slug": f"{state_slug}/{city_slug}/{course_slug}",
                            "type": "college_state_city_course",
                            "state": state,
                            "city": city,
                            "course": course,
                            "link": f"/{state_slug}/{city_slug}/{course_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "college_state_stream":
            # State + Stream: /{state}/{stream}
            idx = 1
            for state in STATES:
                state_slug = generate_slug(state)
                for stream in STREAMS:
                    stream_slug = generate_slug(stream)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{stream} Colleges in {state}",
                        "slug": f"{state_slug}/{stream_slug}",
                        "type": "college_state_stream",
                        "state": state,
                        "stream": stream,
                        "link": f"/{state_slug}/{stream_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "college_city_stream":
            # City + Stream: /{city}/{stream}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    city_slug = generate_slug(city)
                    for stream in STREAMS:
                        stream_slug = generate_slug(stream)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{stream} Colleges in {city}",
                            "slug": f"{city_slug}/{stream_slug}",
                            "type": "college_city_stream",
                            "state": state,
                            "city": city,
                            "stream": stream,
                            "link": f"/{city_slug}/{stream_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "college_state_city_stream_course":
            # State + City + Stream + Course: /{state}/{city}/{stream}/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    for stream in STREAMS:
                        stream_slug = generate_slug(stream)
                        for course in COURSES:
                            course_slug = generate_slug(course)
                            structures.append({
                                "id": str(uuid.uuid4()),
                                "name": f"{course} ({stream}) in {city}, {state}",
                                "slug": f"{state_slug}/{city_slug}/{stream_slug}/{course_slug}",
                                "type": "college_state_city_stream_course",
                                "state": state,
                                "city": city,
                                "stream": stream,
                                "course": course,
                                "link": f"/{state_slug}/{city_slug}/{stream_slug}/{course_slug}",
                                "display_order": idx,
                                "is_active": True,
                                "created_at": now,
                                "updated_at": now
                            })
                            idx += 1
        
        # =============================================
        # UNIVERSITY COURSE & STREAM URL STRUCTURES
        # =============================================
        
        elif url_type == "university_india_course":
            # India + Course: /india-universities/{course}
            for idx, course in enumerate(COURSES, 1):
                slug = generate_slug(course)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{course} Universities in India",
                    "slug": slug,
                    "type": "university_india_course",
                    "course": course,
                    "link": f"/india-universities/{slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "university_india_stream":
            # India + Stream: /india-universities/{stream}
            for idx, stream in enumerate(STREAMS, 1):
                slug = generate_slug(stream)
                structures.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{stream} Universities in India",
                    "slug": slug,
                    "type": "university_india_stream",
                    "stream": stream,
                    "link": f"/india-universities/{slug}",
                    "display_order": idx,
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now
                })
        
        elif url_type == "university_india_stream_course":
            # India + Stream + Course: /india-universities/{stream}/{course}
            idx = 1
            for stream in STREAMS:
                stream_slug = generate_slug(stream)
                for course in COURSES:
                    course_slug = generate_slug(course)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{course} in {stream} - Universities India",
                        "slug": f"{stream_slug}/{course_slug}",
                        "type": "university_india_stream_course",
                        "stream": stream,
                        "course": course,
                        "link": f"/india-universities/{stream_slug}/{course_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "university_state_course":
            # State + Course: /{state}-universities/{course}
            idx = 1
            for state in STATES:
                state_slug = generate_slug(state)
                for course in COURSES:
                    course_slug = generate_slug(course)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{course} Universities in {state}",
                        "slug": f"{state_slug}/{course_slug}",
                        "type": "university_state_course",
                        "state": state,
                        "course": course,
                        "link": f"/{state_slug}-universities/{course_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "university_city_course":
            # City + Course: /{city}-universities/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    city_slug = generate_slug(city)
                    for course in COURSES:
                        course_slug = generate_slug(course)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{course} Universities in {city}",
                            "slug": f"{city_slug}/{course_slug}",
                            "type": "university_city_course",
                            "state": state,
                            "city": city,
                            "course": course,
                            "link": f"/{city_slug}-universities/{course_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "university_state_city_course":
            # State + City + Course: /{state}/{city}-universities/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    for course in COURSES:
                        course_slug = generate_slug(course)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{course} Universities in {city}, {state}",
                            "slug": f"{state_slug}/{city_slug}/{course_slug}",
                            "type": "university_state_city_course",
                            "state": state,
                            "city": city,
                            "course": course,
                            "link": f"/{state_slug}/{city_slug}-universities/{course_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "university_state_stream":
            # State + Stream: /{state}-universities/{stream}
            idx = 1
            for state in STATES:
                state_slug = generate_slug(state)
                for stream in STREAMS:
                    stream_slug = generate_slug(stream)
                    structures.append({
                        "id": str(uuid.uuid4()),
                        "name": f"{stream} Universities in {state}",
                        "slug": f"{state_slug}/{stream_slug}",
                        "type": "university_state_stream",
                        "state": state,
                        "stream": stream,
                        "link": f"/{state_slug}-universities/{stream_slug}",
                        "display_order": idx,
                        "is_active": True,
                        "created_at": now,
                        "updated_at": now
                    })
                    idx += 1
        
        elif url_type == "university_city_stream":
            # City + Stream: /{city}-universities/{stream}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                for city in cities:
                    city_slug = generate_slug(city)
                    for stream in STREAMS:
                        stream_slug = generate_slug(stream)
                        structures.append({
                            "id": str(uuid.uuid4()),
                            "name": f"{stream} Universities in {city}",
                            "slug": f"{city_slug}/{stream_slug}",
                            "type": "university_city_stream",
                            "state": state,
                            "city": city,
                            "stream": stream,
                            "link": f"/{city_slug}-universities/{stream_slug}",
                            "display_order": idx,
                            "is_active": True,
                            "created_at": now,
                            "updated_at": now
                        })
                        idx += 1
        
        elif url_type == "university_state_city_stream_course":
            # State + City + Stream + Course: /{state}/{city}-universities/{stream}/{course}
            idx = 1
            for state, cities in CITIES_BY_STATE.items():
                state_slug = generate_slug(state)
                for city in cities:
                    city_slug = generate_slug(city)
                    for stream in STREAMS:
                        stream_slug = generate_slug(stream)
                        for course in COURSES:
                            course_slug = generate_slug(course)
                            structures.append({
                                "id": str(uuid.uuid4()),
                                "name": f"{course} ({stream}) Universities in {city}, {state}",
                                "slug": f"{state_slug}/{city_slug}/{stream_slug}/{course_slug}",
                                "type": "university_state_city_stream_course",
                                "state": state,
                                "city": city,
                                "stream": stream,
                                "course": course,
                                "link": f"/{state_slug}/{city_slug}-universities/{stream_slug}/{course_slug}",
                                "display_order": idx,
                                "is_active": True,
                                "created_at": now,
                                "updated_at": now
                            })
                            idx += 1
        
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
