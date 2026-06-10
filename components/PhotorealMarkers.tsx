"use client";

// POI pins for the photoreal (Google 3D Tiles) map.
//
// Coordinate-frame note — this is the whole trick:
//   • The tileset is recentered by ReorientationPlugin so a point near Kauaʻi's
//     center sits at the world origin with +Y up. Internally each tile mesh lives
//     in ECEF (earth-centered) coords under `tiles.group`, whose matrixWorld is
//     the ECEF→world transform.
//   • We render these markers as WORLD-SPACE siblings of <TilesRenderer> (normal
//     scene children, so three updates their matrixWorld every frame — unlike the
//     library's <TileSetRoot>, which freezes matrixWorldAutoUpdate). Each pin's
//     world anchor = its ECEF position pushed through tiles.group.matrixWorld,
//     then raycast straight down onto the loaded tiles so it drapes on the real
//     surface (there is no terrain-height API; the ray self-corrects as tiles
//     refine). Kauaʻi spans <0.5°, so "up" is within ~0.4° of +Y everywhere —
//     the stems stay visually vertical and the billboards face the camera.

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import type { TilesRenderer } from "3d-tiles-renderer";
import { POIS, CATEGORIES, type Poi } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

const D2R = Math.PI / 180;

// Geometry is authored small (≈ unit metres) and scaled per-frame by camera
// distance so every pin holds a constant on-screen size whether you're 55 km out
// over the whole island or 2 km from one beach. See scale math in <Marker>.
const HEAD = 1.0; // outline-ring radius (base units)
const DOT = 0.72; // colored-dot radius
const HIT = 2.2; // invisible tap target radius
const STEM_R = 0.07; // stem radius
const STEM_H = 3.0; // stem height → head floats this far above the ground anchor

// ── Static per-POI geometry: ECEF surface point + ellipsoid up-normal ──────────
// These never change (they're pure lat/lon), so compute once. The only thing that
// varies is tiles.group.matrixWorld, applied fresh each drape pass.
interface PoiGeo {
  poi: Poi;
  ecef: THREE.Vector3; // ellipsoid-surface (height 0) position, ECEF
  normal: THREE.Vector3; // outward surface normal, ECEF
}

function buildGeo(tiles: TilesRenderer): PoiGeo[] {
  const ellipsoid = tiles.ellipsoid;
  return POIS.map((poi) => {
    const ecef = new THREE.Vector3();
    const normal = new THREE.Vector3();
    ellipsoid.getCartographicToPosition(poi.lat * D2R, poi.lng * D2R, 0, ecef);
    ellipsoid.getCartographicToNormal(poi.lat * D2R, poi.lng * D2R, normal);
    return { poi, ecef, normal };
  });
}

