from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Base, User, Subject, Topic, Question, Answer, TestCase, DoneQuestion
from app.models.dashboard.createtable import create_tables

router = APIRouter()

# Create tables on startup
@router.on_event("startup")
async def startup():
    logging.info("Creating tables...")
    create_tables()
    logging.info("Tables created successfully.")

# Basic endpoint to test the server
@router.get("/")
async def root():
    return {"message": "Hello, World!"}

# Pydantic models for request bodies
class UserCreate(BaseModel):
    username: str
    password: str

class SubjectCreate(BaseModel):
    subject_name: str
    user_id: int

class TopicCreate(BaseModel):
    topic_name: str
    subject_id: int

class QuestionCreate(BaseModel):
    question_text: str
    topic_id: int

class AnswerCreate(BaseModel):
    answer_text: str
    is_correct: bool
    question_id: int

class TestCaseCreate(BaseModel):
    input_data: str
    expected_output: str
    question_id: int

class DoneQuestionCreate(BaseModel):
    question_id: int
    user_id: int
    is_correct: bool

# Endpoints
@router.post("/users/", response_model=UserCreate)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/subjects/", response_model=SubjectCreate)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(subject_name=subject.subject_name, user_id=subject.user_id)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/")
async def read_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()

@router.post("/topics/", response_model=TopicCreate)
async def create_topic(topic: TopicCreate, db: Session = Depends(get_db)):
    db_topic = Topic(topic_name=topic.topic_name, subject_id=topic.subject_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.get("/topics/")
async def read_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()

@router.post("/questions/", response_model=QuestionCreate)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = Question(question_text=question.question_text, topic_id=question.topic_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/questions/")
async def read_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()

@router.post("/answers/", response_model=AnswerCreate)
async def create_answer(answer: AnswerCreate, db: Session = Depends(get_db)):
    db_answer = Answer(answer_text=answer.answer_text, is_correct=answer.is_correct, question_id=answer.question_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.get("/answers/")
async def read_answers(db: Session = Depends(get_db)):
    return db.query(Answer).all()

@router.post("/testcases/", response_model=TestCaseCreate)
async def create_testcase(testcase: TestCaseCreate, db: Session = Depends(get_db)):
    db_testcase = TestCase(input_data=testcase.input_data, expected_output=testcase.expected_output, question_id=testcase.question_id)
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase

@router.get("/testcases/")
async def read_testcases(db: Session = Depends(get_db)):
    return db.query(TestCase).all()

@router.post("/donequestions/", response_model=DoneQuestionCreate)
async def create_donequestion(donequestion: DoneQuestionCreate, db: Session = Depends(get_db)):
    db_donequestion = DoneQuestion(question_id=donequestion.question_id, user_id=donequestion.user_id, is_correct=donequestion.is_correct)
    db.add(db_donequestion)
    db.commit()
    db.refresh(db_donequestion)
    return db_donequestion

@router.get("/donequestions/")
async def read_donequestions(db: Session = Depends(get_db)):
    return db.query(DoneQuestion).all()