"""Admin Auth Pages Content Management API"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

router = APIRouter(prefix="/api/admin/auth-pages", tags=["Admin Auth Pages"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Pydantic Models
class StatItem(BaseModel):
    value: str
    label: str

class BenefitItem(BaseModel):
    icon: str = "check"  # check, gift, star, etc.
    text: str

class AuthPageContent(BaseModel):
    # Left panel content
    logo_url: Optional[str] = "/favicon.png"
    heading: str
    subheading: str
    gradient_from: Optional[str] = "blue-600"  # For login
    gradient_via: Optional[str] = "blue-700"
    gradient_to: Optional[str] = "indigo-800"
    stats: Optional[List[StatItem]] = []
    benefits: Optional[List[BenefitItem]] = []
    
    # Right panel content
    form_title: str
    form_subtitle: str
    
    # Footer content
    footer_text: Optional[str] = None
    footer_link_text: Optional[str] = None
    footer_link_url: Optional[str] = None
    
    # Institute login box
    show_institute_login: Optional[bool] = True
    institute_login_text: Optional[str] = "Are you an institution?"
    institute_login_link_text: Optional[str] = "Institute Login →"

class AuthPageResponse(BaseModel):
    page_type: str  # 'login' or 'signup'
    content: AuthPageContent
    updated_at: Optional[str] = None

# Default content for login page
DEFAULT_LOGIN_CONTENT = {
    "logo_url": "/favicon.png",
    "heading": "Welcome Back!",
    "subheading": "Sign in to access your dashboard and track your college applications",
    "gradient_from": "blue-600",
    "gradient_via": "blue-700",
    "gradient_to": "indigo-800",
    "stats": [
        {"value": "10K+", "label": "Colleges"},
        {"value": "50K+", "label": "Students"},
        {"value": "500+", "label": "Courses"}
    ],
    "benefits": [],
    "form_title": "Sign In",
    "form_subtitle": "Enter your credentials to continue",
    "footer_text": "Don't have an account?",
    "footer_link_text": "Create Account",
    "footer_link_url": "/signup",
    "show_institute_login": True,
    "institute_login_text": "Are you an institution?",
    "institute_login_link_text": "Institute Login →"
}

# Default content for signup page
DEFAULT_SIGNUP_CONTENT = {
    "logo_url": "/favicon.png",
    "heading": "Join Admission Buddy",
    "subheading": "Find your dream college and track your applications all in one place",
    "gradient_from": "orange-500",
    "gradient_via": "orange-600",
    "gradient_to": "red-600",
    "stats": [],
    "benefits": [
        {"icon": "check", "text": "Compare 10,000+ colleges"},
        {"icon": "check", "text": "Track your applications"},
        {"icon": "check", "text": "Get personalized recommendations"},
        {"icon": "gift", "text": "Earn rewards for referrals"}
    ],
    "form_title": "Create Account",
    "form_subtitle": "Join thousands of students finding their dream college",
    "footer_text": "Already have an account?",
    "footer_link_text": "Sign In",
    "footer_link_url": "/login",
    "show_institute_login": False,
    "institute_login_text": "",
    "institute_login_link_text": ""
}

@router.get("/{page_type}")
async def get_auth_page_content(page_type: str):
    """Get content for login or signup page"""
    if page_type not in ['login', 'signup']:
        raise HTTPException(status_code=400, detail="Invalid page type. Use 'login' or 'signup'")
    
    # Try to get from database
    content = await db.auth_page_content.find_one({"page_type": page_type}, {"_id": 0})
    
    if content:
        return content
    
    # Return default content
    default = DEFAULT_LOGIN_CONTENT if page_type == 'login' else DEFAULT_SIGNUP_CONTENT
    return {
        "page_type": page_type,
        "content": default,
        "updated_at": None
    }

@router.put("/{page_type}")
async def update_auth_page_content(page_type: str, content: AuthPageContent):
    """Update content for login or signup page (Admin only)"""
    if page_type not in ['login', 'signup']:
        raise HTTPException(status_code=400, detail="Invalid page type. Use 'login' or 'signup'")
    
    update_data = {
        "page_type": page_type,
        "content": content.dict(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.auth_page_content.update_one(
        {"page_type": page_type},
        {"$set": update_data},
        upsert=True
    )
    
    return {"success": True, "message": f"{page_type.capitalize()} page content updated successfully"}

@router.post("/{page_type}/reset")
async def reset_auth_page_content(page_type: str):
    """Reset content to default for login or signup page"""
    if page_type not in ['login', 'signup']:
        raise HTTPException(status_code=400, detail="Invalid page type. Use 'login' or 'signup'")
    
    await db.auth_page_content.delete_one({"page_type": page_type})
    
    return {"success": True, "message": f"{page_type.capitalize()} page content reset to default"}
