# Backend Routes Documentation

> ⚠️ **LOCKED** - Do not modify without permission

## Overview

This directory contains modularized API routers extracted from the main `server.py` file.

## Route Files

### Core Routes
| File | Prefix | Description |
|------|--------|-------------|
| `auth.py` | `/api` | User authentication |
| `user_auth.py` | `/api` | Extended user auth |
| `user_dashboard.py` | `/api` | User dashboard APIs |
| `institute_auth.py` | `/api` | Institute authentication |

### Content Management
| File | Prefix | Description |
|------|--------|-------------|
| `colleges.py` | `/api` | College CRUD |
| `universities.py` | `/api` | University CRUD |
| `schools.py` | `/api` | School CRUD |
| `blogs.py` | `/api` | Blog management |
| `news.py` | `/api` | News management |
| `listing_pages.py` | `/api` | Dynamic listing content |

### Advertisements & Leads
| File | Prefix | Description |
|------|--------|-------------|
| `advertisements.py` | `/api` | **Full ad management system** |
| `sponsored_ads.py` | `/api` | Sponsored advertisements |
| `leads.py` | `/api` | Lead management |
| `lead_forms.py` | `/api` | Lead form configuration |

### User Engagement
| File | Prefix | Description |
|------|--------|-------------|
| `reviews_questions.py` | `/api` | Reviews & Q&A (GET only) |
| `rewards_system.py` | `/api` | User rewards |
| `admin_rewards.py` | `/api` | Admin rewards management |

### Admin
| File | Prefix | Description |
|------|--------|-------------|
| `admin.py` | `/api` | Admin utilities |
| `admin_settings.py` | `/api` | Admin settings |
| `admin_auth_pages.py` | `/api` | Login/Signup content |
| `admin_counselors.py` | `/api` | Counselor management |

### Other
| File | Prefix | Description |
|------|--------|-------------|
| `admission_booking.py` | `/api` | Admission booking system |
| `courses_exams.py` | `/api` | Courses and exams |
| `exams.py` | `/api` | Exam endpoints |
| `financial_aid.py` | `/api` | Scholarships/loans |
| `homepage_settings.py` | `/api` | Homepage config |
| `study_abroad.py` | `/api` | Study abroad section |
| `taxonomy.py` | `/api` | Streams, boards, etc. |
| `uploads.py` | `/api` | File uploads |

## Pattern for Each Router

```python
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Module Name"])

# Database reference
db = None

def set_database(database):
    global db
    db = database

@router.get("/endpoint")
async def get_endpoint():
    ...
```

## Registration in server.py

All routers are registered in the `try` block around line 7220+ in `server.py`.

---

**Last Updated**: December 20, 2025
