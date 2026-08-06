import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { History as HistoryIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHabits, useHistory } from "@/lib/queries";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — ZICO Habit Intelligence" },
      {
        name: "description",
        content: "Review every logged day: prediction, outcome and streak, filtered by habit or date.",
      },
      { property: "og:title", content: "History — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Review every logged day: prediction, outcome and streak.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const history = useHistory();
  const habits = useHabits();

  const [habitFilter, setHabitFilter] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const rows = useMemo(() => {
    return (history.data ?? []).filter((entry) => {
      if (habitFilter !== "all" && entry.habitId !== habitFilter) return false;
      if (completionFilter === "completed" && !entry.completed) return false;
      if (completionFilter === "missed" && entry.completed) return false;
      if (dateFilter && entry.date !== dateFilter) return false;
      return true;
    });
  }, [history.data, habitFilter, completionFilter, dateFilter]);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Log"
        title="History"
        description="Every prediction paired with what actually happened."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Select value={habitFilter} onValueChange={setHabitFilter}>
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="All habits" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All habits</SelectItem>
            {habits.data?.map((habit) => (
              <SelectItem key={habit.id} value={habit.id}>
                {habit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={completionFilter} onValueChange={setCompletionFilter}>
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All outcomes</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="rounded-full"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
        />
      </div>

      <div className="mt-6">
        {history.isLoading ? (
          <Skeleton className="h-96 w-full rounded-3xl" />
        ) : rows.length ? (
          <div className="card-surface overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Habit</TableHead>
                  <TableHead className="text-right">Prediction</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {entry.date}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm font-medium">
                      {entry.habitName}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums">
                      {Math.round(entry.prediction * 100)}%
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          entry.completed
                            ? "rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success"
                            : "rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger"
                        }
                      >
                        {entry.completed ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {entry.streak}d
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            icon={HistoryIcon}
            title="No logs match these filters"
            description="Try clearing the date or outcome filter."
          />
        )}
      </div>
    </PageContainer>
  );
}
