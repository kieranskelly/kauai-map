"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Terrain } from "./Terrain";
import { Ocean } from "./Ocean";
import { PoiMarkers } from "./PoiMarkers";
import { CameraRig } from "./CameraRig";
import { useMapStore } from "@/lib/store";

export function Scene() {
  return (
    <Canvas
      // Cap DPR at 2 so retina phones don't render 3x the pixels for no gain.
      dpr={[1, 2]}
      // Continuous rendering: guarantees the island paints on load and keeps
      // orbit buttery-smooth. TODO(polish): move to frameloop="demand" with idle
      // detection to cut mobile battery use, verified on a real device.
      frameloop="always"
      // preserveDrawingBuffer keeps the last rendered frame in the buffer, which
      // demand mode needs for screenshots/image export (and avoids a blank canvas
      // when the compositor reads it between demanded frames).
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 110, 175], fov: 42, near: 0.1, far: 4000 }}
      // Tapping empty space (terrain/ocean) dismisses the info card.
      onPointerMissed={() => useMapStore.getState().select(null)}
    >
      {/* Deep ocean-blue background the fog fades into. */}
      <color attach="background" args={["#0b1d2a"]} />
      <fog attach="fog" args={["#0b1d2a", 360, 1100]} />

      {/* Sky/ground fill + a warm directional "sun" from the NE for relief.
          Kept moderate so the satellite imagery stays legible rather than
          double-shaded on top of its own baked lighting. */}
      <hemisphereLight args={["#cfe6ff", "#243018", 0.55]} />
      <directionalLight position={[140, 180, 120]} intensity={1.4} color="#fff3df" />
      <ambientLight intensity={0.35} />

      <Suspense fallback={null}>
        <Terrain />
        <PoiMarkers />
        <CameraRig />
        <Preload all />
      </Suspense>
      <Ocean />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={55}
        maxDistance={520}
        zoomSpeed={0.8}
        rotateSpeed={0.7}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
