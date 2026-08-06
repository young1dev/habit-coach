from fastapi import APIRouter, HTTPException, Depends
import uuid
from app.database import get_db
from app.schemas import HabitCreate, HabitResponse
from app.models import Habit
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/v1/habits",
    tags=["Habits"],
)


@router.post("/", response_model=HabitResponse)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):

    new_habit = Habit(
        habit_id=str(uuid.uuid4()),
        device_id=habit.device_id,
        habit_name=habit.habit_name,
        archetype=habit.archetype,
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return new_habit


@router.get("/{device_id}", response_model=list[HabitResponse])
def get_habits(device_id: str, db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.device_id == device_id).all()
    return habits


@router.delete("/{habit_id}")
def delete_habits(habit_id: str, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habit_id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()
    raise HTTPException(status_code=200, detail="Habit deleted successfully.")