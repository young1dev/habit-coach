import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Bed,
  Bell,
  Briefcase,
  CheckCircle2,
  Pill,
  RotateCcw,
  Smile,
  Timer,
  UtensilsCrossed,
  Wand2,
  XCircle,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  MetricSegmented,
  MetricSlider,
  MetricStepper,
  MetricToggle,
} from "@/components/common/MetricInputs";
import { PredictionGauge, RiskBadge } from "@/components/common/PredictionGauge";
import { CoachCard } from "@/components/common/CoachCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits, useLogOutcome, usePredict } from "@/lib/queries";
import type { CheckinMetrics } from "@/lib/types";

export const Route = createFileRoute("/checkin")({
  validateSearch: (search: Record<string, unknown>) => ({
    habit: typeof search["habit"] === "string" ? (search["habit"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Daily Check-in — ZICO Habit Intelligence" },
      {
        name: "description",
        content:
          "Log today's sleep, mood, energy, workload and interruptions to predict your completion probability.",
      },
      { property: "og:title", content: "Daily Check-in — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Log today's metrics and get an ML prediction plus AI coaching.",
      },
    ],
  }),
  component: CheckinPage,
});

const DEFAULTS = {
  sleepHours: 7,
  moodScore: 7,
  energyLevel: 2,
  mealsEaten: 3,
  workloadHours: 6,
  habitDurationMinutes: 45,
  interruptions: 4,
  medication: false,
};

function CheckinPage() {
  const { habit: habitParam } = Route.useSearch();
  const habits = useHabits();
  const predict = usePredict();
  const logOutcome = useLogOutcome();

  const [habitId, setHabitId] = useState<string>(habitParam);
  const [metrics, setMetrics] = useState(DEFAULTS);

  const selectedId = habitId || habits.data?.[0]?.id || "";
  const selectedHabit = habits.data?.find((h) => h.id === selectedId);
  const result = predict.data;

  const set = <K extends keyof typeof DEFAULTS>(key: K, value: (typeof DEFAULTS)[K]) =>
    setMetrics((prev) => ({ ...prev, [key]: value }));

  const handlePredict = () => {
    if (!selectedId) return;
    const payload: CheckinMetrics = { habitId: selectedId, ...metrics };
    predict.mutate(payload);
  };

  const handleReset = () => {
    setMetrics(DEFAULTS);
    predict.reset();
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Today"
        title="Daily check-in"
        description="Streak, yesterday's completion and weekend detection are handled automatically by the model."
        action={
          <div className="w-full sm:w-56">
            <Select value={selectedId} onValueChange={setHabitId}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Select habit" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {habits.data?.map((habit) => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <MetricSlider
          icon={Bed}
          label="Sleep hours"
          hint="Last night"
          min={0}
          max={12}
          step={0.5}
          suffix="h"
          value={metrics.sleepHours}
          onChange={(v) => set("sleepHours", v)}
        />
        <MetricSlider
          icon={Smile}
          label="Mood score"
          hint="1 low — 10 great"
          min={1}
          max={10}
          value={metrics.moodScore}
          onChange={(v) => set("moodScore", v)}
        />
        <MetricSegmented
          icon={Activity}
          label="Energy level"
          hint="How charged do you feel?"
          options={[
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
          ]}
          value={metrics.energyLevel}
          onChange={(v) => set("energyLevel", v)}
        />
        <MetricStepper
          icon={UtensilsCrossed}
          label="Meals eaten"
          hint="So far today"
          min={0}
          max={5}
          value={metrics.mealsEaten}
          onChange={(v) => set("mealsEaten", v)}
        />
        <MetricSlider
          icon={Briefcase}
          label="Workload hours"
          hint="Planned for today"
          min={0}
          max={16}
          suffix="h"
          value={metrics.workloadHours}
          onChange={(v) => set("workloadHours", v)}
        />
        <MetricSlider
          icon={Timer}
          label="Habit duration"
          hint="Minutes you intend to spend"
          min={5}
          max={180}
          step={5}
          suffix="m"
          value={metrics.habitDurationMinutes}
          onChange={(v) => set("habitDurationMinutes", v)}
        />
        <MetricStepper
          icon={Bell}
          label="Interruptions"
          hint="Expected today"
          min={0}
          max={20}
          value={metrics.interruptions}
          onChange={(v) => set("interruptions", v)}
        />
        <MetricToggle
          icon={Pill}
          label="Medication"
          hint="Relevant to focus or recovery"
          value={metrics.medication}
          onChange={(v) => set("medication", v)}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          className="rounded-full px-6"
          onClick={handlePredict}
          disabled={predict.isPending || !selectedId}
        >
          {predict.isPending ? (
            <LoadingSpinner label="Predicting" />
          ) : (
            <>
              <Wand2 className="mr-1.5 h-4 w-4" /> Predict today
            </>
          )}
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={handleReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
        </Button>
      </div>

      {predict.isPending && (
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-3xl lg:col-span-1" />
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        </div>
      )}

      {predict.isError && (
        <div className="card-surface mt-10 border-danger/40 p-6">
          <p className="text-sm font-semibold text-danger">Prediction failed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The model service didn't respond. Your inputs are preserved — try again.
          </p>
          <Button variant="secondary" className="mt-4 rounded-full" onClick={handlePredict}>
            Retry prediction
          </Button>
        </div>
      )}

      {result && !predict.isPending && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 space-y-6"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card-surface flex flex-col items-center justify-center p-8">
              <PredictionGauge probability={result.probability} label="Completion probability" />
              <div className="mt-5 flex flex-col items-center gap-3">
                <RiskBadge probability={result.probability} />
                <p className="text-xs text-muted-foreground">
                  Model verdict:{" "}
                  <span className="font-semibold text-foreground">
                    {result.prediction === 1 ? "Likely complete" : "Likely miss"}
                  </span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="font-display text-lg font-bold">AI Coach</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Personalized for {selectedHabit?.name ?? "your habit"}.
              </p>
              <div className="mt-4">
                <CoachCard coach={result.coach} />
              </div>
            </div>
          </div>

          <div className="card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between">
            <p className="min-w-0 text-sm text-muted-foreground">
              Log the real outcome so the model keeps calibrating.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                className="rounded-full"
                disabled={logOutcome.isPending}
                onClick={() =>
                  selectedId &&
                  logOutcome.mutate({
                    habitId: selectedId,
                    completed: true,
                    prediction: result.probability,
                  })
                }
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4 text-success" /> Completed
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={logOutcome.isPending}
                onClick={() =>
                  selectedId &&
                  logOutcome.mutate({
                    habitId: selectedId,
                    completed: false,
                    prediction: result.probability,
                  })
                }
              >
                <XCircle className="mr-1.5 h-4 w-4 text-danger" /> Missed
              </Button>
            </div>
          </div>
        </motion.section>
      )}
    </PageContainer>
  );
}
