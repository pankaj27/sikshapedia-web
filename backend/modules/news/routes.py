from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from core.auth import get_current_user
from .services import NewsService

router = APIRouter(prefix='/news-module', tags=['News Module'])

@router.get('')
async def get_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    search: Optional[str] = None,
    category: Optional[str] = None,
    include_drafts: Optional[str] = Query(None)
):
    show_drafts = include_drafts and include_drafts.lower() == 'true'
    return await NewsService.get_all(skip=skip, limit=limit, include_drafts=show_drafts, search=search, category=category)

@router.get('/stats')
async def get_news_stats():
    return await NewsService.get_stats()

@router.get('/{identifier}')
async def get_news_item(identifier: str):
    news = await NewsService.get_by_id(identifier)
    if not news:
        news = await NewsService.get_by_slug(identifier)
    if not news:
        raise HTTPException(status_code=404, detail='News not found')
    await NewsService.increment_views(news['id'])
    return news

@router.post('')
async def create_news(data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can create news')
    return await NewsService.create(data)

@router.put('/{news_id}')
async def update_news(news_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can update news')
    news = await NewsService.update(news_id, data)
    if not news:
        raise HTTPException(status_code=404, detail='News not found')
    return news

@router.delete('/{news_id}')
async def delete_news(news_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Only admins can delete news')
    if not await NewsService.delete(news_id):
        raise HTTPException(status_code=404, detail='News not found')
    return {'message': 'News deleted successfully'}
