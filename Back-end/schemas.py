from pydantic import BaseModel
from typing import List, Optional


class SubjectBase(BaseModel):
    name: str


class SubjectCreate(SubjectBase):
    pass


class Subject(SubjectBase):
    id: int

    class Config:
        orm_mode = True
