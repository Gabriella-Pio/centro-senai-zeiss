"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SnapCarouselShell } from "@/components/ui/SnapCarouselShell";
import { useSnapCarousel } from "@/components/ui/useSnapCarousel";
import { publicAsset } from "@/lib/public-asset";
import { mediaPhotoSizes } from "@/lib/media-frame";
import { getIcon } from "@/lib/icons";
import { services } from "@/copy/services";
import { cn } from "@cem/ui";
import type { SectionCopy, SectorItem } from "@/copy/types";
import "./sector-grid.css";

const SERVICE_CHIP_LABELS: Record<string, string> = {
  "controle-qualidade-dimensional": "Dimensional",
  "digitalizacao-engenharia-reversa": "Digitalização",
  "inspecao-interna": "Raio-X / NDT",
  "prototipacao-3d": "Prototipação",
  "consultoria-qualidade": "Consultoria",
};

interface SectorGridProps {
  heading: SectionCopy;
  items: SectorItem[];
}

export function SectorGrid({ heading, items }: SectorGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { active: carouselActive, goPrev, goNext } = useSnapCarousel(scrollRef, items.length);

  return (
    <Section sectionKey="sectors" surface="cream" pattern="dots">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />
      </Container>

      <div className="relative mx-auto mt-4 w-full max-w-[min(100%,calc(var(--max-width-content)+var(--section-bleed-lg)*2))] px-4 sm:px-6 lg:mt-(--section-stack) lg:px-8">
        <SnapCarouselShell
          count={items.length}
          active={carouselActive}
          onPrev={goPrev}
          onNext={goNext}
          className="lg:hidden"
        >
          <div
            ref={scrollRef}
            className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]"
            aria-label="Setores — carrossel horizontal"
          >
            {items.map((item) => (
              <div key={item.id} className="w-[min(88vw,22rem)] shrink-0 snap-start pr-4 last:pr-0">
                <SectorTile item={item} />
              </div>
            ))}
          </div>
        </SnapCarouselShell>

        <div className="hidden gap-5 lg:grid lg:grid-cols-2">
          {items.map((item) => (
            <SectorTile key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function SectorTile({ item }: { item: SectorItem }) {
  const Icon = getIcon(item.icon);
  const hasPhoto = Boolean(item.image);
  const isContain = item.imageFit === "contain";
  const relatedLinks = item.relatedServices
    .map((serviceId) => {
      const service = services.find((entry) => entry.id === serviceId);
      if (!service) return null;
      return {
        id: serviceId,
        href: `/services/${serviceId}`,
        label: SERVICE_CHIP_LABELS[serviceId] ?? service.label,
      };
    })
    .filter((link): link is { id: string; href: string; label: string } => link !== null);

  return (
    <article
      className={cn(
        "group relative aspect-4/3 w-full overflow-hidden rounded-(--radius) border border-border text-left text-card",
        isContain ? "bg-foreground" : "bg-muted",
      )}
    >
      {hasPhoto ? (
        <Image
          src={publicAsset(item.image!)}
          alt={item.imageAlt ?? item.title}
          fill
          className={cn(
            "transition-transform duration-500 motion-reduce:transition-none",
            isContain ? "object-contain p-6" : "object-cover group-hover:scale-[1.02] motion-reduce:group-hover:scale-100",
          )}
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
          sizes={mediaPhotoSizes.card}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center opacity-35">
          {Icon ? <Icon size={72} strokeWidth={1.25} /> : null}
        </span>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/92 via-foreground/55 to-transparent"
        style={{ height: hasPhoto ? "62%" : "50%" }}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="sector-grid__tile-title font-heading font-semibold tracking-tight text-primary-foreground">
            {item.title}
          </h3>
          <p className="sector-grid__tile-description line-clamp-2 text-primary-foreground/85">
            {item.description}
          </p>
        </div>

        {relatedLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="sector-grid__chip rounded-(--radius) border border-primary-foreground/25 bg-primary-foreground/10 px-2.5 py-1 font-medium text-primary-foreground transition-colors hover:border-primary-foreground/45 hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
