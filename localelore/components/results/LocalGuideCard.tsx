import type { TravelPlan, GuideArchetype } from "@/lib/types";

interface LocalGuideCardProps {
  plan: TravelPlan;
  guideType: GuideArchetype;
}

export function LocalGuideCard({ plan, guideType }: LocalGuideCardProps) {
  const guideInfo: Record<
    GuideArchetype,
    { name: string; title: string; avatar: string; greeting: string; themeClass: string }
  > = {
    historian: {
      name: "Anya",
      title: "The Neighborhood Historian",
      avatar: "📜",
      greeting: "Hello, fellow explorer! I'm Anya. I've designed a path through our town's deepest folklore, historical wonders, and sacred traditions. Let's trace the footprints of history together.",
      themeClass: "from-indigo-500/10 to-blue-500/10 border-indigo-200 dark:border-indigo-900/30",
    },
    foodie: {
      name: "Marcus",
      title: "The Culinary Resident",
      avatar: "🍜",
      greeting: "Welcome! Marcus here. Forget the overpriced restaurant rows. I've mapped out the real flavors—our morning breakfast spots, hidden spice stalls, and dinner rituals. Let's eat like locals.",
      themeClass: "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900/30",
    },
    artisan: {
      name: "Kavi",
      title: "The Community Artisan",
      avatar: "🏺",
      greeting: "Greetings! I'm Kavi. I'm excited to connect you with our town's living legacy—the weavers, potters, and traditional creators who keep our cultural flame alive. Let's support authentic heritage.",
      themeClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/30",
    },
  };

  const currentGuide = guideInfo[guideType] || guideInfo.historian;

  return (
    <div className="space-y-6">
      {/* Resident Guide Welcome Card */}
      <section
        aria-label="Resident Guide Introduction"
        className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm glass ${currentGuide.themeClass}`}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface border border-border text-3xl shadow-sm">
            {currentGuide.avatar}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">
              My Local Guide
            </span>
            <h3 className="text-lg font-bold text-text">
              {currentGuide.name} — {currentGuide.title}
            </h3>
            <p className="text-sm italic text-muted leading-relaxed">
              &ldquo;{currentGuide.greeting}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Destination Showcase & Heritage Score */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <section className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-sm glass space-y-3">
          <div>
            <h2 className="text-2xl font-black text-text tracking-tight">
              {plan.destinationName}
            </h2>
            <p className="text-sm font-medium text-accent-2 italic">{plan.tagline}</p>
          </div>
          <p className="text-sm text-text/95 leading-relaxed">{plan.culturalOverview}</p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm glass flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Heritage Impact Score
          </span>
          <div className="relative flex items-center justify-center">
            <svg className="h-24 w-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-surface-2"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-accent"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * plan.heritageScore) / 100}
              />
            </svg>
            <span className="absolute text-2xl font-black text-text">{plan.heritageScore}%</span>
          </div>
          <p className="text-xs text-muted leading-tight max-w-[180px]">
            Measures engagement with traditional craftspeople, preservation sites, and local-owned shops.
          </p>
        </section>
      </div>

      {/* Sustainable, Safety & Packing Guidelines */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <span>🌿</span> Sustainable Explorer
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.sustainableRecommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <span>🛡️</span> Resident Safety Tips
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.safetyTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text">
            <span>🎒</span> Packing Suggestions
          </h4>
          <ul className="space-y-2 text-xs text-muted leading-relaxed list-disc pl-4">
            {plan.packingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
