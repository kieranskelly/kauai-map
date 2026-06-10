"use client";

// The photoreal map: Google Photorealistic 3D Tiles over Kauaʻi, rendered inside
// our own R3F scene via NASA-AMMOS 3d-tiles-renderer (no Cesium engine). POI pins
// are re-anchored onto the globe frame — see PhotorealMarkers for the ECEF/raycast
// draping. Lighting is a light-touch pass (sky + neutral tone-map + horizon fog);
// the tiles carry their own baked lighting, so we keep it cheap for mobile.

import { useCallback, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import {
  TilesRenderer,
  TilesPlugin,
  GlobeControls,
  TilesAttributionOverlay,
  TilesRendererContext,
} from "3d-tiles-renderer/r3f";
import {
  GoogleCloudAuthPlugin,
  ReorientationPlugin,
} from "3d-tiles-renderer/plugins";
import type { TilesRenderer as TilesRendererImpl } from "3d-tiles-renderer";
import { PhotorealMarkers } from "./PhotorealMarkers";
import { useMapStore } from "@/lib/store";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const D2R = Math.PI / 180;

// Kauaʻi center-ish — ReorientationPlugin drops this point at the world origin
// with +Y up, so a camera aimed at the origin frames the island.
const LAT = 22.05;
const LON = -159.5;

// Sun direction (NW, fairly high) for the Sky atmosphere. Only direction matters —
// three's Sky shader normalizes it. Kept warm-ish and high for clean daylight.
const SUN: [number, number, number] = [-0.35, 0.55, -0.78];
// Horizon haze the distant ocean/terrain fades into; tuned to the Sky's low band.
const HORIZON = "#cfe0ee";

// Lifts the live TilesRenderer instance out of the TilesRenderer subtree so the
// world-space markers (rendered as a sibling) can read it. The markers can't use
// the context directly because they live outside <TilesRenderer> on purpose — see
// the coordinate-frame note in PhotorealMarkers.
function TilesContextGrabber({
  onTiles,
}: {
  onTiles: (t: TilesRendererImpl | null) => void;
}) {
  const tiles = useContext(TilesRendererContext) as TilesRendererImpl | null;
  useEffect(() => {
    onTiles(tiles);
  }, [tiles, onTiles]);
  return null;
}

// Dev-only headless bridge: exposes renderer/scene/camera + the live TilesRenderer
// on window so the preview harness can force a synchronous frame and screenshot it
// (a backgrounded tab throttles rAF, but synchronous gl.render() still runs). The
// tile download/parse queues are rAF-gated too, so the harness also flips their
// schedulers to microtasks. Stripped from production builds.
function CaptureBridge() {
  const { gl, scene, camera, invalidate } = useThree();
  const tiles = useContext(TilesRendererContext) as TilesRendererImpl | null;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.__photoreal = {
      gl,
      scene,
      camera,
      tiles,
      invalidate,
      setCam(pos: [number, number, number], target: [number, number, number] = [0, 0, 0]) {
        camera.position.set(pos[0], pos[1], pos[2]);
        camera.lookAt(target[0], target[1], target[2]);
        camera.updateMatrixWorld();
        return this.status();
      },
      async pump(n = 20, delay = 200) {
        for (let i = 0; i < n; i++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (tiles) (tiles as any).update();
          gl.render(scene, camera);
          await new Promise((r) => setTimeout(r, delay));
        }
        return this.status();
      },
      render() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (tiles) (tiles as any).update();
        gl.render(scene, camera);
        return this.status();
      },
      status() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = tiles as any;
        return {
          loadProgress: t?.loadProgress,
          hasRoot: !!t?.root,
          groupChildren: t?.group?.children?.length ?? 0,
          camPos: [camera.position.x, camera.position.y, camera.position.z].map(
            (n) => Math.round(n),
          ),
        };
      },
    };
    return () => {
      delete w.__photoreal;
    };
  }, [gl, scene, camera, tiles, invalidate]);

  return null;
}

export function PhotorealScene() {
  const [tiles, setTiles] = useState<TilesRendererImpl | null>(null);
  const onTiles = useCallback((t: TilesRendererImpl | null) => setTiles(t), []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 30000, 45000], near: 10, far: 1e8, fov: 50 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      // Neutral tone-map (Khronos PBR neutral) preserves the photography's color
      // and brightness far better than ACES for baked imagery; small exposure lift
      // because Google's tiles read a touch dark on their own.
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
      // Tapping empty space (sky/ocean/terrain) dismisses the info card.
      onPointerMissed={() => useMapStore.getState().select(null)}
    >
      {/* Atmospheric sky dome (cheap shader) + a hint of horizon haze for depth. */}
      <Sky distance={600000} sunPosition={SUN} turbidity={6} rayleigh={1.6} mieCoefficient={0.006} mieDirectionalG={0.85} />
      <fog attach="fog" args={[HORIZON, 60000, 220000]} />

      {/* Tiles are textured/baked-lit, so lights barely matter — keep a low fill
          only so any stray standard-material tile isn't black. */}
      <hemisphereLight args={["#eaf2ff", "#2a3320", 0.5]} />

      <TilesRenderer>
        <TilesPlugin
          plugin={GoogleCloudAuthPlugin}
          args={[{ apiToken: KEY ?? "", autoRefreshToken: true }]}
        />
        <TilesPlugin
          plugin={ReorientationPlugin}
          args={[{ lat: LAT * D2R, lon: LON * D2R, height: 0 }]}
        />
        <GlobeControls enableDamping />
        <TilesAttributionOverlay />
        <TilesContextGrabber onTiles={onTiles} />
        <CaptureBridge />
      </TilesRenderer>

      {/* World-space pins — sibling of <TilesRenderer> on purpose (see notes). */}
      {tiles && <PhotorealMarkers tiles={tiles} />}
    </Canvas>
  );
}
