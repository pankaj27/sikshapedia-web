#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for College Portal (Sikshapedia)
Tests both old monolithic routes and new modular architecture routes
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://campusmanage-13.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

USER_CREDENTIALS = {
    "email": "testuser@example.com",
    "password": "testpass123",
    "name": "Test User"
}

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.user_token = None
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

    def test_authentication(self):
        """Test authentication endpoints"""
        print("🔐 Testing Authentication Routes...")
        
        # Test 1: Admin Login
        success, response, status = self.make_request("POST", "/auth/admin-login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            self.log_test("Admin Login", True, f"Token received, user: {response.get('user', {}).get('name', 'N/A')}")
        else:
            self.log_test("Admin Login", False, f"Status: {status}", response)
        
        # Test 2: User Registration (create test user)
        success, response, status = self.make_request("POST", "/auth/register", USER_CREDENTIALS)
        if success and "access_token" in response:
            self.user_token = response["access_token"]
            self.log_test("User Registration", True, f"User created: {response.get('user', {}).get('email', 'N/A')}")
        else:
            # User might already exist, try login
            success, response, status = self.make_request("POST", "/auth/login", {
                "email": USER_CREDENTIALS["email"],
                "password": USER_CREDENTIALS["password"]
            })
            if success and "access_token" in response:
                self.user_token = response["access_token"]
                self.log_test("User Login (existing user)", True, f"User logged in: {response.get('user', {}).get('email', 'N/A')}")
            else:
                self.log_test("User Registration/Login", False, f"Status: {status}", response)
        
        # Test 3: Get current user with token
        if self.admin_token:
            success, response, status = self.make_request("GET", "/auth/me", token=self.admin_token)
            if success and "email" in response:
                self.log_test("Get Current User (Admin)", True, f"User: {response.get('email', 'N/A')}")
            else:
                self.log_test("Get Current User (Admin)", False, f"Status: {status}", response)
        
        if self.user_token:
            success, response, status = self.make_request("GET", "/auth/me", token=self.user_token)
            if success and "email" in response:
                self.log_test("Get Current User (Regular)", True, f"User: {response.get('email', 'N/A')}")
            else:
                self.log_test("Get Current User (Regular)", False, f"Status: {status}", response)

    def test_old_college_routes(self):
        """Test old monolithic college routes (critical for frontend)"""
        print("🏫 Testing Old College Routes (Frontend Dependencies)...")
        
        # Test 1: List colleges with limit
        success, response, status = self.make_request("GET", "/colleges?limit=5")
        if success and isinstance(response, list):
            college_count = len(response)
            self.log_test("GET /colleges?limit=5", True, f"Retrieved {college_count} colleges")
            
            # Store first college ID for detail test
            self.test_college_id = response[0].get("id") if response else None
        else:
            self.log_test("GET /colleges?limit=5", False, f"Status: {status}", response)
            self.test_college_id = None
        
        # Test 2: Featured colleges
        success, response, status = self.make_request("GET", "/colleges/featured")
        if success and isinstance(response, list):
            featured_count = len(response)
            self.log_test("GET /colleges/featured", True, f"Retrieved {featured_count} featured colleges")
        else:
            self.log_test("GET /colleges/featured", False, f"Status: {status}", response)
        
        # Test 3: Single college detail
        if self.test_college_id:
            success, response, status = self.make_request("GET", f"/colleges/{self.test_college_id}")
            if success and "id" in response:
                self.log_test(f"GET /colleges/{self.test_college_id}", True, f"College: {response.get('name', 'N/A')}")
            else:
                self.log_test(f"GET /colleges/{self.test_college_id}", False, f"Status: {status}", response)
        else:
            self.log_test("GET /colleges/{id} (skipped)", False, "No college ID available from list")

    def test_new_module_routes(self):
        """Test new modular architecture routes"""
        print("🏗️ Testing New Module Routes (Modular System)...")
        
        # Test 1: Module system info
        success, response, status = self.make_request("GET", "/modules/info")
        if success and "modules" in response:
            module_count = len(response["modules"])
            self.log_test("GET /modules/info", True, f"Found {module_count} modules, version: {response.get('version', 'N/A')}")
        else:
            self.log_test("GET /modules/info", False, f"Status: {status}", response)
        
        # Test 2: Institutions via module (should be same data as /colleges)
        success, response, status = self.make_request("GET", "/institutions?limit=5")
        if success and isinstance(response, list):
            institution_count = len(response)
            self.log_test("GET /institutions?limit=5", True, f"Retrieved {institution_count} institutions via module")
        else:
            self.log_test("GET /institutions?limit=5", False, f"Status: {status}", response)
        
        # Test 3: Institution statistics
        success, response, status = self.make_request("GET", "/institutions/stats")
        if success and isinstance(response, dict):
            total = response.get("total", 0)
            self.log_test("GET /institutions/stats", True, f"Total institutions: {total}")
        else:
            self.log_test("GET /institutions/stats", False, f"Status: {status}", response)
        
        # Test 4: Featured institutions via module
        success, response, status = self.make_request("GET", "/institutions/featured")
        if success and isinstance(response, list):
            featured_count = len(response)
            self.log_test("GET /institutions/featured", True, f"Retrieved {featured_count} featured institutions via module")
        else:
            self.log_test("GET /institutions/featured", False, f"Status: {status}", response)

    def test_other_critical_routes(self):
        """Test other critical routes"""
        print("📚 Testing Other Critical Routes...")
        
        # Test 1: Exams
        success, response, status = self.make_request("GET", "/exams")
        if success and isinstance(response, list):
            exam_count = len(response)
            self.log_test("GET /exams", True, f"Retrieved {exam_count} exams")
        else:
            self.log_test("GET /exams", False, f"Status: {status}", response)
        
        # Test 2: Courses
        success, response, status = self.make_request("GET", "/courses")
        if success and isinstance(response, list):
            course_count = len(response)
            self.log_test("GET /courses", True, f"Retrieved {course_count} courses")
        else:
            self.log_test("GET /courses", False, f"Status: {status}", response)
        
        # Test 3: News
        success, response, status = self.make_request("GET", "/news")
        if success and isinstance(response, list):
            news_count = len(response)
            self.log_test("GET /news", True, f"Retrieved {news_count} news articles")
        else:
            self.log_test("GET /news", False, f"Status: {status}", response)

    def test_admin_protected_routes(self):
        """Test admin-protected routes"""
        print("👑 Testing Admin Protected Routes...")
        
        # Test 1: Admin stats (requires admin token)
        if self.admin_token:
            success, response, status = self.make_request("GET", "/admin/stats", token=self.admin_token)
            if success and isinstance(response, dict):
                total_colleges = response.get("total_colleges", 0)
                self.log_test("GET /admin/stats (with admin token)", True, f"Total colleges: {total_colleges}")
            else:
                self.log_test("GET /admin/stats (with admin token)", False, f"Status: {status}", response)
        else:
            self.log_test("GET /admin/stats (no admin token)", False, "Admin token not available")
        
        # Test 2: Admin stats without token (should fail)
        success, response, status = self.make_request("GET", "/admin/stats")
        if not success and status in [401, 403]:
            self.log_test("GET /admin/stats (no token - should fail)", True, f"Correctly rejected with status {status}")
        else:
            self.log_test("GET /admin/stats (no token - should fail)", False, f"Should have been rejected but got status {status}", response)

    def test_route_consistency(self):
        """Test that old and new routes return consistent data"""
        print("🔄 Testing Route Consistency (Old vs New)...")
        
        # Get data from both old and new routes
        old_success, old_data, _ = self.make_request("GET", "/colleges?limit=5")
        new_success, new_data, _ = self.make_request("GET", "/institutions?limit=5")
        
        if old_success and new_success:
            old_count = len(old_data) if isinstance(old_data, list) else 0
            new_count = len(new_data) if isinstance(new_data, list) else 0
            
            if old_count > 0 and new_count > 0:
                # Check if data structure is similar
                old_sample = old_data[0] if old_data else {}
                new_sample = new_data[0] if new_data else {}
                
                # Check for common fields
                common_fields = set(old_sample.keys()) & set(new_sample.keys())
                total_fields = set(old_sample.keys()) | set(new_sample.keys())
                
                consistency_ratio = len(common_fields) / len(total_fields) if total_fields else 0
                
                if consistency_ratio > 0.7:  # 70% field overlap is good
                    self.log_test("Route Consistency Check", True, 
                                f"Old: {old_count} items, New: {new_count} items, {len(common_fields)}/{len(total_fields)} common fields")
                else:
                    self.log_test("Route Consistency Check", False, 
                                f"Low consistency: {len(common_fields)}/{len(total_fields)} common fields")
            else:
                self.log_test("Route Consistency Check", False, "One or both routes returned empty data")
        else:
            self.log_test("Route Consistency Check", False, "One or both routes failed")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Comprehensive Backend API Testing...")
        print(f"🌐 Base URL: {BASE_URL}")
        print("=" * 60)
        
        # Run test suites in order
        self.test_authentication()
        self.test_old_college_routes()
        self.test_new_module_routes()
        self.test_other_critical_routes()
        self.test_admin_protected_routes()
        self.test_route_consistency()
        
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
        
        print("\n" + "=" * 60)
        return failed_tests == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)