import type { Currency, Substitution } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { SwapIcon, ArrowRightIcon } from "@/components/ui/Icon";

export function SubstitutionsPanel({
  substitutions,
  currency,
}: {
  substitutions: Substitution[];
  currency: Currency;
}) {
  if (substitutions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-muted">
        No substitutions needed — your plan already fits your preferences and budget.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {substitutions.map((sub) => (
        <li
          key={sub.id}
          className="flex gap-3 rounded-xl border border-border bg-surface p-4 shadow-e1 transition-shadow hover:shadow-e2"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
          >
            <SwapIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-muted line-through">{sub.original}</span>
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              <span className="font-semibold text-text">{sub.replacement}</span>
              {sub.savesAmount > 0 && (
                <Badge tone="success">
                  Saves {formatMoney(sub.savesAmount, currency)}
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-sm text-text/80">{sub.reason}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
