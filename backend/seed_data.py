import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample Schools Data
schools_data = [
    {
        "id": str(uuid.uuid4()),
        "name": "Delhi Public School, R.K. Puram",
        "slug": "dps-rk-puram",
        "board": "CBSE",
        "school_type": "Private",
        "medium": "English",
        "city": "Delhi",
        "state": "Delhi",
        "address": "Sector 12, R.K. Puram",
        "established_year": 1972,
        "classes_offered": ["Nursery", "LKG", "UKG", "1-10", "11-12"],
        "streams_offered": ["Science", "Commerce", "Humanities"],
        "total_students": 3500,
        "student_teacher_ratio": "20:1",
        "facilities": ["Library", "Computer Lab", "Sports Ground", "Swimming Pool", "Auditorium"],
        "admission_fee": 15000.0,
        "annual_fee": 125000.0,
        "rating": 4.5,
        "total_reviews": 450,
        "academic_excellence": 4.7,
        "infrastructure_rating": 4.6,
        "extracurricular_rating": 4.3,
        "phone": "+91-11-26171771",
        "email": "info@dpsrkp.net",
        "website": "https://dpsrkpuram.com",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "name": "St. Xavier's School, Mumbai",
        "slug": "st-xaviers-mumbai",
        "board": "ICSE",
        "school_type": "Private",
        "medium": "English",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "5, Mahapalika Marg, Fort",
        "established_year": 1867,
        "classes_offered": ["LKG", "UKG", "1-10", "11-12"],
        "streams_offered": ["Science", "Commerce"],
        "total_students": 2800,
        "student_teacher_ratio": "25:1",
        "facilities": ["Library", "Computer Lab", "Sports Complex", "Music Room", "Art Studio"],
        "admission_fee": 12000.0,
        "annual_fee": 95000.0,
        "rating": 4.6,
        "total_reviews": 380,
        "academic_excellence": 4.8,
        "infrastructure_rating": 4.5,
        "extracurricular_rating": 4.4,
        "phone": "+91-22-22621361",
        "email": "info@stxaviersfortmumbai.edu.in",
        "website": "https://stxaviersfortmumbai.edu.in",
        "created_at": datetime.now(timezone.utc)
    }
]

# Sample Universities Data
universities_data = [
    {
        "id": str(uuid.uuid4()),
        "name": "Jawaharlal Nehru University",
        "slug": "jnu-delhi",
        "university_type": "Central University",
        "accreditation": "NAAC A++",
        "city": "Delhi",
        "state": "Delhi",
        "address": "New Mehrauli Road",
        "established_year": 1969,
        "streams": ["Arts", "Science", "Social Sciences", "Languages", "International Studies"],
        "total_courses": 150,
        "total_colleges": 0,
        "total_students": 8500,
        "total_faculty": 600,
        "nirf_rank": 2,
        "rating": 4.7,
        "total_reviews": 520,
        "placement_percentage": 75.0,
        "highest_package": 2500000.0,
        "average_package": 800000.0,
        "phone": "+91-11-26704000",
        "email": "info@jnu.ac.in",
        "website": "https://www.jnu.ac.in",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "name": "University of Mumbai",
        "slug": "university-of-mumbai",
        "university_type": "State University",
        "accreditation": "NAAC A+",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "Kalina Campus, Santacruz East",
        "established_year": 1857,
        "streams": ["Engineering", "Science", "Commerce", "Arts", "Law", "Medicine"],
        "total_courses": 450,
        "total_colleges": 711,
        "total_students": 550000,
        "total_faculty": 4500,
        "nirf_rank": 42,
        "rating": 4.3,
        "total_reviews": 890,
        "placement_percentage": 68.0,
        "highest_package": 1800000.0,
        "average_package": 650000.0,
        "phone": "+91-22-26543000",
        "email": "info@mu.ac.in",
        "website": "https://mu.ac.in",
        "created_at": datetime.now(timezone.utc)
    }
]

