from pydantic import BaseModel
from datetime import datetime


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class RegisterResponse(BaseModel):
    user_id: str
    username: str
    email: str
    device_id: str

class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    username: str
    device_id: str

class HabitCreate(BaseModel):
    habit_name: str
    archetype: str


class HabitCreateResponse(BaseModel):
    id: str
    name: str
    archetype: str
    streak: int
    lastPrediction: float | None
    completionRate: float
    createdAt: str


class HabitUpdate(BaseModel):
    habit_id: str
    habit_name: str
    archetype: str


class HabitResponse(BaseModel):
    id: str
    name: str
    archetype: str
    streak: int
    lastPrediction: float | None
    completionRate: float
    createdAt: str


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
    logId: str
    predictionId: str
    probability: float
    prediction: int
    coach: CoachResponse


class HabitLogUpdateRequest(BaseModel):
    completed: bool


class HabitLogUpdateResponse(BaseModel):
    completed: bool | None


class HabitLogHistoryItem(BaseModel):
    id: str
    date: datetime
    habitId: str
    habitName: str
    prediction: float
    completed: bool | None
    streak: int


class HabitLogHistoryResponse(BaseModel):
    history: list[HabitLogHistoryItem]


class PendingHabitLogRequest(BaseModel):
    habit_id: str

class StatsDailyItem(BaseModel):
    date: str
    probability: float
    completed: float


class StatsWeeklyItem(BaseModel):
    week: str
    rate: float


class StatsArchetypeSplitItem(BaseModel):
    name: str
    value: int


class StatsResponse(BaseModel):
    weeklyCompletionRate: float
    monthlyCompletionRate: float
    currentStreak: int
    longestStreak: int
    averageSleep: float
    averageWorkload: float
    predictionAccuracy: float
    daily: list[StatsDailyItem]
    weekly: list[StatsWeeklyItem]
    archetypeSplit: list[StatsArchetypeSplitItem]
