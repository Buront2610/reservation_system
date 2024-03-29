"""
ユーザ操作で各種DB操作を行うAPI
トークン認証などによりセキュリティ対策を行っている
各種CRUD操作を行うエンドポイントと、統計情報を取得するエンドポイントを用意 更新があれば随時追加
"""

from importlib.abc import ResourceReader
import time
from venv import create, logger
from flask import Flask, current_app, request, jsonify,Blueprint,Response
from typing import Union, Tuple
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from sqlalchemy.exc import NoResultFound
from app import db
from app.models import Workplace, Bento, Reservation, User, Exclude,TimeFlag
from app.functions import check_password, hash_password,generate_token
import traceback
import re
import datetime
import sys
    
from datetime import date

bp = Blueprint('api', __name__)



# API endpoint to check if initial setup is required
@bp.route('/check_initial_setup', methods=['GET'])
def check_initial_setup():
    if User.query.filter_by(role='admin').count() == 0:
        current_app.logger.info('Initial setup required')
        return jsonify({'initialSetupRequired': True}), 200
    else:
        return jsonify({'initialSetupRequired': False}), 200


# ユーザー操作用のエンドポイント
class UserService:
    @classmethod
    def get_user_by_id(cls, user_id):
        try:
            return db.session.get(User, user_id)
        except Exception as e:
            current_app.logger.error(f'Error while retrieving user: {e}\n{traceback.format_exc()}')
            raise

    @classmethod
    def get_all_users(cls):
        return User.query.all()

    @classmethod
    def create_user(cls, data):
        cls._validate_user_data_for_creation(data)
        
        hashed_password = hash_password(data.get('password'))
        
        try:
            user = User(employee_number=data.get('employee_number'), password=hashed_password, role=data.get('role'), 
                        name=data.get('name'), email_address=data.get('email_address'), 
                        telephone=data.get('telephone'), 
                        workplace_id=data.get('workplace_id'))
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            current_app.logger.error(f'Error while creating user: {e}\n{traceback.format_exc()}')
            raise

    @classmethod
    def update_user(cls, user_id, data):
        cls._validate_user_data_for_update(data)
        
        user = cls.get_user_by_id(user_id)
        
        if 'password' in data:
            user.password = hash_password(data['password'])
        if 'role' in data:
            user.role = data['role']
        if 'name' in data:
            user.name = data['name']
        if 'email_address' in data:
            user.email_address = data['email_address']
        if 'telephone' in data:
            user.telephone = data['telephone']
        if 'workplace_id' in data:
            user.workplace_id = data['workplace_id']
        if 'employee_number' in data:
            user.employee_number = data['employee_number']

        db.session.commit()

        return user

    @classmethod
    def delete_user(cls, user_id):
        user = cls.get_user_by_id(user_id)

        db.session.delete(user)
        db.session.commit()

        return True

    @staticmethod
    def _validate_user_data_for_creation(data):
        # Check if the required fields are present
        required_fields = ['employee_number','password', 'role', 'name']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Check if the email address is in the correct format, if it is present
        email_address = data.get('email_address')
        if email_address and not re.match(r"[^@]+@[^@]+\.[^@]+", email_address):
            raise ValueError("Invalid email address format")

        # Check if the password meets minimum security requirements
        password = data.get('password')
        if len(password) < 4:
            raise ValueError("Password must be at least 8 characters")

        # Check if role is a valid role
        valid_roles = ['admin', 'user', 'guest']
        role = data.get('role')
        if role not in valid_roles:
            raise ValueError("Invalid role")

        # Further validations can be added here based on the specific requirements

    @staticmethod
    def _validate_user_data_for_update(data):
        # Check if the fields that are present are valid
        if 'email_address' in data and data['email_address'] and not re.match(r"[^@]+@[^@]+\.[^@]+", data['email_address']):
            raise ValueError("Invalid email address format")
            
        if 'password' in data and len(data['password']) < 4:
            raise ValueError("Password must be at least 8 characters")
            
        valid_roles = ['admin', 'user', 'guest']
        if 'role' in data and data['role'] not in valid_roles:
            raise ValueError("Invalid role")

        # Further validations can be added here based on the specific requirements

