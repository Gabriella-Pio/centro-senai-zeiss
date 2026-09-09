"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import type { SectionAmbient, SectionPattern, SectionSurface } from "@/lib/section-surfaces";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publicAsset } from "@/lib/public-asset";
import { ServiceChips, chipForServiceHref } from "@/components/ui/ServiceChips";
import { equipmentCard } from "@/copy/equipment";
import type { CtaCopy, FeatureItem, SectionCopy } from "@/copy/types";
import "./equipment-carousel.css";

const PEEK_DESKTOP = 0.22;
const PEEK_MOBILE = 0.48;
const INTERVAL_MS = 4200;
const EASE = "transform .55s cubic-bezier(0.45, 0, 0.15, 1)";
const MOBILE_MQ = "(max-width: 768px)";
const TWO_CARD_MQ = "(max-width: 64rem)";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(count);
  const pausedRef = useRef(false);
  const metricsRef = useRef({ step: 0, cardW: 0, focusCount: 3, peek: PEEK_DESKTOP });
  const [pos, setPos] = useState(count);
  const [paused, setPaused] = useState(false);
  const [focusCount, setFocusCount] = useState(3);

  const slides = useMemo(
    () =>
      [0, 1, 2].flatMap((copy) =>
        items.map((item, index) => ({ item, index, copy, key: `${copy}-${item.title}` })),
      ),
    [items],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const mobile = window.matchMedia(MOBILE_MQ).matches;
    const twoCards = window.matchMedia(TWO_CARD_MQ).matches;
    const nextFocus = mobile ? 1 : twoCards ? 2 : 3;
    const peek = mobile ? PEEK_MOBILE : PEEK_DESKTOP;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
    const visible = nextFocus + 2;
    const width = (viewport.clientWidth - (visible - 1) * gap) / (nextFocus + 2 * peek);

    for (const card of track.children) {
      (card as HTMLElement).style.flex = `0 0 ${width}px`;
    }

    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : width + gap;
    const cardW = first ? first.getBoundingClientRect().width : width;
    metricsRef.current = { step, cardW, focusCount: nextFocus, peek };
    setFocusCount(nextFocus);
  }, []);

  const apply = useCallback(
    (nextPos: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      const { step, cardW, peek } = metricsRef.current;
      const peekHide = (1 - peek) * cardW;
      track.style.transition = animate && !reduce ? EASE : "none";
      track.style.transform = `translate3d(${-((nextPos - 1) * step + peekHide)}px,0,0)`;
    },
    [reduce],
  );

  const snap = useCallback(
    (to: number) => {
      posRef.current = to;
      setPos(to);
      apply(to, false);
      void trackRef.current?.offsetWidth;
    },
    [apply],
  );

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      measure();
      let next = posRef.current;
      if (delta > 0 && next >= 2 * count) snap(next - count);
      if (delta < 0 && next <= 1) snap(next + count);
      next = posRef.current + delta;
      posRef.current = next;
      setPos(next);
      apply(next, !reduce);
    },
    [apply, count, measure, reduce, snap],
  );

  const goTo = useCallback(
    (target: number) => {
      if (count < 2) return;
      measure();
      const n = metricsRef.current.focusCount;
      const offset = n % 2 === 0 ? 0 : Math.floor((n - 1) / 2);
      let next = posRef.current;
      if (next >= 2 * count) snap(next - count);
      if (next < count) snap(next + count);
      next = count + target - offset;
      posRef.current = next;
      setPos(next);
      apply(next, !reduce);
    },
    [apply, count, measure, reduce, snap],
  );

  const goRef = useRef(go);
  goRef.current = go;

  useLayoutEffect(() => {
    measure();
    apply(posRef.current, false);
  }, [apply, count, measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      const current = posRef.current;
      if (current >= 2 * count) snap(current - count);
      if (current < 1) snap(current + count);
    };

    track.addEventListener("transitionend", onEnd);
    return () => track.removeEventListener("transitionend", onEnd);
  }, [count, snap]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onResize = () => {
      measure();
      apply(posRef.current, false);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(viewport);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [apply, measure]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const id = window.setTimeout(() => {
      if (!pausedRef.current) goRef.current(1);
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [count, paused, pos, reduce]);

  const leftPeek = pos - 1;
  const centerOffset = focusCount % 2 === 0 ? 0 : Math.floor((focusCount - 1) / 2);
  const centerRel = focusCount % 2 === 0 ? -1 : 1 + centerOffset;
  const centerIndex = (((pos + centerOffset) % count) + count) % count;

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
                const rel = copy * count + index - leftPeek;
                const isPeek = rel === 0 || rel === focusCount + 1;
                const isFocus = rel >= 1 && rel <= focusCount;
                const isCenter = rel === centerRel;
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
                      decorative={copy !== 1}
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

          <div className="equip-dots">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Ir para ${item.title}`}
                aria-current={index === centerIndex ? "true" : undefined}
                className={cn("equip-dot", index === centerIndex && "is-active")}
                onClick={() => goTo(index)}
              />
            ))}
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
