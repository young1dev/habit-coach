import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

const toneStroke: Record<Tone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function ProgressRing({
  value,
  size = 180,
  thickness = 14,
  tone = "primary",
  children,
  className,
}: {
  /** 0 - 1 */
  value: number;
  size?: number | undefined;
  thickness?: number | undefined;
  tone?: Tone | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useMotionValue(0);
  const offset = useTransform(progress, (p) => circumference * (1 - p));

  useEffect(() => {
    const controls = animate(progress, Math.max(0, Math.min(1, value)), {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [progress, value]);

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke="var(--muted)"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={toneStroke[tone]}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function useAnimatedPercent(value: number) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, Math.round(value * 100), {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return display;
}
