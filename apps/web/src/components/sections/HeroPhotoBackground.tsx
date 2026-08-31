"use client";

import Image from "next/image";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import {
  heroImageFrame,
  heroPhotoBlendStyle,
  heroPhotoFeatherMask,
  type HeroPhotoBlend,
} from "@/components/sections/hero-photo-blends";

type HeroPhotoBackgroundProps = {
  src: string;
  objectPosition?: string;
  zoom?: number;
  blend?: HeroPhotoBlend;
  parallax?: boolean;
};

export function HeroPhotoBackground({
  src,
  objectPosition = "55% 50%",
  zoom = 1,
  blend = "diagonal",
  parallax = true,
}: HeroPhotoBackgroundProps) {
  const desktopParallaxRef = useScrollParallax(0.35);
  const mobileParallaxRef = useScrollParallax(0.22);
  const style = heroPhotoBlendStyle(blend);
  const frame = heroImageFrame(objectPosition, zoom);

  return (
    <>
      <style>{`
        .hero-photo-diagonal {
          clip-path: polygon(26% 0, 100% 0, 100% 100%, 8% 100%);
        }
        .hero-photo-panel {
          border-radius: var(--radius) 0 0 var(--radius);
          border: 1px solid var(--color-border);
          box-shadow: 0 2px 8px rgb(28 25 23 / 0.06), 0 28px 56px -24px rgb(28 25 23 / 0.28);
        }
        .hero-photo-inset {
          border-radius: var(--radius);
          border: 1px solid var(--color-border);
        }
        .hero-photo-nav-scrim {
          background: linear-gradient(
            225deg,
            var(--background) 0%,
            var(--background) 36%,
            rgb(246 244 239 / 0.72) 58%,
            transparent 100%
          );
        }
      `}</style>

      <div
        aria-hidden
        className={`pointer-events-none absolute z-0 hidden lg:block ${style.shellClass ?? ""}`}
        style={style.shellStyle}
      >
        <div className="relative h-full w-full overflow-hidden">
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
                className="object-cover"
                style={{ objectPosition: frame.imageObjectPosition }}
                sizes="(min-width: 1024px) 62vw, 0px"
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="hero-photo-nav-scrim pointer-events-none absolute top-0 right-0 z-[1] h-[calc(var(--nav-height)+1rem)] w-[min(40vw,24rem)]"
        />

        {style.bottomFadeClass ? <div aria-hidden className={style.bottomFadeClass} /> : null}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(40vh,24rem)] overflow-hidden lg:hidden"
        style={{
          WebkitMaskImage: heroPhotoFeatherMask,
          maskImage: heroPhotoFeatherMask,
        }}
      >
        <div
          ref={parallax ? mobileParallaxRef : undefined}
          className="absolute -top-[12%] -bottom-[12%] left-0 right-0 will-change-transform"
          style={frame.frameStyle}
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: frame.imageObjectPosition }}
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>
    </>
  );
}
