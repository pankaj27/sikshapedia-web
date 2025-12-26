#!/usr/bin/env python3
"""
Review System Testing - Institute Verification Fix
Tests the specific fix for review and question submission APIs to check all three collections: colleges, schools, and universities
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://edureview-fixes.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "Admin@123"
}

USER_CREDENTIALS = {
    "email": "reviewtester@example.com",
    "password": "testpass123",
    "name": "Review Tester"
}

class ReviewSystemTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.user_token = None
        self.test_results = []
        self.test_review_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{BASE_URL}{endpoint}"
        
        # Set headers
        req_headers = {"Content-Type": "application/json"}
        if headers:
            req_headers.update(headers)
        if token:
            req_headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=req_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == "PATCH":
                response = self.session.patch(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=req_headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}", 400
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.Timeout:
            return False, "Request timeout", 408
        except requests.exceptions.ConnectionError:
            return False, "Connection error", 503
        except Exception as e:
            return False, f"Request error: {str(e)}", 500

    def setup_authentication(self):
        """Setup admin and user authentication"""
        print("🔐 Setting up Authentication...")
        
        # Test 1: Admin login
        success, response, status = self.make_request("POST", "/auth/login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            user_info = response.get('user', {})
            self.log_test("Admin Login", True, 
                         f"Admin logged in: {user_info.get('name', 'N/A')}")
        else:
            self.log_test("Admin Login", False, f"Status: {status}", response)
        
        # Test 2: Create/Login test user
        success, response, status = self.make_request("POST", "/auth/register", USER_CREDENTIALS)
        if success and "access_token" in response:
            self.user_token = response["access_token"]
            user_info = response.get('user', {})
            self.log_test("User Registration", True, 
                         f"User created: {user_info.get('name', 'N/A')}")
        else:
            # Try to login if user already exists
            success, response, status = self.make_request("POST", "/auth/login", {
                "email": USER_CREDENTIALS["email"],
                "password": USER_CREDENTIALS["password"]
            })
            if success and "access_token" in response:
                self.user_token = response["access_token"]
                user_info = response.get('user', {})
                self.log_test("User Login", True, 
                             f"User logged in: {user_info.get('name', 'N/A')}")
            else:
                self.log_test("User Authentication", False, f"Status: {status}", response)

    def test_review_college_verification(self):
        """Test reviewing a COLLEGE - should work"""
        print("🏫 Testing College Review Submission...")
        
        # Get colleges
        success, colleges_response, status = self.make_request("GET", "/colleges?institution_type=College&limit=5")
        if success and isinstance(colleges_response, list) and len(colleges_response) > 0:
            college = colleges_response[0]
            college_id = college.get("id")
            college_name = college.get("name", "Test College")
            
            college_review_data = {
                "college_id": college_id,
                "rating": 4,
                "review_title": "Great college experience",
                "review_text": "This is a detailed review of the college. The faculty is excellent and the infrastructure is modern. The placement opportunities are good and the campus life is vibrant. Overall, I would recommend this college to prospective students.",
                "course": "Computer Science Engineering",
                "graduation_year": "2024",
                "pros": "Good faculty, modern infrastructure, excellent placements",
                "cons": "High fees, limited parking",
                "placements_rating": 4,
                "infrastructure_rating": 5,
                "faculty_rating": 4
            }
            
            success, response, status = self.make_request("POST", "/reviews", college_review_data, token=self.user_token)
            if success and "id" in response:
                review_id = response.get("id")
                self.test_review_ids.append(review_id)
                self.log_test("POST /reviews (College Review)", True, 
                             f"College review submitted successfully for: {college_name}")
            elif status == 400 and "already reviewed" in str(response):
                self.log_test("POST /reviews (College Review)", True, 
                             f"User already reviewed this college: {college_name} (expected behavior)")
            else:
                self.log_test("POST /reviews (College Review)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /reviews (College Review)", False, "No colleges available for testing")

    def test_review_school_verification(self):
        """Test reviewing a SCHOOL - should work with the fix"""
        print("🏫 Testing School Review Submission...")
        
        # Get schools
        success, schools_response, status = self.make_request("GET", "/schools?limit=5")
        if success and isinstance(schools_response, list) and len(schools_response) > 0:
            school = schools_response[0]
            school_id = school.get("id")
            school_name = school.get("name", "Test School")
            
            school_review_data = {
                "college_id": school_id,  # API uses college_id for all institution types
                "rating": 5,
                "review_title": "Excellent school for children",
                "review_text": "This school provides excellent education with dedicated teachers. The infrastructure is modern and the extracurricular activities are well-organized. My child has shown great improvement in academics and overall personality development.",
                "course": "Science Stream",
                "graduation_year": "2024",
                "pros": "Excellent teachers, modern facilities, good extracurricular activities",
                "cons": "Can improve parking facilities",
                "placements_rating": 4,
                "infrastructure_rating": 5,
                "faculty_rating": 5
            }
            
            success, response, status = self.make_request("POST", "/reviews", school_review_data, token=self.user_token)
            if success and "id" in response:
                review_id = response.get("id")
                self.test_review_ids.append(review_id)
                self.log_test("POST /reviews (School Review)", True, 
                             f"School review submitted successfully for: {school_name}")
            elif status == 400 and "already reviewed" in str(response):
                self.log_test("POST /reviews (School Review)", True, 
                             f"User already reviewed this school: {school_name} (expected behavior)")
            else:
                self.log_test("POST /reviews (School Review)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /reviews (School Review)", False, "No schools available for testing")

    def test_review_university_verification(self):
        """Test reviewing a UNIVERSITY - should work with the fix"""
        print("🏛️ Testing University Review Submission...")
        
        # Get universities
        success, universities_response, status = self.make_request("GET", "/universities?limit=5")
        if success and isinstance(universities_response, list) and len(universities_response) > 0:
            university = universities_response[0]
            university_id = university.get("id")
            university_name = university.get("name", "Test University")
            
            university_review_data = {
                "college_id": university_id,  # API uses college_id for all institution types
                "rating": 4,
                "review_title": "Good university with research opportunities",
                "review_text": "This university offers excellent research opportunities and has a diverse student body. The faculty is knowledgeable and the campus facilities are well-maintained. The library resources are extensive and helpful for academic work.",
                "course": "Master of Business Administration",
                "graduation_year": "2024",
                "pros": "Research opportunities, diverse student body, excellent library",
                "cons": "High fees, competitive environment",
                "placements_rating": 4,
                "infrastructure_rating": 4,
                "faculty_rating": 5
            }
            
            success, response, status = self.make_request("POST", "/reviews", university_review_data, token=self.user_token)
            if success and "id" in response:
                review_id = response.get("id")
                self.test_review_ids.append(review_id)
                self.log_test("POST /reviews (University Review)", True, 
                             f"University review submitted successfully for: {university_name}")
            elif status == 400 and "already reviewed" in str(response):
                self.log_test("POST /reviews (University Review)", True, 
                             f"User already reviewed this university: {university_name} (expected behavior)")
            else:
                self.log_test("POST /reviews (University Review)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /reviews (University Review)", False, "No universities available for testing")

    def test_invalid_institute_verification(self):
        """Test with invalid institute ID - should fail with 404"""
        print("❌ Testing Invalid Institute ID...")
        
        invalid_review_data = {
            "college_id": "invalid-institute-id-12345",
            "rating": 3,
            "review_title": "This should fail",
            "review_text": "This review should fail because the institute ID doesn't exist in any collection.",
            "course": "Test Course",
            "graduation_year": "2024"
        }
        
        success, response, status = self.make_request("POST", "/reviews", invalid_review_data, token=self.user_token)
        if not success and status == 404 and "Institute not found" in str(response):
            self.log_test("POST /reviews (Invalid Institute ID)", True, 
                         "Correctly rejected review for non-existent institute")
        else:
            self.log_test("POST /reviews (Invalid Institute ID)", False, 
                         f"Should have returned 404 'Institute not found' but got status {status}", response)

    def test_question_college_verification(self):
        """Test asking a question about a COLLEGE - should work"""
        print("❓ Testing College Question Submission...")
        
        # Get colleges
        success, colleges_response, status = self.make_request("GET", "/colleges?institution_type=College&limit=5")
        if success and isinstance(colleges_response, list) and len(colleges_response) > 0:
            college = colleges_response[0]
            college_id = college.get("id")
            college_name = college.get("name", "Test College")
            
            question_data = {
                "college_id": college_id,
                "question": "What are the admission requirements for Computer Science Engineering?"
            }
            
            success, response, status = self.make_request("POST", "/questions", question_data, token=self.user_token)
            if success and "id" in response:
                self.log_test("POST /questions (College Question)", True, 
                             f"College question submitted successfully for: {college_name}")
            else:
                self.log_test("POST /questions (College Question)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /questions (College Question)", False, "No colleges available for testing")

    def test_question_school_verification(self):
        """Test asking a question about a SCHOOL - should work with the fix"""
        print("❓ Testing School Question Submission...")
        
        # Get schools
        success, schools_response, status = self.make_request("GET", "/schools?limit=5")
        if success and isinstance(schools_response, list) and len(schools_response) > 0:
            school = schools_response[0]
            school_id = school.get("id")
            school_name = school.get("name", "Test School")
            
            question_data = {
                "college_id": school_id,  # API uses college_id for all institution types
                "question": "What are the admission requirements for Class 11 Science stream?"
            }
            
            success, response, status = self.make_request("POST", "/questions", question_data, token=self.user_token)
            if success and "id" in response:
                self.log_test("POST /questions (School Question)", True, 
                             f"School question submitted successfully for: {school_name}")
            else:
                self.log_test("POST /questions (School Question)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /questions (School Question)", False, "No schools available for testing")

    def test_question_university_verification(self):
        """Test asking a question about a UNIVERSITY - should work with the fix"""
        print("❓ Testing University Question Submission...")
        
        # Get universities
        success, universities_response, status = self.make_request("GET", "/universities?limit=5")
        if success and isinstance(universities_response, list) and len(universities_response) > 0:
            university = universities_response[0]
            university_id = university.get("id")
            university_name = university.get("name", "Test University")
            
            question_data = {
                "college_id": university_id,  # API uses college_id for all institution types
                "question": "What are the research opportunities available for MBA students?"
            }
            
            success, response, status = self.make_request("POST", "/questions", question_data, token=self.user_token)
            if success and "id" in response:
                self.log_test("POST /questions (University Question)", True, 
                             f"University question submitted successfully for: {university_name}")
            else:
                self.log_test("POST /questions (University Question)", False, f"Status: {status}", response)
        else:
            self.log_test("POST /questions (University Question)", False, "No universities available for testing")

    def test_question_invalid_institute(self):
        """Test asking a question with invalid institute ID - should fail with 404"""
        print("❌ Testing Invalid Institute ID for Questions...")
        
        invalid_question_data = {
            "college_id": "invalid-institute-id-12345",
            "question": "This question should fail because the institute ID doesn't exist."
        }
        
        success, response, status = self.make_request("POST", "/questions", invalid_question_data, token=self.user_token)
        if not success and status == 404 and "Institute not found" in str(response):
            self.log_test("POST /questions (Invalid Institute ID)", True, 
                         "Correctly rejected question for non-existent institute")
        else:
            self.log_test("POST /questions (Invalid Institute ID)", False, 
                         f"Should have returned 404 'Institute not found' but got status {status}", response)

    def test_review_apis(self):
        """Test review retrieval APIs"""
        print("📋 Testing Review Retrieval APIs...")
        
        # Test 1: Get all reviews
        success, response, status = self.make_request("GET", "/reviews")
        if success and isinstance(response, list):
            self.log_test("GET /reviews", True, f"Retrieved {len(response)} reviews")
        else:
            self.log_test("GET /reviews", False, f"Status: {status}", response)
        
        # Test 2: Get reviews for specific college (if we have test reviews)
        if self.test_review_ids:
            # Get the college ID from one of our test reviews
            success, all_reviews, status = self.make_request("GET", "/reviews?limit=100")
            if success and isinstance(all_reviews, list):
                for review in all_reviews:
                    if review.get("id") in self.test_review_ids:
                        college_id = review.get("college_id")
                        college_name = review.get("college_name", "Unknown")
                        
                        success, college_reviews, status = self.make_request("GET", f"/reviews/college/{college_id}")
                        if success and isinstance(college_reviews, list):
                            self.log_test(f"GET /reviews/college/{college_id}", True, 
                                         f"Retrieved {len(college_reviews)} reviews for {college_name}")
                        else:
                            self.log_test(f"GET /reviews/college/{college_id}", False, 
                                         f"Status: {status}", college_reviews)
                        break

    def test_admin_approval(self):
        """Test admin approval functionality"""
        print("👑 Testing Admin Approval...")
        
        if self.admin_token and self.test_review_ids:
            review_id = self.test_review_ids[0]
            success, response, status = self.make_request("PATCH", f"/reviews/{review_id}/approve", 
                                                        token=self.admin_token)
            if success and response.get("status") == "approved":
                self.log_test("PATCH /reviews/{id}/approve", True, 
                             f"Review approved successfully")
            else:
                self.log_test("PATCH /reviews/{id}/approve", False, f"Status: {status}", response)
        else:
            self.log_test("PATCH /reviews/{id}/approve", False, "Admin token or review ID not available")

    def run_all_tests(self):
        """Run all review system tests"""
        print("🚀 REVIEW SYSTEM TESTING - Institute Verification Fix")
        print("🌐 Base URL:", BASE_URL)
        print("=" * 80)
        
        # Setup
        self.setup_authentication()
        
        if not self.user_token:
            print("❌ Cannot proceed without user authentication")
            return
        
        # Test review submission for all institution types
        self.test_review_college_verification()
        self.test_review_school_verification()
        self.test_review_university_verification()
        self.test_invalid_institute_verification()
        
        # Test question submission for all institution types
        self.test_question_college_verification()
        self.test_question_school_verification()
        self.test_question_university_verification()
        self.test_question_invalid_institute()
        
        # Test review APIs
        self.test_review_apis()
        
        # Test admin functionality
        self.test_admin_approval()
        
        # Summary
        print("=" * 80)
        print("📊 REVIEW SYSTEM TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("=" * 80)
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = ReviewSystemTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)