"""Create or promote a local administrator account for demonstration."""

import argparse
from getpass import getpass

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import User
from app.security import hash_password


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an administrator account")
    parser.add_argument("--name", required=True)
    parser.add_argument("--email", required=True)
    arguments = parser.parse_args()

    password = getpass("Password (at least 8 characters): ")
    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters long.")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == arguments.email.lower()))
        if user is None:
            user = User(
                name=arguments.name,
                email=arguments.email.lower(),
                password_hash=hash_password(password),
                role="admin",
            )
            db.add(user)
        else:
            user.name = arguments.name
            user.password_hash = hash_password(password)
            user.role = "admin"
        db.commit()
        print(f"Administrator account ready: {user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
