import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Study Materials Data
study_materials = [
    {
        "id": "jee-physics-waves-001",
        "title": "JEE Main Physics - Waves & Sound Complete Notes",
        "exam_name": "JEE Main",
        "subject": "Physics",
        "topic": "Waves and Sound",
        "material_type": "Notes",
        "description": "Comprehensive notes covering wave motion, sound waves, doppler effect, and resonance with solved examples and practice problems.",
        "file_url": "https://example.com/jee-physics-waves.pdf",
        "external_link": None,
        "is_premium": False,
        "downloads": 1250,
        "rating": 4.6,
        "total_ratings": 89,
        "tags": ["JEE", "Physics", "Waves", "Sound", "Free"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "neet-biology-genetics-002",
        "title": "NEET Biology - Genetics and Evolution Sample Papers",
        "exam_name": "NEET",
        "subject": "Biology",
        "topic": "Genetics and Evolution",
        "material_type": "Sample Paper",
        "description": "10 full-length sample papers with detailed solutions for Genetics and Evolution chapter. Based on latest NEET pattern.",
        "file_url": "https://example.com/neet-bio-genetics.pdf",
        "external_link": None,
        "is_premium": True,
        "downloads": 892,
        "rating": 4.8,
        "total_ratings": 156,
        "tags": ["NEET", "Biology", "Genetics", "Premium", "Sample Papers"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "cat-quant-arithmetic-003",
        "title": "CAT Quantitative Aptitude - Arithmetic Previous Year Questions",
        "exam_name": "CAT",
        "subject": "Quantitative Aptitude",
        "topic": "Arithmetic",
        "material_type": "Previous Year",
        "description": "Collection of all CAT previous year questions (2010-2024) on Arithmetic with detailed video solutions and shortcuts.",
        "file_url": None,
        "external_link": "https://example.com/cat-quant-pyq",
        "is_premium": False,
        "downloads": 2340,
        "rating": 4.9,
        "total_ratings": 278,
        "tags": ["CAT", "Quant", "Arithmetic", "PYQ", "Free"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "gate-cs-algorithms-004",
        "title": "GATE CSE - Algorithms Mock Test Series",
        "exam_name": "GATE",
        "subject": "Computer Science",
        "topic": "Algorithms",
        "material_type": "Mock Test",
        "description": "15 full-length mock tests for Algorithms section with instant evaluation and performance analysis. Covers all topics from GATE syllabus.",
        "file_url": None,
        "external_link": "https://example.com/gate-cs-mock",
        "is_premium": True,
        "downloads": 567,
        "rating": 4.7,
        "total_ratings": 92,
        "tags": ["GATE", "CSE", "Algorithms", "Mock Test", "Premium"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "jee-chemistry-organic-005",
        "title": "JEE Advanced Organic Chemistry Video Lectures",
        "exam_name": "JEE Advanced",
        "subject": "Chemistry",
        "topic": "Organic Chemistry",
        "material_type": "Video",
        "description": "50+ hours of video lectures by IIT professors covering complete Organic Chemistry for JEE Advanced with reaction mechanisms and problem-solving techniques.",
        "file_url": None,
        "external_link": "https://example.com/jee-org-chem-videos",
        "is_premium": True,
        "downloads": 1890,
        "rating": 4.9,
        "total_ratings": 412,
        "tags": ["JEE Advanced", "Chemistry", "Organic", "Video", "Premium"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "upsc-polity-notes-006",
        "title": "UPSC Indian Polity Complete Notes with Current Affairs",
        "exam_name": "UPSC",
        "subject": "Indian Polity",
        "topic": None,
        "material_type": "Notes",
        "description": "Comprehensive notes on Indian Constitution, governance, and political system with latest amendments and current affairs integration.",
        "file_url": "https://example.com/upsc-polity.pdf",
        "external_link": None,
        "is_premium": False,
        "downloads": 3450,
        "rating": 4.7,
        "total_ratings": 567,
        "tags": ["UPSC", "Polity", "Current Affairs", "Free"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "neet-chemistry-pyq-007",
        "title": "NEET Chemistry - Physical Chemistry PYQ (2015-2024)",
        "exam_name": "NEET",
        "subject": "Chemistry",
        "topic": "Physical Chemistry",
        "material_type": "Previous Year",
        "description": "All NEET previous year questions from Physical Chemistry with detailed solutions, important formulas, and topic-wise analysis.",
        "file_url": "https://example.com/neet-chem-pyq.pdf",
        "external_link": None,
        "is_premium": False,
        "downloads": 2100,
        "rating": 4.8,
        "total_ratings": 302,
        "tags": ["NEET", "Chemistry", "Physical", "PYQ", "Free"],
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "cat-verbal-rc-008",
        "title": "CAT Verbal - Reading Comprehension Strategy Guide",
        "exam_name": "CAT",
        "subject": "Verbal Ability",
        "topic": "Reading Comprehension",
        "material_type": "Notes",
        "description": "Expert strategies and techniques for cracking RC passages in CAT with 100+ practice passages and detailed explanations.",
        "file_url": "https://example.com/cat-rc-guide.pdf",
        "external_link": None,
        "is_premium": True,
        "downloads": 1560,
        "rating": 4.6,
        "total_ratings": 198,
        "tags": ["CAT", "Verbal", "RC", "Strategy", "Premium"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

# Counselors Data
counselors = [
    {
        "id": "counselor-001",
        "name": "Dr. Priya Sharma",
        "email": "priya.sharma@admissionbuddy.com",
        "phone": "+91-9876543210",
        "specialization": ["Career", "Course Selection", "Study Abroad"],
        "qualifications": "PhD in Education Psychology, M.A. Career Counseling",
        "experience_years": 12,
        "rating": 4.8,
        "total_reviews": 145,
        "bio": "With over 12 years of experience in career counseling, Dr. Priya Sharma has helped thousands of students find their ideal career paths. Specializes in engineering and medical career guidance.",
        "availability": {
            "Monday": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
            "Tuesday": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
            "Wednesday": ["10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
            "Thursday": ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
            "Friday": ["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"]
        },
        "session_fee": 0.0,
        "total_sessions": 1250,
        "profile_image": "https://example.com/counselor-priya.jpg",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "counselor-002",
        "name": "Mr. Rajesh Kumar",
        "email": "rajesh.kumar@admissionbuddy.com",
        "phone": "+91-9876543211",
        "specialization": ["Exam", "Study Abroad"],
        "qualifications": "M.Ed, Certified Career Coach, Former IIT Faculty",
        "experience_years": 15,
        "rating": 4.9,
        "total_reviews": 289,
        "bio": "Former IIT professor with 15 years of experience in entrance exam preparation. Expert in JEE, NEET, GATE counseling and strategy building.",
        "availability": {
            "Monday": ["9:00 AM", "10:00 AM", "3:00 PM", "5:00 PM"],
            "Tuesday": ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
            "Wednesday": ["9:00 AM", "10:00 AM", "3:00 PM", "4:00 PM"],
            "Thursday": ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
            "Friday": ["9:00 AM", "10:00 AM", "3:00 PM", "4:00 PM", "5:00 PM"]
        },
        "session_fee": 0.0,
        "total_sessions": 2100,
        "profile_image": "https://example.com/counselor-rajesh.jpg",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "counselor-003",
        "name": "Ms. Anita Desai",
        "email": "anita.desai@admissionbuddy.com",
        "phone": "+91-9876543212",
        "specialization": ["Course Selection", "Career"],
        "qualifications": "MBA, Certified Life Coach, 10+ years Corporate HR",
        "experience_years": 10,
        "rating": 4.7,
        "total_reviews": 178,
        "bio": "With a background in corporate HR and MBA, Anita specializes in helping students choose the right courses aligned with market demands and personal interests.",
        "availability": {
            "Monday": ["11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
            "Tuesday": ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
            "Wednesday": ["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
            "Thursday": ["11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
            "Friday": ["10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
        },
        "session_fee": 0.0,
        "total_sessions": 890,
        "profile_image": "https://example.com/counselor-anita.jpg",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "counselor-004",
        "name": "Dr. Amit Verma",
        "email": "amit.verma@admissionbuddy.com",
        "phone": "+91-9876543213",
        "specialization": ["Study Abroad", "Career"],
        "qualifications": "PhD from Stanford, Study Abroad Consultant",
        "experience_years": 8,
        "rating": 4.9,
        "total_reviews": 234,
        "bio": "PhD from Stanford University with expertise in international admissions. Has helped 500+ students get into top universities abroad including Ivy League schools.",
        "availability": {
            "Monday": ["1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM"],
            "Tuesday": ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
            "Wednesday": ["1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM"],
            "Thursday": ["1:00 PM", "2:00 PM", "3:00 PM", "5:00 PM"],
            "Friday": ["1:00 PM", "2:00 PM", "4:00 PM", "5:00 PM"]
        },
        "session_fee": 0.0,
        "total_sessions": 650,
        "profile_image": "https://example.com/counselor-amit.jpg",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "counselor-005",
        "name": "Ms. Neha Gupta",
        "email": "neha.gupta@admissionbuddy.com",
        "phone": "+91-9876543214",
        "specialization": ["Exam", "Career"],
        "qualifications": "M.Sc Psychology, CAT 99.9%ile, Career Counselor",
        "experience_years": 7,
        "rating": 4.8,
        "total_reviews": 167,
        "bio": "CAT 99.9 percentiler with expertise in MBA entrance exam preparation and career counseling for management aspirants. Passionate about helping students achieve their goals.",
        "availability": {
            "Monday": ["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
            "Tuesday": ["10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
            "Wednesday": ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
            "Thursday": ["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
            "Friday": ["11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
        },
        "session_fee": 0.0,
        "total_sessions": 720,
        "profile_image": "https://example.com/counselor-neha.jpg",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_data():
    try:
        # Clear existing data
        await db.study_materials.delete_many({})
        await db.counselors.delete_many({})
        
        # Insert study materials
        if study_materials:
            await db.study_materials.insert_many(study_materials)
            print(f"✓ Inserted {len(study_materials)} study materials")
        
        # Insert counselors
        if counselors:
            await db.counselors.insert_many(counselors)
            print(f"✓ Inserted {len(counselors)} counselors")
        
        print("\n✅ Extended features data seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
