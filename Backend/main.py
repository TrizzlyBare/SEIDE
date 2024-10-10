from ast import List
import logging
import time
from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware

# Import authentication functions using absolute imports
from Backend.authentication import get_current_user, create_access_token, verify_password, get_password_hash

from Backend.database import SessionLocal, User, get_db
from Backend.dashboard import (
    Subject,
    Topic,
    Question,
    Answer,
    DashboardSessionLocal,
    SubjectCreate,
)
from Backend.editor import EditorSessionLocal, Create_Code_Data, CodeData
from Backend.user_profile import Profile, ProfileSessionLocal, ProfileCreate

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_dashboard_db():
    db = DashboardSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_editor_db():
    db = EditorSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_Profiles_db():
    db = ProfileSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_profile_db():
    db = ProfileSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Serve the login.html file
@app.get("/login", response_class=HTMLResponse)
async def get_login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Handle login form submission
@app.post("/login")
async def login(
    username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": user.username})
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        return {"access_token": access_token, "profile": profile}
    except Exception as e:
        logging.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Handle user registration
@app.post("/register")
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
    profile_db: Session = Depends(get_profile_db)
):
    try:
        logging.info(f"Registering user: {username}, {email}")
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_password = get_password_hash(password)
        new_user = User(username=username, email=email, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        profile = Profile(user_id=new_user.id, username=username, email=email)
        profile_db.add(profile)
        profile_db.commit()
        profile_db.refresh(profile)
        
        return {"message": "User registered successfully"}
    except Exception as e:
        logging.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
# Example protected route
@app.get("/profile")
async def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_profile_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# Example logout route
@app.get("/logout")
async def logout():
    return {"message": "Logged out"}

@app.get("/dashboard")
async def get_subjects(db: Session = Depends(get_dashboard_db)):
    subjects = db.query(Subject).all()
    return subjects

class SubjectCreate(BaseModel):
    name: str

@app.post("/create_subject")
async def create_subject(
    subject: SubjectCreate, db: Session = Depends(get_dashboard_db)
):
    try:
        logging.info(f"Received subject data: {subject}")

        if not subject.name:
            raise HTTPException(status_code=400, detail="Subject name is required")

        new_subject = Subject(name=subject.name)
        db.add(new_subject)
        db.commit()
        db.refresh(new_subject)

        return {"message": "Subject created successfully"}
    except Exception as e:
        logging.error(f"Error creating subject: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/create_topic")
async def create_topic(request: SubjectCreate, db: Session = Depends(get_dashboard_db)):
    try:
        logging.info(f"Received topic data: {Subject}")
        new_subject = Subject(name=request.name)
        db.add(new_subject)
        db.commit()
    except Exception as e:
        logging.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()
        return {"message": "Subject created successfully"}
    
@app.post("/create_question")   
async def create_question(request: SubjectCreate, db: Session = Depends(get_dashboard_db)):
    try:
        logging.info(f"Received question data: {Subject}")
        new_subject = Subject(name=request.name)
        db.add(new_subject)
        db.commit()
    except Exception as e:
        logging.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()
        return {"message": "Subject created successfully"}
    
@app.post("/create_answer")
async def create_answer(request: SubjectCreate, db: Session = Depends(get_dashboard_db)):
    try:
        logging.info(f"Received answer data: {Subject}")
        new_subject = Subject(name=request.name)
        db.add(new_subject)
        db.commit()
    except Exception as e:
        logging.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()
        return {"message": "Subject created successfully"}

@app.post("/editor")
async def get_editor(request: Create_Code_Data, db: Session = Depends(get_editor_db)):
    try:
        logging.info(f"Received code data: {CodeData}")
        new_code_data = CodeData(code_data=request.code_data, language=request.language)
        db.add(new_code_data)
        db.commit()
    except Exception as e:
        logging.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()
        return {"message": "Subject created successfully"}

@app.post("/profiles")
async def get_profiles(request: ProfileCreate, db: Session = Depends(get_Profiles_db)):
    try:
        logging.info(f"Received profile data: {Profile}")
        new_profile = Profile(
            username=request.username,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
        )
        db.add(new_profile)
        db.commit()
    except Exception as e:
        logging.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()
        return {"message": "Subject created successfully"}

@app.get("/logout")
async def logout():
    return {"message": "Logged out"}