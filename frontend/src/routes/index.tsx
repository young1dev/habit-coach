import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { StatCard } from "@/components/common/StatCard";
import { PredictionGauge, RiskBadge } from "@/components/common/PredictionGauge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabits, useHistory, useStats } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ZICO Habit Intelligence" },
      {
        name: "description",
        content:
          "See today's completion probability, your active streak, and AI coaching for your habits.",
      },
      { property: "og:title", content: "Dashboard — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Today's habit completion probability, streaks, and AI coaching at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const habits = useHabits();
  const history = useHistory();
  const stats = useStats();

  const activeHabit = habits.data?.[0];
  const latestHistoryEntry = history.data?.[0];
  const probability = latestHistoryEntry?.prediction ?? activeHabit?.lastPrediction ?? 0;
  const activeHabitName = latestHistoryEntry?.habitName ?? activeHabit?.name ?? "—";

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Good to see you"
        title="Welcome back, Zico"
        description="Your habit intelligence for today, built from sleep, workload, mood and momentum."
        action={
          <Button asChild className="rounded-full">
            <Link to="/checkin">
              Daily check-in <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-surface flex flex-col items-center justify-center p-8 lg:row-span-2"
        >
          {habits.isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-50 w-50 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <>
              <PredictionGauge probability={probability} />
              <div className="mt-5">
                <RiskBadge probability={probability} />
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Based on your latest check-in for{" "}
                <span className="font-semibold text-foreground">{activeHabitName}</span>
              </p>
            </>
          )}
        </motion.section>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatCard
            label="Current streak"
            value={`${activeHabit?.streak ?? 0} days`}
            hint="Keep it alive today"
            icon={Flame}
            tone="warning"
            delay={0.05}
          />
          <StatCard
            label="Completion rate"
            value={`${Math.round((activeHabit?.completionRate ?? 0) * 100)}%`}
            hint="Last 30 days"
            icon={Target}
            tone="success"
            delay={0.1}
          />
          <StatCard
            label="Prediction accuracy"
            value={`${Math.round((stats.data?.predictionAccuracy ?? 0) * 100)}%`}
            hint="Model vs. outcomes"
            icon={BrainCircuit}
            delay={0.15}
          />
          <StatCard
            label="Weekly completion"
            value={`${Math.round((stats.data?.weeklyCompletionRate ?? 0) * 100)}%`}
            hint="This week so far"
            icon={TrendingUp}
            tone="success"
            delay={0.2}
          />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="card-surface p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold">AI Coach preview</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your sleep and workload look balanced today. Front-load the session before lunch and
            silence notifications for the first 20 minutes — that is where drop-off usually happens.
          </p>
          <Button asChild variant="secondary" className="mt-5 rounded-full">
            <Link to="/checkin">Run today's prediction</Link>
          </Button>
        </motion.section>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold">Recent activity</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/history">View all</Link>
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {history.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))
            : history.data?.slice(0, 5).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <CalendarCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{entry.habitName}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display text-sm font-bold tabular-nums">
                      {Math.round(entry.prediction * 100)}%
                    </span>
                    <span
                      className={
                        entry.completed === true
                          ? "rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success"
                          : entry.completed === false
                          ? "rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger"
                          : "rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground"
                      }
                    >
                      {entry.completed === true
                        ? "Completed"
                        : entry.completed === false
                        ? "Missed"
                        : "Pending"}
                    </span>
                  </div>
                </motion.div>
              ))}
        </div>
      </section>
    </PageContainer>
  );
}
