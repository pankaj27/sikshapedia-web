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

# Additional Colleges Data
MORE_COLLEGES = [
    {
        "id": "iit-bombay-002",
        "name": "IIT Bombay",
        "description": "IIT Bombay is one of the premier engineering institutions in India, known for its academic excellence and cutting-edge research.",
        "location": {"city": "Mumbai", "state": "Maharashtra", "country": "India", "pincode": "400076"},
        "type": "Government",
        "established": "1958",
        "rating": 4.7,
        "total_students": 11000,
        "average_fees": 200000,
        "courses": ["B.Tech", "M.Tech", "PhD"],
        "ranking": {"nirf": 3, "world": 172},
        "accreditation": ["NAAC A++", "NBA"],
        "placements": {
            "average_package": "₹20 LPA",
            "highest_package": "₹1.5 Cr",
            "top_recruiters": ["Google", "Microsoft", "Amazon", "Flipkart"]
        },
        "facilities": ["Library", "Hostel", "Sports Complex", "Research Labs"],
        "images": [],
        "contact": {"email": "info@iitb.ac.in", "phone": "+91-22-2576-4444", "website": "https://www.iitb.ac.in"}
    },
    {
        "id": "bits-pilani-001",
        "name": "BITS Pilani",
        "description": "BITS Pilani is a prestigious private engineering institute offering world-class education in technology and sciences.",
        "location": {"city": "Pilani", "state": "Rajasthan", "country": "India", "pincode": "333031"},
        "type": "Private",
        "established": "1964",
        "rating": 4.5,
        "total_students": 18000,
        "average_fees": 450000,
        "courses": ["B.Tech", "M.Sc", "MBA", "PhD"],
        "ranking": {"nirf": 30, "world": 400},
        "accreditation": ["NAAC A++", "NBA"],
        "placements": {
            "average_package": "₹15 LPA",
            "highest_package": "₹1.2 Cr",
            "top_recruiters": ["Amazon", "Microsoft", "Oracle", "Samsung"]
        },
        "facilities": ["Central Library", "Hostel", "Sports", "Innovation Center"],
        "images": [],
        "contact": {"email": "admissions@pilani.bits-pilani.ac.in", "phone": "+91-1596-242210"}
    },
    {
        "id": "aiims-delhi-001",
        "name": "AIIMS Delhi",
        "description": "AIIMS Delhi is India's premier medical institute, renowned for medical education, research, and patient care.",
        "location": {"city": "New Delhi", "state": "Delhi", "country": "India", "pincode": "110029"},
        "type": "Government",
        "established": "1956",
        "rating": 4.9,
        "total_students": 3500,
        "average_fees": 10000,
        "courses": ["MBBS", "MD", "MS", "DM", "MCh"],
        "ranking": {"nirf": 1, "world": 150},
        "accreditation": ["NAAC A++", "MCI"],
        "placements": {
            "average_package": "₹18 LPA",
            "highest_package": "₹60 LPA",
            "top_recruiters": ["Apollo Hospitals", "Fortis", "Max Healthcare"]
        },
        "facilities": ["Hospital", "Research Labs", "Library", "Hostel"],
        "images": [],
        "contact": {"email": "info@aiims.edu", "phone": "+91-11-2658-8500"}
    },
    {
        "id": "iim-ahmedabad-001",
        "name": "IIM Ahmedabad",
        "description": "IIM Ahmedabad is India's leading business school, known for its rigorous MBA program and management research.",
        "location": {"city": "Ahmedabad", "state": "Gujarat", "country": "India", "pincode": "380015"},
        "type": "Government",
        "established": "1961",
        "rating": 4.8,
        "total_students": 1200,
        "average_fees": 2500000,
        "courses": ["MBA", "PhD", "Executive MBA"],
        "ranking": {"nirf": 1, "world": 45},
        "accreditation": ["AACSB", "EQUIS", "AMBA"],
        "placements": {
            "average_package": "₹33 LPA",
            "highest_package": "₹1.14 Cr",
            "top_recruiters": ["McKinsey", "BCG", "Bain", "Amazon"]
        },
        "facilities": ["Library", "Hostel", "Sports Complex", "Case Study Center"],
        "images": [],
        "contact": {"email": "admissions@iima.ac.in", "phone": "+91-79-6632-4444"}
    },
    {
        "id": "nit-trichy-001",
        "name": "NIT Trichy",
        "description": "NIT Trichy is one of India's top National Institutes of Technology, known for engineering excellence.",
        "location": {"city": "Tiruchirappalli", "state": "Tamil Nadu", "country": "India", "pincode": "620015"},
        "type": "Government",
        "established": "1964",
        "rating": 4.4,
        "total_students": 9000,
        "average_fees": 150000,
        "courses": ["B.Tech", "M.Tech", "MBA", "PhD"],
        "ranking": {"nirf": 9, "world": 500},
        "accreditation": ["NAAC A", "NBA"],
        "placements": {
            "average_package": "₹12 LPA",
            "highest_package": "₹40 LPA",
            "top_recruiters": ["TCS", "Infosys", "Wipro", "Cognizant"]
        },
        "facilities": ["Library", "Hostel", "Labs", "Sports Complex"],
        "images": [],
        "contact": {"email": "admissions@nitt.edu", "phone": "+91-431-250-1801"}
    },
    {
        "id": "du-delhi-001",
        "name": "Delhi University",
        "description": "Delhi University is one of India's premier universities offering diverse undergraduate and postgraduate programs.",
        "location": {"city": "New Delhi", "state": "Delhi", "country": "India", "pincode": "110007"},
        "type": "Government",
        "established": "1922",
        "rating": 4.3,
        "total_students": 130000,
        "average_fees": 50000,
        "courses": ["BA", "B.Sc", "B.Com", "MA", "M.Sc", "PhD"],
        "ranking": {"nirf": 11, "world": 400},
        "accreditation": ["NAAC A++", "UGC"],
        "placements": {
            "average_package": "₹6 LPA",
            "highest_package": "₹25 LPA",
            "top_recruiters": ["Deloitte", "EY", "KPMG", "PwC"]
        },
        "facilities": ["Central Library", "Sports Complex", "Hostels", "Computer Centers"],
        "images": [],
        "contact": {"email": "info@du.ac.in", "phone": "+91-11-2766-7853"}
    },
    {
        "id": "vit-vellore-001",
        "name": "VIT Vellore",
        "description": "VIT is a leading private engineering university known for its industry-oriented curriculum and research.",
        "location": {"city": "Vellore", "state": "Tamil Nadu", "country": "India", "pincode": "632014"},
        "type": "Private",
        "established": "1984",
        "rating": 4.2,
        "total_students": 35000,
        "average_fees": 180000,
        "courses": ["B.Tech", "M.Tech", "MBA", "Integrated Programs"],
        "ranking": {"nirf": 15, "world": 600},
        "accreditation": ["NAAC A++", "NBA"],
        "placements": {
            "average_package": "₹7.5 LPA",
            "highest_package": "₹41 LPA",
            "top_recruiters": ["Cognizant", "TCS", "Wipro", "Accenture"]
        },
        "facilities": ["Library", "Hostel", "Sports", "Innovation Lab"],
        "images": [],
        "contact": {"email": "admissions@vit.ac.in", "phone": "+91-416-220-2020"}
    },
    {
        "id": "srm-chennai-001",
        "name": "SRM Institute",
        "description": "SRM is a leading private university offering quality education in engineering, medicine, and management.",
        "location": {"city": "Chennai", "state": "Tamil Nadu", "country": "India", "pincode": "603203"},
        "type": "Private",
        "established": "1985",
        "rating": 4.1,
        "total_students": 38000,
        "average_fees": 200000,
        "courses": ["B.Tech", "MBBS", "MBA", "B.Sc"],
        "ranking": {"nirf": 25, "world": 700},
        "accreditation": ["NAAC A++", "NBA", "MCI"],
        "placements": {
            "average_package": "₹6 LPA",
            "highest_package": "₹30 LPA",
            "top_recruiters": ["Infosys", "TCS", "Wipro", "Tech Mahindra"]
        },
        "facilities": ["Library", "Hospital", "Sports Complex", "Innovation Center"],
        "images": [],
        "contact": {"email": "admissions@srmist.edu.in", "phone": "+91-44-2741-7000"}
    }
]

# Additional Exams
MORE_EXAMS = [
    {
        "id": "exam_upsc_cse",
        "name": "UPSC CSE",
        "slug": "upsc-cse",
        "full_name": "Union Public Service Commission Civil Services Examination",
        "description": "UPSC CSE is India's most prestigious exam for recruitment to administrative services like IAS, IPS, IFS.",
        "conducting_body": "Union Public Service Commission",
        "exam_level": "National",
        "exam_type": "Eligibility",
        "streams": ["Civil Services"],
        "exam_mode": "Offline",
        "exam_duration": "2 hours (per paper)",
        "total_marks": 1750,
        "num_questions": 200,
        "exam_pattern": {"stages": ["Prelims", "Mains", "Interview"]},
        "eligibility": {"qualification": "Bachelor's degree", "min_percentage": "No minimum percentage"},
        "age_limit": "21-32 years (relaxation for reserved categories)",
        "application_fee": {"General": 100, "Female": 0, "SC/ST": 0},
        "total_applicants": 1000000,
        "total_seats": 1000,
        "difficulty_level": "Very High",
        "official_website": "https://www.upsc.gov.in"
    },
    {
        "id": "exam_xat",
        "name": "XAT",
        "slug": "xat",
        "full_name": "Xavier Aptitude Test",
        "description": "XAT is a national level MBA entrance exam conducted by XLRI for admission to top B-schools.",
        "conducting_body": "XLRI Jamshedpur",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Management"],
        "exam_mode": "Online",
        "exam_duration": "3.5 hours",
        "total_marks": 100,
        "num_questions": 100,
        "exam_pattern": {"sections": ["Verbal", "Decision Making", "Quantitative", "GK"]},
        "eligibility": {"qualification": "Bachelor's degree"},
        "application_fee": {"General": 2000, "Female": 2000},
        "total_applicants": 100000,
        "difficulty_level": "High",
        "official_website": "https://xatonline.in"
    }
]

