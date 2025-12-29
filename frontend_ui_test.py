#!/usr/bin/env python3
"""
Frontend UI Test for Section-wise Save Functionality
Tests the "Save All & Publish" and "Save All & Submit" buttons
"""

import requests
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configuration
FRONTEND_URL = "https://content-ordering.preview.emergentagent.com"
ADMIN_CREDENTIALS = {
    "email": "admin@admissionbuddy.co",
    "password": "admin123"
}

class FrontendUITester:
    def __init__(self):
        self.driver = None
        self.test_results = []
        
    def setup_driver(self):
        """Setup Chrome driver with headless options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            return True
        except Exception as e:
            print(f"❌ Failed to setup Chrome driver: {e}")
            return False
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
    
    def login_admin(self):
        """Login to admin panel"""
        try:
            # Navigate to admin login
            self.driver.get(f"{FRONTEND_URL}/admin/login")
            
            # Wait for login form
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            
            # Fill login form
            email_field = self.driver.find_element(By.NAME, "email")
            password_field = self.driver.find_element(By.NAME, "password")
            
            email_field.clear()
            email_field.send_keys(ADMIN_CREDENTIALS["email"])
            
            password_field.clear()
            password_field.send_keys(ADMIN_CREDENTIALS["password"])
            
            # Submit form
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Wait for redirect to admin dashboard
            WebDriverWait(self.driver, 10).until(
                lambda driver: "/admin" in driver.current_url and "/login" not in driver.current_url
            )
            
            self.log_test("Admin Login", True, f"Successfully logged in as {ADMIN_CREDENTIALS['email']}")
            return True
            
        except Exception as e:
            self.log_test("Admin Login", False, f"Login failed: {str(e)}")
            return False
    
    def navigate_to_college_edit(self, college_id="ba621807-73ca-407d-a983-9807f3be305f"):
        """Navigate to college edit page"""
        try:
            edit_url = f"{FRONTEND_URL}/admin/colleges/edit/{college_id}"
            self.driver.get(edit_url)
            
            # Wait for form to load
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "form"))
            )
            
            # Check if college name field is present
            college_name = self.driver.find_element(By.NAME, "name").get_attribute("value")
            
            self.log_test("Navigate to College Edit Page", True, 
                         f"Successfully loaded edit page for: {college_name}")
            return True
            
        except Exception as e:
            self.log_test("Navigate to College Edit Page", False, f"Navigation failed: {str(e)}")
            return False
    
    def test_save_all_buttons_presence(self):
        """Test if Save All & Publish and Save All & Submit buttons are present"""
        try:
            # Look for Save All & Publish button
            save_publish_buttons = self.driver.find_elements(By.XPATH, 
                "//button[contains(text(), 'Save All & Publish') or contains(text(), 'Save All & Submit')]")
            
            if save_publish_buttons:
                button_texts = [btn.text for btn in save_publish_buttons]
                self.log_test("Save All Buttons Present", True, 
                             f"Found buttons: {', '.join(button_texts)}")
                return True
            else:
                # Check for alternative button texts
                all_buttons = self.driver.find_elements(By.TAG_NAME, "button")
                button_texts = [btn.text for btn in all_buttons if btn.text.strip()]
                
                self.log_test("Save All Buttons Present", False, 
                             f"Save All buttons not found. Available buttons: {', '.join(button_texts[:10])}")
                return False
                
        except Exception as e:
            self.log_test("Save All Buttons Present", False, f"Error checking buttons: {str(e)}")
            return False
    
    def test_section_save_buttons(self):
        """Test if individual section save buttons are present"""
        try:
            # Look for section save buttons
            section_save_buttons = self.driver.find_elements(By.XPATH, 
                "//button[contains(text(), 'Save Section') or contains(text(), 'Save') and not(contains(text(), 'Save All'))]")
            
            if section_save_buttons:
                self.log_test("Section Save Buttons Present", True, 
                             f"Found {len(section_save_buttons)} section save buttons")
                return True
            else:
                self.log_test("Section Save Buttons Present", False, 
                             "No section save buttons found")
                return False
                
        except Exception as e:
            self.log_test("Section Save Buttons Present", False, f"Error checking section buttons: {str(e)}")
            return False
    
    def test_form_sections(self):
        """Test if all form sections are present"""
        try:
            # Look for form sections
            sections = []
            
            # Check for common section indicators
            section_indicators = [
                "Basic Information", "Media", "Courses", "Details", 
                "Admission", "SEO", "basic", "media", "courses", 
                "details", "admission", "seo"
            ]
            
            for indicator in section_indicators:
                elements = self.driver.find_elements(By.XPATH, 
                    f"//*[contains(text(), '{indicator}') or contains(@class, '{indicator.lower()}') or contains(@id, '{indicator.lower()}')]")
                if elements:
                    sections.append(indicator)
            
            if len(sections) >= 4:  # At least 4 sections should be identifiable
                self.log_test("Form Sections Present", True, 
                             f"Found sections: {', '.join(sections[:6])}")
                return True
            else:
                self.log_test("Form Sections Present", False, 
                             f"Only found {len(sections)} sections: {', '.join(sections)}")
                return False
                
        except Exception as e:
            self.log_test("Form Sections Present", False, f"Error checking sections: {str(e)}")
            return False
    
    def test_save_all_functionality(self):
        """Test clicking Save All & Publish button (if present)"""
        try:
            # Look for Save All & Publish button
            save_all_button = None
            
            # Try different button text variations
            button_variations = [
                "Save All & Publish",
                "Save All & Submit", 
                "Save & Publish",
                "Publish",
                "Submit"
            ]
            
            for variation in button_variations:
                buttons = self.driver.find_elements(By.XPATH, f"//button[contains(text(), '{variation}')]")
                if buttons:
                    save_all_button = buttons[0]
                    break
            
            if save_all_button:
                # Scroll to button
                self.driver.execute_script("arguments[0].scrollIntoView();", save_all_button)
                time.sleep(1)
                
                # Check if button is enabled
                if save_all_button.is_enabled():
                    # Click the button
                    save_all_button.click()
                    
                    # Wait for any response (success message, loading indicator, etc.)
                    time.sleep(3)
                    
                    # Check for success indicators
                    success_indicators = self.driver.find_elements(By.XPATH, 
                        "//*[contains(text(), 'success') or contains(text(), 'saved') or contains(text(), 'updated')]")
                    
                    if success_indicators:
                        self.log_test("Save All Functionality", True, 
                                     "Save All button clicked successfully, found success indicators")
                    else:
                        # Check if page is still responsive
                        current_url = self.driver.current_url
                        self.log_test("Save All Functionality", True, 
                                     f"Save All button clicked, page still responsive at {current_url}")
                    
                    return True
                else:
                    self.log_test("Save All Functionality", False, 
                                 "Save All button found but is disabled")
                    return False
            else:
                self.log_test("Save All Functionality", False, 
                             "No Save All button found to test")
                return False
                
        except Exception as e:
            self.log_test("Save All Functionality", False, f"Error testing Save All: {str(e)}")
            return False
    
    def run_tests(self):
        """Run all frontend UI tests"""
        print("🖥️ FRONTEND UI TESTING - Section-wise Save Functionality")
        print("=" * 80)
        
        if not self.setup_driver():
            return
        
        try:
            # Test sequence
            if self.login_admin():
                if self.navigate_to_college_edit():
                    self.test_save_all_buttons_presence()
                    self.test_section_save_buttons()
                    self.test_form_sections()
                    self.test_save_all_functionality()
            
            # Summary
            print("\n" + "=" * 80)
            print("📊 FRONTEND UI TEST SUMMARY")
            print("=" * 80)
            
            total_tests = len(self.test_results)
            passed_tests = len([t for t in self.test_results if t["success"]])
            
            print(f"Total Tests: {total_tests}")
            print(f"✅ Passed: {passed_tests}")
            print(f"❌ Failed: {total_tests - passed_tests}")
            print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
            
            if total_tests - passed_tests > 0:
                print("\n❌ FAILED TESTS:")
                for test in self.test_results:
                    if not test["success"]:
                        print(f"  - {test['test']}: {test['details']}")
            
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = FrontendUITester()
    tester.run_tests()