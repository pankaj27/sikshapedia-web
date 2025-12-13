import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Study Abroad Universities Data
STUDY_ABROAD_DATA = [
    {
        "id": "mit_usa",
        "name": "Massachusetts Institute of Technology",
        "country": "USA",
        "city": "Cambridge",
        "description": "MIT is a world-renowned research university known for its innovation in science, technology, and engineering.",
        "ranking": {"world": 1, "country": 1},
        "programs": ["Computer Science", "Engineering", "Business", "Data Science", "AI/ML"],
        "tuition_fees": {"currency": "USD", "min": 50000, "max": 55000, "per": "year"},
        "living_cost": {"currency": "USD", "amount": 20000, "per": "year"},
        "application_deadline": "January 1, 2025",
        "language_requirements": {"IELTS": 7.0, "TOEFL": 90},
        "acceptance_rate": 7.3,
        "images": [],
        "website": "https://www.mit.edu"
    },
    {
        "id": "oxford_uk",
        "name": "University of Oxford",
        "country": "UK",
        "city": "Oxford",
        "description": "Oxford is the oldest university in the English-speaking world with a reputation for academic excellence.",
        "ranking": {"world": 4, "country": 1},
        "programs": ["Medicine", "Law", "Philosophy", "Engineering", "Business"],
        "tuition_fees": {"currency": "GBP", "min": 25000, "max": 35000, "per": "year"},
        "living_cost": {"currency": "GBP", "amount": 15000, "per": "year"},
        "application_deadline": "October 15, 2024",
        "language_requirements": {"IELTS": 7.5, "TOEFL": 110},
        "acceptance_rate": 17.5,
        "images": [],
        "website": "https://www.ox.ac.uk"
    },
    {
        "id": "toronto_canada",
        "name": "University of Toronto",
        "country": "Canada",
        "city": "Toronto",
        "description": "U of T is Canada's leading institution for learning, discovery and knowledge creation.",
        "ranking": {"world": 18, "country": 1},
        "programs": ["Computer Science", "Medicine", "Engineering", "Business", "Arts"],
        "tuition_fees": {"currency": "CAD", "min": 45000, "max": 55000, "per": "year"},
        "living_cost": {"currency": "CAD", "amount": 18000, "per": "year"},
        "application_deadline": "January 15, 2025",
        "language_requirements": {"IELTS": 6.5, "TOEFL": 100},
        "acceptance_rate": 43.0,
        "images": [],
        "website": "https://www.utoronto.ca"
    },
    {
        "id": "melbourne_australia",
        "name": "University of Melbourne",
        "country": "Australia",
        "city": "Melbourne",
        "description": "Melbourne is Australia's leading university with a strong focus on research and innovation.",
        "ranking": {"world": 33, "country": 1},
        "programs": ["Engineering", "Medicine", "Law", "Business", "Arts"],
        "tuition_fees": {"currency": "AUD", "min": 40000, "max": 45000, "per": "year"},
        "living_cost": {"currency": "AUD", "amount": 25000, "per": "year"},
        "application_deadline": "December 31, 2024",
        "language_requirements": {"IELTS": 6.5, "TOEFL": 79},
        "acceptance_rate": 70.0,
        "images": [],
        "website": "https://www.unimelb.edu.au"
    },
    {
        "id": "nus_singapore",
        "name": "National University of Singapore",
        "country": "Singapore",
        "city": "Singapore",
        "description": "NUS is a leading global university centered in Asia with strong research capabilities.",
        "ranking": {"world": 11, "country": 1},
        "programs": ["Computer Science", "Engineering", "Business", "Medicine", "Law"],
        "tuition_fees": {"currency": "SGD", "min": 35000, "max": 45000, "per": "year"},
        "living_cost": {"currency": "SGD", "amount": 15000, "per": "year"},
        "application_deadline": "March 31, 2025",
        "language_requirements": {"IELTS": 6.5, "TOEFL": 92},
        "acceptance_rate": 5.0,
        "images": [],
        "website": "https://www.nus.edu.sg"
    }
]

