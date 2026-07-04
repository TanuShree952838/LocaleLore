import type { TravelPlan, PlanMeta, GuideArchetype } from "@/lib/types";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { BudgetFeasibilityCard } from "@/components/results/BudgetFeasibilityCard";
import { LocalGuideCard } from "@/components/results/LocalGuideCard";
import { Timeline } from "@/components/results/Timeline";
import { AttractionsList } from "@/components/results/AttractionsList";
import { WalkingRouteMap } from "@/components/results/WalkingRouteMap";
import { FlavorsAndEtiquette } from "@/components/results/FlavorsAndEtiquette";
import { FolkloreList } from "@/components/results/FolkloreList";

interface PlanDashboardProps {
  plan: TravelPlan;
  meta: PlanMeta | null;
  guideType: GuideArchetype;
}

export function PlanDashboard({ plan, meta, guideType }: PlanDashboardProps) {
  const currency = plan.budget.currency;

  const tabs: TabItem[] = [
    {
      id: "overview",
      label: "Guide & Overview",
      content: <LocalGuideCard plan={plan} guideType={guideType} />,
    },
    {
      id: "timeline",
      label: "Odyssey Timeline",
      badge: plan.timeline.length,
      content: <Timeline timeline={plan.timeline} currency={currency} />,
    },
    {
      id: "attractions",
      label: "Sights & Artisans",
      badge: plan.attractions.length,
      content: (
        <AttractionsList
          attractions={plan.attractions}
          artisanSpotlight={plan.artisanSpotlight}
          currency={currency}
        />
      ),
    },
    {
      id: "route",
      label: "Walking Route",
      badge: plan.walkingRoute.waypoints.length,
      content: <WalkingRouteMap route={plan.walkingRoute} />,
    },
    {
      id: "folklore",
      label: "Myths & Folklore",
      badge: plan.localMythsAndLegends?.length || 0,
      content: <FolkloreList myths={plan.localMythsAndLegends || []} />,
    },
    {
      id: "flavors",
      label: "Flavors & Customs",
      content: (
        <FlavorsAndEtiquette
          etiquette={plan.localEtiquette}
          food={plan.foodRecommendations}
          events={plan.culturalEvents}
          phrases={plan.localPhrases}
          currency={currency}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Meta status info */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-text tracking-tight uppercase">
          Your Curated Exploration Plan
        </h2>
        {meta?.cached && <Badge tone="neutral">Cached Plan</Badge>}
      </div>

      {/* Budget card at top of dashboard */}
      <BudgetFeasibilityCard budget={plan.budget} />

      {/* Primary Navigation Tabs */}
      <Tabs items={tabs} ariaLabel="Explore Travel Itinerary sections" />
    </div>
  );
}
