#!/usr/bin/env python3
"""
Focused test for Course Listing Settings and Course Pages APIs
"""

import requests
import json

BASE_URL = "https://campus-connect-424.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

def get_admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/auth/admin-login", json=ADMIN_CREDENTIALS)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def test_course_listing_settings():
    """Test Course Listing Settings API comprehensively"""
    print("🔍 FOCUSED TEST: Course Listing Settings API")
    print("=" * 60)
    
    # Test 1: GET /api/course-listing-settings
    print("1. Testing GET /api/course-listing-settings...")
    response = requests.get(f"{BASE_URL}/course-listing-settings")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ GET request successful")
        
        # Check for all expected fields including trending
        expected_fields = [
            "hero_title", "hero_subtitle", "hero_search_placeholder",
            "popular_tags", "level_courses", "stream_categories",
            "trending_badge", "trending_title", "trending_subtitle", "trending_courses",
            "stats_courses", "stats_colleges", "stats_streams", "stats_students",
            "meta_title", "meta_description", "meta_keywords", "faqs"
        ]
        
        present_fields = [field for field in expected_fields if field in data]
        missing_fields = [field for field in expected_fields if field not in data]
        
        print(f"   Present fields ({len(present_fields)}/18): {', '.join(present_fields[:10])}...")
        if missing_fields:
            print(f"   Missing fields: {', '.join(missing_fields)}")
        
        # Verify trending section structure
        if "trending_courses" in data:
            trending_courses = data["trending_courses"]
            print(f"   Trending courses count: {len(trending_courses)}")
            if trending_courses:
                first_course = trending_courses[0]
                required_course_fields = ["name", "growth", "icon", "link"]
                course_fields_present = [field for field in required_course_fields if field in first_course]
                print(f"   Trending course fields: {', '.join(course_fields_present)}")
        
    else:
        print(f"❌ GET request failed with status {response.status_code}")
        print(f"   Response: {response.text}")
    
    # Test 2: PUT /api/course-listing-settings with admin auth
    print("\n2. Testing PUT /api/course-listing-settings with admin auth...")
    admin_token = get_admin_token()
    
    if admin_token:
        print("✅ Admin token obtained")
        
        # Test data with all fields including trending
        test_data = {
            "hero_title": "FOCUSED TEST - Course Listing 2025",
            "hero_subtitle": "FOCUSED TEST - Comprehensive guide to courses",
            "hero_search_placeholder": "Search FOCUSED TEST courses...",
            "popular_tags": [
                {"name": "FOCUSED B.Tech", "link": "/focused-engineering", "color": "bg-blue-600"}
            ],
            "level_courses": [
                {"title": "FOCUSED After 12th", "subtitle": "FOCUSED Programs", "icon": "📚", "link": "/focused-after-12th"}
            ],
            "stream_categories": [
                {"name": "FOCUSED Engineering", "icon": "HiOutlineDesktopComputer", "link": "/focused-engineering", "courses": ["FOCUSED B.Tech"], "count": "100+"}
            ],
            "trending_badge": "🔥 FOCUSED TRENDING",
            "trending_title": "FOCUSED Trending Courses 2025",
            "trending_subtitle": "FOCUSED most sought-after programs",
            "trending_courses": [
                {"name": "FOCUSED AI & ML", "growth": "+95%", "icon": "🤖", "link": "/focused-ai-ml"}
            ],
            "stats_courses": "FOCUSED 500+",
            "stats_colleges": "FOCUSED 2000+",
            "stats_streams": "FOCUSED 25+",
            "stats_students": "FOCUSED 50K+",
            "meta_title": "FOCUSED Courses in India 2025",
            "meta_description": "FOCUSED comprehensive guide to courses",
            "meta_keywords": ["focused courses", "2025", "comprehensive"],
            "faqs": [
                {"question": "FOCUSED FAQ 1?", "answer": "FOCUSED answer 1"}
            ]
        }
        
        headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
        response = requests.put(f"{BASE_URL}/course-listing-settings", json=test_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ PUT request successful")
            updated_data = response.json()
            
            # Verify all fields were saved
            saved_correctly = []
            not_saved = []
            
            for key, expected_value in test_data.items():
                if key in updated_data and updated_data[key] == expected_value:
                    saved_correctly.append(key)
                else:
                    not_saved.append(key)
            
            print(f"   Fields saved correctly ({len(saved_correctly)}/18): {', '.join(saved_correctly[:10])}...")
            if not_saved:
                print(f"   Fields not saved correctly: {', '.join(not_saved)}")
        else:
            print(f"❌ PUT request failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    else:
        print("❌ Failed to get admin token")

def test_course_pages():
    """Test Course Pages API comprehensively"""
    print("\n🔍 FOCUSED TEST: Course Pages API")
    print("=" * 60)
    
    # Test 1: GET /api/course-pages
    print("1. Testing GET /api/course-pages...")
    response = requests.get(f"{BASE_URL}/course-pages")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ GET request successful - Retrieved {len(data)} course pages")
        
        if len(data) == 15:
            print("✅ Correct count: 15 pages as expected")
        else:
            print(f"❌ Incorrect count: Expected 15, got {len(data)}")
        
        # Check page IDs
        page_ids = [page.get("id") for page in data if "id" in page]
        expected_ids = ["after-10th", "after-12th", "diploma", "pg", "phd", "certificate",
                       "engineering", "medical", "management", "science", "commerce", 
                       "arts", "computer", "law", "education"]
        
        missing_ids = [pid for pid in expected_ids if pid not in page_ids]
        extra_ids = [pid for pid in page_ids if pid not in expected_ids]
        
        if not missing_ids and not extra_ids:
            print("✅ All expected page IDs present")
        else:
            if missing_ids:
                print(f"❌ Missing page IDs: {', '.join(missing_ids)}")
            if extra_ids:
                print(f"❌ Extra page IDs: {', '.join(extra_ids)}")
    else:
        print(f"❌ GET request failed with status {response.status_code}")
    
    # Test 2: GET specific pages
    test_pages = ["engineering", "medical", "after-10th"]
    for page_id in test_pages:
        print(f"\n2.{test_pages.index(page_id)+1} Testing GET /api/course-pages/{page_id}...")
        response = requests.get(f"{BASE_URL}/course-pages/{page_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Retrieved {page_id} page: {data.get('title', 'No title')}")
        else:
            print(f"❌ Failed to get {page_id} page - Status: {response.status_code}")
    
    # Test 3: PUT with admin auth
    print(f"\n3. Testing PUT /api/course-pages/engineering with admin auth...")
    admin_token = get_admin_token()
    
    if admin_token:
        test_update = {
            "id": "engineering",
            "page_type": "stream",
            "title": "FOCUSED TEST - Engineering Courses in India 2025",
            "subtitle": "FOCUSED TEST - Comprehensive guide to engineering programs",
            "theme": "from-blue-600 via-blue-700 to-indigo-700",
            "filter_key": "stream",
            "filter_value": "Engineering"
        }
        
        headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
        response = requests.put(f"{BASE_URL}/course-pages/engineering", json=test_update, headers=headers)
        
        if response.status_code == 200:
            print("✅ PUT request successful")
            updated_data = response.json()
            if updated_data.get("title") == test_update["title"]:
                print("✅ Title updated correctly")
            else:
                print(f"❌ Title not updated correctly: {updated_data.get('title')}")
        else:
            print(f"❌ PUT request failed with status {response.status_code}")
    
    # Test 4: POST reset
    print(f"\n4. Testing POST /api/course-pages/engineering/reset...")
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/course-pages/engineering/reset", headers=headers)
        
        if response.status_code == 200:
            print("✅ Reset request successful")
            reset_data = response.json()
            if reset_data.get("title") == "Engineering Courses in India":
                print("✅ Page reset to default title correctly")
            else:
                print(f"❌ Page not reset correctly: {reset_data.get('title')}")
        else:
            print(f"❌ Reset request failed with status {response.status_code}")

if __name__ == "__main__":
    test_course_listing_settings()
    test_course_pages()
    print("\n" + "=" * 60)
    print("🎯 FOCUSED TESTING COMPLETE")
    print("=" * 60)