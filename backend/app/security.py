import os
from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()
JWT_SECRET = os.getenv("JWT_SECRET", "development-only-secret-change-me")
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, password_digest: str) -> bool:
    return password_hash.verify(password, password_digest)


def create_access_token(user_id: int, role: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(hours=1)
    return jwt.encode(
        {"sub": str(user_id), "role": role, "exp": expires_at},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )
