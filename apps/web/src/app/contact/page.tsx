import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { contactCards, contactHeading, mapPlaceholder } from "@/copy";

export default function ContactPage() {
  return (
    <Section variant="default" className="!pt-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading {...contactHeading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <InfoCardGrid items={contactCards} />

          {/* TODO: incorporar mapa real (ex: Google Maps embed) quando a
              chave de API/endereço definitivo estiverem disponíveis. */}
          <div className="flex min-h-[280px] w-full items-center justify-center rounded-[var(--radius)] border border-border bg-card text-sm text-muted-foreground">
            {mapPlaceholder}
          </div>
        </div>
      </Container>
    </Section>
  );
}
