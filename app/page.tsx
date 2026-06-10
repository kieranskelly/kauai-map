import Link from "next/link";
import { PhotorealShell } from "@/components/PhotorealShell";
import { MapUI } from "@/components/MapUI";

// Home = the photoreal map: Google Photorealistic 3D Tiles with the POI pins
// re-anchored onto the globe, plus the collaboration overlay (vote · react ·
// comment · leaderboard). The original self-baked terrain map lives at /2d as a
// lightweight, always-works fallback.
export default function Home() {
  const hasKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#0b1d2a] text-white">
      <PhotorealShell />
      <MapUI />

      {/* Bottom hint + link to the 2D fallback. The info card (z-20) slides over
          these when a spot is selected. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 p-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/55 backdrop-blur">
          tap a pin · ⭐ vote · 💬 comment
        </span>
        <Link
          href="/2d"
          className="pointer-events-auto rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/70 backdrop-blur-md transition hover:bg-black/55"
        >
          2D map
        </Link>
      </div>

      {!hasKey && (
        <div className="absolute inset-x-0 top-1/2 z-30 flex justify-center p-4">
          <span className="rounded-full bg-red-500/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
            No NEXT_PUBLIC_GOOGLE_MAPS_API_KEY found — set it in .env.local
          </span>
        </div>
      )}
    </main>
  );
}
