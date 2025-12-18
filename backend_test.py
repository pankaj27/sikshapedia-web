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
BASE_URL = "https://eduadmin-35.preview.emergentagent.com/api"

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

    def test_advertisement_system(self):
        """Test Advanced Advertisement Management System"""
        print("📢 Testing Advanced Advertisement Management System...")
        
        # Store created ad IDs for cleanup and tracking tests
        self.created_ad_ids = []
        
        # Test 1: Create Banner Ad with Custom URL Targeting
        banner_ad_data = {
            "name": "Test Banner Ad - Maharashtra",
            "title": "Top Engineering Colleges",
            "description": "Explore top colleges in Maharashtra",
            "ad_type": "banner",
            "image_url": "https://via.placeholder.com/728x90?text=Banner+Ad",
            "click_url": "https://example.com/colleges",
            "banner_size": "728x90",
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
        if success and response.get("success"):
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
        if success and response.get("success"):
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
        if success and response.get("success"):
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

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Comprehensive Backend API Testing...")
        print(f"🌐 Base URL: {BASE_URL}")
        print("=" * 60)
        
        # Run test suites in order
        self.test_authentication()
        self.test_advertisement_system()  # Add advertisement tests
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