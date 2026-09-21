from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import (
    RegisterResponse,
    RegisterRequest,
    LoginRequest,
    LoginResponse,
)
import os
from pathlib import Path
from dotenv import load_dotenv

from app.auth_dependencies import get_current_user
import uuid
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from jose import jwt
from datetime import datetime, timedelta

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


@router.post("/register", response_model=RegisterResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_username = db.query(User).filter(User.username == request.username).first()

    if existing_username:
        raise HTTPException(
            status_code=409,
            detail="Username already exists",
        )

    existing_email = db.query(User).filter(User.email == request.email).first()

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email already exists",
        )

    user_id = str(uuid.uuid4())
    device_id = str(uuid.uuid4())

    new_user = User(
        user_id=user_id,
        username=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
        device_id=device_id,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "user_id": new_user.user_id,
        "username": new_user.username,
        "email": new_user.email,
        "device_id": new_user.device_id,
    }


def create_access_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": user_id,
        "type": "access",
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == request.username).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    access_token = create_access_token(user.user_id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "username": user.username,
        "device_id": user.device_id,
    }


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "device_id": current_user.device_id,
    }
