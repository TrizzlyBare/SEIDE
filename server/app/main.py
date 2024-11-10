from fastapi import FastAPI, Depends, HTTPException
import fastapi as _fastapi
from app.routers import authentication as _authentication
from app.routers import home as _home
from app.routers import subjects as _subjects
from app.routers import questions as _questions
from sqlalchemy.orm import Session
import logging  
from app.models.dashboard.db_config import get_db, engine  
from app.models.dashboard.models import Base, User, Subject, Topic, Question  


app = _fastapi.FastAPI()

# Create tables on startup
@app.on_event("startup")
async def startup():
    logging.info("Creating tables...")
    Base.metadata.create_all(bind=engine)
    logging.info("Tables created successfully.")

# Basic endpoint to test the server
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

# Endpoint to create a new user
@app.post("/users/")
async def create_user(username: str, password: str, db: Session = Depends(get_db)):
    # Check if the user already exists
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    new_user = User(username=username, password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Endpoint to retrieve all users
@app.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

app.include_router(_authentication.router)
app.include_router(_home.router)
app.include_router(_subjects.router)
app.include_router(_questions.router)
