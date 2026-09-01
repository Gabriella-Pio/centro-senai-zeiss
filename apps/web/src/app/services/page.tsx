import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ActionCardGrid } from "@/components/sections/ActionCardGrid";
import { services, servicesCatalog, servicesHeading } from "@/copy";

export default function ServicesPage() {
  return (
    <Section variant="default" clearNav>
      <Container className="flex flex-col gap-(--section-stack-lg)">
        <SectionHeading {...servicesHeading} />
        <ActionCardGrid
          items={services.map((service) => ({
            title: service.label,
            description: service.shortDescription,
            image: service.cardImage,
            imageAlt: service.cardImageAlt,
            imageFit: service.cardImageFit,
            imagePosition: service.cardImagePosition,
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
