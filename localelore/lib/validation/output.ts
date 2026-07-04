import { z } from "zod";
import { ATTRACTION_TYPES } from "@/lib/types";

const shortText = z.string().trim().min(1).max(1000);
const longText = z.string().trim().min(1).max(5000);
const cost = z.number().nonnegative().finite();

const rawAttractionSchema = z.object({
  name: shortText,
  type: z.enum(ATTRACTION_TYPES),
  whySelected: longText,
  history: longText,
  culturalSignificance: longText,
  interestingFact: shortText,
  bestTime: shortText,
  localTip: longText,
  localSecret: longText,
  travelTips: longText,
  nearbyHiddenExperience: longText,
  locationDescription: shortText,
  estimatedCost: cost,
  timeRequired: shortText,
  photoSpot: shortText,
  responsibleTip: longText,
});

const rawLocalMythSchema = z.object({
  title: shortText,
  story: longText,
  culturalContext: longText,
});

const rawWaypointSchema = z.object({
  title: shortText,
  description: longText,
  durationMinutes: z.number().int().nonnegative().max(480),
});

const rawWalkingRouteSchema = z.object({
  title: shortText,
  totalDurationMinutes: z.number().int().nonnegative().max(1440),
  waypoints: z.array(rawWaypointSchema).min(1).max(10),
  routePathSvg: z.string().trim().max(5000).default("M 10 50 Q 50 20 90 50 T 170 50"),
});

const rawEtiquetteItemSchema = z.object({
  situation: shortText,
  custom: longText,
  residentTip: longText,
});

const rawFoodRecommendationSchema = z.object({
  name: shortText,
  description: longText,
  authenticTip: longText,
  bestTime: shortText,
  estimatedCost: cost,
});

const rawCulturalEventSchema = z.object({
  name: shortText,
  timeOrSeason: shortText,
  significance: longText,
  travelerParticipation: longText,
});

const rawArtisanSpotlightSchema = z.object({
  craft: shortText,
  masterArtisan: shortText,
  locationDescription: longText,
  impactStatement: longText,
  estimatedCost: cost,
});

const rawTimelineSlotSchema = z.object({
  dayNumber: z.number().int().positive().max(5),
  slot: z.enum(["morning", "afternoon", "evening"]),
  activityTitle: shortText,
  activityDescription: longText,
  localGuideInsight: longText,
  associatedCost: cost,
});

const rawLanguagePhraseSchema = z.object({
  original: shortText,
  phonetic: shortText,
  meaning: shortText,
});

export const rawTravelPlanSchema = z.object({
  destinationName: shortText,
  tagline: shortText,
  culturalOverview: longText,
  heritageScore: z.number().int().min(1).max(100),
  attractions: z.array(rawAttractionSchema).min(2).max(3),
  walkingRoute: rawWalkingRouteSchema,
  localEtiquette: z.array(rawEtiquetteItemSchema).min(1).max(3),
  foodRecommendations: z.array(rawFoodRecommendationSchema).min(1).max(3),
  culturalEvents: z.array(rawCulturalEventSchema).min(1).max(2),
  artisanSpotlight: z.array(rawArtisanSpotlightSchema).min(1).max(2),
  timeline: z.array(rawTimelineSlotSchema).min(3).max(15),
  safetyTips: z.array(shortText).min(1).max(5),
  packingItems: z.array(shortText).min(1).max(10),
  localPhrases: z.array(rawLanguagePhraseSchema).min(1).max(5),
  sustainableRecommendations: z.array(shortText).min(1).max(5),
  localMythsAndLegends: z.array(rawLocalMythSchema).min(1).max(2),
  estimatedTotalCost: cost,
});

export type RawTravelPlanParsed = z.infer<typeof rawTravelPlanSchema>;
