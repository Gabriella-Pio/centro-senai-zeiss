import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { getIcon } from "@/lib/icons";
import type { LinkCardItem, SectionCopy } from "@/copy/types";

interface LinkCardGridProps {
  heading: SectionCopy;
  items: LinkCardItem[];
  variant?: "default" | "muted" | "surface";
  columns?: 2 | 3 | 4;
}

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function LinkCardGrid({
  heading,
  items,
  variant = "default",
  columns = 2,
}: LinkCardGridProps) {
  return (
    <Section variant={variant}>
      <Container className="flex flex-col gap-(--section-stack-lg)">
        <SectionHeading {...heading} />

        <div className={`grid grid-cols-1 gap-6 ${columnClass[columns]}`}>
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-(--radius) outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Card className={vitrineCardClass("h-full")}>
                  <CardHeader className="gap-3">
                    {Icon && (
                      <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                    )}
                    <CardTitle className="type-card-title font-heading font-semibold group-hover:text-foreground">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="type-caption text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
