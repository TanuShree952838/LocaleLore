import type { TravelPlan, GuideArchetype } from "@/lib/types";

const PLAN_KEY = "localelore:plan:v1";

export interface StoredPlan {
  plan: TravelPlan;
  savedAt: number;
  /** The resident guide the plan was generated with, so the right narrator is restored on reload. */
  guideType?: GuideArchetype;
}

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJSON<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors
  }
}

function remove(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Ignore.
  }
}

export function savePlan(plan: TravelPlan, guideType?: GuideArchetype): void {
  writeJSON(PLAN_KEY, { plan, savedAt: Date.now(), guideType } satisfies StoredPlan);
}

export function loadPlan(): StoredPlan | null {
  return readJSON<StoredPlan>(PLAN_KEY);
}

export function clearPlan(): void {
  remove(PLAN_KEY);
}
