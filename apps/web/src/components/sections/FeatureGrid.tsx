import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardGrid } from "@/components/sections/CardGrid";
import type { FeatureItem, SectionCopy } from "@/copy/types";

interface FeatureGridProps {
  heading: SectionCopy;
  items: FeatureItem[];
  variant?: "default" | "muted" | "surface";
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({
  heading,
  items,
  variant = "default",
  columns = 4,
  className,
}: FeatureGridProps) {
  return (
    <Section variant={variant} className={className}>
      <Container className="flex flex-col gap-16">
        <SectionHeading {...heading} />
        <CardGrid items={items} columns={columns} />
      </Container>
    </Section>
  );
}
