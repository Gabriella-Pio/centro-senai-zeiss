import { cn } from "@cem/ui";
import "./media-plate.css";

/** Encosto técnico atrás da foto — mesma moldura, deslocada. Sem sombra. */
export function mediaPlateClass(className?: string) {
  return cn("media-plate", className);
}

/** Moldura padrão de foto em todo o site — hero panel, LabIntro, cards, drawer. */
export function mediaFrameClass(className?: string) {
  return cn("overflow-hidden rounded-(--radius) border border-border bg-muted", className);
}

export const mediaPhotoCoverClass = "object-cover";

/** Proporção portrait compartilhada — cards de serviço e tiles de diferenciais. */
export const cardPhotoAspectClass = "aspect-4/5";

export const mediaPhotoSizes = {
  card: "(min-width: 1024px) 22rem, 45vw",
  heroDesktop: "(min-width: 1024px) 62vw, 0px",
  heroMobile: "100vw",
  split: "(min-width: 768px) 50vw, 0px",
  splitDesktop: "(min-width: 1024px) 50vw, 0px",
  drawer: "36rem",
  equipment: "(min-width: 64rem) 22rem, (min-width: 43.75rem) 42vw, 72vw",
} as const;
