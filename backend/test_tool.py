from re import T
from turtle import update
from venv import logger
import pytest
from app import db, create_app
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag
from app.routes import UserService, WorkplaceService, BentoService, ReservationService
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta
import datetime
from flask import current_app



@pytest.fixture
def app():
    # テスト用の設定を行う
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    # アプリケーションコンテキスト内でデータベースを生成する
    with app.app_context():
        db.create_all()
        yield app
        # テストが終わったらデータベースを削除する
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

class TestUserService:

    @pytest.fixture(autouse=True)
    def setup_method(self, client, app):
        self.client = client
        self.user_data = {
            "employee_number": "0001",
            "password": "password",
            "role": "admin",
            "name": "User 1",
            "email_address": "user1@example.com",
            "telephone": "1234567890",
            "hide_flag": False,
            "workplace_id": 1,
        }
        with app.app_context():
            self.user = UserService.create_user(self.user_data)

    def test_create_user(self, app):
        # Prepare
        new_user_data = self.user_data.copy()
        new_user_data["employee_number"] = "0002"

        # Act
        response = self.client.post('/api/users', json=new_user_data)

        # Assert
        assert response.status_code == 201
        with app.app_context():
            user = UserService.get_user_by_id(2)
        assert user is not None
        assert user.id == 2
        logger.info(f"user: {user}")

    def test_get_all_users(self):
        # Act
        response = self.client.get('/api/users')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 1
        assert response.get_json()[0]['id'] == 1
        logger.info(f"user: {response.get_json()}")


    def test_get_user_by_id(self):
        # Act
        response = self.client.get('/api/users/1')

        # Assert
        assert response.status_code == 200
        assert response.get_json()['id'] == 1

    def test_update_user(self, app):
        # Act
        update_data = {"role": "user"}
        response = self.client.put('/api/users/1', json=update_data)

        # Assert
        assert response.status_code == 200
        with app.app_context():
            user = UserService.get_user_by_id(1)
        assert user is not None
        assert user.role == "user"

    def test_delete_user(self, app):
        # Act
        response = self.client.delete('/api/users/1')

        # Assert
        assert response.status_code == 200
        with app.app_context():
            user = UserService.get_user_by_id(1)
        assert user is None

class TestWorkplaceService:

    @pytest.fixture(autouse=True)
    def setup_method(self, client, app):
        self.client = client
        self.workplace_data = {
            "name": "Workplace 1",
            "location": "Hiroshima",
        }
        with app.app_context():
            self.workplace = WorkplaceService.create_workplace(self.workplace_data)


    def test_create_workplace(self, app):
        # Prepare
        new_workplace_data = self.workplace_data.copy()


        # Act
        response = self.client.post('/api/workplaces', json=new_workplace_data)

        # Assert
        assert response.status_code == 201
        with app.app_context():
            workplace = WorkplaceService.get_workplace_by_id(2)
        assert workplace is not None
        assert workplace.id == 2

    def test_get_all_workplaces(self):
        # Act
        response = self.client.get('/api/workplaces')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 1
        assert response.get_json()[0]['id'] == 1

    def test_get_workplace_by_id(self):   

        # Act
        response = self.client.get('/api/workplaces/1')

        # Assert
        assert response.status_code == 200
        assert response.get_json()['id'] == 1

    def test_update_workplace(self,app):
        # Prepare
        update_data = {"name": "Workplace 2"}



        # Act
        response = self.client.put('/api/workplaces/1', json=update_data)

        # Assert
        assert response.status_code == 200
        with app.app_context():
            workplace = WorkplaceService.get_workplace_by_id(1)
        assert workplace is not None
        assert workplace.name == "Workplace 2"

    def test_delete_workplace(self,app):
        #
        response = self.client.delete('/api/workplaces/1')

        # Assert
        assert response.status_code == 200
        with app.app_context():
            workplace = WorkplaceService.get_workplace_by_id(1)
        assert workplace is None

class TestBentoService:
    
    @pytest.fixture(autouse=True)
    def setup_method(self,client, app):
        self.client = client
        self.bento_data = {
            "name": "Bento 1",
            "price": 1000,
            "choose_flag": False
        }
        with app.app_context():
            self.bento = BentoService.create_bento(self.bento_data)

    def test_create_bento(self,app):
        # Prepare
        new_bento_data = self.bento_data.copy()

        # Act
        response = self.client.post('/api/bento', json=new_bento_data)

        # Assert
        assert response.status_code == 201
        with app.app_context():
            bento = BentoService.get_bento_by_id(2)
        assert bento is not None
        assert bento.id == 2

    def test_get_all_bentos(self):
        # Prepare
        new_bento_data = self.bento_data.copy()
        new_bento_data['id'] = 3
        add = self.client.post('/api/bento', json=new_bento_data)

        # Act
        response = self.client.get('/api/bento')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 2
        assert response.get_json()[0]['id'] == 1

    def test_get_bento_by_id(self):

        # Act
        response = self.client.get('/api/bento/1')

        # Assert
        assert response.status_code == 200
        assert response.get_json()['id'] == 1

    def test_update_bento(self):
        # Prepare
        update_data = {"price": 1500}


        # Act
        response = self.client.put('/api/bento/1', json=update_data)

        # Assert
        assert response.status_code == 200
        bento = BentoService.get_bento_by_id(1)
        assert bento is not None
        assert bento.price == 1500

    def test_delete_bento(self,app):
    
        # Act
        response = self.client.delete('/api/bento/1')

        # Assert
        assert response.status_code == 200
        with app.app_context():
            bento = BentoService.get_bento_by_id(1)
        assert bento is None

