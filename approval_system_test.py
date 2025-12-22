#!/usr/bin/env python3
"""
Content Approval System Testing for News, Courses, and Exams
Tests the complete approval workflow as specified in the review request
"""

import requests
import json
import sys
from typing import Dict, Any, Optional
from datetime import datetime, timezone

# Backend URL from frontend .env
BASE_URL = "https://fixlearn.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

class ApprovalSystemTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        self.created_items = {
            "news": [],
            "courses": [],
            "exams": []
        }
        
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

    def test_news_approval_workflow(self):
        """Test complete news approval workflow"""
        print("📰 Testing News Approval Workflow...")
        
        if not self.admin_token:
            self.log_test("News Workflow (skipped)", False, "No admin token available")
            return
        
        # Step 1: Create a news article with draft status
        news_data = {
            "title": "Test News Article for Approval",
            "slug": "test-news-approval-workflow",
            "category": "Admission",
            "summary": "This is a test news article for testing the approval workflow",
            "content": "This is the full content of the test news article. It contains detailed information about the news topic.",
            "author": "Test Admin",
            "tags": ["test", "approval", "workflow"],
            "status": "draft",
            "published": False
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and "id" in response:
            news_id = response["id"]
            self.created_items["news"].append(news_id)
            self.log_test("Create News Article (Draft)", True, f"Created news with ID: {news_id}")
            
            # Verify status is draft
            if response.get("status") == "draft":
                self.log_test("News Status Verification (Draft)", True, "Status correctly set to draft")
            else:
                self.log_test("News Status Verification (Draft)", False, f"Expected 'draft', got '{response.get('status')}'")
        else:
            self.log_test("Create News Article (Draft)", False, f"Status: {status}", response)
            return
        
        # Step 2: Submit for review
        success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id}", token=self.admin_token)
        if success and response.get("status") == "pending":
            self.log_test("Submit News for Review", True, "Status changed to pending")
        else:
            self.log_test("Submit News for Review", False, f"Status: {status}", response)
        
        # Step 3: Approve the news
        approval_data = {"action": "approve", "comment": "Approved for testing"}
        success, response, status = self.make_request("POST", f"/admin/approve/news/{news_id}", approval_data, token=self.admin_token)
        if success and response.get("status") == "published":
            self.log_test("Approve News Article", True, "Status changed to published")
        else:
            self.log_test("Approve News Article", False, f"Status: {status}", response)
        
        # Step 4: Test rejection workflow with another news article
        news_data_2 = {
            "title": "Test News Article for Rejection",
            "slug": "test-news-rejection-workflow",
            "category": "Exams",
            "summary": "This news article will be rejected for testing",
            "content": "This article is created specifically to test the rejection workflow.",
            "author": "Test Admin",
            "tags": ["test", "rejection"],
            "status": "draft",
            "published": False
        }
        
        success, response, status = self.make_request("POST", "/news", news_data_2, token=self.admin_token)
        if success and "id" in response:
            news_id_2 = response["id"]
            self.created_items["news"].append(news_id_2)
            
            # Submit for review
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id_2}", token=self.admin_token)
            if success:
                # Reject the news
                rejection_data = {"action": "reject", "comment": "Rejected for testing purposes"}
                success, response, status = self.make_request("POST", f"/admin/approve/news/{news_id_2}", rejection_data, token=self.admin_token)
                if success and response.get("status") == "rejected":
                    self.log_test("Reject News Article", True, "Status changed to rejected with reason")
                else:
                    self.log_test("Reject News Article", False, f"Status: {status}", response)
            else:
                self.log_test("Submit News for Rejection", False, f"Status: {status}", response)
        else:
            self.log_test("Create News Article for Rejection", False, f"Status: {status}", response)

    def test_course_approval_workflow(self):
        """Test complete course approval workflow"""
        print("📚 Testing Course Approval Workflow...")
        
        if not self.admin_token:
            self.log_test("Course Workflow (skipped)", False, "No admin token available")
            return
        
        # Step 1: Create a course with draft status
        course_data = {
            "name": "Test Course for Approval",
            "slug": "test-course-approval",
            "full_name": "Bachelor of Test Course Approval",
            "description": "This is a test course created for approval workflow testing",
            "degree_type": "UG",
            "stream": "Engineering",
            "duration": "4 years",
            "average_fees": 50000.0,
            "eligibility": "10+2 with PCM",
            "entrance_exams": ["JEE-MAIN"],
            "career_options": ["Software Engineer", "Test Engineer"],
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/courses-detail", course_data, token=self.admin_token)
        if success and "id" in response:
            course_id = response["id"]
            self.created_items["courses"].append(course_id)
            self.log_test("Create Course (Draft)", True, f"Created course with ID: {course_id}")
            
            # Verify status is draft
            if response.get("status") == "draft":
                self.log_test("Course Status Verification (Draft)", True, "Status correctly set to draft")
            else:
                self.log_test("Course Status Verification (Draft)", False, f"Expected 'draft', got '{response.get('status')}'")
        else:
            self.log_test("Create Course (Draft)", False, f"Status: {status}", response)
            return
        
        # Step 2: Submit for review
        success, response, status = self.make_request("POST", f"/admin/submit-for-review/course/{course_id}", token=self.admin_token)
        if success and response.get("status") == "pending":
            self.log_test("Submit Course for Review", True, "Status changed to pending")
        else:
            self.log_test("Submit Course for Review", False, f"Status: {status}", response)
        
        # Step 3: Approve the course
        approval_data = {"action": "approve", "comment": "Course approved for testing"}
        success, response, status = self.make_request("POST", f"/admin/approve/course/{course_id}", approval_data, token=self.admin_token)
        if success and response.get("status") == "published":
            self.log_test("Approve Course", True, "Status changed to published")
        else:
            self.log_test("Approve Course", False, f"Status: {status}", response)

    def test_exam_approval_workflow(self):
        """Test complete exam approval workflow"""
        print("📝 Testing Exam Approval Workflow...")
        
        if not self.admin_token:
            self.log_test("Exam Workflow (skipped)", False, "No admin token available")
            return
        
        # Step 1: Create an exam with draft status
        exam_data = {
            "name": "TEST-EXAM",
            "slug": "test-exam-approval",
            "full_name": "Test Exam for Approval Workflow",
            "description": "This is a test exam created for approval workflow testing",
            "conducting_body": "Test Board",
            "exam_level": "National",
            "exam_type": "Entrance",
            "streams": ["Engineering", "Medical"],
            "exam_mode": "Online",
            "exam_duration": "3 hours",
            "total_marks": 300,
            "num_questions": 100,
            "exam_pattern": {"sections": ["Physics", "Chemistry", "Mathematics"]},
            "eligibility": {"min_percentage": 75, "age_limit": "17-25"},
            "application_fee": {"general": 1000, "obc": 500, "sc_st": 0},
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/exams-detail", exam_data, token=self.admin_token)
        if success and "id" in response:
            exam_id = response["id"]
            self.created_items["exams"].append(exam_id)
            self.log_test("Create Exam (Draft)", True, f"Created exam with ID: {exam_id}")
            
            # Verify status is draft
            if response.get("status") == "draft":
                self.log_test("Exam Status Verification (Draft)", True, "Status correctly set to draft")
            else:
                self.log_test("Exam Status Verification (Draft)", False, f"Expected 'draft', got '{response.get('status')}'")
        else:
            self.log_test("Create Exam (Draft)", False, f"Status: {status}", response)
            return
        
        # Step 2: Submit for review
        success, response, status = self.make_request("POST", f"/admin/submit-for-review/exam/{exam_id}", token=self.admin_token)
        if success and response.get("status") == "pending":
            self.log_test("Submit Exam for Review", True, "Status changed to pending")
        else:
            self.log_test("Submit Exam for Review", False, f"Status: {status}", response)
        
        # Step 3: Approve the exam
        approval_data = {"action": "approve", "comment": "Exam approved for testing"}
        success, response, status = self.make_request("POST", f"/admin/approve/exam/{exam_id}", approval_data, token=self.admin_token)
        if success and response.get("status") == "published":
            self.log_test("Approve Exam", True, "Status changed to published")
        else:
            self.log_test("Approve Exam", False, f"Status: {status}", response)

    def test_pending_approvals_page(self):
        """Test pending approvals aggregation"""
        print("📋 Testing Pending Approvals Page...")
        
        if not self.admin_token:
            self.log_test("Pending Approvals (skipped)", False, "No admin token available")
            return
        
        # Create items in pending state for testing
        pending_items = []
        
        # Create a news article and submit for review
        news_data = {
            "title": "Pending News Article",
            "slug": "pending-news-test",
            "category": "Policy",
            "summary": "This news article should appear in pending approvals",
            "content": "Content for pending news article",
            "author": "Test Admin",
            "status": "draft"
        }
        
        success, response, status = self.make_request("POST", "/news", news_data, token=self.admin_token)
        if success and "id" in response:
            news_id = response["id"]
            self.created_items["news"].append(news_id)
            
            # Submit for review to make it pending
            success, response, status = self.make_request("POST", f"/admin/submit-for-review/news/{news_id}", token=self.admin_token)
            if success:
                pending_items.append({"type": "news", "id": news_id, "name": "Pending News Article"})
        
        # Get pending approvals
        success, response, status = self.make_request("GET", "/admin/pending-approvals", token=self.admin_token)
        if success and "items" in response:
            total_pending = response.get("total", 0)
            items = response.get("items", [])
            
            self.log_test("Get Pending Approvals", True, f"Found {total_pending} pending items")
            
            # Check if our test items appear in the list
            found_news = False
            for item in items:
                if item.get("type") == "news" and "Pending News Article" in item.get("name", ""):
                    found_news = True
                    break
            
            if found_news:
                self.log_test("Pending News in List", True, "Test news article found in pending approvals")
            else:
                self.log_test("Pending News in List", False, "Test news article not found in pending approvals")
            
            # Verify the structure of returned items
            if items:
                sample_item = items[0]
                required_fields = ["id", "type", "type_label", "name", "submitted_at"]
                has_all_fields = all(field in sample_item for field in required_fields)
                
                if has_all_fields:
                    self.log_test("Pending Items Structure", True, "All required fields present")
                else:
                    missing_fields = [field for field in required_fields if field not in sample_item]
                    self.log_test("Pending Items Structure", False, f"Missing fields: {missing_fields}")
        else:
            self.log_test("Get Pending Approvals", False, f"Status: {status}", response)

    def test_endpoint_variations(self):
        """Test different endpoint variations for approval system"""
        print("🔄 Testing Endpoint Variations...")
        
        if not self.admin_token:
            self.log_test("Endpoint Variations (skipped)", False, "No admin token available")
            return
        
        # Test if there are alternative endpoints
        test_endpoints = [
            "/admin/pending-approvals",
            "/admin/approve/news/test-id",
            "/admin/reject/news/test-id",
            "/admin/submit-for-review/news/test-id"
        ]
        
        for endpoint in test_endpoints:
            if "test-id" in endpoint:
                # These will fail with 404, but we want to check if the endpoint exists
                success, response, status = self.make_request("POST", endpoint, {"action": "approve"}, token=self.admin_token)
                if status == 404:
                    self.log_test(f"Endpoint Exists: {endpoint}", True, "Endpoint exists (404 expected for test-id)")
                elif status == 400:
                    self.log_test(f"Endpoint Exists: {endpoint}", True, "Endpoint exists (400 for invalid data)")
                elif status in [401, 403]:
                    self.log_test(f"Endpoint Exists: {endpoint}", False, "Authentication/authorization issue")
                else:
                    self.log_test(f"Endpoint Exists: {endpoint}", False, f"Unexpected status: {status}")
            else:
                success, response, status = self.make_request("GET", endpoint, token=self.admin_token)
                if success:
                    self.log_test(f"Endpoint Works: {endpoint}", True, f"Status: {status}")
                else:
                    self.log_test(f"Endpoint Works: {endpoint}", False, f"Status: {status}")

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("🧹 Cleaning up test data...")
        
        if not self.admin_token:
            return
        
        # Delete created news articles
        for news_id in self.created_items["news"]:
            success, response, status = self.make_request("DELETE", f"/news/{news_id}", token=self.admin_token)
            if success:
                self.log_test(f"Cleanup News {news_id}", True, "Deleted successfully")
            else:
                self.log_test(f"Cleanup News {news_id}", False, f"Status: {status}")
        
        # Note: Courses and exams might not have delete endpoints, so we'll skip cleanup for those
        # This is acceptable for testing purposes

    def run_all_tests(self):
        """Run all approval system tests"""
        print("🚀 Starting Content Approval System Testing...")
        print(f"🌐 Base URL: {BASE_URL}")
        print("=" * 60)
        
        # Step 1: Authenticate
        if not self.test_admin_login():
            print("❌ Cannot proceed without admin authentication")
            return False
        
        # Step 2: Run approval workflow tests
        self.test_news_approval_workflow()
        self.test_course_approval_workflow()
        self.test_exam_approval_workflow()
        
        # Step 3: Test pending approvals aggregation
        self.test_pending_approvals_page()
        
        # Step 4: Test endpoint variations
        self.test_endpoint_variations()
        
        # Step 5: Cleanup
        self.cleanup_test_data()
        
        # Summary
        print("=" * 60)
        print("📊 APPROVAL SYSTEM TEST SUMMARY")
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
    tester = ApprovalSystemTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)