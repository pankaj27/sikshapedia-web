"""
Lead Forms Routes - Register My Institute & Advertise With Us
Handles form submissions from footer modals
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import uuid
import os

router = APIRouter(prefix="/api/lead-forms", tags=["Lead Forms"])

# Get database connection
from server import get_db

# Models
class InstituteRegistrationForm(BaseModel):
    institute_name: str
    contact_person: str
    designation: Optional[str] = None
    email: EmailStr
    phone: str
    city: str
    state: str
    institute_type: str  # School, College, University, Coaching
    message: Optional[str] = None

class AdvertiseWithUsForm(BaseModel):
    company_name: str
    contact_person: str
    designation: Optional[str] = None
    email: EmailStr
    phone: str
    advertising_interest: str  # Banner Ads, Sponsored Listings, Featured Placement, Custom Campaign
    budget_range: Optional[str] = None
    message: Optional[str] = None


# Routes
@router.post("/register-institute")
async def register_institute(form_data: InstituteRegistrationForm):
    """Submit Register My Institute form"""
    try:
        db = get_db()
        
        submission = {
            "id": str(uuid.uuid4()),
            "form_type": "register_institute",
            **form_data.model_dump(),
            "status": "new",  # new, contacted, converted, closed
            "notes": None,
            "contacted_at": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.lead_form_submissions.insert_one(submission)
        
        return {
            "success": True,
            "message": "Thank you for registering! Our team will contact you within 24 hours.",
            "reference_id": submission["id"]
        }
    except Exception as e:
        print(f"Error submitting institute registration: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit form. Please try again.")


@router.post("/advertise-with-us")
async def advertise_with_us(form_data: AdvertiseWithUsForm):
    """Submit Advertise With Us form"""
    try:
        db = get_db()
        
        submission = {
            "id": str(uuid.uuid4()),
            "form_type": "advertise_with_us",
            **form_data.model_dump(),
            "status": "new",  # new, contacted, converted, closed
            "notes": None,
            "contacted_at": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.lead_form_submissions.insert_one(submission)
        
        return {
            "success": True,
            "message": "Thank you for your interest in advertising! Our team will reach out shortly.",
            "reference_id": submission["id"]
        }
    except Exception as e:
        print(f"Error submitting advertise form: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit form. Please try again.")


# Admin endpoints to view submissions
@router.get("/admin/submissions")
async def get_submissions(form_type: Optional[str] = None, status: Optional[str] = None, skip: int = 0, limit: int = 50):
    """Get all form submissions (admin only)"""
    try:
        db = get_db()
        
        query = {}
        if form_type:
            query["form_type"] = form_type
        if status:
            query["status"] = status
        
        submissions = await db.lead_form_submissions.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.lead_form_submissions.count_documents(query)
        
        return {
            "submissions": submissions,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        print(f"Error fetching submissions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch submissions")


@router.put("/admin/submissions/{submission_id}/status")
async def update_submission_status(submission_id: str, status: str, notes: Optional[str] = None):
    """Update submission status (admin only)"""
    try:
        db = get_db()
        
        valid_statuses = ["new", "contacted", "converted", "closed"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        update_data = {
            "status": status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if notes:
            update_data["notes"] = notes
        
        if status == "contacted":
            update_data["contacted_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.lead_form_submissions.update_one(
            {"id": submission_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return {"success": True, "message": f"Status updated to {status}"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating submission status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")


@router.get("/admin/stats")
async def get_submission_stats():
    """Get submission statistics (admin only)"""
    try:
        db = get_db()
        
        total = await db.lead_form_submissions.count_documents({})
        register_institute = await db.lead_form_submissions.count_documents({"form_type": "register_institute"})
        advertise = await db.lead_form_submissions.count_documents({"form_type": "advertise_with_us"})
        new_count = await db.lead_form_submissions.count_documents({"status": "new"})
        contacted = await db.lead_form_submissions.count_documents({"status": "contacted"})
        converted = await db.lead_form_submissions.count_documents({"status": "converted"})
        
        return {
            "total": total,
            "by_type": {
                "register_institute": register_institute,
                "advertise_with_us": advertise
            },
            "by_status": {
                "new": new_count,
                "contacted": contacted,
                "converted": converted
            }
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")
