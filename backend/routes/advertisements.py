"""Advertisements API - Both public and admin endpoints"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Advertisements"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Models
class Advertisement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    ad_type: str  # banner, popup, sidebar, native
    placement: str  # header, footer, sidebar, in-content
    pages: List[str] = []  # Which pages to show on
    
    # Content
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    headline: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    target_url: Optional[str] = None
    
    # Scheduling
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True
    
    # Targeting
    target_streams: List[str] = []
    target_states: List[str] = []
    target_device: str = "all"  # all, mobile, desktop
    
    # Budget & Bidding
    budget_type: str = "unlimited"  # unlimited, daily, total
    daily_budget: Optional[float] = None
    total_budget: Optional[float] = None
    spent_today: float = 0.0
    total_spent: float = 0.0
    
    # Stats
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0
    
    # Priority
    priority: int = 0
    
    # Metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None


# ============================================
# Public Endpoints
# ============================================

@router.get("/advertisements/active/{page_name}")
async def get_active_advertisements(page_name: str):
    """Get active advertisements for a specific page (Public)"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    query = {
        "is_active": True,
        "$or": [
            {"pages": page_name},
            {"pages": {"$in": [page_name]}},
        ]
    }
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("priority", -1).to_list(100)
    
    filtered_ads = []
    for ad in ads:
        start = ad.get('start_date', '')
        end = ad.get('end_date', '')
        
        if hasattr(start, 'strftime'):
            start = start.strftime("%Y-%m-%d")
        if hasattr(end, 'strftime'):
            end = end.strftime("%Y-%m-%d")
        
        if start and 'T' in str(start):
            start = str(start).split('T')[0]
        if end and 'T' in str(end):
            end = str(end).split('T')[0]
        
        if start and end and start <= today <= end:
            filtered_ads.append(ad)
        elif not start or not end:
            filtered_ads.append(ad)
    
    return filtered_ads


@router.get("/advertisements/serve/{placement}")
async def serve_advertisement(placement: str, page: Optional[str] = None):
    """Serve an advertisement for a placement (Public)"""
    today = datetime.now(timezone.utc)
    
    query = {
        "is_active": True,
        "placement": placement
    }
    
    if page:
        query["$or"] = [
            {"pages": page},
            {"pages": {"$in": [page]}},
            {"pages": {"$size": 0}}
        ]
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("priority", -1).to_list(50)
    
    valid_ads = []
    for ad in ads:
        # Check budget
        if ad.get('budget_type') == 'daily' and ad.get('daily_budget'):
            if ad.get('spent_today', 0) >= ad['daily_budget']:
                continue
        
        if ad.get('budget_type') == 'total' and ad.get('total_budget'):
            if ad.get('total_spent', 0) >= ad['total_budget']:
                continue
        
        # Check date range
        start = ad.get('start_date')
        end = ad.get('end_date')
        
        if start:
            if isinstance(start, str):
                start = datetime.fromisoformat(start.replace('Z', '+00:00'))
            if start > today:
                continue
        
        if end:
            if isinstance(end, str):
                end = datetime.fromisoformat(end.replace('Z', '+00:00'))
            if end < today:
                continue
        
        valid_ads.append(ad)
    
    if not valid_ads:
        return None
    
    # Return highest priority ad
    return valid_ads[0]


@router.post("/advertisements/{ad_id}/impression")
async def track_impression(ad_id: str):
    """Track an ad impression (Public)"""
    result = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"impressions": 1, "spent_today": 0.01, "total_spent": 0.01}}
    )
    return {"success": result.modified_count > 0}


@router.post("/advertisements/{ad_id}/click")
async def track_click(ad_id: str):
    """Track an ad click (Public)"""
    result = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"clicks": 1, "spent_today": 0.10, "total_spent": 0.10}}
    )
    return {"success": result.modified_count > 0}


@router.post("/advertisements/{ad_id}/track")
async def track_ad_event(ad_id: str, event_type: str = "impression"):
    """Track an ad event (Public)"""
    update = {"$inc": {}}
    
    if event_type == "impression":
        update["$inc"]["impressions"] = 1
    elif event_type == "click":
        update["$inc"]["clicks"] = 1
    elif event_type == "conversion":
        update["$inc"]["conversions"] = 1
    
    result = await db.advertisements.update_one({"id": ad_id}, update)
    return {"success": result.modified_count > 0}


# ============================================
# Admin Endpoints (no auth dependency - should be protected by frontend)
# ============================================

@router.get("/advertisements")
async def get_advertisements(
    status: Optional[str] = Query(None),
    ad_type: Optional[str] = Query(None),
    placement: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000)
):
    """Get all advertisements (Admin)"""
    query = {}
    if status == "active":
        query["is_active"] = True
    elif status == "inactive":
        query["is_active"] = False
    
    if ad_type:
        query["ad_type"] = ad_type
    
    if placement:
        query["placement"] = placement
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    for ad in ads:
        if isinstance(ad.get('created_at'), str):
            ad['created_at'] = datetime.fromisoformat(ad['created_at'])
        if isinstance(ad.get('updated_at'), str):
            ad['updated_at'] = datetime.fromisoformat(ad['updated_at'])
    
    return ads


