from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from core.database import db

class AdvertisementService:
    collection = db.advertisements
    
    @classmethod
    async def get_all(cls, skip: int = 0, limit: int = 20, include_inactive: bool = False, **filters) -> List[dict]:
        query = {}
        if not include_inactive:
            query['status'] = 'active'
        if filters.get('position'):
            query['position'] = filters['position']
        if filters.get('page'):
            query['pages'] = filters['page']
        
        ads = await cls.collection.find(query, {'_id': 0}).sort('priority', -1).skip(skip).limit(limit).to_list(limit)
        return ads
    
    @classmethod
    async def get_active_for_page(cls, page_name: str, position: Optional[str] = None) -> List[dict]:
        now = datetime.now(timezone.utc).isoformat()
        query = {
            'status': 'active',
            'pages': page_name,
            '$or': [
                {'end_date': {'$exists': False}},
                {'end_date': None},
                {'end_date': {'$gte': now}}
            ]
        }
        if position:
            query['position'] = position
        
        ads = await cls.collection.find(query, {'_id': 0}).sort('priority', -1).to_list(10)
        return ads
    
    @classmethod
    async def get_by_id(cls, ad_id: str) -> Optional[dict]:
        return await cls.collection.find_one({'id': ad_id}, {'_id': 0})
    
    @classmethod
    async def create(cls, data: dict) -> dict:
        data['id'] = str(uuid4())
        data['created_at'] = datetime.now(timezone.utc).isoformat()
        data['updated_at'] = data['created_at']
        data.setdefault('status', 'draft')
        data.setdefault('impressions', 0)
        data.setdefault('clicks', 0)
        await cls.collection.insert_one(data)
        return await cls.get_by_id(data['id'])
    
    @classmethod
    async def update(cls, ad_id: str, data: dict) -> Optional[dict]:
        data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await cls.collection.update_one({'id': ad_id}, {'$set': data})
        return await cls.get_by_id(ad_id)
    
    @classmethod
    async def delete(cls, ad_id: str) -> bool:
        result = await cls.collection.delete_one({'id': ad_id})
        return result.deleted_count > 0
    
    @classmethod
    async def track_impression(cls, ad_id: str):
        await cls.collection.update_one({'id': ad_id}, {'$inc': {'impressions': 1}})
    
    @classmethod
    async def track_click(cls, ad_id: str):
        await cls.collection.update_one({'id': ad_id}, {'$inc': {'clicks': 1}})
    
    @classmethod
    async def get_stats(cls) -> dict:
        total = await cls.collection.count_documents({})
        active = await cls.collection.count_documents({'status': 'active'})
        draft = await cls.collection.count_documents({'status': 'draft'})
        paused = await cls.collection.count_documents({'status': 'paused'})
        return {'total': total, 'active': active, 'draft': draft, 'paused': paused}
