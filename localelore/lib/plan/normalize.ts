import type { TravelContext, TravelPlan } from "@/lib/types";
import type { RawTravelPlanParsed } from "@/lib/validation/output";
import { computeTravelFeasibility, round2 } from "@/lib/budget/computeFeasibility";

/**
 * Converts a validated raw AI travel plan into the UI-facing `TravelPlan`:
 *   - assigns stable, unique IDs to attractions, food, timeline slots, etc.,
 *   - rounds all monetary values,
 *   - replaces AI budget arithmetic with server-computed feasibility.
 */
export function normalizeTravelPlan(
  raw: RawTravelPlanParsed,
  context: TravelContext
): TravelPlan {
  const attractions = raw.attractions.map((attraction, index) => ({
    ...attraction,
    id: `attraction-${index}`,
    estimatedCost: round2(attraction.estimatedCost),
  }));

  const waypoints = raw.walkingRoute.waypoints.map((wp, index) => ({
    ...wp,
    id: `waypoint-${index}`,
  }));

  const walkingRoute = {
    ...raw.walkingRoute,
    waypoints,
  };

  const localEtiquette = raw.localEtiquette.map((item, index) => ({
    ...item,
    id: `etiquette-${index}`,
  }));

  const foodRecommendations = raw.foodRecommendations.map((food, index) => ({
    ...food,
    id: `food-${index}`,
    estimatedCost: round2(food.estimatedCost),
  }));

  const culturalEvents = raw.culturalEvents.map((event, index) => ({
    ...event,
    id: `event-${index}`,
  }));

  const artisanSpotlight = raw.artisanSpotlight.map((spot, index) => ({
    ...spot,
    id: `artisan-${index}`,
    estimatedCost: round2(spot.estimatedCost),
  }));

  // Sort timeline by day number and slot order (morning -> afternoon -> evening)
  const slotOrder = { morning: 1, afternoon: 2, evening: 3 };
  const timeline = [...raw.timeline]
    .sort((a, b) => {
      if (a.dayNumber !== b.dayNumber) {
        return a.dayNumber - b.dayNumber;
      }
      return slotOrder[a.slot] - slotOrder[b.slot];
    })
    .map((slot, index) => ({
      ...slot,
      id: `timeline-${index}`,
      associatedCost: round2(slot.associatedCost),
    }));

  const localPhrases = raw.localPhrases.map((phrase, index) => ({
    ...phrase,
    id: `phrase-${index}`,
  }));

  const localMythsAndLegends = (raw.localMythsAndLegends || []).map((myth, index) => ({
    ...myth,
    id: `myth-${index}`,
  }));

  const budget = computeTravelFeasibility(
    raw.attractions,
    raw.foodRecommendations,
    raw.artisanSpotlight,
    context.budget,
    context.currency,
    raw.estimatedTotalCost
  );

  return {
    destinationName: raw.destinationName,
    tagline: raw.tagline,
    culturalOverview: raw.culturalOverview,
    heritageScore: raw.heritageScore,
    attractions,
    walkingRoute,
    localEtiquette,
    foodRecommendations,
    culturalEvents,
    artisanSpotlight,
    timeline,
    safetyTips: raw.safetyTips,
    packingItems: raw.packingItems,
    localPhrases,
    sustainableRecommendations: raw.sustainableRecommendations,
    localMythsAndLegends,
    budget,
  };
}
