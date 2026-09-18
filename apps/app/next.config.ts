import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.join(__dirname, "../..");
const apiOrigin = process.env.API_PROXY_URL ?? "http://localhost:3333";

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@cem/ui"],
  images: {
    localPatterns: [
      { pathname: "/brand/**" },
      { pathname: "/lab/**" },
      { pathname: "/equipment/**" },
    ],
  },
  turbopack: {
    root: repoRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
