"""
Lead/Inquiry Management Routes
Handles lead capture, management, notifications and settings
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import os
import logging
import jwt
import csv
import io
import asyncio

# External services
import resend
from twilio.rest import Client as TwilioClient

# Create router
leads_router = APIRouter(prefix="/api", tags=["Leads"])
security = HTTPBearer(auto_error=False)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

# Resend Email Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER', '')
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception as e:
        logging.error(f"Failed to initialize Twilio client: {e}")

# Database will be injected from main app
db = None

def set_database(database):
    """Set the database instance from main app"""
    global db
    db = database

# ============================================
# Pydantic Models
# ============================================

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # User Info
    name: str
    email: EmailStr
    mobile: str
    city: str
    course_interested: str
    
    # College Info (for college-specific forms)
    college_id: Optional[str] = None
    college_name: Optional[str] = None
    
    # Source & Tracking
    source: str = "general"
    form_heading: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    
    # Status & Follow-up
    status: str = "new"
    notes: Optional[str] = None
    assigned_to: Optional[str] = None
    contacted_at: Optional[datetime] = None
    converted_at: Optional[datetime] = None
    
    # Notifications
    email_sent: bool = False
    whatsapp_sent: bool = False
    whatsapp_message_sid: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    city: str
    course_interested: str
    college_id: Optional[str] = None
    college_name: Optional[str] = None
    source: str = "general"
    form_heading: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

class LeadSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "lead-settings"
    
    # General Form Settings
    general_form_heading: str = "Get Expert Counselling"
    general_form_subheading: str = "Fill the form and our team will get back to you within 24 hours"
    general_form_enabled: bool = True
    
    # CTA Button Settings
    cta_button_text: str = "Apply Now"
    cta_button_color: str = "#f97316"
    show_floating_cta: bool = True
    show_header_cta: bool = True
    
    # Notification Settings
    notification_emails: List[str] = []
    default_notification_email: str = ""
    enable_email_notifications: bool = True
    enable_whatsapp_notifications: bool = True
    whatsapp_business_number: str = ""
    
    # Message Templates
    email_subject: str = "Thank you for your inquiry - {college_name}"
    email_template: str = ""
    whatsapp_message_template: str = ""
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============================================
# Helper Functions
# ============================================

async def send_lead_email_notification(lead: dict, settings: dict):
    """Send email notification for new lead"""
    if not RESEND_API_KEY or not settings.get('enable_email_notifications', True):
        return False
    
    try:
        notification_emails = settings.get('notification_emails', [])
        default_email = settings.get('default_notification_email', '')
        
        to_emails = notification_emails if notification_emails else ([default_email] if default_email else [])
        if not to_emails:
            logging.warning("No notification emails configured for leads")
            return False
        
        college_name = lead.get('college_name', 'General Inquiry')
        subject = settings.get('email_subject', 'New Lead - {college_name}').format(
            college_name=college_name,
            name=lead.get('name', ''),
            course_interested=lead.get('course_interested', '')
        )
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">New Lead Received! 🎉</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Lead Details:</h3>
                <p><strong>Name:</strong> {lead.get('name', '')}</p>
                <p><strong>Email:</strong> {lead.get('email', '')}</p>
                <p><strong>Mobile:</strong> {lead.get('mobile', '')}</p>
                <p><strong>City:</strong> {lead.get('city', '')}</p>
                <p><strong>Course Interested:</strong> {lead.get('course_interested', '')}</p>
                <p><strong>College:</strong> {college_name}</p>
                <p><strong>Source:</strong> {lead.get('source', 'general')}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
                Login to your admin panel to follow up with this lead.
            </p>
        </div>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": to_emails,
            "subject": subject,
            "html": html_content
        }
        
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Lead notification email sent to {to_emails}")
        return True
    except Exception as e:
        logging.error(f"Failed to send lead email notification: {e}")
        return False

async def send_lead_whatsapp_notification(lead: dict, settings: dict):
    """Send WhatsApp notification to the lead"""
    if not twilio_client or not settings.get('enable_whatsapp_notifications', True):
        return None
    
    if not TWILIO_WHATSAPP_NUMBER:
        logging.warning("Twilio WhatsApp number not configured")
        return None
    
    try:
        college_name = lead.get('college_name', 'Admissionbuddy')
        message_template = settings.get('whatsapp_message_template', '')
        
        message_text = message_template.format(
            name=lead.get('name', ''),
            college_name=college_name,
            course_interested=lead.get('course_interested', ''),
            mobile=lead.get('mobile', ''),
            email=lead.get('email', ''),
            city=lead.get('city', '')
        )
        
        mobile = lead.get('mobile', '')
        if not mobile.startswith('+'):
            mobile = '+91' + mobile
        
        to_number = f"whatsapp:{mobile}"
        
        message = twilio_client.messages.create(
            body=message_text,
            from_=f"whatsapp:{TWILIO_WHATSAPP_NUMBER}",
            to=to_number
        )
        
        logging.info(f"WhatsApp message sent to {mobile}, SID: {message.sid}")
        return message.sid
    except Exception as e:
        logging.error(f"Failed to send WhatsApp notification: {e}")
        return None

def verify_admin_token(credentials: HTTPAuthorizationCredentials):
    """Verify admin JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") not in ["super_admin", "content_manager", "admin"]:
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================
# API Endpoints
# ============================================

