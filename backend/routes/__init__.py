"""Routes module - contains all API route handlers"""
from .auth import auth_router
from .blogs import blogs_router
from .news import news_router
from .admin_settings import admin_settings_router
from .uploads import uploads_router

__all__ = [
    'auth_router',
    'blogs_router', 
    'news_router',
    'admin_settings_router',
    'uploads_router'
]
