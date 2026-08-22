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


def test_registered_user_can_log_in_and_receive_a_token():
    client.post(
        "/api/auth/register",
        json={
            "name": "Ravi Kumar",
            "email": "ravi@example.com",
            "password": "secure-password-123",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "ravi@example.com", "password": "secure-password-123"},
    )

    assert response.status_code == 200
    assert response.json()["access_token"]


def test_local_frontend_origin_is_allowed_to_send_registration_requests():
    response = client.options(
        "/api/auth/register",
        headers={
            "Origin": "http://localhost:5174",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5174"
