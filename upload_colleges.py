#!/usr/bin/env python3
"""
West Bengal Colleges Data Upload Script
Uploads colleges to AdmissionBuddy via API with logos and images
"""

import requests
import json
import time
import uuid

# Configuration
BASE_URL = "https://admissionbuddy.co/api"
EMAIL = "admin@admissionbuddy.co"
PASSWORD = "admin123"

# College data with logos and images
COLLEGES = [
    {
        "name": "Jadavpur University",
        "slug": "jadavpur-university",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1955,
        "affiliation": "UGC",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "188, Raja S.C. Mallick Rd, Kolkata, West Bengal 700032",
            "pin_code": "700032",
            "latitude": "22.4970",
            "longitude": "88.3714",
            "how_to_reach": {
                "by_air": "Netaji Subhas Chandra Bose International Airport (CCU) is approximately 18 km away. Regular taxi and cab services available.",
                "by_train": "Jadavpur Railway Station is about 1 km from campus. Howrah Junction is 10-12 km away.",
                "by_road": "Well-connected by road with regular bus services and auto-rickshaws on Raja S.C. Mallick Road.",
                "public_transport": "Metro: Jadavpur Metro Station is about 2 km away. Buses: Regular WBTC services available."
            }
        },
        "campus_size": "67 acres",
        "recognized_by": ["UGC", "NAAC", "AICTE"],
        "nirf_ranking": 18,
        "rankings": [
            {"agency": "NIRF", "year": 2025, "rank": 18, "category": "Overall"},
            {"agency": "NIRF", "year": 2025, "rank": 18, "category": "Engineering"}
        ],
        "accreditations": [{"name": "NAAC", "grade": "A+", "cgpa": "3.46"}],
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Jadavpur_University_Logo.svg/1200px-Jadavpur_University_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533293347phpA79lZk.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1533293347phpA79lZk.jpeg", "alt": "Jadavpur University Campus"},
            {"url": "https://images.shiksha.com/mediadata/images/1567068037phpvWLdnK.jpeg", "alt": "JU Main Building"}
        ],
        "description": "Jadavpur University is a prestigious public research university established in 1955, located in Kolkata, West Bengal. It is recognized by UGC and accredited with Grade A+ by NAAC. The university offers 194+ courses across Engineering, Science, Arts, Architecture, Pharmacy, and Education. It is consistently ranked among the top universities in India with strong placement records and affordable fees.",
        "highlights": [
            "NIRF Ranking 2025: 18th Overall, 18th Engineering",
            "NAAC Accreditation: A+ with CGPA 3.46",
            "194+ courses offered across multiple disciplines",
            "4655+ students enrolled",
            "Strong placement record with Microsoft, Amazon, Google, TCS",
            "Affordable tuition fees for government institution",
            "67 acres green campus with modern facilities"
        ],
        "streams": ["Engineering", "Science", "Arts", "Architecture", "Pharmacy", "Education"],
        "courses": [
            {"name": "B.E. Computer Science & Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "116000", "fees_display": "₹1.16 Lakhs (Total)", "eligibility": "10+2 with 45% marks in PCM + WBJEE", "seats": 82, "entrance_exam": "WBJEE"},
            {"name": "B.E. Mechanical Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "116000", "fees_display": "₹1.16 Lakhs (Total)", "eligibility": "10+2 with 45% marks in PCM + WBJEE", "seats": 90, "entrance_exam": "WBJEE"},
            {"name": "B.E. Electrical Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "116000", "fees_display": "₹1.16 Lakhs (Total)", "eligibility": "10+2 with 45% marks in PCM + WBJEE", "seats": 86, "entrance_exam": "WBJEE"},
            {"name": "M.Tech", "stream": "Engineering", "level": "PG", "duration": "2 Years", "fees": "224000", "fees_display": "₹2.24 Lakhs (Total)", "eligibility": "B.Tech/B.E. with valid GATE score", "entrance_exam": "GATE"},
            {"name": "B.Sc Physics", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "21600", "fees_display": "₹21,600 (Total)", "eligibility": "10+2 with 50% marks in Science"},
            {"name": "BA English", "stream": "Arts", "level": "UG", "duration": "3 Years", "fees": "14400", "fees_display": "₹14,400 (Total)", "eligibility": "10+2 from recognized board"},
            {"name": "B.Arch", "stream": "Architecture", "level": "UG", "duration": "5 Years", "fees": "26050", "fees_display": "₹26,050 (Total)", "eligibility": "10+2 with Mathematics + NATA/JEE Main Paper 2", "entrance_exam": "NATA/JEE Main"},
            {"name": "B.Pharm", "stream": "Pharmacy", "level": "UG", "duration": "4 Years", "fees": "20840", "fees_display": "₹20,840 (Total)", "eligibility": "10+2 with PCB/PCM + WBJEE", "entrance_exam": "WBJEE"},
            {"name": "MCA", "stream": "Engineering", "level": "PG", "duration": "3 Years", "fees": "15320", "fees_display": "₹15,320 (Total)", "eligibility": "Graduation with Mathematics + WB JECA", "entrance_exam": "WB JECA"}
        ],
        "placement": {
            "highest_package": "1.40 Cr",
            "average_package": "11 LPA",
            "median_package": "10 LPA",
            "placement_percentage": "85%",
            "students_placed": 1733,
            "top_recruiters": ["Microsoft", "Amazon", "Google", "TCS", "Wipro", "Accenture", "Samsung", "IBM", "Infosys", "De Shaw", "Adobe", "Goldman Sachs"]
        },
        "facilities": [
            {"name": "Library", "icon": "library", "description": "Central library with 633+ print journals and 2794+ online journals"},
            {"name": "Hostel", "icon": "hostel", "description": "13 hostels (4 for girls, 9 for boys) accommodating 1600+ students"},
            {"name": "Sports", "icon": "sports", "description": "Sports facilities for 30+ indoor and outdoor games"},
            {"name": "Cafeteria", "icon": "cafeteria", "description": "Multiple canteens across campus"},
            {"name": "Medical", "icon": "medical", "description": "Health center with full-time medical staff"},
            {"name": "WiFi", "icon": "wifi", "description": "Campus-wide WiFi connectivity"},
            {"name": "Labs", "icon": "lab", "description": "Well-equipped laboratories for all departments"}
        ],
        "contact": {
            "phone": "+91-33-24146666",
            "email": "registrar@jadavpuruniversity.in",
            "website": "https://jadavpuruniversity.in"
        },
        "faqs": [
            {"question": "Jadavpur University-তে admission কিভাবে হয়?", "answer": "UG courses-এ WBJEE entrance exam এবং PG courses-এ GATE/CUET PG/WB JECA scores-এর মাধ্যমে admission হয়।"},
            {"question": "B.E. courses-এর fees কত?", "answer": "B.E. courses-এর total fees প্রায় ₹1.16 Lakhs (4 বছরে), যা India-র সবচেয়ে affordable engineering programs-এর মধ্যে একটি।"},
            {"question": "Placement record কেমন?", "answer": "Highest package ₹1.40 Cr এবং average package ₹11 LPA। Top recruiters: Microsoft, Amazon, Google, TCS।"},
            {"question": "Hostel facilities আছে?", "answer": "হ্যাঁ, 13টি hostel আছে (4টি মেয়েদের, 9টি ছেলেদের) যেখানে 1600+ students থাকতে পারে।"},
            {"question": "NIRF ranking কত?", "answer": "NIRF 2025-এ Overall category-তে 18th এবং Engineering-এ 18th rank।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True,
        "is_admission_open": True
    },
    {
        "name": "IIT Kharagpur",
        "slug": "iit-kharagpur",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1951,
        "affiliation": "MHRD",
        "location": {
            "state": "West Bengal",
            "city": "Kharagpur",
            "address": "IIT Kharagpur, Kharagpur, West Bengal 721302",
            "pin_code": "721302",
            "latitude": "22.3149",
            "longitude": "87.3105"
        },
        "campus_size": "2100 acres",
        "recognized_by": ["UGC", "AICTE", "NAAC"],
        "nirf_ranking": 5,
        "rankings": [
            {"agency": "NIRF", "year": 2025, "rank": 5, "category": "Engineering"},
            {"agency": "NIRF", "year": 2025, "rank": 4, "category": "Overall"}
        ],
        "accreditations": [{"name": "NAAC", "grade": "A"}],
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/1200px-IIT_Kharagpur_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1534755511phpNLqT2d.jpeg",
        "campus_images": [
            {"url": "https://images.shiksha.com/mediadata/images/1534755511phpNLqT2d.jpeg", "alt": "IIT Kharagpur Campus"},
            {"url": "https://images.shiksha.com/mediadata/images/1534755668phpaCYsZp.jpeg", "alt": "IIT KGP Main Building"}
        ],
        "description": "Indian Institute of Technology Kharagpur (IIT Kharagpur) is the first IIT established in India in 1951. It is one of the most prestigious engineering institutions in the country, known for its excellent academic programs, world-class research facilities, and outstanding placement records. The campus spans 2100 acres, making it the largest IIT campus.",
        "highlights": [
            "First IIT established in India (1951)",
            "NIRF Ranking 2025: 5th in Engineering, 4th Overall",
            "2100 acres - largest campus among all IITs",
            "Highest package: ₹2.14 CPA",
            "Average package: ₹19.76 LPA",
            "Top recruiters: Google, Microsoft, Amazon, Goldman Sachs"
        ],
        "streams": ["Engineering", "Science", "Management", "Architecture", "Law"],
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "897000", "fees_display": "₹8.97 Lakhs (Total)", "eligibility": "10+2 with 75% marks + JEE Advanced", "entrance_exam": "JEE Advanced"},
            {"name": "B.Tech Mechanical Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "897000", "fees_display": "₹8.97 Lakhs (Total)", "eligibility": "10+2 with 75% marks + JEE Advanced", "entrance_exam": "JEE Advanced"},
            {"name": "B.Tech Electrical Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "897000", "fees_display": "₹8.97 Lakhs (Total)", "eligibility": "10+2 with 75% marks + JEE Advanced", "entrance_exam": "JEE Advanced"},
            {"name": "M.Tech", "stream": "Engineering", "level": "PG", "duration": "2 Years", "fees": "400000", "fees_display": "₹4 Lakhs (Total)", "eligibility": "B.Tech + GATE", "entrance_exam": "GATE"},
            {"name": "MBA", "stream": "Management", "level": "PG", "duration": "2 Years", "fees": "1200000", "fees_display": "₹12 Lakhs (Total)", "eligibility": "Graduation + CAT", "entrance_exam": "CAT"},
            {"name": "B.Arch", "stream": "Architecture", "level": "UG", "duration": "5 Years", "fees": "800000", "fees_display": "₹8 Lakhs (Total)", "eligibility": "10+2 + JEE Advanced + AAT", "entrance_exam": "JEE Advanced + AAT"}
        ],
        "placement": {
            "highest_package": "2.14 Cr",
            "average_package": "19.76 LPA",
            "median_package": "18 LPA",
            "placement_percentage": "90%",
            "top_recruiters": ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Morgan Stanley", "Capgemini", "Accenture", "EY", "PWC", "McKinsey"]
        },
        "facilities": [
            {"name": "Library", "icon": "library", "description": "Central Library with 3.5 lakh+ books"},
            {"name": "Hostel", "icon": "hostel", "description": "22 hostels for students"},
            {"name": "Sports", "icon": "sports", "description": "Olympic-size swimming pool, stadium, courts"},
            {"name": "Medical", "icon": "medical", "description": "BC Roy Technology Hospital"},
            {"name": "Labs", "icon": "lab", "description": "State-of-the-art research labs"}
        ],
        "contact": {
            "phone": "+91-3222-255221",
            "email": "webmaster@iitkgp.ac.in",
            "website": "https://www.iitkgp.ac.in"
        },
        "faqs": [
            {"question": "IIT Kharagpur-এ admission কিভাবে?", "answer": "JEE Advanced qualify করে JoSAA counselling-এর মাধ্যমে admission হয়।"},
            {"question": "Highest package কত?", "answer": "Highest package ₹2.14 CPA (Crore Per Annum), average ₹19.76 LPA।"},
            {"question": "Fees কত?", "answer": "B.Tech-এর total fees প্রায় ₹8.97 Lakhs (4 বছরে)।"},
            {"question": "Campus size কত?", "answer": "2100 acres - সব IIT-এর মধ্যে সবচেয়ে বড়।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "NIT Durgapur",
        "slug": "nit-durgapur",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1960,
        "affiliation": "MHRD",
        "location": {
            "state": "West Bengal",
            "city": "Durgapur",
            "address": "Mahatma Gandhi Avenue, Durgapur, West Bengal 713209",
            "pin_code": "713209",
            "latitude": "23.5472",
            "longitude": "87.2958"
        },
        "campus_size": "212 acres",
        "recognized_by": ["UGC", "AICTE", "NBA"],
        "nirf_ranking": 49,
        "rankings": [
            {"agency": "NIRF", "year": 2025, "rank": 49, "category": "Engineering"}
        ],
        "accreditations": [{"name": "NAAC", "grade": "A++", "cgpa": "3.68"}],
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/NIT_Durgapur_Logo.svg/1200px-NIT_Durgapur_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533536461phpmFthbz.jpeg",
        "description": "National Institute of Technology Durgapur (NIT Durgapur) is one of the premier technical institutions in India established in 1960. It offers excellent engineering and science programs with strong industry connections and placement records.",
        "highlights": [
            "NIRF Ranking 2025: 49th in Engineering",
            "NAAC Accreditation: A++ with CGPA 3.68",
            "Highest package: ₹51 LPA",
            "Average package: ₹12.16 LPA",
            "Top recruiters: Google, Intel, Qualcomm, Samsung"
        ],
        "streams": ["Engineering", "Science", "Management"],
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "648000", "fees_display": "₹6.48 Lakhs (Total)", "eligibility": "10+2 with 75% marks + JEE Main", "entrance_exam": "JEE Main"},
            {"name": "B.Tech Electronics & Communication", "stream": "Engineering", "level": "UG", "duration": "4 Years", "fees": "648000", "fees_display": "₹6.48 Lakhs (Total)", "eligibility": "10+2 with 75% marks + JEE Main", "entrance_exam": "JEE Main"},
            {"name": "M.Tech", "stream": "Engineering", "level": "PG", "duration": "2 Years", "fees": "300000", "fees_display": "₹3 Lakhs (Total)", "eligibility": "B.Tech + GATE", "entrance_exam": "GATE"}
        ],
        "placement": {
            "highest_package": "51 LPA",
            "average_package": "12.16 LPA",
            "median_package": "11.24 LPA",
            "placement_percentage": "85%",
            "top_recruiters": ["Google", "Intel", "Qualcomm", "Samsung", "IBM", "Cadence", "Synopsys", "MediaTek", "AMD", "NVIDIA"]
        },
        "facilities": [
            {"name": "Library", "icon": "library"},
            {"name": "Hostel", "icon": "hostel"},
            {"name": "Sports", "icon": "sports"},
            {"name": "Cafeteria", "icon": "cafeteria"},
            {"name": "Medical", "icon": "medical"},
            {"name": "WiFi", "icon": "wifi"},
            {"name": "Labs", "icon": "lab"}
        ],
        "contact": {
            "phone": "+91-343-2547375",
            "email": "registrar@nitdgp.ac.in",
            "website": "https://nitdgp.ac.in"
        },
        "faqs": [
            {"question": "NIT Durgapur-এ admission কিভাবে?", "answer": "JEE Main qualify করে JoSAA counselling-এর মাধ্যমে admission হয়।"},
            {"question": "Placement record কেমন?", "answer": "Highest package ₹51 LPA, average ₹12.16 LPA। Top recruiters: Google, Intel, Qualcomm।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "Medical College Kolkata",
        "slug": "medical-college-kolkata",
        "type": "Government",
        "institution_type": "College",
        "established_year": 1835,
        "affiliation": "WBUHS",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "88, College Street, Kolkata, West Bengal 700073",
            "pin_code": "700073"
        },
        "recognized_by": ["MCI", "NMC"],
        "nirf_ranking": 44,
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Medical_College_and_Hospital%2C_Kolkata_Logo.png/220px-Medical_College_and_Hospital%2C_Kolkata_Logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510655857phpfhT7mI.jpeg",
        "description": "Medical College Kolkata is one of the oldest medical colleges in Asia, established in 1835. It is a premier government medical institution known for excellent medical education at very affordable fees.",
        "highlights": [
            "Oldest medical college in Asia (1835)",
            "NIRF Rank: 44th Medical",
            "Very low fees - Total ₹40,500",
            "250 MBBS seats",
            "Excellent clinical exposure"
        ],
        "streams": ["Medical"],
        "courses": [
            {"name": "MBBS", "stream": "Medical", "level": "UG", "duration": "5.5 Years", "fees": "40500", "fees_display": "₹40,500 (Total)", "eligibility": "10+2 PCB with 50% + NEET UG", "seats": 250, "entrance_exam": "NEET UG"},
            {"name": "MD/MS", "stream": "Medical", "level": "PG", "duration": "3 Years", "fees": "100000", "fees_display": "₹1 Lakh (Total)", "eligibility": "MBBS + NEET PG", "entrance_exam": "NEET PG"}
        ],
        "placement": {
            "note": "Medical colleges don't have traditional placements. Graduates pursue PG/residency or start practice."
        },
        "facilities": [
            {"name": "Hospital", "icon": "medical", "description": "Attached 2000+ bed teaching hospital"},
            {"name": "Library", "icon": "library"},
            {"name": "Hostel", "icon": "hostel"},
            {"name": "Labs", "icon": "lab"}
        ],
        "contact": {
            "website": "https://medicalcollegekolkata.in"
        },
        "faqs": [
            {"question": "Admission কিভাবে হয়?", "answer": "NEET UG qualify করে WBMCC counselling-এর মাধ্যমে admission হয়।"},
            {"question": "Fees কত?", "answer": "Total MBBS fees মাত্র ₹40,500 - India-র সবচেয়ে affordable medical colleges-এর একটি।"},
            {"question": "Seats কতগুলো?", "answer": "MBBS-এ 250টি seats আছে।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "IIM Calcutta",
        "slug": "iim-calcutta",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1961,
        "affiliation": "MHRD",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "Diamond Harbour Road, Joka, Kolkata, West Bengal 700104",
            "pin_code": "700104"
        },
        "recognized_by": ["AACSB", "AMBA", "EQUIS"],
        "nirf_ranking": 3,
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/IIM_Calcutta_Logo.svg/1200px-IIM_Calcutta_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1535022619phpQFjhIQ.jpeg",
        "description": "Indian Institute of Management Calcutta (IIM Calcutta) is one of the top business schools in Asia. Established in 1961, it is known for its rigorous academic program and excellent placement records.",
        "highlights": [
            "NIRF Rank: 3rd in Management",
            "Triple Crown Accreditation (AACSB, AMBA, EQUIS)",
            "Highest package: ₹1.20 Cr",
            "Average package: ₹35+ LPA",
            "Top B-School in India"
        ],
        "streams": ["Management"],
        "courses": [
            {"name": "MBA (PGP)", "stream": "Management", "level": "PG", "duration": "2 Years", "fees": "2700000", "fees_display": "₹27 Lakhs (Total)", "eligibility": "Graduation + CAT", "entrance_exam": "CAT"},
            {"name": "Executive MBA (MBAEx)", "stream": "Management", "level": "PG", "duration": "1 Year", "fees": "3350000", "fees_display": "₹33.5 Lakhs (Total)", "eligibility": "Graduation + 5+ years work experience", "entrance_exam": "GMAT/GRE"}
        ],
        "placement": {
            "highest_package": "1.20 Cr",
            "average_package": "35 LPA",
            "median_package": "32 LPA",
            "placement_percentage": "100%",
            "top_recruiters": ["McKinsey", "BCG", "Bain", "Amazon", "Google", "Goldman Sachs", "Morgan Stanley", "JP Morgan", "Deloitte", "EY"]
        },
        "facilities": [
            {"name": "Library", "icon": "library", "description": "B.C. Roy Memorial Library"},
            {"name": "Hostel", "icon": "hostel", "description": "On-campus residential facilities"},
            {"name": "Sports", "icon": "sports"},
            {"name": "Cafeteria", "icon": "cafeteria"},
            {"name": "WiFi", "icon": "wifi"}
        ],
        "contact": {
            "website": "https://www.iimcal.ac.in"
        },
        "faqs": [
            {"question": "IIM Calcutta-তে admission কিভাবে?", "answer": "CAT score এবং WAT-PI performance এর ভিত্তিতে admission হয়।"},
            {"question": "Fees কত?", "answer": "MBA (PGP) total fees ₹27 Lakhs।"},
            {"question": "Placement কেমন?", "answer": "Average package ₹35+ LPA, highest ₹1.20 Cr। 100% placement।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "NUJS Kolkata (WBNUJS)",
        "slug": "nujs-kolkata",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1999,
        "affiliation": "BCI",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "12, LB Block, Sector III, Salt Lake, Kolkata, West Bengal 700098",
            "pin_code": "700098"
        },
        "recognized_by": ["BCI", "UGC"],
        "nirf_ranking": 2,
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/West_Bengal_National_University_of_Juridical_Sciences_logo.png/220px-West_Bengal_National_University_of_Juridical_Sciences_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891285phpNWpFlp.jpeg",
        "description": "The West Bengal National University of Juridical Sciences (WBNUJS/NUJS) is one of India's premier National Law Universities. Established in 1999, it is consistently ranked among the top law schools in India.",
        "highlights": [
            "NIRF Rank: 2nd in Law",
            "Top NLU in Eastern India",
            "Excellent placements in top law firms",
            "120 BA LLB seats",
            "Strong alumni network"
        ],
        "streams": ["Law"],
        "courses": [
            {"name": "BA LLB (Hons)", "stream": "Law", "level": "UG", "duration": "5 Years", "fees": "1200000", "fees_display": "₹12 Lakhs (Total)", "eligibility": "10+2 with 45% + CLAT", "seats": 120, "entrance_exam": "CLAT"},
            {"name": "LLM", "stream": "Law", "level": "PG", "duration": "1 Year", "fees": "280000", "fees_display": "₹2.8 Lakhs (Total)", "eligibility": "LLB with 55% + CLAT PG", "entrance_exam": "CLAT PG"}
        ],
        "placement": {
            "highest_package": "42 LPA",
            "average_package": "18 LPA",
            "top_recruiters": ["AZB & Partners", "Cyril Amarchand Mangaldas", "Trilegal", "Khaitan & Co", "S&R Associates", "JSA", "Luthra & Luthra"]
        },
        "contact": {
            "website": "https://www.nujs.edu"
        },
        "faqs": [
            {"question": "NUJS-এ admission কিভাবে?", "answer": "CLAT exam qualify করে CLAT counselling-এর মাধ্যমে admission হয়।"},
            {"question": "NUJS-এর ranking কত?", "answer": "NIRF 2025-এ Law category-তে 2nd rank।"},
            {"question": "Placement কেমন?", "answer": "Average package ₹18 LPA, highest ₹42 LPA। Top law firms recruit করে।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "Presidency University Kolkata",
        "slug": "presidency-university-kolkata",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1817,
        "affiliation": "UGC",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "86/1, College Street, Kolkata, West Bengal 700073",
            "pin_code": "700073"
        },
        "recognized_by": ["UGC", "NAAC"],
        "nirf_ranking": 56,
        "accreditations": [{"name": "NAAC", "grade": "A"}],
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Presidency_University%2C_Kolkata_logo.svg/1200px-Presidency_University%2C_Kolkata_logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533891589phpB8xvxI.jpeg",
        "description": "Presidency University is one of India's oldest and most prestigious universities, established in 1817. Known for excellence in Arts, Science, and Humanities, it has produced 3 Nobel Laureates.",
        "highlights": [
            "Established 1817 - Oldest in India",
            "NIRF Rank: 56th University",
            "NAAC Grade A",
            "Produced 3 Nobel Laureates",
            "Heritage campus with modern facilities"
        ],
        "streams": ["Arts", "Science"],
        "courses": [
            {"name": "BA Economics", "stream": "Arts", "level": "UG", "duration": "3 Years", "fees": "50000", "fees_display": "₹50,000 (Total)", "eligibility": "10+2 + Entrance Exam"},
            {"name": "BA English", "stream": "Arts", "level": "UG", "duration": "3 Years", "fees": "50000", "fees_display": "₹50,000 (Total)", "eligibility": "10+2 + Entrance Exam"},
            {"name": "B.Sc Physics", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "60000", "fees_display": "₹60,000 (Total)", "eligibility": "10+2 Science + Entrance Exam"},
            {"name": "B.Sc Chemistry", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "60000", "fees_display": "₹60,000 (Total)", "eligibility": "10+2 Science + Entrance Exam"}
        ],
        "facilities": [
            {"name": "Library", "icon": "library"},
            {"name": "Hostel", "icon": "hostel"},
            {"name": "Labs", "icon": "lab"},
            {"name": "WiFi", "icon": "wifi"}
        ],
        "contact": {
            "website": "https://www.presiuniv.ac.in"
        },
        "faqs": [
            {"question": "Presidency-তে admission কিভাবে?", "answer": "University entrance exam এবং merit-এর ভিত্তিতে admission হয়।"},
            {"question": "কোন Nobel Laureates এখান থেকে?", "answer": "Amartya Sen, C.V. Raman, Ronald Ross এখানে পড়েছেন।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "ISI Kolkata",
        "slug": "isi-kolkata",
        "type": "Government",
        "institution_type": "University",
        "established_year": 1931,
        "affiliation": "MoSPI",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "203, B.T. Road, Kolkata, West Bengal 700108",
            "pin_code": "700108"
        },
        "recognized_by": ["UGC", "NAAC"],
        "nirf_ranking": 12,
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Indian_Statistical_Institute_Logo.svg/1200px-Indian_Statistical_Institute_Logo.svg.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1510821652phpIz8kgf.jpeg",
        "description": "Indian Statistical Institute (ISI) Kolkata is a world-renowned institute for statistics, mathematics, and computer science. Founded by P.C. Mahalanobis in 1931.",
        "highlights": [
            "NIRF Rank: 12th University",
            "World-class Statistics program",
            "Founded by P.C. Mahalanobis",
            "Highest package: ₹50 LPA",
            "Average package: ₹25 LPA"
        ],
        "streams": ["Science", "Engineering"],
        "courses": [
            {"name": "B.Stat", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "35000", "fees_display": "₹35,000 (Total)", "eligibility": "10+2 + ISI Entrance", "entrance_exam": "ISI Entrance"},
            {"name": "B.Math", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "35000", "fees_display": "₹35,000 (Total)", "eligibility": "10+2 + ISI Entrance", "entrance_exam": "ISI Entrance"},
            {"name": "M.Stat", "stream": "Science", "level": "PG", "duration": "2 Years", "fees": "40000", "fees_display": "₹40,000 (Total)", "eligibility": "B.Stat/B.Math + ISI Entrance", "entrance_exam": "ISI Entrance"}
        ],
        "placement": {
            "highest_package": "50 LPA",
            "average_package": "25 LPA",
            "top_recruiters": ["Google", "Microsoft", "Goldman Sachs", "Morgan Stanley", "Amazon", "JP Morgan", "Deutsche Bank"]
        },
        "contact": {
            "website": "https://www.isical.ac.in"
        },
        "faqs": [
            {"question": "ISI-তে admission কিভাবে?", "answer": "ISI Entrance Exam qualify করে admission হয়। এটি India-র সবচেয়ে কঠিন entrance exams-এর একটি।"},
            {"question": "Placement কেমন?", "answer": "Highest package ₹50 LPA, average ₹25 LPA। Top finance এবং tech companies recruit করে।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "NIFT Kolkata",
        "slug": "nift-kolkata",
        "type": "Government",
        "institution_type": "College",
        "established_year": 1995,
        "affiliation": "Ministry of Textiles",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "NIFT Campus, Plot 3B, Block LA, Sector III, Salt Lake, Kolkata, West Bengal 700098",
            "pin_code": "700098"
        },
        "recognized_by": ["UGC", "Ministry of Textiles"],
        "nirf_ranking": 15,
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/National_Institute_of_Fashion_Technology_logo.png/220px-National_Institute_of_Fashion_Technology_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1571386949phpMbOqby.jpeg",
        "description": "National Institute of Fashion Technology (NIFT) Kolkata is a premier fashion design institute offering world-class design education and excellent industry placements.",
        "highlights": [
            "NIRF Rank: 15th (Design)",
            "Top fashion institute",
            "Strong industry placements",
            "Modern facilities",
            "Industry connections with top brands"
        ],
        "streams": ["Design"],
        "courses": [
            {"name": "B.Des (Fashion Design)", "stream": "Design", "level": "UG", "duration": "4 Years", "fees": "800000", "fees_display": "₹8 Lakhs (Total)", "eligibility": "10+2 + NIFT Entrance", "entrance_exam": "NIFT Entrance"},
            {"name": "B.Des (Textile Design)", "stream": "Design", "level": "UG", "duration": "4 Years", "fees": "800000", "fees_display": "₹8 Lakhs (Total)", "eligibility": "10+2 + NIFT Entrance", "entrance_exam": "NIFT Entrance"},
            {"name": "M.Des", "stream": "Design", "level": "PG", "duration": "2 Years", "fees": "500000", "fees_display": "₹5 Lakhs (Total)", "eligibility": "Graduation + NIFT Entrance", "entrance_exam": "NIFT Entrance"}
        ],
        "placement": {
            "highest_package": "18 LPA",
            "average_package": "8 LPA",
            "top_recruiters": ["H&M", "Zara", "Myntra", "Amazon", "Reliance Retail", "Arvind", "Raymond", "Aditya Birla Fashion"]
        },
        "contact": {
            "website": "https://nift.ac.in/kolkata"
        },
        "faqs": [
            {"question": "NIFT-এ admission কিভাবে?", "answer": "NIFT Entrance Exam (CAT + GAT + Situation Test) qualify করে admission হয়।"},
            {"question": "Placement কেমন?", "answer": "Average package ₹8 LPA, highest ₹18 LPA। Top fashion brands recruit করে।"}
        ],
        "status": "published",
        "is_verified": True,
        "is_featured": True
    },
    {
        "name": "St. Xavier's College Kolkata",
        "slug": "st-xaviers-college-kolkata",
        "type": "Private",
        "institution_type": "College",
        "established_year": 1860,
        "affiliation": "University of Calcutta",
        "location": {
            "state": "West Bengal",
            "city": "Kolkata",
            "address": "30, Mother Teresa Sarani, Kolkata, West Bengal 700016",
            "pin_code": "700016"
        },
        "recognized_by": ["UGC", "NAAC"],
        "nirf_ranking": 13,
        "accreditations": [{"name": "NAAC", "grade": "A++"}],
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/St._Xavier%27s_College%2C_Kolkata_logo.png/220px-St._Xavier%27s_College%2C_Kolkata_logo.png",
        "banner_url": "https://images.shiksha.com/mediadata/images/1533280506phpJSHj5J.jpeg",
        "description": "St. Xavier's College is one of India's most prestigious colleges, known for academic excellence in Arts, Science, and Commerce. Established in 1860 by the Jesuits.",
        "highlights": [
            "NIRF Rank: 13th College",
            "NAAC A++",
            "Autonomous status",
            "Heritage campus",
            "Excellent faculty"
        ],
        "streams": ["Arts", "Science", "Commerce"],
        "courses": [
            {"name": "BA Economics", "stream": "Arts", "level": "UG", "duration": "3 Years", "fees": "60000", "fees_display": "₹60,000 (Total)", "eligibility": "10+2 + Entrance"},
            {"name": "B.Sc Physics", "stream": "Science", "level": "UG", "duration": "3 Years", "fees": "70000", "fees_display": "₹70,000 (Total)", "eligibility": "10+2 Science + Entrance"},
            {"name": "B.Com Honours", "stream": "Commerce", "level": "UG", "duration": "3 Years", "fees": "60000", "fees_display": "₹60,000 (Total)", "eligibility": "10+2 Commerce + Entrance"}
        ],
        "facilities": [
            {"name": "Library", "icon": "library"},
            {"name": "Labs", "icon": "lab"},
            {"name": "Auditorium", "icon": "auditorium"},
            {"name": "WiFi", "icon": "wifi"}
        ],
        "contact": {
            "website": "https://www.sxccal.edu"
        },
        "status": "published",
        "is_verified": True,
        "is_featured": True
    }
]

def login():
    """Login and get access token"""
    print("🔑 Logging in...")
    response = requests.post(
        f"{BASE_URL}/auth/admin-login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    if response.status_code == 200:
        token = response.json().get("access_token")
        print("✅ Login successful!")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def create_college(token, college_data):
    """Create a college via API"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{BASE_URL}/colleges",
        headers=headers,
        json=college_data
    )
    
    return response

def main():
    # Login
    token = login()
    if not token:
        print("❌ Cannot proceed without token")
        return
    
    print(f"\n📚 Uploading {len(COLLEGES)} colleges...\n")
    
    success_count = 0
    failed_colleges = []
    
    for i, college in enumerate(COLLEGES, 1):
        print(f"[{i}/{len(COLLEGES)}] Uploading: {college['name']}...")
        
        try:
            response = create_college(token, college)
            
            if response.status_code in [200, 201]:
                print(f"    ✅ Success!")
                success_count += 1
            else:
                error_msg = response.text[:200]
                print(f"    ❌ Failed: {error_msg}")
                failed_colleges.append((college['name'], error_msg))
        except Exception as e:
            print(f"    ❌ Error: {str(e)}")
            failed_colleges.append((college['name'], str(e)))
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    # Summary
    print("\n" + "="*50)
    print("📊 UPLOAD SUMMARY")
    print("="*50)
    print(f"✅ Successfully uploaded: {success_count}/{len(COLLEGES)}")
    
    if failed_colleges:
        print(f"\n❌ Failed colleges ({len(failed_colleges)}):")
        for name, error in failed_colleges:
            print(f"   - {name}: {error[:100]}")
    
    print("\n🎉 Done!")

if __name__ == "__main__":
    main()
