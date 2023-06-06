"""
ユーザ操作で各種DB操作を行うAPI
トークン認証などによりセキュリティ対策を行っている
各種CRUD操作を行うエンドポイントと、統計情報を取得するエンドポイントを用意 更新があれば随時追加
"""
from flask import Flask, current_app, request, jsonify,Blueprint,Response
from typing import Union, Tuple
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from app import db
from app.models import Workplace, Bento, Reservation, User, Exclude,TimeFlag
from app.functions import check_password, hash_password,generate_token
import traceback

bp = Blueprint('api', __name__)





class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        # Get a user by ID, or return None if not found
        user = User.query.get(user_id)
        return user

    @staticmethod
    def get_all_users():
        # Get all users
        users = User.query.all()
        return users

    @staticmethod
    def create_user(data):
        # Validate and create a new user
        id  = data.get('id')
        password = data.get('password')
        role = data.get('role')
        name = data.get('name')
        email_address = data.get('email_address')
        telephone = data.get('telephone')
        hide_flag = data.get('hide_flag')
        workplace_id = data.get('workplace_id')

        # フロントエンドでハッシュ化されたパスワードをさらにハッシュ化
        hashed_password = hash_password(password)
        try:
            user = User(id=id, password=hashed_password, role=role, name=name, email_address=email_address, telephone=telephone, hide_flag=hide_flag, workplace_id=workplace_id)
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            current_app.logger.error(f'Error while creating user: {e}\n{traceback.format_exc()}')            
            return None
    
    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        if user is None:
            return None

        password = data.get('password')
        role = data.get('role')
        name = data.get('name')
        email_address = data.get('email_address')
        telephone = data.get('telephone')
        hide_flag = data.get('hide_flag')
        workplace_id = data.get('workplace_id')

        if password is not None:
            # フロントエンドでハッシュ化されたパスワードをさらにハッシュ化
            hashed_password = hash_password(password)
            user.password = hashed_password

        if role is not None:
            user.role = role

        if name is not None:
            user.name = name

        if email_address is not None:
            user.email_address = email_address

        if telephone is not None:
            user.telephone = telephone

        if hide_flag is not None:
            user.hide_flag = hide_flag

        if workplace_id is not None:
            user.workplace_id = workplace_id

        db.session.commit()

        return user

    @staticmethod
    def delete_user(user_id):
        # Delete a user by ID
        user = User.query.get(user_id)
        if user is None:
            return False

        db.session.delete(user)
        db.session.commit()
        return True


# 例: ユーザー認証
@bp.route('/login', methods=['POST'])
def login() -> Tuple[Response, int]:
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')

    if not password or not id:
        return jsonify({'error': 'IDとパスワードが必要です'}), 400

    user = User.query.filter_by(id=id).first()

    if not user:
        return jsonify({'error': 'ユーザーが見つかりません'}), 404

    # フロントエンドでハッシュ化されたパスワードとデータベースのハッシュ化されたパスワードを比較
    if check_password(password, user.password):
        # 認証に成功した場合、トークンを生成して返す
        token = generate_token(user)
        return jsonify({'token': token, 'role': user.role}), 200
    else:
        return jsonify({'error': 'パスワードが間違っています'}), 401
    
#以下にAPIの実装を行う

##ユーザに対するCRUD操作
@bp.route("/users", methods=["GET"])
def get_users() -> Tuple[Response, int]:
    users = UserService.get_all_users()
    return jsonify([u.to_dict() for u in users]) , 200

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


# 勤務場所情報取得
@bp.route("/workplaces", methods=["GET"])
def get_workplaces() -> Tuple[Response, int]:
    workplaces = Workplace.query.all()
    return jsonify([w.to_dict() for w in workplaces]), 200

# 弁当情報取得
@bp.route("/bento", methods=["GET"])
def get_bento() -> Tuple[Response, int]:
    bento = Bento.query.all()
    return jsonify([b.to_dict() for b in bento]),200



###予約情報に対するCRUDエンドポイント###
# 全ての予約情報を取得
@bp.route('/reservations', methods=['GET'])
def get_reservations()-> Tuple[Response, int]:
    reservations = Reservation.query.all()
    return jsonify([r.to_dict() for r in reservations]), 200


# IDで指定した予約情報を取得
@bp.route('/reservations/<int:id>', methods=['GET'])
def get_reservation(id:int)-> Tuple[Response, int]:
    reservation = Reservation.query.get_or_404(id)
    return jsonify(reservation.to_dict()),200

