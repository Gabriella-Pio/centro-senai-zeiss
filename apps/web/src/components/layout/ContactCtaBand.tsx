"use client";

import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCopy } from "@/copy/CopyProvider";
import { Link, usePathname } from "@/i18n/navigation";
import "./contact-cta-band.css";

export function ContactCtaBand() {
  const copy = useCopy();
  const pathname = usePathname();
  const band =
    pathname === "/contact"
      ? copy.contactBandOnContact
      : pathname === "/quote"
        ? copy.contactBandOnQuote
        : copy.contactBand;

  return (
    <Section
      sectionKey="contact"
      surface="dark"
      pattern="none"
      guide={false}
      reveal={false}
      aria-label={band.title}
    >
      <Container className="flex flex-col items-center gap-(--section-stack)">
        <SectionHeading
          align="center"
          eyebrow={band.eyebrow}
          title={band.title}
          description={band.description}
        />
        <nav className="contact-cta-actions" aria-label={band.actionsLabel}>
          <Button size="xl" className="contact-cta-primary" render={<Link href={band.primaryCta.href} />}>
            {band.primaryCta.label}
          </Button>
          <Button
            size="xl"
            variant="secondary"
            className="contact-cta-secondary"
            render={<Link href={band.secondaryCta.href} />}
          >
            {band.secondaryCta.label}
          </Button>
        </nav>
      </Container>
    </Section>
  );
}