class WorkplaceService:
    @classmethod
    def get_all_workplaces(cls):
        try:
            return Workplace.query.all()
        except Exception as e:
            current_app.logger.error(f'Error while retrieving workplaces: {e}\n{traceback.format_exc()}')
            raise

    @classmethod
    def get_workplace_by_id(cls, workplace_id):
        try:
            return db.session.get(Workplace, workplace_id)
        except Exception as e:
            current_app.logger.error(f'Error while retrieving workplace: {e}\n{traceback.format_exc()}')
            raise

    @classmethod
    def create_workplace(cls, data):
        cls._validate_workplace_data_for_creation(data)
        
        try:
            workplace = Workplace(id=data.get('id'), name=data.get('name'), location=data.get('location'))
            db.session.add(workplace)
            db.session.commit()
            return workplace
        except Exception as e:
            current_app.logger.error(f'Error while creating workplace: {e}\n{traceback.format_exc()}')
            raise

    @classmethod
    def update_workplace(cls, workplace_id, data):
        cls._validate_workplace_data_for_update(data)
        
        workplace = cls.get_workplace_by_id(workplace_id)
        
        if 'name' in data:
            workplace.name = data['name']
        if 'location' in data:
            workplace.location = data['location']

        db.session.commit()

        return workplace

    @classmethod
    def delete_workplace(cls, workplace_id):
        workplace = cls.get_workplace_by_id(workplace_id)

        db.session.delete(workplace)
        db.session.commit()

        return True

    @staticmethod
    def _validate_workplace_data_for_creation(data):
        # Check if the required fields are present
        required_fields = ['name', 'location']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Check that fields are within the maximum length
        if len(data.get('name', '')) > 100:
            raise ValueError("Workplace name is too long")

        if len(data.get('location', '')) > 100:
            raise ValueError("Workplace location is too long")

        # Check that fields are not None
        if data.get('name') is None:
            raise ValueError("Workplace name cannot be None")

        if data.get('location') is None:
            raise ValueError("Workplace location cannot be None")
        
    @staticmethod
    def _validate_workplace_data_for_update(data):
        # Check that fields are within the maximum length
        if 'name' in data and data['name'] is not None and len(data['name']) > 100:
            raise ValueError("Workplace name is too long")

        if 'location' in data and data['location'] is not None and len(data['location']) > 100:
            raise ValueError("Workplace location is too long")



class BentoService:
    @classmethod
    def get_all_bentos(cls):
        bentos = Bento.query.all()
        return bentos
    
    @classmethod
    def get_bento_by_id(cls,bento_id):
        bento = db.session.get(Bento, bento_id)
        return bento

    @classmethod
    def get_bento_by_choose(cls):
        bento = Bento.query.filter_by(choose_flag=True).first()
        return bento
    
    @classmethod
    def create_bento(cls,data):
        name = data.get('name')
        price = data.get('price')
        choose_flag = data.get('choose_flag')
        if choose_flag is None:
            choose_flag = False
        try:
            bento = Bento(name=name, price=price, choose_flag=choose_flag)
            db.session.add(bento)
            db.session.commit()
            return bento
        except Exception as e:
            current_app.logger.error(f'Error while creating bento: {e}\n{traceback.format_exc()}')            
            return None
        
    @classmethod
    def update_bento(cls,bento_id, data):
        bento = db.session.get(Bento, bento_id)
        if bento is None:
            return None

        name = data.get('name')
        price = data.get('price')
        choose_flag = data.get('choose_flag')

        if name is not None:
            bento.name = name

        if price is not None:
            bento.price = price

        if choose_flag is not None:
            bento.choose_flag = choose_flag

        db.session.commit()

        return bento
    
    @classmethod
    def delete_bento(cls,bento_id):
        bento = db.session.get(Bento, bento_id)
        if bento is None:
            return False

        db.session.delete(bento)
        db.session.commit()
        return True

    @staticmethod
    def _validate_bento_data_for_creation(data):
        # Check if the required fields are present
        required_fields = ['id', 'name', 'price', 'choose_flag']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Check that fields are within the maximum length
        if len(data.get('name', '')) > 100:
            raise ValueError("Bento name is too long")

        # Check that fields are not None
        if data.get('name') is None:
            raise ValueError("Bento name cannot be None")

        if data.get('price') is None:
            raise ValueError("Bento price cannot be None")

        if data.get('choose_flag') is None:
            raise ValueError("Bento choose_flag cannot be None")
    
    @staticmethod
    def _validate_bento_data_for_update(data):
        #型チェック
        if not isinstance(data.get('name'), str):
            raise ValueError("Bento name must be string")
        if not isinstance(data.get('price'), int):
            raise ValueError("Bento price must be integer")
        if not isinstance(data.get('choose_flag'), bool):
            raise ValueError("Bento choose_flag must be boolean")
        return True

    
