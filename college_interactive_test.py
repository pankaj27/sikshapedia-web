#!/usr/bin/env python3
"""
College Detail Page Interactive Features Testing
Tests Reviews, Q&A, and Apply Now functionality for IIT Bombay
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "https://collegecms-admin.preview.emergentagent.com/api"
TEST_COLLEGE_ID = "iit-bombay-002"

class CollegeInteractiveFeaturesTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'AdmissionBuddy-Interactive-Test/1.0'
        })
        self.auth_token = None
        self.test_user_id = None

    def log_result(self, test_name, status, details, response_data=None):
        """Log test result"""
        result = {
            'test': test_name,
            'status': status,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.results.append(result)
        
        status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_symbol} {test_name}: {details}")

    def test_user_registration(self):
        """Test user registration for authentication"""
        try:
            # Create a test user
            user_data = {
                "email": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
                "password": "TestPassword123!",
                "name": "Test User for Interactive Features"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=user_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.test_user_id = data["user"]["id"]
                    self.session.headers.update({
                        'Authorization': f'Bearer {self.auth_token}'
                    })
                    self.log_result("User Registration", "PASS", f"Successfully registered test user: {data['user']['name']}")
                    return True
                else:
                    self.log_result("User Registration", "FAIL", "Registration response missing required fields")
                    return False
            else:
                self.log_result("User Registration", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("User Registration", "FAIL", f"Request error: {str(e)}")
            return False

    def test_college_exists(self):
        """Verify the test college exists"""
        try:
            response = self.session.get(f"{BACKEND_URL}/colleges/{TEST_COLLEGE_ID}")
            if response.status_code == 200:
                data = response.json()
                college_name = data.get('name', 'Unknown')
                self.log_result("College Verification", "PASS", f"Test college found: {college_name}")
                return True
            else:
                self.log_result("College Verification", "FAIL", f"Test college not found: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("College Verification", "FAIL", f"Request error: {str(e)}")
            return False

    def test_review_submission(self):
        """Test POST /api/reviews - Submit a new review"""
        try:
            review_data = {
                "college_id": TEST_COLLEGE_ID,
                "rating": 5,
                "review_title": "Excellent Institution",
                "review_text": "Great academics and placement opportunities. The faculty is highly qualified and the infrastructure is world-class.",
                "course": "B.Tech Computer Science",
                "year_of_study": "2023"
            }
            
            response = self.session.post(f"{BACKEND_URL}/reviews", json=review_data)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data.get("college_id") == TEST_COLLEGE_ID:
                    self.log_result("Review Submission", "PASS", f"Successfully submitted review with ID: {data['id']}")
                    return True
                else:
                    self.log_result("Review Submission", "FAIL", "Review response missing required fields")
                    return False
            elif response.status_code == 400:
                # Check if it's because user already reviewed
                error_text = response.text.lower()
                if "already reviewed" in error_text:
                    self.log_result("Review Submission", "PASS", "Correctly prevented duplicate review submission")
                    return True
                else:
                    self.log_result("Review Submission", "FAIL", f"HTTP 400: {response.text}")
                    return False
            else:
                self.log_result("Review Submission", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Review Submission", "FAIL", f"Request error: {str(e)}")
            return False

    def test_get_college_reviews(self):
        """Test GET /api/reviews/college/{college_id} - Get all reviews for a college"""
        try:
            response = self.session.get(f"{BACKEND_URL}/reviews/college/{TEST_COLLEGE_ID}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    review_count = len(data)
                    self.log_result("Get College Reviews", "PASS", f"Retrieved {review_count} reviews for {TEST_COLLEGE_ID}")
                    
                    # Validate review structure if reviews exist
                    if review_count > 0:
                        sample_review = data[0]
                        required_fields = ['id', 'college_id', 'user_name', 'rating', 'review_title', 'review_text']
                        missing_fields = [field for field in required_fields if field not in sample_review]
                        
                        if not missing_fields:
                            self.log_result("Review Structure", "PASS", "Review data structure is valid")
                        else:
                            self.log_result("Review Structure", "WARN", f"Missing fields in review: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("Get College Reviews", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("Get College Reviews", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Get College Reviews", "FAIL", f"Request error: {str(e)}")
            return False

    def test_question_submission(self):
        """Test POST /api/questions - Submit a new question"""
        try:
            question_data = {
                "college_id": TEST_COLLEGE_ID,
                "question": "What are the placement statistics for Computer Science department? How many companies visit for campus recruitment?"
            }
            
            response = self.session.post(f"{BACKEND_URL}/questions", json=question_data)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data.get("college_id") == TEST_COLLEGE_ID:
                    self.question_id = data["id"]  # Store for answer testing
                    self.log_result("Question Submission", "PASS", f"Successfully submitted question with ID: {data['id']}")
                    return True
                else:
                    self.log_result("Question Submission", "FAIL", "Question response missing required fields")
                    return False
            else:
                self.log_result("Question Submission", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Question Submission", "FAIL", f"Request error: {str(e)}")
            return False

    def test_get_college_questions(self):
        """Test GET /api/questions/college/{college_id} - Get all questions for a college"""
        try:
            response = self.session.get(f"{BACKEND_URL}/questions/college/{TEST_COLLEGE_ID}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    question_count = len(data)
                    self.log_result("Get College Questions", "PASS", f"Retrieved {question_count} questions for {TEST_COLLEGE_ID}")
                    
                    # Validate question structure if questions exist
                    if question_count > 0:
                        sample_question = data[0]
                        required_fields = ['id', 'college_id', 'user_name', 'question', 'answers']
                        missing_fields = [field for field in required_fields if field not in sample_question]
                        
                        if not missing_fields:
                            self.log_result("Question Structure", "PASS", "Question data structure is valid")
                            # Store a question ID for answer testing if we don't have one
                            if not hasattr(self, 'question_id'):
                                self.question_id = sample_question['id']
                        else:
                            self.log_result("Question Structure", "WARN", f"Missing fields in question: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("Get College Questions", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("Get College Questions", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Get College Questions", "FAIL", f"Request error: {str(e)}")
            return False

    def test_answer_submission(self):
        """Test POST /api/questions/answer - Submit an answer to a question"""
        if not hasattr(self, 'question_id'):
            self.log_result("Answer Submission", "SKIP", "No question ID available for answer testing")
            return True
            
        try:
            answer_data = {
                "question_id": self.question_id,
                "answer": "The Computer Science department has excellent placement statistics with over 95% placement rate. Top companies like Google, Microsoft, Amazon, and many startups visit for campus recruitment every year."
            }
            
            response = self.session.post(f"{BACKEND_URL}/questions/answer", json=answer_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "answer" in data:
                    self.log_result("Answer Submission", "PASS", f"Successfully submitted answer: {data['message']}")
                    return True
                else:
                    self.log_result("Answer Submission", "FAIL", "Answer response missing required fields")
                    return False
            else:
                self.log_result("Answer Submission", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Answer Submission", "FAIL", f"Request error: {str(e)}")
            return False

    def test_application_submission(self):
        """Test POST /api/applications - Submit college application"""
        try:
            application_data = {
                "college_id": TEST_COLLEGE_ID,
                "course_id": "cs-btech-001",  # Dummy course ID
                "student_name": "Priya Patel",
                "email": "priya.patel@example.com",
                "phone": "+91-9876543210",
                "date_of_birth": "2002-03-15",
                "gender": "Female",
                "category": "General",
                "class_10_percentage": 94.5,
                "class_12_percentage": 91.2,
                "entrance_exam": "JEE Advanced",
                "entrance_exam_score": 285.0,
                "preferred_course": "B.Tech Computer Science and Engineering",
                "message": "I am very interested in pursuing Computer Science at IIT Bombay. I have strong programming skills and have participated in various coding competitions."
            }
            
            response = self.session.post(f"{BACKEND_URL}/applications", json=application_data)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "application_number" in data:
                    self.log_result("Application Submission", "PASS", f"Successfully submitted application: {data['application_number']}")
                    return True
                else:
                    self.log_result("Application Submission", "FAIL", "Application response missing required fields")
                    return False
            else:
                self.log_result("Application Submission", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Application Submission", "FAIL", f"Request error: {str(e)}")
            return False

    def test_user_applications(self):
        """Test GET /api/applications/my - Get user's applications"""
        try:
            response = self.session.get(f"{BACKEND_URL}/applications/my")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    app_count = len(data)
                    self.log_result("Get User Applications", "PASS", f"Retrieved {app_count} applications for current user")
                    
                    # Validate application structure if applications exist
                    if app_count > 0:
                        sample_app = data[0]
                        required_fields = ['id', 'college_id', 'student_name', 'email', 'status', 'application_number']
                        missing_fields = [field for field in required_fields if field not in sample_app]
                        
                        if not missing_fields:
                            self.log_result("Application Structure", "PASS", "Application data structure is valid")
                        else:
                            self.log_result("Application Structure", "WARN", f"Missing fields in application: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("Get User Applications", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("Get User Applications", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Get User Applications", "FAIL", f"Request error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all interactive feature tests"""
        print("🚀 Starting College Detail Page Interactive Features Testing")
        print(f"🎯 Target College: {TEST_COLLEGE_ID} (IIT Bombay)")
        print("=" * 70)
        
        # Setup: User registration and college verification
        print("\n🔧 Setup Phase:")
        print("-" * 30)
        if not self.test_user_registration():
            print("❌ Cannot proceed without user authentication")
            return False
        
        if not self.test_college_exists():
            print("❌ Cannot proceed without valid test college")
            return False
        
        # Test Review System
        print(f"\n📝 Testing Review System:")
        print("-" * 30)
        self.test_review_submission()
        self.test_get_college_reviews()
        
        # Test Q&A System
        print(f"\n❓ Testing Q&A System:")
        print("-" * 30)
        self.test_question_submission()
        self.test_get_college_questions()
        self.test_answer_submission()
        
        # Test Application System
        print(f"\n📋 Testing Application System:")
        print("-" * 30)
        self.test_application_submission()
        self.test_user_applications()
        
        # Summary
        print("\n📊 Test Summary:")
        print("=" * 70)
        
        passed = len([r for r in self.results if r['status'] == 'PASS'])
        failed = len([r for r in self.results if r['status'] == 'FAIL'])
        warnings = len([r for r in self.results if r['status'] == 'WARN'])
        skipped = len([r for r in self.results if r['status'] == 'SKIP'])
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️ Warnings: {warnings}")
        print(f"⏭️ Skipped: {skipped}")
        print(f"📈 Total Tests: {len(self.results)}")
        
        # Show failed tests
        failed_tests = [r for r in self.results if r['status'] == 'FAIL']
        if failed_tests:
            print(f"\n❌ Failed Tests Details:")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return failed == 0

if __name__ == "__main__":
    tester = CollegeInteractiveFeaturesTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/interactive_test_results.json', 'w') as f:
        json.dump(tester.results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/interactive_test_results.json")
    
    if success:
        print("🎉 All interactive feature tests passed!")
        sys.exit(0)
    else:
        print("💥 Some interactive feature tests failed!")
        sys.exit(1)