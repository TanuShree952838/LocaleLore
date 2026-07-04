import { createHash } from "node:crypto";
import type { TravelContext, TravelPlan } from "@/lib/types";

const MAX_ENTRIES = 50;
const TTL_MS = 15 * 60 * 1000; // 15 minutes cache TTL

interface Entry {
  plan: TravelPlan;
  expiresAt: number;
}

const store = new Map<string, Entry>();

/** Deterministic key from the travel preferences context. */
export function hashContext(context: TravelContext): string {
  const canonical = JSON.stringify({
    destination: context.destination.toLowerCase(),
    days: context.days,
    travelStyle: context.travelStyle,
    residentGuide: context.residentGuide,
    budget: context.budget,
    currency: context.currency,
    sustainableFocus: context.sustainableFocus,
    dietaryRestrictions: context.dietaryRestrictions.toLowerCase(),
    accessibilityNeeds: context.accessibilityNeeds.toLowerCase(),
    specialInterests: context.specialInterests.toLowerCase(),
  });
  return createHash("sha256").update(canonical).digest("hex");
}

export function getCachedPlan(key: string): TravelPlan | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  // Refresh LRU recency
  store.delete(key);
  store.set(key, entry);
  return entry.plan;
}

export function setCachedPlan(key: string, plan: TravelPlan): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { plan, expiresAt: Date.now() + TTL_MS });
}

export function __resetCache(): void {
  store.clear();
}
