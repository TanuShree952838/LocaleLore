import type { BudgetFeasibility } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const STATUS_META: Record<
  BudgetFeasibility["status"],
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  within_budget: { label: "Within Budget", tone: "success" },
  revised_to_fit: { label: "Revised to Fit", tone: "warning" },
  over_budget: { label: "Over Budget", tone: "danger" },
};

export function BudgetFeasibilityCard({ budget }: { budget: BudgetFeasibility }) {
  const meta = STATUS_META[budget.status];
  const usedRatio =
    budget.budgetLimit > 0
      ? Math.min(budget.estimatedTotal / budget.budgetLimit, 1)
      : 0;
  const percentUsed = Math.round(usedRatio * 100);
  const over = budget.status === "over_budget";

  return (
    <section
      aria-labelledby="budget-heading"
      className="rounded-2xl border border-border bg-surface p-5 glass shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="budget-heading" className="text-sm font-bold text-text">
          Odyssey Budget Estimator
        </h2>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-black text-text tracking-tight">
            {formatMoney(budget.estimatedTotal, budget.currency)}
          </p>
          <p className="text-xs text-muted">
            of {formatMoney(budget.budgetLimit, budget.currency)} limit
          </p>
        </div>
        <p className={cn("text-xs font-bold", over ? "text-danger" : "text-success")}>
          {over
            ? `${formatMoney(Math.abs(budget.remaining), budget.currency)} Over Limit`
            : `${formatMoney(budget.remaining, budget.currency)} Remaining`}
        </p>
      </div>

      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={percentUsed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Trip budget usage status"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", over ? "bg-danger" : "bg-accent")}
          style={{ width: `${Math.max(percentUsed, 2)}%` }}
        />
      </div>

      <p className="mt-4 text-xs text-text/80 leading-relaxed border-t border-border/40 pt-3">
        {budget.explanation}
      </p>
    </section>
  );
}
