# Frontend Pages Documentation

> ⚠️ **LOCKED** - Do not modify without permission

## Overview

This directory contains all React page components for the AdmissionBuddy application.

## Page Structure

### Public Pages
| File | Route | Description |
|------|-------|-------------|
| `HomePage.js` | `/` | Main landing page |
| `DynamicListingPage.js` | `/colleges`, `/schools`, `/universities` | Listing pages with filters |
| `CollegeDetailPage.js` | `/college/:slug` | Individual college page |
| `LoginPage.js` | `/login` | User login (dynamic content) |
| `UserSignup.js` | `/signup` | User registration |
| `AboutPage.js` | `/about` | About us |
| `ContactPage.js` | `/contact` | Contact page |

### Admin Pages (`/admin/`)
| File | Route | Description |
|------|-------|-------------|
| `AdminDashboard.js` | `/admin` | Admin home |
| `CollegeForm.js` | `/admin/colleges/new` | College editor (**6000+ lines - needs refactor**) |
| `AdvertisementsManagement.js` | `/admin/advertisements` | Ad management |
| `AuthPagesManagement.js` | `/admin/auth-pages` | Login/Signup content |
| `LeadSettings.js` | `/admin/lead-settings` | **Floating button settings** |
| `LeadsList.js` | `/admin/leads` | View leads |

### Institute Pages (`/institute/`)
| File | Route | Description |
|------|-------|-------------|
| `InstituteDashboard.js` | `/institute` | Institute home |
| Various management pages | `/institute/*` | Institute features |

### User Pages
| File | Route | Description |
|------|-------|-------------|
| `UserDashboard.js` | `/dashboard` | User profile |

## Important Notes

### Floating Button Control
The floating "Apply Now" button is controlled from:
- **Admin Page**: `/admin/lead-settings`
- **Component**: `/components/FloatingApplyButton.js`
- **API**: `GET/PUT /api/lead-settings`

### Navigation Workaround
`DynamicListingPage.js` uses `window.location.href` instead of React Router's `useNavigate`.
This is a **deliberate workaround** to force page reloads for filter state synchronization.

### Large Files Needing Refactor
1. `CollegeForm.js` - ~6,000 lines
2. `CollegeDetailPage.js` - Large
3. `DynamicListingPage.js` - Large

---

**Last Updated**: December 20, 2025
