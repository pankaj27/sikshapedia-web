#!/usr/bin/env python3
"""
Test to verify the collection name mismatch issue
"""

import requests
import json

BASE_URL = "https://course-stream-fix.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {"email": "admin@admissionbuddy.co", "password": "admin123"}

def test_collection_mismatch():
    # Login
    response = requests.post(f"{BASE_URL}/auth/admin-login", json=ADMIN_CREDENTIALS)
    if response.status_code != 200:
        print("❌ Admin login failed")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("🔍 Testing Collection Name Mismatch Issue")
    print("=" * 50)
    
    # Create a course
    course_data = {
        "name": "Test Collection Mismatch Course",
        "slug": "test-collection-mismatch",
        "full_name": "Test Course for Collection Mismatch",
        "description": "Testing collection name issue",
        "degree_type": "UG",
        "stream": "Engineering",
        "duration": "4 years",
        "average_fees": 50000.0,
        "eligibility": "10+2",
        "entrance_exams": [],
        "career_options": [],
        "status": "draft"
    }
    
    response = requests.post(f"{BASE_URL}/courses-detail", json=course_data, headers=headers)
    if response.status_code == 200:
        course_id = response.json()["id"]
        print(f"✅ Course created with ID: {course_id}")
        
        # Try to submit for review (this should fail due to collection mismatch)
        response = requests.post(f"{BASE_URL}/admin/submit-for-review/course/{course_id}", headers=headers)
        if response.status_code == 404:
            print("❌ Submit for review failed - Collection mismatch confirmed!")
            print(f"   Error: {response.json()}")
            print("   Issue: Course created in 'courses_detailed' but approval system looks in 'courses_detail'")
        else:
            print("✅ Submit for review worked - No collection mismatch")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/courses-detail/{course_id}", headers=headers)
    else:
        print(f"❌ Course creation failed: {response.status_code}")
    
    # Test exam collection mismatch
    exam_data = {
        "name": "TEST-COLLECTION",
        "slug": "test-collection-mismatch",
        "full_name": "Test Exam for Collection Mismatch",
        "description": "Testing collection name issue",
        "conducting_body": "Test Board",
        "exam_level": "National",
        "exam_type": "Entrance",
        "streams": ["Engineering"],
        "exam_mode": "Online",
        "exam_duration": "3 hours",
        "total_marks": 300,
        "num_questions": 100,
        "exam_pattern": {"sections": ["Physics"]},
        "eligibility": {"min_percentage": 75},
        "application_fee": {"general": 1000},
        "status": "draft"
    }
    
    response = requests.post(f"{BASE_URL}/exams-detail", json=exam_data, headers=headers)
    if response.status_code == 200:
        exam_id = response.json()["id"]
        print(f"✅ Exam created with ID: {exam_id}")
        
        # Try to submit for review (this should fail due to collection mismatch)
        response = requests.post(f"{BASE_URL}/admin/submit-for-review/exam/{exam_id}", headers=headers)
        if response.status_code == 404:
            print("❌ Submit for review failed - Collection mismatch confirmed!")
            print(f"   Error: {response.json()}")
            print("   Issue: Exam created in 'exams_detailed' but approval system looks in 'exams_detail'")
        else:
            print("✅ Submit for review worked - No collection mismatch")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/exams-detail/{exam_id}", headers=headers)
    else:
        print(f"❌ Exam creation failed: {response.status_code}")

if __name__ == "__main__":
    test_collection_mismatch()