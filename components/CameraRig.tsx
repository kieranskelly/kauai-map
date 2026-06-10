"use client";

import { use, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { loadHeightField } from "@/lib/terrain";
import { lonLatToWorld } from "@/lib/geo";
import { POIS } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

type OrbitLike = { target: THREE.Vector3; update: () => void };

/** Smoothly recenters the view on the selected POI, keeping the current angle. */
export function CameraRig() {
  const hf = use(loadHeightField());
  const controls = useThree((s) => s.controls) as unknown as OrbitLike | null;
  const camera = useThree((s) => s.camera);
  const selectedId = useMapStore((s) => s.selectedId);

  const wantTarget = useRef<THREE.Vector3 | null>(null);
  const wantCam = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!selectedId || !controls) return;
    const poi = POIS.find((p) => p.id === selectedId);
    if (!poi) return;
    const w = lonLatToWorld(hf, poi.lng, poi.lat);
    const tgt = new THREE.Vector3(w.x, w.y + 4, w.z);
    // Keep the current viewing direction; just recenter and set a comfy range.
    const dir = camera.position.clone().sub(controls.target).normalize();
    wantTarget.current = tgt;
    wantCam.current = tgt.clone().add(dir.multiplyScalar(95));
  }, [selectedId, hf, controls, camera]);

  useFrame((_, dt) => {
    if (!wantTarget.current || !controls || !wantCam.current) return;
    const k = 1 - Math.exp(-dt * 3.5);
    controls.target.lerp(wantTarget.current, k);
    camera.position.lerp(wantCam.current, k);
    controls.update();
    if (controls.target.distanceTo(wantTarget.current) < 0.4) {
      wantTarget.current = null;
      wantCam.current = null;
    }
  });

  return null;
}
