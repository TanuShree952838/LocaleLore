"use client";

import { useEffect, useState } from "react";
import type { TravelPlan, PlanMeta, GuideArchetype } from "@/lib/types";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AiProvenance } from "@/components/results/AiProvenance";
import { BudgetFeasibilityCard } from "@/components/results/BudgetFeasibilityCard";
import { LocalGuideCard } from "@/components/results/LocalGuideCard";
import { Timeline } from "@/components/results/Timeline";
import { AttractionsList } from "@/components/results/AttractionsList";
import { WalkingRouteMap } from "@/components/results/WalkingRouteMap";
import { FlavorsAndEtiquette } from "@/components/results/FlavorsAndEtiquette";
import { FolkloreList } from "@/components/results/FolkloreList";
import { savePlan } from "@/lib/storage";
import { downloadPlanPdf } from "@/lib/pdf/generatePlanPdf";

interface PlanDashboardProps {
  plan: TravelPlan;
  meta: PlanMeta | null;
  guideType: GuideArchetype;
}

export function PlanDashboard({ plan, meta, guideType }: PlanDashboardProps) {
  // Local editable copy so users can tweak the plan before exporting/saving,
  // without mutating the plan owned by the parent (which is replaced whenever a
  // new generation completes).
  const [editablePlan, setEditablePlan] = useState<TravelPlan>(plan);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Reset local edits whenever a fresh plan is generated.
  useEffect(() => {
    setEditablePlan(plan);
  }, [plan]);

  const currency = editablePlan.budget.currency;

  function persist(next: TravelPlan) {
    setEditablePlan(next);
    savePlan(next, guideType);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1500);
  }

  function updateOverview(patch: Partial<Pick<TravelPlan, "tagline" | "culturalOverview">>) {
    persist({ ...editablePlan, ...patch });
  }

  function updateSlot(
    id: string,
    patch: Partial<{ activityTitle: string; activityDescription: string; associatedCost: number }>,
  ) {
    persist({
      ...editablePlan,
      timeline: editablePlan.timeline.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)),
    });
  }

  function updateAttraction(
    id: string,
    patch: Partial<{ name: string; whySelected: string; estimatedCost: number }>,
  ) {
    persist({
      ...editablePlan,
      attractions: editablePlan.attractions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  }

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await downloadPlanPdf(editablePlan, guideType);
    } finally {
      setIsDownloading(false);
    }
  }

  const tabs: TabItem[] = [
    {
      id: "overview",
      label: "Guide & Overview",
      content: (
        <LocalGuideCard
          plan={editablePlan}
          guideType={guideType}
          isEditing={isEditing}
          onChangeOverview={updateOverview}
        />
      ),
    },
    {
      id: "timeline",
      label: "Day-by-Day",
      badge: editablePlan.timeline.length,
      content: (
        <Timeline
          timeline={editablePlan.timeline}
          currency={currency}
          isEditing={isEditing}
          onChangeSlot={updateSlot}
        />
      ),
    },
    {
      id: "attractions",
      label: "Sights & Artisans",
      badge: editablePlan.attractions.length,
      content: (
        <AttractionsList
          attractions={editablePlan.attractions}
          artisanSpotlight={editablePlan.artisanSpotlight}
          currency={currency}
          isEditing={isEditing}
          onChangeAttraction={updateAttraction}
        />
      ),
    },
    {
      id: "route",
      label: "Walking Route",
      badge: editablePlan.walkingRoute.waypoints.length,
      content: <WalkingRouteMap route={editablePlan.walkingRoute} />,
    },
    {
      id: "folklore",
      label: "Myths & Folklore",
      badge: editablePlan.localMythsAndLegends?.length || 0,
      content: <FolkloreList myths={editablePlan.localMythsAndLegends || []} />,
    },
    {
      id: "flavors",
      label: "Flavors & Customs",
      content: (
        <FlavorsAndEtiquette
          etiquette={editablePlan.localEtiquette}
          food={editablePlan.foodRecommendations}
          events={editablePlan.culturalEvents}
          phrases={editablePlan.localPhrases}
          currency={currency}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Heading + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black text-text tracking-tight uppercase">
            Your travel plan
          </h2>
          {savedNotice && <Badge tone="success">Saved</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isEditing ? "primary" : "secondary"}
            size="sm"
            onClick={() => setIsEditing((v) => !v)}
            aria-pressed={isEditing}
          >
            {isEditing ? "Done editing" : "Edit plan"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Preparing PDF…" : "Download PDF"}
          </Button>
        </div>
      </div>

      {isEditing && (
        <p className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-text/80">
          Editing is on — update any highlighted field below. Changes save automatically and are
          included when you download the PDF.
        </p>
      )}

      {/* AI transparency & trust signals */}
      <AiProvenance meta={meta} budgetStatus={editablePlan.budget.status} />

      {/* Budget card at top of dashboard */}
      <BudgetFeasibilityCard budget={editablePlan.budget} />

      {/* Primary Navigation Tabs */}
      <Tabs items={tabs} ariaLabel="Explore Travel Itinerary sections" />
    </div>
  );
}
