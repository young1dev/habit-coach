import { ProgressRing, useAnimatedPercent } from "./ProgressRing";
import { riskLevelFor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PredictionGauge({
  probability,
  size = 200,
  label = "Today's Prediction",
  compact,
}: {
  probability: number;
  size?: number | undefined;
  label?: string | undefined;
  compact?: boolean | undefined;
}) {
  const percent = useAnimatedPercent(probability);
  const risk = riskLevelFor(probability);
  const tone = risk === "Low" ? "success" : risk === "Medium" ? "warning" : "danger";
  const message =
    risk === "Low"
      ? "High likelihood of success"
      : risk === "Medium"
        ? "Moderate likelihood — protect your window"
        : "Low likelihood — shrink today's target";

  return (
    <div className="flex flex-col items-center text-center">
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      )}
      <ProgressRing value={probability} size={size} tone={tone} className={compact ? "" : "mt-4"}>
        <div>
          <span className="font-display text-4xl font-bold tabular-nums sm:text-5xl">
            {percent}%
          </span>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Completion
          </p>
        </div>
      </ProgressRing>
      <p
        className={cn(
          "mt-4 text-sm font-medium",
          tone === "success" && "text-success",
          tone === "warning" && "text-warning",
          tone === "danger" && "text-danger",
        )}
      >
        {message}
      </p>
    </div>
  );
}

export function RiskBadge({ probability }: { probability: number }) {
  const risk = riskLevelFor(probability);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        risk === "Low" && "bg-success-soft text-success",
        risk === "Medium" && "bg-warning-soft text-warning",
        risk === "High" && "bg-danger-soft text-danger",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {risk} risk
    </span>
  );
}
