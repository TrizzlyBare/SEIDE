from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
import logging
from typing import List, Optional
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import Base, User, Subject, Topic, Question, Answer, TestCase, DoneQuestion, UserCodeData
from app.models.dashboard.createtable import create_tables
from app.models.authentication.services import get_current_user, role_required
from app.models.authentication.models import UserRole
import fastapi as _fastapi

router = APIRouter(tags=["Questions"])

class QuestionCreate(BaseModel):
    question_text: str
    topic_id: int
    question_type: str 
    language: str
    due_date: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "question_text": "Sample question",
                "topic_id": 1,
                "question_type": "homework",
                "language": "python",
                "due_date": "2024-03-21T15:30:00Z"
            }
        }

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
    question_type: str
    language: str
    due_date: Optional[datetime]
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
    

class DoneQuestionCreate(BaseModel):
    user_id: int
    is_correct: bool

class DoneQuestionResponse(BaseModel):
    done_question_id: int
    question_id: int
    user_id: int
    is_correct: bool
    submitted_at: datetime

    class Config:
        orm_mode = True

class CodeSubmissionCreate(BaseModel):
    code: str
    language: str
    output: Optional[str] = None
    execution_time: Optional[float] = None
    memory_used: Optional[float] = None

class CodeSubmissionResponse(BaseModel):
    question_id: int
    user_id: int
    code_data: str
    is_correct: bool
    submitted_at: datetime

    class Config:
        orm_mode = True

@router.get("/questions/", response_model=List[QuestionResponse])
async def get_questions(topic_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Question).options(
        joinedload(Question.answers),
        joinedload(Question.test_cases)
    )
    
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    
    return query.all()

# Remove the duplicate and keep only this version
@router.post("/questions/", response_model=QuestionResponse)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    # Validate question type
    if question.question_type not in ["homework", "lab"]:
        raise HTTPException(
            status_code=400,
            detail="Question type must be either 'homework' or 'lab'"
        )

    db_question = Question(
        question_text=question.question_text,
        topic_id=question.topic_id,
        question_type=question.question_type
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

@router.get("/subjects/{subject_id}/topics/{topic_id}/questions", response_model=List[QuestionResponse])
async def get_topic_questions(subject_id: int, topic_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.topic_id == topic_id).options(
        joinedload(Question.answers),
        joinedload(Question.test_cases)
    ).all()
    if not questions:
        return []
    return questions

@router.post("/subjects/{subject_id}/topics/{topic_id}/questions", response_model=QuestionResponse)
async def create_topic_question(
    subject_id: int, 
    topic_id: int, 
    question: QuestionCreate, 
    db: Session = Depends(get_db)
):
    try:
            # Validate question type
            if question.question_type not in ["homework", "lab"]:
                raise HTTPException(
                    status_code=400,
                    detail="Question type must be either 'homework' or 'lab'"
                )

            # Verify topic exists
            topic = db.query(Topic).filter(
                Topic.topic_id == topic_id,
                Topic.subject_id == subject_id
            ).first()

            if not topic:
                raise HTTPException(
                    status_code=404,
                    detail="Topic not found or does not belong to the specified subject"
                )

            # Parse the due_date string to datetime object if it exists
            due_date = None
            if question.due_date:
                try:
                    # Remove the 'Z' and milliseconds if present
                    clean_date = question.due_date.replace('Z', '').split('.')[0]
                    due_date = datetime.strptime(clean_date, "%Y-%m-%dT%H:%M:%S")
                except ValueError as e:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS"
                    )

            db_question = Question(
                question_text=question.question_text,
                topic_id=topic_id,
                question_type=question.question_type,
                language=question.language,
                due_date=due_date
            )

            db.add(db_question)
            db.commit()
            db.refresh(db_question)
            return db_question

    except Exception as e:
            db.rollback()
            logging.error(f"Error creating question: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

@router.post("/subjects/{subject_id}/topics/{topic_id}/questions/{question_id}/answers", response_model=AnswerResponse)
async def create_topic_question_answer(
    subject_id: int,
    topic_id: int,
    question_id: int,
    answer: AnswerCreate,
    db: Session = Depends(get_db)
):
    db_answer = Answer(
        answer_text=answer.answer_text,
        is_correct=answer.is_correct,
        question_id=question_id
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.post("/subjects/{subject_id}/topics/{topic_id}/questions/{question_id}/testcases", response_model=TestCaseResponse)
async def create_topic_question_testcase(
    subject_id: int,
    topic_id: int,
    question_id: int,
    testcase: TestCaseCreate,
    db: Session = Depends(get_db)
):
    db_testcase = TestCase(
        input_data=testcase.input_data,
        expected_output=testcase.expected_output,
        setup_script=testcase.setup_script,
        validation_script=testcase.validation_script,
        question_id=question_id
    )
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase


@router.get("/questions/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).options(
        joinedload(Question.answers),
        joinedload(Question.test_cases)
    ).filter(Question.question_id == question_id).first()


    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )


    return question


@router.post("/questions/{question_id}/submit-code", response_model=CodeSubmissionResponse)
async def submit_code(
    question_id: int,
    submission: CodeSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        if not current_user:
            raise HTTPException(
                status_code=401,
                detail="Authentication required"
            )


        # Get the question and its test cases
        question = db.query(Question).options(
            joinedload(Question.test_cases)
        ).filter(Question.question_id == question_id).first()


        if not question:
            raise HTTPException(
                status_code=404,
                detail="Question not found"
            )


        # Validate language matches question
        if question.language.lower() != submission.language.lower():
            raise HTTPException(
                status_code=400,
                detail=f"Language mismatch. Question requires {question.language}"
            )


        # Execute code and check against test cases
        is_correct = False
        try:
            test_case = question.test_cases[0] if question.test_cases else None
            if test_case:
                result_output = submission.output.strip() if submission.output else ""
                expected_output = test_case.expected_output.strip()
                is_correct = result_output == expected_output
        except IndexError:
            logging.warning(f"No test cases found for question {question_id}")


        # Save user's code
        user_code = UserCodeData(
            code_data=submission.code,
            question_id=question_id
        )
        db.add(user_code)


        # Create or update DoneQuestion entry
        submission_time = datetime.utcnow()


        existing_submission = db.query(DoneQuestion).filter(
            DoneQuestion.question_id == question_id,
            DoneQuestion.user_id == current_user.id  # Changed from user_id to id
        ).first()


        if existing_submission:
            existing_submission.is_correct = is_correct
            existing_submission.submitted_at = submission_time
            db_submission = existing_submission
        else:
            db_submission = DoneQuestion(
                question_id=question_id,
                user_id=current_user.id,  # Changed from user_id to id
                is_correct=is_correct,
                submitted_at=submission_time
            )
            db.add(db_submission)


        db.commit()
        db.refresh(user_code)


        return {
            "question_id": question_id,
            "user_id": current_user.id,  # Changed from user_id to id
            "code_data": submission.code,
            "is_correct": is_correct,
            "submitted_at": submission_time
        }


    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        logging.error(f"Error submitting code: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error submitting code: {str(e)}"
        )