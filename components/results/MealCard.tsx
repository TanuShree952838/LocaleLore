import type { Currency, Meal } from "@/lib/types";
import { formatDuration, formatMoney, MEAL_LABELS } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { MealSlotIcon, ClockIcon, CoinsIcon } from "@/components/ui/Icon";

export function MealCard({ meal, currency }: { meal: Meal; currency: Currency }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-e1 transition-shadow hover:shadow-e2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"
          >
            <MealSlotIcon slot={meal.slot} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {MEAL_LABELS[meal.slot]}
            </p>
            <h3 className="mt-0.5 text-lg font-semibold text-text">{meal.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatDuration(meal.prepMinutes)}
          </Badge>
          <Badge tone="accent">
            <CoinsIcon className="h-3.5 w-3.5" />
            {formatMoney(meal.estimatedCost, currency)}
          </Badge>
        </div>
      </div>

      <p className="mt-3 text-sm text-text/80">{meal.summary}</p>

      <ol className="mt-4 flex flex-col gap-2">
        {meal.steps.map((step, index) => (
          <li key={index} className="flex gap-3 text-sm text-text">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}
