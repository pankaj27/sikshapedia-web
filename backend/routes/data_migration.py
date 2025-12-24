"""
Data Migration API - Export and Import database data
For transferring data from preview/development to production deployment
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from bson import ObjectId
import json
import io
import jwt
import os

router = APIRouter(prefix="/api", tags=["Data Migration"])
security = HTTPBearer()

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

# Collections to export/import (in order of dependencies)
EXPORTABLE_COLLECTIONS = [
    "admins",
    "users",
    "states",
    "cities",
    "streams",
    "sub_streams",
    "boards",
    "accreditations",
    "accreditation_levels",
    "affiliations",
    "recognitions",
    "facilities",
    "rank_categories",
    "rankings",
    "courses",
    "courses_detailed",
    "exams",
    "exams_detailed",
    "colleges",
    "schools",
    "universities",
    "listing_pages",
    "advertisements",
    "homepage_settings",
    "seo_settings",
    "email_settings",
    "email_templates",
    "lead_settings",
    "admission_settings",
    "write_review_settings",
    "year_settings",
    "course_listing_settings",
    "course_page_settings",
    "exam_listing_settings",
    "news_listing_settings",
    "sponsored_ads_multi",
    "counselors",
    "scholarships",
    "loans",
    "study_abroad",
    "study_materials",
    "articles",
    "blogs",
    "news",
]

def json_serializer(obj):
    """Custom JSON serializer for MongoDB types"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, bytes):
        return obj.decode('utf-8', errors='ignore')
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


async def verify_admin(credentials: HTTPAuthorizationCredentials):
    """Verify admin token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role", "")
        if role not in ["admin", "super_admin", "Super Admin"]:
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/data-migration/export")
async def export_all_data(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Export all database data as JSON
    Returns a downloadable JSON file with all collections
    """
    await verify_admin(credentials)
    
    export_data = {
        "export_date": datetime.now(timezone.utc).isoformat(),
        "version": "1.0",
        "collections": {}
    }
    
    for collection_name in EXPORTABLE_COLLECTIONS:
        try:
            collection = db[collection_name]
            documents = await collection.find({}, {"_id": 0}).to_list(length=None)
            export_data["collections"][collection_name] = {
                "count": len(documents),
                "data": documents
            }
        except Exception as e:
            export_data["collections"][collection_name] = {
                "count": 0,
                "data": [],
                "error": str(e)
            }
    
    # Create JSON string
    json_str = json.dumps(export_data, default=json_serializer, indent=2)
    
    # Return as downloadable file
    return StreamingResponse(
        io.BytesIO(json_str.encode('utf-8')),
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=sikshapedia_data_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        }
    )


@router.get("/data-migration/export-summary")
async def export_summary(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get summary of data that will be exported
    """
    await verify_admin(credentials)
    
    summary = {
        "collections": [],
        "total_documents": 0
    }
    
    for collection_name in EXPORTABLE_COLLECTIONS:
        try:
            collection = db[collection_name]
            count = await collection.count_documents({})
            summary["collections"].append({
                "name": collection_name,
                "count": count
            })
            summary["total_documents"] += count
        except Exception as e:
            summary["collections"].append({
                "name": collection_name,
                "count": 0,
                "error": str(e)
            })
    
    return summary


@router.post("/data-migration/import")
async def import_all_data(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Import database data from JSON file
    WARNING: This will replace existing data in collections!
    """
    await verify_admin(credentials)
    
    # Read and parse JSON file
    try:
        content = await file.read()
        import_data = json.loads(content.decode('utf-8'))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
    
    if "collections" not in import_data:
        raise HTTPException(status_code=400, detail="Invalid export file format")
    
    results = {
        "imported": [],
        "failed": [],
        "skipped": []
    }
    
    for collection_name in EXPORTABLE_COLLECTIONS:
        if collection_name not in import_data["collections"]:
            results["skipped"].append({
                "collection": collection_name,
                "reason": "Not in export file"
            })
            continue
        
        collection_data = import_data["collections"][collection_name]
        documents = collection_data.get("data", [])
        
        if not documents:
            results["skipped"].append({
                "collection": collection_name,
                "reason": "No documents to import"
            })
            continue
        
        try:
            collection = db[collection_name]
            
            # Clear existing data
            await collection.delete_many({})
            
            # Insert new data
            if documents:
                await collection.insert_many(documents)
            
            results["imported"].append({
                "collection": collection_name,
                "count": len(documents)
            })
        except Exception as e:
            results["failed"].append({
                "collection": collection_name,
                "error": str(e)
            })
    
    return {
        "success": True,
        "message": "Data import completed",
        "results": results
    }


@router.post("/data-migration/import-collection/{collection_name}")
async def import_single_collection(
    collection_name: str,
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Import a single collection from JSON file
    """
    await verify_admin(credentials)
    
    if collection_name not in EXPORTABLE_COLLECTIONS:
        raise HTTPException(status_code=400, detail=f"Collection '{collection_name}' is not allowed for import")
    
    try:
        content = await file.read()
        documents = json.loads(content.decode('utf-8'))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")
    
    if not isinstance(documents, list):
        raise HTTPException(status_code=400, detail="JSON file must contain an array of documents")
    
    try:
        collection = db[collection_name]
        
        # Clear existing data
        await collection.delete_many({})
        
        # Insert new data
        if documents:
            await collection.insert_many(documents)
        
        return {
            "success": True,
            "collection": collection_name,
            "imported_count": len(documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")


@router.post("/data-migration/seed")
async def seed_database():
    """
    Create initial admin user and basic settings for fresh database.
    This endpoint does NOT require authentication (for fresh deployments).
    Can only be called once - will fail if admin already exists.
    """
    from passlib.context import CryptContext
    import uuid
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": "admin@admissionbuddy.co"})
    if existing_admin:
        return {
            "success": False,
            "message": "Database already seeded. Admin user exists.",
            "admin_email": "admin@admissionbuddy.co"
        }
    
    created = []
    
    # Create admin user
    admin_data = {
        "id": str(uuid.uuid4()),
        "email": "admin@admissionbuddy.co",
        "password": pwd_context.hash("admin123"),
        "name": "Super Admin",
        "role": "super_admin",
        "is_active": True,
        "permissions": [
            "manage_colleges", "manage_schools", "manage_courses",
            "manage_exams", "manage_users", "manage_leads",
            "manage_content", "manage_settings", "manage_admins"
        ],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.admins.insert_one(admin_data)
    created.append("admin user")
    
    # Create lead settings
    if not await db.lead_settings.find_one({}):
        await db.lead_settings.insert_one({
            "id": str(uuid.uuid4()),
            "general_form_heading": "Get Free Counselling",
            "cta_button_text": "Apply Now",
            "cta_button_color": "#f97316",
            "show_floating_cta": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        created.append("lead settings")
    
    # Create homepage settings
    if not await db.homepage_settings.find_one({}):
        await db.homepage_settings.insert_one({
            "id": str(uuid.uuid4()),
            "site_name": "Admission Buddy",
            "hero_title": "Find Your Perfect College",
            "show_hero_search": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        created.append("homepage settings")
    
    # Create year settings
    if not await db.year_settings.find_one({}):
        await db.year_settings.insert_one({
            "id": str(uuid.uuid4()),
            "current_academic_year": "2025-26",
            "admission_year": "2025",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        created.append("year settings")
    
    return {
        "success": True,
        "message": "Database seeded successfully",
        "created": created,
        "admin_credentials": {
            "email": "admin@admissionbuddy.co",
            "password": "admin123"
        }
    }

