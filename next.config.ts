import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home dir makes Next infer the wrong
  // workspace root. Pin it to this project so Turbopack scopes file-watching
  // and module resolution correctly. (Vercel builds in an isolated dir, so this
  // only matters for local dev.)
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
