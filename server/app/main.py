from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from app.routers import authentication as _authentication
from app.routers import home as _home
from app.routers import subjects as _subjects
from app.routers import questions as _questions
from sqlalchemy.orm import Session
import logging  
from app.models.dashboard.db_config import get_db as get_dashboard_db, engine as dashboard_engine
from app.models.dashboard.models import Base as DashboardBase, User as DashboardUser, Subject, Topic, Question  
from app.models.authentication.au_database import engine as auth_engine, Base as AuthBase
from app.models.authentication.models import User as AuthUser
from app.models.authentication.services import get_db as get_auth_db

app = FastAPI()

# Create tables on startup
@app.on_event("startup")
async def startup():
    logging.info("Creating tables...")
    DashboardBase.metadata.create_all(bind=dashboard_engine)
    AuthBase.metadata.create_all(bind=auth_engine)
    logging.info("Tables created successfully.")

# Basic endpoint to test the server
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

# Pydantic model for request body
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# Endpoint to create a new user
@app.post("/users/")
async def create_user(user: UserCreate, db: Session = Depends(get_auth_db)):
    existing_user = db.query(AuthUser).filter(AuthUser.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    new_user = AuthUser(username=user.username, email=user.email, hashed_password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Endpoint to retrieve all users
@app.get("/users/")
async def read_users(db: Session = Depends(get_auth_db)):
    return db.query(AuthUser).all()

app.include_router(_authentication.router)
app.include_router(_home.router)
app.include_router(_subjects.router)
app.include_router(_questions.router)