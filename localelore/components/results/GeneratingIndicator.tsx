"use client";

import { useEffect, useState } from "react";
import {
  type LucideIcon,
  CompassIcon,
  LandmarkIcon,
  GemIcon,
  UtensilsCrossedIcon,
  FootprintsIcon,
  BookOpenIcon,
  PaletteIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@/components/ui/Icon";

interface Step {
  Icon: LucideIcon;
  text: string;
}

/** Rotating status lines shown while Gemini builds the plan (can take a while). */
const STEPS: Step[] = [
  { Icon: CompassIcon, text: "Getting to know your destination" },
  { Icon: LandmarkIcon, text: "Finding places locals actually love" },
  { Icon: GemIcon, text: "Digging up hidden gems" },
  { Icon: UtensilsCrossedIcon, text: "Picking authentic spots to eat" },
  { Icon: FootprintsIcon, text: "Plotting a route you can walk" },
  { Icon: BookOpenIcon, text: "Gathering local myths & folklore" },
  { Icon: PaletteIcon, text: "Spotlighting local artisans" },
  { Icon: ShieldCheckIcon, text: "Making sure the budget adds up" },
  { Icon: SparklesIcon, text: "Adding the finishing touches" },
];

const ROTATE_MS = 2200;

/**
 * Engaging, decorative loading panel. It's aria-hidden because the loading state
 * is already announced once via the skeleton's polite live region — rotating this
 * text through a live region would spam screen readers every couple of seconds.
 */
export function GeneratingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const current = STEPS[index] ?? STEPS[0]!;
  const Icon = current.Icon;

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm glass sm:p-7"
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-accent/20" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent motion-safe:animate-spin" />
          <span key={index} className="motion-safe:animate-scale-in text-accent">
            <Icon className="h-5 w-5" />
          </span>
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Gemini is building your plan
          </p>
          <p key={index} className="mt-0.5 text-sm font-medium text-text motion-safe:animate-fade-in">
            {current.text}…
          </p>
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <span className="block h-full w-1/4 rounded-full bg-brand motion-safe:animate-indeterminate" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {STEPS.map((step, i) => (
          <span
            key={step.text}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-accent" : "w-1.5 bg-surface-3"
            }`}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        Good plans take a few moments — we&apos;re checking real places, routes, and prices so
        your trip actually holds up.
      </p>
    </div>
  );
}
