from flask import Flask, request, jsonify,Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from datetime import datetime
from app import create_app, db
from app.models import Employee, Workplace, Bento, Reservation

bp = Blueprint('api', __name__)

app =create_app()

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


# 新しい社員を追加
@bp.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')

    if not name or not location:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    employee = Employee(name=name, location=location)
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.to_dict()), 201

# 既存の社員情報を更新
@bp.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')

    if not name or not location:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    employee = Employee.query.get_or_404(id)
    employee.name = name
    employee.location = location
    db.session.commit()
    return jsonify(employee.to_dict())

# 社員情報を削除
@bp.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': '社員情報を削除しました'}), 200

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
    date = data.get('date')
    meal = data.get('meal')
    price = data.get('price')

    if not employee_id or not date or not meal or not price:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    reservation = Reservation(employee_id=employee_id, date=date, meal=meal, price=price)
    db.session.add(reservation)
    db.session.commit()
    return jsonify(reservation.to_dict()), 201
    

# 既存の予約情報を更新
#
@bp.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id):
    data = request.get_json()
    employee_id = data.get('employee_id')
    date = data.get('date')
    meal = data.get('meal')
    price = data.get('price')
    is_delivered = data.get('is_delivered')

    if not employee_id or not date or not meal or not price:
        return jsonify({'error': 'すべてのフィールドが必要です'}), 400

    reservation = Reservation.query.get_or_404(id)
    reservation.employee_id = employee_id
    reservation.date = date
    reservation.meal = meal
    reservation.price = price
    reservation.is_delivered = is_delivered
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