import os

import pytest

# Tests use an isolated database; the running app uses backend/data/dealership.db.
os.environ["DATABASE_URL"] = "sqlite://"

from app.database import Base, engine  # noqa: E402
from app import models  # noqa: E402, F401


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
