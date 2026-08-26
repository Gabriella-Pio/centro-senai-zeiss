import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/components/forms/QuoteForm";

interface QuotePageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const { service } = await searchParams;

  return (
    <Section variant="default" className="!pt-16">
      <Container className="max-w-2xl flex flex-col gap-16">
        <SectionHeading
          eyebrow="Orçamento"
          title="Solicite um orçamento"
          description="Preencha os dados abaixo e nossa equipe técnica retorna com uma proposta."
          align="left"
        />
        <QuoteForm defaultServiceId={service} />
      </Container>
    </Section>
  );
}
