import { Card, CardContent, CardHeader, CardTitle } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { getIcon } from "@/lib/icons";
import type { FeatureItem } from "@/copy/types";

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

interface CardGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function CardGrid({ items, columns = 4 }: CardGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${columnClass[columns]}`}>
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <Card key={item.title} className={vitrineCardClass()}>
            <CardHeader className="gap-3">
              {Icon && (
                <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
              )}
              <CardTitle className="font-heading text-card-title font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="type-caption text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
