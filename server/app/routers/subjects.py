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


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Subject

router = APIRouter(tags=["Subjects"])

# Pydantic models for request/response
class SubjectBase(BaseModel):
    subject_name: str
    year: str

class SubjectCreate(SubjectBase):
    user_id: int

class SubjectResponse(SubjectBase):
    subject_id: int
    user_id: int

    class Config:
        from_attributes = True

# Routes
@router.post("/subjects/", response_model=SubjectResponse)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(
        subject_name=subject.subject_name,
        user_id=subject.user_id
    )
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/", response_model=List[SubjectResponse])
async def read_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()

@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
async def read_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.delete("/subjects/{subject_id}")
async def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}