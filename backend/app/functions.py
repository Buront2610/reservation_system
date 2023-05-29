import bcrypt
import jwt
import datetime
import secrets
import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

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
