from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models import Base
from app.database import SessionLocal
from app.routes import habits

app = FastAPI()

app.include_router(habits.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Habit Predictor Backend Running"}
