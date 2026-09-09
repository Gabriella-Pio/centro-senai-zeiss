import type { ReactNode } from "react";

type RingClusterItem = {
  id: string;
  node: ReactNode;
};

export type RingClusterProps = {
  items: RingClusterItem[];
  /** Raios em % do tamanho do contêiner (ex.: 42 => 42% da largura). */
  ringRadiiPct?: number[];
  /**
   * 'semi-top' posiciona em cima (dome). 'full' posiciona 360°.
   * Para 'full', os itens podem ficar mais próximos e precisar ajuste nos raios.
   */
  arcMode?: "semi-top" | "full";
  /** Centro do sistema em % (por default 50/50). */
  cxPct?: number;
  cyPct?: number;
};

function polarToXY({
  cxPct,
  cyPct,
  radiusPct,
  angleDeg,
}: {
  cxPct: number;
  cyPct: number;
  radiusPct: number;
  angleDeg: number;
}) {
  const rad = (angleDeg * Math.PI) / 180;
  const xPct = cxPct + radiusPct * Math.cos(rad);
  const yPct = cyPct - radiusPct * Math.sin(rad);
  return { xPct, yPct };
}

function topSemiArcPath({
  cxPct,
  cyPct,
  radiusPct,
}: {
  cxPct: number;
  cyPct: number;
  radiusPct: number;
}) {
  // SVG viewBox 0..100 com y invertido (y cresce pra baixo).
  // Para arco do topo: start em 180° (esquerda) e end em 0° (direita).
  const start = polarToXY({ cxPct, cyPct, radiusPct, angleDeg: 180 });
  const end = polarToXY({ cxPct, cyPct, radiusPct, angleDeg: 0 });
  // large-arc-flag=0 (180° não é > 180). sweep-flag=0 pra escolher a parte de cima.
  return `M ${start.xPct} ${start.yPct} A ${radiusPct} ${radiusPct} 0 0 0 ${end.xPct} ${end.yPct}`;
}

export function RingCluster({
  items,
  ringRadiiPct = [48, 34, 22],
  arcMode = "semi-top",
  cxPct = 50,
  cyPct = 50,
}: RingClusterProps) {
  const n = items.length;

  return (
    <div className="relative mx-auto w-full max-w-5xl aspect-[18/7]">
      {/* Arcos (decorativos) */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {ringRadiiPct.map((r, idx) => (
          <path
            key={r}
            d={topSemiArcPath({ cxPct, cyPct, radiusPct: r })}
            fill="none"
            stroke={`rgba(0,87,184,${0.28 - idx * 0.06})`}
            strokeWidth={0.65 - idx * 0.09}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Itens posicionados */}
      {items.map((item, i) => {
        const ringIdx = i % ringRadiiPct.length;
        const radiusPct = ringRadiiPct[ringIdx];

        let angleDeg = 90;
        if (arcMode === "semi-top") {
          if (n === 1) angleDeg = 90;
          else angleDeg = 180 - (i * 180) / (n - 1);
        } else {
          // 360°: começando no topo (-90)
          angleDeg = -90 + (i * 360) / Math.max(1, n);
        }

        const { xPct, yPct } = polarToXY({
          cxPct,
          cyPct,
          radiusPct,
          angleDeg,
        });

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 100 - ringIdx,
            }}
          >
            {item.node}
          </div>
        );
      })}
    </div>
  );
}

