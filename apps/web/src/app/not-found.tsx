import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { notFoundCopy, servicesCatalog } from "@/copy";
import "./not-found-page.css";

export const metadata: Metadata = {
  title: "Página não encontrada | Centro de Excelência em Metrologia SENAI ZEISS",
};

export default function NotFound() {
  return (
    <Section sectionKey="not-found" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="not-found-page">
        <div className="not-found-page__masthead">
          <Eyebrow>{notFoundCopy.eyebrow}</Eyebrow>
          <p className="not-found-page__code">{notFoundCopy.code}</p>
          <SectionHeading
            align="left"
            level={1}
            className="max-w-none"
            title={notFoundCopy.title}
            description={notFoundCopy.description}
          />
        </div>

        <div className="not-found-page__actions">
          <SectionTextCta href={notFoundCopy.homeCta.href}>{notFoundCopy.homeCta.label}</SectionTextCta>
          <SectionTextCta href={servicesCatalog.allServicesCta.href}>
            {servicesCatalog.allServicesCta.label}
          </SectionTextCta>
        </div>
      </Container>
    </Section>
  );
}
