# dashboard.py
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


class Subject(Base):
    __tablename__ = 'subjects'
    
    subject_id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String, nullable=False)
    description = Column(Text)
    topics = relationship("Topic", back_populates="subject")

class Topic(Base):
    __tablename__ = 'topics'
    
    topic_id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey('subjects.subject_id'))
    topic_name = Column(String, nullable=False)
    description = Column(Text)
    questions = relationship("Question", back_populates="topic")
    subject = relationship("Subject", back_populates="topics")

class Question(Base):
    __tablename__ = 'questions'
    
    question_id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey('topics.topic_id'))
    question_text = Column(Text, nullable=False)
    test_cases = relationship("TestCase", back_populates="question")
    answers = relationship("Answer", back_populates="question")
    topic = relationship("Topic", back_populates="questions")

class Answer(Base):
    __tablename__ = 'answers'
    
    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.question_id'))
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    question = relationship("Question", back_populates="answers")

class TestCase(Base):
    __tablename__ = 'test_cases'
    
    test_case_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.question_id'))
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    question = relationship("Question", back_populates="test_cases")


# Create the dashboard database tables
Base.metadata.create_all(bind=dashboard_engine)
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
    description: str

class TopicCreate(TopicBase):
    questions: List[QuestionCreate] = []

class SubjectBase(BaseModel):
    subject_name: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    topics: List[TopicCreate] = []