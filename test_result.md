# Test Results

## Test Session: Duplicate Entry Prevention Validation

### Test Objective
Verify that the backend API properly rejects duplicate entries for:
1. Courses (by name)
2. Exams (by name)
3. News (by title)

### Endpoints to Test
1. POST /api/courses - Should return 409 if course with same name exists
2. POST /api/exams - Should return 409 if exam with same name exists
3. POST /api/news - Should return 409 if news with same title exists

### Test Data
- Existing Course Name: "B.Tech"
- Existing Exam Name: "JEE Main" (to be verified)
- Existing News Title: (to be verified)

### Expected Behavior
- Creating duplicate should return HTTP 409 Conflict
- Error message should mention the duplicate field and existing ID

### Test Status: PENDING
