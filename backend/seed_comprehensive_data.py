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

async def seed_colleges():
    count = await db.colleges.count_documents({})
    if count > 0:
        print(f"Database already has {count} colleges. Clearing and reseeding...")
        await db.colleges.delete_many({})
    
    colleges = [
        {
            "id": "iit-bombay-001",
            "name": "Indian Institute of Technology Bombay",
            "slug": "iit-bombay",
            "location": {"city": "Mumbai", "state": "Maharashtra", "country": "India"},
            "established_year": 1958,
            "type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 3,
            "india_today_ranking": 2,
            "outlook_ranking": 1,
            "average_fees": 210000,
            "total_courses": 25,
            "courses": [
                {
                    "id": "course-1",
                    "name": "BTech Computer Science and Engineering",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 210000,
                    "total_fees": 840000,
                    "seats": 120,
                    "eligibility": "JEE Advanced qualified with minimum rank",
                    "cutoffs": [
                        {"year": 2024, "exam_name": "JEE Advanced", "round": "Round 1", "category": "General", "opening_rank": 1, "closing_rank": 67},
                        {"year": 2024, "exam_name": "JEE Advanced", "round": "Round 1", "category": "OBC", "opening_rank": 12, "closing_rank": 198},
                        {"year": 2023, "exam_name": "JEE Advanced", "round": "Round 1", "category": "General", "opening_rank": 1, "closing_rank": 71}
                    ]
                },
                {
                    "id": "course-2",
                    "name": "BTech Electrical Engineering",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 210000,
                    "total_fees": 840000,
                    "seats": 90,
                    "eligibility": "JEE Advanced qualified",
                    "cutoffs": [
                        {"year": 2024, "exam_name": "JEE Advanced", "round": "Round 1", "category": "General", "opening_rank": 150, "closing_rank": 420}
                    ]
                },
                {
                    "id": "course-3",
                    "name": "MTech Computer Science",
                    "degree_type": "MTech",
                    "duration": "2 years",
                    "fees": 150000,
                    "total_fees": 300000,
                    "seats": 60,
                    "eligibility": "GATE qualified with valid score"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi", "Cafeteria", "Gym", "Medical Center", "Auditorium", "Swimming Pool"],
            "hostel_info": {
                "boys_hostel": "Yes - 14 Hostels",
                "girls_hostel": "Yes - 3 Hostels",
                "hostel_fees": 15000
            },
            "campus_size": "550 acres",
            "contact_info": {
                "phone": "+91-22-2576-7022",
                "email": "publicrelations@iitb.ac.in",
                "website": "https://www.iitb.ac.in",
                "address": "Powai, Mumbai, Maharashtra - 400076"
            },
            "images": [
                "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"
            ],
            "videos": ["https://www.youtube.com/watch?v=sample1"],
            "brochure_url": "https://example.com/iitb-brochure.pdf",
            "virtual_tour_url": "https://vtour.iitb.ac.in",
            "description": "IIT Bombay is one of the premier engineering institutes in India. Established in 1958, it has consistently ranked among the top institutions globally. The institute offers undergraduate, postgraduate, and doctoral programs in engineering, sciences, and management. Known for its rigorous academic curriculum, world-class faculty, and state-of-the-art infrastructure, IIT Bombay has produced numerous leaders in industry, academia, and research.",
            "highlights": [
                "NIRF Rank 3 in Engineering 2024",
                "QS World Ranking: 149",
                "Alumni include Sundar Pichai (CEO Google), Parag Agrawal (Ex-CEO Twitter)",
                "550-acre green campus",
                "100% Placement Rate",
                "Highest Package: \u20b92.01 Crore (International)",
                "Top recruiters: Google, Microsoft, Amazon, Goldman Sachs"
            ],
            "admission_process": "Admission to IIT Bombay is through JEE Advanced for BTech programs. Candidates must first qualify JEE Main and then appear for JEE Advanced. For MTech programs, admission is through GATE score followed by written test and interview. PhD admissions are based on GATE score or interview.",
            "admission_dates": {
                "application_start": "2024-05-01",
                "application_end": "2024-06-15",
                "exam_date": "2024-05-26",
                "result_date": "2024-06-18",
                "counseling_start": "2024-06-25"
            },
            "accreditations": ["NAAC A++", "NBA", "ABET"],
            "approvals": ["AICTE", "UGC"],
            "placement_stats": [
                {
                    "year": 2024,
                    "highest_package": 20100000,
                    "average_package": 2100000,
                    "median_package": 1800000,
                    "total_offers": 1450,
                    "companies_participated": 450,
                    "top_recruiters": ["Google", "Microsoft", "Amazon", "Goldman Sachs", "McKinsey", "BCG", "Oracle", "Samsung"]
                },
                {
                    "year": 2023,
                    "highest_package": 18500000,
                    "average_package": 1950000,
                    "median_package": 1700000,
                    "total_offers": 1398,
                    "companies_participated": 425,
                    "top_recruiters": ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Adobe", "Qualcomm"]
                }
            ],
            "faculty": [
                {
                    "id": "fac-1",
                    "name": "Prof. Subhasis Chaudhuri",
                    "designation": "Director",
                    "department": "Electrical Engineering",
                    "qualification": "PhD from IIT Kharagpur",
                    "experience": 35,
                    "specialization": "Image Processing, Computer Vision"
                },
                {
                    "id": "fac-2",
                    "name": "Prof. Supratik Chakraborty",
                    "designation": "Professor",
                    "department": "Computer Science",
                    "qualification": "PhD from State University of New York",
                    "experience": 25,
                    "specialization": "Formal Verification, Algorithms"
                }
            ],
            "scholarships": [
                {
                    "id": "sch-1",
                    "name": "MCM Scholarship",
                    "amount": "\u20b950,000 per year",
                    "eligibility": "Top 10% students based on academic performance",
                    "description": "Merit cum Means scholarship for economically weaker students"
                },
                {
                    "id": "sch-2",
                    "name": "Institute Free Studentship",
                    "amount": "Full tuition fee waiver",
                    "eligibility": "Family income below \u20b91 lakh per annum",
                    "description": "Complete tuition fee waiver for economically challenged students"
                }
            ],
            "rating": 4.8,
            "total_reviews": 423,
            "rating_breakdown": {"5": 310, "4": 85, "3": 20, "2": 5, "1": 3},
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "iit-delhi-001",
            "name": "Indian Institute of Technology Delhi",
            "slug": "iit-delhi",
            "location": {"city": "New Delhi", "state": "Delhi", "country": "India"},
            "established_year": 1961,
            "type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 2,
            "india_today_ranking": 1,
            "outlook_ranking": 2,
            "average_fees": 200000,
            "total_courses": 22,
            "courses": [
                {
                    "id": "course-4",
                    "name": "BTech Computer Science",
                    "degree_type": "BTech",
                    "duration": "4 years",
                    "fees": 200000,
                    "total_fees": 800000,
                    "seats": 110,
                    "eligibility": "JEE Advanced qualified",
                    "cutoffs": [
                        {"year": 2024, "exam_name": "JEE Advanced", "round": "Round 1", "category": "General", "opening_rank": 68, "closing_rank": 250}
                    ]
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi", "Cafeteria", "Gym"],
            "contact_info": {
                "phone": "+91-11-2659-1000",
                "email": "admin@iitd.ac.in",
                "website": "https://home.iitd.ac.in",
                "address": "Hauz Khas, New Delhi - 110016"
            },
            "images": ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"],
            "videos": [],
            "description": "IIT Delhi is one of the 23 IITs created to be Centres of Excellence for training, research and development in science, engineering and technology in India. It was declared as an Institute of National Importance by the Government of India.",
            "highlights": [
                "NIRF Rank 2 in Engineering 2024",
                "QS World Ranking: 197",
                "350-acre urban campus",
                "Highest Package: \u20b91.8 Crore"
            ],
            "admission_process": "Admission through JEE Advanced for undergraduate programs",
            "accreditations": ["NAAC A++", "NBA"],
            "approvals": ["AICTE"],
            "placement_stats": [
                {
                    "year": 2024,
                    "highest_package": 18000000,
                    "average_package": 1950000,
                    "median_package": 1750000,
                    "total_offers": 1250,
                    "companies_participated": 400,
                    "top_recruiters": ["Microsoft", "Google", "Amazon", "Intel", "Qualcomm"]
                }
            ],
            "faculty": [],
            "scholarships": [],
            "rating": 4.7,
            "total_reviews": 356,
            "rating_breakdown": {"5": 250, "4": 80, "3": 20, "2": 4, "1": 2},
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
            "nirf_ranking": 25,
            "average_fees": 450000,
            "total_courses": 30,
            "courses": [
                {
                    "id": "course-5",
                    "name": "BE Computer Science",
                    "degree_type": "BE",
                    "duration": "4 years",
                    "fees": 450000,
                    "total_fees": 1800000,
                    "seats": 150,
                    "eligibility": "BITSAT qualified"
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Wi-Fi"],
            "contact_info": {
                "phone": "+91-1596-242-111",
                "email": "admission@pilani.bits-pilani.ac.in",
                "website": "https://www.bits-pilani.ac.in",
                "address": "Pilani Campus, Rajasthan - 333031"
            },
            "images": ["https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800"],
            "videos": [],
            "description": "BITS Pilani is a leading private institute offering engineering, science, and management programs.",
            "highlights": ["NIRF Rank 25", "Multiple campuses across India", "Strong industry connections"],
            "admission_process": "Admission through BITSAT examination",
            "accreditations": ["NAAC A"],
            "approvals": ["AICTE", "UGC"],
            "placement_stats": [
                {
                    "year": 2024,
                    "highest_package": 15000000,
                    "average_package": 1650000,
                    "median_package": 1400000,
                    "total_offers": 980,
                    "companies_participated": 280,
                    "top_recruiters": ["Microsoft", "Amazon", "Flipkart", "Oracle"]
                }
            ],
            "faculty": [],
            "scholarships": [],
            "rating": 4.5,
            "total_reviews": 289,
            "rating_breakdown": {"5": 180, "4": 75, "3": 25, "2": 7, "1": 2},
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    
    result = await db.colleges.insert_many(colleges)
    print(f"Successfully seeded {len(result.inserted_ids)} colleges!")

async def main():
    print("Starting comprehensive database seeding...")
    await seed_colleges()
    print("Database seeding complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
