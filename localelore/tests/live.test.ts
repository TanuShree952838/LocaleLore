import { describe, it, expect } from "vitest";
import { generateTravelPlan } from "@/lib/gemini/client";
import { normalizeTravelPlan } from "@/lib/plan/normalize";
import { makeContext } from "./fixtures";

const hasKey = Boolean(process.env.GEMINI_API_KEY);

describe.runIf(hasKey)("LIVE Gemini full path", () => {
  it("generates + validates + normalizes a real travel plan", async () => {
    const context = makeContext({
      destination: "Kyoto, Japan",
      budget: 800,
      currency: "USD",
      specialInterests: "green tea, temples",
    });

    const { plan, model } = await generateTravelPlan(context);
    const normalized = normalizeTravelPlan(plan, context);

    expect(normalized.attractions.length).toBeGreaterThan(0);
    expect(normalized.timeline.length).toBeGreaterThan(0);
    expect(normalized.localPhrases.length).toBeGreaterThan(0);
    expect(["within_budget", "revised_to_fit", "over_budget"]).toContain(
      normalized.budget.status
    );

    // eslint-disable-next-line no-console
    console.log("LIVE_RESULT " + JSON.stringify({
      model,
      destination: normalized.destinationName,
      tagline: normalized.tagline,
      attractions: normalized.attractions.map((a) => `${a.name}(${a.estimatedCost})`),
      timeline: normalized.timeline.length,
      budget: `${normalized.budget.estimatedTotal}/${normalized.budget.budgetLimit} ${normalized.budget.currency} ${normalized.budget.status}`,
    }));
  }, 45000);
});
