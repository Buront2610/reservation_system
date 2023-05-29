"""
簡易バックエンドテストツール
バックエンドのAPI処理確認にはこれを用いること
その他funcitonの処理確認にも用いる
"""
# test_api.py
import pytest
import json
from backend.factories import Userfactory_boy, Employeefactory_boy, Workplacefactory_boy, Bentofactory_boy, Reservationfactory_boy
from app.functions import hash_password
# test_api.py
def test_login(client, session):
    # Arrange
    user = Userfactory_boy.create(password=hash_password('test_password'))
    session.add(user)
    session.commit()

    # Act
    response = client.post('/login', json={'id': user.id, 'password': 'test_password'})

    # Assert
    assert response.status_code == 200
    assert 'token' in response.get_json()
    assert 'role' in response.get_json()

def test_get_workplaces(client, session):
    # Arrange
    workplaces = Workplacefactory_boy.create_batch(5)
    session.add_all(workplaces)
    session.commit()

    # Act
    response = client.get('/workplaces')

    # Assert
    assert response.status_code == 200
    assert len(response.get_json()) == 5

def test_get_bento(client, session):
    # Arrange
    bentos = Bentofactory_boy.create_batch(5)
    session.add_all(bentos)
    session.commit()

    # Act
    response = client.get('/bento')

    # Assert
    assert response.status_code == 200
    assert len(response.get_json()) == 5

def test_get_users(client, session):
    # Arrange
    users = Userfactory_boy.create_batch(5)
    session.add_all(users)
    session.commit()

    # Act
    response = client.get('/users')

    # Assert
    assert response.status_code == 200
    assert len(response.get_json()) == 5

def test_get_user_by_id(client, session):
    # Arrange
    user = Userfactory_boy.create(password=hash_password('test_password'))
    session.add(user)
    session.commit()

    # Act
    response = client.get(f'/User/{user.id}')

    # Assert
    assert response.status_code == 200
    assert 'id' in response.get_json()
    assert 'role' in response.get_json()

def test_get_employee_by_id(client, session):
    # Arrange
    employee = Employeefactory_boy.create()
    session.add(employee)
    session.commit()

    # Act
    response = client.get(f'/employees/{employee.id}')

    # Assert
    assert response.status_code == 200
    assert 'id' in response.get_json()
    assert 'name' in response.get_json()

def test_get_reservation_by_id(client, session):
    # Arrange
    reservation = Reservationfactory_boy.create()
    session.add(reservation)
    session.commit()

    # Act
    response = client.get(f'/reservations/{reservation.id}')

    # Assert
    assert response.status_code == 200
    assert 'id' in response.get_json()
    assert 'user_id' in response.get_json()

def test_get_statistics(client, session):
    # Arrange
    reservations = Reservationfactory_boy.create_batch(5)
    session.add_all(reservations)
    session.commit()

    # Act
    response = client.get('/statistics')

    # Assert
    assert response.status_code == 200
    assert 'total_reservations' in response.get_json()
    assert 'total_users' in response.get_json()

# Employees
def test_create_employee(client):
    response = client.post('/employees', json={
        'id': 'new_employee',
        'name': 'test_name',
        'location': 'test_location'
    })
    assert response.status_code == 201
    assert 'id' in response.get_json()
    assert 'name' in response.get_json()

def test_update_employee(client, session):
    employee = Employeefactory_boy.create()
    session.add(employee)
    session.commit()
    response = client.put(f'/employees/{employee.id}', json={
        'name': 'updated_name',
        'location': 'updated_location'
    })
    assert response.status_code == 200
    assert 'name' in response.get_json()
    assert 'location' in response.get_json()

def test_delete_employee(client, session):
    employee = Employeefactory_boy.create()
    session.add(employee)
    session.commit()
    response = client.delete(f'/employees/{employee.id}')
    assert response.status_code == 200
    assert 'message' in response.get_json()

# Reservations
def test_create_reservation(client):
    response = client.post('/reservations', json={
        'employee_id': 'test_employee',
        'date': '2023-05-17',
        'meal': 'test_meal',
        'price': 500
    })
    assert response.status_code == 201
    assert 'employee_id' in response.get_json()
    assert 'date' in response.get_json()

def test_update_reservation(client, session):
    reservation = Reservationfactory_boy.create()
    session.add(reservation)
    session.commit()
    response = client.put(f'/reservations/{reservation.id}', json={
        'employee_id': 'updated_employee',
        'date': '2023-06-17',
        'meal': 'updated_meal',
        'price': 600
    })
    assert response.status_code == 200
    assert 'employee_id' in response.get_json()
    assert 'date' in response.get_json()

def test_delete_reservation(client, session):
    reservation =Reservationfactory_boy.create()
    session.add(reservation)
    session.commit()
    response = client.delete(f'/reservations/{reservation.id}')
    assert response.status_code == 200
    assert 'message' in response.get_json()
