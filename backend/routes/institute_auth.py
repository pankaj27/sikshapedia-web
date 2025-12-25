"""
Institute Authentication & Dashboard Routes
Auto-generated credentials on college/school creation
"""
from fastapi import APIRouter, HTTPException, Depends, Request, Response, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone, timedelta
import os
import random
import string
import hashlib
from uuid import uuid4

# Resend for Email
import resend

# Twilio for WhatsApp (already in project)
try:
    from twilio.rest import Client as TwilioClient
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False

router = APIRouter(prefix="/institute", tags=["Institute Auth & Dashboard"])

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

# ============ CONFIG ============

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER', '')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ============ MODELS ============

class InstituteLoginRequest(BaseModel):
    login_id: str
    password: str

class InstituteForgotPasswordRequest(BaseModel):
    email: EmailStr

class InstituteResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str

class LeadStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class AdmissionStatusUpdate(BaseModel):
    status: str  # submitted, under_review, accepted, rejected
    notes: Optional[str] = None

# ============ HELPER FUNCTIONS ============

def generate_login_id(institution_name: str, serial_number: int):
    """Generate unique login ID for institute"""
    # Take first 4 chars of name (uppercase, no spaces)
    prefix = ''.join(institution_name.upper().split())[:4]
    return f"{prefix}{serial_number:04d}"

def generate_password():
    """Generate secure random password"""
    chars = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(random.choices(chars, k=12))

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain) == hashed

