import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.authentication.models import UserRole
from app.models.authentication.services import get_current_user
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import List, Optional
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Subject, Topic, User
from app.models.dashboard.models import Question  # Import the Question model

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    topic_id: int

    class Config:
        orm_mode = True

router = APIRouter(tags=["Subjects"])

class SubjectBase(BaseModel):
    subject_name: str
    year: str  # Add the year field

class SubjectCreate(SubjectBase):
    user_id: int

class SubjectResponse(SubjectBase):
    subject_id: int
    user_id: int

    class Config:
        orm_mode = True

class TopicCreate(BaseModel):
    topic_name: str
    subject_id: int

class TopicResponse(BaseModel):
    topic_id: int
    topic_name: str
    subject_id: int

class TestCaseResponse(BaseModel):
    test_case_id: int
    input_data: str
    expected_output: str
    setup_script: str
    validation_script: str

    class Config:
        orm_mode = True

class AnswerResponse(BaseModel):
    answer_id: int
    answer_text: str
    is_correct: bool

    class Config:
        orm_mode = True

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    topic_id: int
    question_type: str
    language: str  # Add this field
    test_cases: List[TestCaseResponse]
    answers: List[AnswerResponse]

    class Config:
        orm_mode = True

@router.post("/subjects/", response_model=SubjectResponse)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(
        subject_name=subject.subject_name,
        year=subject.year,  # Include the year field
        user_id=subject.user_id
    )
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/", response_model=List[SubjectResponse])
async def read_subjects(role: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if role == "YEAR1":
        return db.query(Subject).filter(Subject.year == "Year 1").all()
    elif role == "YEAR2":
        return db.query(Subject).filter(Subject.year == "Year 2").all()
    elif role == "YEAR3":
        return db.query(Subject).filter(Subject.year == "Year 3").all()
    elif role == "YEAR4":
        return db.query(Subject).filter(Subject.year == "Year 4").all()
    else:
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
    
    topics = db.query(Topic).filter(Topic.subject_id == subject_id).all()
    for topic in topics:
        db.delete(topic)
    
    db.delete(subject)
    db.commit()
    return {"message": "Subject and associated topics deleted successfully"}

@router.post("/subjects/{subject_id}/topics", response_model=TopicResponse)
async def create_topic(subject_id: int, topic: TopicCreate, db: Session = Depends(get_db)):
    db_topic = Topic(topic_name=topic.topic_name, subject_id=subject_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.get("/subjects/{subject_id}/topics", response_model=List[TopicResponse])
async def read_topics(subject_id: int, db: Session = Depends(get_db)):
    return db.query(Topic).filter(Topic.subject_id == subject_id).all()

@router.get("/subjects/{subject_id}/topics/{topic_id}", response_model=TopicResponse)
async def read_topic(subject_id: int, topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(
        Topic.subject_id == subject_id,
        Topic.topic_id == topic_id
    ).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic 

@router.get("/subjects/{role}/{year}")
async def get_subjects(
    role: str,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Verify user has access to requested role/year
        if current_user.role != UserRole.ADMIN and (
            current_user.role.value != role or 
            current_user.year != year
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        # Get subjects based on role
        if role == "ADMIN":
            # Admin can see all subjects
            subjects = db.query(Subject).all()
        else:
            # Students can only see subjects for their year
            subjects = db.query(Subject).filter(Subject.year == year).all()

        return subjects

    except Exception as e:
        logging.error(f"Error fetching subjects: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching subjects"
        )