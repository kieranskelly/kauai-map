// Bake real Kauaʻi terrain into static assets the app loads at runtime.
//
//   public/kauai-height.bin   Float32 elevation grid (meters), row 0 = north
//   public/kauai-sat.webp     satellite drape (Web Mercator, aligned to the grid)
//   public/kauai-meta.json    { bbox, gridWidth, gridHeight, maxEle, ... }
//
// Elevation  : AWS Terrarium tiles (free, no key), stitched + decoded.
// Satellite  : single ESRI World Imagery export in EPSG:3857 (same projection
//              as the tiles) so imagery and heightfield align pixel-for-pixel.
//
// Run:  node scripts/bake-terrain.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "public");

// --- Configuration ---------------------------------------------------------
// Kauaʻi bounding box (a little ocean padding on every side).
const BBOX = { minLon: -159.82, minLat: 21.84, maxLon: -159.27, maxLat: 22.26 };
const ELE_ZOOM = 12; // ~35 m/px at this latitude
const HEIGHT_LONG = 540; // height grid long side (px)
const SAT_LONG = 2048; // satellite long side (px)
const SAT_QUALITY = 82;
const CONCURRENCY = 8;
const TILE = 256;

// --- Web Mercator / slippy-tile math --------------------------------------
const R = 20037508.342789244; // half Mercator world extent (m)
const lon2x = (lon, z) => ((lon + 180) / 360) * 2 ** z; // fractional tile X
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};
const mercX = (lon) => (lon * R) / 180;
const mercY = (lat) =>
  (Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) * (R / 180);

// --- helpers ---------------------------------------------------------------
async function fetchBuf(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "kauai-map-bake/1.0 (personal trip map)" },
      });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 404) return null;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
  }
  throw new Error("failed to fetch " + url);
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

function bilinear(grid, W, H, fx, fy) {
  const x0 = Math.max(0, Math.min(W - 1, Math.floor(fx)));
  const y0 = Math.max(0, Math.min(H - 1, Math.floor(fy)));
  const x1 = Math.min(W - 1, x0 + 1);
  const y1 = Math.min(H - 1, y0 + 1);
  const dx = fx - x0;
  const dy = fy - y0;
  const a = grid[y0 * W + x0];
  const b = grid[y0 * W + x1];
  const c = grid[y1 * W + x0];
  const d = grid[y1 * W + x1];
  return (
    a * (1 - dx) * (1 - dy) +
    b * dx * (1 - dy) +
    c * (1 - dx) * dy +
    d * dx * dy
  );
}

