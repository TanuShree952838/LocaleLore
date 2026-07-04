import { describe, expect, it } from "vitest";
import { travelContextSchema, INPUT_LIMITS } from "@/lib/validation/input";
import { rawTravelPlanSchema } from "@/lib/validation/output";
import { makeContext, makeRawPlan } from "./fixtures";

describe("travelContextSchema (input validation)", () => {
  it("accepts a valid context (happy path)", () => {
    const result = travelContextSchema.safeParse(makeContext());
    expect(result.success).toBe(true);
  });

  it("applies defaults for optional fields when omitted", () => {
    const result = travelContextSchema.safeParse({
      destination: "Kyoto, Japan",
      days: 2,
      travelStyle: "cultural",
      residentGuide: "historian",
      budget: 800,
      currency: "USD",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sustainableFocus).toBe(false);
      expect(result.data.dietaryRestrictions).toBe("");
      expect(result.data.accessibilityNeeds).toBe("");
      expect(result.data.specialInterests).toBe("");
    }
  });

  it("rejects a zero budget (invalid input)", () => {
    const result = travelContextSchema.safeParse(makeContext({ budget: 0 }));
    expect(result.success).toBe(false);
  });

  it("rejects a negative budget", () => {
    expect(travelContextSchema.safeParse(makeContext({ budget: -50 })).success).toBe(false);
  });

  it("rejects non-numeric budget", () => {
    expect(travelContextSchema.safeParse(makeContext({ budget: Infinity })).success).toBe(false);
  });

  it("rejects unknown currency", () => {
    expect(travelContextSchema.safeParse(makeContext({ currency: "BTC" as never })).success).toBe(false);
  });

  it("rejects over-long free text (large input)", () => {
    const huge = "a".repeat(INPUT_LIMITS.dietaryRestrictions + 1);
    expect(travelContextSchema.safeParse(makeContext({ dietaryRestrictions: huge })).success).toBe(false);
  });
});

describe("rawTravelPlanSchema (AI output validation)", () => {
  it("accepts a well-formed travel plan", () => {
    const result = rawTravelPlanSchema.safeParse(makeRawPlan());
    expect(result.success).toBe(true);
  });

  it("rejects negative costs (edge case)", () => {
    const plan = makeRawPlan();
    const bad = { ...plan, estimatedTotalCost: -5 };
    expect(rawTravelPlanSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects empty attractions list", () => {
    expect(rawTravelPlanSchema.safeParse(makeRawPlan({ attractions: [] })).success).toBe(false);
  });

  it("rejects completely malformed JSON shape", () => {
    expect(rawTravelPlanSchema.safeParse({ foo: "bar" }).success).toBe(false);
  });
});
