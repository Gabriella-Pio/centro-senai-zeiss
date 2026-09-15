"use client";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { useCopy } from "@/copy/CopyProvider";
import "../../app/not-found-page.css";

export function NotFoundView() {
  const copy = useCopy();

  return (
    <Section sectionKey="not-found" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="not-found-page">
        <div className="not-found-page__masthead">
          <Eyebrow>{copy.notFoundCopy.eyebrow}</Eyebrow>
          <p className="not-found-page__code">{copy.notFoundCopy.code}</p>
          <SectionHeading
            align="left"
            level={1}
            className="max-w-none"
            title={copy.notFoundCopy.title}
            description={copy.notFoundCopy.description}
          />
        </div>

        <div className="not-found-page__actions">
          <SectionTextCta href={copy.notFoundCopy.homeCta.href}>{copy.notFoundCopy.homeCta.label}</SectionTextCta>
          <SectionTextCta href={copy.servicesCatalog.allServicesCta.href}>
            {copy.servicesCatalog.allServicesCta.label}
          </SectionTextCta>
        </div>
      </Container>
    </Section>
  );
}
