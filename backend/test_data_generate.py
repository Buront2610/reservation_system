"""
テストデータ生成用プログラム
"""
from app import create_app, db
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag
from werkzeug.security import generate_password_hash
from datetime import date
import random
import string

app = create_app()
with app.app_context():
    # データベースにテストデータを追加する
    workplace = Workplace(name='Office1', location='Tokyo')
    db.session.add(workplace)
    db.session.commit()

    for i in range(10):  # 10ユーザを作成します
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))  # ランダムなパスワードを生成
        hashed_password = generate_password_hash(random_password)  # ハッシュ化
        user = User(
            password=hashed_password, 
            role=random.choice(['admin', 'user']),  # ランダムな役割を選択
            name=f'User{i}', 
            email_address=f'user{i}@example.com', 
            telephone=''.join(random.choices(string.digits, k=10)),  # ランダムな10桁の電話番号を生成
            hide_flag=False, 
            workplace_id=1
        )
        db.session.add(user)
        db.session.commit()

    # 以下は先ほどの例と同じです
    bento = Bento(name='Bento1', price=500, choose_flag=True)
    db.session.add(bento)
    db.session.commit()

    reservation = Reservation(user_id=1, bento_id=1, reservation_date=date.today(), 
                              quantity=2, remarks='No onions')
    db.session.add(reservation)
    db.session.commit()

    exclude = Exclude(exclude_date=date.today())
    db.session.add(exclude)
    db.session.commit()

    time_flag = TimeFlag(time_flag=1)
    db.session.add(time_flag)
    db.session.commit()
