#!/usr/bin/env python3
"""
Focused test for the two issues found
"""

import requests
import json

BASE_URL = "https://eduportal-272.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {"email": "admin@admissionbuddy.co", "password": "admin123"}

def test_admin_stats_protection():
    """Test that admin stats is now properly protected"""
    print("Testing admin stats protection...")
    
    # Test without token (should fail)
    response = requests.get(f"{BASE_URL}/admin/stats")
    print(f"Without token: Status {response.status_code} (should be 401/403)")
    
    # Test with admin token (should work)
    login_response = requests.post(f"{BASE_URL}/auth/admin-login", json=ADMIN_CREDENTIALS)
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        print(f"With admin token: Status {response.status_code} (should be 200)")
        if response.status_code == 200:
            data = response.json()
            print(f"Total colleges: {data.get('total_colleges', 'N/A')}")
    else:
        print("Failed to get admin token")

def test_exams_endpoint():
    """Test the exams endpoint"""
    print("\nTesting exams endpoint...")
    
    response = requests.get(f"{BASE_URL}/exams")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Retrieved {len(data)} exams")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_admin_stats_protection()
    test_exams_endpoint()