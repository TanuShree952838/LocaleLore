import { useState } from "react";
import type { TimelineSlot, Currency } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import {
  type LucideIcon,
  SunriseIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
} from "@/components/ui/Icon";

interface TimelineProps {
  timeline: TimelineSlot[];
  currency: Currency;
  isEditing?: boolean;
  onChangeSlot?: (
    id: string,
    patch: Partial<{ activityTitle: string; activityDescription: string; associatedCost: number }>,
  ) => void;
}

export function Timeline({ timeline, currency, isEditing = false, onChangeSlot }: TimelineProps) {
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

  const slotIcons: Record<TimelineSlot["slot"], LucideIcon> = {
    morning: SunriseIcon,
    afternoon: SunIcon,
    evening: MoonIcon,
  };

  const slotLabels: Record<TimelineSlot["slot"], string> = {
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
            Trip progress
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
                  const SlotIcon = slotIcons[slot.slot];
                  return (
                    <div key={slot.id} className="relative group">
                      {/* Timeline Dot/Icon */}
                      <span
                        className={`absolute -left-[37px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border bg-surface text-[0.85rem] shadow-sm transition-colors ${
                          isCompleted
                            ? "border-accent text-accent-fg bg-accent/90"
                            : "border-border text-accent"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckIcon aria-hidden="true" className="h-4 w-4" />
                        ) : (
                          <SlotIcon aria-hidden="true" className="h-4 w-4" />
                        )}
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
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                {slotLabels[slot.slot]}
                              </span>
                              {isEditing ? (
                                <span className="flex items-center gap-1 text-xs text-muted">
                                  •
                                  <input
                                    type="number"
                                    min={0}
                                    value={slot.associatedCost}
                                    onChange={(e) =>
                                      onChangeSlot?.(slot.id, {
                                        associatedCost: e.target.value === "" ? 0 : Number(e.target.value),
                                      })
                                    }
                                    className="w-20 rounded border border-accent/40 bg-bg px-1.5 py-0.5 text-xs text-text focus:border-accent focus:outline-none"
                                    aria-label={`Cost for ${slot.activityTitle}`}
                                  />
                                  {currency}
                                </span>
                              ) : (
                                <span className="text-xs text-muted">
                                  • {formatMoney(slot.associatedCost, currency)}
                                </span>
                              )}
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={slot.activityTitle}
                                onChange={(e) => onChangeSlot?.(slot.id, { activityTitle: e.target.value })}
                                className="mt-1 w-full rounded border border-accent/40 bg-bg px-2 py-1 text-base font-bold text-text focus:border-accent focus:outline-none"
                                aria-label="Activity title"
                              />
                            ) : (
                              <h5 className="mt-1 text-base font-bold text-text">
                                {slot.activityTitle}
                              </h5>
                            )}
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

                        {isEditing ? (
                          <textarea
                            value={slot.activityDescription}
                            onChange={(e) =>
                              onChangeSlot?.(slot.id, { activityDescription: e.target.value })
                            }
                            rows={2}
                            className="mt-2 w-full rounded border border-accent/40 bg-bg px-2 py-1 text-xs text-text leading-relaxed focus:border-accent focus:outline-none"
                            aria-label="Activity description"
                          />
                        ) : (
                          <p className="mt-2 text-xs text-muted leading-relaxed">
                            {slot.activityDescription}
                          </p>
                        )}

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
