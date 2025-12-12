import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample Exams Data
EXAMS_DATA = [
    {
        "id": "exam_jee_main",
        "name": "JEE Main",
        "slug": "jee-main",
        "full_name": "Joint Entrance Examination Main",
        "description": "JEE Main is a national level entrance exam for admission to engineering colleges in India including NITs, IIITs, and CFTIs.",
        "conducting_body": "National Testing Agency (NTA)",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Engineering"],
        "exam_mode": "Online",
        "exam_duration": "3 hours",
        "total_marks": 300,
        "num_questions": 90,
        "exam_pattern": {
            "sections": ["Physics", "Chemistry", "Mathematics"],
            "marks_per_section": 100,
            "questions_per_section": 30
        },
        "syllabus": "Class 11 and 12 Physics, Chemistry, and Mathematics",
        "application_start_date": "2025-01-01",
        "application_end_date": "2025-02-15",
        "exam_date": "2025-04-01 to 2025-04-15",
        "result_date": "2025-05-01",
        "eligibility": {
            "qualification": "10+2 with Physics, Chemistry, and Mathematics",
            "min_percentage": "75% for General, 65% for SC/ST"
        },
        "age_limit": "No age limit",
        "application_fee": {
            "General": 1000,
            "OBC": 1000,
            "SC/ST": 500
        },
        "previous_year_cutoffs": [
            {"year": 2024, "category": "General", "cutoff": 90},
            {"year": 2024, "category": "OBC", "cutoff": 74},
            {"year": 2024, "category": "SC", "cutoff": 46}
        ],
        "study_materials": [
            {"name": "JEE Main Syllabus", "type": "PDF", "url": "#"},
            {"name": "Previous Year Papers", "type": "PDF", "url": "#"}
        ],
        "sample_papers": [],
        "important_topics": ["Mechanics", "Organic Chemistry", "Calculus"],
        "total_applicants": 1200000,
        "total_seats": 15000,
        "difficulty_level": "High",
        "accepting_colleges": [],
        "official_website": "https://jeemain.nta.nic.in"
    },
    {
        "id": "exam_neet_ug",
        "name": "NEET UG",
        "slug": "neet-ug",
        "full_name": "National Eligibility cum Entrance Test (Undergraduate)",
        "description": "NEET UG is the qualifying test for MBBS and BDS courses in Indian medical and dental colleges.",
        "conducting_body": "National Testing Agency (NTA)",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Medical"],
        "exam_mode": "Offline",
        "exam_duration": "3 hours 20 minutes",
        "total_marks": 720,
        "num_questions": 200,
        "exam_pattern": {
            "sections": ["Physics", "Chemistry", "Biology"],
            "marks_per_section": {"Physics": 180, "Chemistry": 180, "Biology": 360}
        },
        "syllabus": "Class 11 and 12 Physics, Chemistry, and Biology",
        "application_start_date": "2025-02-01",
        "application_end_date": "2025-03-15",
        "exam_date": "2025-05-05",
        "result_date": "2025-06-10",
        "eligibility": {
            "qualification": "10+2 with Physics, Chemistry, Biology",
            "min_percentage": "50% for General, 40% for SC/ST/OBC"
        },
        "age_limit": "17 years minimum, no upper limit",
        "application_fee": {
            "General": 1700,
            "OBC": 1600,
            "SC/ST": 1000
        },
        "previous_year_cutoffs": [
            {"year": 2024, "category": "General", "cutoff": 720},
            {"year": 2024, "category": "OBC": 690},
            {"year": 2024, "category": "SC": 600}
        ],
        "study_materials": [],
        "sample_papers": [],
        "important_topics": ["Human Physiology", "Genetics", "Organic Chemistry"],
        "total_applicants": 2000000,
        "total_seats": 90000,
        "difficulty_level": "High",
        "accepting_colleges": [],
        "official_website": "https://neet.nta.nic.in"
    },
    {
        "id": "exam_cat",
        "name": "CAT",
        "slug": "cat",
        "full_name": "Common Admission Test",
        "description": "CAT is a national level entrance exam for admission to MBA programs in IIMs and other top B-schools.",
        "conducting_body": "Indian Institutes of Management (IIMs)",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Management"],
        "exam_mode": "Online",
        "exam_duration": "2 hours",
        "total_marks": 300,
        "num_questions": 66,
        "exam_pattern": {
            "sections": ["Verbal Ability", "Data Interpretation", "Quantitative Aptitude"],
            "marks_per_section": 100
        },
        "syllabus": "Verbal Ability, Reading Comprehension, Logical Reasoning, Data Interpretation, Quantitative Aptitude",
        "application_start_date": "2025-08-01",
        "application_end_date": "2025-09-15",
        "exam_date": "2025-11-26",
        "result_date": "2025-12-20",
        "eligibility": {
            "qualification": "Bachelor's Degree with 50% marks (45% for SC/ST/PWD)",
            "min_percentage": "50%"
        },
        "age_limit": "No age limit",
        "application_fee": {
            "General": 2500,
            "OBC": 2500,
            "SC/ST": 1250
        },
        "previous_year_cutoffs": [
            {"year": 2024, "category": "General", "percentile": 90},
            {"year": 2024, "category": "OBC", "percentile": 78},
            {"year": 2024, "category": "SC", "percentile": 60}
        ],
        "study_materials": [],
        "sample_papers": [],
        "important_topics": ["Reading Comprehension", "Data Sufficiency", "Number Systems"],
        "total_applicants": 250000,
        "total_seats": 5000,
        "difficulty_level": "Very High",
        "accepting_colleges": [],
        "official_website": "https://iimcat.ac.in"
    },
    {
        "id": "exam_gate",
        "name": "GATE",
        "slug": "gate",
        "full_name": "Graduate Aptitude Test in Engineering",
        "description": "GATE is a national level exam for admission to M.Tech programs and recruitment in PSUs.",
        "conducting_body": "IIT (Rotational)",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Engineering"],
        "exam_mode": "Online",
        "exam_duration": "3 hours",
        "total_marks": 100,
        "num_questions": 65,
        "exam_pattern": {
            "sections": ["General Aptitude", "Engineering Subject"],
            "marks_distribution": {"GA": 15, "Subject": 85}
        },
        "syllabus": "Engineering Mathematics and Subject-specific topics",
        "application_start_date": "2025-01-15",
        "application_end_date": "2025-03-01",
        "exam_date": "2025-02-01 to 2025-02-16",
        "result_date": "2025-03-20",
        "eligibility": {
            "qualification": "B.Tech/B.E. or equivalent in relevant discipline"
        },
        "application_fee": {
            "General": 1800,
            "Female": 900,
            "SC/ST": 900
        },
        "study_materials": [],
        "important_topics": [],
        "total_applicants": 900000,
        "total_seats": 100000,
        "difficulty_level": "High",
        "official_website": "https://gate.iitk.ac.in"
    }
]

