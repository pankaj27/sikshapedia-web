"""
Email Service using Resend API
Handles all email sending for the application
"""

import os
import asyncio
import logging
import resend
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@admissionbuddy.co')
REPLY_TO_EMAIL = os.environ.get('REPLY_TO_EMAIL', 'support@admissionbuddy.co')

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
    logger.info(f"Resend initialized with sender: {SENDER_EMAIL}")
else:
    logger.warning("RESEND_API_KEY not set - emails will not be sent")


async def send_email(
    to: str | List[str],
    subject: str,
    html_content: str,
    from_email: Optional[str] = None,
    reply_to: Optional[str] = None,
    cc: Optional[List[str]] = None,
    bcc: Optional[List[str]] = None,
    attachments: Optional[List[Dict]] = None
) -> Dict[str, Any]:
    """
    Send email using Resend API (async, non-blocking)
    
    Args:
        to: Recipient email(s)
        subject: Email subject
        html_content: HTML body content
        from_email: Override sender email
        reply_to: Override reply-to email
        cc: CC recipients
        bcc: BCC recipients
        attachments: List of attachments [{"filename": "file.pdf", "content": base64_string}]
    
    Returns:
        Dict with status, message, and email_id
    """
    if not RESEND_API_KEY:
        logger.error("Cannot send email: RESEND_API_KEY not configured")
        return {
            "status": "error",
            "message": "Email service not configured",
            "email_id": None
        }
    
    # Ensure 'to' is a list
    recipients = [to] if isinstance(to, str) else to
    
    # Build email params
    params: Dict[str, Any] = {
        "from": from_email or f"AdmissionBuddy <{SENDER_EMAIL}>",
        "to": recipients,
        "subject": subject,
        "html": html_content,
        "reply_to": reply_to or REPLY_TO_EMAIL
    }
    
    # Add optional fields
    if cc:
        params["cc"] = cc
    if bcc:
        params["bcc"] = bcc
    if attachments:
        params["attachments"] = attachments
    
    try:
        # Run sync SDK in thread to keep FastAPI non-blocking
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        
        email_id = email_response.get("id") if isinstance(email_response, dict) else getattr(email_response, 'id', None)
        
        logger.info(f"Email sent successfully to {recipients}, ID: {email_id}")
        return {
            "status": "success",
            "message": f"Email sent to {', '.join(recipients)}",
            "email_id": email_id
        }
    except Exception as e:
        logger.error(f"Failed to send email to {recipients}: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to send email: {str(e)}",
            "email_id": None
        }


