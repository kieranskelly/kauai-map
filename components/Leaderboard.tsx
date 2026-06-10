"use client";

import { useState } from "react";
import { POIS, CATEGORIES } from "@/lib/pois";
import { useMapStore } from "@/lib/store";
import { useCollab, statsFor } from "./CollabProvider";
import type { PoiStats } from "@/lib/collab/types";

const reactionTotal = (s: PoiStats) =>
  Object.values(s.reactions).reduce((a, b) => a + b, 0);

export function Leaderboard() {
  const { board } = useCollab();
  const select = useMapStore((s) => s.select);
  const [open, setOpen] = useState(false);

  // Rank every spot anyone has starred, "want" first then reactions as a
  // tiebreak. Spots with zero votes drop out so the list stays the group's
  // shortlist rather than the whole map.
  const ranked = POIS.map((poi) => ({ poi, stat: statsFor(board, poi.id) }))
    .filter((x) => x.stat.want > 0)
    .sort(
      (a, b) =>
        b.stat.want - a.stat.want ||
        reactionTotal(b.stat) - reactionTotal(a.stat) ||
        a.poi.name.localeCompare(b.poi.name),
    )
    .slice(0, 10);

  const leader = ranked[0]?.stat.want ?? 0;

  return (
    <div className="pointer-events-auto relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-sm font-medium text-white/90 shadow-lg backdrop-blur-md transition hover:bg-black/50"
      >
        <span aria-hidden>🏆</span>
        <span>Top picks</span>
        {ranked.length > 0 && (
          <span className="rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-[#0b1d2a]">
            {ranked.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d2a]/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
            Group favorites
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white/70"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {ranked.length === 0 ? (
            <p className="px-3 pb-3 text-xs leading-relaxed text-white/45">
              No votes yet. Tap a pin and hit{" "}
              <span className="text-amber-300">⭐ Want to go</span> to start the
              list.
            </p>
          ) : (
            <ul className="max-h-[60dvh] overflow-y-auto px-1.5 pb-2">
              {ranked.map(({ poi, stat }, i) => {
                const color = CATEGORIES[poi.category].color;
                return (
                  <li key={poi.id}>
                    <button
                      onClick={() => {
                        select(poi.id);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-white/10"
                    >
                      <span className="w-4 shrink-0 text-center text-xs font-semibold text-white/35">
                        {i + 1}
                      </span>
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm text-white/90">
                        {poi.name}
                      </span>
                      {/* tiny bar so the leader visually stands out */}
                      <span className="hidden h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-white/10 sm:block">
                        <span
                          className="block h-full rounded-full bg-amber-400"
                          style={{ width: `${(stat.want / leader) * 100}%` }}
                        />
                      </span>
                      <span className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-amber-300">
                        ⭐ {stat.want}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
