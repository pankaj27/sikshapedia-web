#!/usr/bin/env python3
"""
Add Facilities Data to West Bengal Colleges
Using correct format like Delhi University
"""

import requests
import json
import time

BASE_URL = "https://admissionbuddy.co/api"
EMAIL = "admin@admissionbuddy.co"
PASSWORD = "admin123"

# Facilities for different types of colleges
ENGINEERING_FACILITIES = [
    {"name": "Library", "icon": "FiBook", "description": "Central library with extensive collection of books, journals, and digital resources"},
    {"name": "Computer Labs", "icon": "FiMonitor", "description": "State-of-the-art computer labs with high-speed internet"},
    {"name": "Hostel", "icon": "FiHome", "description": "Separate hostels for boys and girls with modern amenities"},
    {"name": "Sports Complex", "icon": "FiActivity", "description": "Multi-sport facilities including cricket, football, basketball, and indoor games"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "Multiple canteens serving hygienic food"},
    {"name": "Medical Center", "icon": "FiHeart", "description": "24/7 health center with qualified medical staff"},
    {"name": "WiFi Campus", "icon": "FiWifi", "description": "High-speed WiFi connectivity across entire campus"},
    {"name": "Auditorium", "icon": "FiUsers", "description": "Large auditorium for seminars, workshops and cultural events"},
    {"name": "Research Labs", "icon": "FiTool", "description": "Well-equipped research laboratories for advanced projects"},
    {"name": "Placement Cell", "icon": "FiBriefcase", "description": "Dedicated placement cell for career guidance and campus recruitment"}
]

MEDICAL_FACILITIES = [
    {"name": "Teaching Hospital", "icon": "FiActivity", "description": "Attached multi-specialty teaching hospital with 1000+ beds"},
    {"name": "Library", "icon": "FiBook", "description": "Medical library with latest journals and reference materials"},
    {"name": "Anatomy Labs", "icon": "FiTool", "description": "Well-equipped anatomy and dissection halls"},
    {"name": "Pathology Labs", "icon": "FiDroplet", "description": "Modern pathology and diagnostic laboratories"},
    {"name": "Hostel", "icon": "FiHome", "description": "Separate hostels for boys and girls near campus"},
    {"name": "Emergency Services", "icon": "FiAlertCircle", "description": "24/7 emergency and trauma care services"},
    {"name": "OPD Complex", "icon": "FiUsers", "description": "Outpatient department with multiple specialties"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "Clean and hygienic cafeteria for students and staff"}
]

MANAGEMENT_FACILITIES = [
    {"name": "Library", "icon": "FiBook", "description": "Business library with case studies, journals, and Bloomberg terminals"},
    {"name": "Computer Lab", "icon": "FiMonitor", "description": "IT lab with latest software for data analytics and simulations"},
    {"name": "Hostel", "icon": "FiHome", "description": "On-campus residential facilities with AC rooms"},
    {"name": "Auditorium", "icon": "FiUsers", "description": "Conference halls and auditorium for seminars and guest lectures"},
    {"name": "Sports Facilities", "icon": "FiActivity", "description": "Gymnasium, sports grounds, and recreational facilities"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "Modern cafeteria serving multi-cuisine food"},
    {"name": "WiFi Campus", "icon": "FiWifi", "description": "High-speed internet connectivity across campus"},
    {"name": "Placement Cell", "icon": "FiBriefcase", "description": "Corporate relations office for placements and internships"}
]

LAW_FACILITIES = [
    {"name": "Law Library", "icon": "FiBook", "description": "Extensive law library with legal databases like SCC Online, Manupatra"},
    {"name": "Moot Court", "icon": "FiUsers", "description": "Moot court hall for legal advocacy training"},
    {"name": "Computer Lab", "icon": "FiMonitor", "description": "IT lab with legal research tools"},
    {"name": "Hostel", "icon": "FiHome", "description": "Residential facilities for students"},
    {"name": "Auditorium", "icon": "FiMic", "description": "Seminar halls for guest lectures and workshops"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "On-campus cafeteria"}
]

ARTS_SCIENCE_FACILITIES = [
    {"name": "Library", "icon": "FiBook", "description": "Central library with vast collection of books and journals"},
    {"name": "Science Labs", "icon": "FiTool", "description": "Well-equipped laboratories for physics, chemistry, and biology"},
    {"name": "Computer Center", "icon": "FiMonitor", "description": "Computer lab with internet facilities"},
    {"name": "Auditorium", "icon": "FiUsers", "description": "Auditorium for cultural events and seminars"},
    {"name": "Sports Ground", "icon": "FiActivity", "description": "Playground and sports facilities"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "Canteen serving affordable meals"},
    {"name": "Hostel", "icon": "FiHome", "description": "Hostel accommodation for outstation students"}
]

