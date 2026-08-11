from sqlalchemy import Column, Date, String, Integer, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Habit(Base):
    __tablename__ = "habits"

    habit_id = Column(String, primary_key=True)
    device_id = Column(String, nullable=False)

    habit_name = Column(String, nullable=False)
    archetype = Column(String, nullable=False)
    completion_rate = Column(Float, nullable=False, default=0.0)

    created_at = Column(DateTime, server_default=func.now())
    
class HabitLog(Base):
    __tablename__ = "habit_logs"

    log_id = Column(String, primary_key=True)

    habit_id = Column(String, ForeignKey("habits.habit_id"), nullable=False)
    prediction_log_id = Column(
        String,
        ForeignKey("prediction_logs.prediction_id"),
        nullable=False,
    )
    date = Column(DateTime, server_default=func.now(), nullable=False)

    sleep_hours = Column(Float, nullable=False)
    mood_score = Column(Integer, nullable=False)
    energy_level = Column(Integer, nullable=False)
    meals_eaten = Column(Integer, nullable=False)
    workload_hours = Column(Float, nullable=False)

    habit_duration_minutes = Column(Integer, nullable=False)
    interruptions = Column(Integer, nullable=False)
    medication = Column(Boolean, nullable=False)

    streak = Column(Integer, nullable=False)
    completed_yesterday = Column(Boolean, nullable=False)

    completed = Column(Boolean, nullable=True)
    
class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    prediction_id = Column(String, primary_key=True)

    habit_id = Column(
        String,
        ForeignKey("habits.habit_id"),
        nullable=False,
    )

    date = Column(DateTime, server_default=func.now(), nullable=False)

    probability = Column(Float, nullable=True)
    prediction = Column(Float, nullable=False)