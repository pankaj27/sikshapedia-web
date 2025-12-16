from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from core.database import db
from .models import College, CollegeCreate

class InstitutionService:
    collection = db.colleges
    
    @classmethod
    async def get_all(cls, skip: int = 0, limit: int = 20, include_drafts: bool = False, **filters) -> List[College]:
        query = {}
        
        if not include_drafts:
            query['status'] = 'published'
        
        if filters.get('search'):
            query['$or'] = [
                {'name': {'$regex': filters['search'], '$options': 'i'}},
                {'description': {'$regex': filters['search'], '$options': 'i'}}
            ]
        
        if filters.get('city'):
            query['location.city'] = {'$regex': filters['city'], '$options': 'i'}
        
        if filters.get('state'):
            query['location.state'] = {'$regex': filters['state'], '$options': 'i'}
        
        if filters.get('type'):
            query['type'] = filters['type']
        
        if filters.get('institution_type'):
            query['institution_type'] = filters['institution_type']
        
        sort_by = filters.get('sort_by', 'nirf_ranking')
        sort_order = 1 if sort_by in ['name', 'nirf_ranking'] else -1
        
        colleges = await cls.collection.find(query, {'_id': 0}).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
        return [College(**c) for c in colleges]
    
    @classmethod
    async def get_by_id(cls, college_id: str) -> Optional[College]:
        college = await cls.collection.find_one({'id': college_id}, {'_id': 0})
        return College(**college) if college else None
    
    @classmethod
    async def get_by_slug(cls, slug: str) -> Optional[College]:
        college = await cls.collection.find_one({'slug': slug}, {'_id': 0})
        return College(**college) if college else None
    
    @classmethod
    async def create(cls, data: dict) -> College:
        data['id'] = str(uuid4())
        data['created_at'] = datetime.now(timezone.utc).isoformat()
        data['updated_at'] = data['created_at']
        if not data.get('status'):
            data['status'] = 'draft'
        await cls.collection.insert_one(data)
        return await cls.get_by_id(data['id'])
    
    @classmethod
    async def update(cls, college_id: str, data: dict) -> Optional[College]:
        data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await cls.collection.update_one({'id': college_id}, {'$set': data})
        return await cls.get_by_id(college_id)
    
    @classmethod
    async def delete(cls, college_id: str) -> bool:
        result = await cls.collection.delete_one({'id': college_id})
        return result.deleted_count > 0
    
    @classmethod
    async def get_featured(cls, limit: int = 8) -> List[College]:
        colleges = await cls.collection.find({'status': 'published'}, {'_id': 0}).sort('nirf_ranking', 1).limit(limit).to_list(limit)
        return [College(**c) for c in colleges]
    
    @classmethod
    async def get_stats(cls) -> dict:
        total = await cls.collection.count_documents({})
        drafts = await cls.collection.count_documents({'status': 'draft'})
        published = await cls.collection.count_documents({'status': 'published'})
        colleges = await cls.collection.count_documents({'institution_type': 'College'})
        schools = await cls.collection.count_documents({'institution_type': 'School'})
        universities = await cls.collection.count_documents({'institution_type': 'University'})
        return {
            'total': total,
            'drafts': drafts,
            'published': published,
            'colleges': colleges,
            'schools': schools,
            'universities': universities
        }