class ReservationService:

    @classmethod
    def get_all_reservations(cls):
        reservations = Reservation.query.all()
        return reservations
    
    @classmethod
    def get_reservation_by_id(cls,user_id):
        reservation = db.session.get(Reservation, user_id)
        return reservation
    
    @classmethod
    def get_reservations_by_user_id(cls, user_id):
        reservations = Reservation.query.filter_by(user_id=user_id).all()
        current_app.logger.info(f"reservations: {reservations}")
        return [Reservation.to_dict() for Reservation in reservations]


    @classmethod
    def create_reservation(cls, data):
        user_id = data.get('user_id')
        bento_id = data.get('bento_id')
        reservation_date = data.get('reservation_date')   
        if isinstance(reservation_date, str):  # date is coming in ISO 8601 string format
            reservation_date = datetime.date.fromisoformat(reservation_date)  # convert to date object
        quantity = data.get('quantity')
        remarks = data.get('remarks')

        # Get the current price of the bento
        try:
            bento = db.session.query(Bento).filter_by(id=bento_id).one()
            price_at_order = bento.price
        except NoResultFound:
            current_app.logger.error(f'Bento with id {bento_id} not found.')
            return None

        try:
            reservation = Reservation(
                user_id=user_id,
                bento_id=bento_id,
                reservation_date=reservation_date,
                quantity=quantity,
                remarks=remarks,
                price_at_order=price_at_order
            )
            db.session.add(reservation)
            db.session.commit()
            return reservation
        except Exception as e:
            current_app.logger.error(f'Error while creating reservation: {e}\n{traceback.format_exc()}')
            return None

    @classmethod
    def update_reservation(cls, reservation_id, data):
        reservation = db.session.get(Reservation, reservation_id)

        if reservation is None:
            return None
        
        user_id = data.get('user_id')
        bento_id = data.get('bento_id')
        reservation_date = data.get('reservation_date')
        if isinstance(reservation_date, str):  # date is coming in ISO 8601 string format
            reservation_date = datetime.date.fromisoformat(reservation_date)  # convert to date object
        quantity = data.get('quantity')
        remarks = data.get('remarks')

        # Get the current price of the bento
        try:
            bento = db.session.query(Bento).filter_by(id=bento_id).one()
            price_at_order = bento.price
        except NoResultFound:
            current_app.logger.error(f'Bento with id {bento_id} not found.')
            return None

        if user_id is not None:
            reservation.user_id = user_id
        
        if bento_id is not None:
            reservation.bento_id = bento_id
            reservation.price_at_order = price_at_order
        
        if reservation_date is not None:
            reservation.reservation_date = reservation_date
        
        if quantity is not None:
            reservation.quantity = quantity
        
        if remarks is not None:
            reservation.remarks = remarks
        
        db.session.commit()

        return reservation
    
    @classmethod
    def delete_reservation(cls,reservation_id):
        reservation = db.session.get(Reservation, reservation_id)
        if reservation is None:
            return False

        db.session.delete(reservation)
        db.session.commit()
        return True
    
    @staticmethod
    def _validate_reservation_data_for_creation(data):
        # Check that required fields are present
        required_fields = ['user_id', 'bento_id', 'reservation_date', 'quantity']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # Check that fields are not None
        if data.get('user_id') is None:
            raise ValueError("Reservation user_id cannot be None")

        if data.get('bento_id') is None:
            raise ValueError("Reservation bento_id cannot be None")
        
        if data.get('reservation_date') is None:
            raise ValueError("Reservation reservation_date cannot be None")
        
        if data.get('quantity') is None:
            raise ValueError("Reservation quantity cannot be None")
    
    @staticmethod
    def _validate_reservation_data_for_update(data):
        validation_errors = []

        # user_id validation
        user_id = data.get('user_id')
        if user_id is not None:
            if type(user_id) is not int:
                validation_errors.append("user_id must be an integer")

        # bento_id validation
        bento_id = data.get('bento_id')
        if bento_id is not None:
            if type(bento_id) is not int:
                validation_errors.append("bento_id must be an integer")

        # reservation_date validation
        reservation_date = data.get('reservation_date')
        if reservation_date is not None:
            if type(reservation_date) is not datetime.date:
                validation_errors.append("reservation_date must be a date object")

        # quantity validation
        quantity = data.get('quantity')
        if quantity is not None:
            if type(quantity) is not int or quantity <= 0:
                validation_errors.append("quantity must be a positive integer")

        # remarks validation
        remarks = data.get('remarks')
        if remarks is not None:
            if type(remarks) is not str:
                validation_errors.append("remarks must be a string")
        
        if validation_errors:
            return False, validation_errors

        return True, "Valid data"