async def send_otp_email(to: str, otp: str, user_name: str = "User") -> Dict[str, Any]:
    """Send OTP verification email"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .otp-box {{ background: white; border: 2px dashed #f97316; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
            .otp-code {{ font-size: 32px; font-weight: bold; color: #f97316; letter-spacing: 8px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Verify Your Email</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>Please use the following OTP to verify your email address:</p>
                <div class="otp-box">
                    <div class="otp-code">{otp}</div>
                    <p style="margin: 10px 0 0 0; color: #666;">One-Time Password</p>
                </div>
                <div class="warning">
                    <strong>⚠️ This OTP is valid for 10 minutes.</strong>
                    <p style="margin: 5px 0 0 0;">Do not share this code with anyone. Our team will never ask for your OTP.</p>
                </div>
                <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                <p>Need help? Contact us at support@admissionbuddy.co</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject="🔐 Your OTP for AdmissionBuddy Verification",
        html_content=html_content
    )


async def send_welcome_email(to: str, user_name: str = "Student") -> Dict[str, Any]:
    """Send welcome email to new users"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
            .features {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
            .feature-item {{ padding: 10px 0; border-bottom: 1px solid #eee; }}
            .feature-item:last-child {{ border-bottom: none; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to AdmissionBuddy! 🎓</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>Thank you for joining AdmissionBuddy! We're excited to help you find the perfect college.</p>
                
                <div class="features">
                    <h3 style="margin-top: 0;">What you can do now:</h3>
                    <div class="feature-item">📚 <strong>Explore 1000+ Colleges</strong> - Find your dream institution</div>
                    <div class="feature-item">📝 <strong>Apply Online</strong> - Easy application process</div>
                    <div class="feature-item">💬 <strong>Get Expert Counseling</strong> - Free career guidance</div>
                    <div class="feature-item">📊 <strong>Compare Colleges</strong> - Make informed decisions</div>
                    <div class="feature-item">🎯 <strong>Check Eligibility</strong> - Know your options</div>
                </div>
                
                <p style="text-align: center;">
                    <a href="https://admissionbuddy.co/colleges" class="button">Start Exploring Colleges</a>
                </p>
            </div>
            <div class="footer">
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                <p>Questions? Reply to this email or contact support@admissionbuddy.co</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject="🎓 Welcome to AdmissionBuddy - Let's Find Your Perfect College!",
        html_content=html_content
    )


async def send_admission_confirmation_email(
    to: str,
    user_name: str,
    college_name: str,
    course_name: str,
    application_id: str,
    amount_paid: float
) -> Dict[str, Any]:
    """Send admission application confirmation email"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .info-card {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }}
            .info-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }}
            .info-row:last-child {{ border-bottom: none; }}
            .label {{ color: #6b7280; }}
            .value {{ font-weight: 600; color: #111827; }}
            .success-badge {{ background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }}
            .button {{ display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Application Submitted Successfully!</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>Great news! Your admission application has been successfully submitted. Here are your details:</p>
                
                <div class="info-card">
                    <span class="success-badge">✓ Payment Confirmed</span>
                    <div class="info-row">
                        <span class="label">Application ID</span>
                        <span class="value">{application_id}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">College</span>
                        <span class="value">{college_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Course</span>
                        <span class="value">{course_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Amount Paid</span>
                        <span class="value">₹{amount_paid:,.2f}</span>
                    </div>
                </div>
                
                <h3>What happens next?</h3>
                <ol>
                    <li>The college will review your application</li>
                    <li>You'll receive updates via email and SMS</li>
                    <li>Track your application status in your dashboard</li>
                </ol>
                
                <p style="text-align: center;">
                    <a href="https://admissionbuddy.co/dashboard" class="button">Track Application</a>
                </p>
            </div>
            <div class="footer">
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                <p>Questions? Contact support@admissionbuddy.co</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject=f"✅ Application Confirmed - {college_name}",
        html_content=html_content
    )


async def send_lead_notification_email(
    to: str,
    lead_name: str,
    lead_email: str,
    lead_phone: str,
    college_name: str,
    course_name: str,
    lead_source: str = "Website"
) -> Dict[str, Any]:
    """Send notification to admin/institute about new lead"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .lead-card {{ background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }}
            .lead-row {{ padding: 12px 0; border-bottom: 1px solid #f3f4f6; }}
            .lead-row:last-child {{ border-bottom: none; }}
            .label {{ color: #6b7280; font-size: 12px; text-transform: uppercase; }}
            .value {{ font-weight: 600; color: #111827; font-size: 16px; }}
            .button {{ display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }}
            .urgent {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 New Lead Received!</h1>
            </div>
            <div class="content">
                <div class="urgent">
                    <strong>⚡ Action Required:</strong> A new student has shown interest. Contact them within 24 hours for best conversion.
                </div>
                
                <div class="lead-card">
                    <div class="lead-row">
                        <div class="label">Student Name</div>
                        <div class="value">{lead_name}</div>
                    </div>
                    <div class="lead-row">
                        <div class="label">Email</div>
                        <div class="value">{lead_email}</div>
                    </div>
                    <div class="lead-row">
                        <div class="label">Phone</div>
                        <div class="value">{lead_phone}</div>
                    </div>
                    <div class="lead-row">
                        <div class="label">Interested In</div>
                        <div class="value">{college_name}</div>
                    </div>
                    <div class="lead-row">
                        <div class="label">Course</div>
                        <div class="value">{course_name}</div>
                    </div>
                    <div class="lead-row">
                        <div class="label">Source</div>
                        <div class="value">{lead_source}</div>
                    </div>
                </div>
                
                <p style="text-align: center; margin-top: 30px;">
                    <a href="https://admissionbuddy.co/admin/leads" class="button">View in Dashboard</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject=f"🔔 New Lead: {lead_name} - {college_name}",
        html_content=html_content
    )


async def send_password_reset_email(to: str, reset_link: str, user_name: str = "User") -> Dict[str, Any]:
    """Send password reset email"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #f97316; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; }}
            .warning {{ background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" class="button">Reset Password</a>
                </p>
                
                <div class="warning">
                    <strong>⚠️ This link expires in 1 hour.</strong>
                    <p style="margin: 5px 0 0 0;">If you didn't request this password reset, please ignore this email or contact support if you're concerned.</p>
                </div>
                
                <p style="font-size: 12px; color: #666;">
                    Can't click the button? Copy this link: <br>
                    <code style="background: #e5e7eb; padding: 5px; border-radius: 3px; word-break: break-all;">{reset_link}</code>
                </p>
            </div>
            <div class="footer">
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject="🔐 Reset Your AdmissionBuddy Password",
        html_content=html_content
    )


async def send_newsletter_welcome_email(to: str) -> Dict[str, Any]:
    """Send welcome email to newsletter subscribers"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to AdmissionBuddy! 🎓</h1>
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
                <a href="https://admissionbuddy.co/colleges" class="button">Explore Colleges</a>
            </div>
            <div class="footer">
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                <p>If you didn't subscribe, you can ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject="🎓 Welcome to AdmissionBuddy Newsletter!",
        html_content=html_content
    )


async def send_institute_credentials_email(
    to: str,
    institute_name: str,
    institute_id: str,
    login_email: str,
    temp_password: str
) -> Dict[str, Any]:
    """Send login credentials to newly registered institute"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .credentials-box {{ background: white; padding: 20px; border-radius: 8px; border: 2px solid #f97316; margin: 20px 0; }}
            .cred-row {{ padding: 12px 0; border-bottom: 1px solid #f3f4f6; }}
            .cred-row:last-child {{ border-bottom: none; }}
            .button {{ display: inline-block; background: #f97316; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to AdmissionBuddy! 🏫</h1>
                <p>Your institute registration is confirmed</p>
            </div>
            <div class="content">
                <p>Dear <strong>{institute_name}</strong>,</p>
                <p>Congratulations! Your institute has been successfully registered on AdmissionBuddy. Below are your login credentials:</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #f97316;">🔐 Login Credentials</h3>
                    <div class="cred-row">
                        <strong>Institute ID:</strong> {institute_id}
                    </div>
                    <div class="cred-row">
                        <strong>Email:</strong> {login_email}
                    </div>
                    <div class="cred-row">
                        <strong>Temporary Password:</strong> {temp_password}
                    </div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> Please change your password after your first login for security.
                </div>
                
                <p style="text-align: center; margin-top: 30px;">
                    <a href="https://admissionbuddy.co/institute/login" class="button">Login to Dashboard</a>
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
                <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                <p>Need help? Contact support@admissionbuddy.co</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await send_email(
        to=to,
        subject=f"🏫 Welcome to AdmissionBuddy - {institute_name}",
        html_content=html_content
    )
