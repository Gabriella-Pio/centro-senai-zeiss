import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceChips, chipForServiceId } from "@/components/ui/ServiceChips";
import { sectorsCard } from "@/copy/home";
import type { SectionCopy, SectorItem } from "@/copy/types";
import "./sector-grid.css";

const SECTOR_CHIP_LABELS: Record<string, string> = {
  "controle-qualidade-dimensional": "Dimensional",
  "digitalizacao-engenharia-reversa": "Digitalização",
  "inspecao-interna": "Inspeção NDT",
  "prototipacao-3d": "Prototipação",
  "consultoria-qualidade": "Consultoria",
};

interface SectorGridProps {
  heading: SectionCopy;
  items: SectorItem[];
}

export function SectorGrid({ heading, items }: SectorGridProps) {
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
              <SectorRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

function SectorRow({ item }: { item: SectorItem }) {
  const relatedLinks = item.relatedServices
    .map((serviceId) => chipForServiceId(serviceId))
    .filter((link): link is NonNullable<typeof link> => link !== null)
    .map((link) => ({
      ...link,
      label: SECTOR_CHIP_LABELS[link.id] ?? link.label,
    }));

  return (
    <li className="sector-grid__item">
      <h3 className="sector-grid__title">{item.title}</h3>
      <p className="sector-grid__description">{item.description}</p>
      <ServiceChips
        label={sectorsCard.servicesLabel}
        ariaLabel={`${sectorsCard.servicesLabel} para ${item.title}`}
        links={relatedLinks}
      />
    </li>
  );
}
