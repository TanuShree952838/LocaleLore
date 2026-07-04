import type { BudgetStatus, PlanMeta } from "@/lib/types";
import {
  type LucideIcon,
  SparklesIcon,
  ZapIcon,
  ShieldCheckIcon,
  RefreshIcon,
  DatabaseIcon,
} from "@/components/ui/Icon";

type ChipTone = "accent" | "success" | "warning";

interface Chip {
  Icon: LucideIcon;
  label: string;
  tone: ChipTone;
}

const TONE_CLASSES: Record<ChipTone, string> = {
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

/**
 * A compact "why you can trust this" strip. It surfaces the provenance metadata
 * the API already returns (model, latency, cache hit) alongside the server-side
 * guarantees that make LocaleLore's output dependable.
 */
export function AiProvenance({
  meta,
  budgetStatus,
}: {
  meta: PlanMeta | null;
  budgetStatus: BudgetStatus;
}) {
  const cached = meta?.cached ?? false;
  const revised = meta?.revised ?? budgetStatus === "revised_to_fit";
  const model = meta?.model && meta.model !== "cache" ? meta.model : null;
  const seconds =
    meta && !cached && meta.latencyMs > 0 ? (meta.latencyMs / 1000).toFixed(1) : null;

  const chips: Chip[] = [
    {
      Icon: SparklesIcon,
      label: model ? `Gemini · ${model}` : "Crafted by Google Gemini",
      tone: "accent",
    },
  ];

  if (cached) {
    chips.push({ Icon: DatabaseIcon, label: "Instant · cached result", tone: "accent" });
  } else if (seconds) {
    chips.push({ Icon: ZapIcon, label: `Generated in ${seconds}s`, tone: "accent" });
  }

  chips.push({
    Icon: ShieldCheckIcon,
    label: "Budget verified server-side",
    tone: "success",
  });

  if (revised) {
    chips.push({ Icon: RefreshIcon, label: "Budget auto-tuned to fit", tone: "warning" });
  }

  return (
    <section
      aria-label="How this plan was generated"
      className="rounded-2xl border border-border bg-surface/70 p-4 shadow-sm glass"
    >
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${TONE_CLASSES[chip.tone]}`}
          >
            <chip.Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {chip.label}
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-xs text-muted leading-relaxed">
        Every sight, dish, and route is chosen by your local guide with a stated
        reason — open any card&apos;s &ldquo;Why I chose this&rdquo; to see the thinking
        behind each recommendation.
      </p>
    </section>
  );
}
