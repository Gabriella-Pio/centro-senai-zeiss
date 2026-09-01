"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SnapCarouselShell } from "@/components/ui/SnapCarouselShell";
import { useSnapCarousel } from "@/components/ui/useSnapCarousel";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import { getIcon } from "@/lib/icons";
import type { FeatureItem, SectionCopy } from "@/copy/types";
import "./cover-grid.css";

interface CoverGridProps {
  heading: SectionCopy;
  items: FeatureItem[];
}

export function CoverGrid({ heading, items }: CoverGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { active: carouselActive, goPrev, goNext } = useSnapCarousel(scrollRef, items.length);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = items[active];
  const count = items.length;

  function openAt(index: number) {
    setActive(index);
    setOpen(true);
  }

  function step(delta: number) {
    setActive((index) => (index + delta + count) % count);
  }

  return (
    <Section zone="proof">
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
            aria-label="Diferenciais — carrossel horizontal"
          >
            {items.map((item, index) => (
              <div key={item.title} className="w-full shrink-0 snap-start">
                <CoverTile item={item} onOpen={() => openAt(index)} />
              </div>
            ))}
          </div>
        </SnapCarouselShell>

        <div className="hidden gap-5 lg:grid lg:grid-cols-3 xl:grid-cols-5">
          {items.map((item, index) => (
            <CoverTile key={item.title} item={item} onOpen={() => openAt(index)} />
          ))}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="bg-background p-0 shadow-none sm:max-w-xl"
          style={{ width: "min(36rem, 90vw)", maxWidth: "36rem" }}
        >
          {current ? (
            <DrawerBody
              item={current}
              index={active}
              count={count}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
              onClose={() => setOpen(false)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </Section>
  );
}

function CoverTile({
  item,
  onOpen,
}: {
  item: FeatureItem;
  onOpen: () => void;
}) {
  const Icon = getIcon(item.icon);
  const hasPhoto = Boolean(item.image);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative aspect-4/5 w-full overflow-hidden rounded-(--radius) border border-border bg-foreground text-left text-card outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {hasPhoto ? (
        <Image
          src={item.image!}
          alt=""
          fill
          className="object-cover object-[72%_28%] transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={mediaPhotoSizes.card}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center opacity-35">
          {Icon ? <Icon size={72} strokeWidth={1.25} /> : null}
        </span>
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/90 to-transparent"
        style={{ height: hasPhoto ? "48%" : "42%" }}
      />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
        <span className="cover-grid__tile-title font-heading font-semibold tracking-tight">{item.title}</span>
        <ArrowUpRight size={18} strokeWidth={1.75} className="shrink-0" />
      </span>
    </button>
  );
}

function DrawerBody({
  item,
  index,
  count,
  onPrev,
  onNext,
  onClose,
}: {
  item: FeatureItem;
  index: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const Icon = getIcon(item.icon);
  const n = String(index + 1).padStart(2, "0");
  const photoAlt = item.imageAlt ?? item.title;

  return (
    <div className="flex h-full flex-col">
      <div className={mediaFrameClass("relative mx-8 mt-8 aspect-4/3")}>
        {item.image ? (
          <Image
            src={item.image}
            alt={photoAlt}
            fill
            className={mediaPhotoCoverClass}
            style={{ objectPosition: "72% 28%" }}
            sizes={mediaPhotoSizes.drawer}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            {Icon ? <Icon size={64} strokeWidth={1.25} className="text-primary" /> : null}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-6 px-8 pt-10">
        <p className="cover-grid__drawer-index font-medium uppercase text-muted-foreground">({n})</p>
        <SheetTitle className="cover-grid__drawer-title font-heading font-bold text-foreground">
          {item.title}
        </SheetTitle>
        <SheetDescription className="cover-grid__drawer-description text-muted-foreground">
          {item.description}
        </SheetDescription>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-border px-8 pt-6 pb-10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Anterior"
              onClick={onPrev}
              className="size-11"
            >
              <ArrowLeft size={20} strokeWidth={1.75} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Próximo"
              onClick={onNext}
              className="size-11"
            >
              <ArrowRight size={20} strokeWidth={1.75} />
            </Button>
          </div>
          <p className="cover-grid__drawer-counter tabular-nums text-muted-foreground">
            {n} / {String(count).padStart(2, "0")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Fechar"
          onClick={onClose}
          className="size-11"
        >
          <X size={18} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
