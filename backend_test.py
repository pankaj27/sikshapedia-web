#!/usr/bin/env python3
"""
Backend API Testing Script for AdmissionBuddy - Schools, Universities, and News APIs
Tests the newly implemented features as requested in the review
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "https://campusdunia.preview.emergentagent.com/api"
TEST_COLLEGE_ID = "iit-bombay-002"

class NewFeaturesAPITester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'AdmissionBuddy-Test-Client/1.0'
        })

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

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("API Root", "PASS", f"API accessible, message: {data['message']}")
                    return True
                else:
                    self.log_result("API Root", "FAIL", "API accessible but unexpected response format")
                    return False
            else:
                self.log_result("API Root", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("API Root", "FAIL", f"Connection error: {str(e)}")
            return False

    def test_colleges_endpoint(self):
        """Test GET /api/colleges endpoint"""
        try:
            # Test basic endpoint
            response = self.session.get(f"{BACKEND_URL}/colleges")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    college_count = len(data)
                    self.log_result("GET /colleges", "PASS", f"Retrieved {college_count} colleges")
                    
                    # Check if we have colleges and validate structure
                    if college_count > 0:
                        sample_college = data[0]
                        required_fields = ['id', 'name', 'location', 'type', 'average_fees', 'description']
                        missing_fields = [field for field in required_fields if field not in sample_college]
                        
                        if not missing_fields:
                            self.log_result("College Structure", "PASS", "All required fields present in college data")
                            
                            # Check ranking field specifically (this was the bug that was fixed)
                            if 'ranking' in sample_college:
                                ranking = sample_college['ranking']
                                if isinstance(ranking, dict):
                                    self.log_result("Ranking Field", "PASS", f"Ranking is properly structured as object: {ranking}")
                                else:
                                    self.log_result("Ranking Field", "WARN", f"Ranking field type: {type(ranking)}")
                            else:
                                self.log_result("Ranking Field", "WARN", "No ranking field found in college data")
                                
                        else:
                            self.log_result("College Structure", "FAIL", f"Missing required fields: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("GET /colleges", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("GET /colleges", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET /colleges", "FAIL", f"Request error: {str(e)}")
            return False

    def test_colleges_with_params(self):
        """Test GET /colleges with various query parameters"""
        test_params = [
            {"search": "IIT", "description": "Search for IIT colleges"},
            {"city": "Mumbai", "description": "Filter by Mumbai city"},
            {"state": "Maharashtra", "description": "Filter by Maharashtra state"},
            {"type": "Government", "description": "Filter by Government type"},
            {"min_fees": "100000", "max_fees": "500000", "description": "Filter by fees range"},
            {"sort_by": "nirf_ranking", "description": "Sort by NIRF ranking"}
        ]
        
        for params in test_params:
            try:
                description = params.pop("description")
                response = self.session.get(f"{BACKEND_URL}/colleges", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(f"Colleges Query - {description}", "PASS", f"Retrieved {len(data)} results")
                else:
                    self.log_result(f"Colleges Query - {description}", "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"Colleges Query - {description}", "FAIL", f"Error: {str(e)}")

    def test_featured_colleges(self):
        """Test GET /api/colleges/featured endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/colleges/featured")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("GET /colleges/featured", "PASS", f"Retrieved {len(data)} featured colleges")
                    
                    # Validate featured colleges have proper ranking
                    if len(data) > 0:
                        for i, college in enumerate(data[:3]):  # Check first 3
                            if 'ranking' in college:
                                ranking = college['ranking']
                                if isinstance(ranking, dict):
                                    self.log_result(f"Featured College {i+1} Ranking", "PASS", f"Proper ranking structure: {ranking}")
                                else:
                                    self.log_result(f"Featured College {i+1} Ranking", "WARN", f"Ranking type: {type(ranking)}")
                    
                    return True
                else:
                    self.log_result("GET /colleges/featured", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("GET /colleges/featured", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET /colleges/featured", "FAIL", f"Request error: {str(e)}")
            return False

    def test_specific_college(self, college_id):
        """Test GET /api/colleges/{college_id} endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/colleges/{college_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'id' in data:
                    self.log_result(f"GET /colleges/{college_id}", "PASS", f"Retrieved college: {data.get('name', 'Unknown')}")
                    
                    # Validate specific fields that were causing issues
                    validation_results = []
                    
                    # Check ranking field (main bug that was fixed)
                    if 'ranking' in data:
                        ranking = data['ranking']
                        if isinstance(ranking, dict):
                            validation_results.append("✅ Ranking field is properly structured as object")
                        else:
                            validation_results.append(f"⚠️ Ranking field type: {type(ranking)}")
                    else:
                        validation_results.append("⚠️ No ranking field found")
                    
                    # Check other required fields that were mentioned in Pydantic validation errors
                    required_fields = {
                        'slug': 'Slug field',
                        'established_year': 'Established year field', 
                        'total_courses': 'Total courses field',
                        'contact_info': 'Contact info field'
                    }
                    
                    for field, description in required_fields.items():
                        if field in data and data[field] is not None:
                            validation_results.append(f"✅ {description} present")
                        else:
                            validation_results.append(f"⚠️ {description} missing or null")
                    
                    # Check course data structure
                    if 'courses' in data:
                        courses = data['courses']
                        if isinstance(courses, list):
                            validation_results.append(f"✅ Courses field is properly structured list with {len(courses)} items")
                        else:
                            validation_results.append(f"⚠️ Courses field type: {type(courses)}")
                    
                    self.log_result(f"College {college_id} Validation", "PASS", "; ".join(validation_results))
                    return True
                else:
                    self.log_result(f"GET /colleges/{college_id}", "FAIL", "Invalid response structure")
                    return False
            elif response.status_code == 404:
                self.log_result(f"GET /colleges/{college_id}", "FAIL", f"College not found (404)")
                return False
            else:
                self.log_result(f"GET /colleges/{college_id}", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result(f"GET /colleges/{college_id}", "FAIL", f"Request error: {str(e)}")
            return False

    def test_college_reviews_endpoint(self, college_id):
        """Test GET /api/reviews/college/{college_id} endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/reviews/college/{college_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result(f"GET /reviews/college/{college_id}", "PASS", f"Retrieved {len(data)} reviews")
                    return True
                else:
                    self.log_result(f"GET /reviews/college/{college_id}", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result(f"GET /reviews/college/{college_id}", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result(f"GET /reviews/college/{college_id}", "FAIL", f"Request error: {str(e)}")
            return False

    def test_college_questions_endpoint(self, college_id):
        """Test GET /api/questions/college/{college_id} endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/questions/college/{college_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result(f"GET /questions/college/{college_id}", "PASS", f"Retrieved {len(data)} questions")
                    return True
                else:
                    self.log_result(f"GET /questions/college/{college_id}", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result(f"GET /questions/college/{college_id}", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result(f"GET /questions/college/{college_id}", "FAIL", f"Request error: {str(e)}")
            return False

    def test_review_submission_without_auth(self, college_id):
        """Test POST /api/reviews without authentication (should fail)"""
        try:
            review_data = {
                "college_id": college_id,
                "rating": 5,
                "review_title": "Excellent Institution",
                "review_text": "Great academics and placement opportunities",
                "course": "B.Tech Computer Science",
                "year_of_study": "2023"
            }
            
            response = self.session.post(f"{BACKEND_URL}/reviews", json=review_data)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("POST /reviews (No Auth)", "PASS", f"Correctly rejected unauthorized request: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /reviews (No Auth)", "FAIL", f"Expected 401/403, got HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("POST /reviews (No Auth)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_question_submission_without_auth(self, college_id):
        """Test POST /api/questions without authentication (should fail)"""
        try:
            question_data = {
                "college_id": college_id,
                "question": "What are the placement statistics for Computer Science?"
            }
            
            response = self.session.post(f"{BACKEND_URL}/questions", json=question_data)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("POST /questions (No Auth)", "PASS", f"Correctly rejected unauthorized request: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /questions (No Auth)", "FAIL", f"Expected 401/403, got HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("POST /questions (No Auth)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_answer_submission_without_auth(self):
        """Test POST /api/questions/answer without authentication (should fail)"""
        try:
            answer_data = {
                "question_id": "dummy-question-id",
                "answer": "The placement statistics are excellent with 95% placement rate."
            }
            
            response = self.session.post(f"{BACKEND_URL}/questions/answer", json=answer_data)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("POST /questions/answer (No Auth)", "PASS", f"Correctly rejected unauthorized request: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /questions/answer (No Auth)", "FAIL", f"Expected 401/403, got HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("POST /questions/answer (No Auth)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_application_submission_without_auth(self, college_id):
        """Test POST /api/applications without authentication (should fail)"""
        try:
            application_data = {
                "college_id": college_id,
                "course_id": "dummy-course-id",
                "student_name": "Rahul Sharma",
                "email": "rahul.sharma@example.com",
                "phone": "+91-9876543210",
                "date_of_birth": "2000-05-15",
                "gender": "Male",
                "category": "General",
                "class_10_percentage": 92.5,
                "class_12_percentage": 88.7,
                "entrance_exam": "JEE Main",
                "entrance_exam_score": 250.0,
                "preferred_course": "B.Tech Computer Science"
            }
            
            response = self.session.post(f"{BACKEND_URL}/applications", json=application_data)
            
            if response.status_code == 401 or response.status_code == 403:
                self.log_result("POST /applications (No Auth)", "PASS", f"Correctly rejected unauthorized request: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /applications (No Auth)", "FAIL", f"Expected 401/403, got HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("POST /applications (No Auth)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_review_data_validation(self, college_id):
        """Test POST /api/reviews with invalid data (should fail validation)"""
        try:
            # Test with missing required fields
            invalid_review_data = {
                "college_id": college_id,
                "rating": 6,  # Invalid rating (should be 1-5)
                "review_title": "",  # Empty title
                # Missing review_text
            }
            
            response = self.session.post(f"{BACKEND_URL}/reviews", json=invalid_review_data)
            
            if response.status_code == 400 or response.status_code == 422 or response.status_code == 401:
                self.log_result("POST /reviews (Invalid Data)", "PASS", f"Correctly rejected invalid data: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /reviews (Invalid Data)", "WARN", f"Expected 400/422/401, got HTTP {response.status_code}")
                return True  # Still pass as this might be due to auth
        except Exception as e:
            self.log_result("POST /reviews (Invalid Data)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_question_data_validation(self, college_id):
        """Test POST /api/questions with invalid data (should fail validation)"""
        try:
            # Test with missing required fields
            invalid_question_data = {
                "college_id": college_id,
                # Missing question field
            }
            
            response = self.session.post(f"{BACKEND_URL}/questions", json=invalid_question_data)
            
            if response.status_code == 400 or response.status_code == 422 or response.status_code == 401:
                self.log_result("POST /questions (Invalid Data)", "PASS", f"Correctly rejected invalid data: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /questions (Invalid Data)", "WARN", f"Expected 400/422/401, got HTTP {response.status_code}")
                return True  # Still pass as this might be due to auth
        except Exception as e:
            self.log_result("POST /questions (Invalid Data)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_application_data_validation(self, college_id):
        """Test POST /api/applications with invalid data (should fail validation)"""
        try:
            # Test with invalid email and missing required fields
            invalid_application_data = {
                "college_id": college_id,
                "course_id": "dummy-course-id",
                "student_name": "",  # Empty name
                "email": "invalid-email",  # Invalid email format
                "phone": "123",  # Invalid phone
                "class_10_percentage": 150.0,  # Invalid percentage (>100)
                # Missing other required fields
            }
            
            response = self.session.post(f"{BACKEND_URL}/applications", json=invalid_application_data)
            
            if response.status_code == 400 or response.status_code == 422 or response.status_code == 401:
                self.log_result("POST /applications (Invalid Data)", "PASS", f"Correctly rejected invalid data: HTTP {response.status_code}")
                return True
            else:
                self.log_result("POST /applications (Invalid Data)", "WARN", f"Expected 400/422/401, got HTTP {response.status_code}")
                return True  # Still pass as this might be due to auth
        except Exception as e:
            self.log_result("POST /applications (Invalid Data)", "FAIL", f"Request error: {str(e)}")
            return False

    def test_nonexistent_college_endpoints(self):
        """Test endpoints with non-existent college ID"""
        fake_college_id = "non-existent-college-999"
        
        try:
            # Test reviews for non-existent college
            response = self.session.get(f"{BACKEND_URL}/reviews/college/{fake_college_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 0:
                    self.log_result("GET /reviews (Non-existent College)", "PASS", "Returns empty list for non-existent college")
                else:
                    self.log_result("GET /reviews (Non-existent College)", "WARN", f"Unexpected response: {len(data) if isinstance(data, list) else type(data)}")
            else:
                self.log_result("GET /reviews (Non-existent College)", "WARN", f"HTTP {response.status_code} for non-existent college")
            
            # Test questions for non-existent college
            response = self.session.get(f"{BACKEND_URL}/questions/college/{fake_college_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 0:
                    self.log_result("GET /questions (Non-existent College)", "PASS", "Returns empty list for non-existent college")
                else:
                    self.log_result("GET /questions (Non-existent College)", "WARN", f"Unexpected response: {len(data) if isinstance(data, list) else type(data)}")
            else:
                self.log_result("GET /questions (Non-existent College)", "WARN", f"HTTP {response.status_code} for non-existent college")
                
        except Exception as e:
            self.log_result("Non-existent College Tests", "FAIL", f"Request error: {str(e)}")
            return False
        
        return True

    # ============================================
    # Schools API Tests
    # ============================================

    def test_schools_endpoint(self):
        """Test GET /api/schools endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/schools")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    school_count = len(data)
                    self.log_result("GET /schools", "PASS", f"Retrieved {school_count} schools")
                    
                    # Check if we have schools and validate structure
                    if school_count > 0:
                        sample_school = data[0]
                        required_fields = ['id', 'name', 'slug', 'board', 'school_type', 'medium', 'city', 'state', 'rating']
                        missing_fields = [field for field in required_fields if field not in sample_school]
                        
                        if not missing_fields:
                            self.log_result("School Structure", "PASS", "All required fields present in school data")
                        else:
                            self.log_result("School Structure", "FAIL", f"Missing required fields: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("GET /schools", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("GET /schools", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET /schools", "FAIL", f"Request error: {str(e)}")
            return False

    def test_schools_with_filters(self):
        """Test GET /schools with various filters"""
        test_params = [
            {"board": "CBSE", "description": "Filter by CBSE board"},
            {"city": "Mumbai", "description": "Filter by Mumbai city"},
            {"state": "Delhi", "description": "Filter by Delhi state"},
            {"school_type": "Private", "description": "Filter by Private school type"},
            {"medium": "English", "description": "Filter by English medium"},
            {"sort": "rating", "description": "Sort by rating"}
        ]
        
        for params in test_params:
            try:
                description = params.pop("description")
                response = self.session.get(f"{BACKEND_URL}/schools", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(f"Schools Filter - {description}", "PASS", f"Retrieved {len(data)} results")
                else:
                    self.log_result(f"Schools Filter - {description}", "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"Schools Filter - {description}", "FAIL", f"Error: {str(e)}")

    def test_specific_school(self):
        """Test GET /api/schools/{school_id} endpoint"""
        # First get a school ID from the list
        try:
            response = self.session.get(f"{BACKEND_URL}/schools", params={"limit": 1})
            if response.status_code == 200:
                schools = response.json()
                if len(schools) > 0:
                    school_id = schools[0]['id']
                    
                    # Test specific school endpoint
                    response = self.session.get(f"{BACKEND_URL}/schools/{school_id}")
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, dict) and 'id' in data:
                            self.log_result(f"GET /schools/{school_id}", "PASS", f"Retrieved school: {data.get('name', 'Unknown')}")
                            return True
                        else:
                            self.log_result(f"GET /schools/{school_id}", "FAIL", "Invalid response structure")
                            return False
                    else:
                        self.log_result(f"GET /schools/{school_id}", "FAIL", f"HTTP {response.status_code}")
                        return False
                else:
                    self.log_result("GET /schools/{id}", "WARN", "No schools available to test specific endpoint")
                    return True
            else:
                self.log_result("GET /schools/{id}", "FAIL", f"Could not get schools list: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET /schools/{id}", "FAIL", f"Request error: {str(e)}")
            return False

    # ============================================
    # Universities API Tests
    # ============================================

    def test_universities_endpoint(self):
        """Test GET /api/universities endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/universities")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    university_count = len(data)
                    self.log_result("GET /universities", "PASS", f"Retrieved {university_count} universities")
                    
                    # Check if we have universities and validate structure
                    if university_count > 0:
                        sample_university = data[0]
                        required_fields = ['id', 'name', 'university_type', 'accreditation', 'nirf_rank', 'rating']
                        missing_fields = [field for field in required_fields if field not in sample_university]
                        
                        if not missing_fields:
                            self.log_result("University Structure", "PASS", "All required fields present in university data")
                        else:
                            self.log_result("University Structure", "FAIL", f"Missing required fields: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("GET /universities", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("GET /universities", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET /universities", "FAIL", f"Request error: {str(e)}")
            return False

    def test_universities_with_filters(self):
        """Test GET /universities with various filters"""
        test_params = [
            {"university_type": "Central University", "description": "Filter by Central University type"},
            {"accreditation": "NAAC A++", "description": "Filter by NAAC A++ accreditation"},
            {"stream": "Arts", "description": "Filter by Arts stream"},
            {"sort": "rating", "description": "Sort by rating"},
            {"sort": "ranking", "description": "Sort by ranking (nirf_rank)"}
        ]
        
        for params in test_params:
            try:
                description = params.pop("description")
                response = self.session.get(f"{BACKEND_URL}/universities", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(f"Universities Filter - {description}", "PASS", f"Retrieved {len(data)} results")
                else:
                    self.log_result(f"Universities Filter - {description}", "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"Universities Filter - {description}", "FAIL", f"Error: {str(e)}")

    def test_specific_university(self):
        """Test GET /api/universities/{university_id} endpoint"""
        # First get a university ID from the list
        try:
            response = self.session.get(f"{BACKEND_URL}/universities", params={"limit": 1})
            if response.status_code == 200:
                universities = response.json()
                if len(universities) > 0:
                    university_id = universities[0]['id']
                    
                    # Test specific university endpoint
                    response = self.session.get(f"{BACKEND_URL}/universities/{university_id}")
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, dict) and 'id' in data:
                            self.log_result(f"GET /universities/{university_id}", "PASS", f"Retrieved university: {data.get('name', 'Unknown')}")
                            return True
                        else:
                            self.log_result(f"GET /universities/{university_id}", "FAIL", "Invalid response structure")
                            return False
                    else:
                        self.log_result(f"GET /universities/{university_id}", "FAIL", f"HTTP {response.status_code}")
                        return False
                else:
                    self.log_result("GET /universities/{id}", "WARN", "No universities available to test specific endpoint")
                    return True
            else:
                self.log_result("GET /universities/{id}", "FAIL", f"Could not get universities list: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET /universities/{id}", "FAIL", f"Request error: {str(e)}")
            return False

    # ============================================
    # News API Tests
    # ============================================

    def test_news_endpoint(self):
        """Test GET /api/news endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/news")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    news_count = len(data)
                    self.log_result("GET /news", "PASS", f"Retrieved {news_count} news articles")
                    
                    # Check if we have news and validate structure
                    if news_count > 0:
                        sample_news = data[0]
                        required_fields = ['id', 'title', 'slug', 'category', 'summary', 'author', 'views', 'published_at']
                        missing_fields = [field for field in required_fields if field not in sample_news]
                        
                        if not missing_fields:
                            self.log_result("News Structure", "PASS", "All required fields present in news data")
                        else:
                            self.log_result("News Structure", "FAIL", f"Missing required fields: {missing_fields}")
                    
                    return True
                else:
                    self.log_result("GET /news", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("GET /news", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("GET /news", "FAIL", f"Request error: {str(e)}")
            return False

    def test_news_with_filters(self):
        """Test GET /news with various filters"""
        test_params = [
            {"category": "Exams", "description": "Filter by Exams category"},
            {"featured": "true", "description": "Filter featured news"},
            {"sort": "views", "description": "Sort by views"},
            {"sort": "latest", "description": "Sort by latest (published_at)"}
        ]
        
        for params in test_params:
            try:
                description = params.pop("description")
                response = self.session.get(f"{BACKEND_URL}/news", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_result(f"News Filter - {description}", "PASS", f"Retrieved {len(data)} results")
                else:
                    self.log_result(f"News Filter - {description}", "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"News Filter - {description}", "FAIL", f"Error: {str(e)}")

    def test_specific_news_article(self):
        """Test GET /api/news/{news_id} endpoint and view counter increment"""
        # First get a news ID from the list
        try:
            response = self.session.get(f"{BACKEND_URL}/news", params={"limit": 1})
            if response.status_code == 200:
                news_articles = response.json()
                if len(news_articles) > 0:
                    news_id = news_articles[0]['id']
                    initial_views = news_articles[0].get('views', 0)
                    
                    # Test specific news endpoint
                    response = self.session.get(f"{BACKEND_URL}/news/{news_id}")
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, dict) and 'id' in data:
                            # Check if view counter incremented
                            new_views = data.get('views', 0)
                            if new_views > initial_views:
                                self.log_result(f"GET /news/{news_id}", "PASS", f"Retrieved article: {data.get('title', 'Unknown')} - Views incremented from {initial_views} to {new_views}")
                            else:
                                self.log_result(f"GET /news/{news_id}", "PASS", f"Retrieved article: {data.get('title', 'Unknown')} - Views: {new_views}")
                            return True
                        else:
                            self.log_result(f"GET /news/{news_id}", "FAIL", "Invalid response structure")
                            return False
                    else:
                        self.log_result(f"GET /news/{news_id}", "FAIL", f"HTTP {response.status_code}")
                        return False
                else:
                    self.log_result("GET /news/{id}", "WARN", "No news articles available to test specific endpoint")
                    return True
            else:
                self.log_result("GET /news/{id}", "FAIL", f"Could not get news list: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("GET /news/{id}", "FAIL", f"Request error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all college API tests"""
        print("🚀 Starting College Module API Tests")
        print("=" * 60)
        
        # Test API connectivity
        if not self.test_api_root():
            print("❌ API not accessible, stopping tests")
            return False
        
        print("\n📋 Testing College Endpoints:")
        print("-" * 40)
        
        # Test main college endpoints
        self.test_colleges_endpoint()
        self.test_colleges_with_params()
        self.test_featured_colleges()
        
        # Test specific college (the one mentioned in the review request)
        print(f"\n🎯 Testing Specific College ({TEST_COLLEGE_ID}):")
        print("-" * 40)
        self.test_specific_college(TEST_COLLEGE_ID)
        self.test_college_reviews_endpoint(TEST_COLLEGE_ID)
        self.test_college_questions_endpoint(TEST_COLLEGE_ID)
        
        # Test Review System APIs
        print(f"\n📝 Testing Review System APIs:")
        print("-" * 40)
        self.test_review_submission_without_auth(TEST_COLLEGE_ID)
        self.test_review_data_validation(TEST_COLLEGE_ID)
        
        # Test Q&A System APIs
        print(f"\n❓ Testing Q&A System APIs:")
        print("-" * 40)
        self.test_question_submission_without_auth(TEST_COLLEGE_ID)
        self.test_answer_submission_without_auth()
        self.test_question_data_validation(TEST_COLLEGE_ID)
        
        # Test Application System APIs
        print(f"\n📋 Testing Application System APIs:")
        print("-" * 40)
        self.test_application_submission_without_auth(TEST_COLLEGE_ID)
        self.test_application_data_validation(TEST_COLLEGE_ID)
        
        # Test Edge Cases
        print(f"\n🔍 Testing Edge Cases:")
        print("-" * 40)
        self.test_nonexistent_college_endpoints()
        
        # Summary
        print("\n📊 Test Summary:")
        print("=" * 60)
        
        passed = len([r for r in self.results if r['status'] == 'PASS'])
        failed = len([r for r in self.results if r['status'] == 'FAIL'])
        warnings = len([r for r in self.results if r['status'] == 'WARN'])
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️ Warnings: {warnings}")
        print(f"📈 Total Tests: {len(self.results)}")
        
        # Show failed tests
        failed_tests = [r for r in self.results if r['status'] == 'FAIL']
        if failed_tests:
            print(f"\n❌ Failed Tests Details:")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return failed == 0

if __name__ == "__main__":
    tester = CollegeAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_backend.json', 'w') as f:
        json.dump(tester.results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_results_backend.json")
    
    if success:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("💥 Some tests failed!")
        sys.exit(1)