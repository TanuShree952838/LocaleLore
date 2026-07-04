import { z } from "zod";
import {
  CURRENCIES,
  GUIDE_ARCHETYPES,
  TRAVEL_STYLES,
} from "@/lib/types";

export const INPUT_LIMITS = {
  destination: 100,
  dietaryRestrictions: 200,
  accessibilityNeeds: 200,
  specialInterests: 200,
  budgetMin: 1,
  budgetMax: 1_000_000,
} as const;

export const travelContextSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, "Destination must be at least 2 characters")
    .max(INPUT_LIMITS.destination, "Destination name is too long"),
  days: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be a whole number")
    .min(1, "At least 1 day")
    .max(5, "At most 5 days for the itinerary"),
  travelStyle: z.enum(TRAVEL_STYLES),
  residentGuide: z.enum(GUIDE_ARCHETYPES),
  budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .finite("Budget must be a real number")
    .positive("Budget must be greater than zero")
    .max(INPUT_LIMITS.budgetMax, "Budget is too high"),
  currency: z.enum(CURRENCIES),
  sustainableFocus: z.boolean().default(false),
  dietaryRestrictions: z
    .string()
    .trim()
    .max(INPUT_LIMITS.dietaryRestrictions, "Dietary restrictions text is too long")
    .default(""),
  accessibilityNeeds: z
    .string()
    .trim()
    .max(INPUT_LIMITS.accessibilityNeeds, "Accessibility needs text is too long")
    .default(""),
  specialInterests: z
    .string()
    .trim()
    .max(INPUT_LIMITS.specialInterests, "Special interests text is too long")
    .default(""),
});

export type TravelContextInput = z.infer<typeof travelContextSchema>;
