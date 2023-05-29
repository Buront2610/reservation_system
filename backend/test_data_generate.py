"""
テストデータ生成用プログラム
"""
from app import db
from datetime import date, timedelta
from random import randint, choice
import bcrypt
from app.models import User,Workplace,Employee,Bento,Reservation,Exclude,TimeFlag
from app.functions import hash_password

# Create test data for User table
users = []
for i in range(10):
    password = f"password{i}"
    hashed_password = hash_password(password)
    user = User(PassWord=hashed_password, Roll=f"roll{i}")
    users.append(user)

# Create test data for Workplace table
workplaces = []
for i in range(5):
    workplace = Workplace(name=f"Workplace {i}")
    workplaces.append(workplace)

# Create test data for Employee table
employees = []
for i in range(20):
    employee = Employee(name=f"Employee {i}", workplace_id=choice(workplaces).id)
    employees.append(employee)

# Create test data for Bento table
bentos = []
for i in range(10):
    bento = Bento(name=f"Bento {i}", price=randint(500, 1500))
    bentos.append(bento)

# Create test data for Reservation table
reservations = []
for i in range(50):
    reservation = Reservation(employee_id=choice(employees).id, bento_id=choice(bentos).id,
                              reservation_date=date.today() + timedelta(days=randint(1, 30)), quantity=randint(1, 5))
    reservations.append(reservation)

# Add test data to the database
with db.session.begin():
    db.session.add_all(users)
    db.session.add_all(workplaces)