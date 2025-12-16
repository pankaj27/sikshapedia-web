from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from core.auth import get_current_user
from .services import InstitutionService

router = APIRouter(prefix='/institutions', tags=['Institutions'])

@router.get('')
async def get_institutions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    type: Optional[str] = None,
    institution_type: Optional[str] = None,
    include_drafts: Optional[str] = Query(None),
    sort_by: Optional[str] = Query('nirf_ranking')
):
    """Get all institutions with optional filters"""
    show_drafts = include_drafts and include_drafts.lower() == 'true'
    return await InstitutionService.get_all(
        skip=skip, limit=limit, include_drafts=show_drafts,
        search=search, city=city, state=state, type=type,
        institution_type=institution_type, sort_by=sort_by
    )

@router.get('/stats')
async def get_institution_stats():
    """Get institution statistics"""
    return await InstitutionService.get_stats()

@router.get('/featured')
async def get_featured_institutions(limit: int = Query(8, ge=1, le=20)):
    """Get featured institutions"""
    return await InstitutionService.get_featured(limit)

@router.get('/{identifier}')
async def get_institution(identifier: str):
    """Get institution by ID or slug"""
    # Try by ID first, then by slug
    college = await InstitutionService.get_by_id(identifier)
    if not college:
        college = await InstitutionService.get_by_slug(identifier)
    if not college:
        raise HTTPException(status_code=404, detail='Institution not found')
    return college

@router.post('')
async def create_institution(data: dict, current_user: dict = Depends(get_current_user)):
    """Create a new institution (Admin only)"""
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create institutions')
    return await InstitutionService.create(data)

@router.put('/{college_id}')
async def update_institution(college_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    """Update an institution (Admin only)"""
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can update institutions')
    college = await InstitutionService.update(college_id, data)
    if not college:
        raise HTTPException(status_code=404, detail='Institution not found')
    return college

@router.delete('/{college_id}')
async def delete_institution(college_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an institution (Admin only)"""
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete institutions')
    if not await InstitutionService.delete(college_id):
        raise HTTPException(status_code=404, detail='Institution not found')
    return {'message': 'Institution deleted successfully'}
