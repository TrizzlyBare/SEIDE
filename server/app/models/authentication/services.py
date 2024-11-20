import fastapi as _fastapi
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import logging
from fastapi import HTTPException, status, Depends


import app.models.authentication.au_database as _database
import app.models.authentication.models as _models
import app.models.authentication.schemas as _schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"  # In production, this should be in environment variables
ALGORITHM = "HS256"

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    hashed_password = _hash.bcrypt.hash(user.password)
    db_user = _models.User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        year=user.year
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def create_token(user: _models.User):
    try:
        # Create token data with user information
        token_data = {
            "sub": user.email,  # using email as subject
            "id": user.id,  # include user id
            "exp": _dt.datetime.utcnow() + _dt.timedelta(hours=24)  # 24 hour expiration
        }
        
        # Create the JWT token
        token = _jwt.encode(token_data, JWT_SECRET, algorithm=ALGORITHM)
        
        logging.info(f"Created token for user: {user.email}")
        return {
            "access_token": token,
            "token_type": "bearer"
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

async def get_current_user(token: str = Depends(oauth2_scheme), db: _orm.Session = Depends(get_db)):
    try:
        # Log the received token for debugging
        logging.info(f"Validating token: {token[:20]}...")
        
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Decode the JWT token
            payload = _jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                logging.error("No email in token payload")
                raise credentials_exception
                
            logging.info(f"Token decoded successfully for email: {email}")
            
        except _jwt.ExpiredSignatureError:
            logging.error("Token has expired")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except _jwt.JWTError as e:
            logging.error(f"JWT decode error: {str(e)}")
            raise credentials_exception
            
        # Get user from database
        user = await get_user_by_email(email=email, db=db)
        if user is None:
            logging.error(f"No user found for email: {email}")
            raise credentials_exception
            
        return user
        
    except Exception as e:
        logging.error(f"Error in get_current_user: {str(e)}")
        raise credentials_exception

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