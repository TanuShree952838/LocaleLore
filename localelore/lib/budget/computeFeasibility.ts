import type {
  BudgetFeasibility,
  Currency,
  BudgetStatus,
  RawAttraction,
  RawFoodRecommendation,
  RawArtisanSpotlight,
} from "@/lib/types";

/** Rounds to 2 decimal places, avoiding binary float drift. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Recomputes travel budget feasibility from the ground truth: the sum of
 * attraction costs, artisan spotlight purchases, and food recommendations.
 */
export function computeTravelFeasibility(
  attractions: RawAttraction[],
  foodRecommendations: RawFoodRecommendation[],
  artisanSpotlights: RawArtisanSpotlight[],
  budgetLimit: number,
  currency: Currency,
  aiTotalCost: number
): BudgetFeasibility {
  const attractionsCost = attractions.reduce((sum, item) => sum + item.estimatedCost, 0);
  const foodCost = foodRecommendations.reduce((sum, item) => sum + item.estimatedCost, 0);
  const artisanCost = artisanSpotlights.reduce((sum, item) => sum + item.estimatedCost, 0);

  const estimatedTotal = round2(attractionsCost + foodCost + artisanCost);
  const remaining = round2(budgetLimit - estimatedTotal);
  const fits = estimatedTotal <= budgetLimit;

  let status: BudgetStatus;
  if (fits) {
    // If the model claimed it revised or if it simply fits, set status
    status = estimatedTotal < aiTotalCost ? "revised_to_fit" : "within_budget";
  } else {
    status = "over_budget";
  }

  const explanation = status === "over_budget"
    ? `The total estimated cost (${estimatedTotal} ${currency}) exceeds your budget limit of ${budgetLimit} ${currency}. Consider removing some attractions or workshops.`
    : `Your itinerary fits comfortably within your budget! You have ${remaining} ${currency} remaining.`;

  return {
    status,
    estimatedTotal,
    budgetLimit: round2(budgetLimit),
    remaining,
    currency,
    explanation,
  };
}
