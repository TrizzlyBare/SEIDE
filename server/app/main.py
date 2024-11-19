from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.routers import authentication, home, subjects, questions
from app.models.dashboard.db_config import get_db, engine as dashboard_engine
from app.models.dashboard.models import Base as DashboardBase
from app.models.authentication.au_database import engine as auth_engine
from app.models.authentication.models import Base as AuthBase
from app.models.authentication import services, schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Explicitly create tables for both database engines
    AuthBase.metadata.create_all(bind=auth_engine, checkfirst=True)
    DashboardBase.metadata.create_all(bind=dashboard_engine, checkfirst=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/users/")
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await services.create_user(user, db)

app.include_router(authentication.router)
app.include_router(home.router)
app.include_router(subjects.router)
app.include_router(questions.router)