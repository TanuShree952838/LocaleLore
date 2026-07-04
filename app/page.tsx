"use client";

import { useEffect, useRef, useState } from "react";
import type { DayContext } from "@/lib/types";
import { useGeneratePlan } from "@/hooks/useGeneratePlan";
import { DayContextForm } from "@/components/form/DayContextForm";
import { PlanDashboard } from "@/components/results/PlanDashboard";
import { PlanSkeleton } from "@/components/results/PlanSkeleton";
import { ResultsErrorBoundary } from "@/components/results/ResultsErrorBoundary";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Toast } from "@/components/ui/Toast";

export default function HomePage() {
  const { status, plan, meta, error, generate } = useGeneratePlan();
  const [lastContext, setLastContext] = useState<DayContext | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current === "loading" && status === "success") {
      setToast("Your cooking plan is ready");
    }
    prevStatus.current = status;
  }, [status]);

  const handleSubmit = (context: DayContext) => {
    setLastContext(context);
    generate(context);
  };

  const handleRetry = () => {
    if (lastContext) generate(lastContext);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Plan your day&apos;s cooking in one tap
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Tell CookFlow about your day and budget. Get a timed cooking to-do list,
          a grocery list, smart substitutions, and a real budget check — generated
          by Google Gemini.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <section aria-label="Plan your day" className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <DayContextForm onSubmit={handleSubmit} isSubmitting={status === "loading"} />
          </div>
        </section>

        <section aria-label="Your cooking plan" aria-busy={status === "loading"}>
          {status === "loading" && <PlanSkeleton />}

          {status === "error" && error && (
            <ErrorBanner message={error.message} onRetry={lastContext ? handleRetry : undefined} />
          )}

          {status === "success" && plan && (
            <ResultsErrorBoundary>
              <PlanDashboard plan={plan} meta={meta} onCopied={setToast} />
            </ResultsErrorBoundary>
          )}

          {status === "idle" && (
            <EmptyState
              title="No plan yet"
              description="Fill in your day on the left and generate a personalized cooking plan."
            />
          )}
        </section>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
