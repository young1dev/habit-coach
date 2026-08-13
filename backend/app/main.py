from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routes import habits, prediction, habitlog, stats, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://habit-coach-beige.vercel.app",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(prediction.router)
app.include_router(habitlog.router)
app.include_router(stats.router)
Base.metadata.create_all(bind=engine)
