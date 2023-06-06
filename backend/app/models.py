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
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(100), nullable=True)
    telephone = db.Column(db.String(100), nullable=True)
    hide_flag = db.Column(db.Boolean, nullable=False)
    workplace_id = db.Column(db.Integer, db.ForeignKey('workplace.id'), nullable=False)

    def to_dict(self):
        return {        
            'id': self.id,
            'role': self.role,
            'name': self.name,
            'email_address': self.email_address,
            'telephone': self.telephone,
            'hide_flag': self.hide_flag,
            'workplace_id': self.workplace_id,
        }


class Workplace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Bento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    choose_flag = db.Column(db.Boolean, nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bento_id = db.Column(db.Integer, db.ForeignKey('bento.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Exclude(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exclude_date = db.Column(db.Date, nullable=True)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class TimeFlag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time_flag = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
