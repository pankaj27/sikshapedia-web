"""
Unified Search API - Searches across all content types
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from datetime import datetime, timezone

router = APIRouter(prefix="/search", tags=["Search"])

# Database reference
_db = None

def set_database(database):
    global _db
    _db = database

async def get_db():
    if _db is None:
        from server import db
        return db
    return _db

@router.get("/autocomplete")
async def autocomplete_search(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(8, le=20, description="Max results per category"),
    db=Depends(get_db)
):
    """
    Fast autocomplete search across all content types.
    Returns categorized results for dropdown display.
    """
    if not q or len(q) < 2:
        return {"results": [], "total": 0}
    
    search_regex = {"$regex": q, "$options": "i"}
    results = []
    
    # Search Colleges
    colleges = await db.colleges.find(
        {"$or": [
            {"name": search_regex},
            {"city": search_regex},
            {"state": search_regex}
        ]},
        {"_id": 0, "id": 1, "name": 1, "city": 1, "state": 1, "slug": 1, "serial_number": 1, "rating": 1}
    ).limit(limit).to_list(limit)
    
    for c in colleges:
        # Build URL with serial_number-slug format
        slug = c.get("slug") or ""
        serial = c.get("serial_number") or ""
        
        # Use serial-slug if both exist, otherwise use slug, otherwise use id
        if serial and slug:
            url_slug = f"{serial}-{slug}"
        elif slug:
            url_slug = slug
        else:
            # Skip entries without proper slug
            continue
        
        results.append({
            "type": "college",
            "id": c.get("id"),
            "name": c.get("name"),
            "subtitle": f"{c.get('city', '')}, {c.get('state', '')}".strip(", "),
            "url": f"/colleges/{url_slug}",
            "rating": c.get("rating"),
            "icon": "🏫"
        })
    
    # Search Universities
    universities = await db.universities.find(
        {"$or": [
            {"name": search_regex},
            {"city": search_regex},
            {"state": search_regex}
        ]},
        {"_id": 0, "id": 1, "name": 1, "city": 1, "state": 1, "slug": 1, "rating": 1}
    ).limit(limit).to_list(limit)
    
    for u in universities:
        results.append({
            "type": "university",
            "id": u.get("id"),
            "name": u.get("name"),
            "subtitle": f"{u.get('city', '')}, {u.get('state', '')}".strip(", "),
            "url": f"/universities/{u.get('slug', u.get('id', ''))}",
            "rating": u.get("rating"),
            "icon": "🎓"
        })
    
    # Search Schools
    schools = await db.schools.find(
        {"$or": [
            {"name": search_regex},
            {"city": search_regex},
            {"state": search_regex}
        ]},
        {"_id": 0, "id": 1, "name": 1, "city": 1, "state": 1, "slug": 1, "serial_number": 1, "rating": 1}
    ).limit(limit).to_list(limit)
    
    for s in schools:
        slug = s.get("slug", "")
        serial = s.get("serial_number", "")
        url_slug = f"{serial}-{slug}" if serial and slug else slug or s.get("id", "")
        
        results.append({
            "type": "school",
            "id": s.get("id"),
            "name": s.get("name"),
            "subtitle": f"{s.get('city', '')}, {s.get('state', '')}".strip(", "),
            "url": f"/schools/{url_slug}",
            "rating": s.get("rating"),
            "icon": "🏫"
        })
    
    # Search Exams
    exams = await db.exams.find(
        {"$or": [
            {"name": search_regex},
            {"full_name": search_regex},
            {"conducting_body": search_regex}
        ]},
        {"_id": 0, "id": 1, "name": 1, "full_name": 1, "slug": 1, "exam_level": 1}
    ).limit(limit).to_list(limit)
    
    for e in exams:
        results.append({
            "type": "exam",
            "id": e.get("id"),
            "name": e.get("name"),
            "subtitle": e.get("full_name", e.get("exam_level", "")),
            "url": f"/exams/{e.get('slug', e.get('id', ''))}",
            "icon": "📝"
        })
    
    # Search Courses
    courses = await db.courses.find(
        {"$or": [
            {"name": search_regex},
            {"full_name": search_regex},
            {"description": search_regex}
        ]},
        {"_id": 0, "id": 1, "name": 1, "full_name": 1, "slug": 1, "duration": 1}
    ).limit(limit).to_list(limit)
    
    for c in courses:
        results.append({
            "type": "course",
            "id": c.get("id"),
            "name": c.get("name"),
            "subtitle": c.get("full_name", c.get("duration", "")),
            "url": f"/courses/{c.get('slug', c.get('id', ''))}",
            "icon": "📚"
        })
    
    # Sort by relevance (exact match first, then starts with, then contains)
    def relevance_score(item):
        name = item.get("name", "").lower()
        q_lower = q.lower()
        if name == q_lower:
            return 0  # Exact match
        if name.startswith(q_lower):
            return 1  # Starts with
        return 2  # Contains
    
    results.sort(key=relevance_score)
    
    # Limit total results
    results = results[:15]
    
    return {
        "query": q,
        "results": results,
        "total": len(results)
    }


@router.get("/full")
async def full_search(
    q: str = Query(..., min_length=1, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, le=50, description="Max results per category"),
    db=Depends(get_db)
):
    """
    Full search across all content types for search results page.
    """
    if not q:
        return {"results": {}, "total": 0}
    
    search_regex = {"$regex": q, "$options": "i"}
    results = {
        "colleges": [],
        "universities": [],
        "schools": [],
        "exams": [],
        "courses": [],
        "blogs": [],
        "news": []
    }
    
    # Search based on category filter or all
    categories_to_search = [category] if category else list(results.keys())
    
    if "colleges" in categories_to_search:
        colleges = await db.colleges.find(
            {"$or": [{"name": search_regex}, {"city": search_regex}, {"description": search_regex}]},
            {"_id": 0}
        ).limit(limit).to_list(limit)
        results["colleges"] = colleges
    
    if "universities" in categories_to_search:
        universities = await db.universities.find(
            {"$or": [{"name": search_regex}, {"city": search_regex}, {"description": search_regex}]},
            {"_id": 0}
        ).limit(limit).to_list(limit)
        results["universities"] = universities
    
    if "schools" in categories_to_search:
        schools = await db.schools.find(
            {"$or": [{"name": search_regex}, {"city": search_regex}, {"description": search_regex}]},
            {"_id": 0}
        ).limit(limit).to_list(limit)
        results["schools"] = schools
    
    if "exams" in categories_to_search:
        exams = await db.exams.find(
            {"$or": [{"name": search_regex}, {"full_name": search_regex}]},
            {"_id": 0}
        ).limit(limit).to_list(limit)
        results["exams"] = exams
    
    if "courses" in categories_to_search:
        courses = await db.courses.find(
            {"$or": [{"name": search_regex}, {"full_name": search_regex}]},
            {"_id": 0}
        ).limit(limit).to_list(limit)
        results["courses"] = courses
    
    if "blogs" in categories_to_search:
        blogs = await db.blogs.find(
            {"$or": [{"title": search_regex}, {"content": search_regex}]},
            {"_id": 0, "id": 1, "title": 1, "slug": 1, "excerpt": 1, "featured_image": 1}
        ).limit(limit).to_list(limit)
        results["blogs"] = blogs
    
    if "news" in categories_to_search:
        news = await db.news.find(
            {"$or": [{"title": search_regex}, {"content": search_regex}]},
            {"_id": 0, "id": 1, "title": 1, "slug": 1, "excerpt": 1, "featured_image": 1}
        ).limit(limit).to_list(limit)
        results["news"] = news
    
    total = sum(len(v) for v in results.values())
    
    return {
        "query": q,
        "results": results,
        "total": total,
        "counts": {k: len(v) for k, v in results.items()}
    }


@router.get("/trending")
async def get_trending_searches(db=Depends(get_db)):
    """
    Get trending/popular search terms.
    """
    # These could be stored in DB and updated based on actual searches
    trending = [
        {"term": "IIT", "category": "colleges"},
        {"term": "JEE Main 2025", "category": "exams"},
        {"term": "MBA", "category": "courses"},
        {"term": "Engineering Colleges", "category": "colleges"},
        {"term": "NEET 2025", "category": "exams"},
        {"term": "Top Universities", "category": "universities"},
        {"term": "B.Tech", "category": "courses"},
        {"term": "Delhi Colleges", "category": "colleges"},
    ]
    
    return {"trending": trending}
