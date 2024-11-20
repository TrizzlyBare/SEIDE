# services.py
import fastapi as _fastapi
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import logging
from fastapi import HTTPException, status, Depends
from typing import Optional, List

import app.models.authentication.au_database as _database
import app.models.authentication.models as _models
import app.models.authentication.schemas as _schemas
from app.models.authentication.models import UserRole

# Define OAuth2 scheme consistently
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"
ALGORITHM = "HS256"


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_admin_user(db: _orm.Session):
    """Create admin user if it doesn't exist"""
    try:
        admin_email = "admin@testing.com"
        admin = db.query(_models.User).filter(_models.User.email == admin_email).first()
        
        if not admin:
            hashed_password = _models.pwd_context.hash("admin")
            
            admin_user = _models.User(
                email=admin_email,
                hashed_password=hashed_password,
                first_name="Admin",
                last_name="User",
                role=_models.UserRole.ADMIN,
                year=0
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            logging.info(f"Admin user created successfully with email: {admin_email}")
            return admin_user
            
        logging.info(f"Admin user already exists with email: {admin_email}")
        return admin
        
    except Exception as e:
        logging.error(f"Error creating admin user: {str(e)}")
        db.rollback()
        raise


async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email, db)
    if not user or not _hash.bcrypt.verify(password, user.hashed_password):
        logging.error(f"Authentication failed for user: {email}")
        return False
    logging.info(f"User authenticated successfully: {email}, role: {user.role}")
    return user

async def get_user_by_email(email: str, db: _orm.Session):
    """Get user by email with enhanced logging"""
    try:
        user = db.query(_models.User).filter(_models.User.email == email).first()
        if user:
            logging.info(f"Found user with email {email}, role: {user.role}")
        return user
    except Exception as e:
        logging.error(f"Database error while fetching user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )

def check_user_role(required_roles: list[UserRole], user: _models.User) -> bool:
    """Role checking with logging"""
    try:
        has_role = user.role in required_roles
        logging.info(f"Role check for user {user.email}: Required roles: {required_roles}, User role: {user.role}, Has role: {has_role}")
        return has_role
    except Exception as e:
        logging.error(f"Role check error: {str(e)}")
        return False



def role_required(required_roles: list[UserRole]):
    """Role check decorator"""
    async def decorator(
        current_user: _models.User = Depends(get_current_user)
    ) -> _models.User:
        if not check_user_role(required_roles, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[role.value for role in required_roles]}"
            )
        return current_user
    return decorator



async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    """Enhanced user creation with role validation"""
    try:
        # Convert role string to enum if needed
        if isinstance(user.role, str):
            try:
                user.role = _models.UserRole[user.role.upper()]
            except KeyError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid role. Must be one of: {', '.join(_models.UserRole.__members__.keys())}"
                )

        # Validate year and role match
        role_mapping = {
            1: _models.UserRole.YEAR1,
            2: _models.UserRole.YEAR2,
            3: _models.UserRole.YEAR3,
            4: _models.UserRole.YEAR4
        }

        if user.role != _models.UserRole.ADMIN:
            if user.year not in role_mapping:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid year for student"
                )
            if user.role != role_mapping[user.year]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Role {user.role.value} does not match year {user.year}"
                )

        hashed_password = _hash.bcrypt.hash(user.password)
        db_user = _models.User(
            email=user.email,
            hashed_password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            year=user.year,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        logging.error(f"User creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

async def create_token(user: _models.User):
    """Create token with complete user information"""
    try:
        token_data = {
            "sub": user.email,
            "id": user.id,
            "role": user.role.value,
            "exp": _dt.datetime.utcnow() + _dt.timedelta(hours=24)
        }
        
        token = _jwt.encode(token_data, JWT_SECRET, algorithm=ALGORITHM)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role.value,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "year": user.year,
                "role": user.role.value
            }
        }
    except Exception as e:
        logging.error(f"Error creating token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create token"
        )
    
async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email, db)
    if not user or not _hash.bcrypt.verify(password, user.hashed_password):
        return False
    return user

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: _orm.Session = Depends(get_db)
) -> _models.User:
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        
        if not email or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token data",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user = await get_user_by_email(email, db)
        if not user or user.role.value != role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user or role mismatch",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user
        
    except _jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except _jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def debug_token(token: str):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return {
            "valid": True,
            "payload": payload
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }

async def create_lead(user: _schemas.User, db: _orm.Session, lead: _schemas.LeadCreate):
    lead = _models.Lead(**lead.dict(), owner_id=user.id)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return _schemas.Lead.from_orm(lead)

async def get_leads(user: _schemas.User, db: _orm.Session):
    leads = db.query(_models.Lead).filter_by(owner_id=user.id)
    return list(map(_schemas.Lead.from_orm, leads))

async def _lead_selector(lead_id: int, user: _schemas.User, db: _orm.Session):
    lead = (
        db.query(_models.Lead)
        .filter_by(owner_id=user.id)
        .filter(_models.Lead.id == lead_id)
        .first()
    )
    if lead is None:
        raise _fastapi.HTTPException(status_code=404, detail="Lead does not exist")
    return lead

async def get_lead(lead_id: int, user: _schemas.User, db: _orm.Session):
    lead = await _lead_selector(lead_id=lead_id, user=user, db=db)
    return _schemas.Lead.from_orm(lead)

async def delete_lead(lead_id: int, user: _schemas.User, db: _orm.Session):
    lead = await _lead_selector(lead_id, user, db)
    db.delete(lead)
    db.commit()

async def update_lead(lead_id: int, lead: _schemas.LeadCreate, user: _schemas.User, db: _orm.Session):
    lead_db = await _lead_selector(lead_id, user, db)
    lead_db.first_name = lead.first_name
    lead_db.last_name = lead.last_name
    lead_db.email = lead.email
    lead_db.company = lead.company
    lead_db.note = lead.note
    db.commit()
    db.refresh(lead_db)
    return _schemas.Lead.from_orm(lead_db)
    
async def validate_token_role(token: str, required_roles: list[UserRole], db: _orm.Session):
    """Validate token and check role"""
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        
        if not email or not role:
            return False
            
        user = await get_user_by_email(email, db)
        if not user or user.role.value != role:
            return False
            
        return user.role in required_roles
        
    except Exception as e:
        logging.error(f"Token role validation error: {str(e)}")
        return False

async def initialize_admin(db: _orm.Session):
    """Initialize admin user in database"""
    try:
        await create_admin_user(db)
        logging.info("Admin user initialization completed")
    except Exception as e:
        logging.error(f"Admin initialization failed: {str(e)}")
        raise