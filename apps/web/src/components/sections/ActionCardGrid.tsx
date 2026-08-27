import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import type { ActionCardItem } from "@/copy/types";

interface ActionCardGridProps {
  items: ActionCardItem[];
  columns?: 2 | 3;
}

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

export function ActionCardGrid({ items, columns = 2 }: ActionCardGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${columnClass[columns]}`}>
      {items.map((item) => (
        <Card key={item.title} className={vitrineCardClass()}>
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </CardContent>
          <CardFooter className="gap-3 border-t border-border pt-4">
            <Button variant="outline" size="sm" render={<Link href={item.secondaryCta.href} />}>
              {item.secondaryCta.label}
            </Button>
            <Button size="sm" render={<Link href={item.primaryCta.href} />}>
              {item.primaryCta.label}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
