import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
    <Section variant="default">
      <Container className="grid grid-cols-1 gap-(--section-stack) lg:grid-cols-2 lg:items-stretch lg:gap-x-(--section-inline) xl:gap-x-(--section-inline-lg)">
        <div className="relative aspect-4/3 min-h-0 overflow-hidden rounded-(--radius) border border-border bg-muted shadow-[0_2px_8px_rgb(28_25_23/0.08),0_22px_44px_-16px_rgb(28_25_23/0.32)] lg:aspect-auto lg:h-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            style={{ objectPosition: image.objectPosition ?? "50% 42%" }}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex min-h-0 w-full flex-col gap-(--section-stack-tight)">
          <Eyebrow>{eyebrow}</Eyebrow>

          <h2 className="sr-only">{title}</h2>
          <p className="font-heading text-xl font-semibold tracking-tight leading-[1.6] text-foreground sm:text-2xl sm:leading-[1.55]">
            {body}
          </p>

          <Link
            href={cta.href}
            className="relative inline-flex w-fit pb-0.5 text-sm font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:bg-foreground after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.45,0,0.55,1)] hover:after:scale-x-0 focus-visible:after:scale-x-0 motion-reduce:after:transition-none"
          >
            {cta.label}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
