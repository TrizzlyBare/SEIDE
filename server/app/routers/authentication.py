from typing import List
import fastapi as _fastapi
import fastapi.security as _security
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
import sqlalchemy.orm as _orm
from app.models.authentication import services as _services
import app.models.authentication.schemas as _schemas
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordBearer
import logging

router = _fastapi.APIRouter(tags=["Authentication"])

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

# New response models for better API documentation and type safety
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: _schemas.User

class UserCreateResponse(BaseModel):
    message: str
    token: TokenResponse
    user: _schemas.User


@router.get("/api/profile", response_model=_schemas.User)
async def get_profile(
    current_user: _schemas.User = Depends(_services.get_current_user),
    db: Session = Depends(_services.get_db)
):
    try:
        # Log the attempt to get profile
        logging.info(f"Fetching profile for user: {current_user.email}")
        
        # Get fresh user data from database
        user = await _services.get_user_by_email(current_user.email, db)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        return user
    except Exception as e:
        logging.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching profile"
        )

@router.post("/api/users", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: _schemas.UserCreate, 
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    try:
        # Check if email already exists
        db_user = await _services.get_user_by_email(user.email, db)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user with all fields
        created_user = await _services.create_user(user, db)
        token = await _services.create_token(created_user)
        
        logging.info(f"User created successfully: {created_user.email}")
        
        return {
            "message": "User created successfully",
            "token": {
                "access_token": token["access_token"],
                "token_type": token["token_type"],
                "user": created_user
            },
            "user": created_user
        }
    except Exception as e:
        logging.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )
    
@router.post("/api/token")
async def generate_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(_services.get_db),
):
    try:
        user = await _services.authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        token = await _services.create_token(user)
        
        # Return user data along with token
        return {
            "access_token": token["access_token"],
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "year": user.year,
                "id": user.id
            }
        }
    except Exception as e:
        logging.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication error"
        )

@router.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@router.post("/api/leads", response_model=_schemas.Lead)
async def create_lead(
    lead: _schemas.LeadCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_lead(user=user, db=db, lead=lead)

@router.get("/api/leads", response_model=List[_schemas.Lead])
async def get_leads(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_leads(user=user, db=db)

@router.get("/api/leads/{lead_id}", status_code=200, response_model=_schemas.Lead)
async def get_lead(
    lead_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_lead(lead_id, user, db)

@router.delete("/api/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_lead(lead_id, user, db)
    return None  # 204 status code should not return content

@router.put("/api/leads/{lead_id}", status_code=200, response_model=_schemas.Lead)
async def update_lead(
    lead_id: int,
    lead: _schemas.LeadCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.update_lead(lead_id, lead, user, db)

@router.get("/api")
async def root():
    return {"message": "Awesome Leads Manager"}

