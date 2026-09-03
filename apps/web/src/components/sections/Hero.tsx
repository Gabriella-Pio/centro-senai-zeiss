import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoordinateGrid } from "@/components/sections/CoordinateGrid";
import { HeroPhotoBackground } from "@/components/sections/HeroPhotoBackground";
import { cn } from "@cem/ui";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { HeroPhotoBlend } from "@/components/sections/hero-photo-blends";
import type { CtaCopy } from "@/copy/types";

interface HeroProps {
  eyebrow: string;
  brand: { left: string; right: string };
  subtitle: string;
  body: string;
  primaryCta: CtaCopy;
  secondaryCta: CtaCopy;
  image?: { src: string; alt: string; objectPosition?: string; zoom?: number };
  imageBlend?: HeroPhotoBlend;
  parallax?: boolean;
}

export function Hero({
  eyebrow,
  brand,
  subtitle,
  body,
  primaryCta,
  secondaryCta,
  image,
  imageBlend = "panel",
  parallax = false,
}: HeroProps) {
  return (
    <Section
      sectionKey="hero"
      surface="cream"
      pattern="none"
      className={
        image
          ? "relative overflow-hidden pb-(--section-after-hero)! md:pb-(--section-after-hero-lg)! lg:min-h-svh"
          : "relative overflow-hidden pb-(--section-after-hero)! md:pb-(--section-after-hero-lg)!"
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

      <Container
        className={cn(
          "relative z-10",
          image && "lg:grid lg:min-h-[calc(100svh-var(--page-pad-top))] lg:grid-cols-2 lg:items-center",
        )}
      >
        {image ? (
          <div className={mediaFrameClass("relative mb-8 aspect-4/3 lg:hidden")}>
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
        ) : null}

        <div className="max-w-2xl text-left">
          <Eyebrow className="max-w-[min(100%,18rem)] text-balance sm:max-w-none">{eyebrow}</Eyebrow>

          <h1 className="mt-8 type-display-lg font-heading font-bold text-foreground">
            {brand.left} <span className="text-primary">×</span> {brand.right}
          </h1>

          <p className="mt-4 font-heading text-hero-subtitle font-semibold tracking-tight text-foreground">
            {subtitle}
          </p>

          <p className="type-hero-lead text-muted-foreground">{body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="xl" render={<Link href={primaryCta.href} />}>
              {primaryCta.label}
            </Button>
            <Button size="xl" variant="outline" render={<Link href={secondaryCta.href} />}>
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        {image ? <div aria-hidden className="hidden lg:block" /> : null}
      </Container>
    </Section>
  );
}
