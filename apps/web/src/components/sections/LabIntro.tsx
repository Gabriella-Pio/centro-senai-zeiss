import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionAtmosphere } from "@/components/ui/SectionAtmosphere";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineLink } from "@/components/ui/HairlineLink";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import type { CtaCopy } from "@/copy/types";

interface LabIntroProps {
  eyebrow: string;
  title: string;
  body: string;
  cta: CtaCopy;
  image: { src: string; alt: string; objectPosition?: string };
}

export function LabIntro({ eyebrow, title, body, cta, image }: LabIntroProps) {
  return (
    <Section variant="default" zone="intro">
      <SectionAtmosphere tone="warm" />
      <Container className="relative z-10 grid grid-cols-1 gap-(--section-stack) lg:grid-cols-2 lg:items-stretch lg:gap-x-(--section-inline) xl:gap-x-(--section-inline-lg)">
        <div
          className={mediaFrameClass(
            "relative aspect-4/3 min-h-0 shadow-[0_24px_48px_-32px_rgb(0_87_184/0.15)] lg:aspect-auto lg:h-full"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className={mediaPhotoCoverClass}
            style={{ objectPosition: image.objectPosition ?? "50% 42%" }}
            sizes={mediaPhotoSizes.split}
          />
        </div>

        <div className="flex min-h-0 w-full flex-col gap-(--section-stack-tight)">
          <SectionHeading align="left" className="max-w-none gap-3" eyebrow={eyebrow} title={title} />

          <p className="type-lead text-muted-foreground font-light">{body}</p>

          <HairlineLink href={cta.href}>{cta.label}</HairlineLink>
        </div>
      </Container>
    </Section>
  );
}
