"""Authentication routes"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import bcrypt
from passlib.context import CryptContext

from core.database import db
from core.auth import create_access_token, get_current_user, security

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ============================================
# Models
# ============================================

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    profile_photo: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None

# ============================================
# Routes
# ============================================

@auth_router.post("/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    
    import uuid
    user = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "name": user_data.name,
        "role": "student",
        "profile_photo": None,
        "job_title": None,
        "bio": None,
        "saved_colleges": [],
        "total_earnings": 0.0,
        "referral_code": str(uuid.uuid4())[:8].upper(),
        "referral_count": 0,
        "password_hash": password_hash.decode('utf-8'),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": None
    }
    
    await db.users.insert_one(user)
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Remove sensitive data
    user.pop('password_hash', None)
    user.pop('_id', None)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@auth_router.post("/login")
async def login(credentials: UserLogin):
    """Login user"""
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    password_hash = user_doc.get('password_hash') or user_doc.get('password')
    if not password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not pwd_context.verify(credentials.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_doc.pop('password_hash', None)
    user_doc.pop('password', None)
    user_doc.pop('_id', None)
    
    access_token = create_access_token(data={"sub": user_doc["id"], "role": user_doc.get("role", "student")})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_doc
    }

@auth_router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@auth_router.put("/profile")
async def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Update user profile"""
    update_data = {}
    
    if profile_data.name is not None:
        update_data['name'] = profile_data.name
    if profile_data.profile_photo is not None:
        update_data['profile_photo'] = profile_data.profile_photo
    if profile_data.job_title is not None:
        update_data['job_title'] = profile_data.job_title
    if profile_data.bio is not None:
        update_data['bio'] = profile_data.bio
    
    if update_data:
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password_hash": 0})
    return updated_user

@auth_router.post("/admin-login")
async def admin_login(credentials: UserLogin):
    """Admin login endpoint"""
    admin_doc = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if not admin_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(credentials.password, admin_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin_doc["id"], "role": "admin"})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": admin_doc["id"],
            "email": admin_doc["email"],
            "name": admin_doc["name"],
            "role": "admin",
            "profile_photo": admin_doc.get("profile_photo"),
            "job_title": admin_doc.get("job_title"),
            "bio": admin_doc.get("bio"),
            "saved_colleges": []
        }
    }
