from app import db


class User(db.User):
    """
    ユーザ情報テーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    PassWord = db.Column(db.String(100), nullable=False)
    Roll = db.Column(db.String(100), nullable=False)
    def to_dict(self):
        # ユーザー情報を辞書形式に変換
        return {
            'id': self.id,
            'PassWord': self.PassWord,
            'Roll': self.Roll
        }
    def __repr__(self):
        return f"<User id={self.id}, PassWord={self.PassWord}, Roll={self.Roll}>"

class Employee(db.Model):
    """
    社員テーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    workplace_id = db.Column(db.Integer, db.ForeignKey('workplace.id'), nullable=False)
    reservations = db.relationship('Reservation', backref='employee', lazy=True)
    mailadress = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        # 社員情報を辞書形式に変換
        return {
            'id': self.id,
            'name': self.name,
            'workplace_id': self.workplace_id,
            'mailadress': self.mailadress
        }
    def __repr__(self):
        return f"<Employee id={self.id}, name={self.name}, workplace_id={self.workplace_id}>"

class Workplace(db.Model):
    """
    勤務場所テーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    employees = db.relationship('Employee', backref='workplace', lazy=True)

    def to_dict(self):
        # 勤務場所情報を辞書形式に変換
        return {
            'id': self.id,
            'name': self.name,
            'employees': self.employees
        }
    def __repr__(self):
        return f"<Employee id={self.id}, name={self.name}>"
class Bento(db.Model):
    """
    弁当テーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    reservations = db.relationship('Reservation', backref='bento', lazy=True)

    def to_dict(self):
        # 弁当情報を辞書形式に変換
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }
    def __repr__(self):
        return f"<Employee id={self.id}, name={self.name}, price={self.price}>"
class Reservation(db.Model):
    """
    予約テーブル
    """
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    bento_id = db.Column(db.Integer, db.ForeignKey('bento.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.String(100), nullable=True)


    def to_dict(self):
        # 予約情報を辞書形式に変換
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'bento_id': self.bento_id,
            'reservation_date': self.reservation_date.isoformat(),
            'quantity': self.quantity,
            'remarks': self.remarks,
        }
    def __repr__(self):
        return f"<Employee id={self.id}, name={self.name}, bento_id={self.bento_id}, reservation_date ={self.reservation_date.isoformat()}, quantity ={self.quantity}>"
