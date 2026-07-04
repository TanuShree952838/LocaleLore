"use client";

import { useMemo, useState } from "react";
import type { CookingTask } from "@/lib/types";
import { formatDuration, MEAL_LABELS } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ClockIcon, MealSlotIcon, CheckIcon, ListChecksIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Interactive cooking checklist. Completion state is local (a transient "cook
 * mode" aid), and a live region announces progress as tasks are checked off.
 */
export function TodoTimeline({ tasks }: { tasks: CookingTask[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const completedCount = useMemo(
    () => tasks.filter((task) => done.has(task.id)).length,
    [tasks, done],
  );
  const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allDone = tasks.length > 0 && completedCount === tasks.length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-e1">
        <ProgressRing value={percent} size={48} stroke={5} label="Cooking progress">
          {allDone ? (
            <CheckIcon aria-hidden="true" className="h-5 w-5 text-success" />
          ) : (
            <span className="text-xs font-semibold text-text">{percent}%</span>
          )}
        </ProgressRing>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <ListChecksIcon className="h-4 w-4 text-accent" />
            {allDone ? "All done — enjoy your meal!" : "Cooking checklist"}
          </p>
          <p className="text-xs text-muted" aria-live="polite">
            {completedCount} of {tasks.length} tasks done
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {tasks.map((task) => {
          const checked = done.has(task.id);
          return (
            <li key={task.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                  "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg",
                  checked
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-surface hover:bg-surface-2",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(task.id)}
                  className="h-5 w-5 shrink-0 rounded border-border text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="flex w-16 shrink-0 items-center gap-1 font-mono text-sm font-medium text-accent">
                  <ClockIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  {task.time}
                </span>
                <span
                  className={cn(
                    "flex-1 text-sm text-text",
                    checked && "text-muted line-through",
                  )}
                >
                  {task.title}
                </span>
                <span className="hidden shrink-0 sm:block">
                  <Badge tone="neutral">
                    <MealSlotIcon slot={task.meal} className="h-3.5 w-3.5" />
                    {MEAL_LABELS[task.meal]}
                  </Badge>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {formatDuration(task.durationMinutes)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
