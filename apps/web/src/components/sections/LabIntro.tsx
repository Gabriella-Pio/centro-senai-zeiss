import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes, mediaPlateClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { CtaCopy } from "@/copy/types";

interface LabIntroProps {
  eyebrow: string;
  title: string;
  body: string;
  cta?: CtaCopy;
  image: { src: string; alt: string; objectPosition?: string };
  sectionKey?: string;
  surface?: "cream" | "white" | "tint" | "muted" | "dark";
}

export function LabIntro({
  eyebrow,
  title,
  body,
  cta,
  image,
  sectionKey = "lab-intro",
  surface = "tint",
}: LabIntroProps) {
  const paragraphs = body.split(/\n\n+/);

  return (
    <Section sectionKey={sectionKey} surface={surface} pattern="none">
      <Container className="grid grid-cols-1 gap-(--section-stack) lg:grid-cols-2 lg:items-stretch lg:gap-x-(--section-inline) xl:gap-x-(--section-inline-lg)">
        <div className={mediaPlateClass("hidden min-h-0 lg:block lg:h-full")}>
          <div className={mediaFrameClass("relative aspect-4/3 min-h-0 lg:aspect-auto lg:h-full")}>
            <Image
              src={publicAsset(image.src)}
              alt={image.alt}
              fill
              className={mediaPhotoCoverClass}
              style={{ objectPosition: image.objectPosition ?? "50% 42%" }}
              sizes={mediaPhotoSizes.splitDesktop}
            />
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-col lg:justify-between">
          <div className="flex flex-col gap-(--section-stack-tight)">
            <SectionHeading align="left" className="max-w-none gap-3" eyebrow={eyebrow} title={title} />

            <div className="flex max-w-xl flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="type-lead text-muted-foreground font-light">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {cta ? (
            <SectionTextCta className="mt-(--section-stack-tight) lg:self-start" href={cta.href}>
              {cta.label}
            </SectionTextCta>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
