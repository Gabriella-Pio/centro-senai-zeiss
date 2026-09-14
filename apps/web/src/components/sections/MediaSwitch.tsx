"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import type { SectionAmbient, SectionPattern, SectionSurface } from "@/lib/section-surfaces";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { cn } from "@cem/ui";
import { getIcon } from "@/lib/icons";
import { mediaPhotoCoverClass, mediaPhotoSizes, mediaPlateClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { CtaCopy, FeatureItem, SectionCopy } from "@/copy/types";
import "./media-switch.css";

const AUTOPLAY_MS = 5200;

interface MediaSwitchProps {
  heading: SectionCopy;
  items: FeatureItem[];
  ctaLabel?: string;
  listTrailing?: "number" | "service-link";
  variant?: "default" | "muted" | "accent" | "surface";
  surface?: SectionSurface;
  pattern?: SectionPattern;
  ambient?: SectionAmbient;
  sectionKey?: string;
  catalogCta?: CtaCopy;
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

function ItemBlurb({ description, isActive }: { description?: string; isActive: boolean }) {
  if (!description) return null;

  return (
    <div
      className={cn("media-switch__item-blurb-slot", isActive && "is-open")}
      aria-hidden={!isActive}
    >
      <div className="media-switch__item-blurb-clip">
        <p className="media-switch__item-blurb">{description}</p>
      </div>
    </div>
  );
}

export function MediaSwitch({
  heading,
  items,
  ctaLabel,
  listTrailing = "number",
  variant = "default",
  surface = "white",
  pattern = "none",
  ambient = "none",
  sectionKey,
  catalogCta,
}: MediaSwitchProps) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const count = items.length;
  const current = items[active];
  const Icon = getIcon(current?.icon);
  const autoplayEnabled = count > 1 && !prefersReducedMotion;
  const isServiceList = listTrailing === "service-link";
  const isContainPanel = Boolean(current.image && current.imageFit === "contain");

  const selectItem = useCallback((index: number) => {
    setActive(index);
    setProgress(0);
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const nextProgress = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setActive((index) => (index + 1) % count);
        setProgress(0);
        startRef.current = performance.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, autoplayEnabled, paused, count]);

  const handleItemFocus = (index: number) => {
    setPaused(true);
    selectItem(index);
  };

  return (
    <Section
      variant={variant}
      sectionKey={sectionKey}
      surface={surface}
      pattern={pattern}
      ambient={ambient}
    >
      <Container className="media-switch flex flex-col gap-(--section-stack)">
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <SectionHeading align="left" className="min-w-0 flex-1" {...heading} />
          {catalogCta ? <SectionTextCta href={catalogCta.href}>{catalogCta.label}</SectionTextCta> : null}
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-y-(--ms-gap) md:grid-cols-2 md:items-stretch md:gap-x-(--ms-split) md:gap-y-0 xl:gap-x-(--ms-split-lg)">
          <div className="media-switch__photo-slot max-md:hidden md:col-start-1 md:row-start-1 lg:h-full">
            <div className={mediaPlateClass("min-h-0 lg:h-full")}>
              <div
                className={cn(
                  "media-switch__panel media-switch__photo relative overflow-hidden rounded-(--radius) border border-border lg:h-full",
                  isContainPanel ? "bg-foreground" : "bg-muted",
                )}
              >
                {current.image ? (
                  <div
                    key={active}
                    className={cn(
                      "media-switch__photo-layer",
                      !prefersReducedMotion && "media-switch__photo-enter",
                    )}
                  >
                    <Image
                      src={publicAsset(current.image)}
                      alt={current.imageAlt ?? current.title}
                      fill
                      className={cn(
                        isContainPanel ? "object-contain p-5 sm:p-6" : mediaPhotoCoverClass,
                      )}
                      style={current.imagePosition ? { objectPosition: current.imagePosition } : undefined}
                      sizes={mediaPhotoSizes.split}
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {Icon && <Icon size={72} strokeWidth={1.25} className="text-primary" />}
                  </div>
                )}
                {current.tag ? (
                  <span className="media-switch__photo-tag absolute top-4 left-4 z-3 rounded-(--radius) border border-primary/25 bg-card/90 px-2.5 py-1 font-normal text-primary uppercase backdrop-blur-sm">
                    {current.tag}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <ul
            className="media-switch__panel relative z-10 flex min-h-0 flex-col md:col-start-2 md:row-start-1 md:h-full md:pb-[var(--plate-offset,0.75rem)]"
            onMouseLeave={() => setPaused(false)}
          >
            {items.map((item, index) => {
              const isActive = index === active;
              const n = String(index + 1).padStart(2, "0");

              const titleBlock = (
                <span className="min-w-0">
                  <span
                    className={cn(
                      "media-switch__item-title block transition-colors duration-300",
                      isServiceList
                        ? "media-switch__item-title--service font-sans font-semibold"
                        : "font-heading font-bold",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.tag ? (
                    <span
                      className={cn(
                        "media-switch__item-tag mt-0.5 block font-normal uppercase transition-colors duration-300",
                        isActive ? "text-primary/80" : "text-muted-foreground/70",
                      )}
                    >
                      {item.tag}
                    </span>
                  ) : null}
                </span>
              );

              const relatedServiceLink =
                !isServiceList && isActive && item.href && ctaLabel ? (
                  <Link
                    href={item.href}
                    className="media-switch__related-link inline-flex shrink-0 items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {ctaLabel}
                    <ArrowUpRight size={16} strokeWidth={1.75} />
                  </Link>
                ) : null;

              return (
                <li
                  key={item.title}
                  className={cn(
                    "relative flex min-h-min flex-col border-b md:flex-1",
                    isActive ? "border-transparent" : "border-border/60",
                  )}
                >
                  {isServiceList && item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onMouseEnter={() => handleItemFocus(index)}
                      onFocus={() => handleItemFocus(index)}
                      className={cn(
                        "flex min-h-13 w-full flex-1 touch-manipulation flex-col justify-center py-3.5 text-left outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring active:bg-muted/40 sm:min-h-14 lg:min-h-0 lg:py-(--ms-row-py)",
                        isActive && "text-foreground",
                      )}
                    >
                      <span className="flex items-center justify-between gap-4">
                        {titleBlock}
                        <ArrowUpRight
                          aria-hidden
                          size={22}
                          strokeWidth={2.25}
                          className={cn(
                            "media-switch__item-arrow shrink-0",
                            isActive && "media-switch__item-arrow--active",
                          )}
                        />
                      </span>
                      <ItemBlurb description={item.description} isActive={isActive} />
                    </Link>
                  ) : (
                    <div
                      className="flex min-h-13 w-full flex-1 items-stretch sm:min-h-14 lg:min-h-0"
                      onMouseEnter={() => handleItemFocus(index)}
                    >
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onFocus={() => handleItemFocus(index)}
                        onClick={() => selectItem(index)}
                        className="flex w-full touch-manipulation flex-col justify-center py-3.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring active:bg-muted/40 lg:py-(--ms-row-py)"
                      >
                        <span className="flex items-center gap-3 sm:gap-4">
                          <span className="min-w-0 flex-1">{titleBlock}</span>
                          <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                            {relatedServiceLink}
                            {listTrailing === "number" ? (
                              <span
                                aria-hidden
                                className={cn(
                                  "media-switch__item-index font-normal tabular-nums transition-colors duration-300",
                                  isActive ? "text-primary/80" : "text-muted-foreground/60",
                                )}
                              >
                                {n}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <ItemBlurb description={item.description} isActive={isActive} />
                      </button>
                    </div>
                  )}

                  {isActive ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right bg-primary motion-reduce:hidden"
                      style={{
                        transform: `scaleX(${Math.max(0, 1 - progress)})`,
                      }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