# Scholarships Data
SCHOLARSHIPS_DATA = [
    {
        "id": "fulbright_scholarship",
        "name": "Fulbright Scholarship",
        "provider": "US Department of State",
        "description": "The Fulbright Program provides grants for international educational exchange for students, scholars, and professionals.",
        "amount": "Full tuition + Living expenses",
        "type": "Merit-based",
        "eligibility": "Bachelor's degree, strong academic record, leadership qualities",
        "level": "PG",
        "application_deadline": "October 15, 2024",
        "fields_of_study": ["All fields"],
        "countries": ["USA"],
        "requirements": ["Bachelor's degree", "English proficiency", "Research proposal"],
        "how_to_apply": "Apply online through the Fulbright website with required documents",
        "website": "https://foreign.fulbrightonline.org"
    },
    {
        "id": "chevening_scholarship",
        "name": "Chevening Scholarship",
        "provider": "UK Government",
        "description": "Chevening Scholarships enable outstanding emerging leaders from around the world to pursue one-year master's degrees in the UK.",
        "amount": "Full tuition + Living stipend",
        "type": "Merit-based",
        "eligibility": "2+ years work experience, leadership potential",
        "level": "PG",
        "application_deadline": "November 7, 2024",
        "fields_of_study": ["All fields"],
        "countries": ["UK"],
        "requirements": ["Work experience", "Leadership potential", "Bachelor's degree"],
        "how_to_apply": "Submit online application with essays and references",
        "website": "https://www.chevening.org"
    },
    {
        "id": "commonwealth_scholarship",
        "name": "Commonwealth Scholarship",
        "provider": "Commonwealth Scholarship Commission",
        "description": "Scholarships for students from Commonwealth countries to study in the UK.",
        "amount": "Full tuition + Living expenses",
        "type": "Need-based",
        "eligibility": "Citizens of Commonwealth countries, financial need",
        "level": "PG",
        "application_deadline": "December 15, 2024",
        "fields_of_study": ["Science", "Technology", "Engineering", "Medicine"],
        "countries": ["UK"],
        "requirements": ["Commonwealth citizenship", "Strong academic record", "Financial need"],
        "how_to_apply": "Apply through nominating agency in home country",
        "website": "https://cscuk.fcdo.gov.uk"
    },
    {
        "id": "australia_awards",
        "name": "Australia Awards Scholarship",
        "provider": "Australian Government",
        "description": "Long-term development awards for students from developing countries to study in Australia.",
        "amount": "Full tuition + Living allowance + Health insurance",
        "type": "Need-based",
        "eligibility": "Citizens of eligible countries, return to home country after study",
        "level": "PG",
        "application_deadline": "April 30, 2025",
        "fields_of_study": ["All fields"],
        "countries": ["Australia"],
        "requirements": ["Citizenship of eligible country", "Work experience", "English proficiency"],
        "how_to_apply": "Online application through Australia Awards website",
        "website": "https://www.dfat.gov.au/people-to-people/australia-awards"
    },
    {
        "id": "nsp_india",
        "name": "National Scholarship Portal",
        "provider": "Government of India",
        "description": "Scholarships for Indian students from various schemes under one platform.",
        "amount": "Varies by scheme (₹10,000 - ₹2,00,000)",
        "type": "Merit-based",
        "eligibility": "Indian citizens, merit and need-based criteria",
        "level": "UG",
        "application_deadline": "Varies by scheme",
        "fields_of_study": ["All fields"],
        "countries": ["India"],
        "requirements": ["Indian citizenship", "Academic merit", "Income criteria"],
        "how_to_apply": "Register and apply online at NSP portal",
        "website": "https://scholarships.gov.in"
    }
]

