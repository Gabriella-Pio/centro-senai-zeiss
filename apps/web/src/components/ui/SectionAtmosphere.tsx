"use client";

import { cn } from "@cem/ui";

interface SectionAtmosphereProps {
  /** grade | glow | warm — textura local, com fade nas bordas (não encosta no topo/fim da seção). */
  tone?: "grid" | "glow" | "warm";
  className?: string;
}

export function SectionAtmosphere({ tone = "grid", className }: SectionAtmosphereProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-[var(--atmosphere-inset)] bottom-[var(--atmosphere-inset)] -z-10 overflow-hidden",
        tone === "grid"
          ? "section-atmosphere-grid"
          : tone === "warm"
            ? "section-atmosphere-warm"
            : "section-atmosphere-glow",
        className,
      )}
    />
  );
}
