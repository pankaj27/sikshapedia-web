"""Taxonomy & Master Data API - Streams, SubStreams, Boards"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
import uuid

router = APIRouter(prefix="/api", tags=["Taxonomy"])

# Database reference (set by main app)
db = None

def set_database(database):
    global db
    db = database

# Models
class Stream(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubStream(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    stream_id: Optional[str] = None
    stream_name: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Board(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================
# Streams Endpoints
# ============================================

@router.get("/streams")
async def get_streams(limit: int = 100):
    """Get all streams"""
    streams = await db.streams.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return streams


@router.post("/streams", response_model=Stream)
async def create_stream(stream: Stream):
    """Create a new stream (admin only)"""
    await db.streams.insert_one(stream.model_dump())
    return stream


@router.put("/streams/{stream_id}")
async def update_stream(stream_id: str, stream: Stream):
    """Update a stream (admin only)"""
    await db.streams.update_one({"id": stream_id}, {"$set": stream.model_dump()})
    return stream


@router.delete("/streams/{stream_id}")
async def delete_stream(stream_id: str):
    """Delete a stream (admin only)"""
    await db.streams.delete_one({"id": stream_id})
    return {"success": True}


# ============================================
# Sub-Streams Endpoints
# ============================================

@router.get("/sub-streams")
async def get_sub_streams(limit: int = 500, stream_id: Optional[str] = None):
    """Get all sub-streams with optional stream filter"""
    query = {}
    if stream_id:
        query["stream_id"] = stream_id
    
    sub_streams = await db.sub_streams.find(query, {"_id": 0}).limit(limit).to_list(limit)
    
    # Get all streams for name lookup
    all_streams = {s['id']: s['name'] for s in await db.streams.find({}, {"_id": 0, "id": 1, "name": 1}).to_list(100)}
    
    # Add stream_name for display
    for sub_stream in sub_streams:
        if sub_stream.get('stream_id'):
            sub_stream['stream_name'] = all_streams.get(sub_stream['stream_id'], '')
    
    return sub_streams


@router.post("/sub-streams", response_model=SubStream)
async def create_sub_stream(sub_stream: SubStream):
    """Create a new sub-stream (admin only)"""
    await db.sub_streams.insert_one(sub_stream.model_dump())
    return sub_stream


@router.put("/sub-streams/{sub_stream_id}")
async def update_sub_stream(sub_stream_id: str, sub_stream: SubStream):
    """Update a sub-stream (admin only)"""
    await db.sub_streams.update_one({"id": sub_stream_id}, {"$set": sub_stream.model_dump()})
    return sub_stream


@router.delete("/sub-streams/{sub_stream_id}")
async def delete_sub_stream(sub_stream_id: str):
    """Delete a sub-stream (admin only)"""
    await db.sub_streams.delete_one({"id": sub_stream_id})
    return {"success": True}


# ============================================
# Boards Endpoints
# ============================================

@router.get("/boards")
async def get_boards(limit: int = 100):
    """Get all education boards"""
    boards = await db.boards.find({}, {"_id": 0}).limit(limit).to_list(limit)
    return boards


@router.post("/boards", response_model=Board)
async def create_board(board: Board):
    """Create a new board (admin only)"""
    await db.boards.insert_one(board.model_dump())
    return board


@router.put("/boards/{board_id}")
async def update_board(board_id: str, board: Board):
    """Update a board (admin only)"""
    await db.boards.update_one({"id": board_id}, {"$set": board.model_dump()})
    return board


@router.delete("/boards/{board_id}")
async def delete_board(board_id: str):
    """Delete a board (admin only)"""
    await db.boards.delete_one({"id": board_id})
    return {"success": True}
