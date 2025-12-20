"""
Admission Booking Routes - Admission Partner System
Handles admission bookings, payments, and approval workflow
"""
from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File, BackgroundTasks, Query
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
import os
import razorpay
import hmac
import hashlib

# Resend for Email
import resend

router = APIRouter(prefix="/admission", tags=["Admission Booking"])

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

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Initialize Razorpay client
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Indian States and Cities
INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

# Major cities by state (simplified - can be expanded)
INDIAN_CITIES = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
    "Delhi": ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Noida", "Ghaziabad"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    "Ladakh": ["Leh", "Kargil"],
    "Chandigarh": ["Chandigarh"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Lakshadweep": ["Kavaratti"]
}

# ============ MODELS ============

class EntityFeeSettings(BaseModel):
    form_fee: float = 1000.0
    platform_fee: float = 250.0
    gst_percentage: float = 18.0

class AdmissionSettings(BaseModel):
    id: str = "admission_settings"
    college: EntityFeeSettings = EntityFeeSettings(form_fee=1000.0, platform_fee=250.0, gst_percentage=18.0)
    school: EntityFeeSettings = EntityFeeSettings(form_fee=500.0, platform_fee=150.0, gst_percentage=18.0)
    university: EntityFeeSettings = EntityFeeSettings(form_fee=1500.0, platform_fee=350.0, gst_percentage=18.0)
    updated_at: Optional[str] = None
    updated_by: Optional[str] = None

class AdmissionBookingCreate(BaseModel):
    institution_id: str
    institution_type: str  # school, college, university
    institution_name: str
    
    # Student Details
    student_name: str
    father_name: str
    mother_name: str
    dob: str  # YYYY-MM-DD
    address: str
    state: str
    city: str
    pin: str
    course_or_class: str
    aadhaar_number: str
    mobile: str
    email: EmailStr
    last_qualification: str  # For school: "Class 9", For college: "12th with 85%"
    
    # Document URLs (uploaded separately)
    photo_url: Optional[str] = None
    aadhaar_doc_url: Optional[str] = None
    qualification_doc_url: Optional[str] = None

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    booking_id: str

class BookingStatusUpdate(BaseModel):
    status: str  # approved, rejected
    comments: Optional[str] = None

# ============ AUTH HELPER ============

