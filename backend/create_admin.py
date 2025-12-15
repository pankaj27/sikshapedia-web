import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone
import uuid
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    """Create default admin user"""
    
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": "admin@collegedunia.com"})
    if existing_admin:
        print("ℹ️  Admin user already exists")
        print(f"   Email: admin@collegedunia.com")
        print(f"   Password: admin123")
        return
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@collegedunia.com",
        "password_hash": pwd_context.hash("admin123"),
        "name": "Admin User",
        "role": "admin",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.admins.insert_one(admin_user)
    
    print("✅ Admin user created successfully!")
    print(f"   Email: admin@collegedunia.com")
    print(f"   Password: admin123")
    print("\n⚠️  IMPORTANT: Change this password after first login!")

if __name__ == "__main__":
    asyncio.run(create_admin())
    client.close()
