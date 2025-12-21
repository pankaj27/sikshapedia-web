"""
SEO Settings Routes - Sitemap, Robots.txt, Local SEO
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import PlainTextResponse, Response
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
import os

router = APIRouter(prefix="/seo", tags=["SEO Settings"])

# Database reference
_db = None

def set_database(database):
    global _db
    _db = database

async def get_db():
    if _db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return _db

# ============ MODELS ============

class RobotsSettings(BaseModel):
    content: str
    allow_all: bool = True
    disallow_paths: List[str] = []
    custom_rules: Optional[str] = None

class LocalSEOSettings(BaseModel):
    business_name: str
    business_type: str = "EducationalOrganization"
    description: str
    url: str
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: dict = {}
    social_profiles: List[str] = []
    opening_hours: Optional[str] = None
    geo_coordinates: dict = {}
    service_areas: List[str] = []

class SitemapSettings(BaseModel):
    include_colleges: bool = True
    include_schools: bool = True
    include_courses: bool = True
    include_exams: bool = True
    include_blogs: bool = True
    include_news: bool = True
    include_scholarships: bool = True
    include_study_abroad: bool = True
    include_static_pages: bool = True
    base_url: str = "https://www.admissionbuddy.co"
    change_frequency: str = "weekly"
    priority_homepage: float = 1.0
    priority_listing: float = 0.8
    priority_detail: float = 0.6
    priority_blog: float = 0.5

# ============ ROBOTS.TXT ENDPOINTS ============

@router.get("/robots")
async def get_robots_settings(db=Depends(get_db)):
    """Get robots.txt settings"""
    settings = await db.seo_settings.find_one({"type": "robots"}, {"_id": 0})
    
    if not settings:
        # Return default settings
        return {
            "content": """User-agent: *
Allow: /

# Disallow admin and API paths
Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /register

# Allow search engines to index main content
Allow: /colleges/
Allow: /schools/
Allow: /courses/
Allow: /exams/
Allow: /blogs/
Allow: /news/
Allow: /scholarships/

# Sitemap location
Sitemap: https://www.admissionbuddy.co/sitemap.xml""",
            "allow_all": True,
            "disallow_paths": ["/admin/", "/api/", "/login", "/register"],
            "custom_rules": None
        }
    
    return settings

