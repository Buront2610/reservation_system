import pytest
from app import db, create_app
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag
from app.routes import UserService
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_create_user(client):
    # Prepare
    user_data = {
        "id": 1, 
        "password": "password", 
        "role": "admin",
        "name": "User 1",
        "email_address": "user1@example.com",
        "telephone": "1234567890",
        "hide_flag": False,
        "workplace_id": 1,
    }

    # Act
    response = client.post('/api/users', json=user_data)

    # Assert
    assert response.status_code == 201
    user = UserService.get_user_by_id(1)
    assert user is not None
    assert user.id == 1

def test_get_all_users(client):
    # Prepare
    user_data = {
        "id": 1, 
        "password": generate_password_hash("password"), 
        "role": "admin",
        "name": "User 1",
        "email_address": "user1@example.com",
        "telephone": "1234567890",
        "hide_flag": False,
        "workplace_id": 1,
    }
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    # Act
    response = client.get('/api/users')

    # Assert
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    assert response.get_json()[0]['id'] == 1

def test_get_user_by_id(client):
    # Prepare
    user_data = {
        "id": 1, 
        "password": generate_password_hash("password"), 
        "role": "admin",
        "name": "User 1",
        "email_address": "user1@example.com",
        "telephone": "1234567890",
        "hide_flag": False,
        "workplace_id": 1,
    }
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    # Act
    response = client.get('/api/users/1')

    # Assert
    assert response.status_code == 200
    assert response.get_json()['id'] == 1



def test_update_user(client):
    # Prepare
    user_data = {
        "id": 1, 
        "password": generate_password_hash("password"), 
        "role": "admin",
        "name": "User 1",
        "email_address": "user1@example.com",
        "telephone": "1234567890",
        "hide_flag": False,
        "workplace_id": 1,
    }
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    # Act
    update_data = {"role": "user"}
    response = client.put('/api/users/1', json=update_data)

    # Assert
    assert response.status_code == 200
    user = UserService.get_user_by_id(1)
    assert user is not None
    assert user.role == "user"

def test_delete_user(client):
    # Prepare
    user_data = {
        "id": 1, 
        "password": generate_password_hash("password"), 
        "role": "admin",
        "name": "User 1",
        "email_address": "user1@example.com",
        "telephone": "1234567890",
        "hide_flag": False,
        "workplace_id": 1,
    }
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()

    # Act
    response = client.delete('/api/users/1')

    # Assert
    assert response.status_code == 200
    user = UserService.get_user_by_id(1)
    assert user is None
