import pytest
import requests
import os

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:5000/api")


def test_get_employees():
    response = requests.get(f"{BASE_URL}/employees")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_workplaces():
    response = requests.get(f"{BASE_URL}/workplaces")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_bento():
    response = requests.get(f"{BASE_URL}/bento")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_employee():
    data = {"name": "テスト社員", "location": "テスト場所"}
    response = requests.post(f"{BASE_URL}/employees", json=data)
    assert response.status_code == 201
    assert "id" in response.json()


def test_create_reservation():
    data = {"employee_id": 1, "date": "2023-05-01", "meal": "テスト弁当", "price": 500}
    response = requests.post(f"{BASE_URL}/reservations", json=data)
    assert response.status_code == 201
    assert "id" in response.json()


def test_get_statistics():
    response = requests.get(f"{BASE_URL}/statistics", params={"month": 5, "year": 2023})
    assert response.status_code == 200
    assert "reservations" in response.json()
    assert "total" in response.json()
    assert "page" in response.json()
    assert "per_page" in response.json()
    assert "location_order_counts" in response.json()
    assert "location_order_amounts" in response.json()
    assert "employee_monthly_order_counts" in response.json()
    assert "employee_monthly_order_amounts" in response.json()


