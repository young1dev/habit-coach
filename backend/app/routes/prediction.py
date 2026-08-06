from datetime import date as Date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Habit
from app.schemas import CoachResponse, PredictionRequest, PredictionResponse
from app.ml_engine import predict
from backend.app.llm_coach import generate_coach_response

router = APIRouter(prefix="/api/v1/predict", tags=["Prediction"])


@router.post("/", response_model=PredictionResponse)
def predict_habit_completion(request: PredictionRequest, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habit_id == request.habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    streak = calculate_streak(db, habit.habit_id)

    completed_yesterday = completed_yesterday(
        db,
        habit.habit_id,
    )
    features = get_features(request, streak, completed_yesterday)
    probability = predict(features)
    prediction = 1 if probability >= 0.5 else 0

    result = predict(
        features,
        model_name=habit.archetype,
    )

    coach = generate_coach_response(
    probability=result["probability"],
    habit_name=habit.habit_name,
    archetype=habit.archetype,
    features=features,
    )
    
    return PredictionResponse(
        probability=probability, prediction=prediction, coach=coach
    )


def get_features(
    request: PredictionRequest, streak: int, completed_yesterday: int
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
        "Completed_Yesterday": completed_yesterday,
    }
