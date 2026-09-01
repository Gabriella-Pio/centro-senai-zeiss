import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { quoteForm, quoteHeading, services } from "@/copy";

interface QuotePageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const { service } = await searchParams;

  return (
    <Section variant="default" clearNav>
      <Container className="flex max-w-2xl flex-col gap-(--section-stack-lg)">
        <SectionHeading {...quoteHeading} />
        <QuoteForm
          defaultServiceId={service}
          services={services.map((item) => ({ id: item.id, label: item.label }))}
          copy={quoteForm}
        />
      </Container>
    </Section>
  );
}
