import type { MealPlan, GroceryCategory } from "@/lib/types";
import { MEAL_LABELS, CATEGORY_LABELS, formatDuration } from "@/lib/format";

/**
 * Renders a `MealPlan` into a multi-page PDF and triggers a browser download.
 *
 * jsPDF's built-in fonts (Helvetica/Times/Courier) only cover WinAnsi/Latin-1
 * glyphs, so currency symbols like ₹ would render as blank boxes. To keep the
 * PDF accurate for every currency (INR included) we spell out the ISO currency
 * code ("INR 1,200") instead of the symbol.
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
      .trim();
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
  }
}

const CATEGORY_ORDER: GroceryCategory[] = [
  "produce",
  "protein",
  "dairy",
  "grains",
  "pantry",
  "spices",
  "other",
];

export async function downloadPlanPdf(plan: MealPlan): Promise<void> {
  // Dynamic import keeps jsPDF (and its font tables) out of the initial client
  // bundle — it's only ever loaded when the user actually asks to download.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;
  const currency = plan.budget.currency;
  let y = 56;

  const colors = {
    text: "#141a17",
    muted: "#5f6b64",
    accent: "#15803d", // fresh green, matches CookFlow's brand tone
    rule: "#dde3df",
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

  function paragraph(
    text: string,
    opts: { size?: number; color?: string; indent?: number } = {},
  ) {
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

  function numberedList(items: string[], indent = 12) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colors.muted);
    items.forEach((item, i) => {
      const lines: string[] = doc.splitTextToSize(`${i + 1}.  ${item}`, contentWidth - indent);
      ensureSpace(lines.length * 13);
      doc.text(lines, marginX + indent, y);
      y += lines.length * 13 + 3;
    });
    y += 4;
  }

  // ---------------------------------------------------------------
  // Header
  // ---------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(colors.text);
  doc.text("Your Cooking Plan", marginX, y);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colors.muted);
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}  •  CookFlow — AI cooking to-do list`,
    marginX,
    y,
  );
  y += 20;
  rule();

  // ---------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------
  if (plan.summary) {
    heading("Overview");
    paragraph(plan.summary);
  }

  // ---------------------------------------------------------------
  // Budget
  // ---------------------------------------------------------------
  const { budget } = plan;
  heading("Budget Check");
  const statusLabel =
    budget.status === "within_budget"
      ? "Within budget"
      : budget.status === "revised_to_fit"
        ? "Revised to fit"
        : "Over budget";

  const budgetRows: Array<[string, string]> = [
    ["Estimated total", formatMoneyForPdf(budget.estimatedTotal, currency)],
    ["Budget limit", formatMoneyForPdf(budget.budgetLimit, currency)],
    [
      budget.remaining >= 0 ? "Remaining" : "Over by",
      formatMoneyForPdf(Math.abs(budget.remaining), currency),
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
  if (budget.explanation) paragraph(budget.explanation, { size: 9 });
  rule();

  // ---------------------------------------------------------------
  // Meals
  // ---------------------------------------------------------------
  if (plan.meals.length > 0) {
    heading("Meals");
    plan.meals.forEach((meal) => {
      const slotLabel = MEAL_LABELS[meal.slot] ?? meal.slot;
      subheading(
        `${slotLabel}: ${meal.title}  (${formatDuration(meal.prepMinutes)} • ${formatMoneyForPdf(
          meal.estimatedCost,
          currency,
        )})`,
      );
      paragraph(meal.summary, { indent: 4 });
      if (meal.steps.length > 0) numberedList(meal.steps);
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Cooking to-do (timeline)
  // ---------------------------------------------------------------
  if (plan.tasks.length > 0) {
    heading("Cooking To-Do");
    const tasks = [...plan.tasks].sort((a, b) => a.time.localeCompare(b.time));
    tasks.forEach((task) => {
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      doc.text(task.time, marginX, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.muted);
      const detail = `${task.title}  (${formatDuration(task.durationMinutes)} • ${
        MEAL_LABELS[task.meal] ?? task.meal
      })`;
      const lines: string[] = doc.splitTextToSize(detail, contentWidth - 60);
      doc.text(lines, marginX + 54, y);
      y += Math.max(lines.length * 13, 14) + 2;
    });
    y += 4;
    rule();
  }

  // ---------------------------------------------------------------
  // Grocery list (grouped by category)
  // ---------------------------------------------------------------
  if (plan.grocery.length > 0) {
    heading("Grocery List");
    CATEGORY_ORDER.forEach((category) => {
      const items = plan.grocery.filter((g) => g.category === category);
      if (items.length === 0) return;
      subheading(CATEGORY_LABELS[category] ?? category);
      items.forEach((item) => {
        ensureSpace(14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(colors.text);
        doc.text(`•  ${item.name}`, marginX + 10, y);
        doc.setTextColor(colors.muted);
        const meta = `${item.quantity}   ${formatMoneyForPdf(item.estimatedCost, currency)}`;
        doc.text(meta, marginX + 260, y);
        y += 14;
      });
      y += 4;
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Substitutions / swaps
  // ---------------------------------------------------------------
  if (plan.substitutions.length > 0) {
    heading("Smart Swaps");
    plan.substitutions.forEach((sub) => {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(colors.text);
      const savings =
        sub.savesAmount > 0 ? `  (saves ${formatMoneyForPdf(sub.savesAmount, currency)})` : "";
      doc.text(`${sub.original}  →  ${sub.replacement}${savings}`, marginX, y);
      y += 14;
      paragraph(sub.reason, { size: 9, indent: 10 });
    });
    rule();
  }

  // ---------------------------------------------------------------
  // Footer: disclaimer + page numbers
  // ---------------------------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(colors.muted);
    doc.text(
      "AI-generated plan — double-check quantities, prices, and dietary needs before you cook.",
      marginX,
      pageHeight - 42,
    );
    doc.text(`CookFlow — Page ${i} of ${pageCount}`, marginX, pageHeight - 28);
  }

  doc.save("cookflow-plan.pdf");
}
