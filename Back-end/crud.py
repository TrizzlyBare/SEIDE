from sqlalchemy.orm import Session
from . import models, schemas


def get_subject_by_name(db: Session, name: str):
    return db.query(models.Subject).filter(models.Subject.name == name).first()


def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


def get_subjects(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Subject).offset(skip).limit(limit).all()
