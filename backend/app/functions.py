import bcrypt
import jwt
import datetime
from datetime import datetime, timedelta, timezone
import holidays
import secrets
import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.models import Exclude

"""
以下に各種関数を定義
主に認証関連の関数を定義
フロントから入力されたパスをさらにハッシュ化してDBに保存する
トークン生成用関数を後々追加
"""

def schedule_secret_key_regeneration():
    scheduler = BackgroundScheduler()
    scheduler.add_job(set_secret_key_env, CronTrigger(hour=0, minute=0))
    scheduler.start()

# JWTで使用するSECRET_KEYを生成
def generate_secret_key(length=32):
    return secrets.token_hex(length)

# JWTで使用するSECRET_KEYを設定
def set_secret_key_env():
    secret_key = generate_secret_key()
    os.environ['SECRET_KEY'] = secret_key


SECRET_KEY = 'your_secret_key'

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode(), hashed_password)

def generate_token(user):
    payload = {
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # 有効期限を設定することができます。
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token.decode('utf-8')


#土日祝日取得関数
def get_exclude_dates(year):
    #土日祝日を取得
    jp_holidays = holidays.Japan(years=year)

    #除外日をリストに格納
    exclude_dates = []

    #4月1にから翌年3月31日までの日付を取得する
    start_date = date(year, 4, 1)
    end_date = date(year + 1, 3, 31)    
    delta = timedelta(days=1)

    #土日祝日を除外日リストに追加
    while start_date <= end_date:
        if start_date.weekday() >= 5 or start_date in jp_holidays:
            exclude_dates.append(start_date)
        start_date += delta 
    return exclude_dates


#除外日をDBに登録する関数
def insert_exclude_dates(year):
    exclude_dates = get_exclude_dates(year)
    for exclude_date in exclude_dates:
        exclude = Exclude(date=exclude_date)
        db.session.add(exclude)
    db.session.commit() 
    return exclude_dates


