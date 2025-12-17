"""
Seed script for Indian School Boards data
Run: python seed_boards_data.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

# Indian School Boards comprehensive data
INDIAN_BOARDS = [
    # National Boards
    {
        "name": "CBSE",
        "full_name": "Central Board of Secondary Education",
        "slug": "cbse",
        "type": "National",
        "description": "CBSE is a national level board of education in India for public and private schools, controlled and managed by the Government of India. It is one of the most popular boards in India with schools across the country and abroad.",
        "headquarters": "New Delhi",
        "established": 1962,
        "website": "https://www.cbse.gov.in",
        "recognition": "Government of India",
        "medium_of_instruction": ["English", "Hindi"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "CGPA based (9-point scale)",
        "key_features": [
            "NCERT Curriculum",
            "Uniform syllabus across India",
            "Recognized worldwide",
            "Competitive exam focused (JEE, NEET)",
            "Regular curriculum updates"
        ],
        "total_schools": 28000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "ICSE",
        "full_name": "Indian Certificate of Secondary Education",
        "slug": "icse",
        "type": "National",
        "description": "ICSE is an examination conducted by the Council for the Indian School Certificate Examinations (CISCE). Known for its comprehensive and application-based curriculum, it is popular among English-medium schools.",
        "headquarters": "New Delhi",
        "established": 1958,
        "website": "https://www.cisce.org",
        "recognition": "Government of India",
        "medium_of_instruction": ["English"],
        "exam_pattern": "10+2 Pattern (ICSE for Class 10, ISC for Class 12)",
        "grading_system": "Percentage based",
        "key_features": [
            "Comprehensive curriculum",
            "Strong focus on English",
            "Internal assessment component",
            "Practical-based learning",
            "Wide subject choices"
        ],
        "total_schools": 2500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "NIOS",
        "full_name": "National Institute of Open Schooling",
        "slug": "nios",
        "type": "National",
        "description": "NIOS is the largest open schooling system in the world, providing education to those who cannot attend regular schools. It offers flexible learning opportunities for students of all ages.",
        "headquarters": "Noida, Uttar Pradesh",
        "established": 1989,
        "website": "https://www.nios.ac.in",
        "recognition": "Government of India (MHRD)",
        "medium_of_instruction": ["English", "Hindi", "Urdu", "Regional Languages"],
        "exam_pattern": "Flexible - On-demand examination",
        "grading_system": "Percentage based with credit system",
        "key_features": [
            "Open and distance learning",
            "Flexible examination schedule",
            "Vocational courses available",
            "Recognition equivalent to CBSE/ICSE",
            "Transfer of credits facility"
        ],
        "total_schools": 7500,
        "country": "India",
        "is_active": True
    },
    
    # State Boards
    {
        "name": "Maharashtra State Board",
        "full_name": "Maharashtra State Board of Secondary and Higher Secondary Education",
        "slug": "maharashtra-board",
        "type": "State",
        "state": "Maharashtra",
        "description": "One of the largest state boards in India, governing education for students in Maharashtra. Known for its well-structured curriculum and standardized evaluation.",
        "headquarters": "Pune",
        "established": 1965,
        "website": "https://www.mahahsscboard.in",
        "recognition": "Government of Maharashtra",
        "medium_of_instruction": ["Marathi", "English", "Hindi", "Urdu"],
        "exam_pattern": "10+2 Pattern (SSC for Class 10, HSC for Class 12)",
        "grading_system": "Percentage based",
        "key_features": [
            "Regional language emphasis",
            "State-specific curriculum",
            "Affordable education",
            "Wide network of schools"
        ],
        "total_schools": 25000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "UP Board",
        "full_name": "Uttar Pradesh Madhyamik Shiksha Parishad",
        "slug": "up-board",
        "type": "State",
        "state": "Uttar Pradesh",
        "description": "One of the oldest and largest state education boards in India, conducting examinations for secondary and higher secondary students in Uttar Pradesh.",
        "headquarters": "Prayagraj (Allahabad)",
        "established": 1921,
        "website": "https://upmsp.edu.in",
        "recognition": "Government of Uttar Pradesh",
        "medium_of_instruction": ["Hindi", "English", "Urdu", "Sanskrit"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Largest state board by student enrollment",
            "Hindi medium focus",
            "Traditional curriculum",
            "Strong mathematics focus"
        ],
        "total_schools": 27000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Tamil Nadu State Board",
        "full_name": "Tamil Nadu Board of Secondary Education",
        "slug": "tamil-nadu-board",
        "type": "State",
        "state": "Tamil Nadu",
        "description": "Responsible for the administration and management of secondary and higher secondary education examinations in Tamil Nadu.",
        "headquarters": "Chennai",
        "established": 1910,
        "website": "https://www.dge.tn.gov.in",
        "recognition": "Government of Tamil Nadu",
        "medium_of_instruction": ["Tamil", "English"],
        "exam_pattern": "10+2 Pattern (SSLC for Class 10, HSC for Class 12)",
        "grading_system": "Percentage based",
        "key_features": [
            "Samacheer Kalvi curriculum",
            "Bilingual education",
            "Strong science and mathematics",
            "State-specific content"
        ],
        "total_schools": 12500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Karnataka State Board",
        "full_name": "Karnataka Secondary Education Examination Board",
        "slug": "karnataka-board",
        "type": "State",
        "state": "Karnataka",
        "description": "Conducts SSLC and PUC examinations for students in Karnataka. Known for its comprehensive curriculum and focus on both academic and practical education.",
        "headquarters": "Bengaluru",
        "established": 1966,
        "website": "https://kseeb.kar.nic.in",
        "recognition": "Government of Karnataka",
        "medium_of_instruction": ["Kannada", "English", "Hindi", "Urdu", "Sanskrit", "Marathi", "Tamil", "Telugu"],
        "exam_pattern": "10+2 Pattern (SSLC + PUC)",
        "grading_system": "Percentage based with grades",
        "key_features": [
            "Multiple language options",
            "Practical examination component",
            "Integrated curriculum",
            "Focus on regional identity"
        ],
        "total_schools": 15000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Gujarat Secondary Education Board",
        "full_name": "Gujarat Secondary and Higher Secondary Education Board",
        "slug": "gujarat-board",
        "type": "State",
        "state": "Gujarat",
        "description": "Administers and oversees the secondary and higher secondary education system in Gujarat state.",
        "headquarters": "Gandhinagar",
        "established": 1972,
        "website": "https://www.gseb.org",
        "recognition": "Government of Gujarat",
        "medium_of_instruction": ["Gujarati", "English", "Hindi"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Gujarati medium emphasis",
            "Commerce stream excellence",
            "State curriculum integration",
            "Vocational education options"
        ],
        "total_schools": 9500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Rajasthan Board",
        "full_name": "Board of Secondary Education, Rajasthan",
        "slug": "rajasthan-board",
        "type": "State",
        "state": "Rajasthan",
        "description": "One of the oldest state boards in India, responsible for secondary and senior secondary education in Rajasthan.",
        "headquarters": "Ajmer",
        "established": 1957,
        "website": "https://rajeduboard.rajasthan.gov.in",
        "recognition": "Government of Rajasthan",
        "medium_of_instruction": ["Hindi", "English"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Hindi medium focus",
            "Arts and commerce streams",
            "Rural school network",
            "Traditional education values"
        ],
        "total_schools": 12000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "West Bengal Board",
        "full_name": "West Bengal Board of Secondary Education",
        "slug": "west-bengal-board",
        "type": "State",
        "state": "West Bengal",
        "description": "Governs and supervises the secondary education system in West Bengal. Known for its rigorous academic standards.",
        "headquarters": "Kolkata",
        "established": 1951,
        "website": "https://wbbse.wb.gov.in",
        "recognition": "Government of West Bengal",
        "medium_of_instruction": ["Bengali", "English", "Hindi", "Urdu", "Nepali", "Santhali"],
        "exam_pattern": "10+2 Pattern (Madhyamik + HS)",
        "grading_system": "Percentage based",
        "key_features": [
            "Strong academic tradition",
            "Bengali literature emphasis",
            "Arts and humanities focus",
            "Multiple language options"
        ],
        "total_schools": 10000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Kerala State Board",
        "full_name": "Kerala Board of Public Examinations",
        "slug": "kerala-board",
        "type": "State",
        "state": "Kerala",
        "description": "Manages and conducts public examinations for secondary and higher secondary students in Kerala, known for high literacy rates.",
        "headquarters": "Thiruvananthapuram",
        "established": 1990,
        "website": "https://keralapareekshabhavan.in",
        "recognition": "Government of Kerala",
        "medium_of_instruction": ["Malayalam", "English"],
        "exam_pattern": "10+2 Pattern (SSLC + Plus Two)",
        "grading_system": "Grade-based (9-point scale)",
        "key_features": [
            "High pass rates",
            "Strong science education",
            "IT integration in curriculum",
            "Focus on practical skills"
        ],
        "total_schools": 5000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Andhra Pradesh Board",
        "full_name": "Board of Secondary Education, Andhra Pradesh",
        "slug": "andhra-pradesh-board",
        "type": "State",
        "state": "Andhra Pradesh",
        "description": "Responsible for secondary education examinations in Andhra Pradesh state.",
        "headquarters": "Vijayawada",
        "established": 1953,
        "website": "https://bse.ap.gov.in",
        "recognition": "Government of Andhra Pradesh",
        "medium_of_instruction": ["Telugu", "English", "Urdu", "Hindi"],
        "exam_pattern": "10+2 Pattern (SSC + Intermediate)",
        "grading_system": "Percentage and Grade based",
        "key_features": [
            "Telugu medium emphasis",
            "Engineering entrance focus",
            "State-specific curriculum",
            "Intermediate education system"
        ],
        "total_schools": 15000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Telangana State Board",
        "full_name": "Board of Secondary Education, Telangana",
        "slug": "telangana-board",
        "type": "State",
        "state": "Telangana",
        "description": "Governs secondary education in Telangana state, established after the state's formation in 2014.",
        "headquarters": "Hyderabad",
        "established": 2014,
        "website": "https://bse.telangana.gov.in",
        "recognition": "Government of Telangana",
        "medium_of_instruction": ["Telugu", "English", "Urdu", "Hindi"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage and Grade based",
        "key_features": [
            "Modern curriculum",
            "Technology integration",
            "Bilingual education",
            "Competitive exam preparation"
        ],
        "total_schools": 10000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "MP Board",
        "full_name": "Madhya Pradesh Board of Secondary Education",
        "slug": "mp-board",
        "type": "State",
        "state": "Madhya Pradesh",
        "description": "One of the largest state boards conducting examinations for millions of students in Madhya Pradesh.",
        "headquarters": "Bhopal",
        "established": 1965,
        "website": "https://mpbse.nic.in",
        "recognition": "Government of Madhya Pradesh",
        "medium_of_instruction": ["Hindi", "English"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Hindi medium focus",
            "Large student base",
            "Traditional curriculum",
            "Affordable education"
        ],
        "total_schools": 14000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Bihar Board",
        "full_name": "Bihar School Examination Board",
        "slug": "bihar-board",
        "type": "State",
        "state": "Bihar",
        "description": "Conducts Class 10 (Matric) and Class 12 (Intermediate) examinations for students in Bihar.",
        "headquarters": "Patna",
        "established": 1952,
        "website": "https://biharboardonline.bihar.gov.in",
        "recognition": "Government of Bihar",
        "medium_of_instruction": ["Hindi", "English", "Urdu"],
        "exam_pattern": "10+2 Pattern (Matric + Inter)",
        "grading_system": "Percentage based",
        "key_features": [
            "Large student enrollment",
            "Hindi medium primary",
            "Arts stream popularity",
            "Affordable fee structure"
        ],
        "total_schools": 8000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Punjab School Education Board",
        "full_name": "Punjab School Education Board",
        "slug": "punjab-board",
        "type": "State",
        "state": "Punjab",
        "description": "Responsible for the regulation and supervision of school education in Punjab state.",
        "headquarters": "Mohali",
        "established": 1969,
        "website": "https://www.pseb.ac.in",
        "recognition": "Government of Punjab",
        "medium_of_instruction": ["Punjabi", "English", "Hindi"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Punjabi language emphasis",
            "Strong commerce education",
            "Vocational training options",
            "Sports integration"
        ],
        "total_schools": 6500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Haryana Board",
        "full_name": "Board of School Education, Haryana",
        "slug": "haryana-board",
        "type": "State",
        "state": "Haryana",
        "description": "Conducts and regulates secondary and senior secondary education examinations in Haryana.",
        "headquarters": "Bhiwani",
        "established": 1969,
        "website": "https://bseh.org.in",
        "recognition": "Government of Haryana",
        "medium_of_instruction": ["Hindi", "English", "Punjabi", "Sanskrit"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Hindi medium focus",
            "Sports scholarships",
            "Vocational courses",
            "Government school network"
        ],
        "total_schools": 7500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Odisha Board",
        "full_name": "Board of Secondary Education, Odisha",
        "slug": "odisha-board",
        "type": "State",
        "state": "Odisha",
        "description": "Governs secondary education and conducts examinations for students in Odisha state.",
        "headquarters": "Cuttack",
        "established": 1953,
        "website": "https://www.bseodisha.ac.in",
        "recognition": "Government of Odisha",
        "medium_of_instruction": ["Odia", "English", "Hindi", "Urdu", "Telugu"],
        "exam_pattern": "10+2 Pattern (HSC + CHSE)",
        "grading_system": "Percentage based",
        "key_features": [
            "Odia language emphasis",
            "Tribal area schools",
            "Regional curriculum",
            "Affordable education"
        ],
        "total_schools": 8000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Assam Board",
        "full_name": "Board of Secondary Education, Assam",
        "slug": "assam-board",
        "type": "State",
        "state": "Assam",
        "description": "Conducts HSLC (Class 10) and HS (Class 12) examinations in Assam state.",
        "headquarters": "Guwahati",
        "established": 1961,
        "website": "https://sebaonline.org",
        "recognition": "Government of Assam",
        "medium_of_instruction": ["Assamese", "Bengali", "English", "Hindi", "Bodo"],
        "exam_pattern": "10+2 Pattern (HSLC + HS)",
        "grading_system": "Percentage based",
        "key_features": [
            "Multiple regional languages",
            "Tea garden school programs",
            "Northeast cultural curriculum",
            "Inclusive education focus"
        ],
        "total_schools": 5500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Jharkhand Academic Council",
        "full_name": "Jharkhand Academic Council",
        "slug": "jharkhand-board",
        "type": "State",
        "state": "Jharkhand",
        "description": "Responsible for secondary and higher secondary education examinations in Jharkhand.",
        "headquarters": "Ranchi",
        "established": 2003,
        "website": "https://jac.jharkhand.gov.in",
        "recognition": "Government of Jharkhand",
        "medium_of_instruction": ["Hindi", "English", "Urdu"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Tribal education focus",
            "Mining area schools",
            "Hindi medium emphasis",
            "Skill development integration"
        ],
        "total_schools": 4500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Chhattisgarh Board",
        "full_name": "Chhattisgarh Board of Secondary Education",
        "slug": "chhattisgarh-board",
        "type": "State",
        "state": "Chhattisgarh",
        "description": "Conducts Class 10 and 12 board examinations for students in Chhattisgarh.",
        "headquarters": "Raipur",
        "established": 2001,
        "website": "https://cgbse.nic.in",
        "recognition": "Government of Chhattisgarh",
        "medium_of_instruction": ["Hindi", "English"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Tribal language options",
            "Forest area education",
            "Hindi medium primary",
            "Vocational training"
        ],
        "total_schools": 5000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Uttarakhand Board",
        "full_name": "Uttarakhand Board of School Education",
        "slug": "uttarakhand-board",
        "type": "State",
        "state": "Uttarakhand",
        "description": "Manages secondary and higher secondary education in the hill state of Uttarakhand.",
        "headquarters": "Ramnagar",
        "established": 2001,
        "website": "https://ubse.uk.gov.in",
        "recognition": "Government of Uttarakhand",
        "medium_of_instruction": ["Hindi", "English", "Sanskrit"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Hill area education",
            "Environmental studies",
            "Sanskrit promotion",
            "Tourism curriculum"
        ],
        "total_schools": 3500,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Himachal Pradesh Board",
        "full_name": "Himachal Pradesh Board of School Education",
        "slug": "himachal-pradesh-board",
        "type": "State",
        "state": "Himachal Pradesh",
        "description": "Conducts examinations for secondary and higher secondary students in Himachal Pradesh.",
        "headquarters": "Dharamshala",
        "established": 1969,
        "website": "https://hpbose.org",
        "recognition": "Government of Himachal Pradesh",
        "medium_of_instruction": ["Hindi", "English"],
        "exam_pattern": "10+2 Pattern",
        "grading_system": "Percentage based",
        "key_features": [
            "Mountain area schools",
            "High literacy focus",
            "Environmental awareness",
            "Tourism education"
        ],
        "total_schools": 3000,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Goa Board",
        "full_name": "Goa Board of Secondary and Higher Secondary Education",
        "slug": "goa-board",
        "type": "State",
        "state": "Goa",
        "description": "Responsible for secondary and higher secondary education in the state of Goa.",
        "headquarters": "Panaji",
        "established": 1975,
        "website": "https://gbshse.info",
        "recognition": "Government of Goa",
        "medium_of_instruction": ["Konkani", "Marathi", "English"],
        "exam_pattern": "10+2 Pattern (SSC + HSSC)",
        "grading_system": "Percentage based",
        "key_features": [
            "Multilingual education",
            "Portuguese influence",
            "Small class sizes",
            "High quality education"
        ],
        "total_schools": 400,
        "country": "India",
        "is_active": True
    },
    
    # International Boards in India
    {
        "name": "IB",
        "full_name": "International Baccalaureate",
        "slug": "ib",
        "type": "International",
        "description": "The IB offers high-quality programmes of international education to schools worldwide. Known for developing inquiring, knowledgeable and caring young people.",
        "headquarters": "Geneva, Switzerland (Indian Regional Office: Singapore)",
        "established": 1968,
        "website": "https://www.ibo.org",
        "recognition": "International",
        "medium_of_instruction": ["English", "French", "Spanish"],
        "exam_pattern": "PYP (3-12 years), MYP (11-16 years), DP (16-19 years)",
        "grading_system": "7-point scale (1-7)",
        "key_features": [
            "International curriculum",
            "Critical thinking focus",
            "Community service requirement",
            "Theory of Knowledge course",
            "Extended essay component",
            "Globally recognized"
        ],
        "total_schools": 200,
        "country": "India",
        "is_active": True
    },
    {
        "name": "Cambridge (IGCSE)",
        "full_name": "Cambridge Assessment International Education",
        "slug": "cambridge-igcse",
        "type": "International",
        "description": "Cambridge IGCSE is the world's most popular international curriculum for 14-16 year olds, leading to globally recognized qualifications.",
        "headquarters": "Cambridge, UK (Indian Office: New Delhi)",
        "established": 1988,
        "website": "https://www.cambridgeinternational.org",
        "recognition": "International",
        "medium_of_instruction": ["English"],
        "exam_pattern": "IGCSE (Class 9-10), AS & A Levels (Class 11-12)",
        "grading_system": "A*-G scale for IGCSE, A*-E for A Levels",
        "key_features": [
            "British curriculum",
            "Flexible subject combinations",
            "International recognition",
            "University preparation",
            "Critical thinking emphasis"
        ],
        "total_schools": 500,
        "country": "India",
        "is_active": True
    }
]


async def seed_boards():
    """Seed Indian school boards data"""
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "college_portal")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🏫 Seeding Indian School Boards Data...")
    print(f"   Database: {db_name}")
    
    # Clear existing boards
    existing_count = await db.boards.count_documents({})
    if existing_count > 0:
        print(f"   Clearing {existing_count} existing boards...")
        await db.boards.delete_many({})
    
    # Insert boards
    boards_to_insert = []
    for board in INDIAN_BOARDS:
        board_doc = {
            "id": str(uuid.uuid4()),
            "name": board["name"],
            "full_name": board.get("full_name", board["name"]),
            "slug": board["slug"],
            "type": board.get("type", "State"),
            "state": board.get("state"),
            "description": board.get("description", ""),
            "headquarters": board.get("headquarters", ""),
            "established": board.get("established"),
            "website": board.get("website", ""),
            "recognition": board.get("recognition", ""),
            "medium_of_instruction": board.get("medium_of_instruction", []),
            "exam_pattern": board.get("exam_pattern", ""),
            "grading_system": board.get("grading_system", ""),
            "key_features": board.get("key_features", []),
            "total_schools": board.get("total_schools", 0),
            "country": board.get("country", "India"),
            "is_active": board.get("is_active", True),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        boards_to_insert.append(board_doc)
    
    await db.boards.insert_many(boards_to_insert)
    
    # Print summary
    print(f"\n✅ Successfully seeded {len(boards_to_insert)} Indian School Boards:")
    
    national_count = len([b for b in INDIAN_BOARDS if b.get("type") == "National"])
    state_count = len([b for b in INDIAN_BOARDS if b.get("type") == "State"])
    intl_count = len([b for b in INDIAN_BOARDS if b.get("type") == "International"])
    
    print(f"   📚 National Boards: {national_count}")
    print(f"   🏛️ State Boards: {state_count}")
    print(f"   🌍 International Boards: {intl_count}")
    
    client.close()
    print("\n🎉 Seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_boards())
