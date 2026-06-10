"use client";

import { CollabProvider } from "./CollabProvider";
import { Filters } from "./Filters";
import { Leaderboard } from "./Leaderboard";
import { PoiCard } from "./PoiCard";

// All the DOM chrome that overlays the 3D canvas. Wrapped in CollabProvider so
// the leaderboard and the info card share one polled board + identity.
export function MapUI() {
  return (
    <CollabProvider>
      {/* Top bar: title (left) · leaderboard (right), then the filter row. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-2 p-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-2">
          <div className="pointer-events-auto rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-medium tracking-tight text-white/90 shadow-lg backdrop-blur-md">
            🌋 Kauaʻi
          </div>
          <Leaderboard />
        </div>
        <div className="flex justify-center">
          <Filters />
        </div>
      </div>

      {/* Bottom sheet for the selected spot (vote · react · comment) */}
      <PoiCard />
    </CollabProvider>
  );
}
