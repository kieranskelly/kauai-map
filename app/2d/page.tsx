import Link from "next/link";
import { MapShell } from "@/components/MapShell";
import { MapUI } from "@/components/MapUI";

// /2d — the original self-baked terrain map (DEM heightfield + satellite drape).
// Kept as a lightweight, no-external-dependency fallback to the photoreal home (/)
// — handy if the Google Tiles API is unavailable / over quota, or on weak devices.
export default function TwoDMap() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      <MapShell />
      <MapUI />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 p-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/50 backdrop-blur">
          tap a pin · ⭐ vote · 💬 comment
        </span>
        <Link
          href="/"
          className="pointer-events-auto rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/70 backdrop-blur-md transition hover:bg-black/55"
        >
          3D map
        </Link>
      </div>
    </main>
  );
}
