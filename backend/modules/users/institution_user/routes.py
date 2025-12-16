from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from core.auth import get_current_user
from .services import InstitutionUserService

router = APIRouter(prefix='/users/institution', tags=['Institution Users'])

@router.get('')
async def get_institution_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can view institution users')
    return await InstitutionUserService.get_all(skip=skip, limit=limit, search=search, status=status)

@router.get('/stats')
async def get_institution_user_stats(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can view stats')
    return await InstitutionUserService.get_stats()

@router.get('/{user_id}')
async def get_institution_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin' and current_user.get('id') != user_id:
        raise HTTPException(status_code=403, detail='Access denied')
    user = await InstitutionUserService.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.post('')
async def create_institution_user(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create institution users')
    existing = await InstitutionUserService.get_by_email(data.get('email'))
    if existing:
        raise HTTPException(status_code=400, detail='Email already exists')
    return await InstitutionUserService.create(data)

@router.put('/{user_id}')
async def update_institution_user(user_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin' and current_user.get('id') != user_id:
        raise HTTPException(status_code=403, detail='Access denied')
    user = await InstitutionUserService.update(user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.delete('/{user_id}')
async def delete_institution_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete users')
    if not await InstitutionUserService.delete(user_id):
        raise HTTPException(status_code=404, detail='User not found')
    return {'message': 'User deleted successfully'}
