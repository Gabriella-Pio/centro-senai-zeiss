import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import { institutionalHeading } from "@/copy/institutional";

export function InstitutionalHero() {
  const { eyebrow, title, description } = institutionalHeading;

  return (
    <Section variant="default" clearNav>
      <Container className="grid grid-cols-1 gap-(--section-stack) lg:grid-cols-2 lg:items-stretch lg:gap-x-(--section-inline)">
        <div className="flex flex-col gap-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="type-display-sm font-heading font-bold text-foreground">{title}</h1>
          {description ? (
            <p className="type-lead text-muted-foreground font-light">{description}</p>
          ) : null}
        </div>

        <div
          className={mediaFrameClass(
            "relative aspect-4/3 min-h-0 shadow-[0_24px_48px_-32px_rgb(0_87_184/0.15)] lg:aspect-auto lg:min-h-[22rem]",
          )}
        >
          <Image
            src={publicAsset("/lab/centro.jpg")}
            alt="Vista do Centro de Excelência em Metrologia SENAI ZEISS na Faculdade SENAI Ítalo Bologna."
            fill
            className={mediaPhotoCoverClass}
            style={{ objectPosition: "50% 40%" }}
            sizes={mediaPhotoSizes.split}
            priority
          />
        </div>
      </Container>
    </Section>
  );
}
