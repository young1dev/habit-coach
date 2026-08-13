from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth_dependencies import get_current_user
from app.models import Habit, HabitLog, PredictionLog, User
from app.schemas import StatsResponse

router = APIRouter(prefix="/api/v1/stats", tags=["Stats"])


def get_week_key(day: date, today: date) -> int:
    delta = today - day
    return delta.days // 7


def build_current_streak(habit_logs: list[HabitLog], today: date) -> int:
    if not habit_logs:
        return 0

    logs_by_date = {log.date.date(): log for log in habit_logs}
    streak = 0
    check_date = today

    while True:
        log = logs_by_date.get(check_date)
        if not log or log.completed is not True:
            break
        streak += 1
        check_date -= timedelta(days=1)

    return streak


def build_longest_streak(habit_logs: list[HabitLog]) -> int:
    if not habit_logs:
        return 0

    ordered = sorted(habit_logs, key=lambda log: log.date)
    longest = 0
    current = 0
    prev_date = None

    for log in ordered:
        if log.completed is not True:
            current = 0
            prev_date = None
            continue

        if prev_date is None or log.date.date() - prev_date == timedelta(days=1):
            current += 1
        else:
            current = 1

        prev_date = log.date.date()
        longest = max(longest, current)

    return longest


def normalize_prediction(prediction: float) -> int:
    return 1 if prediction >= 0.5 else 0


@router.get("/", response_model=StatsResponse)
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    logs = (
        db.query(HabitLog, Habit, PredictionLog)
        .join(Habit, Habit.habit_id == HabitLog.habit_id)
        .join(PredictionLog, PredictionLog.prediction_id == HabitLog.prediction_log_id)
        .filter(Habit.device_id == current_user.device_id)
        .order_by(HabitLog.date.desc())
        .all()
    )

    habit_logs_by_habit: dict[str, list[HabitLog]] = defaultdict(list)
    # accumulate sums/counts per day so we can average across habits
    # separate prediction counts (all predictions) from completed counts (only settled outcomes)
    daily_index: dict[date, dict[str, float]] = {}
    archetype_completions: dict[str, dict[str, int]] = defaultdict(
        lambda: {"completed": 0, "total": 0}
    )
    weekly_buckets: dict[int, dict[str, int]] = defaultdict(
        lambda: {"completed": 0, "total": 0}
    )

    completed_count = 0
    scored_count = 0
    sleep_total = 0.0
    workload_total = 0.0
    sleep_count = 0
    workload_count = 0
    total_logs = 0
    weekly_total = 0
    weekly_completed = 0
    monthly_total = 0
    monthly_completed = 0

    for habit_log, habit, prediction_log in logs:
        log_date = habit_log.date.date()
        habit_logs_by_habit[habit.habit_id].append(habit_log)

        # aggregate per-day sums and counts so multi-habit days average
        if log_date not in daily_index:
            daily_index[log_date] = {
                "date": log_date.isoformat(),
                "prob_sum": 0.0,
                "prob_count": 0,
                "completed_sum": 0.0,
                "completed_count": 0,
            }
        entry = daily_index[log_date]
        # include every prediction in the probability average
        entry["prob_sum"] += float(prediction_log.probability or 0.0)
        entry["prob_count"] += 1
        # only include settled outcomes in completion averages
        if habit_log.completed is not None:
            entry["completed_sum"] += 1.0 if habit_log.completed else 0.0
            entry["completed_count"] += 1

        if habit_log.completed is not None:
            scored_count += 1
            # defensive: ensure prediction is a float (could be None)
            pred_val = float(prediction_log.prediction or 0.0)
            prediction_outcome = normalize_prediction(pred_val)
            actual_outcome = 1 if habit_log.completed else 0
            if prediction_outcome == actual_outcome:
                completed_count += 1

        # track completions and totals per archetype for a meaningful pie
        # only count settled outcomes
        if habit_log.completed is not None:
            archetype_completions[habit.archetype]["total"] += 1
            if habit_log.completed:
                archetype_completions[habit.archetype]["completed"] += 1

        if log_date >= today - timedelta(days=6):
            # only count settled outcomes toward weekly rate
            if habit_log.completed is not None:
                weekly_total += 1
                if habit_log.completed:
                    weekly_completed += 1

        if log_date >= today - timedelta(days=29):
            # only count settled outcomes toward monthly rate
            if habit_log.completed is not None:
                monthly_total += 1
                if habit_log.completed:
                    monthly_completed += 1

        # aggregate sleep/workload only when provided
        if habit_log.sleep_hours is not None:
            sleep_total += float(habit_log.sleep_hours)
            sleep_count += 1
        if habit_log.workload_hours is not None:
            workload_total += float(habit_log.workload_hours)
            workload_count += 1
        total_logs += 1

        week_key = get_week_key(log_date, today)
        bucket = weekly_buckets[week_key]
        # weekly buckets count only settled outcomes
        if habit_log.completed is not None:
            bucket["total"] += 1
            if habit_log.completed:
                bucket["completed"] += 1

    # build 14-day series with averaged probabilities and completion rates
    daily = []
    for offset in range(13, -1, -1):
        day = today - timedelta(days=offset)
        raw = daily_index.get(day)
        if raw is None:
            daily.append({"date": day.isoformat(), "probability": 0.0, "completed": 0})
        else:
            prob_count = raw.get("prob_count", 0)
            completed_count_day = raw.get("completed_count", 0)
            avg_prob = (raw.get("prob_sum", 0.0) / prob_count) if prob_count else 0.0
            avg_completed = (
                (raw.get("completed_sum", 0.0) / completed_count_day)
                if completed_count_day
                else 0.0
            )
            daily.append(
                {
                    "date": raw.get("date"),
                    "probability": avg_prob,
                    "completed": avg_completed,
                }
            )

    weekly = []
    for index in range(5, -1, -1):
        bucket = weekly_buckets.get(index, {"completed": 0, "total": 0})
        rate = bucket["completed"] / bucket["total"] if bucket["total"] else 0.0
        weekly.append({"week": f"W{6 - index}", "rate": rate})

    current_streak = 0
    longest_streak = 0
    for habit_id, habit_logs in habit_logs_by_habit.items():
        current_streak = max(current_streak, build_current_streak(habit_logs, today))
        longest_streak = max(longest_streak, build_longest_streak(habit_logs))

    average_sleep = sleep_total / sleep_count if sleep_count else 0.0
    average_workload = workload_total / workload_count if workload_count else 0.0
    prediction_accuracy = completed_count / scored_count if scored_count else 0.0

    # convert archetype completions to a pie-friendly list (completed counts)
    archetype_split = [
        {"name": name, "value": stats.get("completed", 0)}
        for name, stats in archetype_completions.items()
    ]

    return StatsResponse(
        weeklyCompletionRate=weekly_completed / weekly_total if weekly_total else 0.0,
        monthlyCompletionRate=(
            monthly_completed / monthly_total if monthly_total else 0.0
        ),
        currentStreak=current_streak,
        longestStreak=longest_streak,
        averageSleep=average_sleep,
        averageWorkload=average_workload,
        predictionAccuracy=prediction_accuracy,
        daily=daily,
        weekly=weekly,
        archetypeSplit=archetype_split,
    )
