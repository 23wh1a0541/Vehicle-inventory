import os

# Tests use an isolated database; the running app uses backend/data/dealership.db.
os.environ["DATABASE_URL"] = "sqlite://"
