import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import type { StatItem } from "@/copy/types";

interface StatRowProps {
  items: StatItem[];
  variant?: "default" | "muted" | "surface";
}

export function StatRow({ items, variant = "default" }: StatRowProps) {
  return (
    <Section variant={variant} className="py-(--section-py)! md:py-(--section-py-lg)!">
      <Container>
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {items.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 border-t border-border pt-6">
              <dt className="font-heading text-3xl font-bold tracking-tight text-foreground">{stat.value}</dt>
              <dd className="text-caption leading-snug text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
