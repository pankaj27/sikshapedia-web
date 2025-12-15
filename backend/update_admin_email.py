import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def update_admin_email():
    """Update admin email to admin@admissionbuddy.co"""
    
    # Find existing admin
    old_admin = await db.admins.find_one({"email": "admin@collegedunia.com"})
    
    if old_admin:
        # Update the email
        await db.admins.update_one(
            {"email": "admin@collegedunia.com"},
            {"$set": {"email": "admin@admissionbuddy.co"}}
        )
        print("✅ Admin email updated successfully!")
        print(f"   New Email: admin@admissionbuddy.co")
        print(f"   Password: admin123")
    else:
        print("❌ No admin found with email admin@collegedunia.com")
        print("   Checking for admin@admissionbuddy.co...")
        
        new_admin = await db.admins.find_one({"email": "admin@admissionbuddy.co"})
        if new_admin:
            print("✅ Admin already exists with email admin@admissionbuddy.co")
            print(f"   Email: admin@admissionbuddy.co")
            print(f"   Password: admin123")
        else:
            print("❌ No admin user found. Please run create_admin.py first.")

if __name__ == "__main__":
    asyncio.run(update_admin_email())
    client.close()
