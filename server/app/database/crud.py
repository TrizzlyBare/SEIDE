from sqlalchemy.orm import Session
from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username, email=user.email, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_profiles(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Profile).offset(skip).limit(limit).all()


def create_profile(db: Session, profile: schemas.ProfileCreate):
    hashed_password = pwd_context.hash(profile.password)
    db_profile = models.Profile(
        username=profile.username,
        email=profile.email,
        first_name=profile.first_name,
        last_name=profile.last_name,
        year=profile.year,
        hashed_password=hashed_password,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_subjects(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Subject).offset(skip).limit(limit).all()


def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


def get_topics(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Topic).offset(skip).limit(limit).all()


def create_topic(db: Session, topic: schemas.TopicCreate):
    db_topic = models.Topic(name=topic.name, subject_id=topic.subject_id)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic


def get_questions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Question).offset(skip).limit(limit).all()


def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(text=question.text, topic_id=question.topic_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def get_answers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Answer).offset(skip).limit(limit).all()


def create_answer(db: Session, answer: schemas.AnswerCreate):
    db_answer = models.Answer(text=answer.text, question_id=answer.question_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer