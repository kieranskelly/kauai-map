import { MapShell } from "@/components/MapShell";
import { MapUI } from "@/components/MapUI";

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      <MapShell />
      <MapUI />

      {/* Phase badge — sits behind the info card when it's open. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/50 backdrop-blur">
          tap a pin · ⭐ vote · 💬 comment
        </span>
      </div>
    </main>
  );
}
