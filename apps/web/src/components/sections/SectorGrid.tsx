import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceChips, chipForServiceId } from "@/components/ui/ServiceChips";
import { getIcon } from "@/lib/icons";
import { sectorsCard } from "@/copy/home";
import type { SectionCopy, SectorItem } from "@/copy/types";
import "./sector-grid.css";

interface SectorGridProps {
  heading: SectionCopy;
  items: SectorItem[];
}

export function SectorGrid({ heading, items }: SectorGridProps) {
  return (
    <Section sectionKey="sectors" surface="cream" pattern="none">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />

        <div className="sector-grid__list">
          {items.map((item) => (
            <SectorTile key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function SectorTile({ item }: { item: SectorItem }) {
  const Icon = getIcon(item.icon);
  const relatedLinks = item.relatedServices
    .map((serviceId) => chipForServiceId(serviceId))
    .filter((link): link is NonNullable<typeof link> => link !== null);

  return (
    <article className="sector-grid__item">
      <div className="sector-grid__body">
        <div className="sector-grid__head">
          <h3 className="sector-grid__title">{item.title}</h3>
          {Icon ? <Icon className="sector-grid__icon" strokeWidth={1.15} aria-hidden /> : null}
        </div>
        <p className="sector-grid__description">{item.description}</p>
        <ServiceChips
          label={sectorsCard.servicesLabel}
          ariaLabel={`${sectorsCard.servicesLabel} para ${item.title}`}
          links={relatedLinks}
        />
      </div>
    </article>
  );
}
