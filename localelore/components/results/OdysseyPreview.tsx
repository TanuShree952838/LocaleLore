import {
  type LucideIcon,
  CompassIcon,
  FootprintsIcon,
  UtensilsCrossedIcon,
  BookOpenIcon,
  PaletteIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icon";

interface PreviewItem {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const ITEMS: PreviewItem[] = [
  {
    Icon: CompassIcon,
    title: "Top sights & hidden gems",
    description: "A few real places, each with the story behind why it's worth a visit.",
  },
  {
    Icon: FootprintsIcon,
    title: "A walking route",
    description: "Stops connected into one route you can follow on foot.",
  },
  {
    Icon: UtensilsCrossedIcon,
    title: "Food & local customs",
    description: "Where locals actually eat, plus the customs guidebooks skip.",
  },
  {
    Icon: BookOpenIcon,
    title: "Myths & folklore",
    description: "Local legends and the stories behind the place.",
  },
  {
    Icon: PaletteIcon,
    title: "Local artisans & crafts",
    description: "Traditional crafts and co-ops, so your money supports the community.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "A budget that adds up",
    description: "Every cost is re-checked on our server to stay within your limit.",
  },
];

/**
 * Idle-state panel shown before the first plan is generated. It fills the results
 * column with a meaningful preview of what the AI will produce, setting clear
 * expectations instead of leaving the space empty.
 */
export function OdysseyPreview() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <CompassIcon aria-hidden="true" className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-text">What you&apos;ll get</h2>
          <p className="text-sm text-muted">
            Fill in your trip details and pick a local guide to get started. Here&apos;s what&apos;s included:
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-[box-shadow,border-color] hover:border-accent/40 hover:shadow-e1"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
              <item.Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-text">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
