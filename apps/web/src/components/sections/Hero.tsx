import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoordinateGrid } from "@/components/sections/CoordinateGrid";
import type { CtaCopy } from "@/copy/types";

interface HeroProps {
  eyebrow: string;
  brand: { left: string; right: string };
  subtitle: string;
  body: string;
  primaryCta: CtaCopy;
  secondaryCta: CtaCopy;
}

export function Hero({ eyebrow, brand, subtitle, body, primaryCta, secondaryCta }: HeroProps) {
  return (
    <Section variant="default" className="relative overflow-hidden pb-20! md:pb-28!" clearNav>
      <CoordinateGrid fade />
      <Container className="relative z-10 text-left">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h1 className="mt-8 font-heading text-display-lg font-bold tracking-tight leading-[1.08] text-foreground">
          {brand.left} <span className="text-primary">×</span> {brand.right}
        </h1>

        <p className="mt-4 font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {subtitle}
        </p>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{body}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="xl" render={<Link href={primaryCta.href} />}>
            {primaryCta.label}
          </Button>
          <Button size="xl" variant="outline" render={<Link href={secondaryCta.href} />}>
            {secondaryCta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
