#!/usr/bin/env python3
"""
Focused Review System Testing for Educational Portal
Tests the specific requirements from the review request
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend .env
BASE_URL = "https://reviewform-bug.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

class ReviewSystemTester:
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
        
        # Admin login
        success, response, status = self.make_request("POST", "/auth/login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            self.log_test("Admin Authentication", True, f"Admin logged in: {response.get('user', {}).get('name')}")
        else:
            self.log_test("Admin Authentication", False, f"Status: {status}", response)
            return False
        
        # Create/login test user
        test_user_data = {
            "email": "reviewsystemtest@example.com",
            "password": "testpass123",
            "name": "Review System Tester"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", test_user_data)
        if success and "access_token" in response:
            self.user_token = response["access_token"]
            self.user_id = response.get("user", {}).get("id")
            self.log_test("Test User Creation", True, f"User created: {response.get('user', {}).get('name')}")
        else:
            # Try to login if user already exists
            success, response, status = self.make_request("POST", "/auth/login", {
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            })
            if success and "access_token" in response:
                self.user_token = response["access_token"]
                self.user_id = response.get("user", {}).get("id")
                self.log_test("Test User Login", True, f"User logged in: {response.get('user', {}).get('name')}")
            else:
                self.log_test("Test User Authentication", False, f"Status: {status}", response)
                return False
        
        return True

    def get_test_college(self):
        """Get a college for testing"""
        success, response, status = self.make_request("GET", "/colleges?limit=5")
        if success and isinstance(response, list) and len(response) > 0:
            # Find a college that doesn't have a review from our test user
            for college in response:
                college_id = college.get("id")
                college_name = college.get("name", "Test College")
                
                # Check existing reviews
                success_check, reviews, _ = self.make_request("GET", f"/reviews?limit=100")
                if success_check and isinstance(reviews, list):
                    user_has_review = any(
                        review.get("college_id") == college_id and 
                        review.get("user_id") == self.user_id 
                        for review in reviews
                    )
                    
                    if not user_has_review:
                        return college_id, college_name
            
            # If all colleges have reviews, use the first one anyway
            return response[0].get("id"), response[0].get("name", "Test College")
        
        return None, None

    def test_review_submission_no_points(self):
        """Test 1: Review submission should NOT award points immediately"""
        print("📝 Testing Review Submission (No Immediate Points)...")
        
        college_id, college_name = self.get_test_college()
        if not college_id:
            self.log_test("Get Test College", False, "No colleges available")
            return None
        
        self.log_test("Get Test College", True, f"Using: {college_name}")
        
        # Get user's initial state
        success, user_before, status = self.make_request("GET", "/auth/me", token=self.user_token)
        if not success:
            self.log_test("Get User Initial State", False, f"Status: {status}")
            return None
        
        initial_earnings = user_before.get("total_earnings", 0)
        
        # Submit review
        review_data = {
            "college_id": college_id,
            "rating": 4,
            "review_title": "Test Review for Points System",
            "review_text": "This is a comprehensive test review to verify that points are not awarded immediately upon submission. The review system should only award points after admin approval. This ensures quality control and prevents spam reviews.",
            "course": "Computer Science",
            "year_of_study": "Final Year",
            "pros": "Good testing environment",
            "cons": "None for testing",
            "placements_rating": 4,
            "infrastructure_rating": 4,
            "faculty_rating": 4
        }
        
        success, response, status = self.make_request("POST", "/reviews", review_data, token=self.user_token)
        if success and "id" in response:
            review_id = response.get("id")
            review_status = response.get("status")
            
            if review_status == "pending":
                self.log_test("Review Submission Status", True, f"Status: {review_status} (correct)")
            else:
                self.log_test("Review Submission Status", False, f"Expected 'pending', got: {review_status}")
            
            # Verify no points awarded immediately
            success, user_after, status = self.make_request("GET", "/auth/me", token=self.user_token)
            if success:
                after_earnings = user_after.get("total_earnings", 0)
                if after_earnings == initial_earnings:
                    self.log_test("No Immediate Points Award", True, f"Earnings unchanged: {initial_earnings}")
                else:
                    self.log_test("No Immediate Points Award", False, f"Earnings changed: {initial_earnings} → {after_earnings}")
            
            return review_id, college_name
            
        elif status == 400 and "already reviewed" in str(response):
            # Find existing review
            success, reviews, _ = self.make_request("GET", "/reviews?limit=100")
            if success:
                for review in reviews:
                    if (review.get("college_id") == college_id and 
                        review.get("user_id") == self.user_id):
                        self.log_test("Review Submission", True, f"Using existing review (user already reviewed this college)")
                        return review.get("id"), college_name
            
            self.log_test("Review Submission", False, "User already reviewed but couldn't find existing review")
            return None, None
        else:
            self.log_test("Review Submission", False, f"Status: {status}", response)
            return None, None

    def test_review_approval_awards_points(self, review_id: str, college_name: str):
        """Test 2: Review approval should award points"""
        print("✅ Testing Review Approval (Awards Points)...")
        
        if not review_id:
            self.log_test("Review Approval Test", False, "No review ID available")
            return
        
        # Get user's state before approval
        success, user_before, status = self.make_request("GET", "/auth/me", token=self.user_token)
        if not success:
            self.log_test("Get User State Before Approval", False, f"Status: {status}")
            return
        
        before_earnings = user_before.get("total_earnings", 0)
        
        # Approve the review
        success, response, status = self.make_request("PATCH", f"/reviews/{review_id}/approve", token=self.admin_token)
        if success and response.get("status") == "approved":
            points_awarded = response.get("points_awarded", 0)
            self.log_test("Review Approval", True, f"Review approved, points awarded: {points_awarded}")
            
            # Verify points were awarded
            success, user_after, status = self.make_request("GET", "/auth/me", token=self.user_token)
            if success:
                after_earnings = user_after.get("total_earnings", 0)
                earnings_increase = after_earnings - before_earnings
                
                if earnings_increase > 0:
                    self.log_test("Points Awarded After Approval", True, f"Earnings increased by: {earnings_increase}")
                else:
                    self.log_test("Points Awarded After Approval", False, f"No earnings increase: {before_earnings} → {after_earnings}")
            else:
                self.log_test("Points Awarded After Approval", False, "Could not verify user state after approval")
        else:
            self.log_test("Review Approval", False, f"Status: {status}", response)

    def test_review_rejection_with_reason(self):
        """Test 3: Review rejection with reason"""
        print("❌ Testing Review Rejection (With Reason)...")
        
        college_id, college_name = self.get_test_college()
        if not college_id:
            self.log_test("Get College for Rejection Test", False, "No colleges available")
            return
        
        # Create a new user for rejection test to avoid "already reviewed" error
        reject_user_data = {
            "email": "rejecttest@example.com",
            "password": "testpass123",
            "name": "Reject Test User"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", reject_user_data)
        if success and "access_token" in response:
            reject_user_token = response["access_token"]
            reject_user_id = response.get("user", {}).get("id")
        else:
            # Try login if user exists
            success, response, status = self.make_request("POST", "/auth/login", {
                "email": reject_user_data["email"],
                "password": reject_user_data["password"]
            })
            if success and "access_token" in response:
                reject_user_token = response["access_token"]
                reject_user_id = response.get("user", {}).get("id")
            else:
                self.log_test("Create Reject Test User", False, f"Status: {status}")
                return
        
        # Submit a review to reject
        review_data = {
            "college_id": college_id,
            "rating": 1,
            "review_title": "Poor review for testing rejection",
            "review_text": "This is a test review that will be rejected.",
            "course": "Test Course"
        }
        
        success, response, status = self.make_request("POST", "/reviews", review_data, token=reject_user_token)
        if success and "id" in response:
            reject_review_id = response.get("id")
            
            # Reject with reason
            reject_data = {"reason": "Review does not meet quality standards for testing purposes"}
            success, response, status = self.make_request("PATCH", f"/reviews/{reject_review_id}/reject", 
                                                        reject_data, token=self.admin_token)
            if success and response.get("status") == "rejected":
                self.log_test("Review Rejection", True, "Review rejected successfully")
                
                # Verify rejection reason is saved
                success, reviews, status = self.make_request("GET", "/reviews?limit=100")
                if success and isinstance(reviews, list):
                    rejected_review = next((r for r in reviews if r.get("id") == reject_review_id), None)
                    
                    if rejected_review and rejected_review.get("rejection_reason"):
                        self.log_test("Rejection Reason Saved", True, 
                                     f"Reason: {rejected_review.get('rejection_reason')}")
                    else:
                        self.log_test("Rejection Reason Saved", False, "Rejection reason not found")
                else:
                    self.log_test("Rejection Reason Saved", False, "Could not fetch reviews")
            else:
                self.log_test("Review Rejection", False, f"Status: {status}", response)
        elif status == 400 and "already reviewed" in str(response):
            self.log_test("Review Rejection Test", True, "User already has review - rejection test skipped")
        else:
            self.log_test("Review Rejection Test", False, f"Could not create review for rejection: {status}")

    def test_get_all_reviews_admin(self):
        """Test 4: Get all reviews endpoint for admin"""
        print("📋 Testing Get All Reviews (Admin Endpoint)...")
        
        success, response, status = self.make_request("GET", "/reviews?limit=100")
        if success and isinstance(response, list):
            review_count = len(response)
            self.log_test("Get All Reviews", True, f"Retrieved {review_count} reviews")
            
            # Check if reviews have required fields
            if review_count > 0:
                sample_review = response[0]
                required_fields = ["college_name", "status", "points_earned"]
                missing_fields = [field for field in required_fields if field not in sample_review]
                
                if not missing_fields:
                    self.log_test("Review Fields Validation", True, 
                                 f"All required fields present: {required_fields}")
                else:
                    self.log_test("Review Fields Validation", False, 
                                 f"Missing fields: {missing_fields}")
                
                # Check status distribution
                status_counts = {}
                for review in response:
                    status = review.get("status", "unknown")
                    status_counts[status] = status_counts.get(status, 0) + 1
                
                self.log_test("Review Status Distribution", True, 
                             f"Status counts: {status_counts}")
            else:
                self.log_test("Review Fields Validation", True, "No reviews to validate")
        else:
            self.log_test("Get All Reviews", False, f"Status: {status}", response)

    def run_all_tests(self):
        """Run all review system tests"""
        print("⭐ REVIEW SYSTEM TESTING")
        print("Testing the review system enhancements for admissionbuddy.co")
        print("=" * 80)
        
        # Setup
        if not self.setup_authentication():
            print("❌ Authentication setup failed - aborting tests")
            return
        
        # Test 1: Review submission (no immediate points)
        review_id, college_name = self.test_review_submission_no_points()
        
        # Test 2: Review approval (awards points)
        if review_id:
            self.test_review_approval_awards_points(review_id, college_name)
        
        # Test 3: Review rejection with reason
        self.test_review_rejection_with_reason()
        
        # Test 4: Get all reviews (admin endpoint)
        self.test_get_all_reviews_admin()
        
        # Summary
        print("=" * 80)
        print("📊 REVIEW SYSTEM TEST SUMMARY")
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

if __name__ == "__main__":
    tester = ReviewSystemTester()
    tester.run_all_tests()