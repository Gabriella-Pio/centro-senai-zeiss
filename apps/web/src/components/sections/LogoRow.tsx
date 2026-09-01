import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@cem/ui";
import type { PartnerLogo } from "@/copy/types";
import "./logo-row.css";

interface LogoRowProps {
  title: string;
  items: PartnerLogo[];
  variant?: "default" | "muted" | "surface";
}

function PartnerLogoItem({ partner }: { partner: PartnerLogo }) {
  const isWide = partner.logoSrc.endsWith(".svg");
  const image = (
    <Image
      src={partner.logoSrc}
      alt={partner.logoAlt}
      width={isWide ? 320 : 200}
      height={isWide ? 48 : 80}
      className={cn("logo-row__logo", isWide && "logo-row__logo--wide")}
    />
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="inline-flex items-center justify-center outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {image}
      </a>
    );
  }

  return <span className="inline-flex items-center justify-center">{image}</span>;
}

export function LogoRow({ title, items, variant = "muted" }: LogoRowProps) {
  return (
    <Section variant={variant} className="py-(--section-py)! md:py-(--section-py-lg)!">
      <Container className="flex flex-col items-center gap-10">
        <h3 className="logo-row__title font-bold uppercase text-muted-foreground">{title}</h3>
        <div className="grid w-full max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-10">
          {items.map((partner) => (
            <PartnerLogoItem key={partner.name} partner={partner} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
