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

from fastapi import Header

async def get_current_user_from_header(authorization: str = Header(None)):
    """Get current user from Authorization header - supports both JWT and session tokens"""
    if not authorization:
        return None
    try:
        import jwt
        import os
        token = authorization.replace("Bearer ", "")
        
        # Check if it's a session token (from Google OAuth)
        if token.startswith("session_"):
            # Lookup session in database
            session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
            if not session:
                return None
            user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
            return user
        
        # Otherwise, treat as JWT token
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")  # Token uses 'sub' for user_id
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        return user
    except Exception:
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
async def create_comment(comment_data: CommentCreate, authorization: str = Header(None)):
    """Create a new comment (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to comment")
    
    user = await get_current_user_from_header(authorization)
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
async def reply_to_comment(comment_id: str, reply_data: ReplyCreate, authorization: str = Header(None)):
    """Reply to a comment (requires login)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login to reply")
    
    user = await get_current_user_from_header(authorization)
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
async def delete_comment(comment_id: str, authorization: str = Header(None)):
    """Delete a comment (owner or admin only)"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Please login")
    
    user = await get_current_user_from_header(authorization)
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

@router.get("/admin/comments")
async def get_all_comments_admin(limit: int = 200):
    """Get all comments for admin (Admin only)"""
    comments = await db.comments.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Enrich comments with entity names
    for comment in comments:
        entity_id = comment.get("entity_id")
        entity_type = comment.get("entity_type", "").lower()
        
        entity = None
        entity_type_label = entity_type.capitalize() if entity_type else "Unknown"
        
        if entity_id:
            # Look up based on entity_type
            if entity_type == "college":
                entity = await db.colleges.find_one({"id": entity_id}, {"_id": 0, "name": 1})
            elif entity_type == "school":
                entity = await db.schools.find_one({"id": entity_id}, {"_id": 0, "name": 1})
            elif entity_type == "university":
                entity = await db.universities.find_one({"id": entity_id}, {"_id": 0, "name": 1})
            elif entity_type == "course":
                entity = await db.courses.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                if not entity:
                    entity = await db.courses.find_one({"slug": entity_id}, {"_id": 0, "name": 1})
            elif entity_type == "exam":
                entity = await db.exams.find_one({"id": entity_id}, {"_id": 0, "name": 1})
            
            # Fallback: try all collections if not found
            if not entity:
                for coll_name, label in [("colleges", "College"), ("schools", "School"), 
                                          ("universities", "University"), ("courses", "Course"), ("exams", "Exam")]:
                    coll = getattr(db, coll_name)
                    entity = await coll.find_one({"id": entity_id}, {"_id": 0, "name": 1})
                    if entity:
                        entity_type_label = label
                        break
        
        comment["entity_name"] = entity.get("name") if entity else "Unknown"
        comment["entity_type_label"] = entity_type_label
    
    return comments


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
