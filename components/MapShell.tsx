"use client";

import dynamic from "next/dynamic";
import { LoadingOverlay } from "./LoadingOverlay";

// The Three.js scene is loaded client-only: WebGL can't render on the server,
// and `ssr: false` is only permitted inside a Client Component (Next 16 rule).
// This also code-splits `three` out of the initial server response.
const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => <LoadingOverlay />,
});

export function MapShell() {
  return (
    <div className="absolute inset-0 touch-none">
      <Scene />
    </div>
  );
}
