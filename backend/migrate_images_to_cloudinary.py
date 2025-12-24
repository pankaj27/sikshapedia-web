"""
Migration script to upload existing local images to Cloudinary
and update database references.

Run this script after setting up Cloudinary to migrate existing images.
"""
import os
import asyncio
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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

UPLOAD_DIR = ROOT_DIR / "static" / "uploads"

def upload_to_cloudinary(file_path: Path, folder: str) -> str:
    """Upload a local file to Cloudinary and return the URL"""
    try:
        with open(file_path, 'rb') as f:
            result = cloudinary.uploader.upload(
                f,
                folder=f"sikshapedia/{folder}",
                resource_type="auto",
                quality="auto:good"
            )
            return result.get('secure_url')
    except Exception as e:
        logger.error(f"Failed to upload {file_path}: {e}")
        return None

async def migrate_collection_images(collection_name: str, image_fields: list):
    """Migrate images for a specific collection"""
    collection = db[collection_name]
    
    # Find documents with local image URLs
    query = {"$or": [
        {field: {"$regex": "^/api/static/uploads/"}} for field in image_fields
    ] + [
        {field: {"$regex": "^/static/uploads/"}} for field in image_fields
    ]}
    
    cursor = collection.find(query)
    migrated = 0
    failed = 0
    
    async for doc in cursor:
        update_data = {}
        
        for field in image_fields:
            url = doc.get(field, '')
            if not url or not isinstance(url, str):
                continue
                
            # Check if it's a local URL
            if url.startswith('/api/static/uploads/') or url.startswith('/static/uploads/'):
                # Extract the file path
                relative_path = url.replace('/api/static/uploads/', '').replace('/static/uploads/', '')
                local_path = UPLOAD_DIR / relative_path
                
                if local_path.exists():
                    # Determine folder based on path
                    folder = relative_path.split('/')[0] if '/' in relative_path else 'content'
                    
                    # Upload to Cloudinary
                    cloudinary_url = upload_to_cloudinary(local_path, folder)
                    
                    if cloudinary_url:
                        update_data[field] = cloudinary_url
                        logger.info(f"Migrated {field}: {url} -> {cloudinary_url}")
                    else:
                        failed += 1
                else:
                    logger.warning(f"Local file not found: {local_path}")
        
        if update_data:
            await collection.update_one(
                {"_id": doc["_id"]},
                {"$set": update_data}
            )
            migrated += 1
    
    logger.info(f"Collection {collection_name}: Migrated {migrated}, Failed {failed}")
    return migrated, failed

async def migrate_all_images():
    """Migrate all images from local storage to Cloudinary"""
    logger.info("🚀 Starting image migration to Cloudinary...")
    
    # Define collections and their image fields
    collections_to_migrate = {
        "colleges": ["logo_url", "banner_url", "campus_images", "gallery_images"],
        "schools": ["logo_url", "banner_url", "campus_images", "gallery_images"],
        "universities": ["logo_url", "banner_url", "campus_images", "gallery_images"],
        "advertisements": ["image_url"],
        "homepage_settings": ["hero_image", "background_image"],
        "blogs": ["featured_image", "thumbnail"],
        "news": ["featured_image", "thumbnail"],
        "articles": ["featured_image", "thumbnail"],
        "courses": ["image_url", "icon_url"],
        "exams": ["image_url", "icon_url"],
        "listing_pages": ["hero_image", "og_image"],
        "counselors": ["profile_image"],
        "scholarships": ["image_url"],
        "loans": ["image_url"],
        "study_abroad": ["image_url", "banner_url"],
    }
    
    total_migrated = 0
    total_failed = 0
    
    for collection_name, fields in collections_to_migrate.items():
        try:
            migrated, failed = await migrate_collection_images(collection_name, fields)
            total_migrated += migrated
            total_failed += failed
        except Exception as e:
            logger.error(f"Error migrating {collection_name}: {e}")
    
    logger.info(f"✅ Migration complete! Total migrated: {total_migrated}, Failed: {total_failed}")
    return total_migrated, total_failed

async def migrate_gallery_images():
    """Special handler for gallery images (arrays of URLs)"""
    logger.info("🖼️ Migrating gallery images...")
    
    collections = ["colleges", "schools", "universities"]
    gallery_fields = ["campus_images", "gallery_images"]
    
    for collection_name in collections:
        collection = db[collection_name]
        cursor = collection.find({})
        
        async for doc in cursor:
            update_data = {}
            
            for field in gallery_fields:
                images = doc.get(field, [])
                if not images or not isinstance(images, list):
                    continue
                
                new_images = []
                for url in images:
                    if not url or not isinstance(url, str):
                        continue
                    
                    if url.startswith('/api/static/uploads/') or url.startswith('/static/uploads/'):
                        relative_path = url.replace('/api/static/uploads/', '').replace('/static/uploads/', '')
                        local_path = UPLOAD_DIR / relative_path
                        
                        if local_path.exists():
                            cloudinary_url = upload_to_cloudinary(local_path, 'campus')
                            if cloudinary_url:
                                new_images.append(cloudinary_url)
                                logger.info(f"Gallery image migrated: {url}")
                            else:
                                new_images.append(url)  # Keep original on failure
                        else:
                            new_images.append(url)
                    else:
                        new_images.append(url)  # Keep non-local URLs as-is
                
                if new_images != images:
                    update_data[field] = new_images
            
            if update_data:
                await collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": update_data}
                )

if __name__ == "__main__":
    asyncio.run(migrate_all_images())
    asyncio.run(migrate_gallery_images())
