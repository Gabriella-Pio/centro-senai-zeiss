"use client";

import { useMemo } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { peekSlides, usePeekCarousel } from "@/components/ui/usePeekCarousel";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import type { CtaCopy } from "@/copy/types";
import { Link } from "@/i18n/navigation";

export interface ServiceSiblingItem {
  id: string;
  label: string;
  href: string;
  current: boolean;
}

interface ServiceSiblingsCarouselProps {
  items: ServiceSiblingItem[];
  label: string;
  detailsLabel: string;
  currentLabel: string;
  catalogCta?: CtaCopy;
  reduceMotion: boolean;
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ServiceSiblingsCarousel({
  items,
  label,
  detailsLabel,
  currentLabel,
  catalogCta,
  reduceMotion,
}: ServiceSiblingsCarouselProps) {
  const count = items.length;
  const currentIndex = Math.max(0, items.findIndex((item) => item.current));
  const {
    stageRef,
    viewportRef,
    trackRef,
    setPaused,
    centerIndex,
    go,
    goTo,
    slideState,
    focusCount,
  } = usePeekCarousel({
    count,
    reduceMotion,
    autoplay: false,
    initialIndex: currentIndex,
    centerInitial: true,
  });
  const slides = useMemo(() => peekSlides(items, (item) => item.id), [items]);

  return (
    <nav className="service-detail__siblings" aria-labelledby="service-siblings">
      <div className="service-detail__siblings-head">
        <h2 id="service-siblings">{label}</h2>
        {catalogCta ? (
          <SectionTextCta className="service-detail__siblings-catalog !self-baseline" href={catalogCta.href}>
            {catalogCta.label}
          </SectionTextCta>
        ) : null}
      </div>

      <div
        ref={stageRef}
        className="service-detail__siblings-stage"
        data-focus={focusCount}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
      >
        <div className="service-detail__siblings-frame">
          {count > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Serviço anterior"
              onClick={() => go(-1)}
              className="service-detail__siblings-arrow service-detail__siblings-arrow--prev"
            >
              <ChevronLeft size={20} strokeWidth={1.75} />
            </Button>
          ) : null}

          <div ref={viewportRef} className="service-detail__siblings-viewport">
            <div ref={trackRef} className="service-detail__siblings-track">
              {slides.map(({ item, index, copy, key }) => {
                const { isPeek, isFocus, isCenter, decorative } = slideState(copy, index);
                return (
                  <article
                    key={key}
                    className={cn(
                      "service-detail__sibling-card",
                      isPeek && "is-peek",
                      isFocus && "is-focus",
                      isCenter && "is-center",
                      item.current && "is-current",
                    )}
                    aria-hidden={decorative}
                    aria-current={item.current && !decorative ? "page" : undefined}
                  >
                    <SiblingCard
                      item={item}
                      index={index}
                      decorative={decorative}
                      interactive={isFocus && !item.current}
                      detailsLabel={detailsLabel}
                      currentLabel={currentLabel}
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
              aria-label="Próximo serviço"
              onClick={() => go(1)}
              className="service-detail__siblings-arrow service-detail__siblings-arrow--next"
            >
              <ChevronRight size={20} strokeWidth={1.75} />
            </Button>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="service-detail__siblings-dots">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ir para ${item.label}`}
                aria-current={index === centerIndex ? "true" : undefined}
                className={cn(
                  "service-detail__siblings-dot",
                  index === centerIndex && "is-active",
                )}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  );
}

function SiblingCard({
  item,
  index,
  decorative,
  interactive,
  detailsLabel,
  currentLabel,
}: {
  item: ServiceSiblingItem;
  index: number;
  decorative: boolean;
  interactive: boolean;
  detailsLabel: string;
  currentLabel: string;
}) {
  const innerClass = "service-detail__sibling-card-inner";
  const body = (
    <>
      <span className="service-detail__sibling-num" aria-hidden>
        {padIndex(index)}
      </span>
      <p className="service-detail__sibling-card-title">{item.label}</p>
      {item.current ? (
        <span className="service-detail__sibling-card-status">{currentLabel}</span>
      ) : (
        <span className="service-detail__sibling-card-cta">
          {detailsLabel}
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
        </span>
      )}
    </>
  );

  if (!interactive) {
    return <div className={innerClass}>{body}</div>;
  }

  return (
    <Link href={item.href} className={innerClass} tabIndex={decorative ? -1 : undefined}>
      {body}
    </Link>
  );
}
