# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from app.models.authentication.models import UserRole

class LeadBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: str
    note: str

    class Config:
        from_attributes = True

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    year: int
    role: UserRole

    class Config:
        from_attributes = True
        use_enum_values = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user: User

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

    class Config:
        from_attributes = True

class UserCreateResponse(BaseModel):
    message: str
    token: Token
    user: dict  # Changed to dict to match the actual response structure

    class Config:
        from_attributes = True