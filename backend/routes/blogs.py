"""Blog routes"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid

from core.database import db
from core.auth import get_current_user

blogs_router = APIRouter(prefix="/blogs", tags=["Blogs"])

# ============================================
# Models
# ============================================

class Blog(BaseModel):
    model_config = ConfigDict(extra="allow")  # Allow extra fields
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    author_image: Optional[str] = None
    featured_image: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []
    views: int = 0
    likes: int = 0
    is_featured: bool = False
    status: str = "draft"  # draft, pending, published
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: Optional[str] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[str] = None
    updated_by_name: Optional[str] = None

class BlogListingPageSettings(BaseModel):
    model_config = ConfigDict(extra="allow")  # Allow extra fields
    id: str = "blog-listing-page"
    hero_title: str = "Our Blog"
    hero_subtitle: str = "Insights, tips and guides for students and parents"
    stats: List[dict] = []
    categories: List[dict] = []
    show_popular_posts: bool = True
    popular_posts_title: str = "Popular Posts"
    popular_posts_count: int = 5
    show_categories_sidebar: bool = True
    categories_sidebar_title: str = "Categories"
    show_tags_cloud: bool = True
    tags_cloud_title: str = "Popular Tags"
    popular_tags: List[str] = []
    show_newsletter: bool = True
    newsletter_title: str = "Subscribe to our Blog"
    newsletter_subtitle: str = "Get the latest articles delivered to your inbox"
    newsletter_button_text: str = "Subscribe"
    meta_title: str = "Blog | Education Insights & Tips"
    meta_description: str = "Read our blog for career guidance, study tips, and more."
    meta_keywords: List[str] = []
    intro_content: Optional[str] = None
    bottom_content: Optional[str] = None
    faqs: List[dict] = []
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

# ============================================
# Blog CRUD Routes
# ============================================

@blogs_router.get("")
async def get_blogs(category: Optional[str] = None, featured: Optional[bool] = None, limit: int = 20):
    """Get all blogs with optional filters"""
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured
    
    blogs = await db.blogs.find(query, {"_id": 0}).sort("published_at", -1).limit(limit).to_list(limit)
    return blogs

@blogs_router.get("/{blog_id}")
async def get_blog(blog_id: str):
    """Get a single blog by ID or slug"""
    blog = await db.blogs.find_one({"$or": [{"id": blog_id}, {"slug": blog_id}]}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Increment views
    await db.blogs.update_one({"id": blog.get("id", blog_id)}, {"$inc": {"views": 1}})
    return blog

@blogs_router.post("", response_model=Blog)
async def create_blog(blog: Blog):
    """Create a new blog"""
    blog_dict = blog.model_dump()
    blog_dict["published_at"] = blog_dict["published_at"].isoformat() if isinstance(blog_dict["published_at"], datetime) else blog_dict["published_at"]
    blog_dict["created_at"] = blog_dict["created_at"].isoformat() if isinstance(blog_dict["created_at"], datetime) else blog_dict["created_at"]
    await db.blogs.insert_one(blog_dict)
    return blog

@blogs_router.put("/{blog_id}")
async def update_blog(blog_id: str, blog: Blog):
    """Update a blog"""
    blog_dict = blog.model_dump()
    blog_dict["published_at"] = blog_dict["published_at"].isoformat() if isinstance(blog_dict["published_at"], datetime) else blog_dict["published_at"]
    blog_dict["created_at"] = blog_dict["created_at"].isoformat() if isinstance(blog_dict["created_at"], datetime) else blog_dict["created_at"]
    await db.blogs.update_one({"id": blog_id}, {"$set": blog_dict})
    return {"message": "Blog updated successfully"}

@blogs_router.delete("/{blog_id}")
async def delete_blog(blog_id: str):
    """Delete a blog"""
    await db.blogs.delete_one({"id": blog_id})
    return {"message": "Blog deleted successfully"}

# ============================================
# Blog Listing Page Settings Routes
# ============================================

@blogs_router.get("-listing-settings")
async def get_blog_listing_settings():
    """Get blog listing page settings"""
    settings = await db.blog_listing_settings.find_one({"id": "blog-listing-page"}, {"_id": 0})
    if not settings:
        default_settings = BlogListingPageSettings()
        return default_settings.model_dump()
    return settings

@blogs_router.put("-listing-settings")
async def update_blog_listing_settings(settings: BlogListingPageSettings, current_user: dict = Depends(get_current_user)):
    """Update blog listing page settings"""
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = current_user.get("id")
    
    await db.blog_listing_settings.update_one(
        {"id": "blog-listing-page"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict
