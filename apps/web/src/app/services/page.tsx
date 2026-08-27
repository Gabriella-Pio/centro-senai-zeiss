import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ActionCardGrid } from "@/components/sections/ActionCardGrid";
import { services, servicesCatalog, servicesHeading } from "@/copy";

export default function ServicesPage() {
  return (
    <Section variant="default" className="!pt-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading {...servicesHeading} />
        <ActionCardGrid
          items={services.map((service) => ({
            title: service.label,
            description: service.shortDescription,
            secondaryCta: {
              label: servicesCatalog.detailsLabel,
              href: `/services/${service.id}`,
            },
            primaryCta: {
              label: servicesCatalog.quoteLabel,
              href: `/quote?service=${service.id}`,
            },
          }))}
        />
      </Container>
    </Section>
  );
}
