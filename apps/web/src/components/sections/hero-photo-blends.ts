import type { CSSProperties } from "react";

/** Recortes da foto no hero — “fade” = máscara (pluma), não overlay branco. */

export type HeroPhotoBlend = "feather" | "diagonal" | "panel" | "column" | "inset";

type BlendStyle = {
  shellClass?: string;
  shellStyle?: CSSProperties;
  frameClass?: string;
  frameStyle?: CSSProperties;
  bottomFadeClass?: string;
};

/** objectPosition: `'X% Y%'` — X = esquerda/direita; Y = cima/baixo. zoom: 1 = cover cheio; 0.85 = menos zoom. */
export function heroImageFrame(objectPosition: string, zoom = 1) {
  const [x = "50%", y = "50%"] = objectPosition.trim().split(/\s+/);
  const yNum = parseFloat(y);
  const verticalPan = Number.isFinite(yNum)
    ? `translateY(${(50 - yNum) * 0.5}%)`
    : undefined;
  const scale = zoom !== 1 ? `scale(${zoom})` : undefined;
  const transform = [verticalPan, scale].filter(Boolean).join(" ");

  return {
    imageObjectPosition: `${x} 50%`,
    frameStyle: transform
      ? ({
          transform,
          transformOrigin: `${x} 50%`,
        } satisfies CSSProperties)
      : undefined,
  };
}

export const heroPhotoFeatherMask =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 14%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.88) 50%, black 58%, black 100%)";

export const heroPhotoColumnMask =
  "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)";

export const heroPhotoInsetMask =
  "radial-gradient(ellipse 98% 92% at 58% 48%, black 30%, transparent 74%)";

export function heroPhotoBlendStyle(blend: HeroPhotoBlend): BlendStyle {
  switch (blend) {
    case "feather":
      return {
        shellClass: "inset-y-0 right-0 w-[62vw] max-w-[56rem]",
        shellStyle: {
          WebkitMaskImage: heroPhotoFeatherMask,
          maskImage: heroPhotoFeatherMask,
        },
        bottomFadeClass:
          "absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-background via-background/35 to-transparent",
      };
    case "diagonal":
      return {
        shellClass:
          "inset-y-0 right-0 w-[62vw] max-w-[56rem] hero-photo-diagonal",
      };
    case "panel":
      return {
        shellClass:
          "inset-y-0 right-0 w-[62vw] max-w-[56rem] hero-photo-panel overflow-hidden",
        bottomFadeClass:
          "absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background via-background/50 to-transparent",
      };
    case "column":
      return {
        shellClass: "inset-y-0 right-[max(0px,calc((100vw-var(--max-width-content))/2+2rem))] w-[46vw] max-w-[40rem]",
        shellStyle: {
          WebkitMaskImage: heroPhotoColumnMask,
          maskImage: heroPhotoColumnMask,
        },
        bottomFadeClass:
          "absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/40 to-transparent",
      };
    case "inset":
      return {
        shellClass:
          "top-(--nav-height) right-6 bottom-12 w-[min(52vw,48rem)] hero-photo-inset overflow-hidden",
        frameStyle: {
          WebkitMaskImage: heroPhotoInsetMask,
          maskImage: heroPhotoInsetMask,
        },
        bottomFadeClass: "absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent",
      };
  }
}
