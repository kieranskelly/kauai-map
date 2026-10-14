import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // A stray package-lock.json in the home dir makes Next infer the wrong
  // workspace root. Pin it to this project so Turbopack scopes file-watching
  // and module resolution correctly.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
