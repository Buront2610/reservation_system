"""
予約情報をもとに、予約したユーザーにメールを送信する
"""
from datetime import datetime, timedelta, timezone
from backend.app.models import Reservation, User
from backend.app import db
from backend.app.functions import generate_token
from backend.app import app
from flask_mail import Message

# メール送信用の関数
def send_mail():
    # 現在の日時を取得
    now = datetime.now(timezone.utc)

    # 当日の予約情報を取得
    reservations = Reservation.query.filter(Reservation.date == now.date()).all()

    # 予約情報がある場合にメールを送信
    if reservations:
        for reservation in reservations:
            # 予約したユーザーを取得
            user = User.query.get(reservation.user_id)

            # メールの内容を作成
            msg = Message('予約のお知らせ', recipients=[user.email])
            msg.body = f'{user.name}さん、{reservation.date}に弁当の予約があります。'
            msg.html = f'<p>{user.name}さん、{reservation.date}に弁当の予約があります。</p>'

            # メールを送信
            with app.app_context():
                mail.send(msg)