# 例: ユーザー認証
@bp.route('/login', methods=['POST'])
def login() -> Tuple[Response, int]:
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')
    current_app.logger.info(f"id: {id}, password: {password}")
    sys.stdout.flush()

    if not password or not id:
        current_app.logger.info(f"password: {password}, id: {id}")
        return jsonify({'error': 'IDとパスワードが必要です'}), 400

    user = User.query.filter_by(employee_number=id).first()
    current_app.logger.info(f"user: {user}")

    if not user:
        return jsonify({'error': 'ユーザーが見つかりません'}), 404

    # フロントエンドでハッシュ化されたパスワードとデータベースのハッシュ化されたパスワードを比較
    if check_password(password, user.password):
        # 認証に成功した場合、トークンを生成して返す
        token = generate_token(user)
        current_app.logger.info(f"token: {token}")
        return jsonify({'id': user.id, 'token': token, 'role': user.role}), 200
    else:
        current_app.logger.info(f"error: パスワードが間違っています")
        sys.stdout.write("error: パスワードが間違っています")
        return jsonify({'error': 'パスワードが間違っています'}), 401
    
#以下にAPIの実装を行う

#初回起動時管理者登録用メソッド
@bp.route('/setup', methods=['POST'])
def setup_admin():
    """
    Endpoint to set up an admin account.
    """
    try:
        data = request.get_json()
        create_timeflag()
        create_guest()
        
        # Validate incoming data
        if not data or 'id' not in data or 'password' not in data:
            return jsonify({'success': False, 'message': 'Invalid data.'}), 400
        
        employee_number = data['id']
        password = data['password']
        
        # Check if an admin already exists
        admin_count = User.query.filter_by(role='admin').count()
        sys.stdout.write("count:{admin_count}")

        
        if admin_count > 0:
            sys.stdout.write("count:{admin_count}")
            return jsonify({'success': False, 'message': 'Admin account already exists.'}), 400
        
        # Hash the password
        hashed_password = hash_password(password)
        
        
        # Create the new admin user
        # Here, I'm hard-coding the values for non-nullable fields like employee_number, name, and workplace_id
        new_admin = User(
            password=hashed_password, 
            role='admin',
            employee_number= employee_number,  # Hard-coded value
            name="Administrator",       # Hard-coded value
            workplace_id=1              # Hard-coded value, assuming a workplace with id=1 exists
        )
        sys.stdout.write(f"new_admin: {new_admin}")
        # timeflag = TimeFlag(False)
        # db.session.add(timeflag)

        db.session.add(new_admin)
        db.session.commit()
        
        current_app.logger.info(f"Admin account created successfully.")

        return jsonify({'success': True, 'message': 'Admin account created successfully.'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error while creating admin account: {e}")
        return jsonify({'Error': False, 'message': 'An error occurred while creating the admin account.'}), 500
    
def create_guest():
    try:
        count = User.query.filter_by(role='guest').count()
        if count > 0:
            return jsonify({'success': False, 'message': 'Guest account already exists.'}), 400
        
        new_guest = User(
            password=hash_password('guest'),
            role='guest',
            employee_number= 99999,  # Hard-coded value
            name="Guest",       # Hard-coded value
            workplace_id=1              # Hard-coded value, assuming a workplace with id=1 exists
        )

        db.session.add(new_guest)
        db.session.commit()
        current_app.logger.info(f"Guest account created successfully.")
    except Exception as e:
        current_app.logger.error(f"Error while creating guest account: {e}")
        return jsonify({'Error': False, 'message': 'An error occurred while creating the guest account.'}), 500

##ユーザに対するCRUD操作
@bp.route("/users", methods=["GET"])
def get_users() -> Tuple[Response, int]:
    users = UserService.get_all_users()
    return jsonify([users.to_dict() for users in users]) , 200

@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id: int) -> Tuple[Response, int]:
    user = UserService.get_user_by_id(user_id)
    if user is None:
        return jsonify({"error": "ユーザーが見つかりません"}), 404
    return jsonify(user.to_dict()), 200

@bp.route('/users', methods=['POST'])
def add_user() -> Tuple[Response, int]:
    data = request.get_json()
    current_app.logger.info(f"Received data: {data}")

    user = UserService.create_user(data)
    if user is None:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400
    return jsonify(user.to_dict()), 201

@bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id) -> Tuple[Response, int]:
    data = request.get_json()
    user = UserService.update_user(user_id, data)
    if user is None:
        return jsonify({'error': '更新するユーザーが見つかりません'}), 404
    return jsonify(user.to_dict()), 200

@bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id) -> Tuple[Response, int]:
    if UserService.delete_user(user_id):
        return jsonify({'message': 'ユーザー情報を削除しました'}), 200
    else:
        return jsonify({"error": "ユーザーが見つかりません"}), 404


###勤務場所に対するCRUDエンドポイント###
# 勤務場所情報取得
@bp.route("/workplaces", methods=["GET"])
def get_workplaces() -> Tuple[Response, int]:
    workplaces = WorkplaceService.get_all_workplaces()
    return jsonify([w.to_dict() for w in workplaces]), 200

@bp.route("/workplaces/<int:workplace_id>", methods=["GET"])
def get_workplace(workplace_id: int) -> Tuple[Response, int]:
    workplace = WorkplaceService.get_workplace_by_id(workplace_id)
    if workplace is None:
        return jsonify({"error": "勤務場所が見つかりません"}), 404
    return jsonify(workplace.to_dict()), 200

@bp.route("/workplaces", methods=["POST"])
def add_workplace() -> Tuple[Response, int]:
    data = request.get_json()
    current_app.logger.info(f"Received data: {data}")

    workplace = WorkplaceService.create_workplace(data)
    if workplace is None:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400
    return jsonify(workplace.to_dict()), 201

@bp.route("/workplaces/<int:workplace_id>", methods=["PUT"])
def update_workplace(workplace_id:int) -> Tuple[Response, int]:
    data = request.get_json()
    workplace = WorkplaceService.update_workplace(workplace_id, data)
    if workplace is None:
        return jsonify({'error': '更新する勤務場所が見つかりません'}), 404
    return jsonify(workplace.to_dict()), 200

@bp.route("/workplaces/<int:workplace_id>", methods=["DELETE"])
def delete_workplace(workplace_id:int) -> Tuple[Response, int]:
    if WorkplaceService.delete_workplace(workplace_id):
        return jsonify({'message': '勤務場所情報を削除しました'}), 200
    else:
        return jsonify({"error": "勤務場所が見つかりません"}), 404

##弁当情報に対するCRADエンドポイント##
# 弁当情報取得
@bp.route("/bento", methods=["GET"])
def get_bento() -> Tuple[Response, int]:
    bento = BentoService.get_all_bentos()
    if bento is None:
        return jsonify({"error": "データ未入力です"}), 404
    return jsonify([b.to_dict() for b in bento]),200

@bp.route("/bento/<int:bento_id>", methods=["GET"])
def get_bento_by_id(bento_id:int) -> Tuple[Response, int]:
    bento = BentoService.get_bento_by_id(bento_id)
    if bento is None:
        return jsonify({"error": "弁当が見つかりません"}), 404
    return jsonify(bento.to_dict()), 200

@bp.route("/bento/choose", methods=["GET"])
def get_bento_by_choose_flag() -> Tuple[Response, int]:
    bento = BentoService.get_bento_by_choose()
    if bento is None:
        return jsonify({"error": "弁当が見つかりません"}), 404
    return jsonify(bento.to_dict()), 200

@bp.route("/bento", methods=["POST"])
def add_bento() -> Tuple[Response, int]:
    data = request.get_json()
    current_app.logger.info(f"Received data: {data}")

    bento = BentoService.create_bento(data)
    if bento is None:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400
    return jsonify(bento.to_dict()), 201

@bp.route("/bento/<int:bento_id>", methods=["PUT"])
def update_bento(bento_id:int) -> Tuple[Response, int]:
    data = request.get_json()
    bento = BentoService.update_bento(bento_id, data)
    if bento is None:
        return jsonify({'error': '更新する項目が見つかりません'}), 404
    return jsonify(bento.to_dict()), 200

