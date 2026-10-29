import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  /** Text color class for the progress arc, e.g. "text-primary". */
  className?: string;
  /** Content centered inside the ring; `showValue` renders the percentage. */
  label?: ReactNode;
  showValue?: boolean;
}

export function ProgressRing({
  progress,
  size = 32,
  strokeWidth = 3,
  className,
  label,
  showValue = false,
}: ProgressRingProps) {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = label ?? (showValue ? `${Math.round(value)}%` : null);

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center text-primary", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(value)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      {center !== null ? (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums text-foreground">
          {center}
        </span>
      ) : null}
    </div>
  );
}
