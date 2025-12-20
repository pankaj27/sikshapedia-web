# AdmissionBuddy - Complete Codebase Documentation

> ⚠️ **CODE LOCK NOTICE**: This codebase is locked as of December 20, 2025.
> No changes should be made without explicit user permission.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Backend Structure](#backend-structure)
5. [Frontend Structure](#frontend-structure)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Database Schema](#database-schema)
8. [Third-Party Integrations](#third-party-integrations)
9. [Admin Credentials](#admin-credentials)
10. [Known Issues & Technical Debt](#known-issues--technical-debt)

---

## Project Overview

**AdmissionBuddy** is a comprehensive education platform that helps students find colleges, universities, and schools across India. The platform includes:

- College/University/School listings with filters
- User reviews and Q&A system
- Lead generation and counseling
- Admission booking system
- Rewards system for user engagement
- Advertisement management
- Study abroad section
- Dynamic content management (CMS)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Shadcn UI |
| Backend | FastAPI (Python 3.11) |
| Database | MongoDB (Motor async driver) |
| Authentication | JWT + Emergent Google OAuth |
| Payments | Razorpay (mocked), Stripe |
| Email | Resend API |
| WhatsApp | Twilio API |
| File Storage | Local static files |

---

## Architecture Overview

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application (6,772 lines)
│   ├── routes/             # Modular API routers (30 files)
│   ├── modules/            # Additional modular components
│   ├── static/uploads/     # Uploaded files
│   ├── uploads/            # Admission documents
│   └── .env                # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React page components (59 files)
│   │   ├── components/     # Reusable components
│   │   ├── api/            # Axios API configuration
│   │   └── App.js          # Main router
│   └── .env                # Frontend environment variables
│
└── CODEBASE_DOCUMENTATION.md  # This file
```

---

## Backend Structure

### Main Application: `/app/backend/server.py`
- **Lines**: 6,772
- **Purpose**: Core FastAPI app with remaining endpoints not yet modularized
- **Contains**: Models, authentication, reviews/questions POST, static pages CMS, etc.

### Modular Routes: `/app/backend/routes/`

| File | Purpose | Lines |
|------|---------|-------|
| `admin.py` | Admin utilities | 785 |
| `admin_auth_pages.py` | Login/Signup page content management | 5,180 |
| `admin_counselors.py` | Counselor management | 5,088 |
| `admin_rewards.py` | Admin rewards management | 20,189 |
| `admin_settings.py` | Admin settings | 4,319 |
| `admission_booking.py` | Admission booking system | 35,783 |
| `advertisements.py` | **Advertisement management (NEWLY EXTRACTED)** | 23,536 |
| `auth.py` | Authentication routes | 5,501 |
| `blogs.py` | Blog management | 5,437 |
| `colleges.py` | College CRUD operations | 12,449 |
| `courses_exams.py` | Courses and exams management | 14,541 |
| `exams.py` | Exam endpoints | 3,040 |
| `financial_aid.py` | Financial aid/scholarships | 8,681 |
| `homepage_settings.py` | Homepage configuration | 10,509 |
| `institute_auth.py` | Institute authentication & dashboard | 23,523 |
| `lead_forms.py` | Lead form management | 7,056 |
| `leads.py` | Lead management & settings | 16,693 |
| `listing_pages.py` | Dynamic listing page content | 7,118 |
| `news.py` | News management | 6,680 |
| `reviews_questions.py` | Reviews & Q&A (GET endpoints) | 6,870 |
| `rewards_system.py` | User rewards system | 20,547 |
| `schools.py` | School CRUD operations | 5,850 |
| `sponsored_ads.py` | Sponsored advertisements | 12,857 |
| `study_abroad.py` | Study abroad section | 8,583 |
| `taxonomy.py` | Streams, boards, categories | 4,384 |
| `universities.py` | University CRUD operations | 4,600 |
| `uploads.py` | File upload utilities | 454 |
| `user_auth.py` | User authentication | 15,359 |
| `user_dashboard.py` | User dashboard | 18,641 |

---

## Frontend Structure

### Key Pages: `/app/frontend/src/pages/`

#### Public Pages
- `HomePage.js` - Main landing page
- `DynamicListingPage.js` - College/School/University listings with filters
- `CollegeDetailPage.js` - Individual college details
- `LoginPage.js` - User login (dynamic content from API)
- `UserSignup.js` - User registration (dynamic content from API)
- `AboutPage.js` - About us page
- `ContactPage.js` - Contact page

#### Admin Pages (`/pages/admin/`)
- `AdminDashboard.js` - Admin home
- `CollegeForm.js` - College management (~6,000 lines - needs refactoring)
- `AdvertisementsManagement.js` - Ad management
- `AuthPagesManagement.js` - Login/Signup content editor
- `LeadSettings.js` - Lead form & floating button settings
- `LeadsList.js` - View all leads
- And many more...

#### Institute Pages (`/pages/institute/`)
- Institute dashboard and management pages

#### User Pages
- `UserDashboard.js` - User profile and dashboard

### Key Components: `/app/frontend/src/components/`

- `FloatingApplyButton.js` - Floating CTA button (controlled from Lead Settings)
- `ApplyNowModal.js` - Apply form modal
- `AdBanner.js` - Advertisement display component
- `Header.js` / `Footer.js` - Layout components
- `admin/AdminLayout.js` - Admin panel layout

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/google             - Google OAuth login
GET    /api/auth/me                 - Get current user
```

### Colleges
```
GET    /api/colleges                - List all colleges
GET    /api/colleges/{id}           - Get college details
POST   /api/colleges                - Create college (admin)
PUT    /api/colleges/{id}           - Update college (admin)
DELETE /api/colleges/{id}           - Delete college (admin)
```

### Universities & Schools
```
GET    /api/universities            - List universities
GET    /api/schools                 - List schools
(Similar CRUD patterns as colleges)
```

### Advertisements (NEW - Modularized)
```
GET    /api/advertisements                      - List all ads
GET    /api/advertisements/{id}                 - Get single ad
POST   /api/advertisements                      - Create ad
PUT    /api/advertisements/{id}                 - Update ad
DELETE /api/advertisements/{id}                 - Delete ad
GET    /api/advertisements/active/{page}        - Get active ads for page
GET    /api/advertisements/serve/{placement}    - Serve ads with rotation
POST   /api/advertisements/{id}/impression      - Track impression
POST   /api/advertisements/{id}/click           - Track click
POST   /api/advertisements/{id}/track           - Advanced tracking
GET    /api/advertisements/analytics/summary    - Analytics summary
GET    /api/advertisements/analytics/{id}       - Per-ad analytics
GET    /api/advertisements/reports/stats        - Performance reports
POST   /api/advertisements/reset-daily-budgets  - Reset daily budgets
```

### Lead Settings
```
GET    /api/lead-settings           - Get lead form settings
PUT    /api/lead-settings           - Update settings (controls floating button)
```

### Reviews & Questions
```
GET    /api/reviews/college/{id}    - Get college reviews
GET    /api/reviews/stats/{id}      - Get review statistics
POST   /api/reviews                 - Create review (auth required)
GET    /api/questions/college/{id}  - Get college questions
POST   /api/questions               - Ask question (auth required)
POST   /api/questions/answer        - Answer question (auth required)
```

### Auth Page Content (Dynamic Login/Signup)
```
GET    /api/auth-page-content/{type}     - Get login/signup content
POST   /api/admin/auth-pages/{type}      - Update content (admin)
```

---

## Database Schema

### Key Collections

| Collection | Purpose |
|------------|--------|
| `users` | User accounts |
| `colleges` | College data |
| `universities` | University data |
| `schools` | School data |
| `reviews` | User reviews |
| `questions` | Q&A data |
| `leads` | Lead submissions |
| `lead_settings` | Lead form configuration |
| `advertisements` | Ad campaigns |
| `ad_tracking_events` | Ad analytics |
| `auth_page_content` | Login/Signup page content |
| `listing_page_content` | Dynamic listing page SEO |
| `static_pages` | CMS static pages |
| `admission_bookings` | Admission bookings |
| `earnings` | User earnings |
| `notifications` | User notifications |

---

## Third-Party Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Razorpay** | Admission payments | **Mocked** |
| **Stripe** | Subscription payments | Active |
| **Resend** | Email notifications | Active |
| **Twilio** | WhatsApp notifications | Active |
| **Emergent Google Auth** | OAuth login | Active |

---

## Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@admissionbuddy.co` | `admin123` |
| Institute | `inst_iitb` | `admin123` |
| User | Create via signup | - |

---

## Known Issues & Technical Debt

### 🔴 High Priority
1. **Large React Components**: `CollegeForm.js` (~6,000 lines) needs to be broken into smaller components
2. **Navigation Workaround**: `DynamicListingPage.js` uses `window.location.href` instead of React Router's `useNavigate` to force page reloads (workaround for state sync issues)

### 🟡 Medium Priority
3. **server.py Still Large**: 6,772 lines - some endpoints still need modularization
4. **Reviews/Questions POST endpoints** remain in server.py due to auth/earnings dependencies

### 🟢 Low Priority
5. Missing automated tests for dynamic routing/listing
6. Some code duplication across admin pages

---

## Environment Variables

### Backend (`/app/backend/.env`)
```
MONGO_URL=<mongodb_connection_string>
DB_NAME=<database_name>
SECRET_KEY=<jwt_secret>
RESEND_API_KEY=<resend_key>
TWILIO_ACCOUNT_SID=<twilio_sid>
TWILIO_AUTH_TOKEN=<twilio_token>
TWILIO_WHATSAPP_NUMBER=<whatsapp_number>
STRIPE_API_KEY=<stripe_key>
```

### Frontend (`/app/frontend/.env`)
```
REACT_APP_BACKEND_URL=<backend_api_url>
```

---

## How to Control the Floating Button

The floating "Get Started" / "Apply Now" button is controlled from:

**Admin Panel → Lead Settings** (`/admin/lead-settings`)

Configurable options:
- Button Text
- Button Color
- Show/Hide Floating CTA
- Show/Hide Header CTA
- Form Heading/Subheading
- Notification Emails
- WhatsApp Settings

---

## Lock Information

| Field | Value |
|-------|-------|
| **Lock Date** | December 20, 2025 |
| **server.py Lines** | 6,772 |
| **Total Route Files** | 30 |
| **Total Frontend Pages** | 59 |
| **Last Refactoring** | Advertisements module extracted |

---

> 📌 **Remember**: No code changes without explicit user permission.