class TestReservationService:

    @pytest.fixture(autouse=True)


    def setup_method(self, client, app):
        self.client = client
        self.reservation_data = {
            "user_id": '0001',
            "bento_id": 1,
            "reservation_date": datetime.date(2023,6,16).isoformat() , # 直接dateオブジェクトを指定
            "quantity": 2,
            "remarks": "Test reservation"
        }

        with app.app_context():
            self.reservation = ReservationService.create_reservation(self.reservation_data)

    def test_create_reservation(self, app):
        # Prepare
        new_reservation_data = self.reservation_data.copy()
        new_reservation_data['user_id'] = '0002'

        # Act
        response = self.client.post('/api/reservations', json=new_reservation_data)

        # Assert
        assert response.status_code == 201
        with app.app_context():
            reservation = ReservationService.get_reservation_by_id('0002')
        assert reservation is not None
        assert reservation.id == 2
        logger.info(f"response: {response.get_json()}")
        print(f"reponse:{response.get_json()}")
        assert response.get_json()['user_id'] == '0002'

    def test_get_all_reservations(self, app):
        # Act
        response = self.client.get('/api/reservations')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 1
        assert response.get_json()[0]['id'] == 1

    def test_get_reservation_by_id(self, app):
        # Act
        response = self.client.get('/api/reservations/1')

        # Assert
        assert response.status_code == 200
        assert response.get_json()['id'] == 1

    def test_get_reservations_by_user_id(self):
        # Act
        response = self.client.get('/api/reservations/user/0001')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 1
        assert response.get_json()[0]['user_id'] == '0001'

    def test_update_reservation(self, app):
        # Prepare
        updated_reservation_data = self.reservation_data.copy()
        updated_reservation_data['quantity'] = 3

        # Act
        response = self.client.put('/api/reservations/1', json=updated_reservation_data)

        # Assert
        assert response.status_code == 200
        with app.app_context():
            reservation = ReservationService.get_reservation_by_id(1)
        assert reservation is not None
        assert reservation.quantity == 3

    def test_delete_reservation(self, app):
        # Act
        response = self.client.delete('/api/reservations/1')

        # Assert
        assert response.status_code == 200
        with app.app_context():
            reservation = ReservationService.get_reservation_by_id(1)
        assert reservation is None

class TestStatisticsAPI:
    @pytest.fixture(autouse=True)
    def setup_method(self, client, app):
        self.client = client
        with app.app_context():
            # テストデータの作成
            workplace_data1 = {
                "name": "Workplace 1",
                "location": "Location 1"
            }
            workplace_data2 = {
                "name": "Workplace 2",
                "location": "Location 2"
            }
            user_data1 = {
                "employee_number": "0001",
                "name": "User 1",
                "workplace_id": 1,
                "password": "password1",
                "role": "user",
                "hide_flag": False,
                "email_address": "test@example.co.jp"
            }
            user_data2 = {
                "employee_number": "0002",
                "name": "User 2",
                "workplace_id": 2,
                "password": "password2",
                "role": "user",
                "hide_flag": False,
                "email_address": "test@example.co.jp"

            }
            bento_data1 = {
                "name": "Bento 1",
                "price": 100,
                "choose_flag": True
            }
            bento_data2 = {
                "name": "Bento 2",
                "price": 200,
                "choose_flag": True
            }
            reservation_data1 = {
                "user_id": "0001",
                "bento_id": 1,
                "reservation_date": "2023-06-01",
                "quantity": 1
            }
            reservation_data2 = {
                "user_id": "0001",
                "bento_id": 2,
                "reservation_date": "2023-06-01",
                "quantity": 2
            }
            reservation_data3 = {
                "user_id": "0002",
                "bento_id": 1,
                "reservation_date": "2023-06-01",
                "quantity": 3
            }

            db.create_all()
            WorkplaceService.create_workplace(workplace_data1)
            WorkplaceService.create_workplace(workplace_data2)
            UserService.create_user(user_data1)
            UserService.create_user(user_data2)
            BentoService.create_bento(bento_data1)
            BentoService.create_bento(bento_data2)
            ReservationService.create_reservation(reservation_data1)
            ReservationService.create_reservation(reservation_data2)
            ReservationService.create_reservation(reservation_data3)

    def test_get_statistics(self):
        # Act
        response = self.client.get('/api/statistics/2023/6')

        # Assert
        assert response.status_code == 200
        data = response.get_json()

        current_app.logger.info(f"response: {data}")    

        assert "reservations" in data
        assert "total" in data
        assert "page" in data
        assert "per_page" in data
        assert "location_order_counts" in data
        assert "location_order_amounts" in data
        assert "employee_monthly_order_counts" in data
        assert "employee_monthly_order_amounts" in data

        assert len(data["reservations"]) == 3
        assert data["total"] == 3
        assert data["page"] == 1
        assert data["per_page"] == 10

        # assert "Workplace 1" in data["location_order_counts"]
        # assert "Workplace 2" in data["location_order_counts"]
        # assert "Workplace 1" in data["location_order_amounts"]
        # assert "Workplace 2" not in data["location_order_amounts"]

        # assert "0001" in data["employee_monthly_order_counts"]
        # assert "0002" in data["employee_monthly_order_counts"]
        # assert "0001" in data["employee_monthly_order_amounts"]
        # assert "0002" not in data["employee_monthly_order_amounts"]