@router.post("/robots")
async def save_robots_settings(settings: RobotsSettings, db=Depends(get_db)):
    """Save robots.txt settings"""
    data = {
        "type": "robots",
        **settings.dict(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.seo_settings.update_one(
        {"type": "robots"},
        {"$set": data},
        upsert=True
    )
    
    return {"message": "Robots.txt settings saved successfully"}

# ============ SITEMAP ENDPOINTS ============

@router.get("/sitemap/settings")
async def get_sitemap_settings(db=Depends(get_db)):
    """Get sitemap generation settings"""
    settings = await db.seo_settings.find_one({"type": "sitemap"}, {"_id": 0})
    
    if not settings:
        return SitemapSettings().dict()
    
    return settings

@router.post("/sitemap/settings")
async def save_sitemap_settings(settings: SitemapSettings, db=Depends(get_db)):
    """Save sitemap generation settings"""
    data = {
        "type": "sitemap",
        **settings.dict(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.seo_settings.update_one(
        {"type": "sitemap"},
        {"$set": data},
        upsert=True
    )
    
    return {"message": "Sitemap settings saved successfully"}

@router.post("/sitemap/generate")
async def generate_sitemap(db=Depends(get_db)):
    """Generate sitemap.xml"""
    settings = await db.seo_settings.find_one({"type": "sitemap"}, {"_id": 0})
    if not settings:
        settings = SitemapSettings().dict()
    
    base_url = settings.get("base_url", "https://www.admissionbuddy.co")
    change_freq = settings.get("change_frequency", "weekly")
    
    urls = []
    
    # Homepage
    urls.append({
        "loc": base_url,
        "priority": settings.get("priority_homepage", 1.0),
        "changefreq": "daily"
    })
    
    # Static pages
    static_pages = ["/about", "/contact", "/privacy-policy", "/terms-of-service", "/write-review"]
    if settings.get("include_static_pages", True):
        for page in static_pages:
            urls.append({
                "loc": f"{base_url}{page}",
                "priority": 0.5,
                "changefreq": "monthly"
            })
    
    # Listing pages
    listing_pages = [
        ("/colleges", settings.get("include_colleges", True)),
        ("/schools", settings.get("include_schools", True)),
        ("/courses", settings.get("include_courses", True)),
        ("/exams", settings.get("include_exams", True)),
        ("/blogs", settings.get("include_blogs", True)),
        ("/news", settings.get("include_news", True)),
        ("/scholarships", settings.get("include_scholarships", True)),
        ("/study-abroad", settings.get("include_study_abroad", True)),
    ]
    
    for page, include in listing_pages:
        if include:
            urls.append({
                "loc": f"{base_url}{page}",
                "priority": settings.get("priority_listing", 0.8),
                "changefreq": change_freq
            })
    
    # Colleges
    if settings.get("include_colleges", True):
        colleges = await db.colleges.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(10000)
        
        for college in colleges:
            if college.get("slug"):
                urls.append({
                    "loc": f"{base_url}/colleges/{college['slug']}",
                    "priority": settings.get("priority_detail", 0.6),
                    "changefreq": change_freq,
                    "lastmod": college.get("updated_at")
                })
    
    # Schools
    if settings.get("include_schools", True):
        schools = await db.schools.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(10000)
        
        for school in schools:
            if school.get("slug"):
                urls.append({
                    "loc": f"{base_url}/schools/{school['slug']}",
                    "priority": settings.get("priority_detail", 0.6),
                    "changefreq": change_freq,
                    "lastmod": school.get("updated_at")
                })
    
    # Courses
    if settings.get("include_courses", True):
        courses = await db.courses.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(5000)
        
        for course in courses:
            if course.get("slug"):
                urls.append({
                    "loc": f"{base_url}/courses/{course['slug']}",
                    "priority": settings.get("priority_detail", 0.6),
                    "changefreq": change_freq,
                    "lastmod": course.get("updated_at")
                })
    
    # Exams
    if settings.get("include_exams", True):
        exams = await db.exams.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(1000)
        
        for exam in exams:
            if exam.get("slug"):
                urls.append({
                    "loc": f"{base_url}/exams/{exam['slug']}",
                    "priority": settings.get("priority_detail", 0.6),
                    "changefreq": change_freq,
                    "lastmod": exam.get("updated_at")
                })
    
    # Blogs
    if settings.get("include_blogs", True):
        blogs = await db.blogs.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(5000)
        
        for blog in blogs:
            if blog.get("slug"):
                urls.append({
                    "loc": f"{base_url}/blogs/{blog['slug']}",
                    "priority": settings.get("priority_blog", 0.5),
                    "changefreq": "monthly",
                    "lastmod": blog.get("updated_at")
                })
    
    # News
    if settings.get("include_news", True):
        news = await db.news.find(
            {"status": {"$in": ["published", "approved", None]}},
            {"_id": 0, "slug": 1, "updated_at": 1}
        ).to_list(5000)
        
        for item in news:
            if item.get("slug"):
                urls.append({
                    "loc": f"{base_url}/news/{item['slug']}",
                    "priority": settings.get("priority_blog", 0.5),
                    "changefreq": "daily",
                    "lastmod": item.get("updated_at")
                })
    
    # Generate XML
    xml_content = generate_sitemap_xml(urls)
    
    # Save to database
    await db.seo_settings.update_one(
        {"type": "sitemap_content"},
        {"$set": {
            "type": "sitemap_content",
            "content": xml_content,
            "url_count": len(urls),
            "generated_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    return {
        "message": "Sitemap generated successfully",
        "url_count": len(urls),
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

def generate_sitemap_xml(urls: List[dict]) -> str:
    """Generate sitemap XML content"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{url["loc"]}</loc>\n'
        if url.get("lastmod"):
            # Format date properly
            lastmod = url["lastmod"]
            if isinstance(lastmod, str):
                xml += f'    <lastmod>{lastmod[:10]}</lastmod>\n'
        xml += f'    <changefreq>{url.get("changefreq", "weekly")}</changefreq>\n'
        xml += f'    <priority>{url.get("priority", 0.5)}</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml

@router.get("/sitemap/preview")
async def preview_sitemap(db=Depends(get_db)):
    """Preview generated sitemap"""
    sitemap = await db.seo_settings.find_one({"type": "sitemap_content"}, {"_id": 0})
    
    if not sitemap:
        return {"content": None, "url_count": 0, "generated_at": None}
    
    return sitemap

@router.get("/sitemap/stats")
async def get_sitemap_stats(db=Depends(get_db)):
    """Get counts for sitemap generation"""
    stats = {
        "colleges": await db.colleges.count_documents({"status": {"$in": ["published", "approved", None]}}),
        "schools": await db.schools.count_documents({"status": {"$in": ["published", "approved", None]}}),
        "courses": await db.courses.count_documents({"status": {"$in": ["published", "approved", None]}}),
        "exams": await db.exams.count_documents({"status": {"$in": ["published", "approved", None]}}),
        "blogs": await db.blogs.count_documents({"status": {"$in": ["published", "approved", None]}}),
        "news": await db.news.count_documents({"status": {"$in": ["published", "approved", None]}}),
    }
    
    return stats

# ============ LOCAL SEO ENDPOINTS ============

@router.get("/local")
async def get_local_seo_settings(db=Depends(get_db)):
    """Get local SEO settings"""
    settings = await db.seo_settings.find_one({"type": "local_seo"}, {"_id": 0})
    
    if not settings:
        return {
            "business_name": "AdmissionBuddy",
            "business_type": "EducationalOrganization",
            "description": "India's trusted education platform helping students find the right colleges, courses, and career paths.",
            "url": "https://www.admissionbuddy.co",
            "logo_url": "https://www.admissionbuddy.co/logo.png",
            "phone": "",
            "email": "info@admissionbuddy.co",
            "address": {
                "street": "",
                "city": "New Delhi",
                "state": "Delhi",
                "postal_code": "",
                "country": "India"
            },
            "social_profiles": [
                "https://facebook.com/admissionbuddy",
                "https://twitter.com/admissionbuddy",
                "https://instagram.com/admissionbuddy",
                "https://linkedin.com/company/admissionbuddy"
            ],
            "opening_hours": "Mo-Sa 09:00-18:00",
            "geo_coordinates": {
                "latitude": 28.6139,
                "longitude": 77.2090
            },
            "service_areas": ["India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
        }
    
    return settings

@router.post("/local")
async def save_local_seo_settings(settings: LocalSEOSettings, db=Depends(get_db)):
    """Save local SEO settings"""
    data = {
        "type": "local_seo",
        **settings.dict(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.seo_settings.update_one(
        {"type": "local_seo"},
        {"$set": data},
        upsert=True
    )
    
    return {"message": "Local SEO settings saved successfully"}

@router.get("/local/schema")
async def get_local_business_schema(db=Depends(get_db)):
    """Generate JSON-LD schema for local business"""
    settings = await db.seo_settings.find_one({"type": "local_seo"}, {"_id": 0})
    
    if not settings:
        settings = (await get_local_seo_settings(db))
    
    schema = {
        "@context": "https://schema.org",
        "@type": settings.get("business_type", "EducationalOrganization"),
        "name": settings.get("business_name", "AdmissionBuddy"),
        "description": settings.get("description", ""),
        "url": settings.get("url", ""),
        "logo": settings.get("logo_url", ""),
        "telephone": settings.get("phone", ""),
        "email": settings.get("email", ""),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": settings.get("address", {}).get("street", ""),
            "addressLocality": settings.get("address", {}).get("city", ""),
            "addressRegion": settings.get("address", {}).get("state", ""),
            "postalCode": settings.get("address", {}).get("postal_code", ""),
            "addressCountry": settings.get("address", {}).get("country", "India")
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": settings.get("geo_coordinates", {}).get("latitude", 0),
            "longitude": settings.get("geo_coordinates", {}).get("longitude", 0)
        },
        "sameAs": settings.get("social_profiles", []),
        "openingHours": settings.get("opening_hours", ""),
        "areaServed": settings.get("service_areas", [])
    }
    
    return schema

# ============ PUBLIC ENDPOINTS FOR SERVING FILES ============

@router.get("/robots.txt", response_class=PlainTextResponse)
async def serve_robots_txt(db=Depends(get_db)):
    """Serve robots.txt file"""
    settings = await db.seo_settings.find_one({"type": "robots"}, {"_id": 0})
    
    if settings and settings.get("content"):
        return settings["content"]
    
    # Default robots.txt
    return """User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /register

Sitemap: https://www.admissionbuddy.co/sitemap.xml"""

@router.get("/sitemap.xml", response_class=Response)
async def serve_sitemap_xml(db=Depends(get_db)):
    """Serve sitemap.xml file"""
    sitemap = await db.seo_settings.find_one({"type": "sitemap_content"}, {"_id": 0})
    
    if sitemap and sitemap.get("content"):
        return Response(content=sitemap["content"], media_type="application/xml")
    
    # Return empty sitemap if not generated
    empty_sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    return Response(content=empty_sitemap, media_type="application/xml")
