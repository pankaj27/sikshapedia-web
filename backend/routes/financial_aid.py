"""
Financial Aid Routes - Scholarships and Loans
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime, timezone
import uuid

# Create router
financial_aid_router = APIRouter(prefix="/api", tags=["Financial Aid"])

# Database will be injected from main app
db = None

def set_database(database):
    """Set the database instance from main app"""
    global db
    db = database

# ============================================
# Pydantic Models
# ============================================

class Scholarship(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    scholarship_type: Optional[str] = None
    education_level: Optional[str] = None
    provider: Optional[str] = None
    provider_type: Optional[str] = None
    amount: Optional[str] = None
    amount_type: Optional[str] = None
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    short_description: Optional[str] = None
    
    # Eligibility
    min_percentage: Optional[str] = None
    max_family_income: Optional[str] = None
    age_limit: Optional[str] = None
    gender: Optional[str] = None
    eligibility_criteria: List[str] = []
    documents_required: List[str] = []
    category: List[str] = []
    states: List[str] = []
    courses_applicable: List[str] = []
    
    # Media
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None
    provider_logo: Optional[str] = None
    gallery_images: List[str] = []
    
    # Content
    content: Optional[str] = None
    benefits: List[str] = []
    application_process: Optional[str] = None
    selection_process: Optional[str] = None
    
    # TOC & Tables
    toc_enabled: bool = False
    toc_items: List[Dict] = []
    tables: List[Dict] = []
    
    # Contact & Links
    official_website: Optional[str] = None
    application_link: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    auto_generate_seo: bool = True
    schema_type: Optional[str] = "Scholarship"
    
    # Status
    is_active: bool = True
    is_featured: bool = False
    views: int = 0
    applications: int = 0
    
    # FAQs
    faqs: List[Dict] = []
    
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Legacy fields
    eligibility: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    requirements: List[str] = []
    website: Optional[str] = None


class Loan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    bank_name: Optional[str] = None
    bank_type: Optional[str] = None
    bank_logo: Optional[str] = None
    loan_type: Optional[str] = None
    short_description: Optional[str] = None
    
    # Loan Details
    min_amount: Optional[str] = None
    max_amount: Optional[str] = None
    interest_rate_min: Optional[str] = None
    interest_rate_max: Optional[str] = None
    interest_type: Optional[str] = None
    processing_fee: Optional[str] = None
    tenure_min: Optional[str] = None
    tenure_max: Optional[str] = None
    moratorium_period: Optional[str] = None
    
    # Eligibility
    age_min: Optional[str] = None
    age_max: Optional[str] = None
    nationality: Optional[str] = None
    eligibility_criteria: List[str] = []
    courses_covered: List[str] = []
    countries_covered: List[str] = []
    documents_required: List[str] = []
    
    # Media
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None
    gallery_images: List[str] = []
    
    # Content
    content: Optional[str] = None
    benefits: List[str] = []
    key_features: List[str] = []
    application_process: Optional[str] = None
    repayment_options: Optional[str] = None
    
    # TOC & Tables
    toc_enabled: bool = False
    toc_items: List[Dict] = []
    tables: List[Dict] = []
    
    # Contact & Links
    official_website: Optional[str] = None
    apply_link: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    branch_locator_link: Optional[str] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    auto_generate_seo: bool = True
    schema_type: Optional[str] = "FinancialProduct"
    
    # Status
    is_active: bool = True
    is_featured: bool = False
    views: int = 0
    applications: int = 0
    
    # FAQs
    faqs: List[Dict] = []
    
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================
# Scholarship Endpoints
# ============================================

@financial_aid_router.get("/scholarships")
async def get_scholarships(limit: int = 100):
    """Get all scholarships"""
    scholarships = await db.scholarships.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return scholarships

@financial_aid_router.get("/scholarships/{scholarship_id}")
async def get_scholarship(scholarship_id: str):
    """Get a specific scholarship by ID"""
    scholarship = await db.scholarships.find_one({"id": scholarship_id}, {"_id": 0})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship

@financial_aid_router.post("/scholarships")
async def create_scholarship(scholarship: Scholarship):
    """Create a new scholarship"""
    scholarship_dict = scholarship.model_dump()
    if isinstance(scholarship_dict.get('created_at'), datetime):
        scholarship_dict['created_at'] = scholarship_dict['created_at'].isoformat()
    await db.scholarships.insert_one(scholarship_dict)
    scholarship_dict.pop('_id', None)
    return scholarship_dict

@financial_aid_router.put("/scholarships/{scholarship_id}")
async def update_scholarship(scholarship_id: str, scholarship: Scholarship):
    """Update a scholarship"""
    scholarship_dict = scholarship.model_dump()
    if isinstance(scholarship_dict.get('created_at'), datetime):
        scholarship_dict['created_at'] = scholarship_dict['created_at'].isoformat()
    await db.scholarships.update_one({"id": scholarship_id}, {"$set": scholarship_dict})
    return scholarship_dict

@financial_aid_router.delete("/scholarships/{scholarship_id}")
async def delete_scholarship(scholarship_id: str):
    """Delete a scholarship"""
    await db.scholarships.delete_one({"id": scholarship_id})
    return {"success": True}


# ============================================
# Loan Endpoints
# ============================================

@financial_aid_router.get("/loans")
async def get_loans(limit: int = 100):
    """Get all loans"""
    loans = await db.loans.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return loans

@financial_aid_router.get("/loans/{loan_id}")
async def get_loan(loan_id: str):
    """Get a specific loan by ID"""
    loan = await db.loans.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@financial_aid_router.post("/loans")
async def create_loan(loan: Loan):
    """Create a new loan"""
    loan_dict = loan.model_dump()
    if isinstance(loan_dict.get('created_at'), datetime):
        loan_dict['created_at'] = loan_dict['created_at'].isoformat()
    await db.loans.insert_one(loan_dict)
    loan_dict.pop('_id', None)
    return loan_dict

@financial_aid_router.put("/loans/{loan_id}")
async def update_loan(loan_id: str, loan: Loan):
    """Update a loan"""
    loan_dict = loan.model_dump()
    if isinstance(loan_dict.get('created_at'), datetime):
        loan_dict['created_at'] = loan_dict['created_at'].isoformat()
    await db.loans.update_one({"id": loan_id}, {"$set": loan_dict})
    return loan_dict

@financial_aid_router.delete("/loans/{loan_id}")
async def delete_loan(loan_id: str):
    """Delete a loan"""
    await db.loans.delete_one({"id": loan_id})
    return {"success": True}
