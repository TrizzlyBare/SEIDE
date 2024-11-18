from typing import List
from sqlalchemy import ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'user_table'

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=False)

    subjects: Mapped[List["Subject"]] = relationship("Subject", back_populates="user")
    done_questions: Mapped[List["DoneQuestion"]] = relationship("DoneQuestion", back_populates="user")

class Subject(Base):
    __tablename__ = 'subject_table'

    subject_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    year: Mapped[str] = mapped_column(String, nullable=False)
    topics: Mapped[List["Topic"]] = relationship("Topic", back_populates="subject")

    user_id: Mapped[int] = mapped_column(ForeignKey("user_table.user_id"))
    user: Mapped["User"] = relationship("User", back_populates="subjects")

class Topic(Base):
    __tablename__ = 'topics_table'

    topic_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    topic_name: Mapped[str] = mapped_column(String, nullable=False)

    subject_id: Mapped[int] = mapped_column(ForeignKey("subject_table.subject_id"))
    subject: Mapped["Subject"] = relationship("Subject", back_populates="topics")

    questions: Mapped[List["Question"]] = relationship("Question", back_populates="topic")

class Question(Base):
    __tablename__ = 'questions_table'

    question_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_text: Mapped[str] = mapped_column(String, nullable=False)

    topic_id: Mapped[int] = mapped_column(ForeignKey("topics_table.topic_id"))
    topic: Mapped["Topic"] = relationship("Topic", back_populates="questions")

    answers: Mapped[List["Answer"]] = relationship("Answer", back_populates="question")
    test_cases: Mapped[List["TestCase"]] = relationship("TestCase", back_populates="question")

class Answer(Base):
    __tablename__ = 'answers_table'

    answer_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    answer_text: Mapped[str] = mapped_column(String, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)

    question_id: Mapped[int] = mapped_column(ForeignKey("questions_table.question_id"))
    question: Mapped["Question"] = relationship("Question", back_populates="answers")

class TestCase(Base):
    __tablename__ = 'test_cases_table'

    test_case_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    input_data: Mapped[str] = mapped_column(String, nullable=False)
    expected_output: Mapped[str] = mapped_column(String, nullable=False)

    question_id: Mapped[int] = mapped_column(ForeignKey("questions_table.question_id"))
    question: Mapped["Question"] = relationship("Question", back_populates="test_cases")

class DoneQuestion(Base):
    __tablename__ = 'done_questions_table'

    done_question_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    question_id: Mapped[int] = mapped_column(ForeignKey("questions_table.question_id"))
    question: Mapped["Question"] = relationship("Question")

    user_id: Mapped[int] = mapped_column(ForeignKey("user_table.user_id"))
    user: Mapped["User"] = relationship("User", back_populates="done_questions")