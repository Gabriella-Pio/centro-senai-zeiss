import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoordinateGrid } from "@/components/sections/CoordinateGrid";
import { HeroPhotoBackground } from "@/components/sections/HeroPhotoBackground";
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
}

export function Hero({
  eyebrow,
  brand,
  subtitle,
  body,
  primaryCta,
  secondaryCta,
  image,
  imageBlend = "diagonal",
}: HeroProps) {
  return (
    <Section
      variant="default"
      className={
        image
          ? "relative overflow-hidden pb-(--section-after-hero)! md:pb-(--section-after-hero-lg)! lg:min-h-svh"
          : "relative overflow-hidden pb-(--section-after-hero)! md:pb-(--section-after-hero-lg)!"
      }
      clearNav
    >
      {image ? (
        <HeroPhotoBackground
          src={image.src}
          objectPosition={image.objectPosition}
          zoom={image.zoom}
          blend={imageBlend}
        />
      ) : null}

      <div
        className={
          image
            ? "pointer-events-none absolute inset-y-0 left-0 z-0 w-full max-w-[min(100%,46rem)] lg:max-w-[min(58%,52rem)]"
            : "pointer-events-none absolute inset-0 z-0"
        }
      >
        <CoordinateGrid fade />
      </div>

      <Container className="relative z-10 text-left">
        <div className={image ? "max-w-2xl" : undefined}>
          <Eyebrow>{eyebrow}</Eyebrow>

          <h1 className="mt-8 font-heading text-display-lg font-bold tracking-tight leading-[1.08] text-foreground">
            {brand.left} <span className="text-primary">×</span> {brand.right}
          </h1>

          <p className="mt-4 font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {subtitle}
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="xl" render={<Link href={primaryCta.href} />}>
              {primaryCta.label}
            </Button>
            <Button size="xl" variant="outline" render={<Link href={secondaryCta.href} />}>
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
