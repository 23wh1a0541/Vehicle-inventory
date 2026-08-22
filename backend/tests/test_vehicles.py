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
