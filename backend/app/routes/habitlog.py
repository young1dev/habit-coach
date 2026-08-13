from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Habit, HabitLog, PredictionLog, User
from app.auth_dependencies import get_current_user
from app.schemas import (
    HabitLogHistoryItem,
    HabitLogUpdateRequest,
    HabitLogUpdateResponse,
    PendingHabitLogRequest,
)

router = APIRouter(
    prefix="/api/v1/habitlogs",
    tags=["Habit Logs"],
)


@router.patch("/{log_id}", response_model=HabitLogUpdateResponse)
def update_log(
    log_id: str,
    request: HabitLogUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(HabitLog)
        .filter(HabitLog.log_id == log_id)
        .first()
    )

    if log is None:
        raise HTTPException(
            status_code=404,
            detail="Habit log not found",
        )

    habit = (
        db.query(Habit)
        .filter(
            Habit.habit_id == log.habit_id,
            Habit.device_id == current_user.device_id,
        )
        .first()
    )

    if habit is None:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this habit",
        )

    log.completed = request.completed
    
    def recompute_streaks(habit_id: str):
        habit_logs = (
            db.query(HabitLog)
            .filter(HabitLog.habit_id == habit_id)
            .order_by(HabitLog.date.asc())
            .all()
        )

        current = 0

        for hl in habit_logs:
            if hl.completed is True:
                current += 1
                hl.streak = current
            elif hl.completed is False:
                current = 0
                hl.streak = 0
            else:
                hl.streak = current

    recompute_streaks(log.habit_id)

    db.commit()
    db.refresh(log)

    return log
    
    
@router.get(
    "/history/",
    response_model=list[HabitLogHistoryItem],
)
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(HabitLog, Habit, PredictionLog)
        .join(Habit, Habit.habit_id == HabitLog.habit_id)
        .join(
            PredictionLog,
            PredictionLog.prediction_id == HabitLog.prediction_log_id,
        )
        .filter(Habit.device_id == current_user.device_id)
        .order_by(HabitLog.date.desc())
        .all()
    )

    history = []

    for habit_log, habit, prediction_log in logs:
        history.append(
            {
                "id": habit_log.log_id,
                "date": habit_log.date,
                "habitId": habit.habit_id,
                "habitName": habit.habit_name,
                "prediction": float(prediction_log.probability or 0.0),
                "completed": habit_log.completed,
                "streak": habit_log.streak,
            }
        )

    return history


@router.get("/pending/", response_model=list[HabitLogHistoryItem])
def get_pending_logs(
    request: PendingHabitLogRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    habit = (
        db.query(Habit)
        .filter(Habit.habit_id == request.habit_id, Habit.device_id == current_user.device_id)
        .first()
    )
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    pending_logs = (
        db.query(HabitLog, Habit, PredictionLog)
        .join(Habit, Habit.habit_id == HabitLog.habit_id)
        .join(PredictionLog, PredictionLog.prediction_id == HabitLog.prediction_log_id)
        .filter(
            Habit.device_id == current_user.device_id,
            HabitLog.habit_id == request.habit_id,
            HabitLog.completed.is_(None),
        )
        .order_by(HabitLog.date.desc())
        .all()
    )

    return [
        {
            "id": log.log_id,
            "date": log.date,
            "habitId": habit.habit_id,
            "habitName": habit.habit_name,
            "prediction": float(prediction.probability or 0.0),
            "completed": log.completed,
            "streak": log.streak,
        }
        for log, habit, prediction in pending_logs
    ]
