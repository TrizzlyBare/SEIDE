from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

from pydantic import BaseModel

EDITOR_DATABASE_URL = "sqlite:///./User_Code.db"

engine = create_engine(EDITOR_DATABASE_URL, connect_args={"check_same_thread": False})
EditorSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    code_data = relationship("CodeData", back_populates="owner")


class CodeData(Base):
    __tablename__ = "CodeData"
    id = Column(Integer, primary_key=True, index=True)
    code_data = Column(String)
    language = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="code_data")


Base.metadata.create_all(bind=engine)


class Create_Code_Data(BaseModel):
    code_data: str
    language: str
    owner_id: int
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

from pydantic import BaseModel

EDITOR_DATABASE_URL = "sqlite:///./User_Code.db"

engine = create_engine(EDITOR_DATABASE_URL, connect_args={"check_same_thread": False})
EditorSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    code_data = relationship("CodeData", back_populates="owner")


class CodeData(Base):
    __tablename__ = "CodeData"
    id = Column(Integer, primary_key=True, index=True)
    code_data = Column(String)
    language = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="code_data")

Base.metadata.create_all(bind=engine)

class Create_Code_Data(BaseModel):
    code_data: str
    language: str
    owner_id: int
