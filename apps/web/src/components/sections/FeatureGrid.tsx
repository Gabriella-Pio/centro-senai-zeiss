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
  clearNav?: boolean;
}

export function FeatureGrid({
  heading,
  items,
  variant = "default",
  columns = 4,
  className,
  clearNav = false,
}: FeatureGridProps) {
  return (
    <Section variant={variant} className={className} clearNav={clearNav}>
      <Container className="flex flex-col gap-(--section-stack-lg)">
        <SectionHeading {...heading} />
        <CardGrid items={items} columns={columns} />
      </Container>
    </Section>
  );
}
