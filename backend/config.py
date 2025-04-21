import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    PORT = int(os.getenv('FLASK_PORT', 3001))
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'W7#@20057Qverti')
    DB_NAME = os.getenv('DB_NAME', 'crypto_tracker')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False  # True in production with HTTPS
    JWT_COOKIE_CSRF_PROTECT = False