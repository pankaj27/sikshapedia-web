from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
from core.database import db
import bcrypt

class SystemUserService:
    collection = db.users
    
    @classmethod
    async def get_all(cls, skip: int = 0, limit: int = 20, **filters) -> List[dict]:
        query = {'role': {'$in': ['admin', 'super_admin', 'moderator']}}
        if filters.get('status'):
            query['status'] = filters['status']
        if filters.get('role'):
            query['role'] = filters['role']
        if filters.get('search'):
            query['$or'] = [
                {'name': {'$regex': filters['search'], '$options': 'i'}},
                {'email': {'$regex': filters['search'], '$options': 'i'}}
            ]
        
        users = await cls.collection.find(query, {'_id': 0, 'password': 0}).skip(skip).limit(limit).to_list(limit)
        return users
    
    @classmethod
    async def get_by_id(cls, user_id: str) -> Optional[dict]:
        return await cls.collection.find_one(
            {'id': user_id, 'role': {'$in': ['admin', 'super_admin', 'moderator']}}, 
            {'_id': 0, 'password': 0}
        )
    
    @classmethod
    async def get_by_email(cls, email: str) -> Optional[dict]:
        return await cls.collection.find_one(
            {'email': email, 'role': {'$in': ['admin', 'super_admin', 'moderator']}}, 
            {'_id': 0}
        )
    
    @classmethod
    async def create(cls, data: dict) -> dict:
        data['id'] = str(uuid4())
        data.setdefault('role', 'admin')
        data['created_at'] = datetime.now(timezone.utc).isoformat()
        data['updated_at'] = data['created_at']
        data.setdefault('status', 'active')
        if data.get('password'):
            data['password'] = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()
        await cls.collection.insert_one(data)
        return await cls.get_by_id(data['id'])
    
    @classmethod
    async def update(cls, user_id: str, data: dict) -> Optional[dict]:
        data['updated_at'] = datetime.now(timezone.utc).isoformat()
        if data.get('password'):
            data['password'] = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()
        await cls.collection.update_one(
            {'id': user_id, 'role': {'$in': ['admin', 'super_admin', 'moderator']}}, 
            {'$set': data}
        )
        return await cls.get_by_id(user_id)
    
    @classmethod
    async def delete(cls, user_id: str) -> bool:
        result = await cls.collection.delete_one(
            {'id': user_id, 'role': {'$in': ['admin', 'super_admin', 'moderator']}}
        )
        return result.deleted_count > 0
    
    @classmethod
    async def get_stats(cls) -> dict:
        total = await cls.collection.count_documents({'role': {'$in': ['admin', 'super_admin', 'moderator']}})
        admins = await cls.collection.count_documents({'role': 'admin'})
        super_admins = await cls.collection.count_documents({'role': 'super_admin'})
        moderators = await cls.collection.count_documents({'role': 'moderator'})
        return {'total': total, 'admins': admins, 'super_admins': super_admins, 'moderators': moderators}
