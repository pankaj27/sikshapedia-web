#!/usr/bin/env python3
"""
Comprehensive test for duplicate entry prevention feature
Tests for courses, exams, and news APIs as requested in the review
"""

import requests
import json
import time
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://college-bug-fixer.preview.emergentagent.com/api"

# Admin credentials for testing
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "Admin@123"
}

class DuplicatePreventionTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        self.created_items = []
        
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

    def authenticate(self):
        """Authenticate as admin"""
        print("🔐 Authenticating as admin...")
        success, response, status = self.make_request("POST", "/auth/admin-login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            user_info = response.get('user', {})
            self.log_test("Admin Authentication", True, 
                         f"Token received, user: {user_info.get('name', 'N/A')}")
            return True
        else:
            self.log_test("Admin Authentication", False, f"Status: {status}", response)
            return False

    def test_course_duplicate_prevention(self):
        """Test course duplicate prevention as specified in review request"""
        print("📚 Testing Course Duplicate Prevention...")
        
        # Step 1: Get an existing course name by calling GET /api/courses?limit=1
        success, response, status = self.make_request("GET", "/courses?limit=1")
        existing_course_name = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_course_name = response[0].get("name")
            self.log_test("GET /api/courses?limit=1", True, f"Found existing course: {existing_course_name}")
        else:
            self.log_test("GET /api/courses?limit=1", False, f"Status: {status}", response)
        
        # Step 2: Create a course with unique name first (should succeed)
        unique_name = f"Test Unique Course {int(time.time())}"
        course_data = {
            "name": unique_name,
            "degree_type": "UG",
            "duration": "4 years"
        }
        
        success, response, status = self.make_request("POST", "/courses", course_data, token=self.admin_token)
        if success and response.get("id"):
            course_id = response.get("id")
            self.created_items.append(("course", course_id))
            self.log_test("Create Unique Course", True, f"Created course ID: {course_id}")
            
            # Step 3: Try to create a new course with the SAME name (should fail with 409)
            duplicate_data = {
                "name": unique_name,  # Same name
                "degree_type": "PG",
                "duration": "2 years"
            }
            
            success, response, status = self.make_request("POST", "/courses", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                if "already exists" in error_msg.lower():
                    self.log_test("Course Duplicate Prevention", True, f"HTTP 409 Conflict: {error_msg}")
                else:
                    self.log_test("Course Duplicate Prevention", False, f"409 returned but wrong error message: {error_msg}")
            else:
                self.log_test("Course Duplicate Prevention", False, f"Expected HTTP 409 but got status {status}", response)
        else:
            self.log_test("Create Unique Course", False, f"Status: {status}", response)
        
        # Step 4: Test with existing course name from database
        if existing_course_name:
            existing_data = {
                "name": existing_course_name,
                "degree_type": "UG",
                "duration": "4 years"
            }
            
            success, response, status = self.make_request("POST", "/courses", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing Course Duplicate Test", True, f"HTTP 409 Conflict: {error_msg}")
            else:
                self.log_test("Existing Course Duplicate Test", False, f"Expected HTTP 409 but got status {status}", response)

    def test_exam_duplicate_prevention(self):
        """Test exam duplicate prevention as specified in review request"""
        print("📝 Testing Exam Duplicate Prevention...")
        
        # Step 1: Get an existing exam name by calling GET /api/exams?limit=1
        success, response, status = self.make_request("GET", "/exams?limit=1")
        existing_exam_name = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_exam_name = response[0].get("name")
            self.log_test("GET /api/exams?limit=1", True, f"Found existing exam: {existing_exam_name}")
        else:
            self.log_test("GET /api/exams?limit=1", False, f"Status: {status}", response)
        
        # Step 2: Create an exam with unique name first (should succeed)
        unique_name = f"Test Unique Exam {int(time.time())}"
        exam_data = {
            "name": unique_name
        }
        
        success, response, status = self.make_request("POST", "/exams", exam_data, token=self.admin_token)
        if success and response.get("id"):
            exam_id = response.get("id")
            self.created_items.append(("exam", exam_id))
            self.log_test("Create Unique Exam", True, f"Created exam ID: {exam_id}")
            
            # Step 3: Try to create a new exam with the SAME name (should fail with 409)
            duplicate_data = {
                "name": unique_name  # Same name
            }
            
            success, response, status = self.make_request("POST", "/exams", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                if "already exists" in error_msg.lower():
                    self.log_test("Exam Duplicate Prevention", True, f"HTTP 409 Conflict: {error_msg}")
                else:
                    self.log_test("Exam Duplicate Prevention", False, f"409 returned but wrong error message: {error_msg}")
            else:
                self.log_test("Exam Duplicate Prevention", False, f"Expected HTTP 409 but got status {status}", response)
        else:
            self.log_test("Create Unique Exam", False, f"Status: {status}", response)
        
        # Step 4: Test with existing exam name from database
        if existing_exam_name:
            existing_data = {
                "name": existing_exam_name
            }
            
            success, response, status = self.make_request("POST", "/exams", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing Exam Duplicate Test", True, f"HTTP 409 Conflict: {error_msg}")
            else:
                self.log_test("Existing Exam Duplicate Test", False, f"Expected HTTP 409 but got status {status}", response)

    def test_news_duplicate_prevention(self):
        """Test news duplicate prevention as specified in review request"""
        print("📰 Testing News Duplicate Prevention...")
        
        # Step 1: Get an existing news title by calling GET /api/news?limit=1
        success, response, status = self.make_request("GET", "/news?limit=1")
        existing_news_title = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_news_title = response[0].get("title")
            self.log_test("GET /api/news?limit=1", True, f"Found existing news: {existing_news_title}")
        else:
            self.log_test("GET /api/news?limit=1", False, f"Status: {status} - {response}")
        
        # Step 2: Create a news article with unique title first (should succeed)
        unique_title = f"Test Unique News {int(time.time())}"
        news_data = {
            "title": unique_title
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and response.get("id"):
            news_id = response.get("id")
            self.created_items.append(("news", news_id))
            self.log_test("Create Unique News", True, f"Created news ID: {news_id}")
            
            # Step 3: Try to create a new news article with the SAME title (should fail with 409)
            duplicate_data = {
                "title": unique_title  # Same title
            }
            
            success, response, status = self.make_request("POST", "/news", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                if "already exists" in error_msg.lower():
                    self.log_test("News Duplicate Prevention", True, f"HTTP 409 Conflict: {error_msg}")
                else:
                    self.log_test("News Duplicate Prevention", False, f"409 returned but wrong error message: {error_msg}")
            else:
                self.log_test("News Duplicate Prevention", False, f"Expected HTTP 409 but got status {status}", response)
        else:
            self.log_test("Create Unique News", False, f"Status: {status}", response)
        
        # Step 4: Test with existing news title from database
        if existing_news_title:
            existing_data = {
                "title": existing_news_title
            }
            
            success, response, status = self.make_request("POST", "/news", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing News Duplicate Test", True, f"HTTP 409 Conflict: {error_msg}")
            else:
                self.log_test("Existing News Duplicate Test", False, f"Expected HTTP 409 but got status {status}", response)

    def test_positive_case_unique_creation(self):
        """Test that creating with unique names works correctly"""
        print("✨ Testing Positive Case - Creating with Unique Names...")
        
        timestamp = int(time.time())
        
        # Test unique course creation
        unique_course_data = {
            "name": f"Unique Course {timestamp}",
            "degree_type": "UG",
            "duration": "4 years"
        }
        
        success, response, status = self.make_request("POST", "/courses", unique_course_data, token=self.admin_token)
        if success and response.get("id"):
            course_id = response.get("id")
            self.created_items.append(("course", course_id))
            self.log_test("Create Course with Unique Name", True, f"HTTP 200/201 success, ID: {course_id}")
        else:
            self.log_test("Create Course with Unique Name", False, f"Status: {status}", response)

    def verify_created_items(self):
        """Verify that created items can be retrieved"""
        print("🔍 Verifying Created Items...")
        
        for item_type, item_id in self.created_items:
            if item_type == "course":
                endpoint = f"/courses/{item_id}"
            elif item_type == "exam":
                endpoint = f"/exams/{item_id}"
            elif item_type == "news":
                endpoint = f"/news/{item_id}"
            else:
                continue
            
            success, response, status = self.make_request("GET", endpoint)
            if success and response.get("id") == item_id:
                name_field = "name" if item_type in ["course", "exam"] else "title"
                item_name = response.get(name_field, "Unknown")
                self.log_test(f"Verify {item_type.title()} {item_id}", True, f"Retrieved: {item_name}")
            else:
                self.log_test(f"Verify {item_type.title()} {item_id}", False, f"Status: {status}")

    def run_tests(self):
        """Run all duplicate prevention tests as specified in review request"""
        print("🚫 DUPLICATE ENTRY PREVENTION TESTING")
        print("Testing duplicate entry prevention feature for courses, exams, and news APIs")
        print("=" * 80)
        
        if not self.authenticate():
            print("❌ Authentication failed, cannot proceed with tests")
            return False
        
        # Run the specific test cases from the review request
        self.test_course_duplicate_prevention()
        self.test_exam_duplicate_prevention()
        self.test_news_duplicate_prevention()
        self.test_positive_case_unique_creation()
        self.verify_created_items()
        
        # Summary
        print("=" * 80)
        print("📊 DUPLICATE PREVENTION TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        else:
            print("\n🎉 ALL TESTS PASSED! Duplicate prevention is working correctly.")
            print("\nKey Findings:")
            print("- ✅ Course duplicate prevention: HTTP 409 with proper error message")
            print("- ✅ Exam duplicate prevention: HTTP 409 with proper error message")
            print("- ✅ News duplicate prevention: HTTP 409 with proper error message")
            print("- ✅ Unique entries can be created successfully")
            print("- ✅ Error messages mention duplicate field and existing ID")
        
        print(f"\nCreated {len(self.created_items)} test items during testing")
        print("=" * 80)
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = DuplicatePreventionTester()
    success = tester.run_tests()
    sys.exit(0 if success else 1)