"""Courses and Exams CRUD API"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Courses & Exams"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# ============================================
# Course Models
# ============================================

class Cutoff(BaseModel):
    exam_name: str
    general: Optional[float] = None
    obc: Optional[float] = None
    sc: Optional[float] = None
    st: Optional[float] = None
    ews: Optional[float] = None

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    degree_type: str
    duration: str
    description: Optional[str] = None
    stream: Optional[str] = None
    full_name: Optional[str] = None
    slug: Optional[str] = None
    fees: Optional[float] = None
    total_fees: Optional[float] = None
    average_fees: Optional[float] = None
    eligibility: Optional[str] = None
    exams_accepted: List[str] = []
    cutoffs: List[Cutoff] = []

class CourseDetail(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    full_name: Optional[str] = None
    degree_type: str
    duration: str
    description: Optional[str] = None
    stream: Optional[str] = None
    eligibility: Optional[str] = None
    career_prospects: Optional[str] = None
    average_salary: Optional[str] = None
    top_recruiters: List[str] = []
    specializations: List[str] = []
    subjects: List[str] = []
    skills_gained: List[str] = []
    entrance_exams: List[str] = []
    fees_range: Optional[str] = None
    min_fees: Optional[float] = None
    max_fees: Optional[float] = None
    faqs: List[Dict] = []
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============================================
# Exam Models
# ============================================

class Exam(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    full_name: Optional[str] = None
    description: Optional[str] = None
    conducting_body: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    exam_level: Optional[str] = None
    exam_type: Optional[str] = None
    streams: List[str] = []
    display_priority: int = 0
    mode: Optional[str] = None
    duration: Optional[str] = None
    frequency: Optional[str] = None
    total_applicants: Optional[int] = None
    total_seats: Optional[int] = None
    exam_date: Optional[str] = None
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    result_date: Optional[str] = None
    official_website: Optional[str] = None
    status: str = "published"
    is_active: bool = True
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    eligibility: Optional[Dict] = None
    exam_pattern: Optional[Dict] = None
    application_fee: Optional[Dict] = None

# ============================================
# Exam Endpoints
# ============================================

@router.get("/exams", response_model=List[Exam])
async def get_exams(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    exam_level: Optional[str] = None,
    exam_type: Optional[str] = None
):
    """Get all exams with optional filters"""
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if stream:
        query["streams"] = {"$in": [stream]}
    
    if exam_level:
        query["exam_level"] = exam_level
    
    if exam_type:
        query["exam_type"] = exam_type
    
    exams = await db.exams.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    # Re-sort to put items with display_priority > 0 first
    prioritized = [e for e in exams if e.get('display_priority', 0) > 0]
    non_prioritized = [e for e in exams if e.get('display_priority', 0) == 0]
    prioritized.sort(key=lambda x: x.get('display_priority', 0))
    exams = prioritized + non_prioritized
    
    for exam in exams:
        if isinstance(exam.get('created_at'), str):
            exam['created_at'] = datetime.fromisoformat(exam['created_at'])
        
        # Fix data validation issues
        if exam.get('exam_pattern') is not None and not isinstance(exam.get('exam_pattern'), dict):
            exam['exam_pattern'] = None
        if exam.get('eligibility') is not None and not isinstance(exam.get('eligibility'), dict):
            exam['eligibility'] = None
        if exam.get('application_fee') is not None and not isinstance(exam.get('application_fee'), dict):
            exam['application_fee'] = None
    
    return exams


@router.get("/exams/featured", response_model=List[Exam])
async def get_featured_exams(limit: int = Query(6, ge=1, le=20)):
    """Get featured exams for homepage"""
    settings = await db.homepage_settings.find_one({"id": "homepage-settings"}, {"_id": 0})
    featured_ids = settings.get("featured_exams_ids", []) if settings else []
    
    featured_exams = []
    
    if featured_ids:
        for exam_id in featured_ids[:limit]:
            exam = await db.exams.find_one({"id": exam_id, "status": "published"}, {"_id": 0})
            if exam:
                featured_exams.append(exam)
    
    if len(featured_exams) < limit:
        existing_ids = [e.get('id') for e in featured_exams]
        additional = await db.exams.find(
            {"status": "published", "id": {"$nin": existing_ids}}, 
            {"_id": 0}
        ).sort("total_applicants", -1).limit(limit - len(featured_exams)).to_list(limit - len(featured_exams))
        featured_exams.extend(additional)
    
    return featured_exams


@router.get("/exams/{exam_id}", response_model=Exam)
async def get_exam(exam_id: str):
    """Get a specific exam by ID"""
    exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    if isinstance(exam.get('created_at'), str):
        exam['created_at'] = datetime.fromisoformat(exam['created_at'])
    
    return exam


@router.post("/exams", response_model=Exam)
async def create_exam(exam_data: dict):
    """Create a new exam (admin only)"""
    # Check for duplicate by name (case-insensitive)
    exam_name = exam_data.get('name', '').strip()
    if exam_name:
        existing_exam = await db.exams.find_one(
            {"name": {"$regex": f"^{exam_name}$", "$options": "i"}},
            {"_id": 0, "id": 1, "name": 1}
        )
        if existing_exam:
            raise HTTPException(
                status_code=409,
                detail=f"Exam with name '{exam_name}' already exists (ID: {existing_exam.get('id')})"
            )
    
    if 'id' not in exam_data:
        exam_data['id'] = str(uuid.uuid4())
    
    exam_data['created_at'] = datetime.now(timezone.utc).isoformat()
    exam_data['status'] = exam_data.get('status', 'published')
    
    await db.exams.insert_one(exam_data)
    
    created_exam = await db.exams.find_one({"id": exam_data['id']}, {"_id": 0})
    return created_exam


@router.put("/exams/{exam_id}", response_model=Exam)
async def update_exam(exam_id: str, exam_data: dict):
    """Update an exam (admin only)"""
    existing_exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    if not existing_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    exam_data.pop('id', None)
    exam_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.exams.update_one({"id": exam_id}, {"$set": exam_data})
    updated_exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    
    return updated_exam


@router.delete("/exams/{exam_id}")
async def delete_exam(exam_id: str):
    """Delete an exam (admin only)"""
    result = await db.exams.delete_one({"id": exam_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    return {"message": "Exam deleted successfully"}


# ============================================
# Course Endpoints
# ============================================

@router.get("/courses", response_model=List[Course])
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    degree_type: Optional[str] = None
):
    """Get all courses with optional filters"""
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if stream:
        query["stream"] = {"$regex": stream, "$options": "i"}
    
    if degree_type:
        query["degree_type"] = degree_type
    
    # Sort by display_priority (descending) so high priority items like "School" appear first
    courses = await db.courses.find(query, {"_id": 0}).sort("display_priority", -1).skip(skip).limit(limit).to_list(limit)
    
    for course in courses:
        if isinstance(course.get('created_at'), str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return courses


@router.get("/courses/{course_id}", response_model=CourseDetail)
async def get_course(course_id: str):
    """Get a specific course by ID"""
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if isinstance(course.get('created_at'), str):
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return CourseDetail(**course)


@router.post("/courses", response_model=Course)
async def create_course(course_data: dict):
    """Create a new course (admin only)"""
    # Check for duplicate by name (case-insensitive)
    course_name = course_data.get('name', '').strip()
    if course_name:
        existing_course = await db.courses.find_one(
            {"name": {"$regex": f"^{course_name}$", "$options": "i"}},
            {"_id": 0, "id": 1, "name": 1}
        )
        if existing_course:
            raise HTTPException(
                status_code=409,
                detail=f"Course with name '{course_name}' already exists (ID: {existing_course.get('id')})"
            )
    
    if 'id' not in course_data:
        course_data['id'] = str(uuid.uuid4())
    
    if 'cutoffs' not in course_data:
        course_data['cutoffs'] = []
    
    await db.courses.insert_one(course_data)
    
    created_course = await db.courses.find_one({"id": course_data['id']}, {"_id": 0})
    return Course(**created_course)


@router.put("/courses/{course_id}", response_model=Course)
async def update_course(course_id: str, course_data: dict):
    """Update a course (admin only)"""
    existing_course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not existing_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course_data.pop('id', None)
    
    await db.courses.update_one({"id": course_id}, {"$set": course_data})
    updated_course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    
    return Course(**updated_course)


@router.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    """Delete a course (admin only)"""
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {"message": "Course deleted successfully"}


# ============================================
# Courses Detail Endpoints (Separate Collection)
# ============================================

@router.get("/courses-detail", response_model=List[CourseDetail])
async def get_courses_detail(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    degree_type: Optional[str] = None
):
    """Get all detailed course pages"""
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if stream:
        query["stream"] = {"$regex": stream, "$options": "i"}
    
    if degree_type:
        query["degree_type"] = degree_type
    
    courses = await db.courses_detailed.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for course in courses:
        if isinstance(course.get('created_at'), str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return courses


@router.get("/courses-detail/{course_id}", response_model=CourseDetail)
async def get_course_detail(course_id: str):
    """Get a specific detailed course page"""
    course = await db.courses_detailed.find_one(
        {"$or": [{"id": course_id}, {"slug": course_id}]}, 
        {"_id": 0}
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course detail not found")
    
    if isinstance(course.get('created_at'), str):
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    
    return CourseDetail(**course)


@router.post("/courses-detail", response_model=CourseDetail)
async def create_course_detail(course_data: dict):
    """Create a new detailed course page (admin only)"""
    if 'id' not in course_data:
        course_data['id'] = str(uuid.uuid4())
    
    course_data['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.courses_detailed.insert_one(course_data)
    
    created = await db.courses_detailed.find_one({"id": course_data['id']}, {"_id": 0})
    return CourseDetail(**created)


@router.put("/courses-detail/{course_id}", response_model=CourseDetail)
async def update_course_detail(course_id: str, course_data: dict):
    """Update a detailed course page (admin only)"""
    existing = await db.courses_detailed.find_one({"id": course_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Course detail not found")
    
    course_data.pop('id', None)
    course_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.courses_detailed.update_one({"id": course_id}, {"$set": course_data})
    updated = await db.courses_detailed.find_one({"id": course_id}, {"_id": 0})
    
    return CourseDetail(**updated)


@router.delete("/courses-detail/{course_id}")
async def delete_course_detail(course_id: str):
    """Delete a detailed course page (admin only)"""
    result = await db.courses_detailed.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course detail not found")
    
    return {"message": "Course detail deleted successfully"}
