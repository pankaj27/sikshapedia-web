"""Colleges CRUD API - Core endpoints for college management"""
from fastapi import APIRouter, HTTPException, Query, Depends, BackgroundTasks
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid
import logging

router = APIRouter(prefix="/api", tags=["Colleges"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Minimal projection for listing pages - reduces payload by ~80%
COLLEGE_MINIMAL_PROJECTION = {
    "_id": 0, "id": 1, "name": 1, "slug": 1, "serial_number": 1,
    "institution_type": 1, "type": 1, "location": 1, "logo_url": 1,
    "rating": 1, "average_fees": 1, "courses": 1, "is_featured": 1,
    "is_admission_open": 1, "is_admission_partner": 1, "is_no_cost_emi": 1,
    "is_verified": 1, "display_priority": 1, "state_priority": 1,
    "city_priority": 1, "accreditation": 1, "ranking": 1, "established_year": 1
}


@router.post("/colleges/assign-serial-numbers")
async def assign_serial_numbers():
    """Assign unique serial numbers to all colleges that don't have one"""
    colleges = await db.colleges.find(
        {"$or": [{"serial_number": {"$exists": False}}, {"serial_number": None}]},
        {"_id": 0, "id": 1}
    ).sort("created_at", 1).to_list(1000)
    
    if not colleges:
        return {"message": "All colleges already have serial numbers", "updated": 0}
    
    max_doc = await db.colleges.find_one(
        {"serial_number": {"$exists": True, "$ne": None}},
        {"serial_number": 1},
        sort=[("serial_number", -1)]
    )
    current_max = max_doc.get("serial_number", 0) if max_doc else 0
    
    updated_count = 0
    for college in colleges:
        current_max += 1
        await db.colleges.update_one(
            {"id": college["id"]},
            {"$set": {"serial_number": current_max}}
        )
        updated_count += 1
    
    return {"message": f"Assigned serial numbers to {updated_count} colleges", "updated": updated_count}


@router.get("/colleges")
async def get_colleges(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    type: Optional[str] = None,
    institution_type: Optional[str] = None,
    stream: Optional[str] = None,
    sub_stream: Optional[str] = None,
    min_fees: Optional[float] = None,
    max_fees: Optional[float] = None,
    course: Optional[str] = None,
    sort_by: Optional[str] = Query("nirf_ranking", regex="^(name|nirf_ranking|average_fees|rating)$"),
    include_drafts: Optional[str] = Query(None),
    is_featured: Optional[bool] = None,
    is_admission_open: Optional[bool] = None,
    fields: Optional[str] = Query(None)
):
    """Get all colleges with optional filters"""
    query = {}
    
    show_drafts = include_drafts and include_drafts.lower() == "true"
    if not show_drafts:
        query["status"] = "published"
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if city:
        query["location.city"] = {"$regex": city, "$options": "i"}
    
    if state:
        query["location.state"] = {"$regex": state, "$options": "i"}
    
    if type:
        query["type"] = type
    
    if institution_type:
        query["institution_type"] = {"$regex": f"^{institution_type}$", "$options": "i"}
    
    if stream:
        query["$or"] = query.get("$or", []) + [
            {"courses": {"$regex": stream, "$options": "i"}},
            {"description": {"$regex": stream, "$options": "i"}}
        ]
    
    if sub_stream:
        sub_stream_conditions = [
            {"courses": {"$regex": sub_stream, "$options": "i"}},
            {"description": {"$regex": sub_stream, "$options": "i"}}
        ]
        if "$or" in query:
            query["$and"] = [{"$or": query.pop("$or")}, {"$or": sub_stream_conditions}]
        else:
            query["$or"] = sub_stream_conditions
    
    if min_fees is not None or max_fees is not None:
        query["average_fees"] = {}
        if min_fees is not None:
            query["average_fees"]["$gte"] = min_fees
        if max_fees is not None:
            query["average_fees"]["$lte"] = max_fees
    
    if course:
        query["courses.name"] = {"$regex": course, "$options": "i"}
    
    if is_featured is not None:
        query["is_featured"] = is_featured
    
    if is_admission_open is not None:
        query["is_admission_open"] = is_admission_open
    
    sort_order = 1 if sort_by == "name" else 1 if sort_by == "nirf_ranking" else -1
    
    projection = COLLEGE_MINIMAL_PROJECTION if fields == "minimal" else {"_id": 0}
    
    colleges = await db.colleges.find(query, projection).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
    
    # Apply location-specific priority sorting
    def get_priority(college):
        if city and college.get('city_priority', {}).get(city, 0) > 0:
            return college['city_priority'][city]
        if state and college.get('state_priority', {}).get(state, 0) > 0:
            return college['state_priority'][state]
        return college.get('display_priority', 0)
    
    prioritized = [c for c in colleges if get_priority(c) > 0]
    non_prioritized = [c for c in colleges if get_priority(c) == 0]
    prioritized.sort(key=lambda x: get_priority(x))
    colleges = prioritized + non_prioritized
    
    if fields == "minimal":
        return colleges
    
    return colleges


@router.get("/colleges/featured")
async def get_featured_colleges(limit: int = Query(12, ge=1, le=50), fields: Optional[str] = Query(None)):
    """Get featured colleges for homepage display"""
    projection = COLLEGE_MINIMAL_PROJECTION if fields == "minimal" else {"_id": 0}
    
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_colleges_ids", []) if settings else []
    
    featured_colleges = []
    
    if featured_ids:
        for college_id in featured_ids[:limit]:
            college = await db.colleges.find_one({"id": college_id, "status": "published"}, projection)
            if college:
                featured_colleges.append(college)
    
    if len(featured_colleges) < limit:
        existing_ids = [c.get('id') for c in featured_colleges]
        additional = await db.colleges.find(
            {"status": "published", "is_featured": True, "id": {"$nin": existing_ids}}, 
            projection
        ).sort("featured_at", -1).limit(limit - len(featured_colleges)).to_list(limit - len(featured_colleges))
        featured_colleges.extend(additional)
    
    if len(featured_colleges) < limit:
        existing_ids = [c.get('id') for c in featured_colleges]
        additional = await db.colleges.find(
            {"status": "published", "id": {"$nin": existing_ids}}, 
            projection
        ).sort("nirf_ranking", 1).limit(limit - len(featured_colleges)).to_list(limit - len(featured_colleges))
        featured_colleges.extend(additional)
    
    return featured_colleges


@router.get("/colleges/featured-priority")
async def get_featured_priority_colleges(limit: int = Query(6, ge=1, le=20)):
    """Get featured colleges sorted by priority period"""
    colleges = await db.colleges.find(
        {"status": "published", "is_featured": True}, 
        {"_id": 0}
    ).to_list(100)
    
    now = datetime.now(timezone.utc)
    priority_colleges = []
    regular_colleges = []
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
        
        featured_at = college.get('featured_at')
        priority_months = college.get('featured_priority_months', 2)
        
        if featured_at:
            if isinstance(featured_at, str):
                featured_at = datetime.fromisoformat(featured_at.replace('Z', '+00:00'))
            if not featured_at.tzinfo:
                featured_at = featured_at.replace(tzinfo=timezone.utc)
            
            months_passed = (now - featured_at).days / 30
            if months_passed <= priority_months:
                priority_colleges.append((college, featured_at))
            else:
                regular_colleges.append(college)
        else:
            regular_colleges.append(college)
    
    priority_colleges.sort(key=lambda x: x[1], reverse=True)
    priority_colleges = [c[0] for c in priority_colleges]
    regular_colleges.sort(key=lambda x: x.get('nirf_ranking') or 9999)
    
    result = priority_colleges + regular_colleges
    return result[:limit]


@router.get("/colleges/by-stream-featured")
async def get_colleges_by_stream_featured():
    """Get featured colleges by stream for homepage"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    stream_colleges = settings.get("stream_colleges", {}) if settings else {}
    
    result = {}
    default_streams = ["Engineering", "Medical", "Management", "Law", "Design", "Science"]
    
    for stream in default_streams:
        stream_config = stream_colleges.get(stream, {})
        # Handle case where stream_config might be a list instead of dict
        if isinstance(stream_config, list):
            college_ids = stream_config
        elif isinstance(stream_config, dict):
            college_ids = stream_config.get("college_ids", [])
        else:
            college_ids = []
        
        if college_ids:
            colleges = []
            for cid in college_ids[:6]:
                college = await db.colleges.find_one(
                    {"id": cid, "status": "published"},
                    COLLEGE_MINIMAL_PROJECTION
                )
                if college:
                    colleges.append(college)
            result[stream] = colleges
        else:
            # Fallback: get top colleges in this stream
            colleges = await db.colleges.find(
                {
                    "status": "published",
                    "$or": [
                        {"courses": {"$regex": stream, "$options": "i"}},
                        {"description": {"$regex": stream, "$options": "i"}}
                    ]
                },
                COLLEGE_MINIMAL_PROJECTION
            ).sort("nirf_ranking", 1).limit(6).to_list(6)
            result[stream] = colleges
    
    return result


@router.get("/colleges/admission-open-priority")
async def get_admission_open_priority_colleges(limit: int = Query(6, ge=1, le=20)):
    """Get colleges with admission open, sorted by priority"""
    colleges = await db.colleges.find(
        {"status": "published", "is_admission_open": True}, 
        {"_id": 0}
    ).to_list(100)
    
    now = datetime.now(timezone.utc)
    priority_colleges = []
    regular_colleges = []
    
    for college in colleges:
        if isinstance(college.get('created_at'), str):
            college['created_at'] = datetime.fromisoformat(college['created_at'])
        
        admission_open_at = college.get('admission_open_at')
        priority_months = college.get('admission_priority_months', 2)
        
        if admission_open_at:
            if isinstance(admission_open_at, str):
                admission_open_at = datetime.fromisoformat(admission_open_at.replace('Z', '+00:00'))
            if not admission_open_at.tzinfo:
                admission_open_at = admission_open_at.replace(tzinfo=timezone.utc)
            
            months_passed = (now - admission_open_at).days / 30
            if months_passed <= priority_months:
                priority_colleges.append((college, admission_open_at))
            else:
                regular_colleges.append(college)
        else:
            regular_colleges.append(college)
    
    priority_colleges.sort(key=lambda x: x[1], reverse=True)
    priority_colleges = [c[0] for c in priority_colleges]
    regular_colleges.sort(key=lambda x: x.get('nirf_ranking') or 9999)
    
    result = priority_colleges + regular_colleges
    return result[:limit]


@router.get("/colleges/{college_id}")
async def get_college(college_id: str):
    """Get a specific college by ID"""
    college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    if isinstance(college.get('created_at'), str):
        college['created_at'] = datetime.fromisoformat(college['created_at'])
    
    return college
