import os
from typing import List
from datetime import date, datetime, timedelta
import secrets
import bcrypt
import jwt
import holidays
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.models import Exclude, User


# 定期的にSECRET_KEYの再生成を行うためのスケジューラを設定
def schedule_secret_key_regeneration() -> None:
    scheduler = BackgroundScheduler()
    scheduler.add_job(set_secret_key_env, CronTrigger(hour=0, minute=0))
    scheduler.start()


# SECRET_KEYを生成する関数
def generate_secret_key(length: int = 32) -> str:
    return secrets.token_hex(length)


# 環境変数に生成したSECRET_KEYを設定
def set_secret_key_env() -> None:
    secret_key = generate_secret_key()
    os.environ['SECRET_KEY'] = secret_key


SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')


# パスワードをハッシュ化する関数
def hash_password(password: str) -> bytes:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password


# パスワードがハッシュ化されたパスワードと一致するか確認する関数
def check_password(password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password)


# ユーザー情報からトークンを生成する関数
def generate_token(user: User) -> str:
    payload = {
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token.decode('utf-8')


# 指定された年の土日祝日を取得する関数
def get_exclude_dates(year: int) -> List[date]:
    jp_holidays = holidays.Japan(years=year)
    exclude_dates = []

    start_date = date(year, 4, 1)
    end_date = date(year + 1, 3, 31)    
    delta = timedelta(days=1)

    while start_date <= end_date:
        if start_date.weekday() >= 5 or start_date in jp_holidays:
            exclude_dates.append(start_date)
        start_date += delta 
    return exclude_dates


# 取得した土日祝日をDBに保存する関数
def insert_exclude_dates(year: int) -> List[date]:
    exclude_dates = get_exclude_dates(year)
    for exclude_date in exclude_dates:
        exclude = Exclude(date=exclude_date)
        db.session.add(exclude)
    db.session.commit() 
    return exclude_dates
