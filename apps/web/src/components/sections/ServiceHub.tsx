"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { SectionAtmosphere } from "@/components/ui/SectionAtmosphere";
import { SectionBandCta } from "@/components/ui/SectionBandCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceLinkCard } from "@/components/sections/ServiceLinkCard";
import { ServiceRowCard } from "@/components/sections/ServiceRowCard";
import { mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import type { CtaCopy, LinkCardItem, SectionCopy } from "@/copy/types";

export type ServiceHubLayout = "index" | "switcher" | "bento" | "magazine" | "cards-bleed";

interface ServiceHubProps {
  heading: SectionCopy;
  items: LinkCardItem[];
  allServicesCta: CtaCopy;
  layout?: ServiceHubLayout;
}

function ServicesCatalogCta({ cta, count }: { cta: CtaCopy; count: number }) {
  return (
    <SectionBandCta
      eyebrow="Catálogo"
      title={cta.label}
      description={`${count} linhas de atendimento · catálogo completo com aplicações e equipamentos`}
      href={cta.href}
    />
  );
}

function ServiceCardsGrid({ items, className }: { items: LinkCardItem[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <ServiceLinkCard key={item.href} item={item} />
      ))}
    </div>
  );
}

function ServiceSwitcher({ items }: { items: LinkCardItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];
  const imageFit = current.imageFit ?? "cover";
  const isProductCutout = imageFit === "contain";

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2">
      <div
        className={cn(
          "relative aspect-4/3 overflow-hidden rounded-(--radius) border border-border shadow-[0_24px_48px_-32px_rgb(0_87_184/0.22)] lg:aspect-square",
          isProductCutout ? "bg-foreground" : "bg-muted",
        )}
      >
        {current.image ? (
          <Image
            src={current.image}
            alt={current.imageAlt ?? current.title}
            fill
            className={isProductCutout ? "object-contain p-6" : mediaPhotoCoverClass}
            style={current.imagePosition ? { objectPosition: current.imagePosition } : undefined}
            sizes={mediaPhotoSizes.split}
          />
        ) : null}
      </div>

      <ul className="flex flex-col">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.href} className={cn("border-b", isActive ? "border-primary/35" : "border-border/50")}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(index)}
                className="flex w-full items-start justify-between gap-4 py-5 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="font-mono text-xs tracking-widest text-primary/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block font-heading text-lg font-semibold tracking-tight sm:text-xl",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  className={cn("mt-2 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
        <p className="text-sm leading-relaxed text-muted-foreground">{current.description}</p>
        <Link
          href={current.href}
          className="relative inline-flex w-fit pb-0.5 text-sm font-semibold text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary after:transition-transform after:duration-500 hover:after:scale-x-0"
        >
          Ver detalhes do serviço
        </Link>
      </div>
    </div>
  );
}

function ServiceBento({ items }: { items: LinkCardItem[] }) {
  const [featured, ...rest] = items;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
      {featured ? (
        <div className="sm:col-span-2 lg:row-span-2">
          <ServiceLinkCard item={featured} featured />
        </div>
      ) : null}
      {rest.map((item) => (
        <ServiceLinkCard key={item.href} item={item} />
      ))}
    </div>
  );
}

function ServiceMagazine({ items }: { items: LinkCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
      {items.map((item, index) => (
        <ServiceRowCard key={item.href} item={item} index={index} />
      ))}
    </div>
  );
}

export function ServiceHub({ heading, items, allServicesCta, layout = "index" }: ServiceHubProps) {
  const listShell = (
    <div className="relative z-10 overflow-hidden rounded-(--radius) border border-border/60 bg-card/55 shadow-[0_1px_0_rgb(28_25_23/0.04),0_28px_56px_-36px_rgb(0_87_184/0.22)] backdrop-blur-sm">
      {items.map((item, index) => (
        <ServiceRowCard key={item.href} item={item} index={index} />
      ))}
    </div>
  );

  const catalogCta = <ServicesCatalogCta cta={allServicesCta} count={items.length} />;

  if (layout === "switcher") {
    return (
      <Section zone="services">
        <SectionAtmosphere tone="grid" />
        <Container className="relative flex flex-col gap-(--section-stack)">
          <SectionHeading align="left" className="relative z-10 max-w-3xl" {...heading} />
          <div className="relative z-10">
            <ServiceSwitcher items={items} />
          </div>
          {catalogCta}
        </Container>
      </Section>
    );
  }

  if (layout === "bento") {
    return (
      <Section zone="services">
        <Container className="flex flex-col gap-(--section-stack)">
          <SectionHeading align="left" className="max-w-3xl" {...heading} />
          <ServiceBento items={items} />
          {catalogCta}
        </Container>
      </Section>
    );
  }

  if (layout === "magazine") {
    return (
      <Section zone="services">
        <Container className="flex flex-col gap-(--section-stack)">
          <SectionHeading align="left" className="max-w-3xl" {...heading} />
          <div className="rounded-(--radius) border border-border/60 bg-card/55 px-4 backdrop-blur-sm sm:px-6">
            <ServiceMagazine items={items} />
          </div>
          {catalogCta}
        </Container>
      </Section>
    );
  }

  if (layout === "cards-bleed") {
    return (
      <Section zone="services">
        <Container className="flex flex-col gap-(--section-stack)">
          <SectionHeading align="left" className="max-w-3xl" {...heading} />
        </Container>
        <div className="mx-auto w-full max-w-[min(100%,calc(var(--max-width-content)+var(--section-bleed-lg)*2))] px-4 sm:px-6 lg:px-8">
          <ServiceCardsGrid items={items} />
        </div>
        <Container className="mt-6 flex flex-col gap-(--section-stack)">{catalogCta}</Container>
      </Section>
    );
  }

  return (
    <Section zone="services">
      <SectionAtmosphere tone="grid" />
      <Container className="relative flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" className="relative z-10 max-w-3xl" {...heading} />
        {listShell}
        {catalogCta}
      </Container>
    </Section>
  );
}
