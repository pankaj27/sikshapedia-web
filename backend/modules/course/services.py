from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from core.database import db

class CourseService:
    collection = db.courses
    
    @classmethod
    async def get_all(cls, skip: int = 0, limit: int = 20, include_drafts: bool = False, **filters) -> List[dict]:
        query = {}
        if not include_drafts:
            query['status'] = 'published'
        if filters.get('search'):
            query['name'] = {'$regex': filters['search'], '$options': 'i'}
        if filters.get('stream'):
            query['stream'] = filters['stream']
        if filters.get('level'):
            query['level'] = filters['level']
        
        courses = await cls.collection.find(query, {'_id': 0}).skip(skip).limit(limit).to_list(limit)
        return courses
    
    @classmethod
    async def get_by_id(cls, course_id: str) -> Optional[dict]:
        return await cls.collection.find_one({'id': course_id}, {'_id': 0})
    
    @classmethod
    async def create(cls, data: dict) -> dict:
        data['id'] = str(uuid4())
        data['created_at'] = datetime.now(timezone.utc).isoformat()
        data['updated_at'] = data['created_at']
        data.setdefault('status', 'draft')
        await cls.collection.insert_one(data)
        return await cls.get_by_id(data['id'])
    
    @classmethod
    async def update(cls, course_id: str, data: dict) -> Optional[dict]:
        data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await cls.collection.update_one({'id': course_id}, {'$set': data})
        return await cls.get_by_id(course_id)
    
    @classmethod
    async def delete(cls, course_id: str) -> bool:
        result = await cls.collection.delete_one({'id': course_id})
        return result.deleted_count > 0
    
    @classmethod
    async def get_stats(cls) -> dict:
        total = await cls.collection.count_documents({})
        drafts = await cls.collection.count_documents({'status': 'draft'})
        published = await cls.collection.count_documents({'status': 'published'})
        return {'total': total, 'drafts': drafts, 'published': published}
