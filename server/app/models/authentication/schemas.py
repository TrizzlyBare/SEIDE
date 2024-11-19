import datetime as _dt
from pydantic import BaseModel, EmailStr

class _UserBase(BaseModel):
    email: EmailStr

class UserCreate(_UserBase):
    password: str

class User(_UserBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class _LeadBase(BaseModel):
    first_name: str
    last_name: str
    year: int
    email: EmailStr
    company: str
    note: str

class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    year: int
    email: EmailStr
    company: str
    note: str


class Lead(_LeadBase):
    id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True