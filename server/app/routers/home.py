from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.dashboard.db_config import get_db
from app.models.dashboard.models import User, Subject, Topic, Question, Answer, TestCase
import os
import subprocess
import fastapi as _fastapi

router = _fastapi.APIRouter(tags=["Home"]) 

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

class DoneQuestion(BaseModel):
    question_id: int
    user_id: int
    is_correct: bool

class DoneQuestionCreate(BaseModel):
    question_id: int
    user_id: int
    is_correct: bool    
    
class UserCode(BaseModel):
    user_id: int
    question_id: int
    user_code: str

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
    # Write the input data to a bash file
    bash_file_path = f"./testcases/testcase_{testcase.question_id}.sh"
    os.makedirs(os.path.dirname(bash_file_path), exist_ok=True)
    with open(bash_file_path, "w") as bash_file:
        bash_file.write(testcase.input_data)
    
    db_testcase = TestCase(input_data=bash_file_path, expected_output=testcase.expected_output, question_id=testcase.question_id)
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase

@router.get("/testcases/")
async def read_testcases(db: Session = Depends(get_db)):
    return db.query(TestCase).all()



@router.post("/run_code/")
async def run_code(question_id: int, user_code: str, db: Session = Depends(get_db)):
    # Get the test case for the question
    test_case = db.query(TestCase).filter(TestCase.question_id == question_id).first()
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")

    # Write the user's code to a temporary file
    user_code_file = f"./temp/user_code_{question_id}.py"
    os.makedirs(os.path.dirname(user_code_file), exist_ok=True)
    with open(user_code_file, "w") as code_file:
        code_file.write(user_code)

    # Run the user's code with the input data from the bash file
    result = subprocess.run(["python3", user_code_file], input=test_case.input_data, text=True, capture_output=True)

    # Compare the output with the expected output
    if result.stdout.strip() == test_case.expected_output.strip():
        return {"message": "Success", "output": result.stdout}
    else:
        return {"message": "Failure", "output": result.stdout, "expected": test_case.expected_output}

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

@router.get("users/{user_id}/donequestions/")
async def read_donequestions(user_id: int, db: Session = Depends(get_db)):
    return db.query(DoneQuestion).filter(DoneQuestion.user_id == user_id).all()

@router.get("users/{user_id}/donequestions/{question_id}/is_correct")
async def read_donequestions(user_id: int, question_id: int, db: Session = Depends(get_db)):
    return db.query(DoneQuestion).filter(DoneQuestion.user_id == user_id, DoneQuestion.question_id == question_id).first().is_correct

@router.post("users/{user_id}/user_code/", response_model=UserCode)
async def create_user_code(user_code: UserCode, db: Session = Depends(get_db)):
    db_user_code = UserCode(user_id=user_code.user_id, question_id=user_code.question_id, user_code=user_code.user_code)
    db.add(db_user_code)
    db.commit()
    db.refresh(db_user_code)
    return db_user_code

@router.get("users/{user_id}/user_code/")
async def read_user_code(user_id: int, db: Session = Depends(get_db)):
    return db.query(UserCode).filter(UserCode.user_id == user_id).all()

@router.get("users/{user_id}/user_code/{question_id}")
async def read_user_code(user_id: int, question_id: int, db: Session = Depends(get_db)):
    return db.query(UserCode).filter(UserCode.user_id == user_id, UserCode.question_id == question_id).first().user_code
