// Project lon/lat onto the terrain's world space. This is the inverse of the
// bake-time mapping (see scripts/bake-terrain.mjs): longitude is linear across
// the bbox; latitude goes through the Web Mercator transform. The zoom factor
// cancels in the ratios, so we use the unscaled form here.

import {
  type HeightField,
  SIZE_X,
  worldSizeZ,
  eleAtUV,
  eleToWorldY,
} from "./terrain";

const lat2y = (lat: number) => {
  const r = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2;
};

export interface WorldPos {
  x: number;
  y: number; // ground height (clamped to >= sea level)
  z: number;
  u: number;
  v: number;
  ele: number;
}

export function lonLatToWorld(
  hf: HeightField,
  lon: number,
  lat: number,
): WorldPos {
  const { minLon, maxLon, minLat, maxLat } = hf.bbox;
  const u = (lon - minLon) / (maxLon - minLon); // 0=west → 1=east
  const yMax = lat2y(maxLat);
  const yMin = lat2y(minLat);
  const v = 1 - (lat2y(lat) - yMax) / (yMin - yMax); // 0=south → 1=north

  const x = (u - 0.5) * SIZE_X;
  const z = (0.5 - v) * worldSizeZ(hf); // north → -Z (matches Terrain)
  const ele = eleAtUV(hf, u, v);
  // Clamp to sea level so coastal pins float at the waterline, not the hidden
  // sea floor when the DEM samples just offshore.
  const y = Math.max(eleToWorldY(ele, hf.maxEle), 0);
  return { x, y, z, u, v, ele };
}
