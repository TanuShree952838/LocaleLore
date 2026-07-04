import { beforeEach, describe, expect, it } from "vitest";
import {
  getCachedPlan,
  hashContext,
  setCachedPlan,
  __resetCache,
} from "@/lib/cache";
import { normalizeTravelPlan } from "@/lib/plan/normalize";
import { makeContext, makeRawPlan } from "./fixtures";

describe("cache", () => {
  beforeEach(() => __resetCache());

  it("produces identical hashes for equivalent contexts (case-insensitive & order-insensitive)", () => {
    const a = makeContext({ destination: "Kyoto, Japan", dietaryRestrictions: "vegetarian, nut-free" });
    const b = makeContext({ destination: "kyoto, japan", dietaryRestrictions: "vegetarian, nut-free" });
    expect(hashContext(a)).toBe(hashContext(b));
  });

  it("produces different hashes when a meaningful field changes", () => {
    expect(hashContext(makeContext({ budget: 500 }))).not.toBe(
      hashContext(makeContext({ budget: 600 }))
    );
  });

  it("stores and retrieves a travel plan by key", () => {
    const plan = normalizeTravelPlan(makeRawPlan(), makeContext());
    const key = hashContext(makeContext());
    expect(getCachedPlan(key)).toBeNull();
    setCachedPlan(key, plan);
    expect(getCachedPlan(key)?.destinationName).toBe(plan.destinationName);
  });
});
