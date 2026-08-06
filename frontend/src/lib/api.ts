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
export const API_BASE_URL = "/api/v1";

export const ENDPOINTS = {
  habits: `${API_BASE_URL}/habits`,
  predict: `${API_BASE_URL}/predict`,
  logOutcome: `${API_BASE_URL}/log-outcome`,
  history: `${API_BASE_URL}/history`,
  stats: `${API_BASE_URL}/stats`,
} as const;

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
  await delay(400);
  return [...habits];
}

export async function createHabit(input: {
  name: string;
  archetype: Archetype;
}): Promise<Habit> {
  await delay(500);
  const habit: Habit = {
    id: `h_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    archetype: input.archetype,
    streak: 0,
    lastPrediction: 0,
    completionRate: 0,
    createdAt: iso(0),
  };
  habits = [habit, ...habits];
  return habit;
}

export async function updateHabit(
  id: string,
  input: { name: string; archetype: Archetype },
): Promise<Habit> {
  await delay(400);
  habits = habits.map((h) => (h.id === id ? { ...h, ...input } : h));
  const updated = habits.find((h) => h.id === id);
  if (!updated) throw new Error("Habit not found");
  return updated;
}

export async function deleteHabit(id: string): Promise<{ id: string }> {
  await delay(400);
  habits = habits.filter((h) => h.id !== id);
  history = history.filter((h) => h.habitId !== id);
  return { id };
}

export async function predict(metrics: CheckinMetrics): Promise<PredictionResponse> {
  await delay(1400);

  const score =
    0.12 * Math.min(metrics.sleepHours / 8, 1) * 3 +
    0.1 * (metrics.moodScore / 10) * 2 +
    0.1 * (metrics.energyLevel / 3) * 2 +
    0.05 * (metrics.mealsEaten / 3) +
    0.18 * (1 - Math.min(metrics.workloadHours / 12, 1)) +
    0.12 * (1 - Math.min(metrics.habitDurationMinutes / 180, 1)) +
    0.1 * (1 - Math.min(metrics.interruptions / 15, 1)) +
    (metrics.medication ? 0.04 : 0);

  const probability = Math.max(0.05, Math.min(0.97, Number(score.toFixed(2))));

  const risks: string[] = [];
  if (metrics.workloadHours >= 8) risks.push("Heavy workload competing for focus");
  if (metrics.habitDurationMinutes >= 75) risks.push("Long habit duration raises drop-off risk");
  if (metrics.sleepHours < 6.5) risks.push("Sleep debt is lowering your follow-through");
  if (metrics.interruptions >= 8) risks.push("High interruption count in your environment");
  if (metrics.moodScore <= 4) risks.push("Low mood reduces initiation energy");
  if (risks.length === 0) risks.push("No significant risks detected for today");

  const recommendations: string[] = [
    metrics.workloadHours >= 8
      ? "Complete your habit before lunch, ahead of the workload peak."
      : "Anchor the habit right after an existing routine to lock the cue.",
    metrics.habitDurationMinutes > 45
      ? `Reduce today's session to ${Math.max(15, Math.round(metrics.habitDurationMinutes / 2))} minutes.`
      : "Keep the session short and repeatable — consistency beats volume.",
    metrics.interruptions >= 6
      ? "Silence notifications and claim one protected block."
      : "Prepare your setup tonight so tomorrow starts with zero friction.",
  ];

  const summary =
    probability >= 0.75
      ? "Today looks promising — your sleep and workload are balanced, and your recent streak is carrying momentum."
      : probability >= 0.5
        ? "Today is workable but fragile. A few inputs are pulling against you, so shrink the target and protect your window."
        : "Today is a high-risk day. Aim for a minimum viable version of the habit to keep the streak alive.";

  return {
    probability,
    prediction: probability >= 0.5 ? 1 : 0,
    coach: {
      summary,
      risks,
      recommendations,
      motivation:
        probability >= 0.75
          ? "Protecting today's streak makes tomorrow easier. Show up and bank the win."
          : "A small rep still counts. Two minutes today beats a perfect plan tomorrow.",
    },
  };
}

export async function logOutcome(input: {
  habitId: string;
  completed: boolean;
  prediction: number;
}): Promise<HistoryEntry> {
  await delay(400);
  const habit = habits.find((h) => h.id === input.habitId);
  const entry: HistoryEntry = {
    id: `log_${Math.random().toString(36).slice(2, 8)}`,
    date: iso(0),
    habitId: input.habitId,
    habitName: habit?.name ?? "Habit",
    prediction: input.prediction,
    completed: input.completed,
    streak: (habit?.streak ?? 0) + (input.completed ? 1 : 0),
  };
  history = [entry, ...history];
  if (habit) {
    habits = habits.map((h) =>
      h.id === habit.id
        ? {
            ...h,
            streak: input.completed ? h.streak + 1 : 0,
            lastPrediction: input.prediction,
          }
        : h,
    );
  }
  return entry;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  await delay(500);
  return [...history];
}

export async function getStats(): Promise<StatsResponse> {
  await delay(600);
  return {
    weeklyCompletionRate: 0.86,
    monthlyCompletionRate: 0.79,
    currentStreak: 14,
    longestStreak: 31,
    averageSleep: 7.2,
    averageWorkload: 6.4,
    predictionAccuracy: 0.88,
    daily: Array.from({ length: 14 }, (_, i) => {
      const p = 0.52 + (((i * 17) % 40) / 100);
      return {
        date: iso(13 - i),
        probability: Number(Math.min(0.96, p).toFixed(2)),
        completed: p > 0.6 ? 1 : 0,
      };
    }),
    weekly: [
      { week: "W1", rate: 0.62 },
      { week: "W2", rate: 0.71 },
      { week: "W3", rate: 0.68 },
      { week: "W4", rate: 0.81 },
      { week: "W5", rate: 0.86 },
      { week: "W6", rate: 0.91 },
    ],
    archetypeSplit: [
      { name: "Deep Worker", value: 38 },
      { name: "Student", value: 27 },
      { name: "Early Bird", value: 21 },
      { name: "Recovery", value: 14 },
    ],
  };
}
