import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Accessible circular progress indicator drawn with SVG. The indicator arc
 * animates smoothly via `stroke-dashoffset`. Center content (a percentage, an
 * icon, a count) is provided as children.
 */
export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  children,
  className,
  trackClassName,
  indicatorClassName,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={cn("text-surface-2", trackClassName)}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn(
            "text-accent transition-[stroke-dashoffset] duration-500 ease-emphasized",
            indicatorClassName,
          )}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children != null && (
        <span className="absolute inset-0 flex items-center justify-center">
          {children}
        </span>
      )}
    </div>
  );
}
