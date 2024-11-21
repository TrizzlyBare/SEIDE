from app.models.dashboard.models import Base
from app.models.dashboard.db_config import engine
import logging

def create_tables():
    Base.metadata.create_all(bind=engine)
    logging.info("Tables created successfully")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    create_tables()
