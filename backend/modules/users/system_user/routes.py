from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from core.auth import get_current_user
from .services import SystemUserService

router = APIRouter(prefix='/users/system', tags=['System Users'])

@router.get('')
async def get_system_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    role: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get('role') not in ['admin', 'super_admin']:
        raise HTTPException(status_code=403, detail='Only admins can view system users')
    return await SystemUserService.get_all(skip=skip, limit=limit, search=search, status=status, role=role)

@router.get('/stats')
async def get_system_user_stats(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') not in ['admin', 'super_admin']:
        raise HTTPException(status_code=403, detail='Only admins can view stats')
    return await SystemUserService.get_stats()

@router.get('/{user_id}')
async def get_system_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') not in ['admin', 'super_admin']:
        raise HTTPException(status_code=403, detail='Only admins can view system users')
    user = await SystemUserService.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.post('')
async def create_system_user(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'super_admin':
        raise HTTPException(status_code=403, detail='Only super admins can create system users')
    existing = await SystemUserService.get_by_email(data.get('email'))
    if existing:
        raise HTTPException(status_code=400, detail='Email already exists')
    return await SystemUserService.create(data)

@router.put('/{user_id}')
async def update_system_user(user_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'super_admin' and current_user.get('id') != user_id:
        raise HTTPException(status_code=403, detail='Access denied')
    # Prevent changing own role
    if current_user.get('id') == user_id and 'role' in data:
        del data['role']
    user = await SystemUserService.update(user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@router.delete('/{user_id}')
async def delete_system_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'super_admin':
        raise HTTPException(status_code=403, detail='Only super admins can delete system users')
    if current_user.get('id') == user_id:
        raise HTTPException(status_code=400, detail='Cannot delete yourself')
    if not await SystemUserService.delete(user_id):
        raise HTTPException(status_code=404, detail='User not found')
    return {'message': 'User deleted successfully'}
