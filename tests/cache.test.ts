import { beforeEach, describe, expect, it } from "vitest";
import {
  getCachedPlan,
  hashContext,
  setCachedPlan,
  __resetCache,
} from "@/lib/cache";
import { normalizePlan } from "@/lib/plan/normalize";
import { makeContext, makeRawPlan } from "./fixtures";

describe("cache", () => {
  beforeEach(() => __resetCache());

  it("produces identical hashes for equivalent contexts (order-insensitive)", () => {
    const a = makeContext({ dietary: ["vegetarian", "nut-free"], includeMeals: ["lunch", "breakfast"] });
    const b = makeContext({ dietary: ["nut-free", "vegetarian"], includeMeals: ["breakfast", "lunch"] });
    expect(hashContext(a)).toBe(hashContext(b));
  });

  it("produces different hashes when a meaningful field changes", () => {
    expect(hashContext(makeContext({ budget: 500 }))).not.toBe(
      hashContext(makeContext({ budget: 600 })),
    );
  });

  it("stores and retrieves a plan by key", () => {
    const plan = normalizePlan(makeRawPlan(), makeContext());
    const key = hashContext(makeContext());
    expect(getCachedPlan(key)).toBeNull();
    setCachedPlan(key, plan);
    expect(getCachedPlan(key)?.summary).toBe(plan.summary);
  });
});
