from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging  
from app.routers import authentication as _authentication
from app.routers import home as _home
from app.routers import subjects as _subjects
from app.routers import questions as _questions
from app.models.dashboard.db_config import get_db, engine  
from app.models.dashboard.models import Base, User 
from app.models.authentication.models import Base  
from app.models.authentication.au_database import engine 

app = FastAPI()

# Apply CORS middleware on app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup on startup: create tables
@app.on_event("startup")
async def startup():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

# Basic endpoint to test the server
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

# Pydantic model for request body
class UserCreate(BaseModel):
    username: str
    password: str

# Endpoint to create a new user
@app.post("/users/")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    new_user = User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Endpoint to retrieve all users
@app.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Include other routers
app.include_router(_authentication.router)
app.include_router(_home.router)
app.include_router(_subjects.router)
app.include_router(_questions.router)