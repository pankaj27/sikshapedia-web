#!/usr/bin/env python3
"""
Focused test for User Dashboard APIs
"""

import requests
import json

# Backend URL from frontend .env
BASE_URL = "https://edureview-fixes.preview.emergentagent.com/api"

def make_request(method, endpoint, data=None, token=None):
    """Make HTTP request and return (success, response_data, status_code)"""
    url = f"{BASE_URL}{endpoint}"
    
    # Set headers
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=30)
        else:
            return False, f"Unsupported method: {method}", 400
        
        # Try to parse JSON response
        try:
            response_data = response.json()
        except:
            response_data = response.text
        
        return response.status_code < 400, response_data, response.status_code
        
    except Exception as e:
        return False, f"Request error: {str(e)}", 500

def test_user_dashboard():
    print("👤 Testing User Dashboard APIs...")
    
    # Test 1: Try to create a test user first
    user_data = {
        "email": "testuser.dashboard@example.com",
        "password": "TestPass123",
        "name": "Test Dashboard User"
    }
    
    success, response, status = make_request("POST", "/auth/register", user_data)
    if success and "access_token" in response:
        user_token = response["access_token"]
        user_id = response.get("user", {}).get("id")
        print(f"✅ User registration successful: {response.get('user', {}).get('name')}")
    else:
        # Try to login if user already exists
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        success, response, status = make_request("POST", "/auth/login", login_data)
        if success and "access_token" in response:
            user_token = response["access_token"]
            user_id = response.get("user", {}).get("id")
            print(f"✅ User login successful: {response.get('user', {}).get('name')}")
        else:
            print(f"❌ User login/registration failed: {status} - {response}")
            return
    
    # Test 2: PUT /api/user/profile - Update profile with UPI/Bank details
    profile_update_data = {
        "payment_details": {
            "upi_id": "test@paytm",
            "bank_name": "Test Bank",
            "account_number": "1234567890",
            "ifsc_code": "TEST0001234",
            "account_holder_name": "Nirmalendu Sarkar"
        }
    }
    
    success, response, status = make_request("PUT", "/user/profile", profile_update_data, token=user_token)
    if success and "payment_details" in response:
        payment_details = response.get("payment_details", {})
        print(f"✅ PUT /user/profile successful: UPI={payment_details.get('upi_id')}, Bank={payment_details.get('bank_name')}")
    else:
        print(f"❌ PUT /user/profile failed: {status} - {response}")
    
    # Test 3: GET /api/user/reviews
    success, response, status = make_request("GET", "/user/reviews", token=user_token)
    if success and isinstance(response, list):
        print(f"✅ GET /user/reviews successful: {len(response)} reviews")
        if response:
            review = response[0]
            required_fields = ["institution_type", "serial_number", "college_name"]
            missing = [f for f in required_fields if f not in review]
            if not missing:
                print(f"   ✅ All required fields present: {required_fields}")
            else:
                print(f"   ❌ Missing fields: {missing}")
    else:
        print(f"❌ GET /user/reviews failed: {status} - {response}")
    
    # Test 4: GET /api/user/questions
    success, response, status = make_request("GET", "/user/questions", token=user_token)
    if success and isinstance(response, list):
        print(f"✅ GET /user/questions successful: {len(response)} questions")
        if response:
            question = response[0]
            required_fields = ["college_name", "institution_type", "serial_number"]
            missing = [f for f in required_fields if f not in question]
            if not missing:
                print(f"   ✅ All required fields present: {required_fields}")
            else:
                print(f"   ❌ Missing fields: {missing}")
    else:
        print(f"❌ GET /user/questions failed: {status} - {response}")
    
    # Test 5: GET /api/user/liked
    success, response, status = make_request("GET", "/user/liked", token=user_token)
    if success and isinstance(response, list):
        print(f"✅ GET /user/liked successful: {len(response)} liked items")
        if response:
            liked_item = response[0]
            college = liked_item.get("college", {})
            required_fields = ["institution_type", "serial_number"]
            missing = [f for f in required_fields if f not in college]
            if not missing:
                print(f"   ✅ All required fields present in college: {required_fields}")
            else:
                print(f"   ❌ Missing fields in college: {missing}")
    else:
        print(f"❌ GET /user/liked failed: {status} - {response}")
    
    # Test 6: Test review submission for different institution types
    # Get some institutions first
    success, response, status = make_request("GET", "/colleges?limit=10")
    if success and isinstance(response, list):
        school_id = None
        university_id = None
        
        for inst in response:
            inst_type = inst.get("institution_type", "").lower()
            if inst_type == "school" and not school_id:
                school_id = inst.get("id")
                school_name = inst.get("name")
            elif inst_type == "university" and not university_id:
                university_id = inst.get("id")
                university_name = inst.get("name")
        
        # Test school review
        if school_id:
            school_review_data = {
                "college_id": school_id,
                "rating": 4,
                "review_title": "Great school",
                "review_text": "This is a detailed review of the school. The teachers are excellent and the infrastructure is modern. The academic programs are well-structured and the extracurricular activities are diverse. Overall, I would recommend this school to parents looking for quality education.",
                "course": "Class 10",
                "year_of_study": "Final Year"
            }
            
            success, response, status = make_request("POST", "/reviews", school_review_data, token=user_token)
            if success:
                print(f"✅ POST /reviews (School) successful: {school_name}")
            elif status == 400 and "already reviewed" in str(response):
                print(f"✅ POST /reviews (School) - already reviewed: {school_name}")
            elif "not found" in str(response).lower():
                print(f"❌ POST /reviews (School) - Institute not found error: {response}")
            else:
                print(f"❌ POST /reviews (School) failed: {status} - {response}")
        
        # Test university review
        if university_id:
            university_review_data = {
                "college_id": university_id,
                "rating": 5,
                "review_title": "Excellent university",
                "review_text": "This is a detailed review of the university. The faculty is world-class and the research opportunities are abundant. The campus facilities are state-of-the-art and the placement support is excellent. The university provides a holistic educational experience.",
                "course": "Computer Science",
                "year_of_study": "Final Year"
            }
            
            success, response, status = make_request("POST", "/reviews", university_review_data, token=user_token)
            if success:
                print(f"✅ POST /reviews (University) successful: {university_name}")
            elif status == 400 and "already reviewed" in str(response):
                print(f"✅ POST /reviews (University) - already reviewed: {university_name}")
            elif "not found" in str(response).lower():
                print(f"❌ POST /reviews (University) - Institute not found error: {response}")
            else:
                print(f"❌ POST /reviews (University) failed: {status} - {response}")
    
    # Test 7: GET /api/write-review-settings
    success, response, status = make_request("GET", "/write-review-settings")
    if success and isinstance(response, dict):
        min_chars = response.get("min_review_characters")
        print(f"✅ GET /write-review-settings successful: min_review_characters={min_chars}")
    else:
        print(f"❌ GET /write-review-settings failed: {status} - {response}")

if __name__ == "__main__":
    test_user_dashboard()