# Additional Courses
MORE_COURSES = [
    {
        "id": "course_bca",
        "name": "BCA",
        "slug": "bca",
        "full_name": "Bachelor of Computer Applications",
        "description": "BCA is a 3-year undergraduate program focused on computer applications and software development.",
        "degree_type": "UG",
        "stream": "Computer Applications",
        "duration": "3 years",
        "average_fees": 150000,
        "fee_range": {"min": 30000, "max": 500000},
        "eligibility": "10+2 with Mathematics",
        "entrance_exams": [],
        "subjects": ["Programming", "Database Management", "Web Development", "Networking"],
        "career_options": ["Software Developer", "Web Developer", "Database Administrator"],
        "average_salary": 350000,
        "top_recruiters": ["TCS", "Infosys", "Wipro", "Tech Mahindra"],
        "total_colleges": 3000,
        "popularity_score": 80
    },
    {
        "id": "course_mca",
        "name": "MCA",
        "slug": "mca",
        "full_name": "Master of Computer Applications",
        "description": "MCA is a 2-year postgraduate program in computer applications and software engineering.",
        "degree_type": "PG",
        "stream": "Computer Applications",
        "duration": "2 years",
        "average_fees": 200000,
        "fee_range": {"min": 50000, "max": 800000},
        "eligibility": "Bachelor's degree with Mathematics",
        "entrance_exams": [],
        "subjects": ["Advanced Programming", "AI/ML", "Cloud Computing", "Mobile App Development"],
        "career_options": ["Software Engineer", "Data Scientist", "System Architect"],
        "average_salary": 600000,
        "top_recruiters": ["Google", "Microsoft", "Amazon", "IBM"],
        "total_colleges": 2000,
        "popularity_score": 85
    }
]

async def seed_more_data():
    print("Adding more colleges, exams, and courses...")
    
    # Insert additional colleges
    for college in MORE_COLLEGES:
        existing = await db.colleges.find_one({"id": college["id"]})
        if not existing:
            await db.colleges.insert_one(college)
            print(f"✓ Inserted college: {college['name']}")
    
    # Insert additional exams
    for exam in MORE_EXAMS:
        existing = await db.exams.find_one({"id": exam["id"]})
        if not existing:
            await db.exams.insert_one(exam)
            print(f"✓ Inserted exam: {exam['name']}")
    
    # Insert additional courses
    for course in MORE_COURSES:
        existing = await db.courses.find_one({"id": course["id"]})
        if not existing:
            await db.courses.insert_one(course)
            print(f"✓ Inserted course: {course['name']}")
    
    print(f"\n✅ Additional data seeded successfully!")
    print(f"New Colleges: {len(MORE_COLLEGES)}")
    print(f"New Exams: {len(MORE_EXAMS)}")
    print(f"New Courses: {len(MORE_COURSES)}")

if __name__ == "__main__":
    asyncio.run(seed_more_data())
