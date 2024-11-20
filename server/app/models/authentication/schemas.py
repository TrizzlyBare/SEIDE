from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    YEAR1 = "YEAR1"
    YEAR2 = "YEAR2"
    YEAR3 = "YEAR3"
    YEAR4 = "YEAR4"
    ADMIN = "ADMIN"

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str
    year: int
    role: UserRole = UserRole.YEAR1

class User(UserBase):
    id: int
    first_name: str
    last_name: str
    year: int
    role: UserRole

    class Config:
        orm_mode = True
class Lead(BaseModel):
    id: int
    owner_id: int
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = ""
    note: Optional[str] = ""

    class Config:
        orm_mode = True

class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = ""
    note: Optional[str] = ""