import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceChips, chipForServiceId } from "@/components/ui/ServiceChips";
import type { CopyCatalog } from "@/copy/catalog";
import type { SectionCopy, SectorItem, ServiceContent } from "@/copy/types";
import "./sector-grid.css";

interface SectorGridProps {
  heading: SectionCopy;
  items: SectorItem[];
  sectorsCard: CopyCatalog["sectorsCard"];
  services: ServiceContent[];
}

export function SectorGrid({ heading, items, sectorsCard, services }: SectorGridProps) {
  return (
    <Section sectionKey="sectors" surface="cream" pattern="none">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />

        <div className="sector-grid">
          <div className="sector-grid__head" aria-hidden="true">
            <span>{sectorsCard.colSector}</span>
            <span>{sectorsCard.colApplication}</span>
            <span>{sectorsCard.colServices}</span>
          </div>
          <ul className="sector-grid__list">
            {items.map((item) => (
              <SectorRow key={item.id} item={item} sectorsCard={sectorsCard} services={services} />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

function SectorRow({
  item,
  sectorsCard,
  services,
}: {
  item: SectorItem;
  sectorsCard: CopyCatalog["sectorsCard"];
  services: ServiceContent[];
}) {
  const relatedLinks = item.relatedServices
    .map((serviceId) => chipForServiceId(serviceId, services))
    .filter((link): link is NonNullable<typeof link> => link !== null)
    .map((link) => ({
      ...link,
      label: sectorsCard.shortLabels[link.id as keyof typeof sectorsCard.shortLabels] ?? link.label,
    }));

  return (
    <li className="sector-grid__item">
      <h3 className="sector-grid__title">{item.title}</h3>
      <p className="sector-grid__description">{item.description}</p>
      <ServiceChips
        label={sectorsCard.servicesLabel}
        ariaLabel={`${sectorsCard.servicesLabel} ${item.title}`}
        links={relatedLinks}
      />
    </li>
  );
}
