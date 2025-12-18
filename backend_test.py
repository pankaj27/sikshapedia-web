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
BASE_URL = "https://learnhub-647.preview.emergentagent.com/api"

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

    def test_seo_url_filtering(self):
        """Test SEO-friendly URL structure filtering functionality"""
        print("🔍 Testing SEO URL Filtering (New Implementation)...")
        
        # Test 1: Filter by institution_type = College
        success, response, status = self.make_request("GET", "/colleges?institution_type=College")
        if success and isinstance(response, list):
            college_count = len(response)
            # Check if all returned items are colleges
            all_colleges = all(item.get("institution_type") == "College" for item in response if "institution_type" in item)
            if all_colleges or college_count == 0:  # Empty result is also valid
                self.log_test("Filter by institution_type=College", True, f"Retrieved {college_count} colleges")
            else:
                self.log_test("Filter by institution_type=College", False, "Some non-college institutions returned")
        else:
            self.log_test("Filter by institution_type=College", False, f"Status: {status}", response)
        
        # Test 2: Filter by institution_type = University
        success, response, status = self.make_request("GET", "/colleges?institution_type=University")
        if success and isinstance(response, list):
            university_count = len(response)
            all_universities = all(item.get("institution_type") == "University" for item in response if "institution_type" in item)
            if all_universities or university_count == 0:
                self.log_test("Filter by institution_type=University", True, f"Retrieved {university_count} universities")
            else:
                self.log_test("Filter by institution_type=University", False, "Some non-university institutions returned")
        else:
            self.log_test("Filter by institution_type=University", False, f"Status: {status}", response)
        
        # Test 3: Filter by state = Delhi
        success, response, status = self.make_request("GET", "/colleges?state=Delhi")
        if success and isinstance(response, list):
            delhi_count = len(response)
            # Check if all returned items are from Delhi
            delhi_institutions = []
            for item in response:
                location = item.get("location", {})
                if isinstance(location, dict) and location.get("state") == "Delhi":
                    delhi_institutions.append(item)
                elif isinstance(location, str) and "Delhi" in location:
                    delhi_institutions.append(item)
            
            if len(delhi_institutions) == delhi_count or delhi_count == 0:
                self.log_test("Filter by state=Delhi", True, f"Retrieved {delhi_count} Delhi institutions")
            else:
                self.log_test("Filter by state=Delhi", False, f"Only {len(delhi_institutions)}/{delhi_count} are from Delhi")
        else:
            self.log_test("Filter by state=Delhi", False, f"Status: {status}", response)
        
        # Test 4: Filter by state = Karnataka
        success, response, status = self.make_request("GET", "/colleges?state=Karnataka")
        if success and isinstance(response, list):
            karnataka_count = len(response)
            self.log_test("Filter by state=Karnataka", True, f"Retrieved {karnataka_count} Karnataka institutions")
        else:
            self.log_test("Filter by state=Karnataka", False, f"Status: {status}", response)
        
        # Test 5: Filter by city = New Delhi
        success, response, status = self.make_request("GET", "/colleges?city=New Delhi")
        if success and isinstance(response, list):
            new_delhi_count = len(response)
            self.log_test("Filter by city=New Delhi", True, f"Retrieved {new_delhi_count} New Delhi institutions")
        else:
            self.log_test("Filter by city=New Delhi", False, f"Status: {status}", response)
        
        # Test 6: Filter by city = Bangalore
        success, response, status = self.make_request("GET", "/colleges?city=Bangalore")
        if success and isinstance(response, list):
            bangalore_count = len(response)
            self.log_test("Filter by city=Bangalore", True, f"Retrieved {bangalore_count} Bangalore institutions")
        else:
            self.log_test("Filter by city=Bangalore", False, f"Status: {status}", response)
        
        # Test 7: Filter by stream = Engineering
        success, response, status = self.make_request("GET", "/colleges?stream=Engineering")
        if success and isinstance(response, list):
            engineering_count = len(response)
            self.log_test("Filter by stream=Engineering", True, f"Retrieved {engineering_count} Engineering institutions")
        else:
            self.log_test("Filter by stream=Engineering", False, f"Status: {status}", response)
        
        # Test 8: Filter by stream = Medical
        success, response, status = self.make_request("GET", "/colleges?stream=Medical")
        if success and isinstance(response, list):
            medical_count = len(response)
            self.log_test("Filter by stream=Medical", True, f"Retrieved {medical_count} Medical institutions")
        else:
            self.log_test("Filter by stream=Medical", False, f"Status: {status}", response)

    def test_expected_institutions(self):
        """Test that the 4 expected published institutions exist in database"""
        print("🏛️ Testing Expected Published Institutions...")
        
        # Expected institutions from the review request
        expected_institutions = [
            {"name": "IIT Delhi", "id": "iit-delhi-001", "type": "College", "state": "Delhi"},
            {"name": "AIIMS Delhi", "id": "aiims-delhi-001", "type": "College", "state": "Delhi"},
            {"name": "IIM Ahmedabad", "id": "iim-ahmedabad-001", "type": "College", "state": "Gujarat"},
            {"name": "NLSIU Bangalore", "id": "nlsiu-bangalore-001", "type": "University", "state": "Karnataka"}
        ]
        
        # Test 1: Get all published institutions
        success, response, status = self.make_request("GET", "/colleges?status=published")
        if success and isinstance(response, list):
            published_count = len(response)
            self.log_test("Get Published Institutions", True, f"Retrieved {published_count} published institutions")
            
            # Check for each expected institution
            found_institutions = []
            for expected in expected_institutions:
                found = False
                for institution in response:
                    # Check by ID or name match
                    if (institution.get("id") == expected["id"] or 
                        expected["name"].lower() in institution.get("name", "").lower()):
                        found_institutions.append({
                            "expected": expected["name"],
                            "found": institution.get("name"),
                            "id": institution.get("id"),
                            "status": institution.get("status", "unknown")
                        })
                        found = True
                        break
                
                if found:
                    self.log_test(f"Find {expected['name']}", True, f"Found as: {found_institutions[-1]['found']}")
                else:
                    self.log_test(f"Find {expected['name']}", False, "Institution not found in published list")
            
            # Store found institutions for detail tests
            self.found_institutions = found_institutions
            
        else:
            self.log_test("Get Published Institutions", False, f"Status: {status}", response)
            self.found_institutions = []

    def test_institution_details(self):
        """Test individual institution detail pages"""
        print("📄 Testing Institution Detail Pages...")
        
        if not hasattr(self, 'found_institutions'):
            self.log_test("Institution Details (skipped)", False, "No institutions found in previous test")
            return
        
        for institution in self.found_institutions:
            institution_id = institution.get("id")
            if institution_id:
                # Test detail page access
                success, response, status = self.make_request("GET", f"/colleges/{institution_id}")
                if success and isinstance(response, dict) and "id" in response:
                    name = response.get("name", "Unknown")
                    menu_config = response.get("menu_config", {})
                    detail_toc = response.get("detail_page_toc", [])
                    
                    # Check menu configuration
                    menu_type = "Default"
                    if menu_config.get("auto_from_toc") and detail_toc:
                        menu_type = f"Auto TOC ({len(detail_toc)} sections)"
                    elif menu_config.get("use_custom_menu") and menu_config.get("items"):
                        menu_type = f"Custom ({len(menu_config.get('items', []))} items)"
                    
                    self.log_test(f"Detail Page: {institution['expected']}", True, 
                                f"Name: {name}, Menu: {menu_type}")
                else:
                    self.log_test(f"Detail Page: {institution['expected']}", False, 
                                f"Status: {status}", response)
            else:
                self.log_test(f"Detail Page: {institution['expected']}", False, "No ID available")

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

    def test_seo_content_display_exam_detail(self):
        """Test SEO Content Display feature on Exam Detail Page"""
        print("📝 Testing SEO Content Display on Exam Detail Page...")
        
        # Test 1: Get exam detail with SEO content
        exam_slug = "detailed-test-exam-2025"
        success, response, status = self.make_request("GET", f"/exams-detail?slug={exam_slug}")
        
        if success and isinstance(response, list) and len(response) > 0:
            exam_data = response[0]  # Get first matching exam
            exam_name = exam_data.get("name", "Unknown")
            self.log_test("GET /exams-detail by slug", True, f"Found exam: {exam_name}")
            
            # Test 2: Verify SEO Intro content
            seo_intro = exam_data.get("seo_intro")
            if seo_intro and len(seo_intro.strip()) > 0:
                self.log_test("SEO Intro Content", True, f"SEO intro present ({len(seo_intro)} chars)")
            else:
                self.log_test("SEO Intro Content", False, "SEO intro missing or empty")
            
            # Test 3: Verify SEO Table of Contents
            seo_toc = exam_data.get("seo_toc", [])
            if isinstance(seo_toc, list) and len(seo_toc) > 0:
                toc_sections = [section.get("title", "Untitled") for section in seo_toc]
                self.log_test("SEO Table of Contents", True, f"Found {len(seo_toc)} TOC sections: {', '.join(toc_sections[:3])}...")
            else:
                self.log_test("SEO Table of Contents", False, "SEO TOC missing or empty")
            
            # Test 4: Verify SEO Full Content
            seo_full_content = exam_data.get("seo_full_content")
            if seo_full_content and len(seo_full_content.strip()) > 0:
                self.log_test("SEO Full Content", True, f"SEO full content present ({len(seo_full_content)} chars)")
            else:
                self.log_test("SEO Full Content", False, "SEO full content missing or empty")
            
            # Test 5: Verify SEO Tables
            seo_tables = exam_data.get("seo_tables", [])
            if isinstance(seo_tables, list) and len(seo_tables) > 0:
                table_titles = [table.get("title", "Untitled") for table in seo_tables]
                self.log_test("SEO Tables", True, f"Found {len(seo_tables)} tables: {', '.join(table_titles)}")
                
                # Verify table structure
                valid_tables = 0
                for table in seo_tables:
                    if table.get("headers") and table.get("rows"):
                        valid_tables += 1
                
                if valid_tables == len(seo_tables):
                    self.log_test("SEO Tables Structure", True, f"All {valid_tables} tables have headers and rows")
                else:
                    self.log_test("SEO Tables Structure", False, f"Only {valid_tables}/{len(seo_tables)} tables have proper structure")
            else:
                self.log_test("SEO Tables", False, "SEO tables missing or empty")
            
            # Test 6: Verify SEO Images
            seo_images = exam_data.get("seo_images", [])
            if isinstance(seo_images, list) and len(seo_images) > 0:
                image_captions = [img.get("caption", "No caption") for img in seo_images]
                self.log_test("SEO Images", True, f"Found {len(seo_images)} images with captions: {', '.join(image_captions[:2])}...")
            else:
                self.log_test("SEO Images", False, "SEO images missing or empty")
            
            # Test 7: Verify SEO Video
            seo_video_url = exam_data.get("seo_video_url")
            seo_video_title = exam_data.get("seo_video_title")
            seo_video_description = exam_data.get("seo_video_description")
            
            if seo_video_url and seo_video_title:
                self.log_test("SEO Video", True, f"Video: {seo_video_title} ({seo_video_url[:50]}...)")
            else:
                self.log_test("SEO Video", False, "SEO video URL or title missing")
            
            # Test 8: Verify SEO FAQs
            seo_faqs = exam_data.get("seo_faqs", [])
            if isinstance(seo_faqs, list) and len(seo_faqs) > 0:
                faq_questions = [faq.get("question", "No question") for faq in seo_faqs]
                self.log_test("SEO FAQs", True, f"Found {len(seo_faqs)} FAQs: {faq_questions[0][:50]}..." if faq_questions else "Found FAQs")
                
                # Verify FAQ structure
                valid_faqs = 0
                for faq in seo_faqs:
                    if faq.get("question") and faq.get("answer"):
                        valid_faqs += 1
                
                if valid_faqs == len(seo_faqs):
                    self.log_test("SEO FAQs Structure", True, f"All {valid_faqs} FAQs have questions and answers")
                else:
                    self.log_test("SEO FAQs Structure", False, f"Only {valid_faqs}/{len(seo_faqs)} FAQs have proper Q&A structure")
            else:
                self.log_test("SEO FAQs", False, "SEO FAQs missing or empty")
            
            # Test 9: Verify all required SEO fields are present
            required_seo_fields = [
                "seo_intro", "seo_toc", "seo_full_content", "seo_tables", 
                "seo_images", "seo_video_url", "seo_video_title", "seo_faqs"
            ]
            
            present_fields = []
            missing_fields = []
            
            for field in required_seo_fields:
                if field in exam_data and exam_data[field]:
                    present_fields.append(field)
                else:
                    missing_fields.append(field)
            
            if len(present_fields) >= 6:  # At least 6 out of 8 fields should be present
                self.log_test("SEO Fields Completeness", True, f"{len(present_fields)}/8 SEO fields present")
            else:
                self.log_test("SEO Fields Completeness", False, f"Only {len(present_fields)}/8 SEO fields present. Missing: {', '.join(missing_fields)}")
            
        elif success and isinstance(response, list) and len(response) == 0:
            self.log_test("GET /exams-detail by slug", False, f"Exam '{exam_slug}' not found in database")
        else:
            self.log_test("GET /exams-detail by slug", False, f"Status: {status}", response)
        
        # Test 10: Alternative endpoint - try direct exam ID lookup
        success, response, status = self.make_request("GET", "/exams-detail")
        if success and isinstance(response, list):
            # Look for the test exam in the list
            test_exam = None
            for exam in response:
                if exam.get("slug") == exam_slug or "detailed-test-exam" in exam.get("name", "").lower():
                    test_exam = exam
                    break
            
            if test_exam:
                self.log_test("Find Test Exam in List", True, f"Found exam: {test_exam.get('name')} (ID: {test_exam.get('id')})")
            else:
                self.log_test("Find Test Exam in List", False, f"Test exam '{exam_slug}' not found in {len(response)} exams")
        else:
            self.log_test("GET /exams-detail (all)", False, f"Status: {status}", response)

    def test_advertisement_system(self):
        """Test Advanced Advertisement Management System"""
        print("📢 Testing Advanced Advertisement Management System...")
        
        # Store created ad IDs for cleanup and tracking tests
        self.created_ad_ids = []
        
        # Test 1: Create Banner Ad with Custom URL Targeting
        banner_ad_data = {
            "name": "Test Banner Ad - Maharashtra",
            "ad_type": "banner",
            "image_url": "https://via.placeholder.com/728x90?text=Banner+Ad",
            "banner_size": "728x90",
            "click_url": "https://example.com/colleges",
            "target_urls": ["/maharashtra-colleges", "/mumbai-colleges"],
            "placement_position": "top",
            "start_date": "2025-01-01",
            "end_date": "2025-12-31",
            "is_active": True,
            "priority": 5,
            "budget": {
                "total_budget": 10000,
                "daily_budget": 500,
                "cost_per_click": 2.5,
                "cost_per_impression": 0.5
            }
        }
        
        success, response, status = self.make_request("POST", "/advertisements", banner_ad_data, token=self.admin_token)
        if success and response.get("id"):
            banner_ad_id = response.get("id")
            self.created_ad_ids.append(banner_ad_id)
            self.log_test("Create Banner Ad with Custom URL Targeting", True, f"Created ad ID: {banner_ad_id}")
        else:
            self.log_test("Create Banner Ad with Custom URL Targeting", False, f"Status: {status}", response)
            banner_ad_id = None
        
        # Test 2: Create Video Ad with Rotation Settings
        video_ad_data = {
            "name": "Test Video Ad - IIT Promo",
            "ad_type": "video",
            "video_url": "https://example.com/promo.mp4",
            "video_thumbnail": "https://via.placeholder.com/300x250?text=Video+Thumb",
            "click_url": "https://example.com/iit",
            "target_urls": ["/college-detail"],
            "placement_position": "middle",
            "start_date": "2025-01-01",
            "end_date": "2025-06-30",
            "is_active": True,
            "rotation": {
                "enabled": True,
                "max_impressions": 10000,
                "max_clicks": 500,
                "rotation_type": "weighted",
                "weight": 2
            }
        }
        
        success, response, status = self.make_request("POST", "/advertisements", video_ad_data, token=self.admin_token)
        if success and response.get("id"):
            video_ad_id = response.get("id")
            self.created_ad_ids.append(video_ad_id)
            self.log_test("Create Video Ad with Rotation Settings", True, f"Created ad ID: {video_ad_id}")
        else:
            self.log_test("Create Video Ad with Rotation Settings", False, f"Status: {status}", response)
            video_ad_id = None
        
        # Test 3: Create HTML/Native Ad
        html_ad_data = {
            "name": "Test HTML Ad - Scholarship",
            "ad_type": "html",
            "html_content": "<div style='background: linear-gradient(to right, #f59e0b, #ef4444); padding: 20px; border-radius: 10px; text-align: center;'><h3 style='color: white; margin: 0;'>Get 50% Scholarship!</h3><p style='color: white;'>Apply Now</p></div>",
            "click_url": "https://example.com/scholarship",
            "target_urls": ["/scholarships", "/home"],
            "placement_position": "sidebar",
            "start_date": "2025-01-01",
            "end_date": "2025-12-31",
            "is_active": True,
            "budget": {
                "total_budget": 5000,
                "daily_budget": 200,
                "cost_per_click": 1.0
            }
        }
        
        success, response, status = self.make_request("POST", "/advertisements", html_ad_data, token=self.admin_token)
        if success and response.get("id"):
            html_ad_id = response.get("id")
            self.created_ad_ids.append(html_ad_id)
            self.log_test("Create HTML/Native Ad", True, f"Created ad ID: {html_ad_id}")
        else:
            self.log_test("Create HTML/Native Ad", False, f"Status: {status}", response)
            html_ad_id = None
        
        # Test 4: Get All Advertisements
        success, response, status = self.make_request("GET", "/advertisements", token=self.admin_token)
        if success and isinstance(response, list):
            ads_count = len(response)
            # Check if our created ads are in the list
            created_ads_found = 0
            for ad_id in self.created_ad_ids:
                if any(ad.get("id") == ad_id for ad in response):
                    created_ads_found += 1
            
            if created_ads_found == len(self.created_ad_ids):
                self.log_test("Get All Advertisements", True, f"Retrieved {ads_count} ads, all {created_ads_found} created ads found")
            else:
                self.log_test("Get All Advertisements", False, f"Only {created_ads_found}/{len(self.created_ad_ids)} created ads found")
        else:
            self.log_test("Get All Advertisements", False, f"Status: {status}", response)
        
        # Test 5: Track Impression (using first created ad)
        if banner_ad_id:
            success, response, status = self.make_request("POST", f"/advertisements/{banner_ad_id}/track?event_type=impression")
            if success and response.get("success"):
                self.log_test("Track Impression", True, f"Impression tracked for ad {banner_ad_id}")
            else:
                self.log_test("Track Impression", False, f"Status: {status}", response)
        else:
            self.log_test("Track Impression", False, "No banner ad ID available")
        
        # Test 6: Track Click (using first created ad)
        if banner_ad_id:
            success, response, status = self.make_request("POST", f"/advertisements/{banner_ad_id}/track?event_type=click")
            if success and response.get("success"):
                self.log_test("Track Click", True, f"Click tracked for ad {banner_ad_id}")
            else:
                self.log_test("Track Click", False, f"Status: {status}", response)
        else:
            self.log_test("Track Click", False, "No banner ad ID available")
        
        # Test 7: Get Analytics Summary
        success, response, status = self.make_request("GET", "/advertisements/analytics/summary", token=self.admin_token)
        if success and isinstance(response, dict):
            summary = response.get("summary", {})
            total_ads = summary.get("total_ads", 0)
            total_impressions = summary.get("total_impressions", 0)
            total_clicks = summary.get("total_clicks", 0)
            avg_ctr = summary.get("avg_ctr", 0)
            
            self.log_test("Get Analytics Summary", True, 
                         f"Total ads: {total_ads}, Impressions: {total_impressions}, Clicks: {total_clicks}, CTR: {avg_ctr}%")
        else:
            self.log_test("Get Analytics Summary", False, f"Status: {status}", response)
        
        # Test 8: Get Single Ad with Updated Stats
        if banner_ad_id:
            success, response, status = self.make_request("GET", f"/advertisements/{banner_ad_id}", token=self.admin_token)
            if success and isinstance(response, dict):
                stats = response.get("stats", {})
                impressions = stats.get("impressions", 0)
                clicks = stats.get("clicks", 0)
                budget = response.get("budget", {})
                
                # Verify that stats were updated from tracking
                if impressions >= 1 and clicks >= 1:
                    self.log_test("Get Single Ad with Updated Stats", True, 
                                 f"Ad stats updated - Impressions: {impressions}, Clicks: {clicks}")
                else:
                    self.log_test("Get Single Ad with Updated Stats", False, 
                                 f"Stats not updated properly - Impressions: {impressions}, Clicks: {clicks}")
            else:
                self.log_test("Get Single Ad with Updated Stats", False, f"Status: {status}", response)
        else:
            self.log_test("Get Single Ad with Updated Stats", False, "No banner ad ID available")
        
        # Test 9: Verify Budget Fields Storage
        if banner_ad_id:
            success, response, status = self.make_request("GET", f"/advertisements/{banner_ad_id}", token=self.admin_token)
            if success and isinstance(response, dict):
                budget = response.get("budget", {})
                required_budget_fields = ["total_budget", "daily_budget", "cost_per_click", "cost_per_impression"]
                
                budget_fields_present = all(field in budget for field in required_budget_fields)
                if budget_fields_present:
                    self.log_test("Verify Budget Fields Storage", True, 
                                 f"All budget fields present: {list(budget.keys())}")
                else:
                    missing_fields = [field for field in required_budget_fields if field not in budget]
                    self.log_test("Verify Budget Fields Storage", False, 
                                 f"Missing budget fields: {missing_fields}")
            else:
                self.log_test("Verify Budget Fields Storage", False, f"Status: {status}", response)
        
        # Test 10: Verify Custom URLs Storage
        if banner_ad_id:
            success, response, status = self.make_request("GET", f"/advertisements/{banner_ad_id}", token=self.admin_token)
            if success and isinstance(response, dict):
                target_urls = response.get("target_urls", [])
                expected_urls = ["/maharashtra-colleges", "/mumbai-colleges"]
                
                if isinstance(target_urls, list) and all(url in target_urls for url in expected_urls):
                    self.log_test("Verify Custom URLs Storage", True, 
                                 f"Custom URLs stored correctly: {target_urls}")
                else:
                    self.log_test("Verify Custom URLs Storage", False, 
                                 f"Custom URLs not stored correctly. Expected: {expected_urls}, Got: {target_urls}")
            else:
                self.log_test("Verify Custom URLs Storage", False, f"Status: {status}", response)

    def test_course_listing_settings(self):
        """Test Course Listing Settings feature"""
        print("📚 Testing Course Listing Settings Feature...")
        
        # Test 1: GET /api/course-listing-settings (public access)
        success, response, status = self.make_request("GET", "/course-listing-settings")
        if success and isinstance(response, dict):
            # Verify expected structure
            expected_fields = [
                "hero_title", "hero_subtitle", "hero_search_placeholder",
                "popular_tags", "level_courses", "stream_categories",
                "meta_title", "meta_description", "meta_keywords", "faqs"
            ]
            
            present_fields = []
            missing_fields = []
            
            for field in expected_fields:
                if field in response:
                    present_fields.append(field)
                else:
                    missing_fields.append(field)
            
            if len(present_fields) >= 8:  # At least 8 out of 10 fields should be present
                self.log_test("GET /course-listing-settings", True, 
                             f"Retrieved settings with {len(present_fields)}/10 expected fields")
                
                # Verify specific field types
                if isinstance(response.get("popular_tags"), list):
                    self.log_test("Popular Tags Structure", True, 
                                 f"Found {len(response['popular_tags'])} popular tags")
                else:
                    self.log_test("Popular Tags Structure", False, "Popular tags not a list")
                
                if isinstance(response.get("level_courses"), list):
                    self.log_test("Level Courses Structure", True, 
                                 f"Found {len(response['level_courses'])} level courses")
                else:
                    self.log_test("Level Courses Structure", False, "Level courses not a list")
                
                if isinstance(response.get("stream_categories"), list):
                    self.log_test("Stream Categories Structure", True, 
                                 f"Found {len(response['stream_categories'])} stream categories")
                else:
                    self.log_test("Stream Categories Structure", False, "Stream categories not a list")
                
                if isinstance(response.get("faqs"), list):
                    self.log_test("FAQs Structure", True, 
                                 f"Found {len(response['faqs'])} FAQs")
                else:
                    self.log_test("FAQs Structure", False, "FAQs not a list")
                    
            else:
                self.log_test("GET /course-listing-settings", False, 
                             f"Only {len(present_fields)}/10 expected fields present. Missing: {', '.join(missing_fields)}")
        else:
            self.log_test("GET /course-listing-settings", False, f"Status: {status}", response)
        
        # Test 2: PUT /course-listing-settings without authentication (should fail)
        test_settings = {
            "hero_title": "Test Course Listing",
            "hero_subtitle": "Test subtitle",
            "hero_search_placeholder": "Search test courses...",
            "popular_tags": [
                {"name": "Test Course", "link": "/test", "color": "bg-blue-500"}
            ],
            "level_courses": [
                {"title": "Test Level", "subtitle": "Test programs", "icon": "🎓", "link": "/test"}
            ],
            "stream_categories": [
                {"name": "Test Stream", "icon": "HiOutlineDesktopComputer", "link": "/test", "courses": ["Test"], "count": "1+"}
            ],
            "meta_title": "Test Meta Title",
            "meta_description": "Test meta description",
            "meta_keywords": ["test", "course"],
            "faqs": [
                {"question": "Test question?", "answer": "Test answer"}
            ]
        }
        
        success, response, status = self.make_request("PUT", "/course-listing-settings", test_settings)
        if not success and status in [401, 403]:
            self.log_test("PUT /course-listing-settings (no auth - should fail)", True, 
                         f"Correctly rejected with status {status}")
        else:
            self.log_test("PUT /course-listing-settings (no auth - should fail)", False, 
                         f"Should have been rejected but got status {status}", response)
        
        # Test 3: PUT /course-listing-settings with admin authentication
        if self.admin_token:
            success, response, status = self.make_request("PUT", "/course-listing-settings", 
                                                        test_settings, token=self.admin_token)
            if success and isinstance(response, dict):
                # Verify the settings were saved
                if response.get("hero_title") == test_settings["hero_title"]:
                    self.log_test("PUT /course-listing-settings (with admin auth)", True, 
                                 f"Settings updated successfully")
                    
                    # Test 4: Verify changes persist with GET request
                    success, get_response, get_status = self.make_request("GET", "/course-listing-settings")
                    if success and isinstance(get_response, dict):
                        if get_response.get("hero_title") == test_settings["hero_title"]:
                            self.log_test("Verify Settings Persistence", True, 
                                         "Updated settings persist in GET request")
                        else:
                            self.log_test("Verify Settings Persistence", False, 
                                         f"Settings not persisted. Expected: {test_settings['hero_title']}, Got: {get_response.get('hero_title')}")
                    else:
                        self.log_test("Verify Settings Persistence", False, 
                                     f"GET request failed with status: {get_status}")
                else:
                    self.log_test("PUT /course-listing-settings (with admin auth)", False, 
                                 f"Settings not updated correctly. Expected: {test_settings['hero_title']}, Got: {response.get('hero_title')}")
            else:
                self.log_test("PUT /course-listing-settings (with admin auth)", False, 
                             f"Status: {status}", response)
        else:
            self.log_test("PUT /course-listing-settings (with admin auth)", False, 
                         "Admin token not available")
        
        # Test 5: Verify all required fields are properly saved and retrieved
        if self.admin_token:
            # Create comprehensive test data
            comprehensive_settings = {
                "hero_title": "Comprehensive Test Title",
                "hero_subtitle": "Comprehensive test subtitle with detailed information",
                "hero_search_placeholder": "Search comprehensive test courses...",
                "popular_tags": [
                    {"name": "B.Tech Test", "link": "/test-engineering", "color": "bg-blue-500"},
                    {"name": "MBA Test", "link": "/test-management", "color": "bg-purple-500"},
                    {"name": "MBBS Test", "link": "/test-medical", "color": "bg-red-500"}
                ],
                "level_courses": [
                    {
                        "title": "After 12th Test", 
                        "subtitle": "Undergraduate Test Programs", 
                        "icon": "📚", 
                        "gradient": "from-blue-500 to-purple-600",
                        "link": "/test-after-12th", 
                        "stats": "100+ Test Courses",
                        "popular": ["B.Tech Test", "MBBS Test", "B.Com Test"]
                    }
                ],
                "stream_categories": [
                    {
                        "name": "Engineering Test", 
                        "icon": "HiOutlineDesktopComputer", 
                        "link": "/test-engineering", 
                        "courses": ["B.Tech Test", "B.E Test"], 
                        "count": "50+"
                    }
                ],
                "meta_title": "Test Courses in India 2025 - Comprehensive Testing",
                "meta_description": "Explore comprehensive test courses across all streams and levels for testing purposes.",
                "meta_keywords": ["test courses", "comprehensive testing", "course listing"],
                "faqs": [
                    {"question": "What is this test?", "answer": "This is a comprehensive test of the course listing settings feature."},
                    {"question": "How does testing work?", "answer": "Testing verifies that all functionality works as expected."}
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-listing-settings", 
                                                        comprehensive_settings, token=self.admin_token)
            if success:
                # Verify all fields are present in response
                all_fields_present = True
                for key, value in comprehensive_settings.items():
                    if key not in response or response[key] != value:
                        all_fields_present = False
                        break
                
                if all_fields_present:
                    self.log_test("Comprehensive Settings Update", True, 
                                 "All fields saved and returned correctly")
                else:
                    self.log_test("Comprehensive Settings Update", False, 
                                 "Some fields not saved correctly")
            else:
                self.log_test("Comprehensive Settings Update", False, 
                             f"Status: {status}", response)

    def test_course_pages_management(self):
        """Test Course Pages Management feature"""
        print("📄 Testing Course Pages Management Feature...")
        
        # Expected page IDs from the review request
        expected_page_ids = [
            "after-10th", "after-12th", "diploma", "pg", "phd", "certificate",
            "engineering", "medical", "management", "science", "commerce", 
            "arts", "computer", "law", "education"
        ]
        
        # Test 1: GET /api/course-pages - Should return list of all 15 course page configurations
        success, response, status = self.make_request("GET", "/course-pages")
        if success and isinstance(response, list):
            page_count = len(response)
            if page_count == 15:
                self.log_test("GET /course-pages (count verification)", True, 
                             f"Retrieved exactly 15 course pages as expected")
                
                # Verify all expected page IDs are present
                returned_ids = [page.get("id") for page in response if "id" in page]
                missing_ids = [pid for pid in expected_page_ids if pid not in returned_ids]
                extra_ids = [pid for pid in returned_ids if pid not in expected_page_ids]
                
                if not missing_ids and not extra_ids:
                    self.log_test("GET /course-pages (ID verification)", True, 
                                 f"All expected page IDs present: {', '.join(expected_page_ids[:5])}...")
                else:
                    details = ""
                    if missing_ids:
                        details += f"Missing: {', '.join(missing_ids)}. "
                    if extra_ids:
                        details += f"Extra: {', '.join(extra_ids)}."
                    self.log_test("GET /course-pages (ID verification)", False, details)
                
                # Verify each page has required fields
                required_fields = ["id", "title", "subtitle", "filter_key", "filter_value", "theme"]
                pages_with_all_fields = 0
                for page in response:
                    if all(field in page for field in required_fields):
                        pages_with_all_fields += 1
                
                if pages_with_all_fields == 15:
                    self.log_test("GET /course-pages (field structure)", True, 
                                 f"All 15 pages have required fields: {', '.join(required_fields)}")
                else:
                    self.log_test("GET /course-pages (field structure)", False, 
                                 f"Only {pages_with_all_fields}/15 pages have all required fields")
                
                # Store response for later tests
                self.course_pages_response = response
                
            else:
                self.log_test("GET /course-pages (count verification)", False, 
                             f"Expected 15 pages, got {page_count}")
        else:
            self.log_test("GET /course-pages", False, f"Status: {status}", response)
            self.course_pages_response = []
        
        # Test 2: GET /api/course-pages/{id} - Test for specific pages
        test_pages = [
            {"id": "engineering", "expected_title": "Engineering Courses in India"},
            {"id": "medical", "expected_title": "Medical Courses in India"},
            {"id": "after-10th", "expected_title": "Courses After 10th Class"}
        ]
        
        for test_page in test_pages:
            page_id = test_page["id"]
            expected_title = test_page["expected_title"]
            
            success, response, status = self.make_request("GET", f"/course-pages/{page_id}")
            if success and isinstance(response, dict):
                if response.get("id") == page_id and response.get("title") == expected_title:
                    self.log_test(f"GET /course-pages/{page_id}", True, 
                                 f"Retrieved {page_id} page: {response.get('title')}")
                else:
                    self.log_test(f"GET /course-pages/{page_id}", False, 
                                 f"ID or title mismatch. Expected: {page_id}/{expected_title}, Got: {response.get('id')}/{response.get('title')}")
            else:
                self.log_test(f"GET /course-pages/{page_id}", False, f"Status: {status}", response)
        
        # Test 3: GET /api/course-pages/nonexistent - Should return 404
        success, response, status = self.make_request("GET", "/course-pages/nonexistent")
        if not success and status == 404:
            self.log_test("GET /course-pages/nonexistent (should return 404)", True, 
                         f"Correctly returned 404 for non-existent page")
        else:
            self.log_test("GET /course-pages/nonexistent (should return 404)", False, 
                         f"Expected 404, got status {status}", response)
        
        # Test 4: PUT /api/course-pages/{id} without authentication (should fail)
        test_update_data = {
            "id": "engineering",
            "page_type": "stream",
            "title": "Updated Engineering Courses",
            "subtitle": "Updated subtitle for testing",
            "theme": "from-green-600 via-green-700 to-emerald-700",
            "filter_key": "stream",
            "filter_value": "Engineering"
        }
        
        success, response, status = self.make_request("PUT", "/course-pages/engineering", test_update_data)
        if not success and status in [401, 403]:
            self.log_test("PUT /course-pages/engineering (no auth - should fail)", True, 
                         f"Correctly rejected with status {status}")
        else:
            self.log_test("PUT /course-pages/engineering (no auth - should fail)", False, 
                         f"Should have been rejected but got status {status}", response)
        
        # Test 5: PUT /api/course-pages/{id} with admin authentication
        if self.admin_token:
            success, response, status = self.make_request("PUT", "/course-pages/engineering", 
                                                        test_update_data, token=self.admin_token)
            if success and isinstance(response, dict):
                if response.get("title") == test_update_data["title"]:
                    self.log_test("PUT /course-pages/engineering (with admin auth)", True, 
                                 f"Successfully updated engineering page title")
                    
                    # Test 6: Verify changes are persisted with subsequent GET
                    success, get_response, get_status = self.make_request("GET", "/course-pages/engineering")
                    if success and isinstance(get_response, dict):
                        if get_response.get("title") == test_update_data["title"]:
                            self.log_test("Verify Engineering Page Update Persistence", True, 
                                         "Updated title persists in GET request")
                        else:
                            self.log_test("Verify Engineering Page Update Persistence", False, 
                                         f"Title not persisted. Expected: {test_update_data['title']}, Got: {get_response.get('title')}")
                    else:
                        self.log_test("Verify Engineering Page Update Persistence", False, 
                                     f"GET request failed with status: {get_status}")
                else:
                    self.log_test("PUT /course-pages/engineering (with admin auth)", False, 
                                 f"Title not updated. Expected: {test_update_data['title']}, Got: {response.get('title')}")
            else:
                self.log_test("PUT /course-pages/engineering (with admin auth)", False, 
                             f"Status: {status}", response)
        else:
            self.log_test("PUT /course-pages/engineering (with admin auth)", False, 
                         "Admin token not available")
        
        # Test 7: POST /api/course-pages/{id}/reset without authentication (should fail)
        success, response, status = self.make_request("POST", "/course-pages/engineering/reset")
        if not success and status in [401, 403]:
            self.log_test("POST /course-pages/engineering/reset (no auth - should fail)", True, 
                         f"Correctly rejected with status {status}")
        else:
            self.log_test("POST /course-pages/engineering/reset (no auth - should fail)", False, 
                         f"Should have been rejected but got status {status}", response)
        
        # Test 8: POST /api/course-pages/{id}/reset with admin authentication
        if self.admin_token:
            success, response, status = self.make_request("POST", "/course-pages/engineering/reset", 
                                                        token=self.admin_token)
            if success and isinstance(response, dict):
                # Should return default configuration
                if response.get("id") == "engineering" and response.get("title") == "Engineering Courses in India":
                    self.log_test("POST /course-pages/engineering/reset (with admin auth)", True, 
                                 f"Successfully reset engineering page to defaults")
                    
                    # Test 9: Verify reset reverted to default configuration
                    success, get_response, get_status = self.make_request("GET", "/course-pages/engineering")
                    if success and isinstance(get_response, dict):
                        if get_response.get("title") == "Engineering Courses in India":
                            self.log_test("Verify Engineering Page Reset", True, 
                                         "Page successfully reverted to default configuration")
                        else:
                            self.log_test("Verify Engineering Page Reset", False, 
                                         f"Page not reset properly. Got title: {get_response.get('title')}")
                    else:
                        self.log_test("Verify Engineering Page Reset", False, 
                                     f"GET request failed with status: {get_status}")
                else:
                    self.log_test("POST /course-pages/engineering/reset (with admin auth)", False, 
                                 f"Reset response incorrect. Expected engineering/Engineering Courses in India, Got: {response.get('id')}/{response.get('title')}")
            else:
                self.log_test("POST /course-pages/engineering/reset (with admin auth)", False, 
                             f"Status: {status}", response)
        else:
            self.log_test("POST /course-pages/engineering/reset (with admin auth)", False, 
                         "Admin token not available")
        
        # Test 10: Verify API returns proper JSON structure for all pages
        if hasattr(self, 'course_pages_response') and self.course_pages_response:
            json_structure_valid = True
            invalid_pages = []
            
            for page in self.course_pages_response:
                # Check if it's a valid dict with required structure
                if not isinstance(page, dict):
                    json_structure_valid = False
                    invalid_pages.append(f"Non-dict page: {type(page)}")
                    continue
                
                # Check for required fields and their types
                required_checks = [
                    ("id", str), ("title", str), ("subtitle", str),
                    ("filter_key", str), ("filter_value", str), ("theme", str)
                ]
                
                for field, expected_type in required_checks:
                    if field not in page or not isinstance(page[field], expected_type):
                        json_structure_valid = False
                        invalid_pages.append(f"{page.get('id', 'unknown')}: {field}")
                        break
            
            if json_structure_valid:
                self.log_test("Course Pages JSON Structure Validation", True, 
                             "All pages have proper JSON structure with correct field types")
            else:
                self.log_test("Course Pages JSON Structure Validation", False, 
                             f"Invalid structure in pages: {', '.join(invalid_pages[:3])}...")
        
        # Test 11: Test admin authentication requirement verification
        if self.admin_token:
            # Test with a different page to ensure consistency
            medical_update_data = {
                "id": "medical",
                "page_type": "stream",
                "title": "Updated Medical Courses",
                "subtitle": "Updated medical subtitle",
                "theme": "from-red-500 via-pink-500 to-rose-500",
                "filter_key": "stream",
                "filter_value": "Medical"
            }
            
            success, response, status = self.make_request("PUT", "/course-pages/medical", 
                                                        medical_update_data, token=self.admin_token)
            if success and response.get("title") == medical_update_data["title"]:
                self.log_test("Admin Authentication Consistency Check", True, 
                             "Admin authentication works consistently across different pages")
            else:
                self.log_test("Admin Authentication Consistency Check", False, 
                             f"Admin auth failed for medical page. Status: {status}")

    def test_course_listing_settings_comprehensive(self):
        """Comprehensive test of Course Listing Settings including trending section"""
        print("📚 Testing Course Listing Settings - COMPREHENSIVE (Including Trending Section)...")
        
        # Test 1: GET /api/course-listing-settings - verify all fields returned
        success, response, status = self.make_request("GET", "/course-listing-settings")
        if success and isinstance(response, dict):
            # Verify ALL expected fields including trending section
            expected_fields = [
                "hero_title", "hero_subtitle", "hero_search_placeholder",
                "popular_tags", "level_courses", "stream_categories",
                "trending_badge", "trending_title", "trending_subtitle", "trending_courses",
                "stats_courses", "stats_colleges", "stats_streams", "stats_students",
                "meta_title", "meta_description", "meta_keywords", "faqs"
            ]
            
            present_fields = []
            missing_fields = []
            
            for field in expected_fields:
                if field in response:
                    present_fields.append(field)
                else:
                    missing_fields.append(field)
            
            if len(present_fields) >= 16:  # At least 16 out of 18 fields should be present
                self.log_test("GET /course-listing-settings - All Fields", True, 
                             f"Retrieved settings with {len(present_fields)}/18 expected fields (including trending)")
                
                # Verify trending section specifically
                trending_fields = ["trending_badge", "trending_title", "trending_subtitle", "trending_courses"]
                trending_present = [f for f in trending_fields if f in response]
                
                if len(trending_present) == 4:
                    self.log_test("Trending Section Fields", True, 
                                 f"All trending fields present: {', '.join(trending_present)}")
                    
                    # Verify trending_courses structure
                    trending_courses = response.get("trending_courses", [])
                    if isinstance(trending_courses, list) and len(trending_courses) > 0:
                        # Check if trending courses have required fields: name, growth, icon, link
                        valid_trending = 0
                        for course in trending_courses:
                            if all(field in course for field in ["name", "growth", "icon", "link"]):
                                valid_trending += 1
                        
                        if valid_trending == len(trending_courses):
                            self.log_test("Trending Courses Structure", True, 
                                         f"All {len(trending_courses)} trending courses have required fields (name, growth, icon, link)")
                        else:
                            self.log_test("Trending Courses Structure", False, 
                                         f"Only {valid_trending}/{len(trending_courses)} trending courses have proper structure")
                    else:
                        self.log_test("Trending Courses Array", False, "Trending courses not an array or empty")
                else:
                    self.log_test("Trending Section Fields", False, 
                                 f"Missing trending fields: {[f for f in trending_fields if f not in response]}")
                
                # Verify stats fields
                stats_fields = ["stats_courses", "stats_colleges", "stats_streams", "stats_students"]
                stats_present = [f for f in stats_fields if f in response]
                
                if len(stats_present) == 4:
                    self.log_test("Stats Fields", True, f"All stats fields present: {', '.join(stats_present)}")
                else:
                    self.log_test("Stats Fields", False, 
                                 f"Missing stats fields: {[f for f in stats_fields if f not in response]}")
                    
            else:
                self.log_test("GET /course-listing-settings - All Fields", False, 
                             f"Only {len(present_fields)}/18 expected fields present. Missing: {', '.join(missing_fields)}")
        else:
            self.log_test("GET /course-listing-settings", False, f"Status: {status}", response)
        
        # Test 2: PUT /course-listing-settings - test saving with updated values including trending
        if self.admin_token:
            comprehensive_update_data = {
                "hero_title": "Updated Course Listing 2025",
                "hero_subtitle": "Updated comprehensive guide to courses",
                "hero_search_placeholder": "Search updated courses...",
                "popular_tags": [
                    {"name": "Updated B.Tech", "link": "/updated-engineering", "color": "bg-blue-600"},
                    {"name": "Updated MBA", "link": "/updated-management", "color": "bg-purple-600"},
                    {"name": "Updated MBBS", "link": "/updated-medical", "color": "bg-red-600"}
                ],
                "level_courses": [
                    {
                        "title": "Updated After 12th", 
                        "subtitle": "Updated Undergraduate Programs", 
                        "icon": "📚", 
                        "link": "/updated-after-12th"
                    }
                ],
                "stream_categories": [
                    {
                        "name": "Updated Engineering", 
                        "icon": "HiOutlineDesktopComputer", 
                        "link": "/updated-engineering", 
                        "courses": ["Updated B.Tech", "Updated B.E"], 
                        "count": "100+"
                    }
                ],
                "trending_badge": "🔥 TRENDING NOW",
                "trending_title": "Updated Trending Courses 2025",
                "trending_subtitle": "Updated most sought-after programs",
                "trending_courses": [
                    {"name": "Updated AI & ML", "growth": "+85%", "icon": "🤖", "link": "/updated-ai-ml"},
                    {"name": "Updated Data Science", "growth": "+70%", "icon": "📊", "link": "/updated-data-science"},
                    {"name": "Updated Cybersecurity", "growth": "+65%", "icon": "🔒", "link": "/updated-cybersecurity"}
                ],
                "stats_courses": "500+",
                "stats_colleges": "2000+",
                "stats_streams": "25+",
                "stats_students": "50K+",
                "meta_title": "Updated Courses in India 2025",
                "meta_description": "Updated comprehensive guide to courses",
                "meta_keywords": ["updated courses", "2025", "comprehensive"],
                "faqs": [
                    {"question": "Updated FAQ 1?", "answer": "Updated answer 1"},
                    {"question": "Updated FAQ 2?", "answer": "Updated answer 2"}
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-listing-settings", 
                                                        comprehensive_update_data, token=self.admin_token)
            if success and isinstance(response, dict):
                # Verify all fields were saved correctly
                all_fields_saved = True
                failed_fields = []
                
                for key, expected_value in comprehensive_update_data.items():
                    if key not in response or response[key] != expected_value:
                        all_fields_saved = False
                        failed_fields.append(key)
                
                if all_fields_saved:
                    self.log_test("PUT /course-listing-settings - Comprehensive Update", True, 
                                 "All fields including trending section saved correctly")
                else:
                    self.log_test("PUT /course-listing-settings - Comprehensive Update", False, 
                                 f"Failed to save fields: {', '.join(failed_fields[:5])}...")
                
                # Test 3: Verify saved data persists on subsequent GET
                success, get_response, get_status = self.make_request("GET", "/course-listing-settings")
                if success and isinstance(get_response, dict):
                    # Check persistence of key fields including trending
                    key_fields_to_check = [
                        "hero_title", "trending_title", "trending_courses", 
                        "stats_courses", "meta_title"
                    ]
                    
                    persistence_success = True
                    failed_persistence = []
                    
                    for field in key_fields_to_check:
                        if get_response.get(field) != comprehensive_update_data.get(field):
                            persistence_success = False
                            failed_persistence.append(field)
                    
                    if persistence_success:
                        self.log_test("Course Listing Settings Persistence", True, 
                                     "All updated fields persist correctly in subsequent GET")
                    else:
                        self.log_test("Course Listing Settings Persistence", False, 
                                     f"Fields not persisted: {', '.join(failed_persistence)}")
                else:
                    self.log_test("Course Listing Settings Persistence", False, 
                                 f"GET request failed with status: {get_status}")
            else:
                self.log_test("PUT /course-listing-settings - Comprehensive Update", False, 
                             f"Status: {status}", response)
        else:
            self.log_test("PUT /course-listing-settings - Comprehensive Update", False, 
                         "Admin token not available")

    def test_course_pages_comprehensive(self):
        """Comprehensive test of Course Pages Management - Multiple pages testing"""
        print("📄 Testing Course Pages Management - COMPREHENSIVE (Multiple Pages)...")
        
        # Test 1: GET /api/course-pages - should return 15 pages
        success, response, status = self.make_request("GET", "/course-pages")
        if success and isinstance(response, list):
            if len(response) == 15:
                self.log_test("GET /course-pages - Count Verification", True, 
                             f"Retrieved exactly 15 course pages as expected")
                
                # Store pages for further testing
                self.all_course_pages = response
                page_ids = [page.get("id") for page in response]
                self.log_test("Course Pages IDs", True, 
                             f"Found pages: {', '.join(page_ids[:8])}...")
            else:
                self.log_test("GET /course-pages - Count Verification", False, 
                             f"Expected 15 pages, got {len(response)}")
                self.all_course_pages = response
        else:
            self.log_test("GET /course-pages", False, f"Status: {status}", response)
            self.all_course_pages = []
        
        # Test 2: GET /api/course-pages/engineering - get specific page
        success, response, status = self.make_request("GET", "/course-pages/engineering")
        if success and isinstance(response, dict):
            if response.get("id") == "engineering":
                self.log_test("GET /course-pages/engineering", True, 
                             f"Retrieved engineering page: {response.get('title')}")
                self.original_engineering_title = response.get("title")
            else:
                self.log_test("GET /course-pages/engineering", False, 
                             f"Wrong page returned: {response.get('id')}")
        else:
            self.log_test("GET /course-pages/engineering", False, f"Status: {status}", response)
        
        # Test 3: PUT /api/course-pages/engineering - update with new title
        if self.admin_token:
            engineering_update = {
                "id": "engineering",
                "page_type": "stream",
                "title": "Updated Engineering Courses in India 2025",
                "subtitle": "Updated comprehensive guide to engineering programs",
                "theme": "from-blue-600 via-blue-700 to-indigo-700",
                "filter_key": "stream",
                "filter_value": "Engineering",
                "benefits": [
                    "Updated High-paying career opportunities",
                    "Updated Innovation and technology focus",
                    "Updated Global job prospects"
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-pages/engineering", 
                                                        engineering_update, token=self.admin_token)
            if success and isinstance(response, dict):
                if response.get("title") == engineering_update["title"]:
                    self.log_test("PUT /course-pages/engineering - Update Title", True, 
                                 f"Successfully updated engineering page title")
                else:
                    self.log_test("PUT /course-pages/engineering - Update Title", False, 
                                 f"Title not updated correctly")
            else:
                self.log_test("PUT /course-pages/engineering - Update Title", False, 
                             f"Status: {status}", response)
        
        # Test 4: GET /api/course-pages/engineering - verify changes persisted
        success, response, status = self.make_request("GET", "/course-pages/engineering")
        if success and isinstance(response, dict):
            if "Updated Engineering Courses in India 2025" in response.get("title", ""):
                self.log_test("Engineering Page Update Persistence", True, 
                             "Updated title persists in GET request")
            else:
                self.log_test("Engineering Page Update Persistence", False, 
                             f"Title not persisted: {response.get('title')}")
        else:
            self.log_test("Engineering Page Update Persistence", False, f"Status: {status}", response)
        
        # Test 5: GET /api/course-pages/medical - test another page
        success, response, status = self.make_request("GET", "/course-pages/medical")
        if success and isinstance(response, dict):
            if response.get("id") == "medical":
                self.log_test("GET /course-pages/medical", True, 
                             f"Retrieved medical page: {response.get('title')}")
                self.original_medical_subtitle = response.get("subtitle")
            else:
                self.log_test("GET /course-pages/medical", False, 
                             f"Wrong page returned: {response.get('id')}")
        else:
            self.log_test("GET /course-pages/medical", False, f"Status: {status}", response)
        
        # Test 6: PUT /api/course-pages/medical - update with new subtitle
        if self.admin_token:
            medical_update = {
                "id": "medical",
                "page_type": "stream",
                "title": "Medical Courses in India",
                "subtitle": "Updated comprehensive guide to medical education and healthcare programs",
                "theme": "from-red-600 via-red-700 to-pink-700",
                "filter_key": "stream",
                "filter_value": "Medical"
            }
            
            success, response, status = self.make_request("PUT", "/course-pages/medical", 
                                                        medical_update, token=self.admin_token)
            if success and isinstance(response, dict):
                if "Updated comprehensive guide to medical" in response.get("subtitle", ""):
                    self.log_test("PUT /course-pages/medical - Update Subtitle", True, 
                                 f"Successfully updated medical page subtitle")
                else:
                    self.log_test("PUT /course-pages/medical - Update Subtitle", False, 
                                 f"Subtitle not updated correctly")
            else:
                self.log_test("PUT /course-pages/medical - Update Subtitle", False, 
                             f"Status: {status}", response)
        
        # Test 7: GET /api/course-pages/after-10th - test level page
        success, response, status = self.make_request("GET", "/course-pages/after-10th")
        if success and isinstance(response, dict):
            if response.get("id") == "after-10th":
                self.log_test("GET /course-pages/after-10th", True, 
                             f"Retrieved after-10th page: {response.get('title')}")
            else:
                self.log_test("GET /course-pages/after-10th", False, 
                             f"Wrong page returned: {response.get('id')}")
        else:
            self.log_test("GET /course-pages/after-10th", False, f"Status: {status}", response)
        
        # Test 8: PUT /api/course-pages/after-10th - update benefits array
        if self.admin_token:
            after_10th_update = {
                "id": "after-10th",
                "page_type": "level",
                "title": "Courses After 10th Class",
                "subtitle": "Explore career paths after completing 10th standard",
                "theme": "from-green-600 via-green-700 to-emerald-700",
                "filter_key": "eligibility_level",
                "filter_value": "after-10th",
                "benefits": [
                    "Updated Early career specialization",
                    "Updated Diverse field options",
                    "Updated Skill-based learning",
                    "Updated Industry-ready programs"
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-pages/after-10th", 
                                                        after_10th_update, token=self.admin_token)
            if success and isinstance(response, dict):
                benefits = response.get("benefits", [])
                if isinstance(benefits, list) and len(benefits) == 4:
                    self.log_test("PUT /course-pages/after-10th - Update Benefits", True, 
                                 f"Successfully updated benefits array with {len(benefits)} items")
                else:
                    self.log_test("PUT /course-pages/after-10th - Update Benefits", False, 
                                 f"Benefits array not updated correctly: {benefits}")
            else:
                self.log_test("PUT /course-pages/after-10th - Update Benefits", False, 
                             f"Status: {status}", response)
        
        # Test 9: POST /api/course-pages/engineering/reset - reset to defaults
        if self.admin_token:
            success, response, status = self.make_request("POST", "/course-pages/engineering/reset", 
                                                        token=self.admin_token)
            if success and isinstance(response, dict):
                if response.get("title") == "Engineering Courses in India":
                    self.log_test("POST /course-pages/engineering/reset", True, 
                                 "Successfully reset engineering page to defaults")
                else:
                    self.log_test("POST /course-pages/engineering/reset", False, 
                                 f"Reset failed, title: {response.get('title')}")
            else:
                self.log_test("POST /course-pages/engineering/reset", False, 
                             f"Status: {status}", response)
        
        # Test 10: Verify reset worked
        success, response, status = self.make_request("GET", "/course-pages/engineering")
        if success and isinstance(response, dict):
            if response.get("title") == "Engineering Courses in India":
                self.log_test("Verify Engineering Page Reset", True, 
                             "Engineering page successfully reverted to default title")
            else:
                self.log_test("Verify Engineering Page Reset", False, 
                             f"Reset verification failed, title: {response.get('title')}")
        else:
            self.log_test("Verify Engineering Page Reset", False, f"Status: {status}", response)
        
        # Test 11: Authentication verification for all endpoints
        # Test PUT without auth
        test_data = {"title": "Unauthorized Update"}
        success, response, status = self.make_request("PUT", "/course-pages/medical", test_data)
        if not success and status in [401, 403]:
            self.log_test("Authentication Required - PUT (should fail)", True, 
                         f"Correctly rejected unauthorized PUT with status {status}")
        else:
            self.log_test("Authentication Required - PUT (should fail)", False, 
                         f"Should have rejected unauthorized PUT, got status {status}")
        
        # Test POST without auth
        success, response, status = self.make_request("POST", "/course-pages/medical/reset")
        if not success and status in [401, 403]:
            self.log_test("Authentication Required - POST (should fail)", True, 
                         f"Correctly rejected unauthorized POST with status {status}")
        else:
            self.log_test("Authentication Required - POST (should fail)", False, 
                         f"Should have rejected unauthorized POST, got status {status}")
        
        # Test 12: Verify all field types save properly
        if self.admin_token and hasattr(self, 'all_course_pages') and self.all_course_pages:
            # Test with comprehensive data types
            comprehensive_test_data = {
                "id": "computer",
                "page_type": "stream",
                "title": "Computer Science Courses",  # String
                "subtitle": "Advanced computing programs",  # String
                "theme": "from-purple-600 to-blue-600",  # String
                "filter_key": "stream",  # String
                "filter_value": "Computer Science",  # String
                "benefits": [  # Array
                    "High-demand skills",
                    "Innovation opportunities",
                    "Global career prospects"
                ],
                "stats": {  # Object
                    "total_courses": 150,
                    "avg_salary": "12 LPA",
                    "job_growth": "22%"
                },
                "featured_colleges": [  # Array of objects
                    {"name": "IIT Delhi", "rank": 1},
                    {"name": "IIT Bombay", "rank": 2}
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-pages/computer", 
                                                        comprehensive_test_data, token=self.admin_token)
            if success and isinstance(response, dict):
                # Verify all field types were saved
                field_types_correct = True
                type_errors = []
                
                # Check string fields
                string_fields = ["title", "subtitle", "theme", "filter_key", "filter_value"]
                for field in string_fields:
                    if not isinstance(response.get(field), str):
                        field_types_correct = False
                        type_errors.append(f"{field}: expected str, got {type(response.get(field))}")
                
                # Check array fields
                if not isinstance(response.get("benefits"), list):
                    field_types_correct = False
                    type_errors.append(f"benefits: expected list, got {type(response.get('benefits'))}")
                
                # Check object fields
                if not isinstance(response.get("stats"), dict):
                    field_types_correct = False
                    type_errors.append(f"stats: expected dict, got {type(response.get('stats'))}")
                
                if field_types_correct:
                    self.log_test("All Field Types Save Properly", True, 
                                 "Strings, arrays, and objects all saved with correct types")
                else:
                    self.log_test("All Field Types Save Properly", False, 
                                 f"Type errors: {'; '.join(type_errors[:3])}")
            else:
                self.log_test("All Field Types Save Properly", False, 
                             f"Status: {status}", response)

    def test_course_listing_pages_content_fields(self):
        """Test Course Listing Pages with intro_content and bottom_content fields as per review request"""
        print("📝 Testing Course Listing Pages Content Fields (Review Request)...")
        
        # Test 1: Main /courses page - Test /api/course-listing-settings
        print("   Testing Main /courses page - /api/course-listing-settings")
        
        # GET should return settings with all required fields including intro_content, bottom_content
        success, response, status = self.make_request("GET", "/course-listing-settings")
        if success and isinstance(response, dict):
            # Check for all required fields from review request
            required_fields = [
                "hero_title", "hero_subtitle", "trending_badge", "trending_title", 
                "trending_subtitle", "trending_courses", "stats_courses", "stats_colleges", 
                "stats_streams", "stats_students", "intro_content", "bottom_content", "faqs"
            ]
            
            present_fields = []
            missing_fields = []
            
            for field in required_fields:
                if field in response and response[field] is not None:
                    present_fields.append(field)
                else:
                    missing_fields.append(field)
            
            if len(present_fields) >= 10:  # At least 10 out of 13 fields should be present
                self.log_test("GET /course-listing-settings - Required Fields", True, 
                             f"Found {len(present_fields)}/13 required fields: {', '.join(present_fields[:5])}...")
                
                # Specifically check intro_content and bottom_content
                if "intro_content" in response:
                    self.log_test("GET /course-listing-settings - intro_content", True, 
                                 f"intro_content present: {len(str(response['intro_content']))} chars")
                else:
                    self.log_test("GET /course-listing-settings - intro_content", False, 
                                 "intro_content field missing")
                
                if "bottom_content" in response:
                    self.log_test("GET /course-listing-settings - bottom_content", True, 
                                 f"bottom_content present: {len(str(response['bottom_content']))} chars")
                else:
                    self.log_test("GET /course-listing-settings - bottom_content", False, 
                                 "bottom_content field missing")
                    
            else:
                self.log_test("GET /course-listing-settings - Required Fields", False, 
                             f"Only {len(present_fields)}/13 required fields present. Missing: {', '.join(missing_fields)}")
        else:
            self.log_test("GET /course-listing-settings", False, f"Status: {status}", response)
        
        # Test 2: PUT should save all fields including intro_content, bottom_content
        if self.admin_token:
            test_data = {
                "hero_title": "Test Course Listing 2025",
                "hero_subtitle": "Complete guide to courses in India",
                "trending_badge": "🔥 HOT",
                "trending_title": "Trending Courses",
                "trending_subtitle": "Most popular courses this year",
                "trending_courses": [
                    {"name": "B.Tech", "growth": "+25%", "icon": "🎓", "link": "/engineering"},
                    {"name": "MBBS", "growth": "+18%", "icon": "🏥", "link": "/medical"}
                ],
                "stats_courses": "500+",
                "stats_colleges": "2000+",
                "stats_streams": "50+",
                "stats_students": "10L+",
                "intro_content": "<p>Test intro content for course listing page</p>",
                "bottom_content": "<p>Test bottom content for course listing page</p>",
                "faqs": [
                    {"question": "What courses are available?", "answer": "We have 500+ courses across all streams."}
                ]
            }
            
            success, response, status = self.make_request("PUT", "/course-listing-settings", 
                                                        test_data, token=self.admin_token)
            if success and isinstance(response, dict):
                # Verify intro_content and bottom_content were saved
                if (response.get("intro_content") == test_data["intro_content"] and 
                    response.get("bottom_content") == test_data["bottom_content"]):
                    self.log_test("PUT /course-listing-settings - Content Fields", True, 
                                 "intro_content and bottom_content saved successfully")
                else:
                    self.log_test("PUT /course-listing-settings - Content Fields", False, 
                                 f"Content fields not saved correctly. intro: {response.get('intro_content')}, bottom: {response.get('bottom_content')}")
            else:
                self.log_test("PUT /course-listing-settings - Content Fields", False, 
                             f"Status: {status}", response)
        else:
            self.log_test("PUT /course-listing-settings - Content Fields", False, 
                         "Admin token not available")
        
        # Test 3: Individual Course Pages - Test /api/course-pages/{id}
        print("   Testing Individual Course Pages - /api/course-pages/{id}")
        
        test_pages = ["engineering", "medical", "after-10th", "diploma"]
        
        for page_id in test_pages:
            # GET should return settings with intro_content, bottom_content fields
            success, response, status = self.make_request("GET", f"/course-pages/{page_id}")
            if success and isinstance(response, dict):
                # Check for intro_content and bottom_content fields
                has_intro = "intro_content" in response
                has_bottom = "bottom_content" in response
                
                if has_intro and has_bottom:
                    self.log_test(f"GET /course-pages/{page_id} - Content Fields", True, 
                                 f"Both intro_content and bottom_content present")
                elif has_intro or has_bottom:
                    missing = "bottom_content" if has_intro else "intro_content"
                    self.log_test(f"GET /course-pages/{page_id} - Content Fields", False, 
                                 f"Missing {missing} field")
                else:
                    self.log_test(f"GET /course-pages/{page_id} - Content Fields", False, 
                                 "Both intro_content and bottom_content missing")
                
                # Test PUT to update intro_content and bottom_content
                if self.admin_token:
                    update_data = {
                        "id": page_id,
                        "title": response.get("title", f"{page_id.title()} Courses"),
                        "subtitle": response.get("subtitle", f"Updated subtitle for {page_id}"),
                        "intro_content": f"<p>Test intro content for {page_id} page</p>",
                        "bottom_content": f"<p>Test bottom content for {page_id} page</p>",
                        "filter_key": response.get("filter_key", "stream"),
                        "filter_value": response.get("filter_value", page_id.title()),
                        "theme": response.get("theme", "from-blue-500 to-purple-600")
                    }
                    
                    success, put_response, put_status = self.make_request("PUT", f"/course-pages/{page_id}", 
                                                                        update_data, token=self.admin_token)
                    if success and isinstance(put_response, dict):
                        # Verify content fields were updated
                        if (put_response.get("intro_content") == update_data["intro_content"] and 
                            put_response.get("bottom_content") == update_data["bottom_content"]):
                            self.log_test(f"PUT /course-pages/{page_id} - Update Content", True, 
                                         "intro_content and bottom_content updated successfully")
                            
                            # Verify changes persist with GET request
                            success, get_response, get_status = self.make_request("GET", f"/course-pages/{page_id}")
                            if success and isinstance(get_response, dict):
                                if (get_response.get("intro_content") == update_data["intro_content"] and 
                                    get_response.get("bottom_content") == update_data["bottom_content"]):
                                    self.log_test(f"GET /course-pages/{page_id} - Verify Persistence", True, 
                                                 "Updated content fields persist correctly")
                                else:
                                    self.log_test(f"GET /course-pages/{page_id} - Verify Persistence", False, 
                                                 "Updated content fields do not persist")
                            else:
                                self.log_test(f"GET /course-pages/{page_id} - Verify Persistence", False, 
                                             f"GET request failed with status: {get_status}")
                        else:
                            self.log_test(f"PUT /course-pages/{page_id} - Update Content", False, 
                                         "Content fields not updated correctly")
                    else:
                        self.log_test(f"PUT /course-pages/{page_id} - Update Content", False, 
                                     f"Status: {put_status}", put_response)
                else:
                    self.log_test(f"PUT /course-pages/{page_id} - Update Content", False, 
                                 "Admin token not available")
                    
            else:
                self.log_test(f"GET /course-pages/{page_id}", False, f"Status: {status}", response)
        
        # Test 4: Verify all 15 course pages return proper structure with content fields
        print("   Testing All 15 Course Pages Structure")
        
        success, response, status = self.make_request("GET", "/course-pages")
        if success and isinstance(response, list):
            if len(response) == 15:
                pages_with_content_fields = 0
                pages_missing_fields = []
                
                for page in response:
                    page_id = page.get("id", "unknown")
                    has_intro = "intro_content" in page
                    has_bottom = "bottom_content" in page
                    
                    if has_intro and has_bottom:
                        pages_with_content_fields += 1
                    else:
                        missing = []
                        if not has_intro:
                            missing.append("intro_content")
                        if not has_bottom:
                            missing.append("bottom_content")
                        pages_missing_fields.append(f"{page_id}({','.join(missing)})")
                
                if pages_with_content_fields == 15:
                    self.log_test("All 15 Course Pages - Content Fields Structure", True, 
                                 "All pages have intro_content and bottom_content fields")
                else:
                    self.log_test("All 15 Course Pages - Content Fields Structure", False, 
                                 f"Only {pages_with_content_fields}/15 pages have both content fields. Missing: {', '.join(pages_missing_fields[:5])}...")
            else:
                self.log_test("All 15 Course Pages - Count Verification", False, 
                             f"Expected 15 pages, got {len(response)}")
        else:
            self.log_test("All 15 Course Pages - Structure", False, f"Status: {status}", response)

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Comprehensive Backend API Testing...")
        print(f"🌐 Base URL: {BASE_URL}")
        print("=" * 60)
        
        # Run test suites in order - PRIORITY: Course Listing Settings and Course Pages
        self.test_authentication()
        
        # PRIORITY TESTS (as requested in review)
        self.test_course_listing_settings_comprehensive()  # Comprehensive Course Listing Settings
        self.test_course_pages_comprehensive()  # Comprehensive Course Pages Management
        
        # Other existing tests
        self.test_course_pages_management()  # Original course pages tests
        self.test_course_listing_settings()  # Original course listing tests
        self.test_advertisement_system()  # Advertisement tests
        self.test_old_college_routes()
        self.test_new_module_routes()
        self.test_other_critical_routes()
        self.test_admin_protected_routes()
        self.test_seo_url_filtering()
        self.test_expected_institutions()
        self.test_institution_details()
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