import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    DB_NAME: str = os.environ.get('DB_NAME', 'college_portal')
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = '.env'
        extra = 'ignore'  # Allow extra fields from .env

settings = Settings()
