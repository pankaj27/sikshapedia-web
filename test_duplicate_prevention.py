#!/usr/bin/env python3
"""
Focused test for duplicate entry prevention feature
"""

import requests
import json
import time
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://formsaver-2.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "Admin@123"
}

class DuplicatePreventionTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
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
        """Test course duplicate prevention"""
        print("📚 Testing Course Duplicate Prevention...")
        
        # Get existing course
        success, response, status = self.make_request("GET", "/courses?limit=1")
        existing_course_name = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_course_name = response[0].get("name")
            self.log_test("Get Existing Course", True, f"Found: {existing_course_name}")
        
        # Create unique course
        unique_name = f"Test Unique Course {int(time.time())}"
        course_data = {
            "name": unique_name,
            "degree_type": "UG",
            "duration": "4 years"
        }
        
        success, response, status = self.make_request("POST", "/courses", course_data, token=self.admin_token)
        if success and response.get("id"):
            course_id = response.get("id")
            self.log_test("Create Unique Course", True, f"Created: {course_id}")
            
            # Try duplicate
            duplicate_data = {
                "name": unique_name,  # Same name
                "degree_type": "PG",
                "duration": "2 years"
            }
            
            success, response, status = self.make_request("POST", "/courses", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Course Duplicate Prevention", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("Course Duplicate Prevention", False, f"Expected 409, got {status}", response)
        else:
            self.log_test("Create Unique Course", False, f"Status: {status}", response)
        
        # Test with existing course name
        if existing_course_name:
            existing_data = {
                "name": existing_course_name,
                "degree_type": "UG",
                "duration": "4 years"
            }
            
            success, response, status = self.make_request("POST", "/courses", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing Course Duplicate", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("Existing Course Duplicate", False, f"Expected 409, got {status}", response)

    def test_exam_duplicate_prevention(self):
        """Test exam duplicate prevention"""
        print("📝 Testing Exam Duplicate Prevention...")
        
        # Get existing exam
        success, response, status = self.make_request("GET", "/exams?limit=1")
        existing_exam_name = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_exam_name = response[0].get("name")
            self.log_test("Get Existing Exam", True, f"Found: {existing_exam_name}")
        
        # Create unique exam
        unique_name = f"Test Unique Exam {int(time.time())}"
        exam_data = {
            "name": unique_name,
            "conducting_body": "Test Board"
        }
        
        success, response, status = self.make_request("POST", "/exams", exam_data, token=self.admin_token)
        if success and response.get("id"):
            exam_id = response.get("id")
            self.log_test("Create Unique Exam", True, f"Created: {exam_id}")
            
            # Try duplicate
            duplicate_data = {
                "name": unique_name,  # Same name
                "conducting_body": "Different Board"
            }
            
            success, response, status = self.make_request("POST", "/exams", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Exam Duplicate Prevention", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("Exam Duplicate Prevention", False, f"Expected 409, got {status}", response)
        else:
            self.log_test("Create Unique Exam", False, f"Status: {status}", response)
        
        # Test with existing exam name
        if existing_exam_name:
            existing_data = {
                "name": existing_exam_name,
                "conducting_body": "Test Board"
            }
            
            success, response, status = self.make_request("POST", "/exams", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing Exam Duplicate", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("Existing Exam Duplicate", False, f"Expected 409, got {status}", response)

    def test_news_duplicate_prevention(self):
        """Test news duplicate prevention"""
        print("📰 Testing News Duplicate Prevention...")
        
        # Get existing news
        success, response, status = self.make_request("GET", "/news?limit=1")
        existing_news_title = None
        if success and isinstance(response, list) and len(response) > 0:
            existing_news_title = response[0].get("title")
            self.log_test("Get Existing News", True, f"Found: {existing_news_title}")
        else:
            self.log_test("Get Existing News", False, f"No news found or error: {status}")
        
        # Create unique news
        unique_title = f"Test Unique News {int(time.time())}"
        news_data = {
            "title": unique_title,
            "category": "Admission",
            "summary": "Test news summary",
            "content": "Test news content"
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and response.get("id"):
            news_id = response.get("id")
            self.log_test("Create Unique News", True, f"Created: {news_id}")
            
            # Try duplicate
            duplicate_data = {
                "title": unique_title,  # Same title
                "category": "Exams",
                "summary": "Different summary",
                "content": "Different content"
            }
            
            success, response, status = self.make_request("POST", "/news", duplicate_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("News Duplicate Prevention", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("News Duplicate Prevention", False, f"Expected 409, got {status}", response)
        else:
            self.log_test("Create Unique News", False, f"Status: {status}", response)
        
        # Test with existing news title
        if existing_news_title:
            existing_data = {
                "title": existing_news_title,
                "category": "Policy",
                "summary": "Test summary",
                "content": "Test content"
            }
            
            success, response, status = self.make_request("POST", "/news", existing_data, token=self.admin_token)
            if not success and status == 409:
                error_msg = response.get("detail", "") if isinstance(response, dict) else str(response)
                self.log_test("Existing News Duplicate", True, f"409 Conflict: {error_msg}")
            else:
                self.log_test("Existing News Duplicate", False, f"Expected 409, got {status}", response)

    def run_tests(self):
        """Run all duplicate prevention tests"""
        print("🚫 DUPLICATE ENTRY PREVENTION TESTING")
        print("=" * 60)
        
        if not self.authenticate():
            print("❌ Authentication failed, cannot proceed with tests")
            return False
        
        self.test_course_duplicate_prevention()
        self.test_exam_duplicate_prevention()
        self.test_news_duplicate_prevention()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
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
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = DuplicatePreventionTester()
    success = tester.run_tests()
    exit(0 if success else 1)