from fastapi import APIRouter, HTTPException, Depends
import uuid
from app.database import get_db
from app.schemas import HabitCreate, HabitCreateResponse, HabitResponse, HabitUpdate
from app.models import Habit, HabitLog, PredictionLog, User
from sqlalchemy.orm import Session
from app.auth_dependencies import get_current_user
from app.routes.prediction import calculate_streak

router = APIRouter(
    prefix="/api/v1/habits",
    tags=["Habits"],
)


def habit_to_response(habit: Habit, db: Session) -> dict:
    streak = calculate_streak(db, habit.habit_id)
    last_prediction = (
        db.query(PredictionLog)
        .filter(PredictionLog.habit_id == habit.habit_id)
        .order_by(PredictionLog.date.desc())
        .first()
    )
    return {
        "id": habit.habit_id,
        "name": habit.habit_name,
        "archetype": habit.archetype,
        "createdAt": habit.created_at.isoformat(),
        "streak": streak,
        "completionRate": calculate_completion_rate(db, habit.habit_id),
        "lastPrediction": (
            float(last_prediction.probability) if last_prediction else None
        ),
    }


@router.post("/", response_model=HabitCreateResponse)
def create_habit(habit: HabitCreate, current_user: User = Depends(get_current_user),
 db: Session = Depends(get_db)):
    new_habit = Habit(
        habit_id=str(uuid.uuid4()),
        device_id=current_user.device_id,
        habit_name=habit.habit_name,
        archetype=habit.archetype,
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return habit_to_response(new_habit, db)


@router.get("/", response_model=list[HabitResponse])
def get_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.device_id == current_user.device_id).all()

    habit_data = []

    for habit in habits:
        streak = calculate_streak(db, habit.habit_id)

        last_prediction = (
            db.query(PredictionLog)
            .filter(PredictionLog.habit_id == habit.habit_id)
            .order_by(PredictionLog.date.desc())
            .first()
        )

        habit_data.append(
            {
                "id": habit.habit_id,
                "name": habit.habit_name,
                "archetype": habit.archetype,
                "createdAt": habit.created_at.isoformat(),
                "streak": streak,
                "completionRate": calculate_completion_rate(db, habit.habit_id),
                "lastPrediction": (
                    last_prediction.prediction if last_prediction else None
                ),
            }
        )

    return habit_data


@router.patch("/{habit_id}", response_model=HabitCreateResponse)
def update_habit(habit_id: str, habit: HabitUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_habit = db.query(Habit).filter(Habit.habit_id == habit_id, Habit.device_id == current_user.device_id,
).first()
    if not existing_habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    existing_habit.habit_name = habit.habit_name
    existing_habit.archetype = habit.archetype

    db.commit()
    db.refresh(existing_habit)

    return habit_to_response(existing_habit, db)


@router.delete("/{habit_id}")
def delete_habits(habit_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habit_id == habit_id, Habit.device_id == current_user.device_id,
).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()
    raise HTTPException(status_code=200, detail="Habit deleted successfully.")


def calculate_completion_rate(db, habit_id: str) -> float:
    # Only consider logs with an explicit outcome (exclude pending logs)
    total_logs = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.completed.isnot(None))
        .count()
    )
    completed_logs = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.completed == True)
        .count()
    )
    if total_logs == 0:
        return 0.0
    return completed_logs / total_logs
