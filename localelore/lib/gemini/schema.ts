import { SchemaType, type Schema } from "@google/generative-ai";
import { ATTRACTION_TYPES } from "@/lib/types";

export const geminiResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    destinationName: { type: SchemaType.STRING },
    tagline: { type: SchemaType.STRING },
    culturalOverview: { type: SchemaType.STRING },
    heritageScore: { type: SchemaType.INTEGER },
    attractions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          type: { type: SchemaType.STRING, format: "enum", enum: [...ATTRACTION_TYPES] },
          whySelected: { type: SchemaType.STRING },
          history: { type: SchemaType.STRING },
          culturalSignificance: { type: SchemaType.STRING },
          interestingFact: { type: SchemaType.STRING },
          bestTime: { type: SchemaType.STRING },
          localTip: { type: SchemaType.STRING },
          localSecret: { type: SchemaType.STRING },
          travelTips: { type: SchemaType.STRING },
          nearbyHiddenExperience: { type: SchemaType.STRING },
          locationDescription: { type: SchemaType.STRING },
          estimatedCost: { type: SchemaType.NUMBER },
          timeRequired: { type: SchemaType.STRING },
          photoSpot: { type: SchemaType.STRING },
          responsibleTip: { type: SchemaType.STRING },
        },
        required: [
          "name",
          "type",
          "whySelected",
          "history",
          "culturalSignificance",
          "interestingFact",
          "bestTime",
          "localTip",
          "localSecret",
          "travelTips",
          "nearbyHiddenExperience",
          "locationDescription",
          "estimatedCost",
          "timeRequired",
          "photoSpot",
          "responsibleTip",
        ],
      },
    },
    walkingRoute: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        totalDurationMinutes: { type: SchemaType.INTEGER },
        waypoints: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              durationMinutes: { type: SchemaType.INTEGER },
            },
            required: ["title", "description", "durationMinutes"],
          },
        },
        routePathSvg: { type: SchemaType.STRING },
      },
      required: ["title", "totalDurationMinutes", "waypoints", "routePathSvg"],
    },
    localEtiquette: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          situation: { type: SchemaType.STRING },
          custom: { type: SchemaType.STRING },
          residentTip: { type: SchemaType.STRING },
        },
        required: ["situation", "custom", "residentTip"],
      },
    },
    foodRecommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          authenticTip: { type: SchemaType.STRING },
          bestTime: { type: SchemaType.STRING },
          estimatedCost: { type: SchemaType.NUMBER },
        },
        required: ["name", "description", "authenticTip", "bestTime", "estimatedCost"],
      },
    },
    culturalEvents: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          timeOrSeason: { type: SchemaType.STRING },
          significance: { type: SchemaType.STRING },
          travelerParticipation: { type: SchemaType.STRING },
        },
        required: ["name", "timeOrSeason", "significance", "travelerParticipation"],
      },
    },
    artisanSpotlight: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          craft: { type: SchemaType.STRING },
          masterArtisan: { type: SchemaType.STRING },
          locationDescription: { type: SchemaType.STRING },
          impactStatement: { type: SchemaType.STRING },
          estimatedCost: { type: SchemaType.NUMBER },
        },
        required: [
          "craft",
          "masterArtisan",
          "locationDescription",
          "impactStatement",
          "estimatedCost",
        ],
      },
    },
    timeline: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          dayNumber: { type: SchemaType.INTEGER },
          slot: { type: SchemaType.STRING, format: "enum", enum: ["morning", "afternoon", "evening"] },
          activityTitle: { type: SchemaType.STRING },
          activityDescription: { type: SchemaType.STRING },
          localGuideInsight: { type: SchemaType.STRING },
          associatedCost: { type: SchemaType.NUMBER },
        },
        required: [
          "dayNumber",
          "slot",
          "activityTitle",
          "activityDescription",
          "localGuideInsight",
          "associatedCost",
        ],
      },
    },
    safetyTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    packingItems: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    localPhrases: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          original: { type: SchemaType.STRING },
          phonetic: { type: SchemaType.STRING },
          meaning: { type: SchemaType.STRING },
        },
        required: ["original", "phonetic", "meaning"],
      },
    },
    sustainableRecommendations: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    localMythsAndLegends: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          story: { type: SchemaType.STRING },
          culturalContext: { type: SchemaType.STRING },
        },
        required: ["title", "story", "culturalContext"],
      },
    },
    estimatedTotalCost: { type: SchemaType.NUMBER },
  },
  required: [
    "destinationName",
    "tagline",
    "culturalOverview",
    "heritageScore",
    "attractions",
    "walkingRoute",
    "localEtiquette",
    "foodRecommendations",
    "culturalEvents",
    "artisanSpotlight",
    "timeline",
    "safetyTips",
    "packingItems",
    "localPhrases",
    "sustainableRecommendations",
    "localMythsAndLegends",
    "estimatedTotalCost",
  ],
};
