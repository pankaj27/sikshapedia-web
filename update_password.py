#!/usr/bin/env python3
"""
Update institute credentials password
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import hashlib

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

async def update_password():
    """Update UPDA0001 password"""
    
    # Update password to the expected one
    password = "hrZiJlz0NyXY"
    password_hash = hash_password(password)
    
    result = await db.institute_credentials.update_one(
        {"login_id": "UPDA0001"},
        {"$set": {"password_hash": password_hash}}
    )
    
    if result.modified_count > 0:
        print("✅ Password updated successfully!")
        print(f"   Login ID: UPDA0001")
        print(f"   New Password: {password}")
        print(f"   Hash: {password_hash}")
    else:
        print("❌ Failed to update password")

async def main():
    try:
        await update_password()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())