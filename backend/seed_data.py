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

async def seed_colleges():
    # Check if colleges already exist
    count = await db.colleges.count_documents({})
    if count > 0:
        print(f"Database already has {count} colleges. Skipping seed.")
        return
    
    colleges = [
        {
            "id": "iit-delhi-001",
            "name": "Indian Institute of Technology Delhi",
            "slug": "iit-delhi",
            "location": {"city": "New Delhi", "state": "Delhi", "country": "India"},
            "established_year": 1961,
            "type": "Government",
            "affiliation": "Autonomous",
            "ranking": 1,
            "average_fees": 200000,
            "total_courses": 15,
            "courses": [
                {
                    "id": "course-1",
                    "name": "BTech Computer Science",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 200000,
                    "seats": 120,
                    "eligibility": "JEE Advanced qualified"
                },
                {
                    "id": "course-2",
                    "name": "MTech Artificial Intelligence",
                    "degree_type": "MTech",
                    "duration": "2 years",
                    "fees": 150000,
                    "seats": 50,
                    "eligibility": "GATE qualified"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi", "Cafeteria"],
            "contact_info": {
                "phone": "+91-11-2659-1000",
                "email": "admin@iitd.ac.in",
                "website": "https://home.iitd.ac.in",
                "address": "Hauz Khas, New Delhi - 110016"
            },
            "images": [],
            "description": "IIT Delhi is one of the premier engineering institutes in India, offering undergraduate, postgraduate, and doctoral programs in engineering, sciences, and humanities. Known for its cutting-edge research and excellent placements.",
            "admission_process": "Admission is through JEE Advanced for BTech and GATE for MTech programs. The institute follows a merit-based selection process.",
            "accreditations": ["NAAC A++", "NBA", "NIRF Rank 1"],
            "rating": 4.8,
            "total_reviews": 156,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "bits-pilani-001",
            "name": "Birla Institute of Technology and Science Pilani",
            "slug": "bits-pilani",
            "location": {"city": "Pilani", "state": "Rajasthan", "country": "India"},
            "established_year": 1964,
            "type": "Private",
            "affiliation": "Deemed University",
            "ranking": 15,
            "average_fees": 450000,
            "total_courses": 20,
            "courses": [
                {
                    "id": "course-3",
                    "name": "BE Computer Science",
                    "degree_type": "BE",
                    "duration": "4 years",
                    "fees": 450000,
                    "seats": 150,
                    "eligibility": "BITSAT qualified"
                },
                {
                    "id": "course-4",
                    "name": "MBA",
                    "degree_type": "MBA",
                    "duration": "2 years",
                    "fees": 400000,
                    "seats": 80,
                    "eligibility": "CAT/GMAT qualified"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi", "Medical Center"],
            "contact_info": {
                "phone": "+91-1596-242-111",
                "email": "admission@pilani.bits-pilani.ac.in",
                "website": "https://www.bits-pilani.ac.in",
                "address": "Pilani Campus, Rajasthan - 333031"
            },
            "images": [],
            "description": "BITS Pilani is a premier private institute known for its rigorous academic programs and strong industry connections. The institute has multiple campuses across India.",
            "admission_process": "Admission through BITSAT for undergraduate programs and national level exams for postgraduate programs.",
            "accreditations": ["NAAC A", "NIRF Rank 15"],
            "rating": 4.6,
            "total_reviews": 89,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "aiims-delhi-001",
            "name": "All India Institute of Medical Sciences Delhi",
            "slug": "aiims-delhi",
            "location": {"city": "New Delhi", "state": "Delhi", "country": "India"},
            "established_year": 1956,
            "type": "Government",
            "affiliation": "Autonomous",
            "ranking": 1,
            "average_fees": 5000,
            "total_courses": 8,
            "courses": [
                {
                    "id": "course-5",
                    "name": "MBBS",
                    "degree_type": "MBBS",
                    "duration": "5.5 years",
                    "fees": 5000,
                    "seats": 100,
                    "eligibility": "NEET UG qualified"
                },
                {
                    "id": "course-6",
                    "name": "MD Medicine",
                    "degree_type": "MD",
                    "duration": "3 years",
                    "fees": 4000,
                    "seats": 50,
                    "eligibility": "NEET PG qualified"
                }
            ],
            "facilities": ["Hospital", "Library", "Hostel", "Research Labs", "Sports Complex"],
            "contact_info": {
                "phone": "+91-11-2659-3333",
                "email": "info@aiims.edu",
                "website": "https://www.aiims.edu",
                "address": "Ansari Nagar, New Delhi - 110029"
            },
            "images": [],
            "description": "AIIMS Delhi is India's premier medical institute, providing world-class medical education, research, and healthcare services. It is known for producing some of the best doctors in the country.",
            "admission_process": "Admission through NEET for undergraduate and postgraduate medical programs.",
            "accreditations": ["NAAC A++", "MCI Approved"],
            "rating": 4.9,
            "total_reviews": 203,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "iim-ahmedabad-001",
            "name": "Indian Institute of Management Ahmedabad",
            "slug": "iim-ahmedabad",
            "location": {"city": "Ahmedabad", "state": "Gujarat", "country": "India"},
            "established_year": 1961,
            "type": "Government",
            "affiliation": "Autonomous",
            "ranking": 1,
            "average_fees": 2500000,
            "total_courses": 5,
            "courses": [
                {
                    "id": "course-7",
                    "name": "Post Graduate Programme in Management (PGP)",
                    "degree_type": "MBA",
                    "duration": "2 years",
                    "fees": 2500000,
                    "seats": 395,
                    "eligibility": "CAT qualified"
                },
                {
                    "id": "course-8",
                    "name": "Fellow Programme in Management (FPM)",
                    "degree_type": "PhD",
                    "duration": "4-5 years",
                    "fees": 100000,
                    "seats": 40,
                    "eligibility": "CAT/GMAT qualified"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Research Centers", "Auditorium"],
            "contact_info": {
                "phone": "+91-79-6632-4600",
                "email": "pgpx@iima.ac.in",
                "website": "https://www.iima.ac.in",
                "address": "Vastrapur, Ahmedabad - 380015"
            },
            "images": [],
            "description": "IIM Ahmedabad is India's top business school, known for its rigorous MBA program and strong alumni network. The institute has produced many business leaders and entrepreneurs.",
            "admission_process": "Admission through CAT followed by Written Ability Test and Personal Interview.",
            "accreditations": ["AACSB", "AMBA", "NIRF Rank 1"],
            "rating": 4.7,
            "total_reviews": 142,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "du-001",
            "name": "University of Delhi",
            "slug": "delhi-university",
            "location": {"city": "New Delhi", "state": "Delhi", "country": "India"},
            "established_year": 1922,
            "type": "Government",
            "affiliation": "Central University",
            "ranking": 11,
            "average_fees": 30000,
            "total_courses": 100,
            "courses": [
                {
                    "id": "course-9",
                    "name": "BA Economics (Hons)",
                    "degree_type": "BA",
                    "duration": "3 years",
                    "fees": 30000,
                    "seats": 500,
                    "eligibility": "12th pass with 60%+"
                },
                {
                    "id": "course-10",
                    "name": "BSc Computer Science",
                    "degree_type": "BSc",
                    "duration": "3 years",
                    "fees": 35000,
                    "seats": 300,
                    "eligibility": "12th pass with PCM"
                }
            ],
            "facilities": ["Library", "Sports Complex", "Cultural Centers", "Labs", "Canteen"],
            "contact_info": {
                "phone": "+91-11-2766-7061",
                "email": "info@du.ac.in",
                "website": "https://www.du.ac.in",
                "address": "University Enclave, Delhi - 110007"
            },
            "images": [],
            "description": "Delhi University is one of India's most prestigious universities, offering a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines.",
            "admission_process": "Admission based on CUET scores and merit for most courses.",
            "accreditations": ["NAAC A++", "UGC"],
            "rating": 4.4,
            "total_reviews": 287,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "nit-trichy-001",
            "name": "National Institute of Technology Tiruchirappalli",
            "slug": "nit-trichy",
            "location": {"city": "Tiruchirappalli", "state": "Tamil Nadu", "country": "India"},
            "established_year": 1964,
            "type": "Government",
            "affiliation": "NIT System",
            "ranking": 9,
            "average_fees": 150000,
            "total_courses": 18,
            "courses": [
                {
                    "id": "course-11",
                    "name": "BTech Mechanical Engineering",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 150000,
                    "seats": 100,
                    "eligibility": "JEE Main qualified"
                },
                {
                    "id": "course-12",
                    "name": "BTech Electronics and Communication",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 150000,
                    "seats": 110,
                    "eligibility": "JEE Main qualified"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi", "Bank"],
            "contact_info": {
                "phone": "+91-431-250-1801",
                "email": "dean@nitt.edu",
                "website": "https://www.nitt.edu",
                "address": "Tanjore Main Road, Tiruchirappalli - 620015"
            },
            "images": [],
            "description": "NIT Trichy is one of the premier engineering institutes in India, known for its academic excellence and strong placement record.",
            "admission_process": "Admission through JEE Main for BTech programs.",
            "accreditations": ["NAAC A++", "NBA", "NIRF Rank 9"],
            "rating": 4.5,
            "total_reviews": 134,
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    
    result = await db.colleges.insert_many(colleges)
    print(f"Successfully seeded {len(result.inserted_ids)} colleges!")

async def main():
    print("Starting database seeding...")
    await seed_colleges()
    print("Database seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
