from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import time
import logging
from passlib.context import CryptContext

from database import SessionLocal, User

app = FastAPI()

# Set up templates directory
templates = Jinja2Templates(directory="templates")

# Set up password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Middleware to log request method and URL
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request: {request.method} {request.url} completed in {process_time:.4f} seconds")
    return response

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Serve the login.html file
@app.get("/login", response_class=HTMLResponse)
async def get_login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Pydantic model for login data
class LoginData(BaseModel):
    username: str
    password: str

# Handle login form submission
@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == username).first()
        if user and pwd_context.verify(password, user.hashed_password):
            return {"message": "Login successful"}
        raise HTTPException(status_code=400, detail="Invalid credentials")
    except Exception as e:
        logging.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    try:
        logging.info(f"Registering user: {username}, {email}")
        user = db.query(User).filter(User.username == username).first()
        if user:
            logging.warning(f"Username already registered: {username}")
            raise HTTPException(status_code=400, detail="Username already registered")
        hashed_password = pwd_context.hash(password)
        new_user = User(username=username, email=email, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        logging.info(f"User created successfully: {username}")
        return {"message": "User created successfully"}
    except Exception as e:
        logging.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")