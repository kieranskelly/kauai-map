"use client";

// Fly-to-on-select for the photoreal map. When a spot is selected (pin tap or
// leaderboard click), the camera glides over to frame it, keeping the current
// viewing angle — the photoreal equivalent of the 2D map's CameraRig.
//
// Why it's not just a target-lerp: GlobeControls (unlike OrbitControls) owns the
// camera every frame at priority -1 and exposes no `target` to nudge — a manual
// tween would get stomped. So we disable the controls for the duration of the
// flight (its update() then no-ops), run our ease in a default-priority useFrame
// (runs AFTER the controls' no-op), and re-enable on arrival; GlobeControls then
// re-derives its pivot from wherever the camera landed.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import type { TilesRenderer as TilesRendererImpl } from "3d-tiles-renderer";
import { POIS } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

const D2R = Math.PI / 180;
const DIST = 4000; // framing distance from the spot (m) — spot + immediate surroundings
const MIN_UP = 0.3; // keep at least this much world-up in the view dir → never aim underground
const EASE = 3.5; // lerp rate (higher = snappier); matches the 2D rig's feel

type Toggleable = { enabled: boolean } | null;

export function PhotorealCameraRig({ tiles }: { tiles: TilesRendererImpl }) {
  const camera = useThree((s) => s.camera);
  const get = useThree((s) => s.get); // read the live GlobeControls (set asynchronously)

  const selectedId = useMapStore((s) => s.selectedId);

  const wantCam = useRef<THREE.Vector3 | null>(null);
  const lookTarget = useRef<THREE.Vector3 | null>(null); // eased look point (smooths the rotation)
  const finalTarget = useRef<THREE.Vector3 | null>(null); // the spot itself

  useEffect(() => {
    const controls = get().controls as Toggleable;

    // Deselect (or nothing selected) → abort any flight, hand control back.
    if (!selectedId) {
      wantCam.current = null;
      lookTarget.current = null;
      finalTarget.current = null;
      if (controls) controls.enabled = true;
      return;
    }

    const poi = POIS.find((p) => p.id === selectedId);
    if (!poi || !tiles.root) return;

    // Draped world target for the pin — one raycast on selection (cheap). Falls
    // back to the ellipsoid surface if no tile is loaded right there yet.
    const ellipsoid = tiles.ellipsoid;
    const ecef = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    ellipsoid.getCartographicToPosition(poi.lat * D2R, poi.lng * D2R, 0, ecef);
    ellipsoid.getCartographicToNormal(poi.lat * D2R, poi.lng * D2R, nrm);
    const mw = tiles.group.matrixWorld;
    const surf = ecef.applyMatrix4(mw);
    const up = nrm.transformDirection(mw);
    const ray = new THREE.Raycaster(
      surf.clone().addScaledVector(up, 9000),
      up.clone().negate(),
      0,
      20000,
    );
    const hits = ray.intersectObject(tiles.group, true);
    const target = hits.length ? hits[0].point.clone() : surf.clone();

    // Keep the current viewing direction; just recenter + set a comfy distance.
    const dir = camera.position.clone().sub(target);
    if (dir.lengthSq() < 1) dir.copy(up);
    dir.normalize();
    if (dir.y < MIN_UP) {
      dir.y = MIN_UP; // lift a shallow/below-horizon angle so we don't fly underground
      dir.normalize();
    }

    finalTarget.current = target;
    wantCam.current = target.clone().addScaledVector(dir, DIST);
    // Seed the eased look point at whatever the camera currently faces, so the
    // rotation pans smoothly toward the spot instead of snapping on frame 1.
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    lookTarget.current = camera.position
      .clone()
      .addScaledVector(fwd, camera.position.distanceTo(target));

    if (controls) controls.enabled = false; // take the wheel for the flight
  }, [selectedId, tiles, camera, get]);

  useFrame((_, dt) => {
    if (!wantCam.current || !finalTarget.current || !lookTarget.current) return;
    const k = 1 - Math.exp(-dt * EASE);
    camera.position.lerp(wantCam.current, k);
    lookTarget.current.lerp(finalTarget.current, k);
    camera.lookAt(lookTarget.current);
    camera.updateMatrixWorld();

    if (camera.position.distanceTo(wantCam.current) < Math.max(25, DIST * 0.01)) {
      // Arrived → settle exactly and hand control back to GlobeControls.
      camera.position.copy(wantCam.current);
      camera.lookAt(finalTarget.current);
      camera.updateMatrixWorld();
      wantCam.current = null;
      lookTarget.current = null;
      finalTarget.current = null;
      const controls = get().controls as Toggleable;
      if (controls) controls.enabled = true;
    }
  });

  return null;
}
