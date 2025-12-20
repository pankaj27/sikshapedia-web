"""
Advertisements API - Advanced advertising system with tracking, analytics, and budget management
Extracted from server.py for modularity
"""
from fastapi import APIRouter, HTTPException, Query, Request, Depends
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Advertisements"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database


# ============================================
# Models
# ============================================

class Advertisement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Basic Info
    name: str  # Ad campaign name
    title: Optional[str] = None  # Display title
    description: Optional[str] = None
    
    # Ad Content
    ad_type: str  # banner, popup, sidebar, floating
    image_url: str  # Ad image
    link_url: str  # Redirect URL when clicked
    open_in_new_tab: bool = True
    
    # Placement
    pages: List[str] = []  # Page names where ad should show: home, colleges, college-detail, etc.
    position: str = "top"  # top, bottom, sidebar, popup
    section_type: Optional[str] = None  # For advanced placement matching
    target_urls: List[str] = []  # Specific URLs to target
    
    # Scheduling
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    start_time: str = "00:00"  # Time window start
    end_time: str = "23:59"  # Time window end
    days_of_week: List[int] = [0, 1, 2, 3, 4, 5, 6]  # 0=Monday, 6=Sunday
    is_active: bool = True  # Manual active/inactive toggle
    is_paused: bool = False
    is_budget_exhausted: bool = False
    status: str = "active"  # active, paused, completed
    
    # Priority & Display
    priority: int = 0  # Higher priority ads show first
    serial_order: int = 0  # For ordering within same priority
    max_impressions_per_user: Optional[int] = None  # Limit impressions per user
    
    # Budget & Bidding
    budget: Dict[str, Any] = Field(default_factory=lambda: {
        "total_budget": 0,
        "daily_budget": 0,
        "spent_total": 0,
        "spent_today": 0,
        "cost_per_click": 0,
        "cost_per_impression": 0,
        "last_reset_date": None
    })
    
    # Rotation settings
    rotation: Dict[str, Any] = Field(default_factory=lambda: {
        "enabled": False,
        "max_impressions": 0,
        "max_clicks": 0
    })
    
    # Analytics/Stats
    stats: Dict[str, Any] = Field(default_factory=lambda: {
        "impressions": 0,
        "clicks": 0,
        "last_impression": None,
        "last_click": None,
        "impressions_by_date": {},
        "clicks_by_date": {}
    })
    
    # Legacy fields for backward compatibility
    impressions: int = 0
    clicks: int = 0
    
    # Metadata
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ============================================
# Admin CRUD Endpoints
# ============================================

