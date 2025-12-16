from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from core.auth import get_current_user
from .services import StudentUserService

router = APIRouter(prefix='/users/student', tags=['Student Users'])

@router.get('')
async def get_student_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can view student users')
    return await StudentUserService.get_all(skip=skip, limit=limit, search=search, status=status)

@router.get('/stats')
async def get_student_user_stats(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can view stats')
    return await StudentUserService.get_stats()

@router.get('/{user_id}')
async def get_student_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin' and current_user.get('id') != user_id:
        raise HTTPException(status_code=403, detail='Access denied')
    user = await StudentUserService.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.post('')
async def create_student_user(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create users directly')
    existing = await StudentUserService.get_by_email(data.get('email'))
    if existing:
        raise HTTPException(status_code=400, detail='Email already exists')
    return await StudentUserService.create(data)

@router.put('/{user_id}')
async def update_student_user(user_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin' and current_user.get('id') != user_id:
        raise HTTPException(status_code=403, detail='Access denied')
    user = await StudentUserService.update(user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.delete('/{user_id}')
async def delete_student_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete users')
    if not await StudentUserService.delete(user_id):
        raise HTTPException(status_code=404, detail='User not found')
    return {'message': 'User deleted successfully'}
