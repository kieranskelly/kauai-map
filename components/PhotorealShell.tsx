"use client";

import dynamic from "next/dynamic";
import { LoadingOverlay } from "./LoadingOverlay";

// Client-only mount of the photoreal (Google 3D Tiles) scene. WebGL can't render
// on the server and `ssr: false` is only allowed inside a Client Component, so
// this shell is the boundary — mirrors MapShell, which does the same for the
// self-baked 2D terrain map (now at /2d).
const PhotorealScene = dynamic(
  () => import("./PhotorealScene").then((m) => m.PhotorealScene),
  { ssr: false, loading: () => <LoadingOverlay /> },
);

export function PhotorealShell() {
  return (
    <div className="absolute inset-0 touch-none">
      <PhotorealScene />
    </div>
  );
}
