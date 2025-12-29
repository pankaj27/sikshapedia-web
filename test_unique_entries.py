#!/usr/bin/env python3
"""
Test positive cases for duplicate prevention - ensuring unique entries work
"""

import requests
import json
import time

BASE_URL = "https://edu-form-saver.preview.emergentagent.com/api"

ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "Admin@123"
}

def authenticate():
    """Get admin token"""
    response = requests.post(f"{BASE_URL}/auth/admin-login", json=ADMIN_CREDENTIALS)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def test_unique_entries():
    """Test that unique entries can be created successfully"""
    token = authenticate()
    if not token:
        print("❌ Authentication failed")
        return
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    timestamp = int(time.time())
    
    print("🧪 Testing Unique Entry Creation...")
    
    # Test unique course creation
    course_data = {
        "name": f"Unique Test Course {timestamp}",
        "degree_type": "UG",
        "duration": "4 years",
        "description": "A unique test course"
    }
    
    response = requests.post(f"{BASE_URL}/courses", json=course_data, headers=headers)
    if response.status_code in [200, 201]:
        course_id = response.json().get("id")
        print(f"✅ Unique Course Created: {course_id}")
    else:
        print(f"❌ Course Creation Failed: {response.status_code} - {response.text}")
    
    # Test unique exam creation
    exam_data = {
        "name": f"Unique Test Exam {timestamp}",
        "conducting_body": "Test Board",
        "exam_level": "National"
    }
    
    response = requests.post(f"{BASE_URL}/exams", json=exam_data, headers=headers)
    if response.status_code in [200, 201]:
        exam_id = response.json().get("id")
        print(f"✅ Unique Exam Created: {exam_id}")
    else:
        print(f"❌ Exam Creation Failed: {response.status_code} - {response.text}")
    
    # Test unique news creation
    news_data = {
        "title": f"Unique Test News {timestamp}",
        "category": "Admission",
        "summary": "A unique test news article",
        "content": "This is unique test content"
    }
    
    response = requests.post(f"{BASE_URL}/news", json=news_data, headers=headers)
    if response.status_code in [200, 201]:
        news_id = response.json().get("id")
        print(f"✅ Unique News Created: {news_id}")
    else:
        print(f"❌ News Creation Failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_unique_entries()