async def send_credentials_email(email: str, name: str, login_id: str, password: str):
    """Send login credentials via email"""
    if not RESEND_API_KEY:
        print(f"[DEV] Credentials for {name}: Login ID: {login_id}, Password: {password}")
        return True
    
    try:
        params = {
            "from": f"Admission Buddy <{SENDER_EMAIL}>",
            "to": [email],
            "subject": f"Your Institution Portal Login Credentials - {name}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Admission Buddy</h1>
                    <p style="color: white; opacity: 0.9;">Institution Portal</p>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Welcome, {name}!</h2>
                    <p style="color: #6b7280;">Your institution portal account has been created. Use the following credentials to login:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Login ID:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">{login_id}</code></p>
                        <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">{password}</code></p>
                    </div>
                    
                    <p style="color: #ef4444; font-size: 14px;"><strong>Important:</strong> Please change your password after first login.</p>
                    
                    <a href="https://admissionbuddy.co/institute/login" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Login to Portal</a>
                </div>
            </div>
            """
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Error sending credentials email: {e}")
        return False

async def send_credentials_whatsapp(phone: str, name: str, login_id: str, password: str):
    """Send login credentials via WhatsApp"""
    if not TWILIO_AVAILABLE or not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER]):
        print(f"[DEV] WhatsApp credentials for {name}: Login ID: {login_id}, Password: {password}")
        return True
    
    try:
        client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = f"""🎓 *Admission Buddy - Institution Portal*

Welcome {name}!

Your login credentials:
📋 Login ID: {login_id}
🔑 Password: {password}

Login at: https://admissionbuddy.co/institute/login

⚠️ Please change your password after first login."""
        
        # Format phone number for WhatsApp
        if not phone.startswith('+'):
            phone = f"+91{phone}" if len(phone) == 10 else f"+{phone}"
        
        client.messages.create(
            body=message,
            from_=f"whatsapp:{TWILIO_WHATSAPP_NUMBER}",
            to=f"whatsapp:{phone}"
        )
        return True
    except Exception as e:
        print(f"Error sending WhatsApp: {e}")
        return False

# ============ CREDENTIAL GENERATION (Called from admin) ============

async def create_institute_credentials(db, institution_id: str, institution_name: str, email: str, phone: str, background_tasks: BackgroundTasks = None):
    """Create login credentials for an institution"""
    
    # Check if credentials already exist
    existing = await db.institute_credentials.find_one({"institution_id": institution_id}, {"_id": 0})
    if existing:
        return existing
    
    # Get next serial number
    count = await db.institute_credentials.count_documents({})
    serial_number = count + 1
    
    # Generate credentials
    login_id = generate_login_id(institution_name, serial_number)
    password = generate_password()
    password_hash = hash_password(password)
    
    credentials = {
        "id": f"inst_cred_{uuid4().hex[:12]}",
        "institution_id": institution_id,
        "institution_name": institution_name,
        "login_id": login_id,
        "password_hash": password_hash,
        "email": email,
        "phone": phone,
        "is_active": True,
        "last_login": None,
        "password_changed": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.institute_credentials.insert_one(credentials)
    
    # Send credentials via email and WhatsApp
    if background_tasks:
        if email:
            background_tasks.add_task(send_credentials_email, email, institution_name, login_id, password)
        if phone:
            background_tasks.add_task(send_credentials_whatsapp, phone, institution_name, login_id, password)
    
    # Store credential record for report (with temp password for admin reference)
    credential_report = {
        "id": f"cred_report_{uuid4().hex[:12]}",
        "institution_id": institution_id,
        "institution_name": institution_name,
        "login_email": email,  # Using email as login
        "login_id": login_id,
        "temp_password": password,  # Store for admin report
        "contact_email": email,
        "contact_phone": phone,
        "email_sent": bool(email),
        "whatsapp_sent": bool(phone),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.credential_reports.insert_one(credential_report)
    
    return {
        "login_id": login_id,
        "password": password,  # Only returned once!
        "institution_name": institution_name
    }

# ============ AUTH ENDPOINTS ============

@router.post("/login")
async def institute_login(request_data: InstituteLoginRequest, response: Response, db=Depends(get_db)):
    """Institute login"""
    # Find credentials
    cred = await db.institute_credentials.find_one(
        {"login_id": request_data.login_id},
        {"_id": 0}
    )
    
    if not cred:
        raise HTTPException(status_code=401, detail="Invalid login ID or password")
    
    if not cred.get("is_active", True):
        raise HTTPException(status_code=401, detail="Account is deactivated")
    
    # Verify password
    if not verify_password(request_data.password, cred["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid login ID or password")
    
    # Create session
    session_token = f"inst_session_{uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.institute_sessions.insert_one({
        "institution_id": cred["institution_id"],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Update last login
    await db.institute_credentials.update_one(
        {"login_id": request_data.login_id},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Set cookie
    response.set_cookie(
        key="institute_session",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    # Get institution details
    institution = await db.colleges.find_one(
        {"id": cred["institution_id"]},
        {"_id": 0, "id": 1, "name": 1, "logo_url": 1, "institution_type": 1, "location": 1}
    )
    
    return {
        "message": "Login successful",
        "session_token": session_token,
        "institution": institution,
        "needs_password_change": not cred.get("password_changed", False)
    }

@router.post("/forgot-password")
async def forgot_password(request_data: InstituteForgotPasswordRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    """Request password reset"""
    cred = await db.institute_credentials.find_one(
        {"email": request_data.email},
        {"_id": 0}
    )
    
    if not cred:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token
    reset_token = f"reset_{uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.password_resets.insert_one({
        "institution_id": cred["institution_id"],
        "email": request_data.email,
        "reset_token": reset_token,
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Send reset email
    if RESEND_API_KEY:
        try:
            params = {
                "from": f"Admission Buddy <{SENDER_EMAIL}>",
                "to": [request_data.email],
                "subject": "Password Reset - Admission Buddy Institution Portal",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Password Reset</h1>
                    </div>
                    <div style="padding: 30px; background: #f9fafb;">
                        <p>You requested a password reset for your institution portal account.</p>
                        <p>Your reset token: <code style="background: #f3f4f6; padding: 8px 16px; border-radius: 4px; font-size: 18px;">{reset_token}</code></p>
                        <p style="color: #ef4444; font-size: 14px;">This token expires in 1 hour.</p>
                    </div>
                </div>
                """
            }
            background_tasks.add_task(resend.Emails.send, params)
        except Exception as e:
            print(f"Error sending reset email: {e}")
    
    return {"message": "If the email exists, a reset link has been sent"}

