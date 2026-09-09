import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIcon } from "@/lib/icons";
import type { FeatureItem, SectionCopy } from "@/copy/types";
import "./diff-grid.css";

interface DiffGridProps {
  heading: SectionCopy;
  items: FeatureItem[];
}

export function DiffGrid({ heading, items }: DiffGridProps) {
  return (
    <Section sectionKey="differentials" surface="dark" pattern="blueprint">
      <Container>
        <SectionHeading align="left" {...heading} />
        <div className="diff-grid">
          {items.map((item) => (
            <DiffCard key={item.title} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function DiffCard({ item }: { item: FeatureItem }) {
  const Icon = getIcon(item.icon);

  return (
    <article className="diff-item">
      {Icon ? (
        <Icon className="diff-icon-bg" strokeWidth={1.15} aria-hidden />
      ) : null}
      {item.value ? <p className="diff-val">{item.value}</p> : null}
      <h3 className="diff-label">{item.title}</h3>
      <p className="diff-desc">{item.description}</p>
    </article>
  );
}
