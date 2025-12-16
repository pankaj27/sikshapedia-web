from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from core.database import db

class NewsService:
    collection = db.news
    
    @classmethod
    async def get_all(cls, skip: int = 0, limit: int = 20, include_drafts: bool = False, **filters) -> List[dict]:
        query = {}
        if not include_drafts:
            query['status'] = 'published'
        if filters.get('search'):
            query['title'] = {'$regex': filters['search'], '$options': 'i'}
        if filters.get('category'):
            query['category'] = filters['category']
        
        news = await cls.collection.find(query, {'_id': 0}).sort('created_at', -1).skip(skip).limit(limit).to_list(limit)
        return news
    
    @classmethod
    async def get_by_id(cls, news_id: str) -> Optional[dict]:
        return await cls.collection.find_one({'id': news_id}, {'_id': 0})
    
    @classmethod
    async def get_by_slug(cls, slug: str) -> Optional[dict]:
        return await cls.collection.find_one({'slug': slug}, {'_id': 0})
    
    @classmethod
    async def create(cls, data: dict) -> dict:
        data['id'] = str(uuid4())
        data['created_at'] = datetime.now(timezone.utc).isoformat()
        data['updated_at'] = data['created_at']
        data.setdefault('status', 'draft')
        data.setdefault('views', 0)
        await cls.collection.insert_one(data)
        return await cls.get_by_id(data['id'])
    
    @classmethod
    async def update(cls, news_id: str, data: dict) -> Optional[dict]:
        data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await cls.collection.update_one({'id': news_id}, {'$set': data})
        return await cls.get_by_id(news_id)
    
    @classmethod
    async def delete(cls, news_id: str) -> bool:
        result = await cls.collection.delete_one({'id': news_id})
        return result.deleted_count > 0
    
    @classmethod
    async def increment_views(cls, news_id: str):
        await cls.collection.update_one({'id': news_id}, {'$inc': {'views': 1}})
    
    @classmethod
    async def get_stats(cls) -> dict:
        total = await cls.collection.count_documents({})
        drafts = await cls.collection.count_documents({'status': 'draft'})
        published = await cls.collection.count_documents({'status': 'published'})
        return {'total': total, 'drafts': drafts, 'published': published}
