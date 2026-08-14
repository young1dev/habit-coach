import type {
  Archetype,
  CheckinMetrics,
  Habit,
  HistoryEntry,
  PredictionResponse,
  StatsResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse
} from "./types";

import { getToken } from "./auth";

/**
 * Mock API layer. Every function mirrors a future FastAPI endpoint so the
 * transport can be swapped for `fetch(`${API_BASE_URL}${path}`)` with no
 * changes to the UI or the React Query hooks.
 */
export const API_BASE_URL = "https://habit-coach-api.onrender.com/api/v1";
export const ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`, 
  habits: `${API_BASE_URL}/habits`,
  predict: `${API_BASE_URL}/predict`,
  logOutcome: `${API_BASE_URL}/habitlogs`,
  history: `${API_BASE_URL}/habitlogs`,
  stats: `${API_BASE_URL}/stats`,
} as const;


export async function registerUser(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch(
    `${ENDPOINTS.register}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

export async function loginUser(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(
    `${ENDPOINTS.login}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.detail || "Login failed");
  }

  return response.json();
}

const getDeviceId = () => {
  if (typeof window === "undefined") return "device_123";
  return window.localStorage.getItem("deviceId") || "device_123";
};


const token = getToken()

export async function getHabits(): Promise<Habit[]> {
  const deviceId = getDeviceId();
  const data = await fetch(`${ENDPOINTS.habits}/`, {
    method: `GET`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

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
      "Authorization": `Bearer ${token}`,
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
  const response = await fetch(`${ENDPOINTS.habits}/${id}`, {
    method: "PATCH",
    headers: {
      "Authentication": `Bearer ${token}`,
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
  const response = await fetch(`${ENDPOINTS.predict}/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
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
      "Authorization": `Bearer ${token}`,
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
  const data = await fetch(`${ENDPOINTS.history}/history/`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  if (!data.ok) throw new Error("Failed to fetch history");
  const history = await data.json();
  return history as HistoryEntry[];
}

export async function getStats(): Promise<StatsResponse> {
  const deviceId = getDeviceId();
  const response = await fetch(`${ENDPOINTS.stats}/`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  const data = await response.json();
  return data as StatsResponse;
}
