# Backend Modularization Plan

## Current State
- `server.py`: 5,831 lines (monolithic)
- Contains all models, routes, and business logic

## Target Architecture

```
/app/backend/
├── server.py           # Main app entry, includes routers
├── core/
│   ├── config.py       # Environment & settings
│   ├── database.py     # MongoDB connection
│   └── security.py     # JWT, password hashing
├── models/
│   ├── __init__.py
│   ├── user.py         # User, AdminUser, Token
│   ├── college.py      # College, Review, Question
│   ├── course.py       # Course, CourseDetail
│   ├── exam.py         # Exam, ExamDetail
│   ├── content.py      # News, Blog, ListingPage
│   └── admin.py        # Application, Inquiry
├── routes/
│   ├── __init__.py
│   ├── auth.py         # /auth/* routes
│   ├── admin.py        # /admin/* routes
│   ├── colleges.py     # /colleges/*, /universities/*, /schools/*
│   ├── courses.py      # /courses/*, /courses-detail/*
│   ├── exams.py        # /exams/*, /exams-detail/*
│   ├── content.py      # /news/*, /blogs/*, /listing-pages/*
│   └── uploads.py      # /upload/*
└── services/
    ├── __init__.py
    ├── approval.py     # Content approval logic
    └── email.py        # Email notifications
```

## Migration Steps

### Phase 1: Create Structure (DONE)
- [x] Create routes/ directory
- [x] Create models/ directory  
- [x] Create placeholder files

### Phase 2: Extract Models
- [ ] Move Pydantic models to models/*.py
- [ ] Update imports in server.py

### Phase 3: Extract Routes (Priority Order)
1. [ ] auth.py - Authentication (5 routes)
2. [ ] admin.py - Admin management (12 routes)
3. [ ] uploads.py - File uploads (3 routes)
4. [ ] colleges.py - Colleges/Schools/Universities (~15 routes)
5. [ ] courses.py - Courses (~10 routes)
6. [ ] exams.py - Exams (~10 routes)
7. [ ] content.py - News/Blogs/Listing Pages (~15 routes)

### Phase 4: Extract Services
- [ ] Move business logic to services/
- [ ] Create shared utilities

## Dependencies to Handle
- Database connection (db)
- JWT utilities (create_access_token, get_current_user)
- Password context (pwd_context, bcrypt)
- File paths (UPLOAD_DIR, BASE_URL)

## Notes
- Keep backwards compatibility during migration
- Test each extracted module before moving to next
- Update imports incrementally
