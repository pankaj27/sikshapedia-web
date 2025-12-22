from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4

router = APIRouter(prefix="/api/admin/email", tags=["Email Management"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# ============================================
# Pydantic Models
# ============================================

class EmailSettings(BaseModel):
    sender_name: str = "admissionbuddy"
    sender_email: str = "noreply@admissionbuddy.co"
    reply_to_email: str = "support@admissionbuddy.co"
    email_provider: str = "resend"  # resend, sendgrid, smtp
    footer_text: str = "© 2024 admissionbuddy. All rights reserved."
    logo_url: str = "/assets/main-logo.png"
    primary_color: str = "#f97316"
    
class EmailSettingsResponse(BaseModel):
    id: str
    sender_name: str
    sender_email: str
    reply_to_email: str
    email_provider: str
    footer_text: str
    logo_url: str
    primary_color: str
    updated_at: str

class EmailTemplate(BaseModel):
    template_key: str  # unique identifier like 'newsletter_welcome', 'password_reset'
    name: str  # Display name like "Newsletter Welcome Email"
    subject: str
    html_content: str
    is_active: bool = True
    variables: List[str] = []  # List of available variables like ['user_name', 'user_email']

class EmailTemplateResponse(BaseModel):
    id: str
    template_key: str
    name: str
    subject: str
    html_content: str
    is_active: bool
    variables: List[str]
    created_at: str
    updated_at: str

# ============================================
# Default Templates
# ============================================

DEFAULT_TEMPLATES = [
    {
        "template_key": "newsletter_welcome",
        "name": "Newsletter Welcome Email",
        "subject": "Welcome to admissionbuddy Newsletter! 🎓",
        "variables": ["user_email"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, {{primary_color}}, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: {{primary_color}}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{sender_name}}! 🎓</h1>
        </div>
        <div class="content">
            <h2>Thanks for subscribing!</h2>
            <p>You're now part of our community. Here's what you can expect:</p>
            <ul>
                <li>📅 Latest admission dates and deadlines</li>
                <li>📚 Exam notifications and preparation tips</li>
                <li>🏫 New college listings and reviews</li>
                <li>💡 Career guidance and counseling updates</li>
            </ul>
            <p>Stay tuned for valuable updates that will help you in your educational journey!</p>
            <a href="{{website_url}}" class="button">Explore Colleges</a>
        </div>
        <div class="footer">
            <p>{{footer_text}}</p>
            <p>If you didn't subscribe, you can ignore this email.</p>
        </div>
    </div>
</body>
</html>
"""
    },
    {
        "template_key": "contact_form_reply",
        "name": "Contact Form Auto-Reply",
        "subject": "We received your message - {{sender_name}}",
        "variables": ["user_name", "user_email", "message"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: {{primary_color}}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid {{primary_color}}; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thank You for Contacting Us!</h2>
        </div>
        <div class="content">
            <p>Dear {{user_name}},</p>
            <p>We have received your message and our team will get back to you within 24-48 hours.</p>
            <div class="message-box">
                <strong>Your Message:</strong>
                <p>{{message}}</p>
            </div>
            <p>If you have any urgent queries, please call us at our helpline.</p>
            <p>Best regards,<br>{{sender_name}} Team</p>
        </div>
        <div class="footer">
            <p>{{footer_text}}</p>
        </div>
    </div>
</body>
</html>
"""
    },
    {
        "template_key": "admission_inquiry",
        "name": "Admission Inquiry Confirmation",
        "subject": "Your Admission Inquiry Received - {{college_name}}",
        "variables": ["user_name", "user_email", "college_name", "course_name", "inquiry_id"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: {{primary_color}}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .button { display: inline-block; background: {{primary_color}}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Admission Inquiry Received! 📋</h2>
        </div>
        <div class="content">
            <p>Dear {{user_name}},</p>
            <p>Thank you for your interest in <strong>{{college_name}}</strong>. We have received your admission inquiry.</p>
            <div class="info-box">
                <h3 style="margin-top: 0;">Inquiry Details</h3>
                <div class="info-row"><span>Reference ID:</span> <strong>{{inquiry_id}}</strong></div>
                <div class="info-row"><span>College:</span> <strong>{{college_name}}</strong></div>
                <div class="info-row"><span>Course:</span> <strong>{{course_name}}</strong></div>
            </div>
            <p>The college admissions team will contact you shortly. You can also track your application status in your dashboard.</p>
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{website_url}}/dashboard" class="button">View Dashboard</a>
            </p>
        </div>
        <div class="footer">
            <p>{{footer_text}}</p>
        </div>
    </div>
</body>
</html>
"""
    },
    {
        "template_key": "password_reset",
        "name": "Password Reset Email",
        "subject": "Reset Your Password - {{sender_name}}",
        "variables": ["user_name", "reset_link", "expiry_time"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: {{primary_color}}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: {{primary_color}}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request 🔐</h2>
        </div>
        <div class="content">
            <p>Hi {{user_name}},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{reset_link}}" class="button">Reset Password</a>
            </p>
            <div class="warning">
                <strong>⚠️ This link will expire in {{expiry_time}}.</strong>
                <p style="margin: 0;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            </div>
        </div>
        <div class="footer">
            <p>{{footer_text}}</p>
        </div>
    </div>
</body>
</html>
"""
    },
    {
        "template_key": "lead_notification",
        "name": "New Lead Notification (Admin)",
        "subject": "🔔 New Lead: {{user_name}} - {{college_name}}",
        "variables": ["user_name", "user_email", "user_phone", "college_name", "course_name", "lead_source"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .lead-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .lead-row { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .lead-row:last-child { border-bottom: none; }
        .label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .value { font-weight: 600; color: #111827; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 New Lead Received!</h2>
        </div>
        <div class="content">
            <div class="lead-card">
                <div class="lead-row">
                    <div class="label">Student Name</div>
                    <div class="value">{{user_name}}</div>
                </div>
                <div class="lead-row">
                    <div class="label">Email</div>
                    <div class="value">{{user_email}}</div>
                </div>
                <div class="lead-row">
                    <div class="label">Phone</div>
                    <div class="value">{{user_phone}}</div>
                </div>
                <div class="lead-row">
                    <div class="label">Interested In</div>
                    <div class="value">{{college_name}}</div>
                </div>
                <div class="lead-row">
                    <div class="label">Course</div>
                    <div class="value">{{course_name}}</div>
                </div>
                <div class="lead-row">
                    <div class="label">Source</div>
                    <div class="value">{{lead_source}}</div>
                </div>
            </div>
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{website_url}}/admin/leads" class="button">View in Admin Panel</a>
            </p>
        </div>
    </div>
</body>
</html>
"""
    },
    {
        "template_key": "institute_registration",
        "name": "Institute Registration Confirmation",
        "subject": "Welcome to {{sender_name}} - Institute Registration Confirmed",
        "variables": ["institute_name", "institute_id", "login_email", "temp_password"],
        "html_content": """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, {{primary_color}}, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid {{primary_color}}; margin: 20px 0; }
        .cred-row { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .button { display: inline-block; background: {{primary_color}}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{sender_name}}! 🏫</h1>
            <p>Your institute registration is confirmed</p>
        </div>
        <div class="content">
            <p>Dear <strong>{{institute_name}}</strong>,</p>
            <p>Congratulations! Your institute has been successfully registered on our platform. Below are your login credentials:</p>
            <div class="credentials-box">
                <h3 style="margin-top: 0; color: {{primary_color}};">🔐 Login Credentials</h3>
                <div class="cred-row">
                    <strong>Institute ID:</strong> {{institute_id}}
                </div>
                <div class="cred-row">
                    <strong>Email:</strong> {{login_email}}
                </div>
                <div class="cred-row">
                    <strong>Temporary Password:</strong> {{temp_password}}
                </div>
            </div>
            <p><strong>⚠️ Important:</strong> Please change your password after your first login.</p>
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{website_url}}/institute/login" class="button">Login to Dashboard</a>
            </p>
            <h3>What's Next?</h3>
            <ul>
                <li>Complete your institute profile</li>
                <li>Add courses and programs</li>
                <li>Upload images and brochures</li>
                <li>Start receiving student inquiries</li>
            </ul>
        </div>
        <div class="footer">
            <p>{{footer_text}}</p>
            <p>Need help? Contact our support team.</p>
        </div>
    </div>
</body>
</html>
"""
    }
]

# ============================================
# Email Settings Endpoints
# ============================================

@router.get("/settings", response_model=EmailSettingsResponse)
async def get_email_settings():
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    settings = await db.email_settings.find_one({}, {"_id": 0})
    
    if not settings:
        # Create default settings
        default_settings = {
            "id": str(uuid4()),
            "sender_name": "admissionbuddy",
            "sender_email": "noreply@admissionbuddy.co",
            "reply_to_email": "support@admissionbuddy.co",
            "email_provider": "resend",
            "footer_text": "© 2024 admissionbuddy. All rights reserved.",
            "logo_url": "/assets/main-logo.png",
            "primary_color": "#f97316",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.email_settings.insert_one(default_settings)
        return default_settings
    
    return settings

@router.put("/settings", response_model=EmailSettingsResponse)
async def update_email_settings(settings: EmailSettings):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    existing = await db.email_settings.find_one({})
    
    update_data = {
        **settings.dict(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if existing:
        update_data["id"] = existing.get("id", str(uuid4()))
        await db.email_settings.update_one({}, {"$set": update_data})
    else:
        update_data["id"] = str(uuid4())
        await db.email_settings.insert_one(update_data)
    
    return await db.email_settings.find_one({}, {"_id": 0})

# ============================================
# Email Templates Endpoints
# ============================================

@router.get("/templates", response_model=List[EmailTemplateResponse])
async def get_email_templates():
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    templates = await db.email_templates.find({}, {"_id": 0}).to_list(100)
    
    # If no templates exist, initialize with defaults
    if not templates:
        now = datetime.now(timezone.utc).isoformat()
        for template in DEFAULT_TEMPLATES:
            template_doc = {
                "id": str(uuid4()),
                **template,
                "is_active": True,
                "created_at": now,
                "updated_at": now
            }
            await db.email_templates.insert_one(template_doc)
        
        templates = await db.email_templates.find({}, {"_id": 0}).to_list(100)
    
    return templates

@router.get("/templates/{template_key}", response_model=EmailTemplateResponse)
async def get_email_template(template_key: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    template = await db.email_templates.find_one({"template_key": template_key}, {"_id": 0})
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template

@router.put("/templates/{template_key}", response_model=EmailTemplateResponse)
async def update_email_template(template_key: str, template: EmailTemplate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    existing = await db.email_templates.find_one({"template_key": template_key})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Template not found")
    
    update_data = {
        **template.dict(),
        "id": existing.get("id"),
        "created_at": existing.get("created_at"),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.email_templates.update_one(
        {"template_key": template_key},
        {"$set": update_data}
    )
    
    return await db.email_templates.find_one({"template_key": template_key}, {"_id": 0})

@router.post("/templates", response_model=EmailTemplateResponse)
async def create_email_template(template: EmailTemplate):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    # Check if template_key already exists
    existing = await db.email_templates.find_one({"template_key": template.template_key})
    if existing:
        raise HTTPException(status_code=400, detail="Template with this key already exists")
    
    now = datetime.now(timezone.utc).isoformat()
    template_doc = {
        "id": str(uuid4()),
        **template.dict(),
        "created_at": now,
        "updated_at": now
    }
    
    await db.email_templates.insert_one(template_doc)
    
    return await db.email_templates.find_one({"template_key": template.template_key}, {"_id": 0})

@router.delete("/templates/{template_key}")
async def delete_email_template(template_key: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    result = await db.email_templates.delete_one({"template_key": template_key})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {"success": True, "message": "Template deleted"}

@router.post("/templates/{template_key}/preview")
async def preview_email_template(template_key: str):
    """Generate a preview of the email template with sample data"""
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    template = await db.email_templates.find_one({"template_key": template_key}, {"_id": 0})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    settings = await db.email_settings.find_one({}, {"_id": 0})
    if not settings:
        settings = {
            "sender_name": "admissionbuddy",
            "primary_color": "#f97316",
            "footer_text": "© 2024 admissionbuddy. All rights reserved."
        }
    
    # Sample data for preview
    sample_data = {
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "user_phone": "+91 9876543210",
        "college_name": "IIT Delhi",
        "course_name": "B.Tech Computer Science",
        "inquiry_id": "INQ-2024-001",
        "reset_link": "https://example.com/reset?token=sample",
        "expiry_time": "24 hours",
        "institute_name": "ABC College",
        "institute_id": "INST-001",
        "login_email": "admin@college.com",
        "temp_password": "TempPass123!",
        "lead_source": "Website",
        "message": "I am interested in admission for the upcoming session.",
        "sender_name": settings.get("sender_name", "admissionbuddy"),
        "primary_color": settings.get("primary_color", "#f97316"),
        "footer_text": settings.get("footer_text", "© 2024 admissionbuddy"),
        "website_url": "https://admissionbuddy.co"
    }
    
    # Replace variables in template
    html_content = template["html_content"]
    subject = template["subject"]
    
    for key, value in sample_data.items():
        html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
        subject = subject.replace(f"{{{{{key}}}}}", str(value))
    
    return {
        "subject": subject,
        "html_content": html_content
    }

@router.post("/templates/reset-defaults")
async def reset_templates_to_defaults():
    """Reset all templates to their default values"""
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    # Delete all existing templates
    await db.email_templates.delete_many({})
    
    # Insert defaults
    now = datetime.now(timezone.utc).isoformat()
    for template in DEFAULT_TEMPLATES:
        template_doc = {
            "id": str(uuid4()),
            **template,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        await db.email_templates.insert_one(template_doc)
    
    return {"success": True, "message": "Templates reset to defaults"}


# ============================================
# Test Email Endpoint
# ============================================

class TestEmailRequest(BaseModel):
    recipient_email: EmailStr
    template_key: Optional[str] = None  # Optional: use a template

@router.post("/test")
async def send_test_email(request: TestEmailRequest):
    """Send a test email to verify Resend configuration"""
    import os
    import asyncio
    import resend
    
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@admissionbuddy.co')
    REPLY_TO_EMAIL = os.environ.get('REPLY_TO_EMAIL', 'support@admissionbuddy.co')
    
    if not RESEND_API_KEY:
        raise HTTPException(status_code=500, detail="RESEND_API_KEY not configured")
    
    resend.api_key = RESEND_API_KEY
    
    # Get template if specified
    html_content = None
    subject = "🧪 Test Email from AdmissionBuddy"
    
    if request.template_key and db:
        template = await db.email_templates.find_one({"template_key": request.template_key}, {"_id": 0})
        if template:
            settings = await db.email_settings.find_one({}, {"_id": 0}) or {}
            
            # Replace variables with sample data
            sample_data = {
                "user_name": "Test User",
                "user_email": request.recipient_email,
                "user_phone": "+91 9876543210",
                "college_name": "IIT Delhi",
                "course_name": "B.Tech Computer Science",
                "inquiry_id": "TEST-001",
                "reset_link": "https://admissionbuddy.co/reset?token=test",
                "expiry_time": "24 hours",
                "institute_name": "Test Institute",
                "institute_id": "INST-TEST",
                "login_email": "admin@test.com",
                "temp_password": "TestPass123!",
                "lead_source": "Email Test",
                "message": "This is a test message.",
                "sender_name": settings.get("sender_name", "AdmissionBuddy"),
                "primary_color": settings.get("primary_color", "#f97316"),
                "footer_text": settings.get("footer_text", "© 2024 AdmissionBuddy"),
                "website_url": "https://admissionbuddy.co"
            }
            
            html_content = template["html_content"]
            subject = template["subject"]
            
            for key, value in sample_data.items():
                html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
                subject = subject.replace(f"{{{{{key}}}}}", str(value))
    
    if not html_content:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .success {{ background: #d1fae5; color: #065f46; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧪 Test Email</h1>
                </div>
                <div class="content">
                    <div class="success">
                        <strong>✅ Resend Configuration Working!</strong>
                    </div>
                    <p>This is a test email from AdmissionBuddy to verify your Resend email configuration.</p>
                    <p><strong>Configuration Details:</strong></p>
                    <ul>
                        <li>Sender: {SENDER_EMAIL}</li>
                        <li>Reply-To: {REPLY_TO_EMAIL}</li>
                        <li>Recipient: {request.recipient_email}</li>
                    </ul>
                    <p>If you received this email, your Resend integration is working correctly! 🎉</p>
                </div>
                <div class="footer">
                    <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    try:
        params = {
            "from": f"AdmissionBuddy <{SENDER_EMAIL}>",
            "to": [request.recipient_email],
            "subject": subject,
            "html": html_content,
            "reply_to": REPLY_TO_EMAIL
        }
        
        # Run sync SDK in thread to keep FastAPI non-blocking
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        
        email_id = email_response.get("id") if isinstance(email_response, dict) else getattr(email_response, 'id', None)
        
        return {
            "success": True,
            "message": f"Test email sent to {request.recipient_email}",
            "email_id": email_id,
            "sender": SENDER_EMAIL,
            "reply_to": REPLY_TO_EMAIL
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
