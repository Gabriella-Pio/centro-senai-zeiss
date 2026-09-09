import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@cem/ui";
import { publicAsset } from "@/lib/public-asset";
import type { PartnerLogo, SectionCopy } from "@/copy/types";
import "./logo-row.css";

interface LogoRowProps {
  heading: SectionCopy;
  items: PartnerLogo[];
  sectionKey?: string;
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
  ) : partner.caption ? (
    <span className="logo-row__lockup">
      <span className="logo-row__lockup-kicker">SENAI</span>
      <span className="logo-row__lockup-name">{partner.caption}</span>
    </span>
  ) : (
    <span className="logo-row__text">{partner.name}</span>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="logo-row__item"
      >
        {content}
      </a>
    );
  }

  return <span className="logo-row__item">{content}</span>;
}

export function LogoRow({ heading, items, sectionKey = "partners" }: LogoRowProps) {
  return (
    <Section sectionKey={sectionKey} surface="muted" pattern="none">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />
        <div className="logo-row__list">
          {items.map((partner) => (
            <PartnerLogoItem key={partner.name} partner={partner} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