@router.get("/advertisements/{ad_id}")
async def get_advertisement(ad_id: str):
    """Get a single advertisement"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    if isinstance(ad.get('created_at'), str):
        ad['created_at'] = datetime.fromisoformat(ad['created_at'])
    
    return ad


@router.post("/advertisements")
async def create_advertisement(ad_data: dict):
    """Create a new advertisement (Admin)"""
    if 'id' not in ad_data:
        ad_data['id'] = str(uuid.uuid4())
    
    ad_data['created_at'] = datetime.now(timezone.utc).isoformat()
    ad_data['impressions'] = 0
    ad_data['clicks'] = 0
    ad_data['conversions'] = 0
    ad_data['spent_today'] = 0.0
    ad_data['total_spent'] = 0.0
    
    await db.advertisements.insert_one(ad_data)
    ad_data.pop('_id', None)
    return ad_data


@router.put("/advertisements/{ad_id}")
async def update_advertisement(ad_id: str, ad_data: dict):
    """Update an advertisement (Admin)"""
    existing = await db.advertisements.find_one({"id": ad_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    ad_data.pop('id', None)
    ad_data.pop('_id', None)
    ad_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.advertisements.update_one({"id": ad_id}, {"$set": ad_data})
    
    updated = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    return updated


@router.delete("/advertisements/{ad_id}")
async def delete_advertisement(ad_id: str):
    """Delete an advertisement (Admin)"""
    result = await db.advertisements.delete_one({"id": ad_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return {"success": True}


@router.post("/advertisements/reset-daily-budgets")
async def reset_daily_budgets():
    """Reset daily budget spent for all ads (Scheduled task)"""
    result = await db.advertisements.update_many(
        {},
        {"$set": {"spent_today": 0.0}}
    )
    return {"reset_count": result.modified_count}


# ============================================
# Analytics Endpoints
# ============================================

@router.get("/advertisements/reports/stats")
async def get_advertisement_stats():
    """Get overall advertisement statistics"""
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_ads": {"$sum": 1},
                "active_ads": {"$sum": {"$cond": ["$is_active", 1, 0]}},
                "total_impressions": {"$sum": "$impressions"},
                "total_clicks": {"$sum": "$clicks"},
                "total_conversions": {"$sum": "$conversions"},
                "total_spent": {"$sum": "$total_spent"}
            }
        }
    ]
    
    result = await db.advertisements.aggregate(pipeline).to_list(1)
    
    if not result:
        return {
            "total_ads": 0,
            "active_ads": 0,
            "total_impressions": 0,
            "total_clicks": 0,
            "total_conversions": 0,
            "total_spent": 0,
            "avg_ctr": 0
        }
    
    stats = result[0]
    stats.pop('_id', None)
    
    if stats['total_impressions'] > 0:
        stats['avg_ctr'] = round((stats['total_clicks'] / stats['total_impressions']) * 100, 2)
    else:
        stats['avg_ctr'] = 0
    
    return stats


@router.get("/advertisements/analytics/summary")
async def get_ads_analytics_summary():
    """Get advertisement analytics summary"""
    pipeline = [
        {
            "$group": {
                "_id": "$ad_type",
                "count": {"$sum": 1},
                "impressions": {"$sum": "$impressions"},
                "clicks": {"$sum": "$clicks"},
                "spent": {"$sum": "$total_spent"}
            }
        }
    ]
    
    by_type = await db.advertisements.aggregate(pipeline).to_list(20)
    
    # Get placement breakdown
    placement_pipeline = [
        {
            "$group": {
                "_id": "$placement",
                "count": {"$sum": 1},
                "impressions": {"$sum": "$impressions"},
                "clicks": {"$sum": "$clicks"}
            }
        }
    ]
    
    by_placement = await db.advertisements.aggregate(placement_pipeline).to_list(20)
    
    return {
        "by_type": by_type,
        "by_placement": by_placement
    }


@router.get("/advertisements/analytics/{ad_id}")
async def get_ad_analytics(ad_id: str):
    """Get analytics for a specific advertisement"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    impressions = ad.get('impressions', 0)
    clicks = ad.get('clicks', 0)
    conversions = ad.get('conversions', 0)
    
    return {
        "ad_id": ad_id,
        "name": ad.get('name'),
        "impressions": impressions,
        "clicks": clicks,
        "conversions": conversions,
        "ctr": round((clicks / impressions * 100), 2) if impressions > 0 else 0,
        "conversion_rate": round((conversions / clicks * 100), 2) if clicks > 0 else 0,
        "total_spent": ad.get('total_spent', 0),
        "spent_today": ad.get('spent_today', 0)
    }
