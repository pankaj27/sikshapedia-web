"""Listing Pages Content Management API"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from uuid import uuid4

router = APIRouter(prefix="/api", tags=["Listing Pages"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Import models from server.py - these should be moved to models.py eventually
class FAQItem(BaseModel):
    question: str
    answer: str

class ListingPageContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    url_slug: str  # e.g., /india-colleges, /engineering-colleges
    page_type: str = "general"  # general, state, city, stream, combined
    institution_type: Optional[str] = "colleges"  # colleges, schools, universities
    
    # SEO Fields
    page_title: str
    meta_description: Optional[str] = ""
    meta_keywords: Optional[List[str]] = []
    
    # Hero Section
    hero_title: Optional[str] = ""
    hero_subtitle: Optional[str] = ""
    hero_image: Optional[str] = ""
    
    # Main Content
    main_heading: Optional[str] = ""
    intro_content: Optional[str] = ""  # Rich text content
    
    # FAQ Section
    faqs: Optional[List[FAQItem]] = []
    
    # Additional Sections
    why_choose_title: Optional[str] = ""
    why_choose_content: Optional[str] = ""
    features: Optional[List[dict]] = []  # List of feature cards
    
    # Statistics
    stats: Optional[List[dict]] = []  # e.g., [{"value": "10K+", "label": "Colleges"}]
    
    # CTA Section
    cta_title: Optional[str] = ""
    cta_description: Optional[str] = ""
    cta_button_text: Optional[str] = ""
    cta_button_link: Optional[str] = ""
    
    # Publishing
    is_published: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    created_by: Optional[str] = None
    created_by_name: Optional[str] = None
    created_by_photo: Optional[str] = None
    updated_by: Optional[str] = None
    updated_by_name: Optional[str] = None
    updated_by_photo: Optional[str] = None

# User dependency - simplified version
async def get_current_user_from_token(authorization: str = None):
    """Get current user from token - placeholder for actual implementation"""
    # This should be imported from auth module in production
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return None

@router.get("/listing-pages/stats")
async def get_listing_pages_stats():
    """Get listing page statistics by page_type"""
    pipeline = [
        {"$group": {"_id": "$page_type", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    results = await db.listing_pages.aggregate(pipeline).to_list(50)
    stats = {item["_id"]: item["count"] for item in results if item["_id"]}
    total = sum(stats.values())
    return {"stats": stats, "total": total}

@router.get("/listing-pages")
async def get_listing_pages(
    page_type: Optional[str] = None,
    institution_type: Optional[str] = None,
    is_published: Optional[bool] = None,
    limit: int = 1000
):
    """Get all listing page content with optional filters"""
    query = {}
    if page_type:
        query["page_type"] = page_type
    if institution_type:
        query["institution_type"] = institution_type
    if is_published is not None:
        query["is_published"] = is_published
    
    pages = await db.listing_pages.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return pages

@router.get("/listing-pages/by-slug/{url_slug:path}")
async def get_listing_page_by_slug(url_slug: str):
    """Get listing page content by URL slug"""
    page = await db.listing_pages.find_one({"url_slug": url_slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page content not found")
    return page

@router.get("/listing-pages/{page_id}")
async def get_listing_page(page_id: str):
    """Get listing page content by ID"""
    page = await db.listing_pages.find_one({"id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@router.post("/listing-pages", response_model=ListingPageContent)
async def create_listing_page(page: ListingPageContent):
    """Create new listing page content (Admin only)"""
    # Check if slug already exists
    existing = await db.listing_pages.find_one({"url_slug": page.url_slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this URL slug already exists")
    
    page_dict = page.model_dump()
    page_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    page_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.listing_pages.insert_one(page_dict)
    return page

@router.put("/listing-pages/{page_id}")
async def update_listing_page(page_id: str, page_data: dict):
    """Update listing page content (Admin only)"""
    page_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Remove _id if present to avoid MongoDB errors
    page_data.pop("_id", None)
    
    result = await db.listing_pages.update_one(
        {"id": page_id},
        {"$set": page_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page updated successfully"}

@router.delete("/listing-pages/{page_id}")
async def delete_listing_page(page_id: str):
    """Delete listing page content (Admin only)"""
    result = await db.listing_pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted successfully"}

@router.post("/listing-pages/bulk-create")
async def bulk_create_listing_pages(pages: List[dict]):
    """Bulk create listing pages for states/cities/streams"""
    created = 0
    skipped = 0
    for page_data in pages:
        existing = await db.listing_pages.find_one({"url_slug": page_data.get("url_slug")})
        if not existing:
            page = ListingPageContent(**page_data)
            page_dict = page.model_dump()
            page_dict["created_at"] = datetime.now(timezone.utc).isoformat()
            page_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
            await db.listing_pages.insert_one(page_dict)
            created += 1
        else:
            skipped += 1
    return {"message": f"Created {created} pages, skipped {skipped} existing"}

# Admin listing pages stats endpoint (for admin panel)
@router.get("/admin/listing-pages/stats")
async def get_admin_listing_pages_stats():
    """Get listing page statistics for admin panel"""
    pipeline = [
        {"$group": {"_id": "$page_type", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    results = await db.listing_pages.aggregate(pipeline).to_list(50)
    stats = {item["_id"]: item["count"] for item in results if item["_id"]}
    total = sum(stats.values())
    return {"stats": stats, "total": total}
