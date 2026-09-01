import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { cardPhotoAspectClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import type { LinkCardItem } from "@/copy/types";

interface ServiceLinkCardProps {
  item: LinkCardItem;
  featured?: boolean;
}

export function ServiceLinkCard({ item, featured = false }: ServiceLinkCardProps) {
  const hasPhoto = Boolean(item.image);
  const photoAlt = item.imageAlt ?? item.title;
  const imageFit = item.imageFit ?? "cover";
  const isProductCutout = imageFit === "contain";

  return (
    <Link
      href={item.href}
      className="group block rounded-(--radius) outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <article
        className={vitrineCardClass(
          cn(
            "flex h-full flex-col overflow-hidden p-0 transition-colors",
            "hover:border-foreground/15"
          )
        )}
      >
        {hasPhoto ? (
          <div
            className={cn(
              "relative w-full shrink-0 overflow-hidden",
              featured ? "aspect-4/3 lg:aspect-auto lg:min-h-[22rem]" : cardPhotoAspectClass,
              isProductCutout ? "bg-foreground" : "bg-muted"
            )}
          >
            <Image
              src={item.image!}
              alt={photoAlt}
              fill
              className={cn(
                "transition-transform duration-500 group-hover:scale-[1.03]",
                isProductCutout ? "object-contain p-4" : mediaPhotoCoverClass
              )}
              style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
              sizes={mediaPhotoSizes.card}
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "font-heading font-semibold leading-snug tracking-tight",
                featured ? "text-lg sm:text-xl" : "text-base"
              )}
            >
              {item.title}
            </h3>
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
            />
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </article>
    </Link>
  );
}
