// Shared map state. Lives outside React's tree (Zustand singleton) so the 3D
// pins inside the <Canvas> and the DOM card/filters outside it read the same
// source of truth without prop-drilling across the renderer boundary.

import { create } from "zustand";
import { CATEGORY_KEYS, type CategoryKey } from "./pois";

interface MapState {
  selectedId: string | null;
  select: (id: string | null) => void;

  /** category key → visible. All on by default. */
  active: Record<CategoryKey, boolean>;
  toggleCategory: (key: CategoryKey) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),

  active: Object.fromEntries(CATEGORY_KEYS.map((k) => [k, true])) as Record<
    CategoryKey,
    boolean
  >,
  toggleCategory: (key) =>
    set((s) => ({ active: { ...s.active, [key]: !s.active[key] } })),
}));

// Dev-only test handle: lets the preview harness drive selection without
// having to land a tap on a 3D pin (synthetic taps miss the R3F raycaster).
// Stripped from production builds by the NODE_ENV check.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __mapStore?: typeof useMapStore }).__mapStore =
    useMapStore;
}
