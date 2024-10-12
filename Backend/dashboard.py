from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

from pydantic import BaseModel
from typing import List, Optional

DASHBOARD_DATABASE_URL = "sqlite:///./dashboard.db"

dashboard_engine = create_engine(
    DASHBOARD_DATABASE_URL, connect_args={"check_same_thread": False}
)
DashboardSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=dashboard_engine
)

Base = declarative_base()

# Subject Model
class Subject(Base):
    __tablename__ = 'subjects'
    
    subject_id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String, nullable=False, index=True)

# Topic Model
class Topic(Base):
    __tablename__ = 'topics'
    
    topic_id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey('subjects.subject_id', ondelete="CASCADE"))
    topic_name = Column(String, nullable=False)

# Question Model
class Question(Base):
    __tablename__ = 'questions'
    
    question_id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey('topics.topic_id', ondelete="CASCADE"))
    question_text = Column(Text, nullable=False)

# Answer Model
class Answer(Base):
    __tablename__ = 'answers'
    
    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.question_id', ondelete="CASCADE"))
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

# TestCase Model
class TestCase(Base):
    __tablename__ = 'test_cases'
    
    test_case_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.question_id', ondelete="CASCADE"))
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)

# Create the dashboard database tables
print("Creating database tables...")
Base.metadata.create_all(bind=dashboard_engine)

# Pydantic Models for Validation

class AnswerBase(BaseModel):
    answer_text: str
    is_correct: bool

class AnswerCreate(AnswerBase):
    pass

class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str

class TestCaseCreate(TestCaseBase):
    pass

class QuestionBase(BaseModel):
    question_text: str
    answers: List[AnswerCreate] = []
    test_cases: List[TestCaseCreate] = []

class QuestionCreate(QuestionBase):
    pass

class TopicBase(BaseModel):
    topic_name: str

class TopicCreate(TopicBase):
    questions: List[QuestionCreate] = []

class SubjectBase(BaseModel):
    subject_name: str

class SubjectCreate(SubjectBase):
    topics: List[TopicCreate] = []
