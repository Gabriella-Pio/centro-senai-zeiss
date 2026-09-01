import { Card, CardContent, CardHeader, CardTitle } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { getIcon } from "@/lib/icons";
import type { InfoCardItem } from "@/copy/types";

interface InfoCardGridProps {
  items: InfoCardItem[];
  columns?: 2 | 3 | 4;
}

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function InfoCardGrid({ items, columns = 2 }: InfoCardGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${columnClass[columns]}`}>
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <Card key={item.title} className={vitrineCardClass()}>
            <CardHeader className="gap-3">
              {Icon && (
                <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
              )}
              <CardTitle className="type-card-title font-heading font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="type-caption whitespace-pre-line text-muted-foreground">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
