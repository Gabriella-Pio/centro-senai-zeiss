import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoordinateGrid } from "@/components/sections/CoordinateGrid";
import { HeroPhotoBackground } from "@/components/sections/HeroPhotoBackground";
import { cn } from "@cem/ui";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes, mediaPlateClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import "./hero-photo.css";
import type { HeroPhotoBlend } from "@/components/sections/hero-photo-blends";
import type { CtaCopy } from "@/copy/types";

interface HeroProps {
  eyebrow: string;
  brand?: { left: string; right: string };
  title?: string;
  subtitle: string;
  body: string;
  primaryCta: CtaCopy;
  secondaryCta?: CtaCopy;
  image?: { src: string; alt: string; objectPosition?: string; zoom?: number };
  imageBlend?: HeroPhotoBlend;
  parallax?: boolean;
  place?: string;
  sectionKey?: string;
}

const HeroCta = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a"> & { href: string }>(
  function HeroCta({ href, ...props }, ref) {
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      return <a href={href} ref={ref} {...props} />;
    }
    return <Link href={href} ref={ref} {...props} />;
  },
);

export function Hero({
  eyebrow,
  brand,
  title,
  subtitle,
  body,
  primaryCta,
  secondaryCta,
  image,
  imageBlend = "panel",
  parallax = true,
  place,
  sectionKey = "hero",
}: HeroProps) {
  return (
    <Section
      sectionKey={sectionKey}
      surface="cream"
      pattern="none"
      className={
        image
          ? "relative overflow-hidden pt-[calc(var(--nav-height)+1.75rem)]! pb-(--section-after-hero)! md:pt-[calc(var(--nav-height)+3.5rem)]! md:pb-(--section-after-hero-lg)! lg:min-h-svh"
          : "relative overflow-hidden pt-[calc(var(--nav-height)+1.75rem)]! pb-(--section-after-hero)! md:pt-[calc(var(--nav-height)+3.5rem)]! md:pb-(--section-after-hero-lg)!"
      }
      clearNav
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <CoordinateGrid photoEdgeFade={Boolean(image)} />
      </div>

      {image ? (
        <HeroPhotoBackground
          src={publicAsset(image.src)}
          objectPosition={image.objectPosition}
          zoom={image.zoom}
          blend={imageBlend}
          parallax={parallax}
        />
      ) : null}

      {image ? (
        <div className="hero-photo-mobile lg:hidden">
          <div className={mediaPlateClass()}>
            <div className={mediaFrameClass("hero-photo-mobile__frame relative")}>
              <Image
                src={publicAsset(image.src)}
                alt={image.alt}
                fill
                priority
                className={mediaPhotoCoverClass}
                style={{ objectPosition: image.objectPosition ?? "50% 42%" }}
                sizes={mediaPhotoSizes.heroMobile}
              />
            </div>
          </div>
        </div>
      ) : null}

      <Container
        className={cn(
          "relative z-10",
          image && "lg:grid lg:min-h-[calc(100svh-var(--nav-height)-3.5rem-var(--section-after-hero-lg))] lg:grid-cols-2 lg:items-center",
        )}
      >

        <div className="max-w-2xl text-left">
          <Eyebrow className="max-w-[min(100%,18rem)] text-balance sm:max-w-none">{eyebrow}</Eyebrow>

          <h1 className="mt-5 type-display-lg font-heading font-bold text-foreground md:mt-8">
            {brand ? (
              <>
                {brand.left} <span className="text-primary">×</span> {brand.right}
              </>
            ) : (
              title
            )}
          </h1>

          <p className="mt-3 font-heading type-hero-subtitle font-semibold tracking-tight text-foreground sm:mt-4">
            {subtitle}
          </p>

          <p className="type-hero-lead mt-4 text-muted-foreground">{body}</p>

          <div
            className={cn(
              "mt-6 grid w-full gap-3 sm:mt-10",
              secondaryCta ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
            )}
          >
            <Button size="xl" className="w-full min-w-0" render={<HeroCta href={primaryCta.href} />}>
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button size="xl" variant="outline" className="w-full min-w-0" render={<HeroCta href={secondaryCta.href} />}>
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>

          {place ? <p className="type-meta mt-4 text-muted-foreground sm:mt-6">{place}</p> : null}
        </div>

        {image ? <div aria-hidden className="hidden lg:block" /> : null}
      </Container>
    </Section>
  );
}
