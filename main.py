from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional
import time
import logging
from passlib.context import CryptContext
from typing import Dict, Any

from database import SessionLocal, User
from dashboard import Subject, Topic, Question, Answer, DashboardSessionLocal, SubjectCreate


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
    
@app.get("/dashboard")
async def get_dashboard_data(request: Request, db: Session = Depends(DashboardSessionLocal)):
    try:
        subjects = db.querysubjects = db.query(Subject).options(
            joinedload(Subject.topics).joinedload(Topic.questions).joinedload(Question.answers)
        ).all()(Subject).all()
        dashboard_data = []
        for subject in subjects:
            subject_data = {
                "id": subject.id,
                "name": subject.name,
                "topics": []
            }
            for topic in subject.topics:
                topic_data = {
                    "id": topic.id,
                    "name": topic.name,
                    "questions": []
                }
                for question in topic.questions:
                    question_data = {
                        "id": question.id,
                        "text": question.text,
                        "answers": [
                            {"id": answer.id, "text": answer.text} for answer in question.answers
                        ]
                    }
                    topic_data["questions"].append(question_data)
                subject_data["topics"].append(topic_data)

            dashboard_data.append(subject_data)

        return {"dashboard": dashboard_data}

    except Exception as e:
        logging.error(f"Error retrieving dashboard data: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving dashboard data")

@app.post("/dashboard/subject")
async def create_subject(subject: SubjectCreate, db: Session = Depends(DashboardSessionLocal)):
    try:
        new_subject = Subject(name=subject.name)
        db.add(new_subject)
        db.commit()
        db.refresh(new_subject)

        for topic in subject.topics:
            new_topic = Topic(name=topic.name, subject_id=new_subject.id)
            db.add(new_topic)
            db.commit()
            db.refresh(new_topic)

            for question in topic.questions:
                new_question = Question(text=question.text, topic_id=new_topic.id)
                db.add(new_question)
                db.commit()
                db.refresh(new_question)

                for answer in question.answers:
                    new_answer = Answer(text=answer.text, question_id=new_question.id)
                    db.add(new_answer)
                    db.commit()
                    db.refresh(new_answer)

        return {"message": "Subject created successfully"}
    except Exception as e:
        logging.error(f"Error creating subject: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# @app.post("/dashboard/subject")
# async def create_subject(subject_data: Dict[str, Any], db: Session = Depends(get_db)):
#     try:
#         subject_name = subject_data.get("subject_name")
#         topics = subject_data.get("topics", [])
        
#         if not subject_name:
#             raise HTTPException(status_code=400, detail="Subject name is required")

#         # Create and commit the new subject
#         new_subject = Subject(name=subject_name)
#         db.add(new_subject)
#         db.commit()
#         db.refresh(new_subject)

#         for topic_data in topics:
#             topic_name = topic_data.get("topic_name")
#             questions = topic_data.get("questions", [])
            
#             if not topic_name:
#                 raise HTTPException(status_code=400, detail="Topic name is required")

#             new_topic = Topic(name=topic_name, subject_id=new_subject.id)
#             db.add(new_topic)
#             db.commit()
#             db.refresh(new_topic)

#             for question_data in questions:
#                 question_text = question_data.get("question_text")
#                 answers = question_data.get("answers", [])

#                 if not question_text:
#                     raise HTTPException(status_code=400, detail="Question text is required")

#                 new_question = Question(text=question_text, topic_id=new_topic.id)
#                 db.add(new_question)
#                 db.commit()
#                 db.refresh(new_question)

#                 for answer_text in answers:
#                     if not answer_text:
#                         raise HTTPException(status_code=400, detail="Answer text is required")

#                     new_answer = Answer(text=answer_text, question_id=new_question.id)
#                     db.add(new_answer)
#                     db.commit()
#                     db.refresh(new_answer)

#         return {"message": "Subject created successfully"}
#     except Exception as e:
#         logging.error(f"Error creating subject: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get("/logout")
async def logout():
    return {"message": "Logged out"}
    