# server/app/models/dashboard/createtable.py
from app.models.dashboard.models import Base
from app.models.dashboard.db_config import engine
import logging

def create_tables():
    Base.metadata.drop_all(bind=engine)  # Drop all tables
    Base.metadata.create_all(bind=engine)  # Create all tables
    logging.info("Tables created successfully")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    create_tables()