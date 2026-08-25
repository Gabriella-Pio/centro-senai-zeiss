import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  // next fica no node_modules da raiz do workspace; sem isso o Turbopack
  // infere apps/web/src/app e não acha next/package.json.
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
