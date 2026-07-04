"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  type IconProps,
  ChefHatIcon,
  SparklesIcon,
  ClockIcon,
  LightbulbIcon,
  CartIcon,
  SwapIcon,
  WalletIcon,
  SunriseIcon,
  CheckCircleIcon,
} from "@/components/ui/Icon";

interface Step {
  Icon: (props: IconProps) => ReactElement;
  text: string;
}

/**
 * Warm, health- and food-minded "thoughts" shown one at a time while Gemini
 * works. Each line pairs a friendly kitchen icon with a small nudge so the wait
 * feels intentional rather than empty. Purely decorative (aria-hidden) — the
 * real status lives in PlanSkeleton's polite live region.
 */
const STEPS: Step[] = [
  { Icon: ChefHatIcon, text: "Reading your day, your budget, and your kitchen" },
  { Icon: SparklesIcon, text: "Balancing the plate — protein, colorful veggies, whole grains" },
  { Icon: ClockIcon, text: "Timing each step so every dish lands warm and fresh" },
  { Icon: LightbulbIcon, text: "Home-cooked beats takeout — kinder on your body and wallet" },
  { Icon: CartIcon, text: "Sorting the grocery run so nothing gets forgotten" },
  { Icon: SwapIcon, text: "Finding smart swaps that are cheaper and healthier" },
  { Icon: WalletIcon, text: "Making sure it all fits your budget" },
  { Icon: SunriseIcon, text: "Small, steady meals keep your energy even all day" },
  { Icon: CheckCircleIcon, text: "Plating it up — your plan is almost ready" },
];

const ROTATE_MS = 2200;

export function GeneratingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const current = STEPS[index] ?? STEPS[0]!;
  const Icon = current.Icon;

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-border bg-surface p-6 shadow-e1 sm:p-7"
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
          <span
            key={index}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent motion-safe:animate-scale-in"
          >
            <Icon className="h-5 w-5" />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Cooking up your plan…
          </p>
          <p
            key={index}
            className="mt-0.5 text-sm font-medium text-text motion-safe:animate-fade-in"
          >
            {current.text}.
          </p>
        </div>
      </div>

      {/* Indeterminate progress bar */}
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/3 rounded-full bg-accent motion-safe:animate-indeterminate" />
      </div>

      {/* Step dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-accent" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
