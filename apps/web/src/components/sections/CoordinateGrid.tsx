type CoordinateGridProps = {
  /** Fade the grid out toward the bottom so the next section stays cream. */
  fade?: boolean;
};

/** T2 — grade de coordenadas. Só no Hero, atrás do texto, ~7%. */
export function CoordinateGrid({ fade = false }: CoordinateGridProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 text-foreground"
      style={{
        opacity: 0.07,
        ...(fade
          ? {
              maskImage: "linear-gradient(to bottom, #000 45%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent 100%)",
            }
          : {}),
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cem-grid-fine" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
          <pattern id="cem-grid-major" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="url(#cem-grid-fine)" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cem-grid-major)" />
      </svg>
    </div>
  );
}
