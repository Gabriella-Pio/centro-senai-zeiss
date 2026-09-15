import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from "@cem/ui";
import { cn } from "@cem/ui";
import { publicAsset } from "@/lib/public-asset";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { cardPhotoAspectClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import type { ActionCardItem } from "@/copy/types";
import { Link } from "@/i18n/navigation";

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
      {items.map((item) => {
        const hasPhoto = Boolean(item.image);
        const imageFit = item.imageFit ?? "cover";
        const isProductCutout = imageFit === "contain";

        return (
          <Card
            key={item.title}
            className={vitrineCardClass(cn("flex h-full flex-col overflow-hidden p-0", hasPhoto && "gap-0"))}
          >
            {hasPhoto ? (
              <div
                className={cn(
                  "relative w-full shrink-0 overflow-hidden",
                  cardPhotoAspectClass,
                  isProductCutout ? "bg-foreground" : "bg-muted"
                )}
              >
                <Image
                  src={publicAsset(item.image!)}
                  alt={item.imageAlt ?? item.title}
                  fill
                  className={isProductCutout ? "object-contain p-4" : mediaPhotoCoverClass}
                  style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                  sizes={mediaPhotoSizes.card}
                />
              </div>
            ) : null}

            <CardHeader className="gap-2 p-3 pb-0">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="type-card-title font-heading font-semibold leading-snug tracking-tight">
                  {item.title}
                </CardTitle>
                <ArrowUpRight size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3 pt-2">
              <p className="type-caption text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter className="gap-3 border-t border-border p-3 pt-4">
              <Button variant="outline" size="sm" render={<Link href={item.secondaryCta.href} />}>
                {item.secondaryCta.label}
              </Button>
              <Button size="sm" render={<Link href={item.primaryCta.href} />}>
                {item.primaryCta.label}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
