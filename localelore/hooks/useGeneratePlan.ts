"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ApiErrorCode,
  ApiErrorResponse,
  TravelContext,
  GenerateTravelResponse,
  TravelPlan,
  PlanMeta,
} from "@/lib/types";
import { loadPlan, savePlan, clearPlan } from "@/lib/storage";

export type GenerateStatus = "idle" | "loading" | "success" | "error";

export interface PlanError {
  message: string;
  code: ApiErrorCode | "network";
}

interface GenerateState {
  status: GenerateStatus;
  plan: TravelPlan | null;
  meta: PlanMeta | null;
  error: PlanError | null;
}

const INITIAL: GenerateState = {
  status: "idle",
  plan: null,
  meta: null,
  error: null,
};

/**
 * Owns the lifecycle of a travel plan generation request. Concurrent submissions
 * abort the previous request (no duplicate in-flight calls), results are
 * persisted for refresh/offline recovery, and the last saved plan is restored
 * on mount so returning users see their plan immediately.
 */
export function useGeneratePlan() {
  const [state, setState] = useState<GenerateState>(INITIAL);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = loadPlan();
    if (stored) {
      setState({
        status: "success",
        plan: stored.plan,
        meta: null,
        error: null,
      });
    }
    return () => controllerRef.current?.abort();
  }, []);

  const generate = useCallback(async (context: TravelContext) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({ ...prev, status: "loading", error: null }));

    try {
      const response = await fetch("/api/generate-travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
        signal: controller.signal,
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        const err = payload as ApiErrorResponse;
        setState({
          status: "error",
          plan: null,
          meta: null,
          error: {
            message: err?.error ?? "Something went wrong while curating your travel plan. Please try again.",
            code: err?.code ?? "upstream_error",
          },
        });
        return;
      }

      const { plan, meta } = payload as GenerateTravelResponse;
      savePlan(plan);
      setState({ status: "success", plan, meta, error: null });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState({
        status: "error",
        plan: null,
        meta: null,
        error: {
          message: "Network error. Check your connection and try again.",
          code: "network",
        },
      });
    }
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    clearPlan();
    setState(INITIAL);
  }, []);

  return { ...state, generate, reset };
}