# 新しい予約を追加
@bp.route('/reservations', methods=['POST'])
def add_reservation()-> Tuple[Response, int]:
    data = request.get_json()
    employee_id = data.get('employee_id')
    bento_id = data.get('bento_id')
    reservation_date = data.get('reservation_date')
    quantity = data.get('quantity')
    remarks = data.get('remarks')

    if not employee_id or not bento_id or not reservation_date or not quantity :
        return jsonify({'error': '未入力の必須情報があります。'}), 400

    reservation = Reservation(employee_id=employee_id, bento_id=bento_id, reservation_date=reservation_date, quantity=quantity, remarks=remarks)
    db.session.add(reservation)
    db.session.commit()
    return jsonify(reservation.to_dict()), 201
    

# 既存の予約情報を更新
@bp.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id:int)-> Tuple[Response, int]:
    data = request.get_json()
    employee_id = data.get('employee_id')
    bento_id = data.get('bento_id')
    reservation_date = data.get('reservation_date')
    quantity = data.get('quantity')
    remarks = data.get('remarks')

    if not employee_id or not bento_id or not reservation_date or not quantity :
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    reservation = Reservation.query.get_or_404(id)
    reservation.employee_id = employee_id
    reservation.bento_id = bento_id
    reservation.reservation_date = reservation_date
    reservation.quantity = quantity
    reservation.remarks = remarks
    db.session.commit()
    return jsonify(reservation.to_dict()), 200

# 予約情報を削除
@bp.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id:int) -> Tuple[Response, int]:
    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': '予約情報を削除しました'}), 200


# 統計情報の取得
@bp.route("/statistics", methods=["GET"])
def get_statistics() -> Tuple[Response, int]:
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    if month is None or year is None:
        return jsonify({"error": "Both month and year must be specified"}), 400

    # 各勤務場所の予約数
    location_order_counts = db.session.query(Workplace.name, func.count(Reservation.id)).\
        join(User, Workplace.id == User.workplace_id).\
        join(Reservation, User.id == Reservation.employee_id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Workplace.name).all()

    # 各勤務場所の注文金額
    location_order_amounts = db.session.query(Workplace.name, func.sum(Bento.price * Reservation.quantity)).\
        join(User, Workplace.id == User.workplace_id).\
        join(Reservation, User.id == Reservation.employee_id).\
        join(Bento, Reservation.bento_id == Bento.id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Workplace.name).all()

    # 社員ごとの月次予約数
    employee_monthly_order_counts = db.session.query(User.id, User.name, func.count(Reservation.id)).\
        join(Reservation, User.id == Reservation.employee_id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(User.id).all()

    # 社員ごとの月次注文金額
    employee_monthly_order_amounts = db.session.query(User.id, User.name, func.sum(Bento.price * Reservation.quantity)).\
        join(Reservation, User.id == Reservation.employee_id).\
        join(Bento, Reservation.bento_id == Bento.id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(User.id).all()
    
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    reservations = Reservation.query.paginate(page, per_page, error_out=False)

    # 結果を辞書に格納
    result = {
        "reservations": [reservation.to_dict() for reservation in reservations.items],
        "total": reservations.total,
        "page": reservations.page,
        "per_page": reservations.per_page,
        "location_order_counts": {loc: count for loc, count in location_order_counts},
        "location_order_amounts": {loc: amount for loc, amount in location_order_amounts},
        "employee_monthly_order_counts": {emp_id: {"name": name, "count": count} for emp_id, name, count in employee_monthly_order_counts},
        "employee_monthly_order_amounts": {emp_id: {"name": name, "amount": amount} for emp_id, name, amount in employee_monthly_order_amounts}
    }

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
    data = request.get_json()
    timeflag = data.get('timeflag')
    if not timeflag:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    timeflag = TimeFlag(timeflag=timeflag)
    db.session.add(timeflag)
    db.session.commit()
    return jsonify(timeflag.to_dict()), 201

@bp.route("/timeflag/<int:id>", methods=["GET"])
def get_timeflag_by_id(id:int) -> Tuple[Response, int]:
    timeflag = TimeFlag.query.get_or_404(id)
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
    timeflag = data.get('timeflag')
    if not timeflag:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    timeflag = TimeFlag.query.get_or_404(id)
    timeflag.timeflag = timeflag
    db.session.commit()
    return jsonify(timeflag.to_dict()), 201


