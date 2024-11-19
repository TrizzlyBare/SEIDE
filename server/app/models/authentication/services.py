import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import app.models.authentication.au_database as _database
import app.models.authentication.models as _models
import app.models.authentication.schemas as _schemas

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"

def get_db():
    db = _database.SessionLocal()  # Assuming SessionLocal is correctly defined in _database
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    hashed_password = _hash.bcrypt.hash(user.password)
    db_user = _models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email, db)
    if not user or not _hash.bcrypt.verify(password, user.hashed_password):
        return False
    return user


async def create_token(user: _models.User):
    # Generate JWT token
    token_data = {"sub": user.email, "exp": _dt.datetime.utcnow() + _dt.timedelta(hours=1)}
    token = _jwt.encode(token_data, JWT_SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    credentials_exception = _fastapi.HTTPException(
        status_code=_fastapi.status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except _jwt.JWTError:
        raise credentials_exception
    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

async def create_lead(user: _schemas.User, db: _orm.Session, lead: _schemas.LeadCreate):
    lead = _models.Lead(**lead.dict(), owner_id=user.id)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return _schemas.Lead.from_orm(lead)


async def get_leads(user: _schemas.User, db: _orm.Session):
    leads = db.query(_models.Lead).filter_by(owner_id=user.id).all()
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
    lead_db.year = lead.year
    lead_db.email = lead.email
    lead_db.company = lead.company
    lead_db.note = lead.note
    db.commit()
    db.refresh(lead_db)
    return _schemas.Lead.from_orm(lead_db)
