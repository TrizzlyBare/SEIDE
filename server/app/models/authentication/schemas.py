from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str
    year: int

class User(UserBase):
    id: int
    first_name: str
    last_name: str
    year: int

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