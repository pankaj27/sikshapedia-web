"""News routes"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid

from core.database import db
from core.auth import get_current_user

news_router = APIRouter(prefix="/news", tags=["News"])

# ============================================
# Models
# ============================================

class News(BaseModel):
    model_config = ConfigDict(extra="allow")  # Allow extra fields
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    author_image: Optional[str] = None
    author_designation: Optional[str] = None
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    video: Optional[Dict[str, Any]] = None
    gallery: List[Dict[str, Any]] = []
    toc: List[Dict[str, Any]] = []
    tables: List[Dict[str, Any]] = []
    widgets: Optional[Dict[str, Any]] = None
    seo: Optional[Dict[str, Any]] = None
    tags: List[str] = []
    views: int = 0
    featured: bool = False
    published: bool = True
    status: str = "draft"  # draft, pending, published
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[str] = None
    updated_by_name: Optional[str] = None

class NewsListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="allow")  # Allow extra fields
    id: str = "news-listing-page"
    hero_title: str = "Education News"
    hero_subtitle: str = "Stay updated with the latest education news"
    stats: List[dict] = []
    categories: List[dict] = []
    show_featured: bool = True
    featured_title: str = "Featured News"
    show_trending: bool = True
    trending_title: str = "Trending Now"
    show_newsletter: bool = True
    newsletter_title: str = "Subscribe to News"
    newsletter_subtitle: str = "Get the latest news delivered to your inbox"
    newsletter_button_text: str = "Subscribe"
    meta_title: str = "Education News | Latest Updates"
    meta_description: str = "Stay updated with the latest education news."
    meta_keywords: List[str] = []
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[dict] = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

# ============================================
# News CRUD Routes
# ============================================

@news_router.get("")
async def get_news(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    status: Optional[str] = None,
    limit: int = 20,
    all_status: bool = Query(False, description="Get all news regardless of status")
):
    """Get all news with optional filters"""
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if not all_status:
        if status:
            query["published"] = status == "published"
        else:
            query["published"] = True
    
    news = await db.news.find(query, {"_id": 0}).sort("published_at", -1).limit(limit).to_list(limit)
    return news

@news_router.get("/{news_id}")
async def get_news_item(news_id: str):
    """Get a single news item by ID or slug"""
    news = await db.news.find_one({"$or": [{"id": news_id}, {"slug": news_id}]}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # Increment views
    await db.news.update_one({"id": news.get("id", news_id)}, {"$inc": {"views": 1}})
    return news

@news_router.post("")
async def create_news(news: News, current_user: dict = Depends(get_current_user)):
    """Create a new news article"""
    news_dict = news.model_dump()
    
    # Check for duplicate by title (case-insensitive)
    news_title = news_dict.get('title', '').strip()
    if news_title:
        existing_news = await db.news.find_one(
            {"title": {"$regex": f"^{news_title}$", "$options": "i"}},
            {"_id": 0, "id": 1, "title": 1}
        )
        if existing_news:
            raise HTTPException(
                status_code=409,
                detail=f"News article with title '{news_title}' already exists (ID: {existing_news.get('id')})"
            )
    
    # Auto-assign author from current user if not provided
    if not news_dict.get("author") or news_dict["author"] == "":
        news_dict["author"] = current_user.get("name", "Admin")
        news_dict["author_image"] = current_user.get("profile_photo")
        news_dict["author_designation"] = current_user.get("job_title")
    
    # Convert datetime to ISO string
    news_dict["published_at"] = news_dict["published_at"].isoformat() if isinstance(news_dict["published_at"], datetime) else news_dict["published_at"]
    news_dict["created_at"] = news_dict["created_at"].isoformat() if isinstance(news_dict["created_at"], datetime) else news_dict["created_at"]
    
    await db.news.insert_one(news_dict)
    return news_dict

@news_router.put("/{news_id}")
async def update_news(news_id: str, news: News):
    """Update a news article"""
    news_dict = news.model_dump()
    news_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    news_dict["published_at"] = news_dict["published_at"].isoformat() if isinstance(news_dict["published_at"], datetime) else news_dict["published_at"]
    news_dict["created_at"] = news_dict["created_at"].isoformat() if isinstance(news_dict["created_at"], datetime) else news_dict["created_at"]
    
    await db.news.update_one({"id": news_id}, {"$set": news_dict})
    return {"message": "News updated successfully"}

@news_router.patch("/{news_id}")
async def patch_news(news_id: str, updates: dict):
    """Partially update a news article"""
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.news.update_one({"id": news_id}, {"$set": updates})
    return {"message": "News updated successfully"}

@news_router.delete("/{news_id}")
async def delete_news(news_id: str):
    """Delete a news article"""
    await db.news.delete_one({"id": news_id})
    return {"message": "News deleted successfully"}

# ============================================
# News Listing Page Settings Routes
# ============================================

@news_router.get("-listing-settings")
async def get_news_listing_settings():
    """Get news listing page settings"""
    settings = await db.news_listing_settings.find_one({"id": "news-listing-page"}, {"_id": 0})
    if not settings:
        default_settings = NewsListingPageSettings()
        return default_settings.model_dump()
    return settings

@news_router.put("-listing-settings")
async def update_news_listing_settings(settings: NewsListingPageSettings, current_user: dict = Depends(get_current_user)):
    """Update news listing page settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.news_listing_settings.update_one(
        {"id": "news-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
