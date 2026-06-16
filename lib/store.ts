// Shared map state. Lives outside React's tree (Zustand singleton) so the 3D
// pins inside the <Canvas> and the DOM card/filters outside it read the same
// source of truth without prop-drilling across the renderer boundary.

import { create } from "zustand";
import { type CategoryKey } from "./pois";

interface MapState {
  selectedId: string | null;
  select: (id: string | null) => void;

  /** Selected filter categories (additive). Empty = no filter → all pins shown. */
  selectedCats: CategoryKey[];
  toggleCategory: (key: CategoryKey) => void;
  clearCategories: () => void;

  /** On-screen bearing of true north, in degrees (0 = north points up). Written
   *  every frame by the photoreal camera rig; read by the DOM compass widget. */
  compassDeg: number;
  setCompassDeg: (deg: number) => void;
  /** Bumped when the user taps the compass; the rig watches it to fly north-up. */
  northNonce: number;
  requestNorth: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),

  selectedCats: [],
  toggleCategory: (key) =>
    set((s) => ({
      selectedCats: s.selectedCats.includes(key)
        ? s.selectedCats.filter((k) => k !== key)
        : [...s.selectedCats, key],
    })),
  clearCategories: () => set({ selectedCats: [] }),

  compassDeg: 0,
  setCompassDeg: (deg) => set({ compassDeg: deg }),
  northNonce: 0,
  requestNorth: () => set((s) => ({ northNonce: s.northNonce + 1 })),
}));

// Dev-only test handle: lets the preview harness drive selection without
// having to land a tap on a 3D pin (synthetic taps miss the R3F raycaster).
// Stripped from production builds by the NODE_ENV check.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __mapStore?: typeof useMapStore }).__mapStore =
    useMapStore;
}
