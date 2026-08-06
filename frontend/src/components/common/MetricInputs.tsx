import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function FieldShell({
  icon: Icon,
  label,
  hint,
  value,
  children,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string | undefined;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{label}</p>
            {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
          </div>
        </div>
        <span className="shrink-0 font-display text-lg font-bold tabular-nums">{value}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function MetricSlider({
  icon,
  label,
  hint,
  min,
  max,
  step = 1,
  value,
  suffix = "",
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string | undefined;
  min: number;
  max: number;
  step?: number | undefined;
  value: number;
  suffix?: string | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <FieldShell icon={icon} label={label} hint={hint} value={`${value}${suffix}`}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => onChange(next[0] ?? min)}
        aria-label={label}
      />
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </FieldShell>
  );
}

export function MetricStepper({
  icon,
  label,
  hint,
  min,
  max,
  value,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string | undefined;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FieldShell icon={icon} label={label} hint={hint} value={String(value)}>
      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-display text-2xl font-bold tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </FieldShell>
  );
}

export function MetricSegmented({
  icon,
  label,
  hint,
  options,
  value,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string | undefined;
  options: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FieldShell icon={icon} label={label} hint={hint} value={String(value)}>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full py-2 text-sm font-semibold transition-all",
              value === option.value
                ? "bg-card text-primary shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </FieldShell>
  );
}

export function MetricToggle({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string | undefined;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <FieldShell icon={icon} label={label} hint={hint} value={value ? "Yes" : "No"}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {value ? "Taken today" : "Not taken today"}
        </span>
        <Switch checked={value} onCheckedChange={onChange} aria-label={label} />
      </div>
    </FieldShell>
  );
}
