import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Flame, MoreHorizontal, Pencil, Target, Trash2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Habit } from "@/lib/types";

export function HabitCard({
  habit,
  index = 0,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  index?: number | undefined;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface flex flex-col p-5 transition-shadow hover:shadow-lift"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {habit.archetype}
          </span>
          <h3 className="mt-2 truncate text-base font-semibold">{habit.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Habit actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(habit)}
              className="text-danger focus:text-danger"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Flame className="h-3 w-3" /> Streak
          </dt>
          <dd className="mt-1 font-display text-lg font-bold tabular-nums">{habit.streak}d</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> Last
          </dt>
          <dd className="mt-1 font-display text-lg font-bold tabular-nums">
            {Math.round(habit.lastPrediction * 100)}%
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Target className="h-3 w-3" /> Rate
          </dt>
          <dd className="mt-1 font-display text-lg font-bold tabular-nums">
            {Math.round(habit.completionRate * 100)}%
          </dd>
        </div>
      </dl>

      <Button asChild variant="secondary" className="mt-5 w-full rounded-full">
        <Link to="/checkin" search={{ habit: habit.id }}>
          Open habit
        </Link>
      </Button>
    </motion.article>
  );
}
