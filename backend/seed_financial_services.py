import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Education Loans Data
education_loans = [
    {
        "id": "sbi-edu-loan-001",
        "bank_name": "State Bank of India",
        "loan_type": "Domestic",
        "interest_rate": 7.95,
        "max_loan_amount": 2000000,
        "repayment_period": 15,
        "processing_fee": 0.5,
        "collateral_required": False,
        "features": [
            "No collateral for loans up to ₹7.5 lakhs",
            "Tax benefits under Section 80E",
            "Moratorium period available",
            "100% finance for tuition fees"
        ],
        "eligibility_criteria": "Indian citizen with admission to a recognized institution. Co-borrower required.",
        "documents_required": [
            "Admission letter",
            "Mark sheets of 10th, 12th, Graduation",
            "Income proof of parents",
            "ID and address proof",
            "Bank statements"
        ],
        "website_url": "https://sbi.co.in/education-loan",
        "contact_number": "1800-11-2211",
        "rating": 4.5,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "hdfc-edu-loan-002",
        "bank_name": "HDFC Bank",
        "loan_type": "Domestic",
        "interest_rate": 9.25,
        "max_loan_amount": 2000000,
        "repayment_period": 15,
        "processing_fee": 1.0,
        "collateral_required": True,
        "features": [
            "Quick loan processing",
            "Flexible repayment options",
            "Cover course fees, hostel, books",
            "Tax benefits available"
        ],
        "eligibility_criteria": "Age 18-35, admission to recognized college, co-applicant mandatory",
        "documents_required": [
            "Admission letter",
            "Academic records",
            "Income proof",
            "ID proof",
            "Collateral documents"
        ],
        "website_url": "https://hdfc.com/education-loan",
        "contact_number": "1800-266-4332",
        "rating": 4.3,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "icici-edu-loan-003",
        "bank_name": "ICICI Bank",
        "loan_type": "International",
        "interest_rate": 10.5,
        "max_loan_amount": 10000000,
        "repayment_period": 15,
        "processing_fee": 2.0,
        "collateral_required": True,
        "features": [
            "Up to ₹1 Cr for foreign education",
            "Cover tuition, living expenses",
            "Pre-visa disbursement",
            "Simple online application"
        ],
        "eligibility_criteria": "Admission to top universities abroad, co-applicant required",
        "documents_required": [
            "Admission letter from foreign university",
            "Academic transcripts",
            "Financial statements",
            "Collateral documents",
            "Passport copy"
        ],
        "website_url": "https://icicibank.com/education-loan",
        "contact_number": "1800-200-3344",
        "rating": 4.4,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "axis-edu-loan-004",
        "bank_name": "Axis Bank",
        "loan_type": "Domestic",
        "interest_rate": 8.75,
        "max_loan_amount": 2000000,
        "repayment_period": 12,
        "processing_fee": 0.75,
        "collateral_required": False,
        "features": [
            "100% financing of education expenses",
            "Study loan up to ₹20 lakhs without collateral",
            "Flexible EMI options",
            "Instant approval"
        ],
        "eligibility_criteria": "Student must have secured admission. Parents as co-borrowers.",
        "documents_required": [
            "Admission letter",
            "Fee structure",
            "Academic records",
            "Income proof of co-borrower"
        ],
        "website_url": "https://axisbank.com/education-loan",
        "contact_number": "1800-419-5959",
        "rating": 4.2,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "canara-edu-loan-005",
        "bank_name": "Canara Bank",
        "loan_type": "International",
        "interest_rate": 9.5,
        "max_loan_amount": 5000000,
        "repayment_period": 15,
        "processing_fee": 1.5,
        "collateral_required": True,
        "features": [
            "Study abroad loans up to ₹50 lakhs",
            "Covers tuition, travel, accommodation",
            "Interest subsidy for economically weaker sections",
            "Moratorium during course duration"
        ],
        "eligibility_criteria": "Admission to recognized foreign institution, age 18-35",
        "documents_required": [
            "Foreign university admission letter",
            "Passport",
            "Academic certificates",
            "Financial documents",
            "Collateral papers"
        ],
        "website_url": "https://canarabank.com/education-loan",
        "contact_number": "1800-425-0018",
        "rating": 4.1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

# Scholarships Data
scholarships = [
    {
        "id": "ntse-scholarship-001",
        "name": "National Talent Search Examination (NTSE)",
        "provider": "Government",
        "scholarship_type": "Merit-based",
        "amount": 144000,
        "eligibility": "Class 10 students with 60% marks in previous class. Merit-based selection through exam.",
        "applicable_courses": ["Class 10", "Class 11", "Class 12", "UG", "PG", "PhD"],
        "education_level": "UG",
        "deadline": "2025-11-30",
        "application_link": "https://ncert.nic.in/ntse-stage-one.php",
        "documents_required": [
            "Class 9 mark sheet",
            "School certificate",
            "Caste certificate (if applicable)",
            "Income certificate"
        ],
        "description": "NTSE is a national-level scholarship program for students studying in class 10. The scholarship is awarded to meritorious students to pursue higher education.",
        "benefits": [
            "₹1,250/month for class 11-12",
            "₹2,000/month for UG & PG",
            "Continues till PhD",
            "No bond or service obligation"
        ],
        "selection_process": "Two-stage examination: Stage 1 (State level) and Stage 2 (National level)",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "central-sector-scholarship-002",
        "name": "Central Sector Scheme Scholarship",
        "provider": "Government",
        "scholarship_type": "Merit-based",
        "amount": 120000,
        "eligibility": "Students who passed class 12 with 80%+ marks and family income < ₹8 lakh per annum",
        "applicable_courses": ["UG", "PG"],
        "education_level": "UG",
        "deadline": "2025-10-31",
        "application_link": "https://scholarships.gov.in",
        "documents_required": [
            "Class 12 mark sheet",
            "Income certificate",
            "Bank account details",
            "Aadhaar card",
            "College admission letter"
        ],
        "description": "Merit-cum-means scholarship for students pursuing regular degree courses at recognized institutions.",
        "benefits": [
            "₹10,000/year for first 3 years of UG",
            "₹20,000/year for 4th & 5th year",
            "Direct bank transfer"
        ],
        "selection_process": "Merit-based selection based on class 12 marks and family income",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "post-matric-scholarship-003",
        "name": "Post Matric Scholarship for SC/ST/OBC",
        "provider": "Government",
        "scholarship_type": "Need-based",
        "amount": 50000,
        "eligibility": "SC/ST/OBC students pursuing post-matriculation studies with family income < ₹2.5 lakh",
        "applicable_courses": ["Class 11", "Class 12", "UG", "PG", "Diploma", "ITI"],
        "education_level": "UG",
        "deadline": "2025-12-31",
        "application_link": "https://scholarships.gov.in",
        "documents_required": [
            "Caste certificate",
            "Income certificate",
            "Previous year mark sheet",
            "Bank account details",
            "Enrollment certificate"
        ],
        "description": "Financial assistance for SC/ST/OBC students to pursue education beyond matriculation.",
        "benefits": [
            "Tuition fees reimbursement",
            "Maintenance allowance",
            "Study materials allowance",
            "Reader charges for blind students"
        ],
        "selection_process": "Application-based, verified by college and state government",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "inspire-scholarship-004",
        "name": "INSPIRE Scholarship for Higher Education",
        "provider": "Government",
        "scholarship_type": "Merit-based",
        "amount": 80000,
        "eligibility": "Top 1% students in class 12 board exams pursuing BSc/MSc in natural sciences",
        "applicable_courses": ["BSc", "MSc", "Integrated MSc"],
        "education_level": "UG",
        "deadline": "2025-09-30",
        "application_link": "https://online-inspire.gov.in",
        "documents_required": [
            "Class 12 mark sheet",
            "College admission letter for BSc/MSc",
            "Bank account details",
            "Aadhaar card"
        ],
        "description": "Department of Science & Technology scholarship for talented students in natural sciences",
        "benefits": [
            "₹80,000 per year for 5 years",
            "Mentorship opportunity",
            "Research exposure",
            "Summer internships"
        ],
        "selection_process": "Top 1% in Class 12 board exams automatically eligible",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "jee-scholarship-005",
        "name": "Prime Minister's Scholarship for JEE Advanced Qualifiers",
        "provider": "Government",
        "scholarship_type": "Merit-based",
        "amount": 150000,
        "eligibility": "Students who qualified JEE Advanced and secured admission in NITs/IIITs/CFTIs",
        "applicable_courses": ["B.Tech", "B.Arch"],
        "education_level": "UG",
        "deadline": "2025-08-31",
        "application_link": "https://scholarships.gov.in",
        "documents_required": [
            "JEE Advanced rank card",
            "Admission letter from NIT/IIIT/CFTI",
            "Income certificate",
            "Bank details"
        ],
        "description": "Merit scholarship for engineering students in premier institutions",
        "benefits": [
            "₹50,000 per year for general category",
            "₹75,000 per year for female students",
            "Additional ₹25,000 for toppers",
            "4 years coverage"
        ],
        "selection_process": "Based on JEE Advanced rank and admission to eligible institutions",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "sitaram-jindal-scholarship-006",
        "name": "Sitaram Jindal Foundation Scholarship",
        "provider": "Private",
        "scholarship_type": "Need-based",
        "amount": 30000,
        "eligibility": "Economically weak students pursuing UG/PG with family income < ₹5 lakh and 60%+ marks",
        "applicable_courses": ["UG", "PG", "Diploma"],
        "education_level": "UG",
        "deadline": "2025-10-15",
        "application_link": "https://sitaramjindalfoundation.org",
        "documents_required": [
            "Mark sheets",
            "Income certificate",
            "Recommendation letter",
            "Essay on financial need"
        ],
        "description": "Private foundation scholarship supporting meritorious students from economically weaker sections",
        "benefits": [
            "₹30,000 per year",
            "Renewable based on performance",
            "Career counseling",
            "Networking opportunities"
        ],
        "selection_process": "Application review, academic merit, and financial need assessment",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "kishore-vaigyanik-scholarship-007",
        "name": "Kishore Vaigyanik Protsahan Yojana (KVPY)",
        "provider": "Government",
        "scholarship_type": "Merit-based",
        "amount": 84000,
        "eligibility": "Class 11, 12, and 1st year UG students with aptitude in basic sciences",
        "applicable_courses": ["BSc", "BS", "B.Math", "B.Stat", "Integrated MSc"],
        "education_level": "UG",
        "deadline": "2025-07-31",
        "application_link": "https://kvpy.iisc.ernet.in",
        "documents_required": [
            "Mark sheets",
            "School/College ID",
            "Passport size photo",
            "Aadhaar card"
        ],
        "description": "Scholarship by Department of Science & Technology to attract talented students into research careers in Science",
        "benefits": [
            "₹5,000/month during UG",
            "₹7,000/month during PG",
            "Annual contingency grant",
            "Direct PhD admission in IISc"
        ],
        "selection_process": "National level aptitude test followed by interview",
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_data():
    try:
        # Clear existing data
        await db.education_loans.delete_many({})
        await db.scholarships.delete_many({})
        
        # Insert education loans
        if education_loans:
            await db.education_loans.insert_many(education_loans)
            print(f"✓ Inserted {len(education_loans)} education loans")
        
        # Insert scholarships
        if scholarships:
            await db.scholarships.insert_many(scholarships)
            print(f"✓ Inserted {len(scholarships)} scholarships")
        
        print("\n✅ Financial services data seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
