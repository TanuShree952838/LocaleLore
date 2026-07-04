import type { GuideArchetype, TravelPlan } from "@/lib/types";
import { GUIDES } from "@/lib/guides";

/**
 * Renders a `TravelPlan` into a multi-page PDF and triggers a browser download.
 *
 * jsPDF's built-in fonts (Helvetica/Times/Courier) only cover WinAnsi/Latin-1
 * glyphs, so currency symbols like ₹ or non-Latin script would render as
 * blank boxes. To keep the PDF accurate for every currency (INR included) we
 * spell out the ISO currency code ("INR 12,000") instead of the symbol.
 */
function formatMoneyForPdf(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .trim(); // e.g. "INR 12,000"
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
  }
}

const SLOT_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export async function downloadPlanPdf(
  plan: TravelPlan,
  guideType: GuideArchetype = "historian",
): Promise<void> {
  // Dynamic import keeps jsPDF (and its font tables) out of the initial
  // client bundle — it's only ever needed when the user asks to download.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;
  let y = 56;

  const colors = {
    text: "#1a1a1a",
    muted: "#666666",
    accent: "#b45309", // warm amber, matches the app's brand tone
    rule: "#dddddd",
  };

  function ensureSpace(nextBlockHeight: number) {
    if (y + nextBlockHeight > pageHeight - 56) {
      doc.addPage();
      y = 56;
    }
  }

  function rule() {
    ensureSpace(14);
    doc.setDrawColor(colors.rule);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;
  }

  function heading(text: string, size = 14) {
    ensureSpace(size + 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(colors.text);
    doc.text(text, marginX, y);
    y += size + 8;
  }

  function subheading(text: string) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(colors.accent);
    doc.text(text, marginX, y);
    y += 16;
  }

  function paragraph(text: string, opts: { size?: number; color?: string; indent?: number } = {}) {
    if (!text) return;
    const size = opts.size ?? 10;
    const indent = opts.indent ?? 0;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(opts.color ?? colors.muted);
    const lines: string[] = doc.splitTextToSize(text, contentWidth - indent);
    ensureSpace(lines.length * (size + 3));
    doc.text(lines, marginX + indent, y);
    y += lines.length * (size + 3) + 6;
  }

  function bulletList(items: string[], indent = 10) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colors.muted);
    items.forEach((item) => {
      const lines: string[] = doc.splitTextToSize(`•  ${item}`, contentWidth - indent);
      ensureSpace(lines.length * 13);
      doc.text(lines, marginX + indent, y);
      y += lines.length * 13 + 3;
    });
    y += 4;
  }

  // ---------------------------------------------------------------
  // Cover / header
  // ---------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(colors.text);
  doc.text(plan.destinationName || "Your Travel Plan", marginX, y);
  y += 26;

  if (plan.tagline) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(colors.accent);
    const taglineLines: string[] = doc.splitTextToSize(plan.tagline, contentWidth);
    doc.text(taglineLines, marginX, y);
    y += taglineLines.length * 15 + 6;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colors.muted);
  doc.text(
    `Local guide: ${GUIDES[guideType]?.label ?? guideType}  •  Generated ${new Date().toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    )}  •  LocaleLore`,
    marginX,
    y,
  );
  y += 20;
  rule();

  // ---------------------------------------------------------------
  // Overview
  // ---------------------------------------------------------------
  if (plan.culturalOverview) {
    heading("Trip Overview");
    paragraph(plan.culturalOverview);
  }

  // ---------------------------------------------------------------
  // Budget
  // ---------------------------------------------------------------
  heading("Budget Summary");
  const { budget } = plan;
  const statusLabel =
    budget.status === "within_budget"
      ? "Within budget"
      : budget.status === "revised_to_fit"
        ? "Revised to fit"
        : "Over budget";

  const budgetRows: Array<[string, string]> = [
    ["Estimated total", formatMoneyForPdf(budget.estimatedTotal, budget.currency)],
    ["Budget limit", formatMoneyForPdf(budget.budgetLimit, budget.currency)],
    [
      budget.remaining >= 0 ? "Remaining" : "Over by",
      formatMoneyForPdf(Math.abs(budget.remaining), budget.currency),
    ],
    ["Status", statusLabel],
  ];
  ensureSpace(budgetRows.length * 15 + 10);
  doc.setFontSize(10);
  budgetRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.text);
    doc.text(label, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.muted);
    doc.text(value, marginX + 140, y);
    y += 15;
  });
  y += 4;
  if (budget.explanation) {
    paragraph(budget.explanation, { size: 9 });
  }
  rule();

  // ---------------------------------------------------------------
  // Day-by-day timeline
  // ---------------------------------------------------------------
  if (plan.timeline.length > 0) {
    heading("Day-by-Day Itinerary");
    const dayGroups = plan.timeline.reduce<Record<number, typeof plan.timeline>>((acc, slot) => {
      (acc[slot.dayNumber] ??= []).push(slot);
      return acc;
    }, {});

    Object.entries(dayGroups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([dayNum, slots]) => {
        subheading(`Day ${dayNum}`);
        slots.forEach((slot) => {
          ensureSpace(30);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(colors.text);
          const slotLabel = SLOT_LABELS[slot.slot] ?? slot.slot;
          doc.text(
            `${slotLabel}: ${slot.activityTitle}  (${formatMoneyForPdf(slot.associatedCost, budget.currency)})`,
            marginX + 10,
            y,
          );
          y += 14;
          paragraph(slot.activityDescription, { indent: 10 });
          if (slot.localGuideInsight) {
            paragraph(`Guide insight: "${slot.localGuideInsight}"`, { size: 9, indent: 10 });
          }
        });
        y += 4;
      });
    rule();
  }

  // ---------------------------------------------------------------
  // Attractions & hidden gems
  // ---------------------------------------------------------------
  if (plan.attractions.length > 0) {
    heading("Sights & Local Creators");
    plan.attractions.forEach((a) => {
      ensureSpace(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(colors.text);
      doc.text(
        `${a.name}  (${formatMoneyForPdf(a.estimatedCost, budget.currency)}, ${a.timeRequired})`,
        marginX,
        y,
      );
      y += 14;
      paragraph(a.whySelected, { indent: 10 });
      if (a.bestTime) paragraph(`Best time to visit: ${a.bestTime}`, { size: 9, indent: 10 });
      if (a.localTip) paragraph(`Local tip: ${a.localTip}`, { size: 9, indent: 10 });
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Artisan spotlight
  // ---------------------------------------------------------------
  if (plan.artisanSpotlight.length > 0) {
    heading("Traditional Artisans & Craft Sourcing");
    plan.artisanSpotlight.forEach((artisan) => {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(colors.text);
      doc.text(
        `${artisan.craft} — ${artisan.masterArtisan}  (${formatMoneyForPdf(artisan.estimatedCost, budget.currency)})`,
        marginX,
        y,
      );
      y += 14;
      paragraph(artisan.locationDescription, { indent: 10 });
      paragraph(`Impact: ${artisan.impactStatement}`, { size: 9, indent: 10 });
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Food recommendations
  // ---------------------------------------------------------------
  if (plan.foodRecommendations.length > 0) {
    heading("Where to Eat");
    plan.foodRecommendations.forEach((food) => {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(colors.text);
      doc.text(
        `${food.name}  (${formatMoneyForPdf(food.estimatedCost, budget.currency)})`,
        marginX,
        y,
      );
      y += 14;
      paragraph(food.description, { indent: 10 });
      if (food.authenticTip) paragraph(`Tip: ${food.authenticTip}`, { size: 9, indent: 10 });
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Walking route
  // ---------------------------------------------------------------
  if (plan.walkingRoute?.waypoints?.length > 0) {
    heading("Walking Route");
    paragraph(
      `${plan.walkingRoute.title} — approx. ${plan.walkingRoute.totalDurationMinutes} minutes total`,
      { size: 10, color: colors.text },
    );
    plan.walkingRoute.waypoints.forEach((wp, idx) => {
      ensureSpace(20);
      paragraph(`${idx + 1}. ${wp.title} (${wp.durationMinutes} min) — ${wp.description}`, {
        indent: 10,
      });
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Etiquette, phrases, cultural events
  // ---------------------------------------------------------------
  if (plan.localEtiquette.length > 0) {
    heading("Local Etiquette");
    plan.localEtiquette.forEach((e) => {
      paragraph(`${e.situation}: ${e.custom}`, { indent: 10, color: colors.text, size: 10 });
      if (e.residentTip) paragraph(`Resident tip: ${e.residentTip}`, { size: 9, indent: 20 });
    });
    rule();
  }

  if (plan.localPhrases.length > 0) {
    heading("Useful Local Phrases");
    plan.localPhrases.forEach((p) => {
      paragraph(`"${p.original}" (${p.phonetic}) — ${p.meaning}`, { indent: 10, color: colors.text });
    });
    rule();
  }

  if (plan.culturalEvents.length > 0) {
    heading("Cultural Events");
    plan.culturalEvents.forEach((e) => {
      paragraph(`${e.name} (${e.timeOrSeason}): ${e.significance}`, {
        indent: 10,
        color: colors.text,
      });
    });
    rule();
  }

  if (plan.localMythsAndLegends?.length > 0) {
    heading("Myths & Folklore");
    plan.localMythsAndLegends.forEach((myth) => {
      subheading(myth.title);
      paragraph(myth.story);
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Safety, packing, sustainability
  // ---------------------------------------------------------------
  if (plan.safetyTips.length > 0) {
    heading("Safety Tips");
    bulletList(plan.safetyTips);
  }
  if (plan.packingItems.length > 0) {
    heading("Packing Suggestions");
    bulletList(plan.packingItems);
  }
  if (plan.sustainableRecommendations.length > 0) {
    heading("Sustainable Travel Tips");
    bulletList(plan.sustainableRecommendations);
  }

  // ---------------------------------------------------------------
  // Footer page numbers
  // ---------------------------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(colors.muted);
    doc.text(`LocaleLore — Page ${i} of ${pageCount}`, marginX, pageHeight - 30);
  }

  const safeName = (plan.destinationName || "travel-plan")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  doc.save(`localelore-${safeName || "travel-plan"}.pdf`);
}
