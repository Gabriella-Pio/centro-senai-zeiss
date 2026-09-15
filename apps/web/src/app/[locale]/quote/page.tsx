import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { getCatalog } from "@/copy/catalog";
import "./quote-page.css";

interface QuotePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.quoteHeading.eyebrow,
    description: copy.quoteHeading.description ?? copy.siteMeta.description,
  };
}

export default async function QuotePage({ params, searchParams }: QuotePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { service } = await searchParams;
  const copy = getCatalog(locale);

  return (
    <Section id="orcamento" sectionKey="quote" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="quote-page">
        <div className="quote-page__copy">
          <SectionHeading align="left" level={1} {...copy.quoteHeading} />
          <div className="quote-page__notes">
            <h2 className="quote-page__notes-title">{copy.quoteNotes.heading}</h2>
            <dl>
              {copy.quoteNotes.items.map((item) => (
                <div key={item.label} className="quote-page__note">
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <QuoteForm
          defaultServiceId={service}
          services={copy.services.map((item) => ({ id: item.id, label: item.label }))}
          copy={copy.quoteForm}
        />
      </Container>
    </Section>
  );
}
