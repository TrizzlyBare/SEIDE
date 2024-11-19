from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
import logging
from typing import List, Optional
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Base, User, Subject, Topic, Question, Answer, TestCase, DoneQuestion
from app.models.dashboard.createtable import create_tables
import fastapi as _fastapi

router = APIRouter(tags=["Questions"])

class QuestionCreate(BaseModel):
    question_text: str
    topic_id: int

class AnswerCreate(BaseModel):
    answer_text: str
    is_correct: bool

class TestCaseCreate(BaseModel):
    input_data: str
    expected_output: str
    setup_script: str = "#!/bin/bash\n\n"
    validation_script: str = 'diff <(echo "$expected") <(echo "$output")'

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    topic_id: int
    answers: List['AnswerResponse']
    test_cases: List['TestCaseResponse']

    class Config:
        orm_mode = True

class AnswerResponse(BaseModel):
    answer_id: int
    answer_text: str
    is_correct: bool
    
    class Config:
        orm_mode = True

class TestCaseResponse(BaseModel):
    test_case_id: int
    input_data: str
    expected_output: str 
    setup_script: str
    validation_script: str

    class Config:
        from_attributes = True

@router.get("/questions/", response_model=List[QuestionResponse])
async def get_questions(topic_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Question).options(
        joinedload(Question.answers),
        joinedload(Question.test_cases)
    )
    
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    
    return query.all()

@router.post("/questions/", response_model=QuestionResponse)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = Question(
        question_text=question.question_text,
        topic_id=question.topic_id
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.post("/questions/{question_id}/answers/", response_model=AnswerResponse)
async def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_db)):
    db_answer = Answer(
        answer_text=answer.answer_text,
        is_correct=answer.is_correct,
        question_id=question_id
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.post("/questions/{question_id}/testcases/", response_model=TestCaseResponse) 
async def create_testcase(question_id: int, testcase: TestCaseCreate, db: Session = Depends(get_db)):
    db_testcase = TestCase(
        input_data=testcase.input_data,
        expected_output=testcase.expected_output,
        question_id=question_id
    )
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase