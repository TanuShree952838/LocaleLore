import { describe, expect, it } from "vitest";
import { dayContextSchema, INPUT_LIMITS } from "@/lib/validation/input";
import { rawMealPlanSchema } from "@/lib/validation/output";
import { makeContext, makeRawPlan } from "./fixtures";

describe("dayContextSchema (input validation)", () => {
  it("accepts a valid context (happy path)", () => {
    const result = dayContextSchema.safeParse(makeContext());
    expect(result.success).toBe(true);
  });

  it("applies defaults for optional fields when omitted", () => {
    const result = dayContextSchema.safeParse({
      wakeTime: "06:30",
      dinnerTime: "21:00",
      includeMeals: ["dinner"],
      servings: 1,
      budget: 100,
      currency: "USD",
      skill: "advanced",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dietary).toEqual([]);
      expect(result.data.avoid).toBe("");
      expect(result.data.pantry).toBe("");
      expect(result.data.scheduleNote).toBe("");
    }
  });

  it("rejects a zero budget (invalid input)", () => {
    const result = dayContextSchema.safeParse(makeContext({ budget: 0 }));
    expect(result.success).toBe(false);
  });

  it("rejects a negative budget", () => {
    expect(dayContextSchema.safeParse(makeContext({ budget: -50 })).success).toBe(false);
  });

  it("rejects an empty meals array (blank input)", () => {
    const result = dayContextSchema.safeParse(makeContext({ includeMeals: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects duplicate meals", () => {
    const result = dayContextSchema.safeParse(
      makeContext({ includeMeals: ["lunch", "lunch"] as never }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects an invalid time format", () => {
    expect(dayContextSchema.safeParse(makeContext({ wakeTime: "7am" })).success).toBe(false);
    expect(dayContextSchema.safeParse(makeContext({ dinnerTime: "25:00" })).success).toBe(false);
  });

  it("rejects over-long free text (large input)", () => {
    const huge = "a".repeat(INPUT_LIMITS.avoid + 1);
    expect(dayContextSchema.safeParse(makeContext({ avoid: huge })).success).toBe(false);
  });

  it("rejects non-numeric servings/budget", () => {
    expect(dayContextSchema.safeParse(makeContext({ servings: NaN })).success).toBe(false);
    expect(dayContextSchema.safeParse(makeContext({ budget: Infinity })).success).toBe(false);
  });

  it("rejects unknown currency and dietary tags", () => {
    expect(dayContextSchema.safeParse(makeContext({ currency: "BTC" as never })).success).toBe(false);
    expect(
      dayContextSchema.safeParse(makeContext({ dietary: ["keto" as never] })).success,
    ).toBe(false);
  });
});

describe("rawMealPlanSchema (AI output validation)", () => {
  it("accepts a well-formed plan", () => {
    expect(rawMealPlanSchema.safeParse(makeRawPlan()).success).toBe(true);
  });

  it("defaults missing savesAmount to 0", () => {
    const plan = makeRawPlan();
    const sub = { ...plan.substitutions[0] } as Record<string, unknown>;
    delete sub.savesAmount;
    const result = rawMealPlanSchema.safeParse({ ...plan, substitutions: [sub] });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.substitutions[0]?.savesAmount).toBe(0);
  });

  it("rejects negative costs (edge case)", () => {
    const plan = makeRawPlan();
    const bad = { ...plan, grocery: [{ ...plan.grocery[0]!, estimatedCost: -1 }] };
    expect(rawMealPlanSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an unknown meal slot", () => {
    const plan = makeRawPlan();
    const bad = { ...plan, meals: [{ ...plan.meals[0]!, slot: "brunch" }] };
    expect(rawMealPlanSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an empty grocery list", () => {
    expect(rawMealPlanSchema.safeParse(makeRawPlan({ grocery: [] })).success).toBe(false);
  });

  it("rejects completely malformed JSON shape", () => {
    expect(rawMealPlanSchema.safeParse({ foo: "bar" }).success).toBe(false);
  });
});
