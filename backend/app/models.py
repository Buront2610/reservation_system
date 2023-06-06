"""
各種データテーブルの定義ファイル
現状定義しているデータテーブルは以下になる
・ユーザ情報テーブル(User)
・社員テーブル(Employee)
・勤務場所テーブル(Workplace)
・弁当テーブル(Bento)
・予約テーブル(Reservation)
・除外日テーブル(Exclude)
・時間帯テーブル(TimeFlag)
現状のDBではSQLiteを使用している。
ユーザ数上昇やアクセス数によりパフォーマンスが劣化した場合、別途MySQLなどのRDBMSを検討すること
"""

from app import db

class User(db.Model):
    """
    ユーザ情報テーブル
    ID:社員番号
    """
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(100), nullable=True)
    telephone = db.Column(db.String(100), nullable=True)
    hide_flag = db.Column(db.Boolean, nullable=False)
    workplace_id = db.Column(db.Integer, db.ForeignKey('workplace.id'), nullable=False)

class Workplace(db.Model):
    """
    勤務場所テーブル
    id:勤務場所ID
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)

class Bento(db.Model):
    """
    弁当テーブル
    月ごとに注文社を変えるとのこと
    Flagで判断
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    choose_flag = db.Column(db.Boolean, nullable=False)

class Reservation(db.Model):
    """
    予約テーブル
    IDで他テーブルと一対多の関係を持つ
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bento_id = db.Column(db.Integer, db.ForeignKey('bento.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.String(100), nullable=True)

class Exclude(db.Model):
    """
    除外日テーブル
    DatePickerの除外日制御に使用
    """
    id = db.Column(db.Integer, primary_key=True)
    exclude_date = db.Column(db.Date, nullable=True)

class TimeFlag(db.Model):
    """
    時間フラグテーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    time_flag = db.Column(db.Integer, nullable=False)
