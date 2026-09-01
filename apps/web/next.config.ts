import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@cem/ui"],
  images: {
    localPatterns: [
      { pathname: "/lab/**" },
      { pathname: "/equipment/**" },
      { pathname: "/brand/**" },
    ],
  },
  turbopack: {
    root: repoRoot,
  },
  async redirects() {
    return [
      {
        source: "/services/metrologia-dimensional",
        destination: "/services/controle-qualidade-dimensional",
        permanent: true,
      },
      {
        source: "/services/engenharia-reversa",
        destination: "/services/digitalizacao-engenharia-reversa",
        permanent: true,
      },
      {
        source: "/services/digitalizacao-3d",
        destination: "/services/digitalizacao-engenharia-reversa",
        permanent: true,
      },
      {
        source: "/services/tomografia-industrial",
        destination: "/services/inspecao-interna",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
