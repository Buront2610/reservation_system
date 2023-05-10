import unittest
import json
from datetime import datetime
from app import create_app, db
from app.models import User, Employee, Workplace, Bento, Reservation

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    # User API tests
    def test_get_users(self):
        user1 = User(id=1, PassWord="password1", Roll="admin")
        user2 = User(id=2, PassWord="password2", Roll="user")
        db.session.add_all([user1, user2])
        db.session.commit()

        response = self.client.get("/users")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    def test_get_user_not_found(self):
        response = self.client.get("/User/1")
        self.assertEqual(response.status_code, 404)

    def test_add_user(self):
        user_data = {"id": 1, "PassWord": "password1", "Roll": "admin"}
        response = self.client.post("/User", data=json.dumps(user_data), content_type="application/json")
        self.assertEqual(response.status_code, 201)

        user = User.query.get(1)
        self.assertIsNotNone(user)
        self.assertEqual(user.id, user_data["id"])
        self.assertEqual(user.PassWord, user_data["PassWord"])
        self.assertEqual(user.Roll, user_data["Roll"])

    def test_add_user_missing_fields(self):
        user_data = {"id": 1, "PassWord": "password1"}
        response = self.client.post("/User", data=json.dumps(user_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_delete_user(self):
        user = User(id=1, PassWord="password1", Roll="admin")
        db.session.add(user)
        db.session.commit()

        response = self.client.delete("/User/1")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(User.query.get(1))

    def test_delete_user_not_found(self):
        response = self.client.delete("/User/1")
        self.assertEqual(response.status_code, 404)

    # Workplace API tests
    def test_get_workplaces(self):
        workplace1 = Workplace(id=1, name="Workplace 1")
        workplace2 = Workplace(id=2, name="Workplace 2")
        db.session.add_all([workplace1, workplace2])
        db.session.commit()

        response = self.client.get("/workplaces")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    # Bento API tests
    def test_get_bento(self):
        bento1 = Bento(id=1, name="Bento 1", price=500)
        bento2 = Bento(id=2, name="Bento 2", price=600)
        db.session.add_all([bento1, bento2])
        db.session.commit()

        response = self.client.get("/bento")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    # Employee API tests
       # Employee API tests
    def test_get_employees(self):
        employee1 = Employee(id=1, name="Employee 1", location="Location 1")
        employee2 = Employee(id=2, name="Employee 2", location="Location 2")
        db.session.add_all([employee1, employee2])
        db.session.commit()

        response = self.client.get("/employees")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    def test_get_employee_not_found(self):
        response = self.client.get("/employees/1")
        self.assertEqual(response.status_code, 404)

    def test_add_employee(self):
        employee_data = {"id": 1, "name": "Employee 1", "location": "Location 1"}
        response = self.client.post("/employees", data=json.dumps(employee_data), content_type="application/json")
        self.assertEqual(response.status_code, 201)

        employee = Employee.query.get(1)
        self.assertIsNotNone(employee)
        self.assertEqual(employee.id, employee_data["id"])
        self.assertEqual(employee.name, employee_data["name"])
        self.assertEqual(employee.location, employee_data["location"])

    def test_add_employee_missing_fields(self):
        employee_data = {"id": 1, "name": "Employee 1"}
        response = self.client.post("/employees", data=json.dumps(employee_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_update_employee(self):
        employee = Employee(id=1, name="Employee 1", location="Location 1")
        db.session.add(employee)
        db.session.commit()

        employee_data = {"name": "Updated Employee 1", "location": "Updated Location 1"}
        response = self.client.put("/employees/1", data=json.dumps(employee_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        updated_employee = Employee.query.get(1)
        self.assertEqual(updated_employee.name, employee_data["name"])
        self.assertEqual(updated_employee.location, employee_data["location"])

    def test_delete_employee(self):
        employee = Employee(id=1, name="Employee 1", location="Location 1")
        db.session.add(employee)
        db.session.commit()

        response = self.client.delete("/employees/1")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(Employee.query.get(1))

    def test_delete_employee_not_found(self):
        response = self.client.delete("/employees/1")
        self.assertEqual(response.status_code, 404)

    # Reservation API tests
    def test_get_reservations(self):
        reservation1 = Reservation(id=1, employee_id=1, date=datetime.now(), meal="Meal 1", price=500)
        reservation2 = Reservation(id=2, employee_id=2, date=datetime.now(), meal="Meal 2", price=600)
        db.session.add_all([reservation1, reservation2])
        db.session.commit()

        response = self.client.get("/reservations")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    def test_get_reservation_not_found(self):
        response = self.client.get("/reservations/1")
        self.assertEqual(response.status_code, 404)

    def test_add_reservation(self):
        reservation_data = {"id": 1, "employee_id": 1, "date": "2023-05-15", "meal": "Meal 1", "price": 500}
        response = self.client.post("/reservations", data=json.dumps(reservation_data), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        reservation = Reservation.query.get(1)
        self.assertIsNotNone(reservation)
        self.assertEqual(reservation.id, reservation_data["id"])
        self.assertEqual(reservation.employee_id, reservation_data["employee_id"])
        self.assertEqual(reservation.date.strftime('%Y-%m-%d'), reservation_data["date"])
        self.assertEqual(reservation.meal, reservation_data["meal"])
        self.assertEqual(reservation.price, reservation_data["price"])

    def test_add_reservation_missing_fields(self):
        reservation_data = {"id": 1, "employee_id": 1, "date": "2023-05-15", "meal": "Meal 1"}
        response = self.client.post("/reservations", data=json.dumps(reservation_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_update_reservation(self):
        reservation = Reservation(id=1, employee_id=1, date=datetime.now(), meal="Meal 1", price=500)
        db.session.add(reservation)
        db.session.commit()

        reservation_data = {"employee_id": 1, "date": "2023-05-20", "meal": "Updated Meal 1", "price": 600}
        response = self.client.put("/reservations/1", data=json.dumps(reservation_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        updated_reservation = Reservation.query.get(1)
        self.assertEqual(updated_reservation.employee_id, reservation_data["employee_id"])
        self.assertEqual(updated_reservation.date.strftime('%Y-%m-%d'), reservation_data["date"])
        self.assertEqual(updated_reservation.meal, reservation_data["meal"])
        self.assertEqual(updated_reservation.price, reservation_data["price"])

    def test_delete_reservation(self):
        reservation = Reservation(id=1, employee_id=1, date=datetime.now(), meal="Meal 1", price=500)
        db.session.add(reservation)
        db.session.commit()

        response = self.client.delete("/reservations/1")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(Reservation.query.get(1))

    def test_delete_reservation_not_found(self):
        response = self.client.delete("/reservations/1")
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()


