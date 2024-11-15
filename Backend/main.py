from ast import List
from fastapi import FastAPI, Request, Form, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from typing import List

from database import SessionLocal, User
from dashboard import (Subject, Topic, Question, Answer, TestCase, 
                       DashboardSessionLocal, SubjectCreate, 
                       TopicCreate, QuestionCreate, 
                       AnswerCreate, TestCaseCreate, AnswerBase, TestCaseBase, QuestionBase, TopicBase, SubjectBase)    
from editor import EditorSessionLocal
from user_profile import ProfileSessionLocal
from schemas import Subject, SubjectCreate

# Initialize the FastAPI application
app = FastAPI()

# CORS configuration
origins = ["http://localhost:5174"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
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

@app.post("/subjects/", response_model=Subject)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.get("/subjects/", response_model=List[Subject])
def read_subjects(skip: int = 0, limit: int = 10, db: Session = Depends(get_dashboard_db)):
    subjects = db.query(Subject).offset(skip).limit(limit).all()
    return subjects

@app.get("/subjects/{subject_id}", response_model=Subject)
def read_subject(subject_id: int, db: Session = Depends(get_dashboard_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if subject is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return subject

@app.put("/subjects/{subject_id}", response_model=Subject)
def update_subject(subject_id: int, subject: SubjectCreate, db: Session = Depends(get_dashboard_db)):
    db_subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if db_subject is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    
    for key, value in subject.dict().items():
        setattr(db_subject, key, value)

    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_dashboard_db)):
    db_subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if db_subject is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"detail": "Subject deleted"}

# CRUD for Topics
@app.post("/topics/{subject_id}/", response_model=TopicBase)
def create_topic(subject_id: int, topic: TopicCreate, db: Session = Depends(get_dashboard_db)):
    db_topic = Topic(**topic.dict(), subject_id=subject_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@app.get("/topics/", response_model=List[TopicBase])
def read_topics(skip: int = 0, limit: int = 10, db: Session = Depends(get_dashboard_db)):
    topics = db.query(Topic).offset(skip).limit(limit).all()
    return topics

@app.get("/topics/{topic_id}", response_model=TopicBase)
def read_topic(topic_id: int, db: Session = Depends(get_dashboard_db)):
    topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if topic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return topic

@app.put("/topics/{topic_id}", response_model=TopicBase)
def update_topic(topic_id: int, topic: TopicCreate, db: Session = Depends(get_dashboard_db)):
    db_topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if db_topic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    
    for key, value in topic.dict().items():
        setattr(db_topic, key, value)
    
    db.commit()
    db.refresh(db_topic)
    return db_topic

@app.delete("/topics/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_dashboard_db)):
    db_topic = db.query(Topic).filter(Topic.topic_id == topic_id).first()
    if db_topic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    db.delete(db_topic)
    db.commit()
    return {"detail": "Topic deleted"}

# CRUD for Questions
@app.post("/topics/{topic_id}/questions/", response_model=QuestionBase)
def create_question(topic_id: int, question: QuestionCreate, db: Session = Depends(get_dashboard_db)):
    db_question = Question(**question.dict(), topic_id=topic_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@app.get("/questions/", response_model=List[QuestionBase])
def read_questions(skip: int = 0, limit: int = 10, db: Session = Depends(get_dashboard_db)):
    questions = db.query(Question).offset(skip).limit(limit).all()
    return questions

@app.get("/questions/{question_id}", response_model=QuestionBase)
def read_question(question_id: int, db: Session = Depends(get_dashboard_db)):
    question = db.query(Question).filter(Question.question_id == question_id).first()
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return question

@app.put("/questions/{question_id}", response_model=QuestionBase)
def update_question(question_id: int, question: QuestionCreate, db: Session = Depends(get_dashboard_db)):
    db_question = db.query(Question).filter(Question.question_id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    
    for key, value in question.dict().items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@app.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_dashboard_db)):
    db_question = db.query(Question).filter(Question.question_id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    db.delete(db_question)
    db.commit()
    return {"detail": "Question deleted"}

# CRUD for Answers
@app.post("/questions/{question_id}/answers/", response_model=AnswerBase)
def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_dashboard_db)):
    db_answer = Answer(**answer.dict(), question_id=question_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@app.get("/answers/", response_model=List[AnswerBase])
def read_answers(skip: int = 0, limit: int = 10, db: Session = Depends(get_dashboard_db)):
    answers = db.query(Answer).offset(skip).limit(limit).all()
    return answers

@app.get("/answers/{answer_id}", response_model=AnswerBase)
def read_answer(answer_id: int, db: Session = Depends(get_dashboard_db)):
    answer = db.query(Answer).filter(Answer.answer_id == answer_id).first()
    if answer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")
    return answer

@app.put("/answers/{answer_id}", response_model=AnswerBase)
def update_answer(answer_id: int, answer: AnswerCreate, db: Session = Depends(get_dashboard_db)):
    db_answer = db.query(Answer).filter(Answer.answer_id == answer_id).first()
    if db_answer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")
    
    for key, value in answer.dict().items():
        setattr(db_answer, key, value)
    
    db.commit()
    db.refresh(db_answer)
    return db_answer

@app.delete("/answers/{answer_id}")
def delete_answer(answer_id: int, db: Session = Depends(get_dashboard_db)):
    db_answer = db.query(Answer).filter(Answer.answer_id == answer_id).first()
    if db_answer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found")
    db.delete(db_answer)
    db.commit()
    return {"detail": "Answer deleted"}

# CRUD for Test Cases
@app.post("/questions/{question_id}/testcases/", response_model=TestCaseBase)
def create_test_case(question_id: int, test_case: TestCaseCreate, db: Session = Depends(get_dashboard_db)):
    db_test_case = TestCase(**test_case.dict(), question_id=question_id)
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

@app.get("/testcases/", response_model=List[TestCaseBase])
def read_test_cases(skip: int = 0, limit: int = 10, db: Session = Depends(get_dashboard_db)):
    test_cases = db.query(TestCase).offset(skip).limit(limit).all()
    return test_cases

@app.get("/testcases/{test_case_id}", response_model=TestCaseBase)
def read_test_case(test_case_id: int, db: Session = Depends(get_dashboard_db)):
    test_case = db.query(TestCase).filter(TestCase.test_case_id == test_case_id).first()
    if test_case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found")
    return test_case

@app.put("/testcases/{test_case_id}", response_model=TestCaseBase)
def update_test_case(test_case_id: int, test_case: TestCaseCreate, db: Session = Depends(get_dashboard_db)):
    db_test_case = db.query(TestCase).filter(TestCase.test_case_id == test_case_id).first()
    if db_test_case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found")
    
    for key, value in test_case.dict().items():
        setattr(db_test_case, key, value)
    
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

@app.delete("/testcases/{test_case_id}")
def delete_test_case(test_case_id: int, db: Session = Depends(get_dashboard_db)):
    db_test_case = db.query(TestCase).filter(TestCase.test_case_id == test_case_id).first()
    if db_test_case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found")
    db.delete(db_test_case)
    db.commit()
    return {"detail": "Test case deleted"}

@app.get("/logout")
async def logout():
    return {"message": "Logged out"}