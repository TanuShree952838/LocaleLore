"use client";

import { useId, useState } from "react";
import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/ui/Button";
import {
  CURRENCIES,
  GUIDE_ARCHETYPES,
  type TravelContext,
  type GuideArchetype,
  type TravelStyle,
  type Currency,
} from "@/lib/types";
import { travelContextSchema } from "@/lib/validation/input";

interface DestinationPreferencesFormProps {
  onSubmit: (data: TravelContext) => void;
  isLoading: boolean;
}

export function DestinationPreferencesForm({
  onSubmit,
  isLoading,
}: DestinationPreferencesFormProps) {
  const formId = useId();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(2);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("balanced");
  const [residentGuide, setResidentGuide] = useState<GuideArchetype>("historian");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [sustainableFocus, setSustainableFocus] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");
  const [specialInterests, setSpecialInterests] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const numericBudget = parseFloat(budget);

    const payload = {
      destination,
      days,
      travelStyle,
      residentGuide,
      budget: isNaN(numericBudget) ? 0 : numericBudget,
      currency,
      sustainableFocus,
      dietaryRestrictions,
      accessibilityNeeds,
      specialInterests,
    };

    const result = travelContextSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);

      // Focus first error field for accessibility
      const firstErrorKey = Object.keys(fieldErrors)[0];
      if (firstErrorKey) {
        const element = document.getElementById(`${formId}-${firstErrorKey}`);
        element?.focus();
      }
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  const guideLabels: Record<GuideArchetype, { title: string; desc: string; icon: string }> = {
    historian: {
      title: "Anya the Historian",
      desc: "Folklore, ancient legends, & architectural heritage.",
      icon: "📜",
    },
    foodie: {
      title: "Marcus the Foodie",
      desc: "Street carts, traditional recipes, & local markets.",
      icon: "🍜",
    },
    artisan: {
      title: "Kavi the Artisan",
      desc: "Traditional craft workshops & sustainable co-ops.",
      icon: "🏺",
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-8 glass"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text">Design Your Odyssey</h2>
        <p className="text-sm text-muted">
          Tell us where you want to go and choose a local guide to curate your cultural timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          id={`${formId}-destination`}
          label="Where to?"
          hint="Destination city, region, or country"
          error={errors.destination}
          required
        >
          <input
            id={`${formId}-destination`}
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Kyoto, Japan or Florence, Italy"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
            aria-describedby={errors.destination ? `${formId}-destination-error` : undefined}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id={`${formId}-days`}
            label="Duration"
            hint="Number of days"
            error={errors.days}
            required
          >
            <select
              id={`${formId}-days`}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "Day" : "Days"}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id={`${formId}-travelStyle`}
            label="Odyssey Focus"
            hint="Theme of exploration"
            error={errors.travelStyle}
            required
          >
            <select
              id={`${formId}-travelStyle`}
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
              disabled={isLoading}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
            >
              <option value="balanced">Balanced Vibe</option>
              <option value="cultural">Heritage & History</option>
              <option value="culinary">Culinary & Foods</option>
              <option value="artisan">Crafts & Artisans</option>
              <option value="adventure">Hidden Explorer</option>
            </select>
          </FormField>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-text">Choose Your Resident Guide</legend>
        <p className="text-xs text-muted">
          Your resident guide will narrate the storytelling cards and provide local tips.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GUIDE_ARCHETYPES.map((guide) => {
            const isSelected = residentGuide === guide;
            const info = guideLabels[guide];
            return (
              <label
                key={guide}
                className={`relative flex cursor-pointer flex-col rounded-xl border p-4 text-left transition-all hover:bg-bg ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-surface"
                }`}
              >
                <input
                  type="radio"
                  name="residentGuide"
                  value={guide}
                  checked={isSelected}
                  onChange={() => setResidentGuide(guide)}
                  disabled={isLoading}
                  className="sr-only"
                />
                <span className="text-2xl" aria-hidden="true">
                  {info.icon}
                </span>
                <span className="mt-2 text-sm font-bold text-text">{info.title}</span>
                <span className="mt-1 text-xs text-muted leading-relaxed">{info.desc}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <FormField
              id={`${formId}-budget`}
              label="Budget"
              hint="Max total trip spending"
              error={errors.budget}
              required
            >
              <input
                id={`${formId}-budget`}
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isLoading}
                placeholder="e.g. 800"
                min="1"
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
              />
            </FormField>
          </div>
          <div className="col-span-1">
            <FormField
              id={`${formId}-currency`}
              label="Currency"
              hint="Select standard"
              error={errors.currency}
              required
            >
              <select
                id={`${formId}-currency`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <div className="flex items-center pt-6">
          <label className="relative flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={sustainableFocus}
              onChange={(e) => setSustainableFocus(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent/25"
            />
            <div className="leading-snug">
              <span className="text-sm font-medium text-text">Sustainable Focus</span>
              <p className="text-xs text-muted">
                Prioritize indigenous artisans, carbon-neutral routes, & traditional preservation.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <FormField
          id={`${formId}-specialInterests`}
          label="Special Interests"
          hint="Any specific hobbies or desires?"
          error={errors.specialInterests}
        >
          <input
            id={`${formId}-specialInterests`}
            type="text"
            value={specialInterests}
            onChange={(e) => setSpecialInterests(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., green tea, ceramic pottery"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
        </FormField>

        <FormField
          id={`${formId}-dietaryRestrictions`}
          label="Dietary Restrictions"
          hint="Any restrictions or allergies?"
          error={errors.dietaryRestrictions}
        >
          <input
            id={`${formId}-dietaryRestrictions`}
            type="text"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., vegetarian, no peanuts"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
        </FormField>

        <FormField
          id={`${formId}-accessibilityNeeds`}
          label="Accessibility & Pacing"
          hint="Physical limits or speed preferences"
          error={errors.accessibilityNeeds}
        >
          <input
            id={`${formId}-accessibilityNeeds`}
            type="text"
            value={accessibilityNeeds}
            onChange={(e) => setAccessibilityNeeds(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., low stairs, slow pacing"
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand hover:opacity-90 font-semibold py-2.5 rounded-lg text-white transition-opacity shadow-sm"
      >
        {isLoading ? "Curating Odyssey..." : "Unveil My Cultural Odyssey"}
      </Button>
    </form>
  );
}
