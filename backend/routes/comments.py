"""Comments API for discussions on colleges, schools, universities, courses, exams"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Comments"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database


# ============================================
# Models
# ============================================

class CommentReply(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    text: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    entity_id: str  # college_id, school_id, etc.
    entity_type: str  # college, school, university, course, exam
    user_id: str
    user_name: str
    text: str
    replies: List[dict] = []
    is_flagged: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CommentCreate(BaseModel):
    entity_id: str
    entity_type: str
    text: str


class ReplyCreate(BaseModel):
    text: str


# ============================================
# Helper function to get current user (simplified)
# ============================================

async def get_current_user_optional(authorization: str = None):
    """Get current user from token if available"""
    if not authorization:
        return None
    try:
        # Import from main server
        import jwt
        import os
        token = authorization.replace("Bearer ", "")
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload.get("user_id")}, {"_id": 0})
        return user
    except:
        return None


# ============================================
# Comment Endpoints
# ============================================

@router.get("/comments/{entity_type}/{entity_id}")
async def get_comments(entity_type: str, entity_id: str, limit: int = 50):
    """Get all comments for an entity (Public)"""
    comments = await db.comments.find(
        {"entity_id": entity_id, "entity_type": entity_type, "is_flagged": False},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    return comments


@router.post("/comments")
async def create_comment(comment_data: CommentCreate, authorization: str = None):
    """Create a new comment (requires login)"""
    from fastapi import Header
    
    # Get authorization from header
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to comment")
    
    user = await get_current_user_optional(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to comment")
    
    comment = Comment(
        entity_id=comment_data.entity_id,
        entity_type=comment_data.entity_type,
        user_id=user["id"],
        user_name=user.get("name", "Anonymous"),
        text=comment_data.text
    )
    
    await db.comments.insert_one(comment.model_dump())
    
    return {"success": True, "comment_id": comment.id, "message": "Comment posted successfully"}


@router.post("/comments/{comment_id}/reply")
async def reply_to_comment(comment_id: str, reply_data: ReplyCreate, authorization: str = None):
    """Reply to a comment (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to reply")
    
    user = await get_current_user_optional(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login to reply")
    
    comment = await db.comments.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    reply = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "user_name": user.get("name", "Anonymous"),
        "text": reply_data.text,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.comments.update_one(
        {"id": comment_id},
        {"$push": {"replies": reply}}
    )
    
    return {"success": True, "message": "Reply added successfully"}


@router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, authorization: str = None):
    """Delete a comment (owner or admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login")
    
    user = await get_current_user_optional(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Please login")
    
    comment = await db.comments.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check ownership or admin
    if comment["user_id"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    await db.comments.delete_one({"id": comment_id})
    
    return {"success": True, "message": "Comment deleted"}


@router.post("/comments/{comment_id}/flag")
async def flag_comment(comment_id: str):
    """Flag a comment for review (Public)"""
    result = await db.comments.update_one(
        {"id": comment_id},
        {"$set": {"is_flagged": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"success": True, "message": "Comment flagged for review"}


# ============================================
# Admin Endpoints
# ============================================

@router.get("/admin/comments/flagged")
async def get_flagged_comments(limit: int = 50):
    """Get flagged comments for admin review"""
    comments = await db.comments.find(
        {"is_flagged": True},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    return comments


@router.patch("/admin/comments/{comment_id}/unflag")
async def unflag_comment(comment_id: str):
    """Unflag a comment (Admin)"""
    result = await db.comments.update_one(
        {"id": comment_id},
        {"$set": {"is_flagged": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"success": True, "message": "Comment unflagged"}