@bp.route("/bento/<int:bento_id>", methods=["DELETE"])
def delete_bento(bento_id:int) -> Tuple[Response, int]:
    if BentoService.delete_bento(bento_id):
        return jsonify({'message': '弁当情報を削除しました'}), 200
    else:
        return jsonify({"error": "弁当が見つかりません"}), 404


###予約情報に対するCRUDエンドポイント###
# 全ての予約情報を取得
@bp.route('/reservations', methods=['GET'])
def get_reservations()-> Tuple[Response, int]:
    reservations = ReservationService.get_all_reservations()
    return jsonify([r.to_dict() for r in reservations]), 200


@bp.route('/reservations/<int:id>', methods=['GET'])
def get_reservation_by_id(id:int)-> Tuple[Response, int]:
    reservation = ReservationService.get_reservation_by_id(id)
    return jsonify(reservation.to_dict()), 200

# IDで指定した予約情報を取得
@bp.route('/reservations/user/<string:user_id>', methods=['GET'])
def get_reservation_user_id(user_id:str)-> Tuple[Response, int]:
    current_app.logger.info(f"Received user_id: {user_id}")
    reservations = ReservationService.get_reservations_by_user_id(user_id)
  
    return jsonify(reservations),200

# 新しい予約を追加
@bp.route('/reservations', methods=['POST'])
def add_reservation()-> Tuple[Response, int]:
    data = request.get_json()

    reservation = ReservationService.create_reservation(data)

    if reservation is None:
        return jsonify({'error': 'Reservation could not be created'}), 400

    return jsonify(reservation.to_dict()), 201

# 既存の予約情報を更新
@bp.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id:int)-> Tuple[Response, int]:
    data = request.get_json()



    reservation = ReservationService.update_reservation(id, data)
    if reservation is None:
        return jsonify({'error': '更新する予約情報が見つかりません'}), 404
    else:
        return jsonify(reservation.to_dict()), 200

# 予約情報を削除
@bp.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id:int) -> Tuple[Response, int]:
    if ReservationService.delete_reservation(id):
        return jsonify({'message': '予約情報を削除しました'}), 200
    else:
        return jsonify({"error": "予約情報が見つかりません"}), 404


# 統計情報の取得
def filter_by_month_and_year(query, month, year):
    return query.filter(extract("month", Reservation.reservation_date) == month,
                        extract("year", Reservation.reservation_date) == year)


def query_location_statistics(base_query, month, year):
    return filter_by_month_and_year(base_query, month, year).group_by(Workplace.name).all()

def query_employee_statistics(base_query, month, year):
    return filter_by_month_and_year(base_query, month, year).group_by(User.employee_number).all()

def get_pagination_parameters():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    return page, per_page

@bp.route("/statistics/<int:year>/<int:month>", methods=["GET"])
def get_statistics(year: int, month: int) -> Tuple[Response, int]:
    # Base queries
    base_location_query = db.session.query(Workplace.name, func.count(Reservation.id))\
        .join(User, Workplace.id == User.workplace_id)\
        .join(Reservation, User.employee_number == Reservation.user_id)\
        .filter(User.role != 'admin')

    base_employee_query = db.session.query(User.employee_number, User.name, func.count(Reservation.id))\
        .join(Reservation, User.employee_number == Reservation.user_id)\
        .filter(User.role != 'admin')

    # Query statistics
    location_order_counts = query_location_statistics(base_location_query, month, year)
    location_order_amounts = query_location_statistics(base_location_query.with_entities(Workplace.name, func.sum(Reservation.price_at_order * Reservation.quantity)), month, year)
    employee_monthly_order_counts = query_employee_statistics(base_employee_query, month, year)
    employee_monthly_order_amounts = query_employee_statistics(base_employee_query.with_entities(User.employee_number, User.name, func.sum(Reservation.price_at_order * Reservation.quantity)), month, year)

    # Pagination
    page, per_page = get_pagination_parameters()
    reservations = Reservation.query.paginate(page=page, per_page=per_page, error_out=False)

    # Prepare result
    result = {
        "reservations": [reservation.to_dict() for reservation in reservations.items],
        "total": reservations.total,
        "page": reservations.page,
        "per_page": reservations.per_page,
        "location_order_counts": {loc: count for loc, count in location_order_counts},
        "location_order_amounts": {loc: amount for loc, amount in location_order_amounts},
        "employee_monthly_order_counts": {emp_num: {"name": name, "count": count} for emp_num, name, count in employee_monthly_order_counts},
        "employee_monthly_order_amounts": {emp_num: {"name": name, "amount": amount} for emp_num, name, amount in employee_monthly_order_amounts}
    }

    current_app.logger.info(result)

    return jsonify(result), 200




