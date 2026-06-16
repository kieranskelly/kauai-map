"use client";

import { POIS, CATEGORIES, textOn } from "@/lib/pois";
import { useMapStore } from "@/lib/store";
import { REACTIONS } from "@/lib/collab/types";
import { useCollab, statsFor, mineFor } from "./CollabProvider";
import { CommentThread } from "./CommentThread";

export function PoiCard() {
  const selectedId = useMapStore((s) => s.selectedId);
  const select = useMapStore((s) => s.select);
  const { board, toggleWant, toggleReaction } = useCollab();

  const poi = POIS.find((p) => p.id === selectedId) ?? null;
  const cat = poi ? CATEGORIES[poi.category] : null;
  const mapsUrl = poi
    ? `https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`
    : "#";

  const stat = poi ? statsFor(board, poi.id) : null;
  const mine = poi ? mineFor(board, poi.id) : null;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 transition-transform duration-300 ease-out ${
        poi ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <div className="pointer-events-auto flex max-h-[80dvh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1d2a]/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl">
        {poi && cat && stat && mine && (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: cat.color, color: textOn(cat.color) }}
                  >
                    <span aria-hidden>{cat.emoji}</span>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-white/45">
                    {poi.region} Shore
                  </span>
                </div>
                <h2 className="mt-1.5 text-lg font-semibold leading-tight text-white">
                  {poi.name}
                </h2>
              </div>
              <button
                onClick={() => select(null)}
                className="shrink-0 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {poi.blurb}
            </p>

            {/* ── Collaboration controls ───────────────────────────────── */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleWant(poi.id)}
                aria-pressed={mine.want}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  mine.want
                    ? "bg-amber-400 text-[#0b1d2a]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span aria-hidden>{mine.want ? "⭐" : "☆"}</span>
                Want to go
                {stat.want > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 text-xs ${
                      mine.want ? "bg-black/15" : "bg-white/15"
                    }`}
                  >
                    {stat.want}
                  </span>
                )}
              </button>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Maps
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </a>
            </div>

            {/* Reaction palette — one per person, tap again to clear. */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {REACTIONS.map((r) => {
                const count = stat.reactions[r] ?? 0;
                const on = mine.reaction === r;
                return (
                  <button
                    key={r}
                    onClick={() => toggleReaction(poi.id, r)}
                    aria-pressed={on}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm transition ${
                      on
                        ? "bg-white/25 ring-1 ring-white/40"
                        : "bg-white/5 hover:bg-white/15"
                    }`}
                  >
                    <span aria-hidden>{r}</span>
                    {count > 0 && (
                      <span className="text-xs text-white/70">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <CommentThread poiId={poi.id} />
          </>
        )}
      </div>
    </div>
  );
}
