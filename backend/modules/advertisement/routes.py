from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from core.auth import get_current_user
from .services import AdvertisementService

router = APIRouter(prefix='/ads', tags=['Advertisements Module'])

@router.get('')
async def get_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    position: Optional[str] = None,
    include_inactive: Optional[str] = Query(None)
):
    show_inactive = include_inactive and include_inactive.lower() == 'true'
    return await AdvertisementService.get_all(skip=skip, limit=limit, include_inactive=show_inactive, position=position)

@router.get('/active/{page_name}')
async def get_active_ads(page_name: str, position: Optional[str] = None):
    return await AdvertisementService.get_active_for_page(page_name, position)

@router.get('/stats')
async def get_ad_stats():
    return await AdvertisementService.get_stats()

@router.get('/{ad_id}')
async def get_advertisement(ad_id: str):
    ad = await AdvertisementService.get_by_id(ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail='Advertisement not found')
    return ad

@router.post('')
async def create_advertisement(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create advertisements')
    return await AdvertisementService.create(data)

@router.put('/{ad_id}')
async def update_advertisement(ad_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can update advertisements')
    ad = await AdvertisementService.update(ad_id, data)
    if not ad:
        raise HTTPException(status_code=404, detail='Advertisement not found')
    return ad

@router.delete('/{ad_id}')
async def delete_advertisement(ad_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete advertisements')
    if not await AdvertisementService.delete(ad_id):
        raise HTTPException(status_code=404, detail='Advertisement not found')
    return {'message': 'Advertisement deleted successfully'}

@router.post('/{ad_id}/impression')
async def track_impression(ad_id: str):
    await AdvertisementService.track_impression(ad_id)
    return {'message': 'Impression tracked'}

@router.post('/{ad_id}/click')
async def track_click(ad_id: str):
    await AdvertisementService.track_click(ad_id)
    return {'message': 'Click tracked'}
