#!/usr/bin/env python3
"""
Fix Menu Config for West Bengal Colleges
Using correct format like Delhi University
"""

import requests
import json
import time

BASE_URL = "https://admissionbuddy.co/api"
EMAIL = "admin@admissionbuddy.co"
PASSWORD = "admin123"

# Correct menu config format (like Delhi University)
CORRECT_MENU_CONFIG = {
    "use_custom_menu": False,
    "auto_from_toc": True,
    "items": [
        {"id": "info", "label": "Info", "enabled": True, "order": 1},
        {"id": "courses", "label": "Courses", "enabled": True, "order": 2},
        {"id": "admission", "label": "Admission", "enabled": True, "order": 3},
        {"id": "cutoff", "label": "Cutoff", "enabled": True, "order": 4},
        {"id": "placement", "label": "Placement", "enabled": True, "order": 5},
        {"id": "ranking", "label": "Ranking", "enabled": True, "order": 6},
        {"id": "scholarship", "label": "Scholarship", "enabled": True, "order": 7},
        {"id": "facilities", "label": "Facilities", "enabled": True, "order": 8},
        {"id": "gallery", "label": "Gallery", "enabled": True, "order": 9},
        {"id": "reviews", "label": "Reviews", "enabled": True, "order": 10}
    ]
}

# Medical colleges don't need placement
MEDICAL_MENU_CONFIG = {
    "use_custom_menu": False,
    "auto_from_toc": True,
    "items": [
        {"id": "info", "label": "Info", "enabled": True, "order": 1},
        {"id": "courses", "label": "Courses", "enabled": True, "order": 2},
        {"id": "admission", "label": "Admission", "enabled": True, "order": 3},
        {"id": "cutoff", "label": "Cutoff", "enabled": True, "order": 4},
        {"id": "ranking", "label": "Ranking", "enabled": True, "order": 5},
        {"id": "scholarship", "label": "Scholarship", "enabled": True, "order": 6},
        {"id": "facilities", "label": "Facilities", "enabled": True, "order": 7},
        {"id": "gallery", "label": "Gallery", "enabled": True, "order": 8},
        {"id": "reviews", "label": "Reviews", "enabled": True, "order": 9}
    ]
}


def login():
    """Login and get access token"""
    print("🔑 Logging in...")
    response = requests.post(
        f"{BASE_URL}/auth/admin-login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    if response.status_code == 200:
        token = response.json().get("access_token")
        print("✅ Login successful!")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None


def get_all_colleges(token):
    """Get all colleges"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/colleges?limit=100", headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data.get('colleges', data) if isinstance(data, dict) else data
    return []


def update_college(token, college_id, update_data):
    """Update a college"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.put(
        f"{BASE_URL}/colleges/{college_id}",
        headers=headers,
        json=update_data
    )
    return response


def main():
    token = login()
    if not token:
        return
    
    colleges = get_all_colleges(token)
    print(f"\n📚 Found {len(colleges)} colleges\n")
    
    success = 0
    failed = 0
    
    for college in colleges:
        college_id = college.get('id')
        name = college.get('name', '')
        state = college.get('location', {}).get('state', '')
        
        # Only update West Bengal colleges
        if state != 'West Bengal':
            continue
        
        # Check if menu_config needs fixing
        current_config = college.get('menu_config', {})
        if current_config.get('items'):
            # Already has correct format
            print(f"⏭️  {name} - Already has correct menu format")
            continue
        
        print(f"Fixing: {name}...")
        
        # Use medical config for medical colleges
        streams = college.get('streams', [])
        if 'Medical' in streams and len(streams) == 1:
            menu_config = MEDICAL_MENU_CONFIG
        else:
            menu_config = CORRECT_MENU_CONFIG
        
        update_data = {
            "menu_config": menu_config
        }
        
        try:
            response = update_college(token, college_id, update_data)
            if response.status_code == 200:
                print(f"  ✅ Fixed successfully")
                success += 1
            else:
                print(f"  ❌ Failed: {response.text[:100]}")
                failed += 1
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            failed += 1
        
        time.sleep(0.3)
    
    print("\n" + "="*50)
    print(f"✅ Successfully fixed: {success}")
    print(f"❌ Failed: {failed}")
    print("="*50)


if __name__ == "__main__":
    main()
