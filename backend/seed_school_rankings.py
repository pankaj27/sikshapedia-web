"""
Seed script for Indian School Ranking Bodies
Run: DB_NAME=sikshapedia_db python seed_school_rankings.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

# Indian School Ranking Bodies
SCHOOL_RANKINGS = [
    {
        "name": "Education World India School Rankings",
        "full_name": "Education World India School Rankings (EWISR)",
        "slug": "education-world-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Day Schools, Boarding Schools, International Schools, Co-ed Schools, Boys Schools, Girls Schools, Budget Private Schools, Government Schools",
        "description": "India's most comprehensive and credible annual school rankings survey, covering over 3,000 schools across multiple categories. Conducted by Education World magazine in partnership with C fore, a leading market research and opinion poll company.",
        "methodology": "Based on 14 parameters including teacher competence, academic reputation, co-curricular education, sports education, life skills education, individual attention, infrastructure, parental involvement, value for money, leadership/management quality, internationalism, community service, safety & hygiene, and special needs education.",
        "website": "https://www.educationworld.in",
        "headquarters": "Bengaluru, India",
        "established": 1999,
        "key_parameters": [
            "Teacher Competence & Welfare",
            "Academic Reputation",
            "Co-curricular Education",
            "Sports Education",
            "Life Skills & Conflict Management",
            "Individual Attention to Students",
            "Infrastructure Provision",
            "Parental Involvement",
            "Value for Money",
            "Leadership & Management Quality",
            "Internationalism",
            "Community Service",
            "Safety & Hygiene",
            "Special Needs Education"
        ],
        "coverage": "Pan-India (State-wise & City-wise)",
        "is_active": True
    },
    {
        "name": "Times School Survey",
        "full_name": "Times School Survey",
        "slug": "times-school-survey",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Top Schools by City, CBSE Schools, ICSE Schools, State Board Schools, International Schools, Day Schools, Boarding Schools",
        "description": "An annual survey by The Times of India that ranks the best schools across major cities in India. It evaluates schools on multiple parameters and provides city-wise rankings.",
        "methodology": "Perception-based survey with parameters including academic excellence, faculty, infrastructure, safety, co-curricular activities, and value for money.",
        "website": "https://timesofindia.indiatimes.com",
        "headquarters": "Mumbai, India",
        "established": 2010,
        "key_parameters": [
            "Academic Excellence",
            "Faculty Quality",
            "Infrastructure",
            "Safety & Security",
            "Co-curricular Activities",
            "Sports Facilities",
            "Parent Involvement",
            "Value for Money",
            "Digital Infrastructure",
            "Special Programs"
        ],
        "coverage": "Major Indian Cities",
        "is_active": True
    },
    {
        "name": "Hindustan Times Top Schools Survey",
        "full_name": "HT Top Schools Survey",
        "slug": "ht-top-schools-survey",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Day Schools, Co-ed Schools, Boys Schools, Girls Schools, CBSE Schools, ICSE Schools",
        "description": "Annual survey conducted by Hindustan Times ranking schools in Delhi-NCR and other major cities based on multiple educational parameters.",
        "methodology": "Comprehensive evaluation based on academic excellence, infrastructure, extra-curricular activities, and parent satisfaction.",
        "website": "https://www.hindustantimes.com",
        "headquarters": "New Delhi, India",
        "established": 2008,
        "key_parameters": [
            "Academic Results",
            "Teacher Quality",
            "Infrastructure",
            "Sports & Extra-curricular",
            "Safety Measures",
            "Parent Satisfaction",
            "Innovation in Teaching",
            "Student-Teacher Ratio"
        ],
        "coverage": "Delhi-NCR, Major Metro Cities",
        "is_active": True
    },
    {
        "name": "EducationToday School Rankings",
        "full_name": "EducationToday National School Rankings",
        "slug": "educationtoday-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "CBSE Schools, ICSE Schools, International Schools, IB Schools, State Board Schools, Boarding Schools",
        "description": "Annual rankings published by EducationToday magazine evaluating schools across India based on comprehensive criteria.",
        "methodology": "Multi-parameter evaluation including curriculum, pedagogy, infrastructure, faculty, and outcomes.",
        "website": "https://www.educationtoday.co",
        "headquarters": "New Delhi, India",
        "established": 2012,
        "key_parameters": [
            "Curriculum & Pedagogy",
            "Learning Outcomes",
            "Faculty Credentials",
            "Infrastructure & Facilities",
            "Technology Integration",
            "Student Development",
            "Leadership",
            "Innovation"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "Brainfeed School Excellence Awards",
        "full_name": "Brainfeed School Excellence Awards & Rankings",
        "slug": "brainfeed-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Pre-schools, Primary Schools, Secondary Schools, International Schools, Innovation in Education",
        "description": "Annual awards and rankings recognizing excellence in school education across various categories, with focus on innovation and best practices.",
        "methodology": "Evaluation based on innovation, academic excellence, infrastructure, and overall contribution to education.",
        "website": "https://www.brainfeedmagazine.com",
        "headquarters": "Hyderabad, India",
        "established": 2014,
        "key_parameters": [
            "Academic Excellence",
            "Innovation in Teaching",
            "Infrastructure Quality",
            "Technology Adoption",
            "Student Achievements",
            "Faculty Development",
            "Community Engagement",
            "Holistic Development"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "Great Indian Schools",
        "full_name": "Great Indian Schools Survey",
        "slug": "great-indian-schools",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Co-ed Schools, Boys Schools, Girls Schools, Day Schools, Boarding Schools, Budget Schools, Premium Schools",
        "description": "Annual survey identifying and ranking India's best schools based on comprehensive evaluation criteria.",
        "methodology": "Assessment based on academic performance, faculty quality, infrastructure, and overall school environment.",
        "website": "https://www.greatindianschools.com",
        "headquarters": "Mumbai, India",
        "established": 2015,
        "key_parameters": [
            "Academic Performance",
            "Faculty Excellence",
            "Infrastructure",
            "Extra-curricular Activities",
            "Sports Program",
            "Technology",
            "Safety & Well-being",
            "Affordability"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "India School Merit Awards",
        "full_name": "India School Merit Awards (ISMA)",
        "slug": "india-school-merit-awards",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Academic Excellence, Sports Excellence, Arts & Culture, Innovation, STEM Education, Social Impact",
        "description": "Awards recognizing schools for merit and excellence across multiple domains of education.",
        "methodology": "Category-wise evaluation based on specific criteria for each award category.",
        "website": "https://www.indiaschoolmeritawards.com",
        "headquarters": "New Delhi, India",
        "established": 2017,
        "key_parameters": [
            "Academic Results",
            "Sports Achievements",
            "Cultural Programs",
            "STEM Initiatives",
            "Innovation Projects",
            "Social Responsibility",
            "Student Welfare",
            "Teacher Excellence"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "QS I-GAUGE",
        "full_name": "QS I-GAUGE Indian School Ratings",
        "slug": "qs-i-gauge-schools",
        "type": "International",
        "institution_type": "School",
        "year": 2024,
        "category": "K-12 Schools, International Schools, CBSE Schools, ICSE Schools",
        "description": "Rating system by QS (Quacquarelli Symonds) specifically designed for Indian K-12 schools, providing Diamond, Platinum, Gold, and Silver ratings.",
        "methodology": "Comprehensive framework evaluating academic quality, teaching quality, infrastructure, student support, and governance.",
        "website": "https://www.igauge.in",
        "headquarters": "London, UK (Indian Office: New Delhi)",
        "established": 2019,
        "key_parameters": [
            "Academic Quality",
            "Teaching Excellence",
            "Student Development",
            "Infrastructure",
            "Safety & Welfare",
            "Governance",
            "Innovation",
            "Employability Preparation"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "ISA (International Schools Assessment)",
        "full_name": "International Schools Assessment Rankings",
        "slug": "isa-school-rankings",
        "type": "International",
        "institution_type": "School",
        "year": 2024,
        "category": "International Schools, IB Schools, Cambridge Schools, American Curriculum Schools",
        "description": "Assessment and ranking system for international schools based on student performance in reading, mathematical literacy, and writing.",
        "methodology": "Standardized testing and assessment comparing schools globally.",
        "website": "https://www.acer.org/isa",
        "headquarters": "Melbourne, Australia",
        "established": 2002,
        "key_parameters": [
            "Reading Literacy",
            "Mathematical Literacy",
            "Writing Skills",
            "Scientific Literacy",
            "Critical Thinking",
            "Global Competence"
        ],
        "coverage": "Global (including India)",
        "is_active": True
    },
    {
        "name": "CBSE School Rankings",
        "full_name": "CBSE Affiliated Schools Performance Rankings",
        "slug": "cbse-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "CBSE Schools by State, CBSE Schools by City, Top Performing CBSE Schools",
        "description": "Rankings based on CBSE board examination results, school infrastructure compliance, and accreditation status.",
        "methodology": "Based on Class 10 and 12 board results, school facilities audit, and compliance with CBSE norms.",
        "website": "https://www.cbse.gov.in",
        "headquarters": "New Delhi, India",
        "established": 1962,
        "key_parameters": [
            "Board Exam Results (Class 10)",
            "Board Exam Results (Class 12)",
            "Infrastructure Compliance",
            "Teacher Qualifications",
            "Student-Teacher Ratio",
            "Lab & Library Facilities",
            "Sports Infrastructure",
            "Safety Standards"
        ],
        "coverage": "All CBSE Schools in India",
        "is_active": True
    },
    {
        "name": "CISCE School Rankings",
        "full_name": "CISCE Affiliated Schools Rankings",
        "slug": "cisce-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "ICSE Schools, ISC Schools, Top Performing CISCE Schools",
        "description": "Rankings based on ICSE (Class 10) and ISC (Class 12) examination results and school quality parameters.",
        "methodology": "Performance in board examinations combined with school infrastructure and faculty assessment.",
        "website": "https://www.cisce.org",
        "headquarters": "New Delhi, India",
        "established": 1958,
        "key_parameters": [
            "ICSE Results",
            "ISC Results",
            "Faculty Qualifications",
            "Infrastructure Quality",
            "Co-curricular Performance",
            "Sports Achievements",
            "Internal Assessment Quality"
        ],
        "coverage": "All CISCE Schools in India",
        "is_active": True
    },
    {
        "name": "Digital Learning School Rankings",
        "full_name": "Digital Learning Magazine School Rankings",
        "slug": "digital-learning-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Tech-enabled Schools, Smart Schools, Schools with Best Digital Infrastructure",
        "description": "Rankings focused on technology integration and digital learning capabilities of schools.",
        "methodology": "Evaluation based on digital infrastructure, EdTech adoption, online learning platforms, and technology-enabled teaching.",
        "website": "https://digitallearning.eletsonline.com",
        "headquarters": "New Delhi, India",
        "established": 2015,
        "key_parameters": [
            "Digital Infrastructure",
            "Smart Classrooms",
            "Learning Management Systems",
            "Teacher Digital Literacy",
            "Student Digital Skills",
            "Online Learning Platforms",
            "Cybersecurity Measures",
            "Innovation in EdTech"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "Fortune India Best Schools",
        "full_name": "Fortune India Best Schools Survey",
        "slug": "fortune-india-best-schools",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Day Schools, Boarding Schools, International Schools, Budget Schools",
        "description": "Annual survey by Fortune India identifying the best schools across various categories.",
        "methodology": "Comprehensive assessment of academic excellence, infrastructure, faculty, and overall school environment.",
        "website": "https://www.fortuneindia.com",
        "headquarters": "Mumbai, India",
        "established": 2018,
        "key_parameters": [
            "Academic Excellence",
            "Infrastructure",
            "Faculty Quality",
            "Innovation",
            "Student Outcomes",
            "Value for Money",
            "Leadership",
            "Safety & Well-being"
        ],
        "coverage": "Pan-India",
        "is_active": True
    },
    {
        "name": "Outlook-ICARE School Rankings",
        "full_name": "Outlook-ICARE India School Rankings",
        "slug": "outlook-icare-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Day Schools, Boarding Schools, International Schools, CBSE Schools, ICSE Schools",
        "description": "Comprehensive school rankings by Outlook magazine in association with ICARE ratings.",
        "methodology": "Multi-dimensional assessment covering academics, infrastructure, student development, and school management.",
        "website": "https://www.outlookindia.com",
        "headquarters": "New Delhi, India",
        "established": 2016,
        "key_parameters": [
            "Competence of Faculty",
            "Academic Excellence",
            "Individual Attention",
            "Personality Development",
            "Infrastructure & Facilities",
            "Leadership & Management",
            "Safety & Hygiene",
            "Value for Money"
        ],
        "coverage": "Pan-India (State & City Rankings)",
        "is_active": True
    },
    {
        "name": "India Today School Rankings",
        "full_name": "India Today Best Schools Survey",
        "slug": "india-today-school-rankings",
        "type": "National",
        "institution_type": "School",
        "year": 2024,
        "category": "Day Schools, Boarding Schools, Co-ed Schools, Boys Schools, Girls Schools",
        "description": "Annual survey by India Today magazine ranking the best schools in major Indian cities.",
        "methodology": "Based on parameters including academic reputation, infrastructure, sports, co-curricular activities, and value for money.",
        "website": "https://www.indiatoday.in",
        "headquarters": "New Delhi, India",
        "established": 2009,
        "key_parameters": [
            "Academic Reputation",
            "Faculty & Academic Rigour",
            "Sports Education",
            "Co-curricular Activities",
            "Infrastructure",
            "Individual Attention",
            "Parental Involvement",
            "Value for Money"
        ],
        "coverage": "Major Indian Cities",
        "is_active": True
    }
]


async def seed_school_rankings():
    """Seed Indian School Ranking Bodies data"""
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "sikshapedia_db")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🏆 Seeding Indian School Ranking Bodies...")
    print(f"   Database: {db_name}")
    
    # Don't clear existing rankings - just add school rankings
    existing_school = await db.rankings.count_documents({"institution_type": "School"})
    if existing_school > 0:
        print(f"   Clearing {existing_school} existing school rankings...")
        await db.rankings.delete_many({"institution_type": "School"})
    
    # Insert school rankings
    rankings_to_insert = []
    for ranking in SCHOOL_RANKINGS:
        ranking_doc = {
            "id": str(uuid.uuid4()),
            "name": ranking["name"],
            "full_name": ranking.get("full_name", ranking["name"]),
            "slug": ranking["slug"],
            "type": ranking.get("type", "National"),
            "institution_type": ranking.get("institution_type", "School"),
            "year": ranking.get("year", 2024),
            "category": ranking.get("category", ""),
            "description": ranking.get("description", ""),
            "methodology": ranking.get("methodology", ""),
            "website": ranking.get("website", ""),
            "headquarters": ranking.get("headquarters", ""),
            "established": ranking.get("established"),
            "key_parameters": ranking.get("key_parameters", []),
            "coverage": ranking.get("coverage", "Pan-India"),
            "is_active": ranking.get("is_active", True),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        rankings_to_insert.append(ranking_doc)
    
    await db.rankings.insert_many(rankings_to_insert)
    
    # Print summary
    print(f"\n✅ Successfully seeded {len(rankings_to_insert)} School Ranking Bodies:")
    
    national_count = len([r for r in SCHOOL_RANKINGS if r.get("type") == "National"])
    intl_count = len([r for r in SCHOOL_RANKINGS if r.get("type") == "International"])
    
    print(f"   🇮🇳 National Rankings: {national_count}")
    print(f"   🌍 International Rankings: {intl_count}")
    
    # Show total rankings now
    total = await db.rankings.count_documents({})
    school_total = await db.rankings.count_documents({"institution_type": "School"})
    print(f"\n   📊 Total Rankings in Database: {total}")
    print(f"   🏫 School Rankings: {school_total}")
    
    client.close()
    print("\n🎉 Seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_school_rankings())
