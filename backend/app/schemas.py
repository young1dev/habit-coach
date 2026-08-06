from pydantic import BaseModel


class HabitCreate(BaseModel):
    device_id: str
    habit_name: str
    archetype: str
    
class HabitResponse(BaseModel):
    habit_id: str
    device_id: str
    habit_name: str
    archetype: str

class PredictionRequest(BaseModel):
    habit_id: str
    sleep_hours: float
    mood_score: int
    energy_level: int
    meals_eaten: int
    workload_hours: float
    habit_duration_minutes: float
    interruptions: int
    medication: bool
    
class CoachResponse(BaseModel):
    summary: str
    risks: list[str]
    recommendations: list[str]
    motivation: str

class PredictionResponse(BaseModel):
    probability: float
    prediction: int
    coach: CoachResponse