# Models package
# Pydantic models for the application

# Exam models (migrated)
from .exam import (
    Exam,
    ExamCreate,
    ExamDetailed,
    ExamDetailedWidget,
    ExamDetailedWidgets,
    ExamDetailedMenuItem,
    ExamDetailedMenuConfig
)

# TODO: Move remaining models from server.py:
# - user.py - User, AdminUser, UserCreate, UserLogin, Token
# - college.py - College, CollegeCreate, Review, Question
# - course.py - Course, CourseDetail, CourseDetailCreate
# - content.py - News, Blog, ListingPageContent
# - admin.py - ContentApproval, Application, Inquiry

__all__ = [
    # Exam models
    'Exam',
    'ExamCreate', 
    'ExamDetailed',
    'ExamDetailedWidget',
    'ExamDetailedWidgets',
    'ExamDetailedMenuItem',
    'ExamDetailedMenuConfig',
]
