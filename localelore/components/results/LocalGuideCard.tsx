import type { TravelPlan, GuideArchetype } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { LeafIcon, ShieldCheckIcon, BackpackIcon } from "@/components/ui/Icon";

interface LocalGuideCardProps {
  plan: TravelPlan;
  guideType: GuideArchetype;
  isEditing?: boolean;
  onChangeOverview?: (patch: Partial<Pick<TravelPlan, "tagline" | "culturalOverview">>) => void;
}

export function LocalGuideCard({
  plan,
  guideType,
  isEditing = false,
  onChangeOverview,
}: LocalGuideCardProps) {
  const currentGuide = GUIDES[guideType] || GUIDES.historian;
  const GuideIcon = currentGuide.Icon;

  return (
    <div className="space-y-6">
      {/* Resident Guide Welcome Card */}
      <section
        aria-label="Your local guide"
        className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm glass ${currentGuide.themeClass}`}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface border border-border text-accent shadow-sm">
            <GuideIcon aria-hidden="true" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">
              My Local Guide
            </span>
            <h3 className="text-lg font-bold text-text">
              {currentGuide.name} — {currentGuide.role}
            </h3>
            <p className="text-sm italic text-muted leading-relaxed">
              &ldquo;{currentGuide.greeting}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Destination Showcase & Heritage Score */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <section className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-sm glass space-y-3">
          <div>
            <h2 className="text-2xl font-black text-text tracking-tight">
              {plan.destinationName}
            </h2>
            {isEditing ? (
              <input
                type="text"
                value={plan.tagline}
                onChange={(e) => onChangeOverview?.({ tagline: e.target.value })}
                className="mt-1 w-full rounded border border-accent/40 bg-bg px-2 py-1 text-sm font-medium italic text-accent-2 focus:border-accent focus:outline-none"
                aria-label="Trip tagline"
              />
            ) : (
              <p className="text-sm font-medium text-accent-2 italic">{plan.tagline}</p>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={plan.culturalOverview}
              onChange={(e) => onChangeOverview?.({ culturalOverview: e.target.value })}
              rows={4}
              className="w-full rounded border border-accent/40 bg-bg px-2 py-1.5 text-sm text-text/95 leading-relaxed focus:border-accent focus:outline-none"
              aria-label="Cultural overview"
            />
          ) : (
            <p className="text-sm text-text/95 leading-relaxed">{plan.culturalOverview}</p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm glass flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Heritage Impact Score
          </span>
          <ProgressRing
            value={plan.heritageScore}
            size={96}
            stroke={8}
            label={`Heritage impact score: ${plan.heritageScore} out of 100`}
          >
            <span className="text-2xl font-black text-text">{plan.heritageScore}%</span>
          </ProgressRing>
          <p className="text-xs text-muted leading-tight max-w-[180px]">
            Measures engagement with traditional craftspeople, preservation sites, and local-owned shops.
          </p>
        </section>
      </div>

      {/* Sustainable, Safety & Packing Guidelines */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <LeafIcon aria-hidden="true" className="h-4 w-4 text-success" /> Eco-friendly tips
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.sustainableRecommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <ShieldCheckIcon aria-hidden="true" className="h-4 w-4 text-accent" /> Safety tips
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.safetyTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <BackpackIcon aria-hidden="true" className="h-4 w-4 text-accent-2" /> Packing Suggestions
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.packingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
