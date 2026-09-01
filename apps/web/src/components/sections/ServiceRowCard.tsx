import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@cem/ui";
import { mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import type { LinkCardItem } from "@/copy/types";

interface ServiceRowCardProps {
  item: LinkCardItem;
  index: number;
}

export function ServiceRowCard({ item, index }: ServiceRowCardProps) {
  const hasPhoto = Boolean(item.image);
  const photoAlt = item.imageAlt ?? item.title;
  const imageFit = item.imageFit ?? "cover";
  const isProductCutout = imageFit === "contain";
  const n = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={item.href}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border/50 py-5 outline-none transition-colors last:border-b-0 hover:border-primary/25 sm:grid-cols-[3rem_6.5rem_1fr_auto] sm:gap-6 sm:py-6 focus-visible:ring-1 focus-visible:ring-ring"
    >
      <span className="font-mono text-xs tracking-widest tabular-nums text-primary/80">{n}</span>

      {hasPhoto ? (
        <div
          className={cn(
            "relative aspect-square w-16 shrink-0 overflow-hidden rounded-(--radius) border border-border sm:w-[6.5rem]",
            isProductCutout ? "bg-foreground" : "bg-muted"
          )}
        >
          <Image
            src={item.image!}
            alt={photoAlt}
            fill
            className={isProductCutout ? "object-contain p-2" : mediaPhotoCoverClass}
            style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
            sizes={mediaPhotoSizes.card}
          />
        </div>
      ) : (
        <span className="hidden sm:block sm:w-[6.5rem]" />
      )}

      <div className="min-w-0 flex flex-col gap-1.5">
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          {item.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>

      <ArrowUpRight
        size={18}
        strokeWidth={1.75}
        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
      />
    </Link>
  );
}