@router.post("/reset-password")
async def reset_password(request_data: InstituteResetPasswordRequest, db=Depends(get_db)):
    """Reset password with token"""
    reset = await db.password_resets.find_one(
        {"reset_token": request_data.reset_token, "used": False},
        {"_id": 0}
    )
    
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check expiry
    expires_at = datetime.fromisoformat(reset["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token expired")
    
    # Update password
    new_hash = hash_password(request_data.new_password)
    await db.institute_credentials.update_one(
        {"institution_id": reset["institution_id"]},
        {"$set": {"password_hash": new_hash, "password_changed": True}}
    )
    
    # Mark token as used
    await db.password_resets.update_one(
        {"reset_token": request_data.reset_token},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successful"}

@router.post("/logout")
async def institute_logout(request: Request, response: Response, db=Depends(get_db)):
    """Institute logout"""
    session_token = request.cookies.get("institute_session")
    
    if session_token:
        await db.institute_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="institute_session", path="/")
    
    return {"message": "Logged out successfully"}

# ============ AUTH HELPER ============

async def get_current_institute(request: Request, db):
    """Get current authenticated institute"""
    session_token = request.cookies.get("institute_session")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.institute_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = datetime.fromisoformat(session["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    institution = await db.colleges.find_one(
        {"id": session["institution_id"]},
        {"_id": 0}
    )
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    return institution

@router.get("/me")
async def get_current_institute_details(request: Request, db=Depends(get_db)):
    """Get current institute details"""
    return await get_current_institute(request, db)

# ============ DASHBOARD ============

@router.get("/dashboard")
async def get_institute_dashboard(request: Request, db=Depends(get_db)):
    """Get institute dashboard data"""
    institution = await get_current_institute(request, db)
    inst_id = institution["id"]
    
    # Get leads with source breakdown
    total_leads = await db.leads.count_documents({"college_id": inst_id})
    organic_leads = await db.leads.count_documents({
        "college_id": inst_id,
        "source": {"$in": ["organic", "apply_now", "admission_form", "inquiry", None]}
    })
    ad_leads = await db.leads.count_documents({
        "college_id": inst_id,
        "source": {"$in": ["sponsored_ad", "advertisement", "ad_campaign"]}
    })
    
    # Lead status breakdown
    lead_status = {}
    for status in ["new", "contacted", "qualified", "converted", "rejected"]:
        count = await db.leads.count_documents({"college_id": inst_id, "status": status})
        lead_status[status] = count
    
    # Get admission applications
    total_applications = await db.admission_forms.count_documents({"college_id": inst_id})
    app_status = {}
    for status in ["submitted", "under_review", "accepted", "rejected"]:
        count = await db.admission_forms.count_documents({"college_id": inst_id, "status": status})
        app_status[status] = count
    
    # Recent leads
    recent_leads = await db.leads.find(
        {"college_id": inst_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    
    # Recent applications
    recent_applications = await db.admission_forms.find(
        {"college_id": inst_id},
        {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    
    # Ad analytics (sponsored ads)
    ad_stats = await db.sponsored_ads.find_one(
        {"institution_id": inst_id},
        {"_id": 0, "impressions": 1, "clicks": 1, "conversions": 1}
    ) or {"impressions": 0, "clicks": 0, "conversions": 0}
    
    return {
        "institution": institution,
        "leads": {
            "total": total_leads,
            "organic": organic_leads,
            "from_ads": ad_leads,
            "status_breakdown": lead_status
        },
        "applications": {
            "total": total_applications,
            "status_breakdown": app_status
        },
        "ad_analytics": ad_stats,
        "recent_leads": recent_leads,
        "recent_applications": recent_applications
    }

# ============ LEADS MANAGEMENT ============

@router.get("/leads")
async def get_institute_leads(
    request: Request,
    source: Optional[str] = None,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """Get all leads for institute"""
    institution = await get_current_institute(request, db)
    
    query = {"college_id": institution["id"]}
    if source:
        if source == "organic":
            query["source"] = {"$in": ["organic", "apply_now", "admission_form", "inquiry", None]}
        elif source == "ad":
            query["source"] = {"$in": ["sponsored_ad", "advertisement", "ad_campaign"]}
    if status:
        query["status"] = status
    
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    
    return leads

@router.patch("/leads/{lead_id}")
async def update_lead_status(lead_id: str, update: LeadStatusUpdate, request: Request, db=Depends(get_db)):
    """Update lead status"""
    institution = await get_current_institute(request, db)
    
    lead = await db.leads.find_one(
        {"id": lead_id, "college_id": institution["id"]},
        {"_id": 0}
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = {
        "status": update.status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if update.notes:
        update_data["notes"] = update.notes
    
    await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    
    return {"message": "Lead updated successfully"}

# ============ APPLICATIONS MANAGEMENT ============

@router.get("/applications")
async def get_institute_applications(
    request: Request,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """Get all admission applications for institute"""
    institution = await get_current_institute(request, db)
    
    query = {"college_id": institution["id"]}
    if status:
        query["status"] = status
    
    applications = await db.admission_forms.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    
    return applications

@router.patch("/applications/{application_id}")
async def update_application_status(
    application_id: str,
    update: AdmissionStatusUpdate,
    request: Request,
    db=Depends(get_db)
):
    """Update admission application status (approve/reject)"""
    institution = await get_current_institute(request, db)
    
    application = await db.admission_forms.find_one(
        {"id": application_id, "college_id": institution["id"]},
        {"_id": 0}
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Add status to history
    status_entry = {
        "status": update.status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": update.notes or f"Status changed to {update.status} by institute"
    }
    
    await db.admission_forms.update_one(
        {"id": application_id},
        {
            "$set": {
                "status": update.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"status_history": status_entry}
        }
    )
    
    return {"message": f"Application {update.status} successfully"}

# ============ AD ANALYTICS ============

@router.get("/ad-analytics")
async def get_ad_analytics(request: Request, db=Depends(get_db)):
    """Get detailed ad analytics for institute"""
    institution = await get_current_institute(request, db)
    
    # Get sponsored ads
    ads = await db.sponsored_ads.find(
        {"institution_id": institution["id"]},
        {"_id": 0}
    ).to_list(100)
    
    # Aggregate stats
    total_impressions = sum([ad.get("impressions", 0) for ad in ads])
    total_clicks = sum([ad.get("clicks", 0) for ad in ads])
    total_conversions = sum([ad.get("conversions", 0) for ad in ads])
    total_spend = sum([ad.get("total_spend", 0) for ad in ads])
    
    # Calculate rates
    ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    conversion_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
    
    # Get leads from ads
    ad_leads = await db.leads.find(
        {
            "college_id": institution["id"],
            "source": {"$in": ["sponsored_ad", "advertisement", "ad_campaign"]}
        },
        {"_id": 0}
    ).to_list(100)
    
    return {
        "summary": {
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "total_spend": total_spend,
            "ctr": round(ctr, 2),
            "conversion_rate": round(conversion_rate, 2)
        },
        "ads": ads,
        "leads_from_ads": len(ad_leads)
    }

# ============ CREDENTIALS REPORT (Admin) ============

@router.get("/credentials-report")
async def get_credentials_report(request: Request, db=Depends(get_db)):
    """Get credentials report (Admin only - for now institute can see their own)"""
    institution = await get_current_institute(request, db)
    
    report = await db.credential_reports.find_one(
        {"institution_id": institution["id"]},
        {"_id": 0}
    )
    
    return report or {"message": "No credentials report found"}