DESIGN_FACILITIES = [
    {"name": "Design Studios", "icon": "FiPenTool", "description": "Spacious design studios with natural lighting"},
    {"name": "Computer Lab", "icon": "FiMonitor", "description": "Mac labs with Adobe Creative Suite and design software"},
    {"name": "Library", "icon": "FiBook", "description": "Design library with fashion magazines, portfolios, and archives"},
    {"name": "Workshop", "icon": "FiTool", "description": "Workshops for pattern making, draping, and textile printing"},
    {"name": "Exhibition Hall", "icon": "FiImage", "description": "Gallery space for student exhibitions and shows"},
    {"name": "Hostel", "icon": "FiHome", "description": "On-campus hostel facilities"},
    {"name": "Cafeteria", "icon": "FiCoffee", "description": "Modern cafeteria"}
]

# Specific facilities for each college
COLLEGE_FACILITIES = {
    "iit-kharagpur-wb": [
        {"name": "Central Library", "icon": "FiBook", "description": "B.C. Roy Memorial Library - one of the largest technical libraries in India with 3.5 lakh+ books"},
        {"name": "Hostels", "icon": "FiHome", "description": "22 residential halls accommodating 8000+ students"},
        {"name": "Sports Complex", "icon": "FiActivity", "description": "Olympic-size swimming pool, stadium, tennis courts, and gymnasium"},
        {"name": "Technology Market", "icon": "FiShoppingCart", "description": "Technology Market (TM) - a student-run marketplace"},
        {"name": "Hospital", "icon": "FiHeart", "description": "B.C. Roy Technology Hospital with 250+ beds"},
        {"name": "Research Parks", "icon": "FiTool", "description": "Multiple research centers and incubation facilities"},
        {"name": "Auditorium", "icon": "FiUsers", "description": "Netaji Auditorium and multiple seminar halls"},
        {"name": "WiFi Campus", "icon": "FiWifi", "description": "High-speed internet across 2100 acres campus"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "Multiple canteens and food courts"},
        {"name": "Banking", "icon": "FiDollarSign", "description": "SBI, post office, and ATMs on campus"}
    ],
    "nit-durgapur-wb": [
        {"name": "Central Library", "icon": "FiBook", "description": "Modern library with digital resources and study spaces"},
        {"name": "Hostels", "icon": "FiHome", "description": "10+ hostels for boys and girls with mess facilities"},
        {"name": "Sports Complex", "icon": "FiActivity", "description": "Stadium, gymnasium, and indoor sports facilities"},
        {"name": "Computer Center", "icon": "FiMonitor", "description": "State-of-the-art computing facilities with high-speed internet"},
        {"name": "Medical Center", "icon": "FiHeart", "description": "Health center with ambulance service"},
        {"name": "Auditorium", "icon": "FiUsers", "description": "Multi-purpose auditorium for events"},
        {"name": "Research Labs", "icon": "FiTool", "description": "Advanced research laboratories"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "Multiple canteens on campus"}
    ],
    "jadavpur-university-kolkata": [
        {"name": "Central Library", "icon": "FiBook", "description": "Library with 633+ print journals and 2794+ online journals"},
        {"name": "Hostels", "icon": "FiHome", "description": "13 hostels (4 for girls, 9 for boys) accommodating 1600+ students"},
        {"name": "Sports Facilities", "icon": "FiActivity", "description": "Facilities for 30+ indoor and outdoor games"},
        {"name": "Computer Center", "icon": "FiMonitor", "description": "CAD center and computing facilities"},
        {"name": "Health Center", "icon": "FiHeart", "description": "Medical facility with doctors and specialists"},
        {"name": "Auditorium", "icon": "FiUsers", "description": "Multiple auditoriums for seminars and cultural events"},
        {"name": "Guest House", "icon": "FiMapPin", "description": "90 double bedrooms and 3 deluxe AC rooms"},
        {"name": "Radio Station", "icon": "FiRadio", "description": "RadioJU - First community radio in Eastern India"},
        {"name": "Day Care", "icon": "FiSmile", "description": "Day care center for staff and students' children"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "Multiple canteens across campus"}
    ],
    "iiest-shibpur-wb": [
        {"name": "Central Library", "icon": "FiBook", "description": "Historic library with vast technical collection"},
        {"name": "Hostels", "icon": "FiHome", "description": "Multiple hostels with mess facilities"},
        {"name": "Sports Ground", "icon": "FiActivity", "description": "Extensive sports facilities and playground"},
        {"name": "Computer Center", "icon": "FiMonitor", "description": "Modern computing facilities"},
        {"name": "Medical Center", "icon": "FiHeart", "description": "On-campus health center"},
        {"name": "Auditorium", "icon": "FiUsers", "description": "Auditorium for events and seminars"},
        {"name": "Research Labs", "icon": "FiTool", "description": "Well-equipped research laboratories"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "Canteen facilities"}
    ],
    "iim-calcutta": [
        {"name": "B.C. Roy Memorial Library", "icon": "FiBook", "description": "Business library with Bloomberg terminals and case study databases"},
        {"name": "Hostels", "icon": "FiHome", "description": "On-campus residential halls with AC rooms"},
        {"name": "Sports Complex", "icon": "FiActivity", "description": "Gymnasium, tennis courts, and recreational facilities"},
        {"name": "Auditorium", "icon": "FiUsers", "description": "State-of-the-art auditorium and conference halls"},
        {"name": "Computer Center", "icon": "FiMonitor", "description": "IT facilities with enterprise software"},
        {"name": "Medical Center", "icon": "FiHeart", "description": "Health center with medical staff"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "Multi-cuisine food court"},
        {"name": "WiFi Campus", "icon": "FiWifi", "description": "High-speed internet connectivity"}
    ],
    "isi-kolkata": [
        {"name": "Library", "icon": "FiBook", "description": "Specialized library for statistics and mathematics"},
        {"name": "Computing Facilities", "icon": "FiMonitor", "description": "Advanced computing center for research"},
        {"name": "Hostels", "icon": "FiHome", "description": "Residential facilities for students"},
        {"name": "Sports Facilities", "icon": "FiActivity", "description": "Sports ground and recreational areas"},
        {"name": "Guest House", "icon": "FiMapPin", "description": "Accommodation for visiting scholars"},
        {"name": "Cafeteria", "icon": "FiCoffee", "description": "On-campus canteen"}
    ],
    "medical-college-kolkata": MEDICAL_FACILITIES,
    "ipgmer-sskm-kolkata": MEDICAL_FACILITIES,
    "rg-kar-medical-kolkata": MEDICAL_FACILITIES,
    "nujs-kolkata": LAW_FACILITIES,
    "calcutta-university-law-wb": LAW_FACILITIES,
    "nift-kolkata": DESIGN_FACILITIES,
    "govt-art-craft-kolkata": DESIGN_FACILITIES,
    "presidency-university-wb": ARTS_SCIENCE_FACILITIES,
    "st-xaviers-college-wb": ARTS_SCIENCE_FACILITIES,
    "scottish-church-college-wb": ARTS_SCIENCE_FACILITIES,
}