function Marker({
  poi,
  anchor,
}: {
  poi: Poi;
  anchor: THREE.Vector3;
}) {
  const ref = useRef<THREE.Group>(null!);
  const selected = useMapStore((s) => s.selectedId === poi.id);
  const select = useMapStore((s) => s.select);
  const color = CATEGORIES[poi.category].color;

  // Constant screen size: pixels ∝ worldSize / distance, so worldSize ∝ distance
  // holds it fixed. Clamp generously for the metre-scale frame (distances run
  // ~1k–150k). Selected pins get a gentle bump.
  useFrame(({ camera }) => {
    const g = ref.current;
    if (!g) return;
    const d = camera.position.distanceTo(g.position);
    g.scale.setScalar(
      THREE.MathUtils.clamp(d * 0.011, 10, 1600) * (selected ? 1.35 : 1),
    );
  });

  return (
    <group ref={ref} name={poi.id} position={anchor}>
      {/* stem plugs the head into the surface; depth-tested so it reads as
          attached to the terrain (occludes correctly behind ridges). */}
      <mesh position={[0, STEM_H / 2, 0]}>
        <cylinderGeometry args={[STEM_R, STEM_R, STEM_H, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} fog={false} />
      </mesh>

      <Billboard position={[0, STEM_H, 0]}>
        {/* Invisible, depth-test-off hit target — a tap always lands even when
            the pin is behind a mountain, so no spot is ever un-selectable. */}
        <mesh
          renderOrder={20}
          onClick={(e) => {
            e.stopPropagation();
            select(poi.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <circleGeometry args={[HIT, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
        </mesh>
        {/* Head is drawn depth-test-OFF + late renderOrder so every pin stays
            visible above the photoreal terrain (a planning map you can always
            read), while the stem still sinks into the ground for grounding. */}
        <mesh position={[0, 0, -0.01]} renderOrder={21}>
          <circleGeometry args={[HEAD, 28]} />
          <meshBasicMaterial color={selected ? "#ffffff" : "#0b1d2a"} depthTest={false} transparent fog={false} />
        </mesh>
        <mesh renderOrder={22}>
          <circleGeometry args={[DOT, 28]} />
          <meshBasicMaterial color={color} depthTest={false} transparent fog={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

export function PhotorealMarkers({ tiles }: { tiles: TilesRenderer }) {
  const active = useMapStore((s) => s.active);
  const geo = useMemo(() => buildGeo(tiles), [tiles]);

  // Anchors are world-space positions, filled in progressively as we raycast.
  // anchorsRef is the working copy useFrame reads/writes; `anchors` is the state
  // snapshot we render from (reading a ref during render is disallowed, and a
  // published Map gives us the re-render for free).
  const anchorsRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const [anchors, setAnchors] = useState<Map<string, THREE.Vector3>>(
    () => new Map(),
  );

  // Drape bookkeeping. We sweep a few POIs per frame (cheap, no stalls), cycle
  // the whole list a handful of times to catch better elevation as tiles refine,
  // then freeze. cursor walks the list; cycles counts completed passes.
  const cursor = useRef(0);
  const cycles = useRef(0);
  const PER_FRAME = 8;
  const MAX_CYCLES = 8;

  useFrame(() => {
    const group = tiles.group;
    if (!tiles.root || group.children.length === 0) return; // nothing to hit yet
    if (cycles.current >= MAX_CYCLES) return; // converged → stop raycasting (no allocs past here)
    // Once every POI is draped AND the tileset is fully loaded, one more pass then stop.
    const allDraped = anchorsRef.current.size >= geo.length;
    if (allDraped && (tiles.loadProgress ?? 1) >= 1 && cycles.current >= 2) {
      cycles.current = MAX_CYCLES;
      return;
    }

    // Scratch allocated here (only during the brief drape window — the guards
    // above bail before this once converged, so steady-state does zero work).
    const ray = new THREE.Raycaster();
    ray.near = 0;
    ray.far = 20000;
    const up = new THREE.Vector3();
    const surf = new THREE.Vector3();
    const origin = new THREE.Vector3();
    const mw = group.matrixWorld;
    let changed = false;

    for (let k = 0; k < PER_FRAME; k++) {
      const i = cursor.current;
      const g = geo[i];

      // world surface point + world up at this POI
      surf.copy(g.ecef).applyMatrix4(mw);
      up.copy(g.normal).transformDirection(mw); // rotate-only, normalized
      origin.copy(surf).addScaledVector(up, 9000); // 9 km above

      ray.set(origin, up.clone().negate());
      const hits = ray.intersectObject(group, true);

      let next: THREE.Vector3 | null = null;
      if (hits.length > 0) {
        next = hits[0].point.clone(); // true draped surface (world)
      } else if (!anchorsRef.current.has(g.poi.id)) {
        next = surf.clone(); // fallback: ellipsoid surface until a tile loads
      }
      if (next) {
        const prev = anchorsRef.current.get(g.poi.id);
        if (!prev || prev.distanceToSquared(next) > 1) {
          anchorsRef.current.set(g.poi.id, next);
          changed = true;
        }
      }

      cursor.current = (cursor.current + 1) % geo.length;
      if (cursor.current === 0) cycles.current += 1;
    }

    if (changed) setAnchors(new Map(anchorsRef.current)); // publish for render
  });

  return (
    <group>
      {geo.map(({ poi }) => {
        if (!active[poi.category]) return null;
        const anchor = anchors.get(poi.id);
        if (!anchor) return null;
        return <Marker key={poi.id} poi={poi} anchor={anchor} />;
      })}
    </group>
  );
}
