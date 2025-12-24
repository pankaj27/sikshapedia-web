"""
Database Seed Script - Creates initial admin user and basic data
Run this on a fresh database to enable admin login
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
from pathlib import Path

# Load environment
load_dotenv(Path(__file__).parent / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    """Create initial admin user and basic settings"""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sikshapedia_db')
    
    print(f"Connecting to MongoDB: {mongo_url}")
    print(f"Database: {db_name}")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": "admin@admissionbuddy.co"})
    if existing_admin:
        print("✅ Admin user already exists")
    else:
        # Create admin user
        admin_data = {
            "id": str(uuid.uuid4()),
            "email": "admin@admissionbuddy.co",
            "password": pwd_context.hash("admin123"),
            "name": "Super Admin",
            "role": "super_admin",
            "is_active": True,
            "permissions": [
                "manage_colleges",
                "manage_schools", 
                "manage_courses",
                "manage_exams",
                "manage_users",
                "manage_leads",
                "manage_content",
                "manage_settings",
                "manage_admins"
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(admin_data)
        print("✅ Created admin user: admin@admissionbuddy.co / admin123")
    
    # Create basic lead settings
    existing_settings = await db.lead_settings.find_one({})
    if not existing_settings:
        lead_settings = {
            "id": str(uuid.uuid4()),
            "general_form_heading": "Get Free Counselling",
            "general_form_subheading": "Fill the form to get expert guidance",
            "cta_button_text": "Apply Now",
            "cta_button_color": "#f97316",
            "show_floating_cta": True,
            "show_exit_popup": False,
            "show_timed_popup": False,
            "popup_delay_seconds": 30,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.lead_settings.insert_one(lead_settings)
        print("✅ Created lead settings")
    
    # Create basic homepage settings
    existing_homepage = await db.homepage_settings.find_one({})
    if not existing_homepage:
        homepage_settings = {
            "id": str(uuid.uuid4()),
            "site_name": "Admission Buddy",
            "tagline": "Your Gateway to Higher Education",
            "hero_title": "Find Your Perfect College",
            "hero_subtitle": "Search from thousands of colleges and courses",
            "show_hero_search": True,
            "show_featured_colleges": True,
            "show_popular_courses": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.homepage_settings.insert_one(homepage_settings)
        print("✅ Created homepage settings")
    
    # Create year settings
    existing_year = await db.year_settings.find_one({})
    if not existing_year:
        year_settings = {
            "id": str(uuid.uuid4()),
            "current_academic_year": "2025-26",
            "admission_year": "2025",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.year_settings.insert_one(year_settings)
        print("✅ Created year settings")
    
    client.close()
    print("\n🎉 Database seeding complete!")
    print("You can now login with: admin@admissionbuddy.co / admin123")

if __name__ == "__main__":
    asyncio.run(seed_database())
