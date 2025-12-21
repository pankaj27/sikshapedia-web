#!/usr/bin/env python3
"""
Check institute credentials in database
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

async def check_credentials():
    """Check institute credentials"""
    
    # Find all credentials
    credentials = await db.institute_credentials.find({}, {"_id": 0}).to_list(10)
    print(f"📋 Found {len(credentials)} institute credentials:")
    
    for cred in credentials:
        print(f"   Login ID: {cred.get('login_id')}")
        print(f"   Institution: {cred.get('institution_name')}")
        print(f"   Active: {cred.get('is_active')}")
        print(f"   Email: {cred.get('email')}")
        print("   ---")
    
    # Check specific credential
    upda_cred = await db.institute_credentials.find_one({"login_id": "UPDA0001"}, {"_id": 0})
    if upda_cred:
        print(f"\n🔍 UPDA0001 credential details:")
        print(f"   Password hash: {upda_cred.get('password_hash')}")
        
        # Test password verification
        test_password = "hrZiJlz0NyXY"
        test_hash = hash_password(test_password)
        print(f"   Test hash: {test_hash}")
        print(f"   Match: {test_hash == upda_cred.get('password_hash')}")
    else:
        print("\n❌ UPDA0001 credential not found")

async def main():
    try:
        await check_credentials()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())