# Sample Courses Data
COURSES_DATA = [
    {
        "id": "course_btech",
        "name": "B.Tech",
        "slug": "btech",
        "full_name": "Bachelor of Technology",
        "description": "B.Tech is a 4-year undergraduate program in engineering and technology. It covers various specializations and prepares students for careers in engineering and technical fields.",
        "degree_type": "UG",
        "stream": "Engineering",
        "sub_stream": None,
        "duration": "4 years",
        "average_fees": 500000,
        "fee_range": {"min": 50000, "max": 2000000},
        "eligibility": "10+2 with Physics, Chemistry, Mathematics and minimum 75% marks",
        "entrance_exams": ["exam_jee_main", "exam_gate"],
        "syllabus": "Engineering Mathematics, Programming, Core Engineering Subjects",
        "subjects": ["Engineering Mathematics", "Programming", "Data Structures", "DBMS", "OS"],
        "specializations": ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"],
        "career_options": ["Software Engineer", "Data Scientist", "Mechanical Engineer", "Civil Engineer"],
        "average_salary": 600000,
        "top_recruiters": ["TCS", "Infosys", "Wipro", "Google", "Microsoft"],
        "total_colleges": 5000,
        "top_colleges": [],
        "popularity_score": 95,
        "difficulty_level": "Medium"
    },
    {
        "id": "course_mbbs",
        "name": "MBBS",
        "slug": "mbbs",
        "full_name": "Bachelor of Medicine, Bachelor of Surgery",
        "description": "MBBS is a 5.5-year undergraduate medical degree program including 1 year of internship. It prepares students to become medical doctors.",
        "degree_type": "UG",
        "stream": "Medical",
        "sub_stream": None,
        "duration": "5.5 years",
        "average_fees": 1500000,
        "fee_range": {"min": 200000, "max": 10000000},
        "eligibility": "10+2 with Physics, Chemistry, Biology and NEET qualification",
        "entrance_exams": ["exam_neet_ug"],
        "syllabus": "Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Medicine, Surgery",
        "subjects": ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Medicine", "Surgery"],
        "specializations": ["General Medicine", "Surgery", "Pediatrics", "Gynecology", "Orthopedics"],
        "career_options": ["Doctor", "Surgeon", "Medical Officer", "Specialist"],
        "average_salary": 800000,
        "top_recruiters": ["AIIMS", "Government Hospitals", "Private Hospitals", "Clinics"],
        "total_colleges": 600,
        "top_colleges": [],
        "popularity_score": 98,
        "difficulty_level": "Very High"
    },
    {
        "id": "course_mba",
        "name": "MBA",
        "slug": "mba",
        "full_name": "Master of Business Administration",
        "description": "MBA is a 2-year postgraduate program in business administration and management. It prepares students for leadership roles in business.",
        "degree_type": "PG",
        "stream": "Management",
        "sub_stream": None,
        "duration": "2 years",
        "average_fees": 1000000,
        "fee_range": {"min": 200000, "max": 3000000},
        "eligibility": "Bachelor's Degree with 50% marks and CAT/MAT qualification",
        "entrance_exams": ["exam_cat"],
        "syllabus": "Marketing, Finance, HR, Operations, Strategy",
        "subjects": ["Marketing Management", "Financial Management", "HR Management", "Operations"],
        "specializations": ["Marketing", "Finance", "HR", "Operations", "IT", "Strategy"],
        "career_options": ["Manager", "Consultant", "Business Analyst", "Marketing Manager"],
        "average_salary": 1200000,
        "top_recruiters": ["Deloitte", "McKinsey", "BCG", "Google", "Amazon"],
        "total_colleges": 3000,
        "top_colleges": [],
        "popularity_score": 92,
        "difficulty_level": "Medium"
    },
    {
        "id": "course_bba",
        "name": "BBA",
        "slug": "bba",
        "full_name": "Bachelor of Business Administration",
        "description": "BBA is a 3-year undergraduate program in business administration focusing on management principles.",
        "degree_type": "UG",
        "stream": "Management",
        "duration": "3 years",
        "average_fees": 300000,
        "fee_range": {"min": 50000, "max": 1000000},
        "eligibility": "10+2 with minimum 50% marks",
        "entrance_exams": [],
        "subjects": ["Business Communication", "Accounting", "Marketing", "Economics"],
        "career_options": ["Business Analyst", "Marketing Executive", "HR Executive"],
        "average_salary": 400000,
        "top_recruiters": ["HDFC", "ICICI", "TCS", "Wipro"],
        "total_colleges": 2000,
        "popularity_score": 80
    },
    {
        "id": "course_bsc",
        "name": "B.Sc",
        "slug": "bsc",
        "full_name": "Bachelor of Science",
        "description": "B.Sc is a 3-year undergraduate program in various science subjects.",
        "degree_type": "UG",
        "stream": "Science",
        "duration": "3 years",
        "average_fees": 150000,
        "fee_range": {"min": 30000, "max": 500000},
        "eligibility": "10+2 with Science subjects",
        "entrance_exams": [],
        "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "specializations": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
        "career_options": ["Scientist", "Researcher", "Teacher", "Lab Technician"],
        "average_salary": 350000,
        "total_colleges": 4000,
        "popularity_score": 75
    }
]

async def seed_exams_and_courses():
    print("Starting seed for exams and courses...")
    
    # Clear existing data
    await db.exams.delete_many({})
    await db.courses.delete_many({})
    
    # Insert exams
    for exam in EXAMS_DATA:
        await db.exams.insert_one(exam)
        print(f"✓ Inserted exam: {exam['name']}")
    
    # Insert courses
    for course in COURSES_DATA:
        await db.courses.insert_one(course)
        print(f"✓ Inserted course: {course['name']}")
    
    print(f"\nSeeding completed!")
    print(f"Total Exams: {len(EXAMS_DATA)}")
    print(f"Total Courses: {len(COURSES_DATA)}")

if __name__ == "__main__":
    asyncio.run(seed_exams_and_courses())
    print("\n✅ Database seeded successfully!")
