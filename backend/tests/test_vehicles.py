from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models import User
from app.security import create_access_token, hash_password


client = TestClient(app)


def admin_headers() -> dict[str, str]:
    db = SessionLocal()
    admin = User(
        name="Inventory Admin",
        email="admin@example.com",
        password_hash=hash_password("admin-password-123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    db.close()
    return {"Authorization": f"Bearer {create_access_token(admin.id, admin.role)}"}


def test_admin_can_add_a_vehicle_to_inventory():
    response = client.post(
        "/api/vehicles",
        headers=admin_headers(),
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 32000,
            "quantity": 4,
        },
    )

    assert response.status_code == 201
    vehicle = response.json()
    assert vehicle["make"] == "Toyota"
    assert vehicle["quantity"] == 4
    assert vehicle["id"]


def test_authenticated_user_can_view_available_vehicles():
    client.post(
        "/api/vehicles",
        headers=admin_headers(),
        json={
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": 18000,
            "quantity": 2,
        },
    )
    registration = client.post(
        "/api/auth/register",
        json={
            "name": "Priya Singh",
            "email": "priya@example.com",
            "password": "secure-password-123",
        },
    )

    response = client.get(
        "/api/vehicles",
        headers={"Authorization": f"Bearer {registration.json()['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": "18000.00",
            "quantity": 2,
        }
    ]


def test_authenticated_user_can_search_vehicles_by_category_and_price_range():
    headers = admin_headers()
    client.post(
        "/api/vehicles",
        headers=headers,
        json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 52000,
            "quantity": 1,
        },
    )
    client.post(
        "/api/vehicles",
        headers=headers,
        json={
            "make": "Mahindra",
            "model": "XUV700",
            "category": "SUV",
            "price": 31000,
            "quantity": 3,
        },
    )
    registration = client.post(
        "/api/auth/register",
        json={
            "name": "Arjun Rao",
            "email": "arjun@example.com",
            "password": "secure-password-123",
        },
    )

    response = client.get(
        "/api/vehicles/search?category=SUV&min_price=30000&max_price=40000",
        headers={"Authorization": f"Bearer {registration.json()['access_token']}"},
    )

    assert response.status_code == 200
    assert [vehicle["model"] for vehicle in response.json()] == ["XUV700"]


def test_authenticated_user_can_purchase_a_vehicle_and_reduce_stock():
    created = client.post(
        "/api/vehicles",
        headers=admin_headers(),
        json={
            "make": "Tata",
            "model": "Nexon",
            "category": "SUV",
            "price": 20000,
            "quantity": 2,
        },
    )
    registration = client.post(
        "/api/auth/register",
        json={
            "name": "Neha Patel",
            "email": "neha@example.com",
            "password": "secure-password-123",
        },
    )

    response = client.post(
        f"/api/vehicles/{created.json()['id']}/purchase",
        headers={"Authorization": f"Bearer {registration.json()['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 1


def test_purchase_is_rejected_when_vehicle_is_out_of_stock():
    created = client.post(
        "/api/vehicles",
        headers=admin_headers(),
        json={
            "make": "Hyundai",
            "model": "i20",
            "category": "Hatchback",
            "price": 14000,
            "quantity": 0,
        },
    )
    registration = client.post(
        "/api/auth/register",
        json={
            "name": "Kabir Mehta",
            "email": "kabir@example.com",
            "password": "secure-password-123",
        },
    )

    response = client.post(
        f"/api/vehicles/{created.json()['id']}/purchase",
        headers={"Authorization": f"Bearer {registration.json()['access_token']}"},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Vehicle is out of stock"
