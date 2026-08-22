"""Seed the local database with realistic demonstration inventory."""

from decimal import Decimal

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Vehicle


INVENTORY = [
    {"make": "Toyota", "model": "Camry", "category": "Sedan", "price": Decimal("29795.00"), "quantity": 5},
    {"make": "Honda", "model": "CR-V", "category": "SUV", "price": Decimal("30920.00"), "quantity": 4},
    {"make": "Hyundai", "model": "IONIQ 5", "category": "Electric", "price": Decimal("42600.00"), "quantity": 3},
    {"make": "Kia", "model": "Sportage", "category": "SUV", "price": Decimal("27390.00"), "quantity": 6},
    {"make": "Ford", "model": "F-150", "category": "Truck", "price": Decimal("38710.00"), "quantity": 4},
    {"make": "Tesla", "model": "Model 3", "category": "Electric", "price": Decimal("42490.00"), "quantity": 3},
    {"make": "BMW", "model": "3 Series", "category": "Luxury Sedan", "price": Decimal("46400.00"), "quantity": 2},
    {"make": "Mazda", "model": "CX-5", "category": "SUV", "price": Decimal("28800.00"), "quantity": 5},
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for item in INVENTORY:
            vehicle = db.scalar(
                select(Vehicle).where(Vehicle.make == item["make"], Vehicle.model == item["model"])
            )
            if vehicle is None:
                db.add(Vehicle(**item))
            else:
                for field, value in item.items():
                    setattr(vehicle, field, value)
        db.commit()
        print(f"Inventory ready: {len(INVENTORY)} vehicles seeded.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
