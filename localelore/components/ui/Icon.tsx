/**
 * Central icon module. LocaleLore uses the professional, tree-shakeable
 * {@link https://lucide.dev | Lucide React} icon set. Re-exporting them from a
 * single module (under the app's semantic names) keeps call sites decoupled from
 * the library and guarantees a consistent stroke, grid, and visual language.
 *
 * Only the icons actually used in the UI are re-exported, so the bundle stays
 * lean via tree-shaking.
 */
export type { LucideProps as IconProps, LucideIcon } from "lucide-react";

export {
  // Brand & navigation
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  Footprints as FootprintsIcon,
  // Guides & culture
  Landmark as LandmarkIcon,
  UtensilsCrossed as UtensilsCrossedIcon,
  Palette as PaletteIcon,
  BookOpen as BookOpenIcon,
  Gem as GemIcon,
  // Trip essentials
  Leaf as LeafIcon,
  ShieldCheck as ShieldCheckIcon,
  Backpack as BackpackIcon,
  Camera as CameraIcon,
  Users as UsersIcon,
  Languages as LanguagesIcon,
  // Time & scheduling
  Clock3 as ClockIcon,
  CalendarDays as CalendarDaysIcon,
  Sunrise as SunriseIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  // Feedback, status & actions
  Sparkles as SparklesIcon,
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  CircleCheck as CheckCircleIcon,
  Copy as CopyIcon,
  RefreshCw as RefreshIcon,
  Zap as ZapIcon,
  Database as DatabaseIcon,
  ChevronDown as ChevronDownIcon,
  TriangleAlert as AlertTriangleIcon,
} from "lucide-react";
