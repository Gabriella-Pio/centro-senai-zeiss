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
  image: { src: string; alt: string };
}

export function LabIntro({ eyebrow, title, body, cta, image }: LabIntroProps) {
  return (
    <Section variant="default">
      <Container className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:justify-center lg:gap-16 xl:gap-56">
        <div className="w-full max-w-md shrink-0 rounded-(--radius) shadow-[0_2px_8px_rgb(28_25_23/0.08),0_22px_44px_-16px_rgb(28_25_23/0.32)] lg:self-stretch">
          <div className="relative aspect-4/3 h-full overflow-hidden rounded-(--radius) border border-border bg-muted lg:aspect-auto">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </div>
        </div>

        <div className="flex w-full max-w-2xl min-w-0 flex-col gap-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="sr-only">{title}</h2>
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl leading-[1.4]">
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