# Sample News Data
news_data = [
    {
        "id": str(uuid.uuid4()),
        "title": "CBSE Board Exams 2025: Date Sheet Released",
        "slug": "cbse-board-exams-2025-date-sheet",
        "category": "Exams",
        "summary": "CBSE has released the date sheet for Class 10 and 12 board examinations 2025. Exams will begin from February 15, 2025.",
        "content": """
The Central Board of Secondary Education (CBSE) has officially announced the date sheet for Class 10 and 12 board examinations for the year 2025. The examinations will commence from February 15, 2025.

**Key Highlights:**
- Class 10 exams: February 15 to March 18, 2025
- Class 12 exams: February 15 to April 2, 2025
- Practical exams will be conducted from January 1 to January 31, 2025
- Admit cards will be available from January 15, 2025

Students are advised to prepare well and check the complete date sheet on the official CBSE website. All examinations will be conducted following COVID-19 safety protocols.

**Important Instructions:**
1. Students must reach the examination center 30 minutes before the exam starts
2. Carry admit card and valid ID proof
3. Electronic devices are strictly prohibited
4. Follow the dress code as per school guidelines

For more information, visit the official CBSE website at cbse.gov.in
        """,
        "featured_image": "https://via.placeholder.com/800x400?text=CBSE+Board+Exams+2025",
        "author": "Education Desk",
        "author_image": "https://via.placeholder.com/100x100?text=ED",
        "tags": ["CBSE", "Board Exams", "Date Sheet", "Class 10", "Class 12"],
        "related_colleges": [],
        "related_exams": [],
        "views": 12500,
        "shares": 350,
        "meta_title": "CBSE Board Exams 2025 Date Sheet Released - Check Schedule",
        "meta_description": "CBSE has announced the date sheet for Class 10 and 12 board exams 2025. Check the complete schedule and important instructions.",
        "published": True,
        "featured": True,
        "published_at": datetime.now(timezone.utc),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": str(uuid.uuid4()),
        "title": "IIT JEE Advanced 2025 Registration Begins",
        "slug": "iit-jee-advanced-2025-registration",
        "category": "Admission",
        "summary": "The registration process for IIT JEE Advanced 2025 has commenced. Eligible candidates can apply through the official website.",
        "content": """
The Indian Institutes of Technology (IITs) have opened the registration portal for JEE Advanced 2025. Students who have qualified JEE Main with the required percentile can now register for the exam.

**Registration Details:**
- Registration Start Date: December 10, 2024
- Last Date to Register: January 5, 2025
- Application Fee: ₹2,800 (General), ₹1,400 (Reserved Categories)
- Exam Date: May 25, 2025

**Eligibility Criteria:**
- Must have qualified JEE Main 2025
- Top 2.5 lakh rank holders eligible
- Maximum 2 attempts allowed
- Age limit: Born on or after October 1, 2000

The exam will be conducted in Computer-Based Test (CBT) mode across multiple centers nationwide. Students must prepare thoroughly for both Paper 1 and Paper 2.

Visit jeeadv.ac.in for complete information and to register.
        """,
        "featured_image": "https://via.placeholder.com/800x400?text=JEE+Advanced+2025",
        "author": "Admissions Team",
        "author_image": "https://via.placeholder.com/100x100?text=AT",
        "tags": ["JEE Advanced", "IIT", "Engineering", "Admission", "Registration"],
        "related_colleges": [],
        "related_exams": [],
        "views": 28700,
        "shares": 820,
        "meta_title": "IIT JEE Advanced 2025 Registration Started - Apply Now",
        "meta_description": "JEE Advanced 2025 registration is now open. Check eligibility criteria, important dates, and application process.",
        "published": True,
        "featured": True,
        "published_at": datetime.now(timezone.utc),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
]

async def seed_database():
    """Seed the database with sample data"""
    print("Starting database seeding...")
    
    # Seed Schools
    print("\nSeeding schools...")
    existing_schools = await db.schools.count_documents({})
    if existing_schools == 0:
        await db.schools.insert_many(schools_data)
        print(f"✅ Inserted {len(schools_data)} schools")
    else:
        print(f"ℹ️  Schools collection already has {existing_schools} documents")
    
    # Seed Universities
    print("\nSeeding universities...")
    existing_universities = await db.universities.count_documents({})
    if existing_universities == 0:
        await db.universities.insert_many(universities_data)
        print(f"✅ Inserted {len(universities_data)} universities")
    else:
        print(f"ℹ️  Universities collection already has {existing_universities} documents")
    
    # Seed News
    print("\nSeeding news...")
    existing_news = await db.news.count_documents({})
    if existing_news == 0:
        await db.news.insert_many(news_data)
        print(f"✅ Inserted {len(news_data)} news articles")
    else:
        print(f"ℹ️  News collection already has {existing_news} documents")
    
    print("\n✅ Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
