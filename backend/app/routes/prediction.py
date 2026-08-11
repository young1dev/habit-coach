from datetime import date as Date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Habit, HabitLog, PredictionLog
from app.schemas import CoachResponse, PredictionRequest, PredictionResponse
from app.ml_engine import predict
from app.llm_coach import generate_coach_response
import uuid

router = APIRouter(prefix="/api/v1/predict", tags=["Prediction"])


@router.post("/", response_model=PredictionResponse)
def predict_habit_completion(request: PredictionRequest, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habit_id == request.habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    streak = calculate_streak(db, habit.habit_id)

    completed_yesterdays = completed_yesterday(
        db,
        habit.habit_id,
    )

    features = get_features(request, streak, completed_yesterdays)
    result = predict(features)

    probability = result["probability"]
    prediction = result["prediction"]

    prediction_log = PredictionLog(
        prediction_id=str(uuid.uuid4()),
        habit_id=request.habit_id,
        probability=probability,
        prediction=prediction,
    )

    db.add(prediction_log)
    db.commit()
    db.refresh(prediction_log)

    habit_log = HabitLog(
        log_id=str(uuid.uuid4()),
        habit_id=request.habit_id,
        prediction_log_id=prediction_log.prediction_id,
        sleep_hours=request.sleep_hours,
        mood_score=request.mood_score,
        energy_level=request.energy_level,
        meals_eaten=request.meals_eaten,
        workload_hours=request.workload_hours,
        habit_duration_minutes=request.habit_duration_minutes,
        interruptions=request.interruptions,
        medication=request.medication,
        streak=streak,
        completed_yesterday=completed_yesterdays,
        completed=None,
    )
    db.add(habit_log)
    db.commit()
    db.refresh(habit_log)

    coach = generate_coach_response(
        probability=result["probability"],
        habit_name=habit.habit_name,
        archetype=habit.archetype,
        features=features,
    )

    return PredictionResponse(
        logId=habit_log.log_id,
        predictionId=prediction_log.prediction_id,
        probability=probability,
        prediction=prediction,
        coach=coach,
    )


def calculate_streak(db, habit_id: str) -> int:
    habit_logs = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id)
        .order_by(HabitLog.date.desc())
        .all()
    )
    streak = 0
    # Determine whether we should consider today as part of the streak.
    # If the most recent log is for today and explicitly completed==True,
    # start checking from today; otherwise start from yesterday.
    if (
        habit_logs
        and habit_logs[0].date.date() == Date.today()
        and habit_logs[0].completed is True
    ):
        expected_date = Date.today()
    else:
        expected_date = Date.today() - timedelta(days=1)

    for log in habit_logs:
        # only consider logs that fall on the expected date
        if log.date.date() != expected_date:
            break
        # only treat an entry as completed when completed is explicitly True
        if log.completed is not True:
            break
        streak += 1
        expected_date -= timedelta(days=1)
    return streak


def completed_yesterday(db, habit_id: str):
    yesterday = Date.today() - timedelta(days=1)
    log = (
        db.query(HabitLog)
        .filter(
            HabitLog.habit_id == habit_id,
            HabitLog.date >= yesterday,
            HabitLog.date < yesterday + timedelta(days=1),
        )
        .first()
    )
    return 1 if log and log.completed else 0


def get_features(
    request: PredictionRequest, streak: int, completed_yesterdays: int
) -> dict:
    return {
        "Date": Date.today(),
        "Sleep_Hours": request.sleep_hours,
        "Mood_Score": request.mood_score,
        "Energy_Level": request.energy_level,
        "Meals_Eaten": request.meals_eaten,
        "Workload_Hours": request.workload_hours,
        "Habit_Duration_Minutes": request.habit_duration_minutes,
        "Interruptions": request.interruptions,
        "Medication": request.medication,
        "Streak": streak,
        "Completed_Yesterday": completed_yesterdays,
    }
