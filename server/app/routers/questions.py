from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Base, User, Subject, Topic, Question, Answer, TestCase, DoneQuestion
from app.models.dashboard.createtable import create_tables
import fastapi as _fastapi

router = _fastapi.APIRouter(tags=["Questions"])

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

@router.post("questions/{question_id}/answers/", response_model=AnswerCreate)
async def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_db)):
    db_answer = Answer(answer_text=answer.answer_text, is_correct=answer.is_correct, question_id=question_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.get("questions/{question_id}/answers/")
async def read_answers(question_id: int, db: Session = Depends(get_db)):
    return db.query(Answer).filter(Answer.question_id == question_id).all()

@router.post("questions/{question_id}/testcases/", response_model=TestCaseCreate)
async def create_testcase(question_id: int, testcase: TestCaseCreate, db: Session = Depends(get_db)):
    db_testcase = TestCase(input_data=testcase.input_data, expected_output=testcase.expected_output, question_id=question_id)
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase

@router.get("questions/{question_id}/testcases/")
async def read_testcases(question_id: int, db: Session = Depends(get_db)):
    return db.query(TestCase).filter(TestCase.question_id == question_id).all()

@router.post("questions/{question_id}/donequestions/", response_model=DoneQuestionCreate)
async def create_donequestion(question_id: int, donequestion: DoneQuestionCreate, db: Session = Depends(get_db)):
    db_donequestion = DoneQuestion(question_id=question_id, user_id=donequestion.user_id, is_correct=donequestion.is_correct)
    db.add(db_donequestion)
    db.commit()
    db.refresh(db_donequestion)
    return db_donequestion

@router.get("questions/{question_id}/donequestions/")
async def read_donequestions(question_id: int, db: Session = Depends(get_db)):
    return db.query(DoneQuestion).filter(DoneQuestion.question_id == question_id).all()
