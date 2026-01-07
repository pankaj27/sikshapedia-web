#!/usr/bin/env python3
"""
Test specifically for the admin college form accreditations validation fix
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://college-bug-fixer.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

class AccreditationsAPITester:
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

    def test_authentication(self):
        """Test admin authentication"""
        print("🔐 Testing Admin Authentication...")
        
        # Test admin login
        success, response, status = self.make_request("POST", "/auth/admin-login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            user_info = response.get('user', {})
            self.log_test("Admin Login", True, 
                         f"Token received, user: {user_info.get('name', 'N/A')}, role: {user_info.get('role', 'N/A')}")
        else:
            self.log_test("Admin Login", False, f"Status: {status}", response)

    def test_admin_college_accreditations_fix(self):
        """Test the fix for admin college form accreditations validation error"""
        print("🏫 Testing Admin College Accreditations Fix...")
        
        if not self.admin_token:
            self.log_test("Admin College Accreditations Fix", False, "No admin token available")
            return
        
        # Test data for creating a college with accreditations
        college_data = {
            "name": "Test College for Accreditation Bug",
            "slug": "test-college-accreditation-bug",
            "location": {
                "state": "Maharashtra",
                "city": "Mumbai",
                "address": "Test Address, Mumbai",
                "pincode": "400001"
            },
            "established_year": 2020,
            "type": "Government",
            "affiliation": "University of Mumbai",
            "nirf_ranking": None,
            "average_fees": 50000.0,
            "courses": [],
            "facilities": ["Library", "Computer Lab", "Sports Complex"],
            "contact_info": {
                "phone": "+91-9876543210",
                "email": "info@testcollege.edu.in",
                "website": "https://testcollege.edu.in"
            },
            "logo_url": "https://via.placeholder.com/200x200?text=Test+College",
            "logo_title": "Test College Logo",
            "logo_alt": "Test College for Accreditation Bug Logo",
            "banner_url": "https://via.placeholder.com/800x400?text=Test+College+Banner",
            "banner_title": "Test College Banner",
            "banner_alt": "Test College Campus Banner",
            "images": [],
            "description": "This is a test college created to verify the accreditations field validation fix.",
            "highlights": ["Quality Education", "Experienced Faculty", "Modern Infrastructure"],
            "accreditations": ["NAAC A++", "NBA Accredited", "UGC Recognized"],  # This should be List[str]
            "placement_stats": []
        }
        
        # Test 1: Create college with correct accreditations format (List[str])
        success, response, status = self.make_request("POST", "/colleges", college_data, token=self.admin_token)
        if success and "id" in response:
            college_id = response["id"]
            college_name = response.get("name", "Unknown")
            accreditations = response.get("accreditations", [])
            
            # Verify accreditations are stored correctly
            if isinstance(accreditations, list) and all(isinstance(acc, str) for acc in accreditations):
                self.log_test("Create College with List[str] Accreditations", True, 
                             f"College created successfully: {college_name}, Accreditations: {accreditations}")
                self.test_college_id = college_id
            else:
                self.log_test("Create College with List[str] Accreditations", False, 
                             f"Accreditations not stored as List[str]: {type(accreditations)}")
                self.test_college_id = college_id
        else:
            self.log_test("Create College with List[str] Accreditations", False, 
                         f"Status: {status}", response)
            self.test_college_id = None
        
        # Test 2: Verify the created college can be retrieved
        if self.test_college_id:
            success, response, status = self.make_request("GET", f"/colleges/{self.test_college_id}")
            if success and "id" in response:
                retrieved_accreditations = response.get("accreditations", [])
                if retrieved_accreditations == college_data["accreditations"]:
                    self.log_test("Retrieve College with Accreditations", True, 
                                 f"Accreditations retrieved correctly: {retrieved_accreditations}")
                else:
                    self.log_test("Retrieve College with Accreditations", False, 
                                 f"Accreditations mismatch. Expected: {college_data['accreditations']}, Got: {retrieved_accreditations}")
            else:
                self.log_test("Retrieve College with Accreditations", False, f"Status: {status}", response)
        
        # Test 3: Test with invalid accreditations format (should fail validation)
        invalid_college_data = college_data.copy()
        invalid_college_data["name"] = "Test College Invalid Accreditations"
        invalid_college_data["slug"] = "test-college-invalid-accreditations"
        # This is the old format that was causing the bug - array of objects instead of strings
        invalid_college_data["accreditations"] = [
            {"name": "NAAC", "level": "A++", "description": ""},
            {"name": "NBA", "level": "Accredited", "description": ""}
        ]
        
        success, response, status = self.make_request("POST", "/colleges", invalid_college_data, token=self.admin_token)
        if not success and status == 422:  # Validation error
            # Check if the error message mentions accreditations validation
            error_detail = str(response)
            if "accreditations" in error_detail.lower() and "string" in error_detail.lower():
                self.log_test("Reject Invalid Accreditations Format", True, 
                             f"Correctly rejected array of objects format with validation error")
            else:
                self.log_test("Reject Invalid Accreditations Format", True, 
                             f"Rejected with validation error (status 422)")
        else:
            self.log_test("Reject Invalid Accreditations Format", False, 
                         f"Should have been rejected but got status {status}", response)
        
        # Test 4: Test with empty accreditations (should be allowed)
        empty_accreditations_data = college_data.copy()
        empty_accreditations_data["name"] = "Test College Empty Accreditations"
        empty_accreditations_data["slug"] = "test-college-empty-accreditations"
        empty_accreditations_data["accreditations"] = []
        
        success, response, status = self.make_request("POST", "/colleges", empty_accreditations_data, token=self.admin_token)
        if success and "id" in response:
            empty_accreditations = response.get("accreditations", [])
            if isinstance(empty_accreditations, list) and len(empty_accreditations) == 0:
                self.log_test("Create College with Empty Accreditations", True, 
                             f"College created successfully with empty accreditations list")
            else:
                self.log_test("Create College with Empty Accreditations", False, 
                             f"Empty accreditations not handled correctly: {empty_accreditations}")
        else:
            self.log_test("Create College with Empty Accreditations", False, 
                         f"Status: {status}", response)
        
        # Test 5: Test updating college accreditations
        if self.test_college_id:
            update_data = {
                "accreditations": ["NAAC A++", "NBA Accredited", "UGC Recognized", "AICTE Approved"]
            }
            
            success, response, status = self.make_request("PUT", f"/colleges/{self.test_college_id}", 
                                                        update_data, token=self.admin_token)
            if success and "accreditations" in response:
                updated_accreditations = response.get("accreditations", [])
                if updated_accreditations == update_data["accreditations"]:
                    self.log_test("Update College Accreditations", True, 
                                 f"Accreditations updated successfully: {updated_accreditations}")
                else:
                    self.log_test("Update College Accreditations", False, 
                                 f"Accreditations not updated correctly. Expected: {update_data['accreditations']}, Got: {updated_accreditations}")
            else:
                self.log_test("Update College Accreditations", False, f"Status: {status}", response)
        
        # Test 6: Verify accreditations field in college listing
        success, response, status = self.make_request("GET", "/colleges?limit=5")
        if success and isinstance(response, list):
            # Check if any college has accreditations field
            colleges_with_accreditations = 0
            for college in response:
                if "accreditations" in college:
                    accreditations = college["accreditations"]
                    if isinstance(accreditations, list) and all(isinstance(acc, str) for acc in accreditations):
                        colleges_with_accreditations += 1
            
            if colleges_with_accreditations > 0:
                self.log_test("Accreditations in College Listing", True, 
                             f"Found {colleges_with_accreditations} colleges with properly formatted accreditations")
            else:
                self.log_test("Accreditations in College Listing", True, 
                             "No colleges with accreditations found (acceptable)")
        else:
            self.log_test("Accreditations in College Listing", False, f"Status: {status}", response)

    def run_tests(self):
        """Run accreditations tests"""
        print("🚀 Testing Admin College Accreditations Fix...")
        print(f"🌐 Testing against: {BASE_URL}")
        print("=" * 80)
        
        # Test authentication first
        self.test_authentication()
        
        # Test accreditations fix
        self.test_admin_college_accreditations_fix()
        
        # Print summary
        print("=" * 80)
        print("📊 TEST SUMMARY")
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
        
        print("\n" + "=" * 60)
        return failed_tests == 0

if __name__ == "__main__":
    tester = AccreditationsAPITester()
    success = tester.run_tests()
    sys.exit(0 if success else 1)