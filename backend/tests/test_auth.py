from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_registering_a_new_user_returns_a_token():
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Asha Sharma",
            "email": "asha@example.com",
            "password": "secure-password-123",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "asha@example.com"
    assert body["user"]["role"] == "customer"