async def get_current_user(request: Request, db):
    """Get current authenticated user from token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    
    # Try user session first
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if session:
        expires_at = datetime.fromisoformat(session["expires_at"].replace('Z', '+00:00'))
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Session expired")
        
        user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
        if user:
            return user
    
    raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_institute(request: Request, db):
    """Get current authenticated institute from token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    
    # Check institute sessions
    session = await db.institute_sessions.find_one({"session_token": token}, {"_id": 0})
    if session:
        expires_at = datetime.fromisoformat(session["expires_at"].replace('Z', '+00:00'))
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Session expired")
        
        institute = await db.institute_credentials.find_one(
            {"institution_id": session["institution_id"]}, 
            {"_id": 0}
        )
        if institute:
            return institute
    
    raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(request: Request, db):
    """Get current authenticated admin user"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    
    # Decode JWT token
    import jwt
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ EMAIL HELPERS ============

async def send_booking_email_to_user(booking: dict, user_email: str):
    """Send confirmation email to user"""
    if not RESEND_API_KEY:
        return
    
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": user_email,
            "subject": f"Admission Application Submitted - {booking['institution_name']}",
            "html": f"""
            <h2>Admission Application Submitted Successfully!</h2>
            <p>Dear {booking['student_name']},</p>
            <p>Your admission application has been submitted successfully.</p>
            <h3>Application Details:</h3>
            <ul>
                <li><strong>Application ID:</strong> {booking['id']}</li>
                <li><strong>Institution:</strong> {booking['institution_name']}</li>
                <li><strong>Course/Class:</strong> {booking['course_or_class']}</li>
                <li><strong>Amount Paid:</strong> ₹{booking['total_amount']}</li>
                <li><strong>Status:</strong> {booking['status'].upper()}</li>
            </ul>
            <p>You will receive updates once the institution reviews your application.</p>
            <p>Thank you for using Admission Buddy!</p>
            """
        })
    except Exception as e:
        print(f"Failed to send user email: {e}")

async def send_booking_email_to_institution(booking: dict, institution_email: str):
    """Send notification email to institution"""
    if not RESEND_API_KEY:
        return
    
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": institution_email,
            "subject": f"New Admission Application Received - {booking['student_name']}",
            "html": f"""
            <h2>New Admission Application Received!</h2>
            <p>A new admission application has been submitted.</p>
            <h3>Application Details:</h3>
            <ul>
                <li><strong>Application ID:</strong> {booking['id']}</li>
                <li><strong>Student Name:</strong> {booking['student_name']}</li>
                <li><strong>Father's Name:</strong> {booking['father_name']}</li>
                <li><strong>Course/Class:</strong> {booking['course_or_class']}</li>
                <li><strong>Mobile:</strong> {booking['mobile']}</li>
                <li><strong>Email:</strong> {booking['email']}</li>
            </ul>
            <p>Please login to your dashboard to review and approve/reject this application.</p>
            """
        })
    except Exception as e:
        print(f"Failed to send institution email: {e}")

async def send_status_update_email(booking: dict, user_email: str):
    """Send status update email to user"""
    if not RESEND_API_KEY:
        return
    
    status_text = "APPROVED" if booking['status'] == 'approved' else "REJECTED"
    color = "green" if booking['status'] == 'approved' else "red"
    
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": user_email,
            "subject": f"Admission Application {status_text} - {booking['institution_name']}",
            "html": f"""
            <h2>Admission Application Update</h2>
            <p>Dear {booking['student_name']},</p>
            <p>Your admission application status has been updated.</p>
            <h3>Application Details:</h3>
            <ul>
                <li><strong>Application ID:</strong> {booking['id']}</li>
                <li><strong>Institution:</strong> {booking['institution_name']}</li>
                <li><strong>Course/Class:</strong> {booking['course_or_class']}</li>
                <li><strong>Status:</strong> <span style="color: {color}; font-weight: bold;">{status_text}</span></li>
            </ul>
            {f"<p><strong>Institution Comments:</strong> {booking.get('institution_comments', '')}</p>" if booking.get('institution_comments') else ""}
            <p>Thank you for using Admission Buddy!</p>
            """
        })
    except Exception as e:
        print(f"Failed to send status update email: {e}")

async def send_admission_email(booking_id: str, email_type: str, db):
    """Send admission related email based on type"""
    try:
        booking = await db.admission_bookings.find_one({"id": booking_id}, {"_id": 0})
        if not booking:
            return
        
        if email_type == "confirmation":
            # Send to user
            await send_booking_email_to_user(booking, booking.get("email"))
            
            # Try to send to institution
            institution = await db.colleges.find_one({"id": booking.get("institution_id")}, {"_id": 0, "email": 1})
            if not institution:
                institution = await db.schools.find_one({"id": booking.get("institution_id")}, {"_id": 0, "email": 1})
            if not institution:
                institution = await db.universities.find_one({"id": booking.get("institution_id")}, {"_id": 0, "email": 1})
            
            if institution and institution.get("email"):
                await send_booking_email_to_institution(booking, institution["email"])
                
        elif email_type == "status_update":
            await send_status_update_email(booking, booking.get("email"))
    except Exception as e:
        print(f"Failed to send admission email: {e}")

# ============ SETTINGS ENDPOINTS ============

@router.get("/settings")
async def get_admission_settings(entity_type: Optional[str] = Query(None, description="college, school, or university"), db=Depends(get_db)):
    """Get admission fee settings - optionally filtered by entity type"""
    settings = await db.admissions_settings.find_one({"id": "admission_settings"}, {"_id": 0})
    if not settings:
        default_settings = AdmissionSettings()
        settings = default_settings.model_dump()
    
    # If entity_type specified, return only that entity's fees
    if entity_type and entity_type in ['college', 'school', 'university']:
        entity_fees = settings.get(entity_type, {})
        return {
            "entity_type": entity_type,
            "form_fee": entity_fees.get('form_fee', 1000),
            "platform_fee": entity_fees.get('platform_fee', 250),
            "gst_percentage": entity_fees.get('gst_percentage', 18),
            "total": round(
                (entity_fees.get('form_fee', 1000) + entity_fees.get('platform_fee', 250)) * 
                (1 + entity_fees.get('gst_percentage', 18) / 100), 2
            )
        }
    
    return settings

@router.put("/settings")
async def update_admission_settings(settings: AdmissionSettings, request: Request, db=Depends(get_db)):
    """Update admission fee settings (admin only)"""
    admin = await get_admin_user(request, db)
    
    settings_dict = settings.model_dump()
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_dict["updated_by"] = admin.get("id", admin.get("email"))
    
    await db.admissions_settings.update_one(
        {"id": "admission_settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings_dict

@router.get("/states")
async def get_states():
    """Get list of Indian states"""
    return {"states": INDIAN_STATES}

@router.get("/cities/{state}")
async def get_cities(state: str):
    """Get list of cities for a state"""
    cities = INDIAN_CITIES.get(state, [])
    return {"cities": cities}

# ============ PARTNER ENDPOINTS ============

@router.get("/partners")
async def get_admission_partners(
    entity_type: Optional[str] = Query(None, description="college, school, or university"),
    limit: int = 50,
    skip: int = 0,
    db=Depends(get_db)
):
    """Get list of admission partner institutions"""
    query = {"is_admission_partner": True}
    
    projection = {
        "_id": 0,
        "id": 1,
        "name": 1,
        "slug": 1,
        "city": 1,
        "state": 1,
        "logo": 1,
        "banner": 1,
        "is_admission_partner": 1,
        "rating": 1,
        "type": 1
    }
    
    # Determine which collection to query
    if entity_type == "school":
        collection = db.schools
    elif entity_type == "university":
        collection = db.universities
    else:
        collection = db.colleges
    
    partners = await collection.find(query, projection).skip(skip).limit(limit).to_list(limit)
    total = await collection.count_documents(query)
    
    return {
        "partners": partners,
        "total": total,
        "limit": limit,
        "skip": skip
    }

# ============ BOOKING ENDPOINTS ============

@router.post("/booking")
async def create_admission_booking(
    booking_data: AdmissionBookingCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """Create a new admission booking (user must be logged in)"""
    user = await get_current_user(request, db)
    
    # Get admission settings for fees
    settings = await db.admission_settings.find_one({"id": "admission_settings"}, {"_id": 0})
    if not settings:
        settings = AdmissionSettings().model_dump()
    
    # Calculate fees
    form_fee = settings.get("form_fee", 1000)
    platform_fee = settings.get("platform_fee", 250)
    gst_percentage = settings.get("gst_percentage", 18)
    subtotal = form_fee + platform_fee
    gst_amount = round(subtotal * gst_percentage / 100, 2)
    total_amount = round(subtotal + gst_amount, 2)
    
    # Generate booking ID
    booking_id = f"booking_{uuid4().hex[:12]}"
    
    # Create booking document
    booking = {
        "id": booking_id,
        "user_id": user["id"],
        "user_name": user.get("name"),
        "user_email": user.get("email"),
        **booking_data.model_dump(),
        
        # Fees
        "form_fee": form_fee,
        "platform_fee": platform_fee,
        "gst_percentage": gst_percentage,
        "gst_amount": gst_amount,
        "total_amount": total_amount,
        
        # Payment status
        "payment_status": "pending",
        "razorpay_order_id": None,
        "razorpay_payment_id": None,
        
        # Application status
        "status": "pending_payment",
        "institution_comments": None,
        "status_history": [{
            "status": "pending_payment",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "note": "Booking created, awaiting payment"
        }],
        
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.admission_bookings.insert_one(booking)
    
    # Remove _id before returning
    booking.pop("_id", None)
    
    return {
        "booking": booking,
        "message": "Booking created. Please complete payment."
    }

@router.post("/create-order")
async def create_razorpay_order(
    booking_id: str,
    request: Request,
    db=Depends(get_db)
):
    """Create Razorpay payment order for a booking"""
    user = await get_current_user(request, db)
    
    # Get booking
    booking = await db.admission_bookings.find_one(
        {"id": booking_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["payment_status"] == "completed":
        raise HTTPException(status_code=400, detail="Payment already completed")
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
    
    # Create Razorpay order
    amount_in_paise = int(booking["total_amount"] * 100)
    
    try:
        order = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": booking_id,
            "notes": {
                "booking_id": booking_id,
                "user_id": user["id"],
                "institution_id": booking["institution_id"]
            }
        })
        
        # Update booking with order ID
        await db.admission_bookings.update_one(
            {"id": booking_id},
            {"$set": {
                "razorpay_order_id": order["id"],
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {
            "order_id": order["id"],
            "amount": amount_in_paise,
            "currency": "INR",
            "key_id": RAZORPAY_KEY_ID,
            "booking_id": booking_id,
            "prefill": {
                "name": booking["student_name"],
                "email": booking["email"],
                "contact": booking["mobile"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@router.post("/create-test-order/{booking_id}")
async def create_test_order(
    booking_id: str,
    request: Request,
    db=Depends(get_db)
):
    """Create a test order for development/testing (bypasses Razorpay)"""
    user = await get_current_user(request, db)
    
    # Get booking
    booking = await db.admission_bookings.find_one(
        {"id": booking_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["payment_status"] == "completed":
        raise HTTPException(status_code=400, detail="Payment already completed")
    
    # Create mock order ID
    mock_order_id = f"test_order_{str(uuid4())[:8]}"
    amount_in_paise = int(booking["total_amount"] * 100)
    
    # Update booking with order ID
    await db.admission_bookings.update_one(
        {"id": booking_id},
        {"$set": {
            "razorpay_order_id": mock_order_id,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {
        "order_id": mock_order_id,
        "amount": amount_in_paise,
        "currency": "INR",
        "key_id": "test_key",
        "booking_id": booking_id,
        "is_test": True,
        "prefill": {
            "name": booking["student_name"],
            "email": booking["email"],
            "contact": booking["mobile"]
        }
    }

@router.post("/complete-test-payment/{booking_id}")
async def complete_test_payment(
    booking_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """Complete a test payment (bypasses Razorpay verification)"""
    user = await get_current_user(request, db)
    
    # Get booking
    booking = await db.admission_bookings.find_one(
        {"id": booking_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["payment_status"] == "completed":
        raise HTTPException(status_code=400, detail="Payment already completed")
    
    # Update booking status
    now = datetime.now(timezone.utc).isoformat()
    mock_payment_id = f"test_pay_{str(uuid4())[:8]}"
    
    status_update = {
        "status": "submitted",
        "timestamp": now,
        "updated_by": user["id"],
        "comment": "Test payment completed"
    }
    
    await db.admission_bookings.update_one(
        {"id": booking_id},
        {
            "$set": {
                "payment_status": "completed",
                "razorpay_payment_id": mock_payment_id,
                "status": "submitted",
                "updated_at": now
            },
            "$push": {"status_history": status_update}
        }
    )
    
    # Queue email notifications (if configured)
    background_tasks.add_task(
        send_admission_email,
        booking_id=booking_id,
        email_type="confirmation",
        db=db
    )
    
    return {
        "success": True,
        "message": "Test payment completed successfully",
        "booking_id": booking_id,
        "payment_id": mock_payment_id,
        "status": "submitted"
    }

@router.post("/verify-payment")
async def verify_razorpay_payment(
    payment_data: PaymentVerification,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """Verify Razorpay payment and update booking status"""
    user = await get_current_user(request, db)
    
    # Get booking
    booking = await db.admission_bookings.find_one(
        {"id": payment_data.booking_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify signature
    try:
        message = f"{payment_data.razorpay_order_id}|{payment_data.razorpay_payment_id}"
        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if expected_signature != payment_data.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signature verification failed: {str(e)}")
    
    # Update booking
    now = datetime.now(timezone.utc).isoformat()
    status_update = {
        "status": "submitted",
        "timestamp": now,
        "note": "Payment completed successfully"
    }
    
    await db.admission_bookings.update_one(
        {"id": payment_data.booking_id},
        {
            "$set": {
                "payment_status": "completed",
                "razorpay_payment_id": payment_data.razorpay_payment_id,
                "status": "submitted",
                "updated_at": now
            },
            "$push": {"status_history": status_update}
        }
    )
    
    # Get updated booking
    updated_booking = await db.admission_bookings.find_one(
        {"id": payment_data.booking_id},
        {"_id": 0}
    )
    
    # Send emails in background
    background_tasks.add_task(send_booking_email_to_user, updated_booking, user["email"])
    
    # Get institution email and send notification
    institution = await db.colleges.find_one(
        {"id": booking["institution_id"]},
        {"_id": 0, "contact_info": 1, "contact": 1}
    )
    if institution:
        inst_email = None
        if institution.get("contact_info") and institution["contact_info"].get("email"):
            inst_email = institution["contact_info"]["email"]
        elif institution.get("contact") and institution["contact"].get("email"):
            inst_email = institution["contact"]["email"]
        
        if inst_email:
            background_tasks.add_task(send_booking_email_to_institution, updated_booking, inst_email)
    
    return {
        "success": True,
        "message": "Payment verified successfully",
        "booking": updated_booking
    }

@router.get("/my-bookings")
async def get_user_bookings(
    request: Request,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """Get all bookings for the logged-in user"""
    user = await get_current_user(request, db)
    
    query = {"user_id": user["id"]}
    if status:
        query["status"] = status
    
    bookings = await db.admission_bookings.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"bookings": bookings}

@router.get("/my-bookings/{booking_id}")
async def get_user_booking_detail(
    booking_id: str,
    request: Request,
    db=Depends(get_db)
):
    """Get detailed booking information for user"""
    user = await get_current_user(request, db)
    
    booking = await db.admission_bookings.find_one(
        {"id": booking_id, "user_id": user["id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return booking

# ============ INSTITUTION ENDPOINTS ============

@router.get("/institution-bookings")
async def get_institution_bookings(
    request: Request,
    status: Optional[str] = None,
    db=Depends(get_db)
):
    """Get all bookings for the logged-in institution"""
    institute = await get_current_institute(request, db)
    
    query = {"institution_id": institute["institution_id"]}
    if status:
        query["status"] = status
    
    # Only show paid bookings to institution
    query["payment_status"] = "completed"
    
    bookings = await db.admission_bookings.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"bookings": bookings}

@router.put("/booking/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(get_db)
):
    """Update booking status (institution only)"""
    institute = await get_current_institute(request, db)
    
    # Verify booking belongs to this institution
    booking = await db.admission_bookings.find_one(
        {"id": booking_id, "institution_id": institute["institution_id"]},
        {"_id": 0}
    )
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if status_update.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    now = datetime.now(timezone.utc).isoformat()
    status_history_entry = {
        "status": status_update.status,
        "timestamp": now,
        "note": status_update.comments or f"Application {status_update.status} by institution"
    }
    
    await db.admission_bookings.update_one(
        {"id": booking_id},
        {
            "$set": {
                "status": status_update.status,
                "institution_comments": status_update.comments,
                "updated_at": now
            },
            "$push": {"status_history": status_history_entry}
        }
    )
    
    # Get updated booking
    updated_booking = await db.admission_bookings.find_one(
        {"id": booking_id},
        {"_id": 0}
    )
    
    # Send status update email to user
    background_tasks.add_task(
        send_status_update_email,
        updated_booking,
        booking["email"]
    )
    
    return {
        "success": True,
        "message": f"Booking {status_update.status}",
        "booking": updated_booking
    }

# ============ DOCUMENT UPLOAD ============

@router.post("/upload-document")
async def upload_admission_document(
    file: UploadFile = File(...),
    document_type: str = "photo",  # photo, aadhaar, qualification
    request: Request = None,
    db=Depends(get_db)
):
    """Upload document for admission booking (max 100KB)"""
    # Verify user is logged in
    user = await get_current_user(request, db)
    
    # Check file size (100KB = 102400 bytes)
    MAX_SIZE = 102400
    content = await file.read()
    
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is 100KB. Your file is {len(content) / 1024:.1f}KB"
        )
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed: JPG, PNG, PDF"
        )
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{document_type}_{user['id']}_{uuid4().hex[:8]}.{ext}"
    
    # Save file
    upload_dir = "/app/backend/uploads/admission_docs"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return URL
    file_url = f"/api/uploads/admission_docs/{filename}"
    
    return {
        "success": True,
        "url": file_url,
        "filename": filename,
        "size": len(content),
        "document_type": document_type
    }

# ============ ADMIN ENDPOINTS ============

@router.get("/admin/bookings")
async def get_all_bookings_admin(
    request: Request,
    status: Optional[str] = None,
    institution_type: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    db=Depends(get_db)
):
    """Get all bookings for admin dashboard"""
    admin = await get_admin_user(request, db)
    
    query = {}
    if status:
        query["status"] = status
    if institution_type:
        query["institution_type"] = institution_type
    
    bookings = await db.admission_bookings.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.admission_bookings.count_documents(query)
    
    # Get stats
    stats = {
        "total": total,
        "pending_payment": await db.admission_bookings.count_documents({"status": "pending_payment"}),
        "submitted": await db.admission_bookings.count_documents({"status": "submitted"}),
        "approved": await db.admission_bookings.count_documents({"status": "approved"}),
        "rejected": await db.admission_bookings.count_documents({"status": "rejected"})
    }
    
    return {
        "bookings": bookings,
        "total": total,
        "stats": stats,
        "limit": limit,
        "skip": skip
    }