@leads_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    """Create a new lead/inquiry and send notifications"""
    lead = Lead(
        **lead_data.model_dump(),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    lead_dict = lead.model_dump()
    
    if isinstance(lead_dict.get('created_at'), datetime):
        lead_dict['created_at'] = lead_dict['created_at'].isoformat()
    if isinstance(lead_dict.get('updated_at'), datetime):
        lead_dict['updated_at'] = lead_dict['updated_at'].isoformat()
    
    await db.leads.insert_one(lead_dict)
    
    settings = await db.lead_settings.find_one({"id": "lead-settings"}, {"_id": 0})
    if not settings:
        settings = LeadSettings().model_dump()
    
    try:
        email_sent = await send_lead_email_notification(lead_dict, settings)
        whatsapp_sid = await send_lead_whatsapp_notification(lead_dict, settings)
        
        update_data = {
            "email_sent": email_sent,
            "whatsapp_sent": whatsapp_sid is not None,
            "whatsapp_message_sid": whatsapp_sid
        }
        await db.leads.update_one({"id": lead.id}, {"$set": update_data})
        lead_dict.update(update_data)
    except Exception as e:
        logging.error(f"Error sending lead notifications: {e}")
    
    lead_dict.pop('_id', None)
    return lead_dict

@leads_router.get("/leads")
async def get_leads(
    status: Optional[str] = None,
    college_id: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    skip: int = Query(0, ge=0),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all leads with filters (Admin only)"""
    verify_admin_token(credentials)
    
    query = {}
    if status:
        query["status"] = status
    if college_id:
        query["college_id"] = college_id
    if source:
        query["source"] = source
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"mobile": {"$regex": search, "$options": "i"}},
            {"college_name": {"$regex": search, "$options": "i"}}
        ]
    if start_date:
        query["created_at"] = {"$gte": start_date}
    if end_date:
        if "created_at" in query:
            query["created_at"]["$lte"] = end_date
        else:
            query["created_at"] = {"$lte": end_date}
    
    total = await db.leads.count_documents(query)
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "leads": leads,
        "total": total,
        "limit": limit,
        "skip": skip
    }

@leads_router.get("/leads/export")
async def export_leads(
    status: Optional[str] = None,
    college_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Export leads as CSV (Admin only)"""
    verify_admin_token(credentials)
    
    query = {}
    if status:
        query["status"] = status
    if college_id:
        query["college_id"] = college_id
    if start_date:
        query["created_at"] = {"$gte": start_date}
    if end_date:
        if "created_at" in query:
            query["created_at"]["$lte"] = end_date
        else:
            query["created_at"] = {"$lte": end_date}
    
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    output = io.StringIO()
    fieldnames = ["id", "name", "email", "mobile", "city", "course_interested", "college_name", "source", "status", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    
    for lead in leads:
        writer.writerow(lead)
    
    csv_content = output.getvalue()
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=leads_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    )

@leads_router.get("/leads/{lead_id}")
async def get_lead(lead_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get a specific lead by ID (Admin only)"""
    verify_admin_token(credentials)
    
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@leads_router.put("/leads/{lead_id}")
async def update_lead(
    lead_id: str,
    update_data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update lead status/notes (Admin only)"""
    verify_admin_token(credentials)
    
    allowed_fields = ["status", "notes", "assigned_to", "contacted_at", "converted_at"]
    update_dict = {k: v for k, v in update_data.items() if k in allowed_fields}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if update_dict.get("status") == "contacted" and not update_dict.get("contacted_at"):
        update_dict["contacted_at"] = datetime.now(timezone.utc).isoformat()
    if update_dict.get("status") == "converted" and not update_dict.get("converted_at"):
        update_dict["converted_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.leads.update_one({"id": lead_id}, {"$set": update_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return lead

@leads_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Delete a lead (Admin only)"""
    payload = verify_admin_token(credentials)
    if payload.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Super admin access required")
    
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True, "message": "Lead deleted"}

# Lead Settings APIs
@leads_router.get("/lead-settings")
async def get_lead_settings():
    """Get lead form settings"""
    settings = await db.lead_settings.find_one({"id": "lead-settings"}, {"_id": 0})
    if not settings:
        settings = LeadSettings().model_dump()
        if isinstance(settings.get('created_at'), datetime):
            settings['created_at'] = settings['created_at'].isoformat()
        if isinstance(settings.get('updated_at'), datetime):
            settings['updated_at'] = settings['updated_at'].isoformat()
    return settings

@leads_router.put("/lead-settings")
async def update_lead_settings(
    settings_data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update lead form settings (Admin only)"""
    verify_admin_token(credentials)
    
    settings_data["id"] = "lead-settings"
    settings_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.lead_settings.update_one(
        {"id": "lead-settings"},
        {"$set": settings_data},
        upsert=True
    )
    
    settings = await db.lead_settings.find_one({"id": "lead-settings"}, {"_id": 0})
    return settings
