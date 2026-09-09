"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactBand, contactBandOnContact, contactBandOnQuote } from "@/copy/site";
import "./contact-cta-band.css";

function bandForPath(pathname: string) {
  if (pathname === "/contact") return contactBandOnContact;
  if (pathname === "/quote") return contactBandOnQuote;
  return contactBand;
}

export function ContactCtaBand() {
  const pathname = usePathname();
  const band = bandForPath(pathname);

  return (
    <Section sectionKey="contact" surface="dark" pattern="none" guide={false} aria-label={band.title}>
      <Container className="flex flex-col items-center gap-(--section-stack)">
        <SectionHeading
          align="center"
          eyebrow={band.eyebrow}
          title={band.title}
          description={band.description}
        />
        <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Ações de contato">
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
