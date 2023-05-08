# config.py
import os

#データベースの設定
class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///bento_reservation_system.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO=True
    FLASK_DEBUG = os.environ.get("FLASK_DEBUG", False)