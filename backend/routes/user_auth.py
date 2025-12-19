"""
User Authentication Routes - Google OAuth + Email OTP
"""
from fastapi import APIRouter, HTTPException, Depends, Response, Request, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta
import os
import httpx
import random
import string
from uuid import uuid4

# Resend for Email OTP
import resend

router = APIRouter(prefix="/auth/user", tags=["User Auth"])

# Database reference - will be set by main app
_db = None

def set_database(database):
    """Set database reference from main app"""
    global _db
    _db = database

async def get_db():
    """Get database reference"""
    if _db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return _db

# Resend Config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ============ MODELS ============

class UserSignupRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    city: str
    course: str
    referral_code: Optional[str] = None

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class GoogleSessionRequest(BaseModel):
    session_id: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    course: Optional[str] = None
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    preferred_courses: Optional[list] = None

# ============ HELPER FUNCTIONS ============

def generate_otp():
    """Generate 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def generate_referral_code(name: str):
    """Generate unique referral code from name"""
    prefix = ''.join(name.upper().split())[:4]
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}{suffix}"

def generate_user_id():
    """Generate unique user ID"""
    return f"user_{uuid4().hex[:12]}"

async def send_otp_email(email: str, otp: str):
    """Send OTP via Resend"""
    if not RESEND_API_KEY:
        print(f"[DEV] OTP for {email}: {otp}")
        return True
    
    try:
        params = {
            "from": f"Admission Buddy <{SENDER_EMAIL}>",
            "to": [email],
            "subject": "Your OTP for Admission Buddy Login",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Admission Buddy</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Your OTP Code</h2>
                    <p style="color: #6b7280;">Use this code to verify your email:</p>
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316;">{otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes.</p>
                    <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            </div>
            """
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False

# ============ AUTH ENDPOINTS ============

@router.post("/send-otp")
async def send_otp(request: OTPRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    """Send OTP to email for verification"""
    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    # Store OTP in database
    await db.otps.delete_many({"email": request.email})  # Remove old OTPs
    await db.otps.insert_one({
        "email": request.email,
        "otp": otp,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Send email in background
    background_tasks.add_task(send_otp_email, request.email, otp)
    
    return {"message": "OTP sent successfully", "email": request.email}

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, response: Response, db=Depends(get_db)):
    """Verify OTP and login/register user"""
    # Find OTP
    otp_doc = await db.otps.find_one({"email": request.email, "otp": request.otp}, {"_id": 0})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check expiry
    expires_at = datetime.fromisoformat(otp_doc["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    # Delete used OTP
    await db.otps.delete_many({"email": request.email})
    
    # Find or create user
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    
    if not user:
        # Return pending status - user needs to complete signup
        return {"status": "pending_signup", "email": request.email}
    
    # Create session
    session_token = f"session_{uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user["id"],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    return {
        "status": "authenticated",
        "user": user,
        "session_token": session_token
    }

@router.post("/complete-signup")
async def complete_signup(request: UserSignupRequest, response: Response, db=Depends(get_db)):
    """Complete user signup after OTP verification"""
    # Check if user already exists
    existing = await db.users.find_one({"email": request.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Handle referral
    referred_by = None
    if request.referral_code:
        referrer = await db.users.find_one({"referral_code": request.referral_code}, {"_id": 0})
        if referrer:
            referred_by = referrer["id"]
    
    # Create user
    user_id = generate_user_id()
    referral_code = generate_referral_code(request.name)
    
    user = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "city": request.city,
        "course": request.course,
        "referral_code": referral_code,
        "referred_by": referred_by,
        "points": 100 if referred_by else 0,  # Signup bonus if referred
        "profile_photo_url": None,
        "role": "user",
        "is_verified": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    
    # Award referral bonus to referrer
    if referred_by:
        await db.users.update_one(
            {"id": referred_by},
            {"$inc": {"points": 200}}  # Referral bonus
        )
        # Create referral record
        await db.referrals.insert_one({
            "id": f"ref_{uuid4().hex[:12]}",
            "referrer_id": referred_by,
            "referred_user_id": user_id,
            "referred_user_name": request.name,
            "referred_user_email": request.email,
            "points_earned": 200,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        # Create earning transaction for referrer
        await db.earnings.insert_one({
            "id": f"earn_{uuid4().hex[:12]}",
            "user_id": referred_by,
            "type": "referral",
            "amount": 200,
            "description": f"Referral bonus for {request.name}",
            "reference_id": user_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Create session
    session_token = f"session_{uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    # Remove sensitive fields
    user.pop("_id", None)
    
    return {
        "status": "authenticated",
        "user": user,
        "session_token": session_token
    }

@router.post("/google/session")
async def google_session(request: GoogleSessionRequest, response: Response, db=Depends(get_db)):
    """Process Google OAuth session and create/login user"""
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    
    # Fetch session data from Emergent Auth
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": request.session_id}
            )
            if res.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            google_data = res.json()
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")
    
    email = google_data.get("email")
    name = google_data.get("name")
    picture = google_data.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
    
    # Find or create user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        # New user - needs to complete profile
        return {
            "status": "pending_signup",
            "email": email,
            "name": name,
            "picture": picture
        }
    
    # Update profile picture if changed
    if picture and user.get("profile_photo_url") != picture:
        await db.users.update_one(
            {"email": email},
            {"$set": {"profile_photo_url": picture, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        user["profile_photo_url"] = picture
    
    # Create session
    session_token = f"session_{uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user["id"],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    return {
        "status": "authenticated",
        "user": user,
        "session_token": session_token
    }

@router.get("/me")
async def get_current_user(request: Request, db=Depends(get_db)):
    """Get current authenticated user"""
    # Check cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = datetime.fromisoformat(session["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post("/logout")
async def logout(request: Request, response: Response, db=Depends(get_db)):
    """Logout user and clear session"""
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    
    return {"message": "Logged out successfully"}

@router.put("/profile")
async def update_profile(profile: UserProfileUpdate, request: Request, db=Depends(get_db)):
    """Update user profile"""
    # Get current user
    user = await get_current_user(request, db)
    
    # Build update dict
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Update user
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_data}
    )
    
    # Return updated user
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return updated_user

@router.post("/profile/photo")
async def update_profile_photo(request: Request, db=Depends(get_db)):
    """Update profile photo URL"""
    user = await get_current_user(request, db)
    
    body = await request.json()
    photo_url = body.get("photo_url")
    
    if not photo_url:
        raise HTTPException(status_code=400, detail="Photo URL required")
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"profile_photo_url": photo_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Profile photo updated", "photo_url": photo_url}
