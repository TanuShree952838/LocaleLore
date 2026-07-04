import { useState } from "react";
import type { LocalMyth } from "@/lib/types";
import { BookOpenIcon } from "@/components/ui/Icon";

interface FolkloreListProps {
  myths: LocalMyth[];
}

export function FolkloreList({ myths }: FolkloreListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(myths[0]?.id || null);

  if (myths.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted">
        <p className="text-sm">No local legends recorded for this destination yet.</p>
      </div>
    );
  }

  const activeMyth = myths.find((m) => m.id === selectedId) || myths[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-text">Oral Histories & Legends</h3>
        <p className="text-xs text-muted">
          Travelers who understand a land&apos;s stories understand its people. Explore the folklore of the destination.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Sidebar Selector List */}
        <div className="space-y-2 md:col-span-1">
          {myths.map((myth) => {
            const isSelected = myth.id === selectedId;
            return (
              <button
                key={myth.id}
                type="button"
                onClick={() => setSelectedId(myth.id)}
                aria-pressed={isSelected}
                className={`w-full text-left rounded-2xl p-4 border transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  isSelected
                    ? "bg-accent/10 border-accent/30 text-accent font-semibold ring-1 ring-accent/20"
                    : "bg-surface border-border text-text hover:bg-surface-2"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <BookOpenIcon aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold leading-snug line-clamp-1">{myth.title}</h4>
                    <p className="text-[10px] text-muted line-clamp-1">Folklore story</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Story Display Board */}
        <div className="md:col-span-2">
          {activeMyth && (
            <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm glass relative overflow-hidden space-y-5">
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />

              <div className="space-y-2">
                <span className="inline-block rounded-full bg-accent-2/15 px-3 py-1 text-[10px] font-bold text-accent-2 uppercase tracking-wide">
                  Ancient Legend
                </span>
                <h4 className="text-xl font-black text-text tracking-tight font-serif">
                  {activeMyth.title}
                </h4>
              </div>

              {/* Story text */}
              <div className="space-y-3 pt-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted font-sans">
                  The Story
                </h5>
                <p className="text-xs text-text/90 leading-relaxed font-serif italic border-l-2 border-border/80 pl-4">
                  &ldquo;{activeMyth.story}&rdquo;
                </p>
              </div>

              {/* Cultural context */}
              <div className="space-y-2 border-t border-border/60 pt-4">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-accent font-sans">
                  Cultural Significance & Meaning
                </h5>
                <p className="text-xs text-muted leading-relaxed">
                  {activeMyth.culturalContext}
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