##除外日に対するCRUDエンドポイント
@bp.route("/exclude", methods=["GET"])
def get_exclude() -> Tuple[Response, int]:
    excludes = Exclude.query.all()
    return jsonify([exclude.to_dict() for exclude in excludes]), 200

@bp.route("/exclude", methods=["POST"])
def create_exclude() -> Tuple[Response, int]:
    data = request.get_json()
    exclude_date = data.get('exclude_date')
    if not exclude_date:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    if isinstance(exclude_date, str):  # date is coming in ISO 8601 string format
        exclude_date = datetime.date.fromisoformat(exclude_date)  # convert to date object
    exclude = Exclude(exclude_date=exclude_date)
    db.session.add(exclude)
    db.session.commit()
    return jsonify(exclude.to_dict()), 201

@bp.route("/exclude/<int:id>", methods=["GET"])
def get_exclude_by_id(id:int) -> Tuple[Response, int]:
    exclude = Exclude.query.get_or_404(id)
    return jsonify(exclude.to_dict()), 200

@bp.route("/exclude/<int:id>", methods=["DELETE"])
def delete_exclude(id:int) -> Tuple[Response, int]:
    exclude = Exclude.query.get_or_404(id)
    db.session.delete(exclude)
    db.session.commit()
    return jsonify({'message': '除外日を削除しました'}), 200

@bp.route("/exclude/<int:id>", methods=["PUT"])
def update_exclude(id:int) -> Tuple[Response, int]:
    data = request.get_json()
    exclude_date = data.get('exclude_date')
    if not exclude_date:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    exclude = Exclude.query.get_or_404(id)
    exclude.exclude_date = exclude_date
    db.session.commit()
    return jsonify(exclude.to_dict()), 201

@bp.route("/timeflag", methods=["GET"])
def get_timeflag():
    timeflags = TimeFlag.query.all()
    return jsonify([timeflag.to_dict() for timeflag in timeflags]),200

@bp.route("/timeflag", methods=["POST"])
def create_timeflag() -> Tuple[Response, int]:
    # data = request.get_json()
    # timeflag = data.get('timeflag')
    # if not timeflag:
    #     return jsonify({'error': '未入力の必須情報があります。'}), 400
    if TimeFlag.query.first() is not None:
        return jsonify({'error': 'すでに時間フラグが存在します。'}), 400
    time_flag = TimeFlag(time_flag=False)
    db.session.add(time_flag)
    db.session.commit()
    return jsonify(time_flag.to_dict()), 201


@bp.route("/timeflag/<int:id>", methods=["GET"])
def get_timeflag_by_id(id:int) -> Tuple[Response, int]:
    timeflag = TimeFlag.query.get_or_404(id)
    current_app.logger.info('timeflag: %s', timeflag)
    return jsonify(timeflag.to_dict()),200

@bp.route("/timeflag/<int:id>", methods=["DELETE"])
def delete_timeflag(id:int) -> Tuple[Response, int]:
    timeflag = TimeFlag.query.get_or_404(id)
    db.session.delete(timeflag)
    db.session.commit()
    return jsonify({'message': '時間フラグを削除しました'}), 200

@bp.route("/timeflag/<int:id>", methods=["PUT"])
def update_timeflag(id:int) -> Tuple[Response, int]:
    data = request.get_json()
    time_flag = data.get('time_flag')
    current_app.logger.info('data:',data)
    if time_flag is None:
        current_app.logger.info('data: %s', data)
        current_app.logger.info('time_flag: %s', time_flag)

        return jsonify({'error': '未入力の必須情報があります。'}), 400
    try:
        timeflag_obj = TimeFlag.query.get_or_404(id)
        current_app.logger.info('timeflag_obj:',timeflag_obj)
        timeflag_obj.time_flag = time_flag
        db.session.commit()
        return jsonify(timeflag_obj.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(e) 
        return jsonify({'error': 'エラーが発生しました。'}), 500

