# Test Session: Admission Partner Booking System (Dec 20, 2025)

## Feature to Test:
**Admission Partner Booking System** - Complete end-to-end flow for admission booking with:
- Admission Partner badge integration
- Booking form with all required fields
- Razorpay payment integration
- User dashboard display of bookings
- Institution dashboard for approval/rejection
- Admin management panel

## Backend API Endpoints to Test:
1. **GET /api/admission/settings** - Get fee settings ✅ Verified manually
2. **GET /api/admission/states** - Get Indian states ✅ Verified manually
3. **GET /api/admission/cities/{state}** - Get cities for state ✅ Verified manually
4. **GET /api/admission/partners** - Get admission partner institutions
5. **POST /api/admission/booking** - Create booking (requires auth)
6. **POST /api/admission/create-order** - Create Razorpay order (requires auth)
7. **POST /api/admission/verify-payment** - Verify payment (requires auth)
8. **GET /api/admission/my-bookings** - Get user's bookings (requires auth)
9. **GET /api/admission/institution-bookings** - Get institution's bookings (requires inst auth)
10. **PUT /api/admission/booking/{id}/status** - Update booking status (requires inst auth)
11. **POST /api/admission/upload-document** - Upload documents (requires auth)
12. **GET /api/admission/admin/bookings** - Admin view all bookings

## Frontend Pages/Components to Test:
1. `/admission-partners/colleges` - Admission partners listing page
2. `/admission-partners/schools` - Admission partners listing page
3. `/dashboard` (User) - "Admission Bookings" tab should show user's applications
4. `/institute/dashboard` - "Admission Bookings" tab for institution to approve/reject
5. `/admin/admission-bookings` - Admin panel for all admission bookings
6. AdmissionBookingModal - Form with all fields and payment flow
7. AdmissionPartnerBadge - Badge display on partner institutions

## Test Credentials:
- Admin: admin@admissionbuddy.co / admin123
- Test Institute: login_id: UPDA0001, password: hrZiJlz0NyXY

## Key Points:
- User must be logged in to submit admission booking
- File uploads limited to 100KB per document
- Razorpay test keys configured for payment testing
- Email notifications require RESEND_API_KEY (currently not configured)

## Incorporate User Feedback:
- Navigation uses full page reload (CustomLink) due to React Router v7 conflict
- All Link components should use CustomLink from '../components/CustomLink'
- Admission partners routes changed to /admission-partners/* to avoid conflict with existing /admission/* routes
