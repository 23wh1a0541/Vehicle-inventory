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