# Loans Data
LOANS_DATA = [
    {
        "id": "sbi_education_loan",
        "name": "SBI Student Loan Scheme",
        "type": "Bank",
        "description": "SBI offers education loans for studies in India and abroad with competitive interest rates.",
        "interest_rate": "9.15% - 10.65% p.a.",
        "max_amount": "₹1.5 Crore",
        "loan_tenure": "Up to 15 years",
        "processing_fee": "₹10,000 + GST",
        "eligibility": "Indian citizen, admission to recognized institution",
        "documents_required": ["Admission letter", "Cost of study proof", "Income proof", "ID proof"],
        "special_features": ["No margin for loans up to ₹7.5 lakh", "Moratorium period available"],
        "website": "https://sbi.co.in/education-loan",
        "contact": {"phone": "1800-1234", "email": "support@sbi.co.in"}
    },
    {
        "id": "hdfc_credila",
        "name": "HDFC Credila Education Loan",
        "type": "NBFC",
        "description": "Credila offers customized education loans for studying in India and abroad.",
        "interest_rate": "10.50% - 12.50% p.a.",
        "max_amount": "₹1 Crore",
        "loan_tenure": "Up to 15 years",
        "processing_fee": "Up to 2% of loan amount",
        "eligibility": "Admission to recognized course, co-applicant required",
        "documents_required": ["Admission letter", "Academic records", "Income proof", "Collateral documents"],
        "special_features": ["Quick approval", "Flexible repayment", "100% finance available"],
        "website": "https://www.credila.com",
        "contact": {"phone": "1800-103-3235", "email": "care@credila.com"}
    },
    {
        "id": "axis_bank_loan",
        "name": "Axis Bank Education Loan",
        "type": "Bank",
        "description": "Axis Bank provides education loans with attractive interest rates and flexible terms.",
        "interest_rate": "13.70% - 15.20% p.a.",
        "max_amount": "₹75 Lakh",
        "loan_tenure": "Up to 15 years",
        "processing_fee": "2% of loan amount",
        "eligibility": "Indian national, secured admission",
        "documents_required": ["Admission letter", "Fee structure", "Academic records", "Income proof"],
        "special_features": ["Tax benefits u/s 80E", "Simple interest during study"],
        "website": "https://www.axisbank.com/education-loan",
        "contact": {"phone": "1800-419-5959", "email": "customer.care@axisbank.com"}
    },
    {
        "id": "vidyalakshmi_portal",
        "name": "Vidyalakshmi Education Loan Portal",
        "type": "Government",
        "description": "Common portal for students to apply for education loans from various banks.",
        "interest_rate": "Varies by bank",
        "max_amount": "As per bank policy",
        "loan_tenure": "As per bank policy",
        "processing_fee": "Varies by bank",
        "eligibility": "Indian students seeking education loans",
        "documents_required": ["Varies by bank"],
        "special_features": ["Single window for multiple banks", "Government-backed initiative", "Scholarship info"],
        "website": "https://www.vidyalakshmi.co.in",
        "contact": {"phone": "1800-419-8018", "email": "info@vidyalakshmi.co.in"}
    }
]

async def seed_data():
    print("Starting seed for Study Abroad, Scholarships, and Loans...")
    
    # Clear existing data
    await db.study_abroad.delete_many({})
    await db.scholarships.delete_many({})
    await db.loans.delete_many({})
    
    # Insert study abroad universities
    for uni in STUDY_ABROAD_DATA:
        await db.study_abroad.insert_one(uni)
        print(f"✓ Inserted university: {uni['name']}")
    
    # Insert scholarships
    for scholarship in SCHOLARSHIPS_DATA:
        await db.scholarships.insert_one(scholarship)
        print(f"✓ Inserted scholarship: {scholarship['name']}")
    
    # Insert loans
    for loan in LOANS_DATA:
        await db.loans.insert_one(loan)
        print(f"✓ Inserted loan: {loan['name']}")
    
    print(f"\nSeeding completed!")
    print(f"Total Universities: {len(STUDY_ABROAD_DATA)}")
    print(f"Total Scholarships: {len(SCHOLARSHIPS_DATA)}")
    print(f"Total Loan Providers: {len(LOANS_DATA)}")

if __name__ == "__main__":
    asyncio.run(seed_data())
    print("\n✅ Database seeded successfully!")
