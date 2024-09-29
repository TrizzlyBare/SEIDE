# dashboard.py
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

from pydantic import BaseModel
from typing import List, Optional

DASHBOARD_DATABASE_URL = "sqlite:///./dashboard.db"

dashboard_engine = create_engine(DASHBOARD_DATABASE_URL, connect_args={"check_same_thread": False})
DashboardSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=dashboard_engine)

Base = declarative_base()

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    topics = relationship("Topic", back_populates="subject")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    subject = relationship("Subject", back_populates="topics")
    questions = relationship("Question", back_populates="topic")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    topic = relationship("Topic", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    question_id = Column(Integer, ForeignKey("questions.id"))
    question = relationship("Question", back_populates="answers")

# Create the dashboard database tables
Base.metadata.create_all(bind=dashboard_engine)

class AnswerCreate(BaseModel):
    text: str

class QuestionCreate(BaseModel):
    text: str
    answers: List[AnswerCreate]

class TopicCreate(BaseModel):
    name: str
    questions: List[QuestionCreate]

class SubjectCreate(BaseModel):
    name: str
    topics: List[TopicCreate]