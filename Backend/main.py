from fastapi import FastAPI, Request, Form, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging
import time

from database import SessionLocal, User
from dashboard import (Subject, Topic, Question, Answer, TestCase, 
                       DashboardSessionLocal, SubjectCreate, 
                       TopicCreate, QuestionCreate, 
                       AnswerCreate, TestCaseCreate, AnswerBase, TestCaseBase, QuestionBase, TopicBase, SubjectBase, Base as DashboardBase, dashboard_engine)    
from editor import EditorSessionLocal
from user_profile import ProfileSessionLocal
from schemas import SubjectResponse, SubjectCreate, SubjectBase

# Initialize the FastAPI application
app = FastAPI()

# CORS configuration
origins = ["http://localhost:5173", "http://localhost:5174",]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

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
    logging.info(f"Request: {request.method} {request.url} completed in {process_time:.4f} seconds")
    return response

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

def get_profiles_db():
    db = ProfileSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create the dashboard database tables
DashboardBase.metadata.create_all(bind=dashboard_engine)

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
    user = db.query(User).filter(User.username == username).first()
    if user and pwd_context.verify(password, user.hashed_password):
        return {"message": "Login successful"}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

@app.post("/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    logging.info(f"Registering user: {username}, {email}")
    user = db.query(User).filter(User.username == username).first()
    if user:
        logging.warning(f"Username already registered: {username}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    hashed_password = pwd_context.hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logging.info(f"User created successfully: {username}")
    return {"message": "User created successfully"}

# Dashboard routes
@app.get("/dashboard")
async def get_subjects(db: Session = Depends(get_dashboard_db)):
    subjects = db.query(Subject).all()
    return subjects

logging.basicConfig(level=logging.INFO)

@app.post("/dashboard/subjects")
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_dashboard_db)):
    logging.info(f"Creating subject with data: {subject}")
    new_subject = Subject(subject_name=subject.subject_name)
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@app.get("/dashboard/subjects/{subject_id}")
async def get_subject(subject_id: int, db: Session = Depends(get_dashboard_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@app.get("/dashboard/subjects/{subject_id}/topics")
async def get_topics(subject_id: int, db: Session = Depends(get_dashboard_db)):
    topics = db.query(Topic).filter(Topic.subject_id == subject_id).all()
    return topics

@app.post("/dashboard/subjects/{subject_id}/topics")
async def create_topic(subject_id: int, topic: TopicCreate, db: Session = Depends(get_dashboard_db)):
    logging.info(f"Creating topic with data: {topic}")
    new_topic = Topic(subject_id=subject_id, topic_name=topic.topic_name)
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)
    return new_topic

@app.get("/dashboard/topics/{topic_id}")
async def get_topic(topic_id: int, db: Session = Depends(get_dashboard_db)):
    topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@app.get("/dashboard/topics/{topic_id}/questions")
async def get_questions(topic_id: int, db: Session = Depends(get_dashboard_db)):
    questions = db.query(Question).filter(Question.topic_id == topic_id).all()
    return questions

@app.post("/dashboard/topics/{topic_id}/questions")
async def create_question(topic_id: int, question: QuestionCreate, db: Session = Depends(get_dashboard_db)):
    logging.info(f"Creating question with data: {question}")
    new_question = Question(topic_id=topic_id, question_text=question.question_text)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@app.get("/dashboard/questions/{question_id}")
async def get_question(question_id: int, db: Session = Depends(get_dashboard_db)):
    question = db.query(Question).filter(Question.question_id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@app.get("/dashboard/questions/{question_id}/answers")
async def get_answers(question_id: int, db: Session = Depends(get_dashboard_db)):
    answers = db.query(Answer).filter(Answer.question_id == question_id).all()
    return answers

@app.post("/dashboard/questions/{question_id}/answers")
async def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_dashboard_db)):
    logging.info(f"Creating answer with data: {answer}")
    new_answer = Answer(question_id=question_id, answer_text=answer.answer_text, is_correct=answer.is_correct)
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    return new_answer

@app.get("/dashboard/questions/{question_id}/testcases")
async def get_testcases(question_id: int, db: Session = Depends(get_dashboard_db)):
    testcases = db.query(TestCase).filter(TestCase.question_id == question_id).all()
    return testcases

@app.post("/dashboard/questions/{question_id}/testcases")
async def create_testcase(question_id: int, testcase: TestCaseCreate, db: Session = Depends(get_dashboard_db)):
    logging.info(f"Creating testcase with data: {testcase}")
    new_testcase = TestCase(question_id=question_id, input_data=testcase.input_data, expected_output=testcase.expected_output)
    db.add(new_testcase)
    db.commit()
    db.refresh(new_testcase)
    return new_testcase

@app.get("/logout")
async def logout():
    return {"message": "Logged out"}