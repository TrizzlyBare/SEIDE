import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database/database.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
