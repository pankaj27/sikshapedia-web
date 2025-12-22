from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime, timezone
from uuid import uuid4
import jwt
import os

router = APIRouter(prefix="/api/advanced-content", tags=["Advanced Content"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Security
security = HTTPBearer()
JWT_SECRET = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Pydantic Models
class LogoBanner(BaseModel):
    logo: Optional[str] = ""
    banner: Optional[str] = ""
    favicon: Optional[str] = ""

class SEOData(BaseModel):
    metaTitle: Optional[str] = ""
    metaDescription: Optional[str] = ""
    metaKeywords: Optional[str] = ""
    ogTitle: Optional[str] = ""
    ogDescription: Optional[str] = ""
    ogImage: Optional[str] = ""
    canonicalUrl: Optional[str] = ""
    noIndex: Optional[bool] = False
    noFollow: Optional[bool] = False
    structuredData: Optional[str] = ""

class ContentBlock(BaseModel):
    id: str
    type: str
    data: Optional[Dict[str, Any]] = {}
    visible: Optional[bool] = True

class SEOContentArea(BaseModel):
    visible: Optional[bool] = True
    blocks: Optional[List[ContentBlock]] = []

class MenuItem(BaseModel):
    id: str
    label: Optional[str] = ""
    anchor: Optional[str] = ""
    metaTitle: Optional[str] = ""
    metaDescription: Optional[str] = ""
    enabled: Optional[bool] = True

class MenuConfig(BaseModel):
    items: Optional[List[MenuItem]] = []
    type: Optional[str] = "tabs"

class TableOfContents(BaseModel):
    autoGenerate: Optional[bool] = True
    items: Optional[List[Dict[str, Any]]] = []

class Widget(BaseModel):
    id: str
    type: str
    label: Optional[str] = ""
    enabled: Optional[bool] = True
    config: Optional[Dict[str, Any]] = {}

class ContentTeam(BaseModel):
    author: Optional[str] = ""
    authorImage: Optional[str] = ""
    authorBio: Optional[str] = ""
    reviewedBy: Optional[str] = ""
    reviewerImage: Optional[str] = ""
    publishDate: Optional[str] = ""
    lastUpdated: Optional[str] = ""

class GalleryImage(BaseModel):
    id: str
    url: Optional[str] = ""
    alt: Optional[str] = ""
    caption: Optional[str] = ""

class AdvancedContentCreate(BaseModel):
    title: Optional[str] = ""
    slug: Optional[str] = ""
    status: Optional[str] = "draft"
    pageType: Optional[str] = "custom"
    logoBanner: Optional[LogoBanner] = None
    contentBlocks: Optional[List[ContentBlock]] = []
    seoContentArea: Optional[SEOContentArea] = None
    menu: Optional[MenuConfig] = None
    tableOfContents: Optional[TableOfContents] = None
    widgets: Optional[List[Widget]] = []
    badges: Optional[List[str]] = []
    contentTeam: Optional[ContentTeam] = None
    gallery: Optional[List[GalleryImage]] = []
    seo: Optional[SEOData] = None

class AdvancedContentResponse(BaseModel):
    id: str
    title: Optional[str] = ""
    slug: Optional[str] = ""
    status: Optional[str] = "draft"
    pageType: Optional[str] = "custom"
    logoBanner: Optional[Dict[str, Any]] = None
    contentBlocks: Optional[List[Dict[str, Any]]] = []
    seoContentArea: Optional[Dict[str, Any]] = None
    menu: Optional[Dict[str, Any]] = None
    tableOfContents: Optional[Dict[str, Any]] = None
    widgets: Optional[List[Dict[str, Any]]] = []
    badges: Optional[List[str]] = []
    contentTeam: Optional[Dict[str, Any]] = None
    gallery: Optional[List[Dict[str, Any]]] = []
    seo: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# Helper function to serialize content
def serialize_content(content: dict) -> dict:
    return {
        "id": content.get("id", ""),
        "title": content.get("title", ""),
        "slug": content.get("slug", ""),
        "status": content.get("status", "draft"),
        "pageType": content.get("pageType", "custom"),
        "logoBanner": content.get("logoBanner"),
        "contentBlocks": content.get("contentBlocks", []),
        "seoContentArea": content.get("seoContentArea"),
        "menu": content.get("menu"),
        "tableOfContents": content.get("tableOfContents"),
        "widgets": content.get("widgets", []),
        "badges": content.get("badges", []),
        "contentTeam": content.get("contentTeam"),
        "gallery": content.get("gallery", []),
        "seo": content.get("seo"),
        "created_at": content.get("created_at"),
        "updated_at": content.get("updated_at")
    }

# Get all advanced content pages
@router.get("", response_model=List[AdvancedContentResponse])
async def get_all_advanced_content(admin = Depends(get_current_admin_user)):
    contents = await db.advanced_content.find({}, {"_id": 0}).to_list(1000)
    return [serialize_content(c) for c in contents]

# Get single advanced content page
@router.get("/{content_id}", response_model=AdvancedContentResponse)
async def get_advanced_content(content_id: str, admin = Depends(get_current_admin_user)):
    content = await db.advanced_content.find_one({"id": content_id}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return serialize_content(content)

# Create new advanced content page
@router.post("", response_model=AdvancedContentResponse)
async def create_advanced_content(data: AdvancedContentCreate, admin = Depends(get_current_admin_user)):
    content_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    content_data = {
        "id": content_id,
        "title": data.title,
        "slug": data.slug or content_id[:8],
        "status": data.status,
        "pageType": data.pageType,
        "logoBanner": data.logoBanner.model_dump() if data.logoBanner else {},
        "contentBlocks": [b.model_dump() for b in data.contentBlocks] if data.contentBlocks else [],
        "seoContentArea": data.seoContentArea.model_dump() if data.seoContentArea else {"visible": True, "blocks": []},
        "menu": data.menu.model_dump() if data.menu else {"items": [], "type": "tabs"},
        "tableOfContents": data.tableOfContents.model_dump() if data.tableOfContents else {"autoGenerate": True, "items": []},
        "widgets": [w.model_dump() for w in data.widgets] if data.widgets else [],
        "badges": data.badges or [],
        "contentTeam": data.contentTeam.model_dump() if data.contentTeam else {},
        "gallery": [g.model_dump() for g in data.gallery] if data.gallery else [],
        "seo": data.seo.model_dump() if data.seo else {},
        "created_at": now,
        "updated_at": now,
        "created_by": admin.get("email", "admin")
    }
    
    await db.advanced_content.insert_one(content_data)
    
    return serialize_content(content_data)

# Update advanced content page
@router.put("/{content_id}", response_model=AdvancedContentResponse)
async def update_advanced_content(content_id: str, data: AdvancedContentCreate, admin = Depends(get_current_admin_user)):
    existing = await db.advanced_content.find_one({"id": content_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Content not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    update_data = {
        "title": data.title,
        "slug": data.slug,
        "status": data.status,
        "pageType": data.pageType,
        "logoBanner": data.logoBanner.model_dump() if data.logoBanner else {},
        "contentBlocks": [b.model_dump() for b in data.contentBlocks] if data.contentBlocks else [],
        "seoContentArea": data.seoContentArea.model_dump() if data.seoContentArea else {"visible": True, "blocks": []},
        "menu": data.menu.model_dump() if data.menu else {"items": [], "type": "tabs"},
        "tableOfContents": data.tableOfContents.model_dump() if data.tableOfContents else {"autoGenerate": True, "items": []},
        "widgets": [w.model_dump() for w in data.widgets] if data.widgets else [],
        "badges": data.badges or [],
        "contentTeam": data.contentTeam.model_dump() if data.contentTeam else {},
        "gallery": [g.model_dump() for g in data.gallery] if data.gallery else [],
        "seo": data.seo.model_dump() if data.seo else {},
        "updated_at": now,
        "updated_by": admin.get("email", "admin")
    }
    
    await db.advanced_content.update_one({"id": content_id}, {"$set": update_data})
    
    updated = await db.advanced_content.find_one({"id": content_id}, {"_id": 0})
    return serialize_content(updated)

# Delete advanced content page
@router.delete("/{content_id}")
async def delete_advanced_content(content_id: str, admin = Depends(get_current_admin_user)):
    existing = await db.advanced_content.find_one({"id": content_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Content not found")
    
    await db.advanced_content.delete_one({"id": content_id})
    return {"message": "Content deleted successfully"}

# Get published content by slug (public endpoint)
@router.get("/public/{slug}")
async def get_public_content(slug: str):
    content = await db.advanced_content.find_one(
        {"slug": slug, "status": "published"}, 
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Page not found")
    return serialize_content(content)
