import type { ReactElement, SVGProps } from "react";
import type { GroceryCategory, MealSlot } from "@/lib/types";

/**
 * A small, dependency-free icon set drawn as inline SVGs so the bundle stays
 * lean and icons inherit `currentColor`. All icons share a consistent 24px
 * grid, 1.8 stroke, and rounded caps/joins for a friendly, cohesive look.
 */

export type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ChefHatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 18h12v1.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5V18Z" />
      <path d="M6 18c-2.2 0-3.5-1.6-3.5-3.6 0-1.9 1.5-3.4 3.4-3.4.1-2.4 2-4 4.6-4 1.2 0 2.3.5 3 1.3A3.7 3.7 0 0 1 18 5.2c2.3.2 3.8 1.9 3.8 4 0 2-1.5 3.6-3.8 3.6" />
      <path d="M6 18v-5M12 18v-6M18 18v-5" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
      <path d="M5 13l.6 1.6L7 15l-1.4.4L5 17l-.6-1.6L3 15l1.4-.4L5 13Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CoinsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M15 11.5c2.7-.3 6-1.5 6-3.5" />
      <path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" />
      <path d="M3 8v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3" />
      <path d="M21 11v3h-4a1.5 1.5 0 0 1 0-3h4Z" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8h13l-3-3" />
      <path d="M20 16H7l3 3" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2H14.5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function ListChecksIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 6h10M11 12h10M11 18h10" />
      <path d="M3 6l1.3 1.3L7 4.5" />
      <path d="M3 12l1.3 1.3L7 10.5" />
      <path d="M3 18l1.3 1.3L7 16.5" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 21 19a1 1 0 0 1-.9 1.5H3.9A1 1 0 0 1 3 19L12 3.5Z" />
      <path d="M12 9.5v4.5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 11a8 8 0 0 0-14-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---- Meal-slot icons (sunrise / sun / moon narrative for the day) -------- */

export function SunriseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 3v4M5 8l1.5 1.5M19 8l-1.5 1.5M2 14h2M20 14h2" />
    </svg>
  );
}

const MEAL_ICONS: Record<MealSlot, (p: IconProps) => ReactElement> = {
  breakfast: SunriseIcon,
  lunch: SunIcon,
  dinner: MoonIcon,
};

export function MealSlotIcon({ slot, ...props }: IconProps & { slot: MealSlot }) {
  const Cmp = MEAL_ICONS[slot];
  return <Cmp {...props} />;
}

/* ---- Grocery category icons --------------------------------------------- */

function SproutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20v-8" />
      <path d="M12 12C12 8 9 6 4 6c0 4 3 6 8 6Z" />
      <path d="M12 12c0-3 2-5 6-5 0 3-2 5-6 5Z" />
    </svg>
  );
}

function DrumstickIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 4.5a4.5 4.5 0 0 1 1.2 8.1c-1.3.8-2 1.4-2.4 2.6-.5 1.6-2.2 2.6-3.8 2.1a3 3 0 0 1-2-2 3 3 0 0 1-2-2c-.5-1.6.5-3.3 2.1-3.8 1.2-.4 1.8-1.1 2.6-2.4A4.5 4.5 0 0 1 14.5 4.5Z" />
      <path d="M6.5 15.5 4 18M8 17l-2 2" />
    </svg>
  );
}

function MilkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3h8M9 3v3l-1.5 3v10a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V9L17 6V3" />
      <path d="M7.5 12h9" />
    </svg>
  );
}

function WheatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21V9" />
      <path d="M12 9c0-2 1.5-3.5 3.5-3.5C15.5 7.5 14 9 12 9Z" />
      <path d="M12 9c0-2-1.5-3.5-3.5-3.5C8.5 7.5 10 9 12 9Z" />
      <path d="M12 14c0-2 1.5-3.5 3.5-3.5C15.5 12.5 14 14 12 14Z" />
      <path d="M12 14c0-2-1.5-3.5-3.5-3.5C8.5 12.5 10 14 12 14Z" />
    </svg>
  );
}

function JarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3h10M8 3v2M16 3v2" />
      <rect x="6" y="7" width="12" height="14" rx="2.5" />
      <path d="M6 11h12" />
    </svg>
  );
}

function PepperIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 21c-3.5 0-6-2.8-6-6.5S6.8 8 10 9c1.5.5 3 .5 4-.5" />
      <path d="M14 8.5C14 6 16 4 18.5 4c.5 0 .5.6 0 .8-1 .5-1.5 1.2-1.5 2.2 1.5.2 3 1.4 3 3" />
    </svg>
  );
}

function PackageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<GroceryCategory, (p: IconProps) => ReactElement> = {
  produce: SproutIcon,
  protein: DrumstickIcon,
  dairy: MilkIcon,
  grains: WheatIcon,
  pantry: JarIcon,
  spices: PepperIcon,
  other: PackageIcon,
};

export function GroceryCategoryIcon({
  category,
  ...props
}: IconProps & { category: GroceryCategory }) {
  const Cmp = CATEGORY_ICONS[category];
  return <Cmp {...props} />;
}
