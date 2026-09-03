import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@cem/ui";
import { publicAsset } from "@/lib/public-asset";
import type { PartnerLogo } from "@/copy/types";
import "./logo-row.css";

interface LogoRowProps {
  title: string;
  items: PartnerLogo[];
  variant?: "default" | "muted" | "surface";
}

function PartnerLogoItem({ partner }: { partner: PartnerLogo }) {
  const content = partner.logoSrc ? (
    <Image
      src={publicAsset(partner.logoSrc)}
      alt={partner.logoAlt ?? partner.name}
      width={partner.logoSrc.endsWith(".svg") ? 320 : 200}
      height={partner.logoSrc.endsWith(".svg") ? 48 : 80}
      className={cn(
        "logo-row__logo",
        (partner.wide || partner.logoSrc?.endsWith(".svg")) && "logo-row__logo--wide",
      )}
    />
  ) : (
    <span className="logo-row__text text-center font-semibold tracking-tight text-foreground">
      {partner.name}
    </span>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="inline-flex max-w-[11rem] items-center justify-center px-2 outline-none focus-visible:ring-1 focus-visible:ring-ring sm:max-w-[13rem]"
      >
        {content}
      </a>
    );
  }

  return <span className="inline-flex items-center justify-center">{content}</span>;
}

export function LogoRow({ title, items, variant = "muted" }: LogoRowProps) {
  return (
    <Section sectionKey="partners" surface="muted" pattern="none" className="py-(--section-py)! md:py-(--section-py-lg)!">
      <Container className="flex flex-col items-center gap-10">
        <h3 className="type-meta font-bold uppercase text-muted-foreground">{title}</h3>
        <div className="logo-row__grid grid w-full max-w-4xl grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-10">
          {items.map((partner) => (
            <PartnerLogoItem key={partner.name} partner={partner} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
