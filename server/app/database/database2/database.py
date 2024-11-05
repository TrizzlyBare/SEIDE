from __future__ import annotations
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, String, Boolean
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

class Subject(Base):   
    __tablename__ = 'subject_table'

    subject_id : Mapped[int] = mapped_column(primary_key=True)
    subject_name = mapped_column(String, nullable=False, index=True)
    topics: Mapped[List["Topic"]] = relationship(back_populates='subject')

class Topic(Base):
    __tablename__ = 'topics_table'

    topic_id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    topic_name = mapped_column(String, nullable=False)

    subject_id: Mapped[int] = mapped_column(ForeignKey("subject_table.id"))
    subject : Mapped["Subject"] = relationship('Subject', back_populates='topics')

    question : Mapped[List["Question"]] = relationship(back_populates='topic')


class Question(Base):
    __tablename__ = 'question_table'

    question_id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_text = mapped_column(String, nullable=False)

    topic_id : Mapped[int] = mapped_column(ForeignKey("topics_table.id"))
    topic : Mapped["Topic"] = relationship('Topic', back_populates='question')

    answer : Mapped[List["Answer"]] = relationship(back_populates='question')
    test_case : Mapped[List["TestCase"]] = relationship(back_populates='question')

class Answer(Base):
    __tablename__ = 'answer_table'

    answer_id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    answer_text = mapped_column(String, nullable=False)
    is_correct = mapped_column(Boolean, default=False)

    question_id : Mapped[int] = mapped_column(ForeignKey("question_table.id"))
    question : Mapped["Question"] = relationship('Question', back_populates='answer')


class TestCase(Base):
    __tablename__ = 'test_case_table'

    test_case_id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    input_data = mapped_column(String, nullable=False)
    expected_output = mapped_column(String, nullable=False)

    question_id : Mapped[int] = mapped_column(ForeignKey("question_table.id"))
    question : Mapped["Question"] = relationship('Question', back_populates='test_case')

