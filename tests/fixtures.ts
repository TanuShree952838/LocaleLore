import type { DayContext } from "@/lib/types";
import type { RawMealPlanParsed } from "@/lib/validation/output";

/** A valid day context used across tests. */
export function makeContext(overrides: Partial<DayContext> = {}): DayContext {
  return {
    wakeTime: "07:00",
    dinnerTime: "20:00",
    scheduleNote: "Busy workday",
    includeMeals: ["breakfast", "lunch", "dinner"],
    servings: 2,
    budget: 500,
    currency: "INR",
    dietary: ["vegetarian"],
    avoid: "peanuts",
    pantry: "rice, eggs",
    skill: "beginner",
    ...overrides,
  };
}

/** A valid raw AI plan (as if it passed schema validation). */
export function makeRawPlan(overrides: Partial<RawMealPlanParsed> = {}): RawMealPlanParsed {
  return {
    summary: "A balanced, budget-friendly vegetarian day.",
    meals: [
      {
        slot: "breakfast",
        title: "Veg Poha",
        summary: "Light flattened-rice breakfast.",
        steps: ["Rinse poha", "Temper spices", "Combine and serve"],
        prepMinutes: 15,
        estimatedCost: 60,
      },
      {
        slot: "lunch",
        title: "Rajma Rice",
        summary: "Protein-rich kidney bean curry with rice.",
        steps: ["Cook rajma", "Prepare gravy", "Serve with rice"],
        prepMinutes: 40,
        estimatedCost: 120,
      },
      {
        slot: "dinner",
        title: "Veg Pulao",
        summary: "One-pot spiced rice with vegetables.",
        steps: ["Saute veggies", "Add rice and water", "Cook and rest"],
        prepMinutes: 30,
        estimatedCost: 100,
      },
    ],
    tasks: [
      { time: "07:00", title: "Soak rajma check", durationMinutes: 5, meal: "lunch" },
      { time: "07:30", title: "Make poha", durationMinutes: 15, meal: "breakfast" },
      { time: "12:30", title: "Cook rajma rice", durationMinutes: 40, meal: "lunch" },
      { time: "19:30", title: "Cook veg pulao", durationMinutes: 30, meal: "dinner" },
    ],
    grocery: [
      { name: "Poha", quantity: "200g", category: "grains", estimatedCost: 30 },
      { name: "Kidney beans", quantity: "250g", category: "protein", estimatedCost: 80 },
      { name: "Mixed vegetables", quantity: "400g", category: "produce", estimatedCost: 90 },
      { name: "Rice", quantity: "500g", category: "grains", estimatedCost: 60 },
    ],
    substitutions: [
      {
        original: "Paneer",
        replacement: "Tofu",
        reason: "Cheaper and dairy-free.",
        savesAmount: 40,
      },
    ],
    budget: {
      status: "within_budget",
      estimatedTotal: 260,
      explanation: "Comfortably under the 500 budget.",
    },
    ...overrides,
  };
}
