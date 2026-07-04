"use client";

import { useEffect, useRef, useState } from "react";
import type { TravelContext } from "@/lib/types";
import { useGeneratePlan } from "@/hooks/useGeneratePlan";
import { DestinationPreferencesForm } from "@/components/form/DestinationPreferencesForm";
import { PlanDashboard } from "@/components/results/PlanDashboard";
import { PlanSkeleton } from "@/components/results/PlanSkeleton";
import { GeneratingIndicator } from "@/components/results/GeneratingIndicator";
import { ResultsErrorBoundary } from "@/components/results/ResultsErrorBoundary";
import { OdysseyPreview } from "@/components/results/OdysseyPreview";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Toast } from "@/components/ui/Toast";

export default function HomePage() {
  const { status, plan, meta, error, guideType, generate } = useGeneratePlan();
  const [lastContext, setLastContext] = useState<TravelContext | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current === "loading" && status === "success") {
      setToast("Your travel plan is ready!");
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

  return (
    <div className="mx-auto w-full max-w-[2160px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 2xl:px-16">
      <section className="mb-6 flex flex-col gap-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black tracking-tight text-text sm:text-4xl lg:text-5xl">
            Plan a trip like a local
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base leading-relaxed">
            Tell us where you&apos;re going and pick a local guide. You&apos;ll get a day-by-day
            plan with the best places to visit, where to eat, walking routes, and the stories
            behind each spot. Powered by Google Gemini.
          </p>
        </div>
        <div className="hidden shrink-0 rounded-2xl border border-border bg-surface/60 p-5 shadow-sm motion-safe:animate-fade-in lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            How it works
          </p>
          <ol aria-label="How it works">
            {[
              "Pick a place and a local guide",
              "Gemini builds your plan",
              "Explore it day by day",
            ].map((step, i, arr) => (
              <li
                key={step}
                className="flex items-start gap-3 motion-safe:animate-slide-up"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <div className="flex flex-col items-center self-stretch">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                  {i < arr.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                </div>
                <span className="pb-4 pt-1 text-sm font-medium text-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-8 xl:gap-10 2xl:gap-12">
        <section aria-label="Trip preferences" className="lg:sticky lg:top-20 lg:self-start">
          <DestinationPreferencesForm onSubmit={handleSubmit} isLoading={status === "loading"} />
        </section>

        <section aria-label="Your travel plan" aria-busy={status === "loading"} className="min-w-0 space-y-6">
          {status === "loading" && (
            <>
              <GeneratingIndicator />
              <PlanSkeleton />
            </>
          )}

          {status === "error" && error && (
            <ErrorBanner message={error.message} onRetry={lastContext ? handleRetry : undefined} />
          )}

          {status === "success" && plan && (
            <ResultsErrorBoundary>
              <PlanDashboard plan={plan} meta={meta} guideType={guideType} />
            </ResultsErrorBoundary>
          )}

          {status === "idle" && <OdysseyPreview />}
        </section>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
