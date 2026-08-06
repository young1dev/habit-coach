import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bed, Briefcase, Crown, Flame, Target, TrendingUp } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { StatCard } from "@/components/common/StatCard";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/lib/queries";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "Statistics — ZICO Habit Intelligence" },
      {
        name: "description",
        content:
          "Completion trends, streak records, sleep and workload averages, and model accuracy.",
      },
      { property: "og:title", content: "Statistics — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Completion trends, streak records and model accuracy.",
      },
    ],
  }),
  component: StatisticsPage,
});

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--card-foreground)",
  fontSize: 12,
};

function StatisticsPage() {
  const stats = useStats();

  if (stats.isLoading || !stats.data) {
    return (
      <PageContainer>
        <SectionHeader eyebrow="Insights" title="Statistics" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="mt-4 h-80 rounded-3xl" />
      </PageContainer>
    );
  }

  const s = stats.data;

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Insights"
        title="Statistics"
        description="How your behaviour and the model have tracked each other over time."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current streak"
          value={`${s.currentStreak} days`}
          icon={Flame}
          tone="warning"
        />
        <StatCard
          label="Longest streak"
          value={`${s.longestStreak} days`}
          icon={Crown}
          delay={0.05}
        />
        <StatCard
          label="Average sleep"
          value={`${s.averageSleep}h`}
          icon={Bed}
          tone="success"
          delay={0.1}
        />
        <StatCard
          label="Average workload"
          value={`${s.averageWorkload}h`}
          icon={Briefcase}
          delay={0.15}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Daily prediction trend</h2>
          <p className="mt-1 text-xs text-muted-foreground">Last 14 days</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.daily}>
                <defs>
                  <linearGradient id="probability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v: string) => v.slice(5)}
                  stroke="var(--border)"
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                  stroke="var(--border)"
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => `${Math.round(Number(v) * 100)}%`}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#probability)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface flex flex-col items-center justify-center p-6">
          <h2 className="text-sm font-semibold">Prediction accuracy</h2>
          <ProgressRing value={s.predictionAccuracy} size={170} tone="success" className="mt-4">
            <div>
              <span className="font-display text-3xl font-bold tabular-nums">
                {Math.round(s.predictionAccuracy * 100)}%
              </span>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                Accurate
              </p>
            </div>
          </ProgressRing>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Measured against logged outcomes on the Default Student Model.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Weekly completion rate</h2>
          <div className="mt-5 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                  stroke="var(--border)"
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => `${Math.round(Number(v) * 100)}%`}
                />
                <Bar dataKey="rate" fill="var(--chart-1)" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-sm font-semibold">Completions by archetype</h2>
          <div className="mt-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={s.archetypeSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={3}
                  stroke="var(--card)"
                >
                  {s.archetypeSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Weekly completion rate"
          value={`${Math.round(s.weeklyCompletionRate * 100)}%`}
          hint="7-day rolling window"
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Monthly completion rate"
          value={`${Math.round(s.monthlyCompletionRate * 100)}%`}
          hint="30-day rolling window"
          icon={Target}
          delay={0.05}
        />
      </div>
    </PageContainer>
  );
}