// --- 1. Elevation: stitch + decode Terrarium tiles ------------------------
async function bakeElevation() {
  const z = ELE_ZOOM;
  const tx0 = Math.floor(lon2x(BBOX.minLon, z));
  const tx1 = Math.floor(lon2x(BBOX.maxLon, z));
  const ty0 = Math.floor(lat2y(BBOX.maxLat, z)); // north → smaller y
  const ty1 = Math.floor(lat2y(BBOX.minLat, z));
  const cols = tx1 - tx0 + 1;
  const rows = ty1 - ty0 + 1;
  const W = cols * TILE;
  const H = rows * TILE;
  console.log(`  elevation: ${cols}×${rows} tiles (${cols * rows}) at z${z}`);

  const big = new Float32Array(W * H);
  const coords = [];
  for (let ty = ty0; ty <= ty1; ty++)
    for (let tx = tx0; tx <= tx1; tx++) coords.push({ tx, ty });

  let done = 0;
  await pool(coords, CONCURRENCY, async ({ tx, ty }) => {
    const url = `https://elevation-tiles-prod.s3.amazonaws.com/terrarium/${z}/${tx}/${ty}.png`;
    const buf = await fetchBuf(url);
    process.stdout.write(`\r  elevation tiles: ${++done}/${coords.length}`);
    if (!buf) return;
    const { data } = await sharp(buf)
      .resize(TILE, TILE)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const ox = (tx - tx0) * TILE;
    const oy = (ty - ty0) * TILE;
    for (let py = 0; py < TILE; py++) {
      for (let px = 0; px < TILE; px++) {
        const si = (py * TILE + px) * 3;
        const ele =
          data[si] * 256 + data[si + 1] + data[si + 2] / 256 - 32768;
        big[(oy + py) * W + (ox + px)] = ele;
      }
    }
  });
  process.stdout.write("\n");

  // Exact bbox pixel window inside the stitched grid (fractional).
  const pxMinX = (lon2x(BBOX.minLon, z) - tx0) * TILE;
  const pxMaxX = (lon2x(BBOX.maxLon, z) - tx0) * TILE;
  const pxMinY = (lat2y(BBOX.maxLat, z) - ty0) * TILE;
  const pxMaxY = (lat2y(BBOX.minLat, z) - ty0) * TILE;
  const cropW = pxMaxX - pxMinX;
  const cropH = pxMaxY - pxMinY;

  // Grid dims preserve the Mercator crop aspect.
  let gw, gh;
  if (cropW >= cropH) {
    gw = HEIGHT_LONG;
    gh = Math.round((HEIGHT_LONG * cropH) / cropW);
  } else {
    gh = HEIGHT_LONG;
    gw = Math.round((HEIGHT_LONG * cropW) / cropH);
  }

  const grid = new Float32Array(gw * gh);
  let maxEle = -Infinity;
  let minEle = Infinity;
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const fx = pxMinX + (gx / (gw - 1)) * cropW;
      const fy = pxMinY + (gy / (gh - 1)) * cropH;
      let ele = bilinear(big, W, H, fx, fy);
      if (!Number.isFinite(ele)) ele = 0;
      ele = Math.max(-500, Math.min(2200, ele)); // clamp ocean/outliers
      grid[gy * gw + gx] = ele;
      if (ele > maxEle) maxEle = ele;
      if (ele < minEle) minEle = ele;
    }
  }

  await writeFile(path.join(OUT, "kauai-height.bin"), Buffer.from(grid.buffer));
  console.log(
    `  → kauai-height.bin  ${gw}×${gh}  ele ${minEle.toFixed(0)}…${maxEle.toFixed(0)} m`,
  );
  return { gw, gh, maxEle, minEle, cropAspect: cropH / cropW };
}

// --- 2. Satellite: single ESRI World Imagery export (EPSG:3857) -----------
async function bakeSatellite(cropAspect) {
  const minX = mercX(BBOX.minLon);
  const maxX = mercX(BBOX.maxLon);
  const minY = mercY(BBOX.minLat);
  const maxY = mercY(BBOX.maxLat);
  let w, h;
  if (cropAspect <= 1) {
    w = SAT_LONG;
    h = Math.round(SAT_LONG * cropAspect);
  } else {
    h = SAT_LONG;
    w = Math.round(SAT_LONG / cropAspect);
  }
  const url =
    `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export` +
    `?bbox=${minX},${minY},${maxX},${maxY}&bboxSR=3857&imageSR=3857` +
    `&size=${w},${h}&format=jpg&transparent=false&f=image`;
  console.log(`  satellite: ESRI export ${w}×${h}`);
  const buf = await fetchBuf(url);
  if (!buf) throw new Error("satellite export returned no image");
  await sharp(buf).webp({ quality: SAT_QUALITY }).toFile(
    path.join(OUT, "kauai-sat.webp"),
  );
  console.log(`  → kauai-sat.webp  ${w}×${h}`);
  return { satWidth: w, satHeight: h };
}

// --- main ------------------------------------------------------------------
async function main() {
  await mkdir(OUT, { recursive: true });
  console.log("Baking Kauaʻi terrain…");
  const ele = await bakeElevation();
  const sat = await bakeSatellite(ele.cropAspect);
  const meta = {
    bbox: BBOX,
    eleZoom: ELE_ZOOM,
    gridWidth: ele.gw,
    gridHeight: ele.gh,
    maxEle: Math.round(ele.maxEle),
    minEle: Math.round(ele.minEle),
    satWidth: sat.satWidth,
    satHeight: sat.satHeight,
    bakedAt: "static", // avoid Date.now() for determinism
  };
  await writeFile(
    path.join(OUT, "kauai-meta.json"),
    JSON.stringify(meta, null, 2),
  );
  console.log("  → kauai-meta.json");
  console.log("Done.");
}

main().catch((e) => {
  console.error("\nBake failed:", e);
  process.exit(1);
});
