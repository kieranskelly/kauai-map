"use client";

import { useMapStore } from "@/lib/store";

// North-up compass. The dial rotates so its red north pointer always aims at true
// north on screen (heading is computed in the photoreal camera rig each frame and
// published to the store). Tapping it flies the view back to north-up. Lives in the
// DOM overlay; the in-canvas rig does the camera work — see PhotorealCameraRig.
export function Compass() {
  const deg = useMapStore((s) => s.compassDeg);
  const requestNorth = useMapStore((s) => s.requestNorth);

  return (
    <button
      onClick={requestNorth}
      aria-label="Face north (reset orientation)"
      title="Face north"
      className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/35 shadow-lg backdrop-blur-md transition hover:bg-black/55"
    >
      <div
        className="h-7 w-7 will-change-transform"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <svg viewBox="0 0 28 28" className="h-full w-full" aria-hidden>
          {/* north (red) + south (light) needle */}
          <polygon points="14,7 10,15 14,12.5 18,15" fill="#f05a3c" />
          <polygon points="14,23 10,15 14,17.5 18,15" fill="#cbd5e1" />
          <text
            x="14"
            y="6"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="700"
            fill="#ffffff"
          >
            N
          </text>
        </svg>
      </div>
    </button>
  );
}
