"use client";

import Image from "next/image";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import { mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import {
  heroImageFrame,
  heroPhotoBlendStyle,
  type HeroPhotoBlend,
} from "@/components/sections/hero-photo-blends";
import "./hero-photo.css";

type HeroPhotoBackgroundProps = {
  src: string;
  objectPosition?: string;
  zoom?: number;
  blend?: HeroPhotoBlend;
  parallax?: boolean;
};

/** Foto do hero — desktop only. Mobile usa moldura inline em Hero.tsx. */
export function HeroPhotoBackground({
  src,
  objectPosition = "55% 50%",
  zoom = 1,
  blend = "panel",
  parallax = false,
}: HeroPhotoBackgroundProps) {
  const desktopParallaxRef = useScrollParallax(0.35);
  const style = heroPhotoBlendStyle(blend);
  const frame = heroImageFrame(objectPosition, zoom);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-[1] hidden lg:block ${style.shellClass ?? ""}`}
      style={style.shellStyle}
    >
        <div className="relative h-full w-full overflow-hidden bg-muted">
          <div
            ref={parallax ? desktopParallaxRef : undefined}
            className="absolute inset-x-0 top-[calc(-1*var(--nav-height))] h-[calc(100%+var(--nav-height))] will-change-transform"
          >
            <div
              className="absolute -top-[20%] -bottom-[20%] left-0 right-0"
              style={frame.frameStyle}
            >
              <Image
                src={src}
                alt=""
                fill
                priority
                className={mediaPhotoCoverClass}
                style={{ objectPosition: frame.imageObjectPosition }}
                sizes={mediaPhotoSizes.heroDesktop}
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="hero-photo-nav-scrim pointer-events-none absolute inset-x-0 top-0 z-[1] h-[calc(var(--nav-height)+1.25rem)]"
        />

        {style.bottomFadeClass ? <div aria-hidden className={style.bottomFadeClass} /> : null}
    </div>
  );
}
