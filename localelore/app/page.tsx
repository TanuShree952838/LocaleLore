"use client";

import { useEffect, useRef, useState } from "react";
import type { TravelContext } from "@/lib/types";
import { useGeneratePlan } from "@/hooks/useGeneratePlan";
import { DestinationPreferencesForm } from "@/components/form/DestinationPreferencesForm";
import { PlanDashboard } from "@/components/results/PlanDashboard";
import { PlanSkeleton } from "@/components/results/PlanSkeleton";
import { ResultsErrorBoundary } from "@/components/results/ResultsErrorBoundary";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Toast } from "@/components/ui/Toast";

export default function HomePage() {
  const { status, plan, meta, error, generate } = useGeneratePlan();
  const [lastContext, setLastContext] = useState<TravelContext | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current === "loading" && status === "success") {
      setToast("Your cultural odyssey plan is ready!");
    }
    prevStatus.current = status;
  }, [status]);

  const handleSubmit = (context: TravelContext) => {
    setLastContext(context);
    generate(context);
  };

  const handleRetry = () => {
    if (lastContext) generate(lastContext);
  };

  const activeGuide = plan?.timeline[0]?.localGuideInsight ? (lastContext?.residentGuide || "historian") : "historian";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight text-text sm:text-4xl">
          Discover Places Through Local Eyes
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base leading-relaxed">
          Experience authentic destinations, read immersive local stories, discover hidden artisan crafts, and explore walking routes through the eyes of local residents. Powered by Google Gemini.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <section aria-label="Odyssey Preferences" className="lg:sticky lg:top-20 lg:self-start">
          <DestinationPreferencesForm onSubmit={handleSubmit} isLoading={status === "loading"} />
        </section>

        <section aria-label="Your Travel Odyssey" aria-busy={status === "loading"} className="space-y-6">
          {status === "loading" && <PlanSkeleton />}

          {status === "error" && error && (
            <ErrorBanner message={error.message} onRetry={lastContext ? handleRetry : undefined} />
          )}

          {status === "success" && plan && (
            <ResultsErrorBoundary>
              <PlanDashboard plan={plan} meta={meta} guideType={activeGuide} />
            </ResultsErrorBoundary>
          )}

          {status === "idle" && (
            <EmptyState
              title="No Odyssey Curated Yet"
              description="Tell us your destination and select a resident guide on the left to begin your journey."
            />
          )}
        </section>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
