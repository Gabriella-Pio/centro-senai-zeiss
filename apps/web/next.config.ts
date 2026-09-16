import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const repoRoot = path.join(__dirname, "../..");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@cem/ui"],
  images: {
    localPatterns: [
      { pathname: "/lab/**" },
      { pathname: "/equipment/**" },
      { pathname: "/brand/**" },
      { pathname: "/team/**" },
    ],
  },
  turbopack: {
    // Next 16 exige o mesmo valor que outputFileTracingRoot.
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
      {
        source: "/:locale(en|de)/services/metrologia-dimensional",
        destination: "/:locale/services/controle-qualidade-dimensional",
        permanent: true,
      },
      {
        source: "/:locale(en|de)/services/engenharia-reversa",
        destination: "/:locale/services/digitalizacao-engenharia-reversa",
        permanent: true,
      },
      {
        source: "/:locale(en|de)/services/digitalizacao-3d",
        destination: "/:locale/services/digitalizacao-engenharia-reversa",
        permanent: true,
      },
      {
        source: "/:locale(en|de)/services/tomografia-industrial",
        destination: "/:locale/services/inspecao-interna",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
