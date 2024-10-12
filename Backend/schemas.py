from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    year: int

class ProfileCreate(ProfileBase):
    password: str

class Profile(ProfileBase):
    id: int

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    subject_name: str

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    subject_id: int

    class Config:
        from_attributes = True

class TopicBase(BaseModel):
    name: str

class TopicCreate(TopicBase):
    subject_id: int

class Topic(TopicBase):
    id: int

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    text: str

class QuestionCreate(QuestionBase):
    topic_id: int

class Question(QuestionBase):
    id: int

    class Config:
        from_attributes = True

class AnswerBase(BaseModel):
    text: str

class AnswerCreate(AnswerBase):
    question_id: int

class Answer(AnswerBase):
    id: int

    class Config:
        from_attributes = True