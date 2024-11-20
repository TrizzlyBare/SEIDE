from typing import Dict, List
import fastapi as _fastapi
import fastapi.security as _security
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
import sqlalchemy.orm as _orm
from app.models.authentication import services as _services, models as _models
import app.models.authentication.schemas as _schemas
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.authentication.models import User, UserRole


router = _fastapi.APIRouter(tags=["Authentication"])

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: _schemas.User

class UserCreateResponse(BaseModel):
    message: str
    token: TokenResponse
    user: _schemas.User

    class Config:
        orm_mode = True

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

@router.post("/api/users", response_model=UserCreateResponse)
async def create_user(
    user: _schemas.UserCreate,
    db: Session = Depends(_services.get_db)
):
    """Enhanced user creation endpoint"""
    try:
        # Check for existing user
        existing_user = await _services.get_user_by_email(user.email, db)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        created_user = await _services.create_user(user, db)
        
        # Get the actual user object from the database for token creation
        db_user = await _services.get_user_by_email(created_user["email"], db)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving created user"
            )
        
        # Create token using the database user object
        token_data = await _services.create_token(db_user)
        
        return {
            "message": "User created successfully",
            "token": token_data,
            "user": created_user
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"User creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.get("/api/all_users", response_model=List[_schemas.User])
async def get_all_users(db: Session = Depends(_services.get_db)):
    users = db.query(_models.User).all()
    return users

# Login endpoint


@router.post("/api/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(_services.get_db)
):
    """Enhanced login endpoint with better error handling"""
    try:
        # Log the login attempt
        logging.info(f"Login attempt for email: {form_data.username}")
        
        user = await _services.authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create token with user info
        token_data = await _services.create_token(user)
        
        logging.info(f"Login successful for user: {user.email} with role: {user.role.value}")
        
        return {
            "access_token": token_data["access_token"],
            "token_type": token_data["token_type"],
            "role": token_data["role"],
            "user": token_data["user"]
        }
        
    except HTTPException as he:
        logging.warning(f"Login failed with HTTP error: {str(he)}")
        raise he
    except Exception as e:
        logging.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during login"
        )

@router.get("/api/role-check")
async def check_role_access(
    request: _fastapi.Request,  # Add request parameter
    token: str = Depends(oauth2schema),
    db: Session = Depends(_services.get_db)
):
    try:
        # Get authorization header correctly
        auth_header = request.headers.get('Authorization', '')
        logging.info(f"Authorization header: {auth_header}")

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token provided",
                headers={"WWW-Authenticate": "Bearer"}
            )

        # Get user from token
        user = await _services.get_current_user(token, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )

        is_admin = user.role == _models.UserRole.ADMIN
        
        response = {
            "role": user.role.value,
            "year": user.year,
            "permissions": {
                "can_access_admin": is_admin,
                "can_access_student": not is_admin,
                "year_level": user.year if not is_admin else None
            }
        }
        
        logging.info(f"Role check successful for user: {user.email} - Role: {user.role.value}")
        return response

    except HTTPException as he:
        logging.warning(f"Authentication error: {he.detail}")
        raise he
    except Exception as e:
        logging.error(f"Unexpected error in role-check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during role check"
        )
    

# Get current user endpoint
@router.get("/api/users/me", response_model=_schemas.User)
async def get_current_user_info(
    current_user: User = Depends(_services.get_current_user)
):
    return current_user

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

@router.post("/initialize-admin")
async def initialize_admin(db: Session = Depends(_services.get_db)):
    """Initialize or verify admin user"""
    try:
        admin = await _services.create_admin_user(db)
        logging.info(f"Admin user verified/created successfully: {admin.email}")
        return {
            "message": "Admin user verified/created successfully",
            "email": admin.email,
            "role": admin.role.value
        }
    except Exception as e:
        logging.error(f"Failed to initialize admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize admin: {str(e)}"
        )

# @router.get("/api/role-check")
# async def check_role_access(
#     current_user: User = Depends(_services.get_current_user)
# ):
#     """Check user's role and access level"""
#     try:
#         is_admin = current_user.role == UserRole.ADMIN
#         return {
#             "role": current_user.role.value,
#             "year": current_user.year,
#             "permissions": {
#                 "can_access_admin": is_admin,
#                 "can_access_student": not is_admin,
#                 "year_level": current_user.year if not is_admin else None
#             }
#         }
#     except Exception as e:
#         logging.error(f"Role check error: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Error checking role access"
#         )