@router.get("/advertisements")
async def get_advertisements(
    status: str = Query(None),
    ad_type: str = Query(None),
    target_url: str = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Get all advertisements with optional filters"""
    query = {}
    if status:
        query["status"] = status
    if ad_type:
        query["ad_type"] = ad_type
    
    ads = await db.advertisements.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return ads


@router.get("/advertisements/{ad_id}")
async def get_advertisement(ad_id: str):
    """Get single advertisement by ID"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return ad


@router.post("/advertisements")
async def create_advertisement(ad_data: dict):
    """Create a new advertisement"""
    if 'id' not in ad_data:
        ad_data['id'] = str(uuid.uuid4())
    
    ad_data['created_at'] = datetime.now(timezone.utc).isoformat()
    ad_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Initialize stats if not present
    if 'stats' not in ad_data:
        ad_data['stats'] = {
            "impressions": 0,
            "clicks": 0,
            "last_impression": None,
            "last_click": None,
            "impressions_by_date": {},
            "clicks_by_date": {}
        }
    
    # Initialize budget if not present
    if 'budget' not in ad_data:
        ad_data['budget'] = {
            "total_budget": 0,
            "daily_budget": 0,
            "spent_total": 0,
            "spent_today": 0,
            "cost_per_click": 0,
            "cost_per_impression": 0,
            "last_reset_date": None
        }
    
    await db.advertisements.insert_one(ad_data)
    ad_data.pop('_id', None)
    return {"success": True, "id": ad_data['id'], "message": "Advertisement created successfully"}


@router.put("/advertisements/{ad_id}")
async def update_advertisement(ad_id: str, ad_data: dict):
    """Update an advertisement"""
    existing = await db.advertisements.find_one({"id": ad_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    ad_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    ad_data.pop('id', None)
    ad_data.pop('_id', None)
    
    await db.advertisements.update_one({"id": ad_id}, {"$set": ad_data})
    return {"success": True, "message": "Advertisement updated successfully"}


@router.delete("/advertisements/{ad_id}")
async def delete_advertisement(ad_id: str):
    """Delete an advertisement"""
    result = await db.advertisements.delete_one({"id": ad_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return {"success": True, "message": "Advertisement deleted successfully"}


# ============================================
# Ad Tracking Endpoints
# ============================================

@router.post("/advertisements/{ad_id}/track")
async def track_ad_event(ad_id: str, request: Request, event_type: str = Query("impression")):
    """Track ad impression or click with detailed analytics"""
    ad = await db.advertisements.find_one({"id": ad_id})
    if not ad:
        return {"success": False, "error": "Ad not found"}
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Create tracking event
    event = {
        "id": str(uuid.uuid4()),
        "ad_id": ad_id,
        "event_type": event_type,
        "url": request.headers.get("referer", ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent", ""),
    }
    await db.ad_tracking_events.insert_one(event)
    
    # Update ad stats
    stats_update = {}
    if event_type == "impression":
        stats_update = {
            "$inc": {"stats.impressions": 1, "impressions": 1},
            "$set": {"stats.last_impression": datetime.now(timezone.utc).isoformat()}
        }
    elif event_type == "click":
        stats_update = {
            "$inc": {"stats.clicks": 1, "clicks": 1},
            "$set": {"stats.last_click": datetime.now(timezone.utc).isoformat()}
        }
    
    if stats_update:
        await db.advertisements.update_one({"id": ad_id}, stats_update)
        
        # Update daily stats
        await db.advertisements.update_one(
            {"id": ad_id},
            {"$inc": {f"stats.{event_type}s_by_date.{today}": 1}}
        )
        
        # Update budget spent if CPC/CPM model
        if event_type == "click" and ad.get("budget", {}).get("cost_per_click", 0) > 0:
            cpc = ad["budget"]["cost_per_click"]
            await db.advertisements.update_one(
                {"id": ad_id},
                {"$inc": {"budget.spent_total": cpc, "budget.spent_today": cpc}}
            )
        elif event_type == "impression" and ad.get("budget", {}).get("cost_per_impression", 0) > 0:
            cpm = ad["budget"]["cost_per_impression"] / 1000  # CPM is per 1000 impressions
            await db.advertisements.update_one(
                {"id": ad_id},
                {"$inc": {"budget.spent_total": cpm, "budget.spent_today": cpm}}
            )
    
    return {"success": True}


# ============================================
# Ad Serving Endpoints (Public)
# ============================================

@router.get("/advertisements/serve/{placement}")
async def serve_ads(
    placement: str,
    url: str = Query(""),
    limit: int = Query(5, ge=1, le=20),
    ad_type: str = Query(None)
):
    """Serve ads for a specific placement with rotation and budget checks"""
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M")
    day_of_week = now.weekday()
    
    # Build query for active, non-exhausted ads
    query = {
        "is_active": True,
        "is_paused": False,
        "is_budget_exhausted": False,
        "start_date": {"$lte": today},
        "end_date": {"$gte": today},
        "$or": [
            {"target_urls": {"$size": 0}},  # No specific URLs = show everywhere
            {"target_urls": url},  # Exact URL match
            {"section_type": placement}  # Placement match
        ]
    }
    
    if ad_type:
        query["ad_type"] = ad_type
    
    # Get matching ads sorted by priority and rotation
    ads = await db.advertisements.find(query, {"_id": 0}).sort([
        ("priority", -1),
        ("serial_order", 1),
        ("stats.impressions", 1)  # Show less-viewed ads first for rotation
    ]).to_list(limit * 2)  # Get more than needed for filtering
    
    # Filter by time and day of week
    filtered_ads = []
    for ad in ads:
        # Check time window
        start_time = ad.get("start_time", "00:00")
        end_time = ad.get("end_time", "23:59")
        if not (start_time <= current_time <= end_time):
            continue
        
        # Check day of week
        allowed_days = ad.get("days_of_week", [0, 1, 2, 3, 4, 5, 6])
        if day_of_week not in allowed_days:
            continue
        
        # Check budget
        budget = ad.get("budget", {})
        if budget.get("total_budget", 0) > 0:
            if budget.get("spent_total", 0) >= budget.get("total_budget", 0):
                # Mark as exhausted
                await db.advertisements.update_one(
                    {"id": ad["id"]},
                    {"$set": {"is_budget_exhausted": True, "status": "completed"}}
                )
                continue
        
        if budget.get("daily_budget", 0) > 0:
            if budget.get("spent_today", 0) >= budget.get("daily_budget", 0):
                continue  # Skip today, will reset tomorrow
        
        # Check rotation limits
        rotation = ad.get("rotation", {})
        if rotation.get("enabled", False):
            if rotation.get("max_impressions", 0) > 0:
                if ad.get("stats", {}).get("impressions", 0) >= rotation.get("max_impressions", 0):
                    continue
            if rotation.get("max_clicks", 0) > 0:
                if ad.get("stats", {}).get("clicks", 0) >= rotation.get("max_clicks", 0):
                    continue
        
        filtered_ads.append(ad)
        if len(filtered_ads) >= limit:
            break
    
    return filtered_ads[:limit]


@router.get("/advertisements/active/{page_name}")
async def get_active_advertisements(page_name: str):
    """Get active advertisements for a specific page (Public/Legacy)"""
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


# ============================================
# Analytics Endpoints
# ============================================

@router.get("/advertisements/analytics/summary")
async def get_ads_analytics_summary():
    """Get overall advertising analytics summary"""
    # Get all ads
    ads = await db.advertisements.find({}, {"_id": 0}).to_list(1000)
    
    total_impressions = sum(ad.get("stats", {}).get("impressions", 0) or ad.get("impressions", 0) for ad in ads)
    total_clicks = sum(ad.get("stats", {}).get("clicks", 0) or ad.get("clicks", 0) for ad in ads)
    total_spent = sum(ad.get("budget", {}).get("spent_total", 0) for ad in ads)
    
    active_ads = len([ad for ad in ads if ad.get("is_active") and not ad.get("is_paused")])
    paused_ads = len([ad for ad in ads if ad.get("is_paused")])
    completed_ads = len([ad for ad in ads if ad.get("status") == "completed"])
    
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    
    # Get today's stats
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_impressions = sum(ad.get("stats", {}).get("impressions_by_date", {}).get(today, 0) for ad in ads)
    today_clicks = sum(ad.get("stats", {}).get("clicks_by_date", {}).get(today, 0) for ad in ads)
    
    # Get last 7 days data
    last_7_days = []
    for i in range(7):
        date = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        day_impressions = sum(ad.get("stats", {}).get("impressions_by_date", {}).get(date, 0) for ad in ads)
        day_clicks = sum(ad.get("stats", {}).get("clicks_by_date", {}).get(date, 0) for ad in ads)
        last_7_days.append({
            "date": date,
            "impressions": day_impressions,
            "clicks": day_clicks
        })
    
    # Top performing ads
    top_ads = sorted(ads, key=lambda x: x.get("stats", {}).get("clicks", 0) or x.get("clicks", 0), reverse=True)[:5]
    
    return {
        "summary": {
            "total_ads": len(ads),
            "active_ads": active_ads,
            "paused_ads": paused_ads,
            "completed_ads": completed_ads,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_spent": total_spent,
            "avg_ctr": round(avg_ctr, 2)
        },
        "today": {
            "impressions": today_impressions,
            "clicks": today_clicks
        },
        "last_7_days": list(reversed(last_7_days)),
        "top_ads": [{
            "id": ad.get("id"),
            "name": ad.get("name"),
            "ad_type": ad.get("ad_type"),
            "impressions": ad.get("stats", {}).get("impressions", 0) or ad.get("impressions", 0),
            "clicks": ad.get("stats", {}).get("clicks", 0) or ad.get("clicks", 0),
            "ctr": round((
                (ad.get("stats", {}).get("clicks", 0) or ad.get("clicks", 0)) / 
                max(ad.get("stats", {}).get("impressions", 0) or ad.get("impressions", 0), 1)
            ) * 100, 2)
        } for ad in top_ads]
    }


@router.get("/advertisements/analytics/{ad_id}")
async def get_ad_analytics(ad_id: str):
    """Get detailed analytics for a specific ad"""
    ad = await db.advertisements.find_one({"id": ad_id}, {"_id": 0})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    
    # Get tracking events for this ad
    events = await db.ad_tracking_events.find({"ad_id": ad_id}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    
    # Group by date
    impressions_by_date = {}
    clicks_by_date = {}
    for event in events:
        date = event.get("timestamp", "")[:10]
        if event.get("event_type") == "impression":
            impressions_by_date[date] = impressions_by_date.get(date, 0) + 1
        elif event.get("event_type") == "click":
            clicks_by_date[date] = clicks_by_date.get(date, 0) + 1
    
    # Group by URL
    impressions_by_url = {}
    clicks_by_url = {}
    for event in events:
        url = event.get("url", "unknown")
        if event.get("event_type") == "impression":
            impressions_by_url[url] = impressions_by_url.get(url, 0) + 1
        elif event.get("event_type") == "click":
            clicks_by_url[url] = clicks_by_url.get(url, 0) + 1
    
    return {
        "ad": ad,
        "analytics": {
            "impressions_by_date": impressions_by_date,
            "clicks_by_date": clicks_by_date,
            "impressions_by_url": impressions_by_url,
            "clicks_by_url": clicks_by_url,
            "total_events": len(events)
        }
    }


# ============================================
# Budget Management
# ============================================

@router.post("/advertisements/reset-daily-budgets")
async def reset_daily_budgets():
    """Reset daily budget spent - should be called by a cron job at midnight"""
    result = await db.advertisements.update_many(
        {},
        {"$set": {"budget.spent_today": 0, "budget.last_reset_date": datetime.now(timezone.utc).strftime("%Y-%m-%d")}}
    )
    return {"success": True, "updated": result.modified_count}


# ============================================
# Reports
# ============================================

@router.get("/advertisements/reports/performance")
async def get_performance_report(
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    """Get performance report for all advertisements"""
    ads = await db.advertisements.find({}, {"_id": 0}).to_list(1000)
    
    report_data = []
    for ad in ads:
        impressions = ad.get("stats", {}).get("impressions", 0) or ad.get("impressions", 0)
        clicks = ad.get("stats", {}).get("clicks", 0) or ad.get("clicks", 0)
        
        report_data.append({
            "id": ad.get("id"),
            "name": ad.get("name"),
            "ad_type": ad.get("ad_type"),
            "status": ad.get("status", "active"),
            "impressions": impressions,
            "clicks": clicks,
            "ctr": round((clicks / max(impressions, 1)) * 100, 2),
            "spent": ad.get("budget", {}).get("spent_total", 0),
            "start_date": ad.get("start_date"),
            "end_date": ad.get("end_date")
        })
    
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "advertisements": report_data
    }
