import { describe, expect, it } from "vitest";
import { computeTravelFeasibility, round2 } from "@/lib/budget/computeFeasibility";
import { normalizeTravelPlan } from "@/lib/plan/normalize";
import { makeContext, makeRawPlan } from "./fixtures";

describe("round2", () => {
  it("rounds to two decimals without float drift", () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
    expect(round2(260.005)).toBe(260.01);
  });
});

describe("computeTravelFeasibility (authoritative travel budget)", () => {
  const plan = makeRawPlan();
  const attractions = plan.attractions; // sum = 10 + 0 = 10
  const food = plan.foodRecommendations; // sum = 15
  const artisan = plan.artisanSpotlight; // sum = 50
  // Total = 10 + 15 + 50 = 75

  it("computes total from attractions, food, and artisans, ignoring AI total", () => {
    const result = computeTravelFeasibility(
      attractions,
      food,
      artisan,
      800,
      "USD",
      75
    );
    expect(result.estimatedTotal).toBe(75);
    expect(result.remaining).toBe(725);
    expect(result.status).toBe("within_budget");
  });

  it("overrides AI within_budget claim when it is actually over the limit", () => {
    const result = computeTravelFeasibility(
      attractions,
      food,
      artisan,
      50,
      "USD",
      75
    );
    expect(result.status).toBe("over_budget");
    expect(result.remaining).toBe(-25);
  });

  it("sets revised_to_fit when the recomputed total is under but AI estimated was higher", () => {
    const result = computeTravelFeasibility(
      attractions,
      food,
      artisan,
      200,
      "USD",
      100
    );
    expect(result.status).toBe("revised_to_fit");
  });
});

describe("normalizeTravelPlan", () => {
  it("assigns stable unique IDs and sorts timeline slots by day and slot order", () => {
    const plan = normalizeTravelPlan(makeRawPlan(), makeContext());
    expect(plan.attractions[0]?.id).toBe("attraction-0");
    expect(plan.walkingRoute.waypoints.every((w) => w.id.startsWith("waypoint-"))).toBe(true);
    expect(plan.timeline.every((t) => t.id.startsWith("timeline-"))).toBe(true);

    const slotOrder = { morning: 1, afternoon: 2, evening: 3 };
    const dayAndSlots = plan.timeline.map((t) => `${t.dayNumber}-${slotOrder[t.slot]}`);
    expect(dayAndSlots).toEqual([...dayAndSlots].sort());
  });

  it("carries the correct currency and recomputed budget", () => {
    const plan = normalizeTravelPlan(makeRawPlan(), makeContext({ budget: 800, currency: "USD" }));
    expect(plan.budget.currency).toBe("USD");
    expect(plan.budget.estimatedTotal).toBe(75);
    expect(plan.budget.budgetLimit).toBe(800);
  });
});