def login():
    print("🔑 Logging in...")
    response = requests.post(
        f"{BASE_URL}/auth/admin-login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    if response.status_code == 200:
        print("✅ Login successful!")
        return response.json().get("access_token")
    print(f"❌ Login failed: {response.text}")
    return None


def get_all_colleges(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/colleges?limit=100", headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data.get('colleges', data) if isinstance(data, dict) else data
    return []


def update_college(token, college_id, update_data):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.put(
        f"{BASE_URL}/colleges/{college_id}",
        headers=headers,
        json=update_data
    )
    return response


def get_default_facilities(streams):
    """Get default facilities based on streams"""
    if 'Medical' in streams:
        return MEDICAL_FACILITIES
    elif 'Management' in streams and len(streams) <= 2:
        return MANAGEMENT_FACILITIES
    elif 'Law' in streams:
        return LAW_FACILITIES
    elif 'Design' in streams:
        return DESIGN_FACILITIES
    elif 'Engineering' in streams:
        return ENGINEERING_FACILITIES
    else:
        return ARTS_SCIENCE_FACILITIES


def main():
    token = login()
    if not token:
        return
    
    colleges = get_all_colleges(token)
    print(f"\n📚 Found {len(colleges)} colleges\n")
    
    success = 0
    failed = 0
    
    for college in colleges:
        college_id = college.get('id')
        name = college.get('name', '')
        slug = college.get('slug', '')
        state = college.get('location', {}).get('state', '')
        streams = college.get('streams', [])
        
        # Only update West Bengal colleges
        if state != 'West Bengal':
            continue
        
        # Check if facilities already exist and are not empty
        existing_facilities = college.get('facilities', [])
        if existing_facilities and len(existing_facilities) > 0:
            print(f"⏭️  {name} - Already has {len(existing_facilities)} facilities")
            continue
        
        print(f"Adding facilities to: {name}...")
        
        # Get specific or default facilities
        if slug in COLLEGE_FACILITIES:
            facilities = COLLEGE_FACILITIES[slug]
        else:
            facilities = get_default_facilities(streams)
        
        update_data = {"facilities": facilities}
        
        try:
            response = update_college(token, college_id, update_data)
            if response.status_code == 200:
                print(f"  ✅ Added {len(facilities)} facilities")
                success += 1
            else:
                print(f"  ❌ Failed: {response.text[:100]}")
                failed += 1
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            failed += 1
        
        time.sleep(0.3)
    
    print("\n" + "="*50)
    print(f"✅ Successfully updated: {success}")
    print(f"❌ Failed: {failed}")
    print("="*50)


if __name__ == "__main__":
    main()
