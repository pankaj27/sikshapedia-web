#!/usr/bin/env python3
"""
Create test institute credentials for testing
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone
import hashlib
from uuid import uuid4

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

async def create_test_credentials():
    """Create test institute credentials"""
    
    # Check if credentials already exist
    existing = await db.institute_credentials.find_one({"login_id": "UPDA0001"}, {"_id": 0})
    if existing:
        print("✅ Credentials already exist for UPDA0001")
        return existing
    
    # Get a test college to associate with
    college = await db.colleges.find_one({}, {"_id": 0})
    if not college:
        print("❌ No colleges found in database")
        return None
    
    print(f"📋 Creating credentials for college: {college.get('name', 'Unknown')}")
    
    # Create credentials
    password = "hrZiJlz0NyXY"
    password_hash = hash_password(password)
    
    credentials = {
        "id": f"inst_cred_{uuid4().hex[:12]}",
        "institution_id": college["id"],
        "institution_name": college.get("name", "Test Institution"),
        "login_id": "UPDA0001",
        "password_hash": password_hash,
        "email": "test@example.com",
        "phone": "+91-9876543210",
        "is_active": True,
        "last_login": None,
        "password_changed": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.institute_credentials.insert_one(credentials)
    
    print("✅ Test credentials created successfully!")
    print(f"   Login ID: UPDA0001")
    print(f"   Password: hrZiJlz0NyXY")
    print(f"   Institution: {college.get('name', 'Unknown')}")
    
    return credentials

async def main():
    try:
        await create_test_credentials()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())