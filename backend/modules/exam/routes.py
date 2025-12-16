from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from core.auth import get_current_user
from .services import ExamService

router = APIRouter(prefix='/exams-module', tags=['Exams Module'])

@router.get('')
async def get_exams(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    exam_level: Optional[str] = None,
    include_drafts: Optional[str] = Query(None)
):
    show_drafts = include_drafts and include_drafts.lower() == 'true'
    return await ExamService.get_all(skip=skip, limit=limit, include_drafts=show_drafts, search=search, exam_level=exam_level)

@router.get('/stats')
async def get_exam_stats():
    return await ExamService.get_stats()

@router.get('/{exam_id}')
async def get_exam(exam_id: str):
    exam = await ExamService.get_by_id(exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail='Exam not found')
    return exam

@router.post('')
async def create_exam(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create exams')
    return await ExamService.create(data)

@router.put('/{exam_id}')
async def update_exam(exam_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can update exams')
    exam = await ExamService.update(exam_id, data)
    if not exam:
        raise HTTPException(status_code=404, detail='Exam not found')
    return exam

@router.delete('/{exam_id}')
async def delete_exam(exam_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete exams')
    if not await ExamService.delete(exam_id):
        raise HTTPException(status_code=404, detail='Exam not found')
    return {'message': 'Exam deleted successfully'}
