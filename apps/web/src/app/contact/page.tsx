import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { contactCards, contactHeading } from "@/copy";

export default function ContactPage() {
  return (
    <Section variant="default" clearNav>
      <Container className="flex flex-col gap-(--section-stack-lg)">
        <SectionHeading {...contactHeading} />

        <div className="grid grid-cols-1 gap-(--section-stack) lg:grid-cols-2">
          <InfoCardGrid items={contactCards} />
          <MapEmbed />
        </div>
      </Container>
    </Section>
  );
}
