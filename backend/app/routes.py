"""
ユーザ操作で各種DB操作を行うAPI
トークン認証などによりセキュリティ対策を行っている
各種CRUD操作を行うエンドポイントと、統計情報を取得するエンドポイントを用意
その他追加があれば随時追加
"""
from flask import Flask, request, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from app import create_app, db
from app.models import Employee, Workplace, Bento, Reservation, User, Exclude,TimeFlag
from backend.app.functions import check_password, hash_password,generate_token

bp = Blueprint('api', __name__)

app =create_app()
###routeの並びがめちゃめちゃで可読性悪い
###後で直す　CRUDエンドポイントに並べなおすこと
###ここでもAPIにアクセスされないようトークン認証を行うようにする

# 例: ユーザー認証
@bp.route('/login', methods=['POST'])
def login():
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

# 勤務場所情報取得
@bp.route("/workplaces", methods=["GET"])
def get_workplaces():
    workplaces = Workplace.query.all()
    return jsonify([w.to_dict() for w in workplaces])

# 弁当情報取得
@bp.route("/bento", methods=["GET"])
def get_bento():
    bento = Bento.query.all()
    return jsonify([b.to_dict() for b in bento])

#ユーザ取得
@bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

#個別ユーザ取得
@bp.route("/User/<int:User_id>", methods=["GET"])
def get_user(User_id):
    user = User.query.get(User_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict())

# 全ての社員情報を取得
@bp.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees])

# IDで指定した社員情報を取得
@bp.route("/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):
    employee = Employee.query.get(employee_id)
    if employee is None:
        return jsonify({"error": "Employee not found"}), 404

    return jsonify(employee.to_dict())


@bp.route('/User', methods=['POST'])
def add_user():
    data = request.get_json()
    id  = data.get('id')
    password = data.get('password')
    role = data.get('role')

    if not password or not role or not id:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    # フロントエンドでハッシュ化されたパスワードをさらにハッシュ化
    hashed_password = hash_password(password)

    user = User(id=id, password=hashed_password, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# 新しい社員を追加
@bp.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    id  = data.get('id')
    name = data.get('name')
    Workplace_id = data.get('Workplace_id')
    mailadress = data.get('mailadress')

    if not name or not Workplace_id or not id:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    employee = Employee(id = id ,name=name, Workplace_id=Workplace_id, mailadress=mailadress)
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.to_dict()), 201

# 既存の社員情報を更新
@bp.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    name = data.get('name')
    workplace_id = data.get('workplace_id')
    reservations = data.get('reservations')
    mail_adress = data.get('mail_adress')
    if not name or not workplace_id or not reservations:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    employee = Employee.query.get_or_404(id)
    employee.name = name
    employee.workplace_id = workplace_id
    employee.reservations = reservations
    employee.mail_adress = mail_adress
    db.session.commit()
    return jsonify(employee.to_dict())

@bp.route('/User/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'ユーザー情報を削除しました'}), 200

# 社員情報を削除
@bp.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': '社員情報を削除しました'}), 200

###予約情報に対するCRUDエンドポイント###
# 全ての予約情報を取得
@bp.route('/reservations', methods=['GET'])
def get_reservations():
    reservations = Reservation.query.all()
    return jsonify([r.to_dict() for r in reservations])


# IDで指定した予約情報を取得
@bp.route('/reservations/<int:id>', methods=['GET'])
def get_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    return jsonify(reservation.to_dict())

# 新しい予約を追加
@bp.route('/reservations', methods=['POST'])
def add_reservation():
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
def update_reservation(id):
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
    return jsonify(reservation.to_dict())

# 予約情報を削除
@bp.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': '予約情報を削除しました'}), 200


# 統計情報の取得
@bp.route("/statistics", methods=["GET"])
def get_statistics():
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    if month is None or year is None:
        return jsonify({"error": "Both month and year must be specified"}), 400

    # 各勤務場所の予約数
    location_order_counts = db.session.query(Workplace.name, func.count(Reservation.id)).\
        join(Employee, Workplace.id == Employee.workplace_id).\
        join(Reservation, Employee.id == Reservation.employee_id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Workplace.name).all()

    # 各勤務場所の注文金額
    location_order_amounts = db.session.query(Workplace.name, func.sum(Bento.price * Reservation.quantity)).\
        join(Employee, Workplace.id == Employee.workplace_id).\
        join(Reservation, Employee.id == Reservation.employee_id).\
        join(Bento, Reservation.bento_id == Bento.id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Workplace.name).all()

    # 社員ごとの月次予約数
    employee_monthly_order_counts = db.session.query(Employee.id, Employee.name, func.count(Reservation.id)).\
        join(Reservation, Employee.id == Reservation.employee_id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Employee.id).all()

    # 社員ごとの月次注文金額
    employee_monthly_order_amounts = db.session.query(Employee.id, Employee.name, func.sum(Bento.price * Reservation.quantity)).\
        join(Reservation, Employee.id == Reservation.employee_id).\
        join(Bento, Reservation.bento_id == Bento.id).\
        filter(extract("month", Reservation.reservation_date) == month, extract("year", Reservation.reservation_date) == year).\
        group_by(Employee.id).all()
    
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

    return jsonify(result)

##除外日に対するCRUDエンドポイント
@bp.route("/exclude", methods=["GET"])
def get_exclude():
    excludes = Exclude.query.all()
    return jsonify([exclude.to_dict() for exclude in excludes])

@bp.route("/exclude", methods=["POST"])
def create_exclude():
    data = request.get_json()
    exclude_date = data.get('exclude_date')
    if not exclude_date:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    exclude = Exclude(exclude_date=exclude_date)
    db.session.add(exclude)
    db.session.commit()
    return jsonify(exclude.to_dict()), 201

@bp.route("/exclude/<int:id>", methods=["GET"])
def get_exclude_by_id(id):
    exclude = Exclude.query.get_or_404(id)
    return jsonify(exclude.to_dict())

@bp.route("/exclude/<int:id>", methods=["DELETE"])
def delete_exclude(id):
    exclude = Exclude.query.get_or_404(id)
    db.session.delete(exclude)
    db.session.commit()
    return jsonify({'message': '除外日を削除しました'}), 200

@bp.route("/exclude/<int:id>", methods=["PUT"])
def update_exclude(id):
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
    return jsonify([timeflag.to_dict() for timeflag in timeflags])

@bp.route("/timeflag", methods=["POST"])
def create_timeflag():
    data = request.get_json()
    timeflag = data.get('timeflag')
    if not timeflag:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    timeflag = TimeFlag(timeflag=timeflag)
    db.session.add(timeflag)
    db.session.commit()
    return jsonify(timeflag.to_dict()), 201

@bp.route("/timeflag/<int:id>", methods=["GET"])
def get_timeflag_by_id(id):
    timeflag = TimeFlag.query.get_or_404(id)
    return jsonify(timeflag.to_dict())

@bp.route("/timeflag/<int:id>", methods=["DELETE"])
def delete_timeflag(id):
    timeflag = TimeFlag.query.get_or_404(id)
    db.session.delete(timeflag)
    db.session.commit()
    return jsonify({'message': '時間フラグを削除しました'}), 200

@bp.route("/timeflag/<int:id>", methods=["PUT"])
def update_timeflag(id):
    data = request.get_json()
    timeflag = data.get('timeflag')
    if not timeflag:
        return jsonify({'error': '未入力の必須情報があります。'}), 400
    timeflag = TimeFlag.query.get_or_404(id)
    timeflag.timeflag = timeflag
    db.session.commit()
    return jsonify(timeflag.to_dict()), 201


