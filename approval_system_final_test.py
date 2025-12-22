#!/usr/bin/env python3
"""
Final Content Approval System Test - Testing with correct collection mappings
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

BASE_URL = "https://content-blocks-9.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {"email": "admin@admissionbuddy.co", "password": "admin123"}

class FinalApprovalTester:
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
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return response.status_code < 400, response_data, response.status_code
            
        except Exception as e:
            return False, f"Request error: {str(e)}", 500

    def test_admin_login(self):
        """Test admin authentication"""
        print("🔐 Testing Admin Authentication...")
        
        success, response, status = self.make_request("POST", "/auth/admin-login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            self.log_test("Admin Login", True, f"Token received, user: {response.get('user', {}).get('name', 'N/A')}")
            return True
        else:
            self.log_test("Admin Login", False, f"Status: {status}", response)
            return False

    def test_news_approval_complete_workflow(self):
        """Test complete news approval workflow as specified in review request"""
        print("📰 Testing News Approval System (Complete Workflow)...")
        
        if not self.admin_token:
            return
        
        # Test Case 1: News Approval Workflow
        print("   Test Case 1: News Approval Workflow")
        
        # Step 1: Create news article with status "draft"
        news_data = {
            "title": "Breaking: New Education Policy Announced",
            "slug": "new-education-policy-2024",
            "category": "Policy",
            "summary": "Government announces major changes to education policy affecting all students",
            "content": "The Ministry of Education has announced significant changes to the national education policy. These changes will affect admission processes, curriculum design, and evaluation methods across all educational institutions. The new policy emphasizes skill-based learning and practical application of knowledge.",
            "author": "Education Correspondent",
            "tags": ["education", "policy", "government", "students"],
            "status": "draft",
            "published": False
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and "id" in response:
            news_id = response["id"]
            self.log_test("1.1 Create News Article (Draft Status)", True, f"Created news ID: {news_id}, Status: {response.get('status')}")
        else:
            self.log_test("1.1 Create News Article (Draft Status)", False, f"Status: {status}", response)
            return
        
        # Step 2: Submit for review via POST /api/submit-for-review/news/{id}
        success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id}", token=self.admin_token)
        if success and response.get("status") == "pending":
            self.log_test("1.2 Submit for Review", True, "Status changed to 'pending'")
        else:
            self.log_test("1.2 Submit for Review", False, f"Expected 'pending', got: {response.get('status')}", response)
        
        # Step 3: Approve via POST /api/approve/news/{id}
        approval_data = {"action": "approve", "comment": "Content approved - meets quality standards"}
        success, response, status = self.make_request("POST", f"/admin/approve/news/{news_id}", approval_data, token=self.admin_token)
        if success and response.get("status") == "published":
            self.log_test("1.3 Approve News Article", True, "Status changed to 'published'")
        else:
            self.log_test("1.3 Approve News Article", False, f"Expected 'published', got: {response.get('status')}", response)
        
        # Test Case 2: News Rejection Workflow
        print("   Test Case 2: News Rejection Workflow")
        
        # Create another news article
        news_data_2 = {
            "title": "Controversial Topic for Testing Rejection",
            "slug": "controversial-topic-rejection-test",
            "category": "Events",
            "summary": "This article will be rejected for testing purposes",
            "content": "This is test content that will be rejected to demonstrate the rejection workflow.",
            "author": "Test Author",
            "tags": ["test", "rejection"],
            "status": "draft",
            "published": False
        }
        
        success, response, status = self.make_request("POST", "/news", news_data_2, token=self.admin_token)
        if success and "id" in response:
            news_id_2 = response["id"]
            self.log_test("2.1 Create News Article for Rejection", True, f"Created news ID: {news_id_2}")
            
            # Submit for review
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id_2}", token=self.admin_token)
            if success:
                # Reject with reason
                rejection_data = {"action": "reject", "comment": "Content does not meet editorial standards"}
                success, response, status = self.make_request("POST", f"/admin/approve/news/{news_id_2}", rejection_data, token=self.admin_token)
                if success and response.get("status") == "rejected":
                    self.log_test("2.2 Reject News Article", True, "Status changed to 'rejected' with reason saved")
                else:
                    self.log_test("2.2 Reject News Article", False, f"Expected 'rejected', got: {response.get('status')}", response)
            else:
                self.log_test("2.1 Submit for Review (Rejection Test)", False, f"Status: {status}", response)
        else:
            self.log_test("2.1 Create News Article for Rejection", False, f"Status: {status}", response)

    def test_collection_name_issues(self):
        """Test and document collection name issues with courses and exams"""
        print("🔍 Testing Collection Name Issues...")
        
        if not self.admin_token:
            return
        
        # Test Course Collection Issue
        print("   Testing Course Collection Mismatch")
        
        # Try creating course via /courses (goes to 'courses' collection)
        course_data = {
            "name": "Computer Science Engineering",
            "degree_type": "UG", 
            "duration": "4 years",
            "description": "Bachelor of Technology in Computer Science",
            "stream": "Engineering",
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/courses", course_data, token=self.admin_token)
        if success and "id" in response:
            course_id = response["id"]
            self.log_test("Create Course via /courses", True, f"Course ID: {course_id}")
            
            # Try approval workflow (will fail due to collection mismatch)
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/course/{course_id}", token=self.admin_token)
            if status == 404:
                self.log_test("Course Approval System Issue", False, "Collection mismatch: /courses creates in 'courses' but approval looks in 'courses_detail'")
            else:
                self.log_test("Course Approval System", True, "No collection mismatch detected")
        else:
            self.log_test("Create Course via /courses", False, f"Status: {status}", response)
        
        # Try creating course via /courses-detail (goes to 'courses_detailed' collection)
        course_data_detail = {
            "name": "Mechanical Engineering",
            "slug": "mechanical-engineering-test",
            "full_name": "Bachelor of Technology in Mechanical Engineering",
            "description": "Comprehensive mechanical engineering program",
            "degree_type": "UG",
            "stream": "Engineering", 
            "duration": "4 years",
            "average_fees": 75000.0,
            "eligibility": "10+2 with PCM",
            "entrance_exams": ["JEE-MAIN"],
            "career_options": ["Mechanical Engineer"],
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/courses-detail", course_data_detail, token=self.admin_token)
        if success and "id" in response:
            course_detail_id = response["id"]
            self.log_test("Create Course via /courses-detail", True, f"Course ID: {course_detail_id}")
            
            # Try approval workflow (will also fail due to collection mismatch)
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/course/{course_detail_id}", token=self.admin_token)
            if status == 404:
                self.log_test("Course-Detail Approval System Issue", False, "Collection mismatch: /courses-detail creates in 'courses_detailed' but approval looks in 'courses_detail'")
            else:
                self.log_test("Course-Detail Approval System", True, "No collection mismatch detected")
        else:
            self.log_test("Create Course via /courses-detail", False, f"Status: {status}", response)

    def test_pending_approvals_functionality(self):
        """Test pending approvals page functionality"""
        print("📋 Testing Pending Approvals Page...")
        
        if not self.admin_token:
            return
        
        # Create a news article and put it in pending state
        news_data = {
            "title": "Test Article for Pending Approvals",
            "slug": "test-pending-approvals",
            "category": "Admission",
            "summary": "This article should appear in pending approvals list",
            "content": "Test content for pending approvals functionality",
            "author": "Test Admin",
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and "id" in response:
            news_id = response["id"]
            
            # Submit for review to make it pending
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id}", token=self.admin_token)
            if success:
                # Get pending approvals
                success, response, status = self.make_request("GET", "/admin/pending-approvals", token=self.admin_token)
                if success and "items" in response:
                    total_pending = response.get("total", 0)
                    items = response.get("items", [])
                    
                    self.log_test("Get Pending Approvals", True, f"Found {total_pending} pending items")
                    
                    # Check if our test news appears
                    found_test_news = False
                    for item in items:
                        if item.get("id") == news_id and item.get("type") == "news":
                            found_test_news = True
                            break
                    
                    if found_test_news:
                        self.log_test("Test News in Pending List", True, "Test news article found in pending approvals")
                    else:
                        self.log_test("Test News in Pending List", False, "Test news article not found in pending approvals")
                    
                    # Verify response structure
                    if items:
                        sample_item = items[0]
                        required_fields = ["id", "type", "type_label", "name"]
                        has_required_fields = all(field in sample_item for field in required_fields)
                        
                        if has_required_fields:
                            self.log_test("Pending Approvals Response Structure", True, "All required fields present")
                        else:
                            missing = [f for f in required_fields if f not in sample_item]
                            self.log_test("Pending Approvals Response Structure", False, f"Missing fields: {missing}")
                else:
                    self.log_test("Get Pending Approvals", False, f"Status: {status}", response)
            else:
                self.log_test("Submit News for Pending Test", False, f"Status: {status}", response)
        else:
            self.log_test("Create News for Pending Test", False, f"Status: {status}", response)

    def run_comprehensive_test(self):
        """Run comprehensive approval system test"""
        print("🚀 Starting Comprehensive Content Approval System Test")
        print(f"🌐 Base URL: {BASE_URL}")
        print("=" * 70)
        
        # Step 1: Authenticate
        if not self.test_admin_login():
            print("❌ Cannot proceed without admin authentication")
            return False
        
        # Step 2: Test news approval workflows (working)
        self.test_news_approval_complete_workflow()
        
        # Step 3: Test collection name issues (documenting bugs)
        self.test_collection_name_issues()
        
        # Step 4: Test pending approvals functionality
        self.test_pending_approvals_functionality()
        
        # Summary
        print("=" * 70)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Categorize results
        working_features = []
        broken_features = []
        
        for result in self.test_results:
            if "News" in result["test"] and result["success"]:
                working_features.append(result["test"])
            elif not result["success"] and ("Course" in result["test"] or "Exam" in result["test"]):
                broken_features.append(result["test"])
        
        if working_features:
            print(f"\n✅ WORKING FEATURES ({len(working_features)}):")
            for feature in working_features[:5]:  # Show first 5
                print(f"  - {feature}")
        
        if broken_features:
            print(f"\n❌ ISSUES IDENTIFIED ({len(broken_features)}):")
            for issue in broken_features[:5]:  # Show first 5
                print(f"  - {issue}")
        
        print("\n" + "=" * 70)
        return failed_tests == 0

if __name__ == "__main__":
    tester = FinalApprovalTester()
    success = tester.run_comprehensive_test()
    sys.exit(0 if success else 1)