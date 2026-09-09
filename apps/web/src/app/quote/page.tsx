import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { quoteForm, quoteHeading, quoteNotes, services } from "@/copy";
import "./quote-page.css";

interface QuotePageProps {
  searchParams: Promise<{ service?: string }>;
}

export const metadata: Metadata = {
  title: "Orçamento | Centro de Excelência em Metrologia SENAI ZEISS",
  description:
    "Solicite orçamento de medição, digitalização, inspeção interna, prototipação 3D ou consultoria em qualidade no Centro de Excelência em Metrologia SENAI ZEISS.",
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const { service } = await searchParams;

  return (
    <Section id="orcamento" sectionKey="quote" surface="cream" pattern="none" ambient="none" clearNav>
      <Container>
        <SectionHeading align="left" level={1} className="quote-page__heading" {...quoteHeading} />
        <div className="quote-page">
          <div className="quote-page__notes">
            <h2 className="quote-page__notes-title">{quoteNotes.heading}</h2>
            <dl>
              {quoteNotes.items.map((item) => (
                <div key={item.label} className="quote-page__note">
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <QuoteForm
            defaultServiceId={service}
            services={services.map((item) => ({ id: item.id, label: item.label }))}
            copy={quoteForm}
          />
        </div>
      </Container>
    </Section>
  );
}
