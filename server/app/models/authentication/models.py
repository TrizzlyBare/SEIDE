import datetime as _dt
import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from passlib.context import CryptContext
import enum as _enum
from sqlalchemy import Enum

Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRole(_enum.Enum):
    YEAR1 = "YEAR1"
    YEAR2 = "YEAR2"
    YEAR3 = "YEAR3"
    YEAR4 = "YEAR4"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    year = Column(Integer)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.YEAR1)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

