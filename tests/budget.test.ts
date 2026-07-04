import { describe, expect, it } from "vitest";
import { computeFeasibility, round2 } from "@/lib/budget/computeFeasibility";
import { normalizePlan } from "@/lib/plan/normalize";
import { makeContext, makeRawPlan } from "./fixtures";

describe("round2", () => {
  it("rounds to two decimals without float drift", () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
    expect(round2(260.005)).toBe(260.01);
  });
});

describe("computeFeasibility (authoritative budget math)", () => {
  const grocery = makeRawPlan().grocery; // sum = 30+80+90+60 = 260

  it("computes total from grocery, ignoring AI's number", () => {
    const result = computeFeasibility(
      grocery,
      { status: "within_budget", estimatedTotal: 9999, explanation: "x" },
      500,
      "INR",
    );
    expect(result.estimatedTotal).toBe(260);
    expect(result.remaining).toBe(240);
    expect(result.status).toBe("within_budget");
  });

  it("overrides an AI 'within_budget' claim when it is actually over", () => {
    const result = computeFeasibility(
      grocery,
      { status: "within_budget", estimatedTotal: 100, explanation: "x" },
      200,
      "INR",
    );
    expect(result.status).toBe("over_budget");
    expect(result.remaining).toBe(-60);
  });

  it("preserves 'revised_to_fit' when it genuinely fits", () => {
    const result = computeFeasibility(
      grocery,
      { status: "revised_to_fit", estimatedTotal: 260, explanation: "x" },
      300,
      "INR",
    );
    expect(result.status).toBe("revised_to_fit");
  });

  it("handles a zero-sum grocery list edge case", () => {
    const result = computeFeasibility(
      [{ name: "Water", quantity: "1L", category: "other", estimatedCost: 0 }],
      { status: "within_budget", estimatedTotal: 0, explanation: "x" },
      100,
      "USD",
    );
    expect(result.estimatedTotal).toBe(0);
    expect(result.remaining).toBe(100);
  });
});

describe("normalizePlan", () => {
  it("assigns stable ids and sorts tasks chronologically", () => {
    const plan = normalizePlan(makeRawPlan(), makeContext());
    expect(plan.meals[0]?.id).toBe("meal-breakfast");
    expect(plan.grocery.every((g) => g.id.startsWith("grocery-"))).toBe(true);
    const times = plan.tasks.map((t) => t.time);
    expect(times).toEqual([...times].sort());
  });

  it("carries the correct currency and recomputed budget", () => {
    const plan = normalizePlan(makeRawPlan(), makeContext({ budget: 500, currency: "INR" }));
    expect(plan.budget.currency).toBe("INR");
    expect(plan.budget.estimatedTotal).toBe(260);
    expect(plan.budget.budgetLimit).toBe(500);
  });
});
