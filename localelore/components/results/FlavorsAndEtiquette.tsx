import { useState } from "react";
import type {
  EtiquetteItem,
  FoodRecommendation,
  CulturalEvent,
  LanguagePhrase,
  Currency,
} from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import {
  UtensilsCrossedIcon,
  ClockIcon,
  UsersIcon,
  CalendarDaysIcon,
  LanguagesIcon,
  CopyIcon,
  CheckIcon,
} from "@/components/ui/Icon";

interface FlavorsAndEtiquetteProps {
  etiquette: EtiquetteItem[];
  food: FoodRecommendation[];
  events: CulturalEvent[];
  phrases: LanguagePhrase[];
  currency: Currency;
}

export function FlavorsAndEtiquette({
  etiquette,
  food,
  events,
  phrases,
  currency,
}: FlavorsAndEtiquetteProps) {
  const [copied, setCopied] = useState(false);

  const copyPhrases = () => {
    const text = phrases
      .map((p) => `${p.original} (${p.phonetic}) -> ${p.meaning}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Food Recommendations */}
      <section className="space-y-4">
        <h4 className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-3 py-1 text-xs font-black text-text uppercase tracking-wider">
          <UtensilsCrossedIcon aria-hidden="true" className="h-4 w-4 text-accent-2" />
          Local Flavors &amp; Culinary Customs
        </h4>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {food.map((dish) => (
            <div
              key={dish.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-base font-bold text-text leading-tight">{dish.name}</h5>
                  <span className="text-xs font-bold text-accent whitespace-nowrap">
                    {formatMoney(dish.estimatedCost, currency)}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{dish.description}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-2">
                  <ClockIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Best visiting time: {dish.bestTime}</span>
                </div>
              </div>

              {/* Resident Food Advice */}
              <div className="rounded-xl bg-bg/80 p-3 border-l-2 border-accent text-xs">
                <span className="font-bold text-accent block mb-0.5">Local food tip</span>
                <p className="text-text/90 italic leading-relaxed">&ldquo;{dish.authenticTip}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Etiquette & Customs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <h4 className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-3 py-1 text-xs font-black text-text uppercase tracking-wider">
            <UsersIcon aria-hidden="true" className="h-4 w-4 text-accent" />
            Unwritten Etiquette &amp; Customs
          </h4>

          <div className="space-y-4">
            {etiquette.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm glass space-y-2"
              >
                <h5 className="text-xs font-black text-text uppercase tracking-wider">
                  Situation: {item.situation}
                </h5>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text/90 font-semibold block">The Custom:</strong>
                  {item.custom}
                </p>
                <p className="text-xs text-accent italic leading-relaxed">
                  <strong className="text-accent font-semibold block not-italic">Local tip:</strong>
                  &ldquo;{item.residentTip}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Festivals & Events */}
        <section className="space-y-4">
          <h4 className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-3 py-1 text-xs font-black text-text uppercase tracking-wider">
            <CalendarDaysIcon aria-hidden="true" className="h-4 w-4 text-accent" />
            Local Festivals &amp; Events
          </h4>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm glass space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-text leading-tight">{event.name}</h5>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase shrink-0">
                    {event.timeOrSeason}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text/90 font-semibold block">Significance:</strong>
                  {event.significance}
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text/90 font-semibold block">How to Participate:</strong>
                  {event.travelerParticipation}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Local Phrases */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-3 py-1 text-xs font-black text-text uppercase tracking-wider">
            <LanguagesIcon aria-hidden="true" className="h-4 w-4 text-accent" />
            Handy Local Phrases
          </h4>
          <Button
            onClick={copyPhrases}
            aria-live="polite"
            className="gap-1.5 text-[11px] font-bold border border-border bg-surface hover:bg-surface-2 px-2.5 py-1 h-auto rounded-lg"
          >
            {copied ? (
              <>
                <CheckIcon aria-hidden="true" className="h-3.5 w-3.5 text-success" />
                Copied to Notes
              </>
            ) : (
              <>
                <CopyIcon aria-hidden="true" className="h-3.5 w-3.5" />
                Copy Phrases
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="rounded-xl border border-border bg-surface p-3.5 shadow-sm glass flex flex-col justify-between gap-1.5"
            >
              <div className="space-y-0.5">
                <span className="text-base font-bold text-accent">{phrase.original}</span>
                <span className="text-[10px] text-muted block italic">
                  Pronounced: &ldquo;{phrase.phonetic}&rdquo;
                </span>
              </div>
              <div className="border-t border-border/40 pt-1.5 text-xs text-text/90 font-medium">
                Meaning: {phrase.meaning}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
