"use client";

import { use, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import {
  loadHeightField,
  worldSizeZ,
  eleAtUV,
  eleToWorldY,
  SIZE_X,
} from "@/lib/terrain";

// Mesh resolution along X. Z is derived to keep cells square. ~360×297 segments
// ≈ 107k verts — built once, so with frameloop="demand" there's no per-frame cost.
const SEG_X = 360;

export function Terrain() {
  // Both suspend until ready; resolved under the <Suspense> boundary in Scene.
  const hf = use(loadHeightField());
  const sat = useTexture("/kauai-sat.webp");

  const geometry = useMemo(() => {
    const sizeZ = worldSizeZ(hf);
    const segZ = Math.round((SEG_X * sizeZ) / SIZE_X);
    const geo = new THREE.PlaneGeometry(SIZE_X, sizeZ, SEG_X, segZ);
    const pos = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = x / SIZE_X + 0.5; // 0=west → 1=east
      const v = y / sizeZ + 0.5; // 0=south → 1=north
      pos.setZ(i, eleToWorldY(eleAtUV(hf, u, v), hf.maxEle));
    }

    geo.rotateX(-Math.PI / 2); // local +Z (height) → world +Y
    geo.computeVertexNormals(); // smooth normals → natural hillshade
    return geo;
  }, [hf]);

  // Satellite as albedo; the directional light shading the displaced normals is
  // what produces the relief/hillshade.
  sat.colorSpace = THREE.SRGBColorSpace;
  sat.anisotropy = 8;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={sat} roughness={1} metalness={0} />
    </mesh>
  );
}
