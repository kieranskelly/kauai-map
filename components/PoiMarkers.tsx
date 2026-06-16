"use client";

import { use, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { loadHeightField } from "@/lib/terrain";
import { lonLatToWorld } from "@/lib/geo";
import { POIS, CATEGORIES, type Poi } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

const STEM_H = 6;

function Marker({
  poi,
  pos,
}: {
  poi: Poi;
  pos: { x: number; y: number; z: number };
}) {
  const ref = useRef<THREE.Group>(null!);
  const selected = useMapStore((s) => s.selectedId === poi.id);
  const select = useMapStore((s) => s.select);
  const color = CATEGORIES[poi.category].color;

  // Scale by camera distance so pins stay a roughly constant on-screen size
  // (and tappable) whether you're viewing the whole island or one beach.
  useFrame(({ camera }) => {
    const g = ref.current;
    if (!g) return;
    const d = camera.position.distanceTo(g.position);
    g.scale.setScalar(
      THREE.MathUtils.clamp(d * 0.013, 0.4, 1.7) * (selected ? 1.4 : 1),
    );
  });

  return (
    <group ref={ref} name={poi.id} position={[pos.x, pos.y, pos.z]}>
      {/* stem from the surface up to the floating head */}
      <mesh position={[0, STEM_H / 2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, STEM_H, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>

      <Billboard position={[0, STEM_H, 0]}>
        {/* generous invisible hit target */}
        <mesh
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
          <circleGeometry args={[2.8, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* outline ring (white when selected, dark otherwise for contrast) */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[1.9, 28]} />
          <meshBasicMaterial color={selected ? "#ffffff" : "#0b1d2a"} />
        </mesh>
        {/* category-colored dot */}
        <mesh>
          <circleGeometry args={[1.4, 28]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Billboard>
    </group>
  );
}

export function PoiMarkers() {
  const hf = use(loadHeightField());
  const selectedCats = useMapStore((s) => s.selectedCats);
  const showAll = selectedCats.length === 0;

  return (
    <group>
      {POIS.filter((p) => showAll || selectedCats.includes(p.category)).map((poi) => (
        <Marker key={poi.id} poi={poi} pos={lonLatToWorld(hf, poi.lng, poi.lat)} />
      ))}
    </group>
  );
}
