from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Habit(Base):
    __tablename__ = "habits"

    habit_id = Column(String, primary_key=True)
    device_id = Column(String, nullable=False)

    habit_name = Column(String, nullable=False)
    archetype = Column(String, nullable=False)

    created_at = Column(DateTime, server_default=func.now())