from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Base, User, Subject, Topic, Question, Answer, TestCase, DoneQuestion
from app.models.dashboard.createtable import create_tables
import fastapi as _fastapi

router = _fastapi.APIRouter(tags=["Subjects"])

class SubjectCreate(BaseModel):
    subject_name: str
    user_id: int

class TopicCreate(BaseModel):
    topic_name: str
    subject_id: int

class QuestionCreate(BaseModel):
    question_text: str
    topic_id: int


@router.post("/subjects/{subject_id}/topics/", response_model=TopicCreate)
async def create_topic(subject_id: int, topic: TopicCreate, db: Session = Depends(get_db)):
    db_topic = Topic(topic_name=topic.topic_name, subject_id=subject_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.get("/subjects/{subject_id}/topics/")
async def read_topics(subject_id: int, db: Session = Depends(get_db)):
    return db.query(Topic).filter(Topic.subject_id == subject_id).all()

@router.post("subjects/topics/{topic_id}/questions/", response_model=QuestionCreate)
async def create_question(topic_id: int, question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = Question(question_text=question.question_text, topic_id=topic_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("subjects/topics/{topic_id}/questions/")
async def read_questions(topic_id: int, db: Session = Depends(get_db)):
    return db.query(Question).filter(Question.topic_id == topic_id).all()
