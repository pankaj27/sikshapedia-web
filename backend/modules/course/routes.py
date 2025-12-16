from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from core.auth import get_current_user
from .services import CourseService

router = APIRouter(prefix='/courses-module', tags=['Courses Module'])

@router.get('')
async def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    stream: Optional[str] = None,
    level: Optional[str] = None,
    include_drafts: Optional[str] = Query(None)
):
    show_drafts = include_drafts and include_drafts.lower() == 'true'
    return await CourseService.get_all(skip=skip, limit=limit, include_drafts=show_drafts, search=search, stream=stream, level=level)

@router.get('/stats')
async def get_course_stats():
    return await CourseService.get_stats()

@router.get('/{course_id}')
async def get_course(course_id: str):
    course = await CourseService.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')
    return course

@router.post('')
async def create_course(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create courses')
    return await CourseService.create(data)

@router.put('/{course_id}')
async def update_course(course_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can update courses')
    course = await CourseService.update(course_id, data)
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')
    return course

@router.delete('/{course_id}')
async def delete_course(course_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete courses')
    if not await CourseService.delete(course_id):
        raise HTTPException(status_code=404, detail='Course not found')
    return {'message': 'Course deleted successfully'}
