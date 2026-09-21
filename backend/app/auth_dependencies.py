import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.models import User
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from app.database import get_db

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")

ALGORITHM = "HS256"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token",
        )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
            )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token",
            )

    except JWTError as exc:
        raise HTTPException(
            status_code=401,
            detail="Authentication expired or invalid",
        ) from exc

    user = db.query(User).filter(User.user_id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user
