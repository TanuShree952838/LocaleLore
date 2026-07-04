import { useState } from "react";
import type { TimelineSlot, Currency } from "@/lib/types";
import { formatMoney } from "@/lib/format";

interface TimelineProps {
  timeline: TimelineSlot[];
  currency: Currency;
}

export function Timeline({ timeline, currency }: TimelineProps) {
  const [completedSlots, setCompletedSlots] = useState<Record<string, boolean>>({});

  const toggleSlot = (id: string) => {
    setCompletedSlots((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Group timeline slots by Day Number
  const days = timeline.reduce<Record<number, TimelineSlot[]>>((acc, slot) => {
    if (!acc[slot.dayNumber]) {
      acc[slot.dayNumber] = [];
    }
    acc[slot.dayNumber]!.push(slot);
    return acc;
  }, {});

  const totalSlots = timeline.length;
  const completedCount = Object.values(completedSlots).filter(Boolean).length;
  const progressPercent = totalSlots > 0 ? Math.round((completedCount / totalSlots) * 100) : 0;

  const slotIcons = {
    morning: "🌅",
    afternoon: "☀️",
    evening: "🌙",
  };

  const slotLabels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
  };

  return (
    <section aria-labelledby="timeline-heading" className="space-y-6">
      {/* Progress Bar Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm glass sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id="timeline-heading" className="text-sm font-bold text-text">
            Odyssey Progress
          </h3>
          <p className="text-xs text-muted">
            Mark off activities as you wander through your itinerary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text">
            {completedCount}/{totalSlots} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Multi-Day Timeline List */}
      <div className="space-y-8">
        {Object.entries(days).map(([dayNumStr, slots]) => {
          const dayNum = parseInt(dayNumStr);
          return (
            <div key={dayNum} className="space-y-4">
              <h4 className="inline-block rounded-lg bg-surface-3 px-3 py-1 text-xs font-black text-text uppercase tracking-wider">
                Day {dayNum}
              </h4>

              <div className="relative border-l border-border pl-6 ml-3 space-y-6">
                {slots.map((slot) => {
                  const isCompleted = !!completedSlots[slot.id];
                  return (
                    <div key={slot.id} className="relative group">
                      {/* Timeline Dot/Icon */}
                      <span
                        className={`absolute -left-[37px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border bg-surface text-xs shadow-sm transition-colors ${
                          isCompleted
                            ? "border-accent text-accent-fg bg-accent/90"
                            : "border-border text-text"
                        }`}
                      >
                        {isCompleted ? "✓" : slotIcons[slot.slot]}
                      </span>

                      {/* Timeline Body Box */}
                      <div
                        className={`rounded-2xl border p-5 shadow-sm transition-all ${
                          isCompleted
                            ? "border-border bg-bg/40 opacity-70"
                            : "border-border bg-surface hover:border-accent/40"
                        }`}
                      >
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                {slotLabels[slot.slot]}
                              </span>
                              <span className="text-xs text-muted">
                                • {formatMoney(slot.associatedCost, currency)}
                              </span>
                            </div>
                            <h5 className="mt-1 text-base font-bold text-text">
                              {slot.activityTitle}
                            </h5>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-bg px-2.5 py-1 text-xs font-semibold text-text transition-colors hover:bg-surface-2 select-none">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleSlot(slot.id)}
                              className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent/25"
                            />
                            <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                          </label>
                        </div>

                        <p className="mt-2 text-xs text-muted leading-relaxed">
                          {slot.activityDescription}
                        </p>

                        {/* Local Resident Insight */}
                        <div className="mt-3 rounded-lg bg-bg/60 p-3 text-xs leading-relaxed border-l-2 border-accent-2">
                          <span className="font-bold text-accent-2 block mb-0.5">
                            Guide Insight
                          </span>
                          <span className="text-text/90 italic">
                            &ldquo;{slot.localGuideInsight}&rdquo;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
