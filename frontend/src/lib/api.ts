import type {
  Archetype,
  CheckinMetrics,
  Habit,
  HistoryEntry,
  PredictionResponse,
  StatsResponse,
} from "./types";

/**
 * Mock API layer. Every function mirrors a future FastAPI endpoint so the
 * transport can be swapped for `fetch(`${API_BASE_URL}${path}`)` with no
 * changes to the UI or the React Query hooks.
 */
export const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
export const ENDPOINTS = {
  habits: `${API_BASE_URL}/habits`,
  predict: `${API_BASE_URL}/predict`,
  logOutcome: `${API_BASE_URL}/habitlogs`,
  history: `${API_BASE_URL}/habitlogs`,
  stats: `${API_BASE_URL}/stats`,
} as const;

const getDeviceId = () => {
  if (typeof window === "undefined") return "device_123";
  return window.localStorage.getItem("deviceId") || "device_123";
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);

let habits: Habit[] = [
  {
    id: "h_1",
    name: "Deep work — 90 minutes",
    archetype: "Deep Worker",
    streak: 14,
    lastPrediction: 0.82,
    completionRate: 0.86,
    createdAt: iso(64),
  },
  {
    id: "h_2",
    name: "Morning run",
    archetype: "Early Bird",
    streak: 6,
    lastPrediction: 0.64,
    completionRate: 0.71,
    createdAt: iso(41),
  },
  {
    id: "h_3",
    name: "Read 20 pages",
    archetype: "Student",
    streak: 23,
    lastPrediction: 0.91,
    completionRate: 0.93,
    createdAt: iso(120),
  },
  {
    id: "h_4",
    name: "Evening stretch & recovery",
    archetype: "Recovery",
    streak: 2,
    lastPrediction: 0.47,
    completionRate: 0.52,
    createdAt: iso(17),
  },
];

let history: HistoryEntry[] = Array.from({ length: 42 }, (_, i) => {
  const habit = habits[i % habits.length]!;
  const prediction = 0.4 + ((i * 37) % 55) / 100;
  return {
    id: `log_${i}`,
    date: iso(i),
    habitId: habit.id,
    habitName: habit.name,
    prediction: Math.min(0.98, Number(prediction.toFixed(2))),
    completed: prediction > 0.55,
    streak: Math.max(0, habit.streak - Math.floor(i / 2)),
  };
});

export async function getHabits(): Promise<Habit[]> {
  const deviceId = getDeviceId();
  const data = await fetch(`${ENDPOINTS.habits}/${deviceId}`);

  if (!data.ok) throw new Error("Failed to fetch habits");

  const res = await data.json();
  return res as Habit[];
}

export async function createHabit(input: {
  name: string;
  archetype: Archetype;
}): Promise<Habit> {
  const deviceId = getDeviceId();
  const payload = {
    device_id: deviceId,
    habit_name: input.name,
    archetype: input.archetype,
  };
  const response = await fetch(ENDPOINTS.habits, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create habit");
  }

  const data = await response.json();
  return data as Habit;
}

export async function updateHabit(
  id: string,
  input: { name: string; archetype: Archetype },
): Promise<Habit> {
  const payload = {
    habit_id: id,
    habit_name: input.name,
    archetype: input.archetype,
  }
  console.log("Here", JSON.stringify(payload))

  const response = await fetch(`${ENDPOINTS.habits}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to update habit");
  }
  const data = await response.json();
  return data as Habit;
}

export async function deleteHabit(id: string): Promise<{ id: string }> {
  const response = await fetch(`${ENDPOINTS.habits}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }
  const data = await response.json();
  return data as { id: string };
}

export async function predict(metrics: CheckinMetrics): Promise<PredictionResponse> {
  const payload = {
    habit_id: metrics.habitId,
    sleep_hours: metrics.sleepHours,
    mood_score: metrics.moodScore,
    energy_level: metrics.energyLevel,
    meals_eaten: metrics.mealsEaten,
    workload_hours: metrics.workloadHours,
    habit_duration_minutes: metrics.habitDurationMinutes,
    interruptions: metrics.interruptions,
    medication: metrics.medication,
  };
  const response = await fetch(ENDPOINTS.predict, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate prediction");
  }

  const data = await response.json();

  return data as PredictionResponse;
}

export async function logOutcome(input: {
  logId: string;
  completed: boolean;
}): Promise<{ completed: boolean | null }> {
  const payload = {
    completed: input.completed,
  };
  const res = await fetch(`${ENDPOINTS.logOutcome}/${input.logId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to log outcome");
  }

  const data = await res.json();
  return data as { completed: boolean | null };
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const deviceId = getDeviceId();
  const data = await fetch(`${ENDPOINTS.history}/history/${deviceId}`);

  if (!data.ok) throw new Error("Failed to fetch history");
  const history = await data.json();
  return history as HistoryEntry[];
}

export async function getStats(): Promise<StatsResponse> {
  const deviceId = getDeviceId();
  const response = await fetch(`${ENDPOINTS.stats}/${deviceId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  const data = await response.json();
  return data as StatsResponse;
}
