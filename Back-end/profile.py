from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dashboard import Subject,Topic
from pydantic import BaseModel
from database import User

EDITOR_DATABASE_URL = "sqlite:///./Profil_Data.db"
Profile_engine = create_engine(EDITOR_DATABASE_URL, connect_args={"check_same_thread": False})
ProfileSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Profile_engine)

Base = declarative_base()

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)

    owner = relationship("User", back_populates="profiles")
    # Work_completetion = relationship("Topic", back_populates="owner")

Base.metadata.create_all(bind=Profile_engine)

# class Topic(Base):
#     __tablename__ = "topics"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)
#     subject_id = Column(Integer, ForeignKey("subjects.id"))
#     subject = relationship("Subject", back_populates="topics")

class ProfileCreate(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    hashed_password: str
    owner_id: int