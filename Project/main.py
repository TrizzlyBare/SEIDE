from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pathlib import Path

from database import SessionLocal, User, engine

app = FastAPI()

# Allow CORS for all origins (you can restrict this in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the 'static' directory to serve CSS and JS files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to read HTML files
def read_html_file(file_path: str) -> str:
    html_file = Path(file_path)
    if not html_file.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return html_file.read_text()

# Route to serve the login page
@app.get("/", response_class=HTMLResponse)
async def serve_login():
    return HTMLResponse(content=read_html_file("templates/login.html"))

# Route to serve the dashboard page
@app.get("/dashboard", response_class=HTMLResponse)
async def serve_dashboard():
    return HTMLResponse(content=read_html_file("templates/dashboard.html"))

# Serve the home (IDE) page
@app.get("/home", response_class=HTMLResponse)
async def serve_index():
    return HTMLResponse(content=read_html_file("templates/index.html"))

# Example route to create a user
@app.post("/users/")
async def create_user(username: str, email: str, db: Session = Depends(get_db)):
    db_user = User(username=username, email=email, hashed_password="fakehashedpassword")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)