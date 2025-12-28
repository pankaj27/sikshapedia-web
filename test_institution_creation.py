#!/usr/bin/env python3
"""
Focused test for Institution Creation as per Review Request
"""

import requests
import json
import sys

# Backend URL from frontend .env
BASE_URL = "https://formsaver-2.preview.emergentagent.com/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

class InstitutionCreationTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        self.created_institution_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data = None):
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
    
    def make_request(self, method: str, endpoint: str, data: dict = None, 
                    headers: dict = None, token: str = None) -> tuple:
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

    def test_admin_authentication(self):
        """Test admin authentication"""
        print("🔐 Testing Admin Authentication...")
        
        # Test admin login
        success, response, status = self.make_request("POST", "/auth/admin-login", ADMIN_CREDENTIALS)
        if success and "access_token" in response:
            self.admin_token = response["access_token"]
            user_info = response.get('user', {})
            self.log_test("Admin Authentication", True, 
                         f"Admin token received, user: {user_info.get('name', 'N/A')}, role: {user_info.get('role', 'N/A')}")
        else:
            self.log_test("Admin Authentication", False, f"Status: {status}", response)

    def test_institution_creation_comprehensive(self):
        """Test comprehensive institution creation as per review request"""
        print("🏛️ Testing Comprehensive Institution Creation (Review Request)...")
        
        if not self.admin_token:
            self.log_test("Institution Creation Tests (skipped)", False, "No admin token available")
            return
        
        # Test 1: Create IIM Ahmedabad (College) with TOC Menu
        iim_data = {
            "name": "Indian Institute of Management Ahmedabad",
            "slug": "iim-ahmedabad",
            "institution_type": "College",
            "type": "Private",
            "established_year": 1961,
            "average_fees": 2300000.0,
            "description": "IIM Ahmedabad is one of India's premier management institutes, known for its rigorous academic programs and excellent placement records.",
            "location": {
                "state": "Gujarat",
                "city": "Ahmedabad",
                "address": "Vastrapur, Ahmedabad, Gujarat 380015"
            },
            "contact_info": {
                "phone": "+91-79-66324600",
                "email": "info@iima.ac.in",
                "website": "https://www.iima.ac.in"
            },
            "menu_config": {
                "use_custom_menu": False,
                "auto_from_toc": True
            },
            "is_verified": True,
            "is_admission_partner": True,
            "is_admission_open": True,
            "is_no_cost_emi": True,
            "is_featured": True,
            "nirf_ranking": 1,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Indian_Institute_of_Management_Ahmedabad_Logo.svg/1200px-Indian_Institute_of_Management_Ahmedabad_Logo.svg.png",
            "banner_url": "https://images.shiksha.com/mediadata/images/1533559265phpPXNNKF.jpeg",
            "campus_video_url": "https://www.youtube.com/embed/example123",
            "courses": [
                {
                    "name": "MBA",
                    "degree_type": "PG",
                    "duration": "2 Years",
                    "fees": 2300000,
                    "eligibility": "Graduate with CAT score"
                },
                {
                    "name": "PGPX",
                    "degree_type": "PG",
                    "duration": "1 Year", 
                    "fees": 3200000,
                    "eligibility": "8+ years work experience"
                },
                {
                    "name": "PhD",
                    "degree_type": "Doctorate",
                    "duration": "4 Years",
                    "fees": 100000,
                    "eligibility": "Master's degree"
                }
            ],
            "placement": {
                "highest_package": 7500000,
                "average_package": 3200000,
                "placement_rate": 98,
                "top_recruiters": ["Amazon", "Google", "McKinsey", "BCG", "Goldman Sachs"]
            },
            "seo_faqs": [
                {
                    "question": "What is the admission process for IIM Ahmedabad?",
                    "answer": "Admission is through CAT score followed by WAT-PI rounds."
                },
                {
                    "question": "What is the average package at IIMA?",
                    "answer": "The average package is around ₹32 LPA."
                },
                {
                    "question": "Does IIMA offer hostel facilities?",
                    "answer": "Yes, IIMA has excellent hostel facilities for all students."
                }
            ],
            "facilities": ["Library", "Hostel", "Cafeteria", "Sports Complex", "Computer Lab", "WiFi"],
            "admission_dates": [
                {
                    "title": "Application Start",
                    "date": "January 2026"
                },
                {
                    "title": "Application End", 
                    "date": "March 2026"
                },
                {
                    "title": "Results",
                    "date": "May 2026"
                }
            ],
            "status": "published"
        }
        
        success, response, status = self.make_request("POST", "/colleges", iim_data, token=self.admin_token)
        if success and response.get("id"):
            iim_id = response.get("id")
            self.created_institution_ids.append({"id": iim_id, "name": "IIM Ahmedabad", "type": "College"})
            self.log_test("Create IIM Ahmedabad (College with TOC Menu)", True, f"Created institution ID: {iim_id}")
        else:
            self.log_test("Create IIM Ahmedabad (College with TOC Menu)", False, f"Status: {status}", response)
        
        # Test 2: Create The Doon School (School) with Default Menu
        doon_data = {
            "name": "The Doon School",
            "slug": "the-doon-school",
            "institution_type": "School",
            "type": "Private",
            "established_year": 1935,
            "average_fees": 1300000.0,
            "description": "The Doon School is one of India's most prestigious boarding schools, known for its holistic education and character building.",
            "location": {
                "state": "Uttarakhand",
                "city": "Dehradun",
                "address": "Mall Road, Dehradun, Uttarakhand 248001"
            },
            "contact_info": {
                "phone": "+91-135-2526400",
                "email": "info@doonschool.com",
                "website": "https://www.doonschool.com"
            },
            "menu_config": {
                "use_custom_menu": False,
                "auto_from_toc": False
            },
            "is_verified": True,
            "is_admission_partner": True,
            "is_admission_open": True,
            "is_no_cost_emi": True,
            "is_featured": True,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/The_Doon_School_crest.png/220px-The_Doon_School_crest.png",
            "banner_url": "https://images.shiksha.com/mediadata/images/1604567892phpnVvvTw.jpeg",
            "campus_video_url": "https://www.youtube.com/embed/schoolvideo123",
            "courses": [
                {
                    "name": "Class 7",
                    "degree_type": "Secondary",
                    "duration": "1 Year",
                    "fees": 1200000
                },
                {
                    "name": "Class 8",
                    "degree_type": "Secondary",
                    "duration": "1 Year",
                    "fees": 1200000
                },
                {
                    "name": "Class 12",
                    "degree_type": "Senior Secondary",
                    "duration": "1 Year",
                    "fees": 1500000
                }
            ],
            "seo_faqs": [
                {
                    "question": "What is the admission age for The Doon School?",
                    "answer": "Students must be between 12-13 years for Class 7."
                },
                {
                    "question": "Is The Doon School a boarding school?",
                    "answer": "Yes, it is a fully residential boarding school."
                },
                {
                    "question": "What extracurricular activities are offered?",
                    "answer": "Sports, music, drama, debate, and many clubs."
                }
            ],
            "facilities": ["Library", "Hostel", "Swimming Pool", "Cricket Ground", "Music Room", "Art Studio"],
            "status": "published"
        }
        
        success, response, status = self.make_request("POST", "/colleges", doon_data, token=self.admin_token)
        if success and response.get("id"):
            doon_id = response.get("id")
            self.created_institution_ids.append({"id": doon_id, "name": "The Doon School", "type": "School"})
            self.log_test("Create The Doon School (School with Default Menu)", True, f"Created institution ID: {doon_id}")
        else:
            self.log_test("Create The Doon School (School with Default Menu)", False, f"Status: {status}", response)
        
        # Test 3: Create IIT Delhi (University) with Custom Menu
        iit_data = {
            "name": "Indian Institute of Technology Delhi",
            "slug": "iit-delhi",
            "institution_type": "University",
            "type": "Government",
            "established_year": 1961,
            "average_fees": 600000.0,
            "description": "IIT Delhi is one of India's premier engineering institutes, renowned for its cutting-edge research and excellent academic programs.",
            "location": {
                "state": "Delhi",
                "city": "New Delhi",
                "address": "Hauz Khas, New Delhi 110016"
            },
            "contact_info": {
                "phone": "+91-11-26591999",
                "email": "info@iitd.ac.in",
                "website": "https://www.iitd.ac.in"
            },
            "menu_config": {
                "use_custom_menu": True,
                "auto_from_toc": False,
                "items": [
                    {"id": "overview", "label": "Overview", "enabled": True, "order": 1},
                    {"id": "courses", "label": "Courses & Fees", "enabled": True, "order": 2},
                    {"id": "admissions", "label": "Admissions", "enabled": True, "order": 3},
                    {"id": "placements", "label": "Placements", "enabled": True, "order": 4}
                ]
            },
            "is_verified": True,
            "is_admission_partner": True,
            "is_admission_open": True,
            "is_no_cost_emi": True,
            "is_featured": True,
            "nirf_ranking": 2,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/1200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png",
            "banner_url": "https://images.shiksha.com/mediadata/images/1533631395phpEDXkPV.jpeg",
            "campus_video_url": "https://www.youtube.com/embed/iitdelhivideo",
            "courses": [
                {
                    "name": "B.Tech",
                    "degree_type": "UG",
                    "duration": "4 Years",
                    "fees": 800000,
                    "eligibility": "JEE Advanced rank"
                },
                {
                    "name": "M.Tech",
                    "degree_type": "PG",
                    "duration": "2 Years",
                    "fees": 400000,
                    "eligibility": "GATE score"
                },
                {
                    "name": "PhD",
                    "degree_type": "Doctorate",
                    "duration": "5 Years",
                    "fees": 50000,
                    "eligibility": "Master's degree"
                }
            ],
            "placement": {
                "highest_package": 20000000,
                "average_package": 1800000,
                "placement_rate": 95,
                "top_recruiters": ["Microsoft", "Google", "Apple", "Uber", "Adobe"]
            },
            "seo_faqs": [
                {
                    "question": "How to get admission in IIT Delhi?",
                    "answer": "Through JEE Advanced for B.Tech and GATE for M.Tech."
                },
                {
                    "question": "What is the highest package at IIT Delhi?",
                    "answer": "The highest package is around ₹2 Crore per annum."
                },
                {
                    "question": "Does IIT Delhi have campus placements?",
                    "answer": "Yes, with 95%+ placement rate."
                }
            ],
            "facilities": ["Library", "Hostel", "Sports Complex", "Research Labs", "Cafeteria", "Hospital"],
            "admission_dates": [
                {
                    "title": "JEE Advanced",
                    "date": "June 2026"
                },
                {
                    "title": "Counseling",
                    "date": "July 2026"
                },
                {
                    "title": "Classes Start",
                    "date": "August 2026"
                }
            ],
            "status": "published"
        }
        
        success, response, status = self.make_request("POST", "/colleges", iit_data, token=self.admin_token)
        if success and response.get("id"):
            iit_id = response.get("id")
            self.created_institution_ids.append({"id": iit_id, "name": "IIT Delhi", "type": "University"})
            self.log_test("Create IIT Delhi (University with Custom Menu)", True, f"Created institution ID: {iit_id}")
        else:
            self.log_test("Create IIT Delhi (University with Custom Menu)", False, f"Status: {status}", response)

    def test_created_institutions_verification(self):
        """Verify the created institutions appear correctly in listings and detail pages"""
        print("✅ Testing Created Institutions Verification...")
        
        if not self.created_institution_ids:
            self.log_test("Institution Verification (skipped)", False, "No institutions were created in previous test")
            return
        
        # Test 1: Verify institutions appear in admin listing
        success, response, status = self.make_request("GET", "/colleges", token=self.admin_token)
        if success and isinstance(response, list):
            found_institutions = []
            for created_inst in self.created_institution_ids:
                for inst in response:
                    if inst.get("id") == created_inst["id"] or created_inst["name"].lower() in inst.get("name", "").lower():
                        found_institutions.append(created_inst["name"])
                        break
            
            if len(found_institutions) == len(self.created_institution_ids):
                self.log_test("Institutions Appear in Admin Listing", True, f"All {len(found_institutions)} institutions found in listing")
            else:
                self.log_test("Institutions Appear in Admin Listing", False, f"Only {len(found_institutions)}/{len(self.created_institution_ids)} institutions found")
        else:
            self.log_test("Institutions Appear in Admin Listing", False, f"Status: {status}", response)
        
        # Test 2: Verify each institution's detail page
        for created_inst in self.created_institution_ids:
            inst_id = created_inst["id"]
            inst_name = created_inst["name"]
            
            success, response, status = self.make_request("GET", f"/colleges/{inst_id}")
            if success and isinstance(response, dict):
                # Verify basic details
                name_match = inst_name.lower() in response.get("name", "").lower()
                has_badges = all(response.get(badge, False) for badge in ["is_verified", "is_admission_partner", "is_admission_open", "is_no_cost_emi", "is_featured"])
                has_media = response.get("logo_url") and response.get("banner_url")
                has_courses = response.get("courses") and len(response.get("courses", [])) >= 3
                has_faqs = response.get("seo_faqs") and len(response.get("seo_faqs", [])) >= 3
                has_facilities = response.get("facilities") and len(response.get("facilities", [])) > 0
                
                verification_details = []
                if name_match: verification_details.append("Name")
                if has_badges: verification_details.append("All Badges")
                if has_media: verification_details.append("Logo & Banner")
                if has_courses: verification_details.append("Courses")
                if has_faqs: verification_details.append("FAQs")
                if has_facilities: verification_details.append("Facilities")
                
                # Verify menu configuration
                menu_config = response.get("menu_config", {})
                if inst_name == "IIM Ahmedabad":
                    menu_correct = menu_config.get("auto_from_toc") == True
                    menu_type = "TOC Menu"
                elif inst_name == "The Doon School":
                    menu_correct = menu_config.get("use_custom_menu") == False and menu_config.get("auto_from_toc") == False
                    menu_type = "Default Menu"
                elif inst_name == "IIT Delhi":
                    menu_correct = menu_config.get("use_custom_menu") == True
                    menu_type = "Custom Menu"
                else:
                    menu_correct = True
                    menu_type = "Unknown"
                
                if menu_correct: verification_details.append(menu_type)
                
                # Check placement data for colleges/universities
                if created_inst["type"] in ["College", "University"]:
                    placement_data = response.get("placement", {}) or {}
                    has_placement = placement_data.get("highest_package") and placement_data.get("average_package")
                    if has_placement: verification_details.append("Placement Data")
                
                if len(verification_details) >= 6:  # At least 6 components should be present
                    self.log_test(f"Detail Page: {inst_name}", True, f"Verified: {', '.join(verification_details)}")
                else:
                    self.log_test(f"Detail Page: {inst_name}", False, f"Only verified: {', '.join(verification_details)}")
            else:
                self.log_test(f"Detail Page: {inst_name}", False, f"Status: {status}", response)
        
        # Test 3: Verify "Book Your Seat" sidebar appears (for admission partners)
        for created_inst in self.created_institution_ids:
            inst_id = created_inst["id"]
            inst_name = created_inst["name"]
            
            success, response, status = self.make_request("GET", f"/colleges/{inst_id}")
            if success and isinstance(response, dict):
                is_admission_partner = response.get("is_admission_partner", False)
                sidebar_widgets = response.get("sidebar_widgets", {})
                quick_actions = sidebar_widgets.get("quick_actions", {})
                
                if is_admission_partner and quick_actions.get("enabled", False):
                    self.log_test(f"Book Your Seat Sidebar: {inst_name}", True, "Admission partner with enabled sidebar widgets")
                elif is_admission_partner:
                    self.log_test(f"Book Your Seat Sidebar: {inst_name}", False, "Admission partner but sidebar widgets not enabled")
                else:
                    self.log_test(f"Book Your Seat Sidebar: {inst_name}", False, "Not marked as admission partner")
            else:
                self.log_test(f"Book Your Seat Sidebar: {inst_name}", False, f"Could not verify - Status: {status}")

    def run_tests(self):
        """Run all institution creation tests"""
        print("🚀 Starting Institution Creation Testing...")
        print(f"Base URL: {BASE_URL}")
        print("=" * 80)
        
        self.test_admin_authentication()
        self.test_institution_creation_comprehensive()
        self.test_created_institutions_verification()
        
        # Print summary
        print("=" * 80)
        print("📊 INSTITUTION CREATION TEST SUMMARY")
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
        
        if self.created_institution_ids:
            print(f"\n🏛️ CREATED INSTITUTIONS:")
            for inst in self.created_institution_ids:
                print(f"  - {inst['name']} ({inst['type']}) - ID: {inst['id']}")
        
        print("\n" + "=" * 60)
        return failed_tests == 0

if __name__ == "__main__":
    tester = InstitutionCreationTester()
    success = tester.run_tests()
    sys.exit(0 if success else 1)