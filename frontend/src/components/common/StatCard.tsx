import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  delay = 0,
}: {
  label: string;
  value: string;
  hint?: string | undefined;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger" | undefined;
  delay?: number | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-5 transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
            tone === "primary" && "bg-primary-soft text-primary",
            tone === "success" && "bg-success-soft text-success",
            tone === "warning" && "bg-warning-soft text-warning",
            tone === "danger" && "bg-danger-soft text-danger",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
