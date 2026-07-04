import { useState } from "react";
import type { Attraction, ArtisanSpotlight, Currency } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import {
  ChevronDownIcon,
  ClockIcon,
  LightbulbIcon,
  SunriseIcon,
  CameraIcon,
  NavigationIcon,
  LeafIcon,
  GemIcon,
  PaletteIcon,
} from "@/components/ui/Icon";

interface AttractionsListProps {
  attractions: Attraction[];
  artisanSpotlight: ArtisanSpotlight[];
  currency: Currency;
  isEditing?: boolean;
  onChangeAttraction?: (
    id: string,
    patch: Partial<{ name: string; whySelected: string; estimatedCost: number }>,
  ) => void;
}

export function AttractionsList({
  attractions,
  artisanSpotlight,
  currency,
  isEditing = false,
  onChangeAttraction,
}: AttractionsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const typeBages: Record<
    Attraction["type"],
    { label: string; tone: "success" | "warning" | "danger" | "neutral" }
  > = {
    attraction: { label: "Must-Visit Site", tone: "success" },
    hidden_gem: { label: "Hidden gem", tone: "warning" },
    artisan_workshop: { label: "Craft & Artisan", tone: "danger" },
    local_event: { label: "Community Event", tone: "neutral" },
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-text">Sights & Local Creators</h3>
        <p className="text-xs text-muted">
          Tap any card for its history, local tips, photo spots, and how to visit responsibly.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {attractions.map((attraction) => {
          const isExpanded = expandedId === attraction.id;
          const meta = typeBages[attraction.type] || { label: "Site", tone: "neutral" };
          return (
            <article
              key={attraction.id}
              className={`rounded-3xl border bg-surface p-6 shadow-sm transition-[box-shadow,border-color,transform] duration-300 glass hover:-translate-y-0.5 hover:shadow-e2 ${
                isExpanded ? "ring-1 ring-accent border-accent" : "border-border hover:border-accent/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                      <ClockIcon aria-hidden="true" className="h-3 w-3" />
                      {attraction.timeRequired}
                    </span>
                    {isEditing ? (
                      <span className="flex items-center gap-1 text-xs text-muted font-medium">
                        <input
                          type="number"
                          min={0}
                          value={attraction.estimatedCost}
                          onChange={(e) =>
                            onChangeAttraction?.(attraction.id, {
                              estimatedCost: e.target.value === "" ? 0 : Number(e.target.value),
                            })
                          }
                          className="w-20 rounded border border-accent/40 bg-bg px-1.5 py-0.5 text-xs text-text focus:border-accent focus:outline-none"
                          aria-label={`Cost for ${attraction.name}`}
                        />
                        {currency}
                      </span>
                    ) : (
                      <span className="text-xs text-muted font-medium">
                        {formatMoney(attraction.estimatedCost, currency)}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={attraction.name}
                      onChange={(e) => onChangeAttraction?.(attraction.id, { name: e.target.value })}
                      className="w-full rounded border border-accent/40 bg-bg px-2 py-1 text-lg font-black text-text leading-tight focus:border-accent focus:outline-none"
                      aria-label="Attraction name"
                    />
                  ) : (
                    <h4 className="text-lg font-black text-text leading-tight">
                      {attraction.name}
                    </h4>
                  )}
                  <p className="text-xs text-muted">{attraction.locationDescription}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(attraction.id)}
                  aria-expanded={isExpanded}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-text transition-colors hover:bg-surface-2 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  aria-label={
                    isExpanded
                      ? `Hide details for ${attraction.name}`
                      : `Show details for ${attraction.name}`
                  }
                >
                  <ChevronDownIcon
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Selection Insight summary */}
              {!isExpanded && !isEditing && (
                <p className="mt-3 text-xs text-muted line-clamp-2 leading-relaxed">
                  {attraction.whySelected}
                </p>
              )}
              {!isExpanded && isEditing && (
                <textarea
                  value={attraction.whySelected}
                  onChange={(e) =>
                    onChangeAttraction?.(attraction.id, { whySelected: e.target.value })
                  }
                  rows={2}
                  className="mt-3 w-full rounded border border-accent/40 bg-bg px-2 py-1 text-xs text-text leading-relaxed focus:border-accent focus:outline-none"
                  aria-label={`Why we chose ${attraction.name}`}
                />
              )}

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-border/60 space-y-4 text-xs leading-relaxed animate-fade-in">
                  <div className="space-y-1">
                    <h5 className="font-bold text-accent">Why I chose this</h5>
                    <p className="text-text/90">{attraction.whySelected}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <h5 className="font-bold text-text">Historical Roots</h5>
                      <p className="text-muted">{attraction.history}</p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-text">Cultural Significance</h5>
                      <p className="text-muted">{attraction.culturalSignificance}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <h5 className="flex items-center gap-1.5 font-bold text-text">
                        <LightbulbIcon aria-hidden="true" className="h-3.5 w-3.5 text-accent-2" />
                        Did You Know?
                      </h5>
                      <p className="text-muted">{attraction.interestingFact}</p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="flex items-center gap-1.5 font-bold text-text">
                        <SunriseIcon aria-hidden="true" className="h-3.5 w-3.5 text-accent-2" />
                        Best Time &amp; Light
                      </h5>
                      <p className="text-muted">{attraction.bestTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <h5 className="flex items-center gap-1.5 font-bold text-text">
                        <CameraIcon aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                        Authentic Photo Spot
                      </h5>
                      <p className="text-muted">{attraction.photoSpot}</p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="flex items-center gap-1.5 font-bold text-text">
                        <NavigationIcon aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                        Travel &amp; Logistics
                      </h5>
                      <p className="text-muted">{attraction.travelTips}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="flex items-center gap-1.5 font-bold text-accent-2">
                      <LeafIcon aria-hidden="true" className="h-3.5 w-3.5 text-success" />
                      Responsible Tourism Practice
                    </h5>
                    <p className="text-muted">{attraction.responsibleTip}</p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="flex items-center gap-1.5 font-bold text-accent-2">
                      <GemIcon aria-hidden="true" className="h-3.5 w-3.5" />
                      Secret Near Here
                    </h5>
                    <p className="text-text/90 italic">{attraction.nearbyHiddenExperience}</p>
                  </div>

                  {/* My Local Guide Tip */}
                  <div className="rounded-2xl bg-bg/80 p-4 border-l-4 border-accent space-y-1.5 shadow-sm">
                    <span className="font-bold text-accent block text-xs">My Local Secrets & Advice</span>
                    <p className="text-text/95 italic">&ldquo;{attraction.localSecret}&rdquo;</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Artisan Spotlight Section */}
      {artisanSpotlight.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="inline-flex items-center gap-2 rounded-full bg-surface-3 px-4 py-1.5 text-xs font-black text-text uppercase tracking-wider">
            <PaletteIcon aria-hidden="true" className="h-4 w-4 text-accent-2" />
            Traditional Artisans &amp; Craft Sourcing
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {artisanSpotlight.map((artisan, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-[box-shadow,transform] duration-300 glass flex flex-col justify-between gap-3 hover:-translate-y-0.5 hover:shadow-e2"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent-2 bg-accent-2/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {artisan.craft}
                    </span>
                    <span className="text-[10px] font-bold text-muted">
                      {formatMoney(artisan.estimatedCost, currency)} est.
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-text">{artisan.masterArtisan}</h5>
                  <p className="text-xs text-muted leading-relaxed">
                    Location: {artisan.locationDescription}
                  </p>
                </div>

                <div className="border-t border-border/40 pt-2 text-[11px] text-text/80 leading-relaxed italic">
                  <span className="font-semibold text-accent block not-italic">Community Impact:</span>
                  &ldquo;{artisan.impactStatement}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
