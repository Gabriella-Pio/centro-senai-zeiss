import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIcon } from "@/lib/icons";
import type { FeatureItem, SectionCopy } from "@/copy/types";
import "./purpose-section.css";

interface PurposeSectionProps {
  heading: SectionCopy;
  items: FeatureItem[];
}

export function PurposeSection({ heading, items }: PurposeSectionProps) {
  return (
    <Section sectionKey="purpose" surface="dark" pattern="blueprint">
      <Container className="purpose">
        <SectionHeading align="left" {...heading} />

        <ol className="purpose-stations">
          {items.map((item, index) => (
            <PurposeStation key={item.title} item={item} index={index} />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function PurposeStation({ item, index }: { item: FeatureItem; index: number }) {
  const Icon = getIcon(item.icon);

  return (
    <li className="purpose-station">
      {Icon ? <Icon className="purpose-station__filigree" strokeWidth={1.15} aria-hidden /> : null}

      <p className="purpose-station__index" aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </p>
      <p className="purpose-station__label">{item.title}</p>
      {item.value ? <h3 className="purpose-station__title">{item.value}</h3> : null}
      <p className="purpose-station__body">{item.description}</p>
    </li>
  );
}
