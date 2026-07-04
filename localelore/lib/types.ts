/**
 * Domain types for LocaleLore: GenAI Cultural Odyssey.
 */

export const GUIDE_ARCHETYPES = ["historian", "foodie", "artisan"] as const;
export type GuideArchetype = (typeof GUIDE_ARCHETYPES)[number];

export const TRAVEL_STYLES = [
  "cultural",
  "culinary",
  "artisan",
  "adventure",
  "balanced",
] as const;
export type TravelStyle = (typeof TRAVEL_STYLES)[number];

export const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const BUDGET_STATUSES = [
  "within_budget",
  "over_budget",
  "revised_to_fit",
] as const;
export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

export const ATTRACTION_TYPES = [
  "attraction",
  "hidden_gem",
  "artisan_workshop",
  "local_event",
] as const;
export type AttractionType = (typeof ATTRACTION_TYPES)[number];

/** Validated travel request context. */
export interface TravelContext {
  destination: string;
  days: number;
  travelStyle: TravelStyle;
  residentGuide: GuideArchetype;
  budget: number;
  currency: Currency;
  sustainableFocus: boolean;
  dietaryRestrictions: string;
  accessibilityNeeds: string;
  specialInterests: string;
}

/* ------------------------------------------------------------------ *
 * Raw AI Payload (no IDs, pure JSON structured output)              *
 * ------------------------------------------------------------------ */

export interface RawAttraction {
  name: string;
  type: AttractionType;
  whySelected: string;
  history: string;
  culturalSignificance: string;
  interestingFact: string;
  bestTime: string;
  localTip: string;
  localSecret: string;
  travelTips: string;
  nearbyHiddenExperience: string;
  locationDescription: string;
  estimatedCost: number;
  timeRequired: string;
  photoSpot: string;
  responsibleTip: string;
}

export interface RawLocalMyth {
  title: string;
  story: string;
  culturalContext: string;
}

export interface RawWaypoint {
  title: string;
  description: string;
  durationMinutes: number;
}

export interface RawWalkingRoute {
  title: string;
  totalDurationMinutes: number;
  waypoints: RawWaypoint[];
  routePathSvg: string; // custom SVG path representation (e.g. M10,20 L30,40...)
}

export interface RawEtiquetteItem {
  situation: string;
  custom: string;
  residentTip: string;
}

export interface RawFoodRecommendation {
  name: string;
  description: string;
  authenticTip: string;
  bestTime: string;
  estimatedCost: number;
}

export interface RawCulturalEvent {
  name: string;
  timeOrSeason: string;
  significance: string;
  travelerParticipation: string;
}

export interface RawArtisanSpotlight {
  craft: string;
  masterArtisan: string;
  locationDescription: string;
  impactStatement: string;
  estimatedCost: number;
}

export interface RawTimelineSlot {
  dayNumber: number;
  slot: "morning" | "afternoon" | "evening";
  activityTitle: string;
  activityDescription: string;
  localGuideInsight: string;
  associatedCost: number;
}

export interface RawLanguagePhrase {
  original: string;
  phonetic: string;
  meaning: string;
}

export interface RawTravelPlan {
  destinationName: string;
  tagline: string;
  culturalOverview: string;
  heritageScore: number; // 1 to 100
  attractions: RawAttraction[];
  walkingRoute: RawWalkingRoute;
  localEtiquette: RawEtiquetteItem[];
  foodRecommendations: RawFoodRecommendation[];
  culturalEvents: RawCulturalEvent[];
  artisanSpotlight: RawArtisanSpotlight[];
  timeline: RawTimelineSlot[];
  safetyTips: string[];
  packingItems: string[];
  localPhrases: RawLanguagePhrase[];
  sustainableRecommendations: string[];
  localMythsAndLegends: RawLocalMyth[];
  estimatedTotalCost: number;
}

/* ------------------------------------------------------------------ *
 * UI-Facing Normalised plan (IDs added, calculations verified)      *
 * ------------------------------------------------------------------ */

export interface Attraction extends RawAttraction {
  id: string;
}

export interface Waypoint extends RawWaypoint {
  id: string;
}

export interface WalkingRoute extends Omit<RawWalkingRoute, "waypoints"> {
  waypoints: Waypoint[];
}

export interface EtiquetteItem extends RawEtiquetteItem {
  id: string;
}

export interface FoodRecommendation extends RawFoodRecommendation {
  id: string;
}

export interface CulturalEvent extends RawCulturalEvent {
  id: string;
}

export interface ArtisanSpotlight extends RawArtisanSpotlight {
  id: string;
}

export interface TimelineSlot extends RawTimelineSlot {
  id: string;
}

export interface LanguagePhrase extends RawLanguagePhrase {
  id: string;
}

export interface LocalMyth extends RawLocalMyth {
  id: string;
}

export interface BudgetFeasibility {
  status: BudgetStatus;
  estimatedTotal: number;
  budgetLimit: number;
  remaining: number;
  currency: Currency;
  explanation: string;
}

export interface TravelPlan {
  destinationName: string;
  tagline: string;
  culturalOverview: string;
  heritageScore: number;
  attractions: Attraction[];
  walkingRoute: WalkingRoute;
  localEtiquette: EtiquetteItem[];
  foodRecommendations: FoodRecommendation[];
  culturalEvents: CulturalEvent[];
  artisanSpotlight: ArtisanSpotlight[];
  timeline: TimelineSlot[];
  safetyTips: string[];
  packingItems: string[];
  localPhrases: LanguagePhrase[];
  sustainableRecommendations: string[];
  localMythsAndLegends: LocalMyth[];
  budget: BudgetFeasibility;
}

export interface PlanMeta {
  model: string;
  latencyMs: number;
  cached: boolean;
  revised: boolean;
}

/** Success envelope returned by POST /api/generate-travel. */
export interface GenerateTravelResponse {
  plan: TravelPlan;
  meta: PlanMeta;
}

/** Error envelope returned by POST /api/generate-travel. */
export interface ApiErrorResponse {
  error: string;
  code: ApiErrorCode;
  details?: unknown;
}

export type ApiErrorCode =
  | "invalid_json"
  | "validation_failed"
  | "rate_limited"
  | "timeout"
  | "empty_response"
  | "invalid_ai_output"
  | "upstream_error"
  | "misconfigured";
