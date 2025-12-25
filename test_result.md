# Test Results - Write Review Feature

## Test Date: December 25, 2025

## Current Session Testing Goals:
1. Test Write Review navigation flow from institute detail page
2. Test Write Review form with pre-filled institute data
3. Test complete review submission flow

## Test Scenarios to Execute:

### Scenario 1: Navigation from Institute Detail Page to Write Review
- Navigate to `/schools/017-delhi-public-school`
- Scroll to Reviews section
- Click "Write Review" button
- Verify URL contains proper parameters: `?type=school&serial=17&slug=...`
- Verify institute is pre-filled with school icon and name
- Expected: Institute should be locked and show "Verified via QR" badge

### Scenario 2: Complete Review Submission Flow (logged-in user)
- Login as test user
- Navigate to Write Review page with pre-filled institute
- Select course from dropdown
- Fill out review details:
  - Rating: 4 stars
  - Title: "Great School Experience"
  - Pros: "Excellent faculty and infrastructure"
  - Cons: "Parking could be improved"
  - Detailed review: 200+ characters for bonus points
- Verify points calculator shows correct calculation
- Submit review
- Verify success page shows points earned

### Scenario 3: Points Calculator Live Update
- Verify base 50 points shown initially
- Type 200+ characters in detailed review
- Verify bonus +50 points appear
- Verify progress bar turns green at 200 chars

## Test Credentials:
- Admin User: admin@admissionbuddy.co / admin123

## Notes for Testing Agent:
- Focus on the Write Review feature flow
- Verify institute auto-detection works for different types (school, college, university)
- Check that the form fields (Pros, Cons, graduation year back to 1990) are present
