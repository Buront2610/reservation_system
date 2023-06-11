from re import T
from turtle import update
from venv import logger
import pytest
from app import db, create_app
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag
from app.routes import UserService, WorkplaceService, BentoService, ReservationService
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta

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
            "id": 1,
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
        new_user_data['id'] = 2

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
            "id": 1,
            "name": "Workplace 1",
            "location": "Hiroshima",
        }
        with app.app_context():
            self.workplace = WorkplaceService.create_workplace(self.workplace_data)


    def test_create_workplace(self, app):
        # Prepare
        new_workplace_data = self.workplace_data.copy()
        new_workplace_data['id'] = 2


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
            "id": 1,
            "name": "Bento 1",
            "price": 1000,
            "choose_flag": False
        }
        with app.app_context():
            self.bento = BentoService.create_bento(self.bento_data)

    def test_create_bento(self,app):
        # Prepare
        new_bento_data = self.bento_data.copy()
        new_bento_data['id'] = 2

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
            "id": 1,
            "user_id": 1,
            "bento_id": 1,
            "reservation_date": datetime.date(2023-6-16) , # 直接dateオブジェクトを指定
            "quantity": 2,
            "remarks": "Test reservation"
        }

        with app.app_context():
            self.reservation = ReservationService.create_reservation(self.reservation_data)

    def test_create_reservation(self, app):
        # Prepare
        new_reservation_data = self.reservation_data.copy()
        new_reservation_data['id'] = 2
        new_reservation_data['user_id'] = 2

        # Act
        response = self.client.post('/api/reservations', json=new_reservation_data)

        # Assert
        assert response.status_code == 201
        with app.app_context():
            reservation = ReservationService.get_reservation_by_id(2)
        assert reservation is not None
        assert reservation.id == 2
        logger.info(f"response: {response.get_json()}")
        print(f"reponse:{response.get_json()}")
        assert response.get_json()['id'] == 2

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
        response = self.client.get('/api/reservations/user/1')

        # Assert
        assert response.status_code == 200
        assert len(response.get_json()) == 1
        assert response.get_json()[0]['id'] == 1

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
