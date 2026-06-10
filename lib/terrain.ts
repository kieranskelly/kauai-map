// Terrain projection, loading, and sampling. The heavy data lives in baked
// static assets (see scripts/bake-terrain.mjs); this module turns them into a
// world-space heightfield the scene (and, in Phase 3, the POI markers) share.

export interface TerrainMeta {
  bbox: { minLon: number; minLat: number; maxLon: number; maxLat: number };
  eleZoom: number;
  gridWidth: number;
  gridHeight: number;
  maxEle: number;
  minEle: number;
  satWidth: number;
  satHeight: number;
}

export interface HeightField extends TerrainMeta {
  /** Row-major elevations in meters; row 0 = north, length = gridWidth*gridHeight. */
  data: Float32Array;
}

// World footprint. X spans longitude (west→east); Z spans latitude. The peak is
// exaggerated to MAX_HEIGHT so the island reads as dramatic from orbit (true
// relief over a 240-wide plane would be nearly flat).
export const SIZE_X = 240;
export const MAX_HEIGHT = 40;
export const OCEAN_Y = 0;
export const SEA_FLOOR = -0.6;

let _hf: Promise<HeightField> | null = null;

/** Module-cached so React 19's `use()` gets a stable promise across renders. */
export function loadHeightField(): Promise<HeightField> {
  if (!_hf) {
    _hf = (async () => {
      const [meta, bin] = await Promise.all([
        fetch("/kauai-meta.json").then((r) => r.json() as Promise<TerrainMeta>),
        fetch("/kauai-height.bin").then((r) => r.arrayBuffer()),
      ]);
      return { ...meta, data: new Float32Array(bin) };
    })();
  }
  return _hf;
}

/** World depth (Z) preserving the Mercator aspect of the baked grid. */
export function worldSizeZ(hf: HeightField): number {
  return SIZE_X * (hf.gridHeight / hf.gridWidth);
}

function bilinearEle(hf: HeightField, col: number, row: number): number {
  const { gridWidth: W, gridHeight: H, data } = hf;
  const x0 = Math.max(0, Math.min(W - 1, Math.floor(col)));
  const y0 = Math.max(0, Math.min(H - 1, Math.floor(row)));
  const x1 = Math.min(W - 1, x0 + 1);
  const y1 = Math.min(H - 1, y0 + 1);
  const dx = col - x0;
  const dy = row - y0;
  const a = data[y0 * W + x0];
  const b = data[y0 * W + x1];
  const c = data[y1 * W + x0];
  const d = data[y1 * W + x1];
  return (
    a * (1 - dx) * (1 - dy) + b * dx * (1 - dy) + c * (1 - dx) * dy + d * dx * dy
  );
}

/**
 * Elevation (m) at normalized UV.
 *   u: 0 = west  → 1 = east
 *   v: 0 = south → 1 = north  (matches PlaneGeometry's v; v=1 is the +Y edge,
 *      which we orient toward north, and grid row 0 is north)
 */
export function eleAtUV(hf: HeightField, u: number, v: number): number {
  const col = u * (hf.gridWidth - 1);
  const row = (1 - v) * (hf.gridHeight - 1);
  return bilinearEle(hf, col, row);
}

/** Elevation (m) → world Y. Below sea level snaps to the hidden sea floor. */
export function eleToWorldY(ele: number, maxEle: number): number {
  if (ele <= 0) return SEA_FLOOR;
  return (ele / maxEle) * MAX_HEIGHT;
}
