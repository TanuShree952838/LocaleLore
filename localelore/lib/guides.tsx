import type { GuideArchetype } from "@/lib/types";
import type { LucideIcon } from "@/components/ui/Icon";
import {
  LandmarkIcon,
  UtensilsCrossedIcon,
  PaletteIcon,
} from "@/components/ui/Icon";

/**
 * Single source of truth for the "My Local Guide" resident avatars. Centralising
 * this metadata keeps the selection form, the guide welcome card, and any labels
 * perfectly in sync (previously it was duplicated across three files).
 */
export interface GuideInfo {
  /** Guide's first name, e.g. "Anya". */
  name: string;
  /** Descriptive role, e.g. "The Neighborhood Historian". */
  role: string;
  /** Combined label used in compact contexts, e.g. "Anya the Historian". */
  label: string;
  /** One-line description of the guide's focus. */
  tagline: string;
  /** First-person welcome message shown on the guide card. */
  greeting: string;
  /** Icon representing the guide's domain. */
  Icon: LucideIcon;
  /** Tailwind gradient + border classes for the guide's accent theme. */
  themeClass: string;
}

export const GUIDES: Record<GuideArchetype, GuideInfo> = {
  historian: {
    name: "Anya",
    role: "Local history guide",
    label: "Anya the Historian",
    tagline: "Old stories, local legends, and historic buildings.",
    greeting:
      "Hi, I'm Anya! I've put together a route through the old stories, historic spots, and traditions I grew up with. Let's dig into the history together.",
    Icon: LandmarkIcon,
    themeClass:
      "from-indigo-500/10 to-blue-500/10 border-indigo-200 dark:border-indigo-900/30",
  },
  foodie: {
    name: "Marcus",
    role: "Local food guide",
    label: "Marcus the Foodie",
    tagline: "Street food, home recipes, and local markets.",
    greeting:
      "Hey, I'm Marcus. Skip the tourist restaurants — I've mapped the places locals actually eat: morning spots, market stalls, and where to get dinner right. Let's eat well.",
    Icon: UtensilsCrossedIcon,
    themeClass:
      "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900/30",
  },
  artisan: {
    name: "Kavi",
    role: "Local crafts guide",
    label: "Kavi the Artisan",
    tagline: "Craft workshops and community co-ops.",
    greeting:
      "Hi, I'm Kavi. I'll point you to the weavers, potters, and makers who keep local craft alive — so your trip supports real artisans. Let's go find them.",
    Icon: PaletteIcon,
    themeClass:
      "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/30",
  },
};
