"use client";

import { OCEAN_Y } from "@/lib/terrain";

export function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, OCEAN_Y, 0]}>
      {/* Large enough to reach the fog line in every direction. */}
      <planeGeometry args={[2400, 2400]} />
      {/* Translucent so the satellite shallows/reef read through near shore. */}
      <meshStandardMaterial
        color="#13627f"
        transparent
        opacity={0.78}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}
