
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  device_id: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  device_id: string;
}

export type Archetype =
  | "Student"
  | "Professional"
  | "Deep Worker"
  | "Early Bird"
  | "Night Owl"
  | "Recovery"
  | "Custom";

export const ARCHETYPES: Archetype[] = [
  "Student",
  "Professional",
  "Deep Worker",
  "Early Bird",
  "Night Owl",
  "Recovery",
  "Custom",
];

export interface Habit {
  id: string;
  name: string;
  archetype: Archetype;
  streak: number;
  lastPrediction: number;
  completionRate: number;
  createdAt: string;
}

export interface CoachAdvice {
  summary: string;
  risks: string[];
  recommendations: string[];
  motivation: string;
}

export interface PredictionResponse {
  logId: string;
  predictionId: string;
  probability: number;
  prediction: number;
  coach: CoachAdvice;
}

export interface CheckinMetrics {
  habitId: string;
  sleepHours: number;
  moodScore: number;
  energyLevel: number;
  mealsEaten: number;
  workloadHours: number;
  habitDurationMinutes: number;
  interruptions: number;
  medication: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  habitId: string;
  habitName: string;
  prediction: number;
  completed: boolean | null;
  streak: number;
}

export interface StatsResponse {
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageSleep: number;
  averageWorkload: number;
  predictionAccuracy: number;
  daily: { date: string; probability: number; completed: number }[];
  weekly: { week: string; rate: number }[];
  archetypeSplit: { name: string; value: number }[];
}

export type RiskLevel = "Low" | "Medium" | "High";

export function riskLevelFor(probability: number): RiskLevel {
  if (probability >= 0.75) return "Low";
  if (probability >= 0.5) return "Medium";
  return "High";
}
