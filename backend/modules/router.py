"""
Main Router - Aggregates all module routers
"""
from fastapi import APIRouter

# Import all module routers
from .institution.routes import router as institution_router
from .course.routes import router as course_router
from .exam.routes import router as exam_router
from .news.routes import router as news_router
from .advertisement.routes import router as advertisement_router
from .users.institution_user.routes import router as institution_user_router
from .users.student_user.routes import router as student_user_router
from .users.system_user.routes import router as system_user_router

# Create main API router
api_router = APIRouter()

# Include all module routers
api_router.include_router(institution_router)
api_router.include_router(course_router)
api_router.include_router(exam_router)
api_router.include_router(news_router)
api_router.include_router(advertisement_router)
api_router.include_router(institution_user_router)
api_router.include_router(student_user_router)
api_router.include_router(system_user_router)

# Module info endpoint
@api_router.get("/modules/info")
async def get_modules_info():
    return {
        "modules": [
            {"name": "Institution", "prefix": "/institutions", "description": "Colleges, Schools, Universities management"},
            {"name": "Course", "prefix": "/courses-module", "description": "Course management"},
            {"name": "Exam", "prefix": "/exams-module", "description": "Exam management"},
            {"name": "News", "prefix": "/news-module", "description": "News & articles management"},
            {"name": "Advertisement", "prefix": "/ads", "description": "Advertisement management"},
            {"name": "Institution Users", "prefix": "/users/institution", "description": "Institution user management"},
            {"name": "Student Users", "prefix": "/users/student", "description": "Student user management"},
            {"name": "System Users", "prefix": "/users/system", "description": "Admin & system user management"}
        ],
        "version": "1.0.0"
    }
