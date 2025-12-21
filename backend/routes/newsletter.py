from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4
import csv
import io
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])

# Pydantic Models
class NewsletterSubscribe(BaseModel):
    email: EmailStr

class NewsletterSubscriber(BaseModel):
    id: str
    email: str
    subscribed_at: str
    status: str  # active, unsubscribed
    source: Optional[str] = "homepage"

class NewsletterResponse(BaseModel):
    success: bool
    message: str

# Subscribe to newsletter
@router.post("/subscribe", response_model=NewsletterResponse)
async def subscribe_newsletter(request: Request, data: NewsletterSubscribe):
    db = request.app.mongodb
    
    # Check if email already exists
    existing = await db.newsletter_subscribers.find_one({"email": data.email.lower()})
    if existing:
        if existing.get("status") == "active":
            return NewsletterResponse(success=True, message="You're already subscribed!")
        else:
            # Reactivate subscription
            await db.newsletter_subscribers.update_one(
                {"email": data.email.lower()},
                {"$set": {"status": "active", "subscribed_at": datetime.now(timezone.utc).isoformat()}}
            )
            return NewsletterResponse(success=True, message="Welcome back! Your subscription has been reactivated.")
    
    # Create new subscriber
    subscriber = {
        "id": str(uuid4()),
        "email": data.email.lower(),
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "status": "active",
        "source": "homepage"
    }
    
    await db.newsletter_subscribers.insert_one(subscriber)
    
    # Send welcome email using Resend
    try:
        await send_welcome_email(request, data.email)
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
        # Don't fail the subscription if email fails
    
    return NewsletterResponse(success=True, message="Successfully subscribed! Check your email for confirmation.")

# Send welcome email
async def send_welcome_email(request: Request, email: str):
    try:
        from emergentintegrations.llm.resend import send_email
        import os
        
        emergent_api_key = os.environ.get("EMERGENT_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
        if not emergent_api_key:
            print("No Emergent API key found for email")
            return
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
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
                    <a href="https://admissionbuddy.co" class="button">Explore Colleges</a>
                </div>
                <div class="footer">
                    <p>© 2024 AdmissionBuddy. All rights reserved.</p>
                    <p>If you didn't subscribe, you can ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        await send_email(
            emergent_api_key=emergent_api_key,
            to_email=email,
            subject="Welcome to AdmissionBuddy Newsletter! 🎓",
            html_content=html_content
        )
        print(f"Welcome email sent to {email}")
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        raise

# Unsubscribe from newsletter
@router.post("/unsubscribe", response_model=NewsletterResponse)
async def unsubscribe_newsletter(request: Request, data: NewsletterSubscribe):
    db = request.app.mongodb
    
    result = await db.newsletter_subscribers.update_one(
        {"email": data.email.lower()},
        {"$set": {"status": "unsubscribed"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Email not found in subscribers")
    
    return NewsletterResponse(success=True, message="Successfully unsubscribed. We're sorry to see you go!")

# Admin: Get all subscribers
@router.get("/subscribers", response_model=List[NewsletterSubscriber])
async def get_subscribers(request: Request, status: Optional[str] = None, skip: int = 0, limit: int = 100):
    db = request.app.mongodb
    
    query = {}
    if status:
        query["status"] = status
    
    subscribers = await db.newsletter_subscribers.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return subscribers

# Admin: Get subscriber count
@router.get("/subscribers/count")
async def get_subscriber_count(request: Request):
    db = request.app.mongodb
    
    total = await db.newsletter_subscribers.count_documents({})
    active = await db.newsletter_subscribers.count_documents({"status": "active"})
    unsubscribed = await db.newsletter_subscribers.count_documents({"status": "unsubscribed"})
    
    return {
        "total": total,
        "active": active,
        "unsubscribed": unsubscribed
    }

# Admin: Delete subscriber
@router.delete("/subscribers/{subscriber_id}")
async def delete_subscriber(request: Request, subscriber_id: str):
    db = request.app.mongodb
    
    result = await db.newsletter_subscribers.delete_one({"id": subscriber_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return {"success": True, "message": "Subscriber deleted"}

# Admin: Export subscribers to CSV
@router.get("/subscribers/export")
async def export_subscribers(request: Request, status: Optional[str] = "active"):
    db = request.app.mongodb
    
    query = {}
    if status and status != "all":
        query["status"] = status
    
    subscribers = await db.newsletter_subscribers.find(query, {"_id": 0}).to_list(10000)
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Subscribed At", "Status", "Source"])
    
    for sub in subscribers:
        writer.writerow([
            sub.get("email", ""),
            sub.get("subscribed_at", ""),
            sub.get("status", ""),
            sub.get("source", "")
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=newsletter_subscribers_{status}.csv"}
    )
