"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import type { SectionAmbient, SectionPattern, SectionSurface } from "@/lib/section-surfaces";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { peekSlides, usePeekCarousel } from "@/components/ui/usePeekCarousel";
import { publicAsset } from "@/lib/public-asset";
import { ServiceChips, chipForServiceHref } from "@/components/ui/ServiceChips";
import { equipmentCard } from "@/copy/equipment";
import type { CtaCopy, FeatureItem, SectionCopy } from "@/copy/types";
import "./equipment-carousel.css";

interface EquipmentCarouselProps {
  heading: SectionCopy;
  items: FeatureItem[];
  catalogCta?: CtaCopy;
  surface?: SectionSurface;
  pattern?: SectionPattern;
  ambient?: SectionAmbient;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function EquipmentCarousel({
  heading,
  items,
  catalogCta,
  surface = "white",
  pattern = "none",
  ambient = "spotlight",
}: EquipmentCarouselProps) {
  const count = items.length;
  const reduce = usePrefersReducedMotion();
  const {
    stageRef,
    viewportRef,
    trackRef,
    setPaused,
    playing,
    intervalMs,
    centerIndex,
    go,
    goTo,
    slideState,
  } = usePeekCarousel({ count, reduceMotion: reduce });
  const slides = useMemo(() => peekSlides(items, (item) => item.title), [items]);

  return (
    <Section sectionKey="equipment" surface={surface} pattern={pattern} ambient={ambient}>
      <Container>
        <div className="equip-head">
          <SectionHeading align="left" className="min-w-0 flex-1" {...heading} />
          {catalogCta ? (
            <Link
              href={catalogCta.href}
              className="equip-header-cta group inline-flex shrink-0 items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {catalogCta.label}
              <ArrowUpRight
                size={20}
                strokeWidth={1.75}
                className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
              />
            </Link>
          ) : null}
        </div>
      </Container>

      <div
        ref={stageRef}
        className="equip-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
      >
          <div className="equip-frame">
            {count > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Equipamento anterior"
                onClick={() => go(-1)}
                className="equip-arrow equip-arrow--prev"
              >
                <ChevronLeft size={20} strokeWidth={1.75} />
              </Button>
            ) : null}

            <div ref={viewportRef} className="equip-viewport">
            <div ref={trackRef} className="equip-track">
              {slides.map(({ item, index, copy, key }) => {
                const { isPeek, isFocus, isCenter, decorative } = slideState(copy, index);
                const service = chipForServiceHref(item.href);

                return (
                  <article
                    key={key}
                    className={cn(
                      "equip-card",
                      isPeek && "is-peek",
                      isFocus && "is-focus",
                      isCenter && "is-center",
                    )}
                    aria-hidden={copy !== 1}
                  >
                    <EquipCardMedia
                      item={item}
                      decorative={decorative}
                      service={service}
                      interactive={isFocus}
                    />
                  </article>
                );
              })}
            </div>
            </div>

            {count > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Próximo equipamento"
                onClick={() => go(1)}
                className="equip-arrow equip-arrow--next"
              >
                <ChevronRight size={20} strokeWidth={1.75} />
              </Button>
            ) : null}
          </div>

          <div
            className="equip-dots"
            style={{ "--equip-dot-beat": `${intervalMs}ms` } as CSSProperties}
          >
            {items.map((item, index) => {
              const isActive = index === centerIndex;
              const isPlaying = isActive && playing;
              return (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Ir para ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn("equip-dot", isActive && "is-active", isPlaying && "is-playing")}
                  onClick={() => goTo(index)}
                >
                  {isPlaying ? (
                    <span key={centerIndex} className="equip-dot-progress" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
      </div>
    </Section>
  );
}

function EquipCardMedia({
  item,
  decorative,
  service,
  interactive,
}: {
  item: FeatureItem;
  decorative: boolean;
  service: ReturnType<typeof chipForServiceHref>;
  interactive: boolean;
}) {
  return (
    <>
      <div className="equip-card-img">
        {item.image ? (
          <Image
            src={publicAsset(item.image)}
            alt={decorative ? "" : (item.imageAlt ?? item.title)}
            width={640}
            height={480}
          />
        ) : null}
      </div>
      <div className="equip-card-body">
        <div className="equip-name">{item.title}</div>
        {item.tag ? <div className="equip-spec">{item.tag}</div> : null}
        {service ? (
          <ServiceChips
            label={equipmentCard.usedIn}
            ariaLabel={`${equipmentCard.usedIn} ${service.label}`}
            links={[service]}
            interactive={interactive}
          />
        ) : null}
      </div>
    </>
  );
}
