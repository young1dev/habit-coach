import { Sparkles, ShieldAlert, ListChecks, Flame } from "lucide-react";
import { motion } from "motion/react";

import type { CoachAdvice } from "@/lib/types";
import { cn } from "@/lib/utils";

function CoachSection({
  title,
  icon: Icon,
  tone,
  delay,
  children,
}: {
  title: string;
  icon: typeof Sparkles;
  tone: "primary" | "danger" | "success" | "warning";
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-5"
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
            tone === "primary" && "bg-primary-soft text-primary",
            tone === "danger" && "bg-danger-soft text-danger",
            tone === "success" && "bg-success-soft text-success",
            tone === "warning" && "bg-warning-soft text-warning",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </motion.div>
  );
}

export function CoachCard({ coach }: { coach: CoachAdvice }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CoachSection title="Summary" icon={Sparkles} tone="primary" delay={0.05}>
        {coach.summary}
      </CoachSection>
      <CoachSection title="Risks" icon={ShieldAlert} tone="danger" delay={0.12}>
        <ul className="space-y-1.5">
          {coach.risks.map((risk) => (
            <li key={risk} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
              {risk}
            </li>
          ))}
        </ul>
      </CoachSection>
      <CoachSection title="Recommendations" icon={ListChecks} tone="success" delay={0.19}>
        <ul className="space-y-1.5">
          {coach.recommendations.map((rec) => (
            <li key={rec} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              {rec}
            </li>
          ))}
        </ul>
      </CoachSection>
      <CoachSection title="Motivation" icon={Flame} tone="warning" delay={0.26}>
        <span className="font-display text-base leading-snug text-foreground">
          {coach.motivation}
        </span>
      </CoachSection>
    </div>
  );
}
