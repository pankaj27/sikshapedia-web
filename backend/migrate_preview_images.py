"""
Comprehensive migration script to:
1. Download images from old preview URLs
2. Upload them to Cloudinary
3. Update database references

This handles images stored on previous preview environments.
"""
import os
import asyncio
import requests
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import logging
from urllib.parse import urlparse
import tempfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment
load_dotenv('/app/backend/.env')

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
    secure=True
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sikshapedia_db')]

# Preview domains to migrate from
PREVIEW_DOMAINS = [
    'listing-editor.preview.emergentagent.com',
    'campusads.preview.emergentagent.com',
    'admissionbuddy.preview.emergentagent.com',
]

def should_migrate_url(url: str) -> bool:
    """Check if URL is from a preview domain that needs migration"""
    if not url or not isinstance(url, str):
        return False
    for domain in PREVIEW_DOMAINS:
        if domain in url:
            return True
    return False

def download_and_upload_to_cloudinary(url: str, folder: str) -> str:
    """Download image from URL and upload to Cloudinary"""
    try:
        logger.info(f"Downloading: {url}")
        
        # Download the image
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            logger.error(f"Failed to download {url}: HTTP {response.status_code}")
            return None
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            response.content,
            folder=f"sikshapedia/{folder}",
            resource_type="auto",
            quality="auto:good"
        )
        
        cloudinary_url = result.get('secure_url')
        logger.info(f"✅ Uploaded to Cloudinary: {cloudinary_url}")
        return cloudinary_url
        
    except Exception as e:
        logger.error(f"Error migrating {url}: {e}")
        return None

async def migrate_collection(collection_name: str, image_fields: dict):
    """
    Migrate images for a collection.
    image_fields: dict mapping field name to folder name
    e.g., {'logo_url': 'logos', 'banner_url': 'banners'}
    """
    collection = db[collection_name]
    migrated = 0
    failed = 0
    
    # Build query to find documents with preview URLs
    or_conditions = []
    for field in image_fields.keys():
        for domain in PREVIEW_DOMAINS:
            or_conditions.append({field: {"$regex": domain}})
    
    if not or_conditions:
        return 0, 0
    
    cursor = collection.find({"$or": or_conditions})
    
    async for doc in cursor:
        update_data = {}
        doc_id = doc.get('_id')
        doc_name = doc.get('name', doc.get('title', str(doc_id)[:20]))
        
        for field, folder in image_fields.items():
            url = doc.get(field, '')
            
            if should_migrate_url(url):
                logger.info(f"Migrating {collection_name}.{field} for '{doc_name}'")
                
                cloudinary_url = download_and_upload_to_cloudinary(url, folder)
                
                if cloudinary_url:
                    update_data[field] = cloudinary_url
                    migrated += 1
                else:
                    failed += 1
        
        if update_data:
            await collection.update_one(
                {"_id": doc_id},
                {"$set": update_data}
            )
            logger.info(f"Updated {collection_name} document: {doc_name}")
    
    return migrated, failed

async def migrate_array_field(collection_name: str, field_name: str, folder: str):
    """Migrate array fields containing image URLs"""
    collection = db[collection_name]
    migrated = 0
    
    # Find documents with array fields containing preview URLs
    or_conditions = []
    for domain in PREVIEW_DOMAINS:
        or_conditions.append({field_name: {"$regex": domain}})
    
    cursor = collection.find({"$or": or_conditions})
    
    async for doc in cursor:
        images = doc.get(field_name, [])
        if not images or not isinstance(images, list):
            continue
        
        new_images = []
        updated = False
        
        for url in images:
            if should_migrate_url(url):
                cloudinary_url = download_and_upload_to_cloudinary(url, folder)
                if cloudinary_url:
                    new_images.append(cloudinary_url)
                    updated = True
                    migrated += 1
                else:
                    new_images.append(url)  # Keep original on failure
            else:
                new_images.append(url)
        
        if updated:
            await collection.update_one(
                {"_id": doc["_id"]},
                {"$set": {field_name: new_images}}
            )
    
    return migrated

async def main():
    """Run the full migration"""
    logger.info("🚀 Starting comprehensive image migration to Cloudinary...")
    
    total_migrated = 0
    total_failed = 0
    
    # Define collections and their image fields
    collections_config = {
        "colleges": {"logo_url": "logos", "banner_url": "banners"},
        "schools": {"logo_url": "logos", "banner_url": "banners"},
        "universities": {"logo_url": "logos", "banner_url": "banners"},
        "advertisements": {"image_url": "banners"},
        "homepage_settings": {"hero_image": "content", "background_image": "content"},
        "blogs": {"featured_image": "content", "thumbnail": "content"},
        "news": {"featured_image": "content", "thumbnail": "content"},
        "articles": {"featured_image": "content", "thumbnail": "content"},
        "courses": {"image_url": "content", "icon_url": "logos"},
        "exams": {"image_url": "content", "icon_url": "logos"},
        "listing_pages": {"hero_image": "banners", "og_image": "seo"},
        "counselors": {"profile_image": "profiles"},
        "scholarships": {"image_url": "content"},
        "loans": {"image_url": "content"},
        "study_abroad": {"image_url": "content", "banner_url": "banners"},
    }
    
    for collection_name, fields in collections_config.items():
        try:
            logger.info(f"\n📁 Processing {collection_name}...")
            migrated, failed = await migrate_collection(collection_name, fields)
            total_migrated += migrated
            total_failed += failed
            if migrated > 0 or failed > 0:
                logger.info(f"   {collection_name}: ✅ {migrated} migrated, ❌ {failed} failed")
        except Exception as e:
            logger.error(f"Error processing {collection_name}: {e}")
    
    # Migrate array fields (gallery images)
    logger.info("\n🖼️ Processing gallery/campus images...")
    array_config = [
        ("colleges", "campus_images", "campus"),
        ("colleges", "gallery_images", "campus"),
        ("schools", "campus_images", "campus"),
        ("schools", "gallery_images", "campus"),
        ("universities", "campus_images", "campus"),
        ("universities", "gallery_images", "campus"),
    ]
    
    for collection_name, field_name, folder in array_config:
        try:
            migrated = await migrate_array_field(collection_name, field_name, folder)
            total_migrated += migrated
            if migrated > 0:
                logger.info(f"   {collection_name}.{field_name}: ✅ {migrated} images migrated")
        except Exception as e:
            logger.error(f"Error processing {collection_name}.{field_name}: {e}")
    
    logger.info(f"\n🎉 Migration complete!")
    logger.info(f"   Total migrated: {total_migrated}")
    logger.info(f"   Total failed: {total_failed}")
    
    return total_migrated, total_failed

if __name__ == "__main__":
    asyncio.run(main())
