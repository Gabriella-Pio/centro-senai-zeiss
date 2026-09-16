"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPlateClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import type { CtaCopy } from "@/copy/types";
import { Link } from "@/i18n/navigation";
import { ServiceSiblingsCarousel, type ServiceSiblingItem } from "@/components/sections/ServiceSiblingsCarousel";
import "./service-detail.css";

interface ServiceDetailImage {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
  machine?: string;
}

interface ServiceDetailMachine {
  name: string;
  tag?: string;
}

interface ServiceDetailProps {
  eyebrow: string;
  index: number;
  title: string;
  body: string;
  applications: { title: string; items: string[] };
  audience: { title: string; text: string };
  equipmentLabel: string;
  machines: ServiceDetailMachine[];
  cta: CtaCopy;
  siblings: ServiceSiblingItem[];
  siblingsLabel: string;
  catalogCta?: CtaCopy;
  detailsLabel: string;
  currentLabel?: string;
  images?: ServiceDetailImage[];
  siteUrl?: string;
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

const PHOTO_INTERVAL_MS = 5500;

function ServicePhoto({
  images,
  machines,
  equipmentLabel,
  reducedMotion,
}: {
  images: ServiceDetailImage[];
  machines: ServiceDetailMachine[];
  equipmentLabel: string;
  reducedMotion: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const canCycle = images.length > 1 && !reducedMotion && !paused;
  const activeMachine = images[active]?.machine;
  activeRef.current = active;

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setPaused(true);
      setActive(((index % images.length) + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!canCycle) return;
    const id = window.setTimeout(() => {
      setActive((current) => (current + 1) % images.length);
    }, PHOTO_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [canCycle, active, images.length]);

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo || images.length < 2) return;

    const LOCK = 10;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let locked = false;
    let dx = 0;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dragging = false;
      locked = false;
      dx = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const mx = event.clientX - startX;
      const my = event.clientY - startY;
      if (!locked) {
        if (Math.hypot(mx, my) < LOCK) return;
        locked = true;
        if (Math.abs(mx) <= Math.abs(my)) {
          pointerId = null;
          return;
        }
        dragging = true;
        photo.setPointerCapture(event.pointerId);
      }
      if (!dragging) return;
      event.preventDefault();
      dx = mx;
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      if (dx <= -40) goTo(activeRef.current + 1);
      else if (dx >= 40) goTo(activeRef.current - 1);
    };

    photo.addEventListener("pointerdown", onDown);
    photo.addEventListener("pointermove", onMove, { passive: false });
    photo.addEventListener("pointerup", onUp);
    photo.addEventListener("pointercancel", onUp);
    return () => {
      photo.removeEventListener("pointerdown", onDown);
      photo.removeEventListener("pointermove", onMove);
      photo.removeEventListener("pointerup", onUp);
      photo.removeEventListener("pointercancel", onUp);
    };
  }, [goTo, images.length]);

  if (images.length === 0 && machines.length === 0) return null;

  return (
    <>
      {images.length > 0 ? (
        <div className={cn("service-detail__hero-stage", images.length > 1 && "has-pager")}>
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => goTo(active - 1)}
              className="service-detail__hero-arrow service-detail__hero-arrow--prev"
            >
              <ChevronLeft size={22} strokeWidth={1.5} aria-hidden />
            </button>
          ) : null}
          <div ref={photoRef} className={mediaPlateClass("service-detail__hero-photo")}>
            <div className={mediaFrameClass("service-detail__hero-frame")}>
              {images.map((image, index) => {
                const isContain = image.fit === "contain";
                return (
                  <Image
                    key={image.src}
                    src={publicAsset(image.src)}
                    alt={index === active ? image.alt : ""}
                    fill
                    className={cn(
                      isContain ? "object-contain p-6" : mediaPhotoCoverClass,
                      index === active && "is-active",
                    )}
                    style={image.position ? { objectPosition: image.position } : undefined}
                    sizes="(min-width: 64rem) 40vw, 100vw"
                    priority={index === 0}
                  />
                );
              })}
            </div>
          </div>
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => goTo(active + 1)}
              className="service-detail__hero-arrow service-detail__hero-arrow--next"
            >
              <ChevronRight size={22} strokeWidth={1.5} aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}

      {images.length > 1 ? (
        <div
          className="service-detail__hero-dots"
          role="tablist"
          aria-label="Fotos deste serviço"
          style={{ "--service-photo-beat": `${PHOTO_INTERVAL_MS}ms` } as CSSProperties}
        >
          {images.map((image, index) => {
            const isActive = index === active;
            const isPlaying = isActive && canCycle;
            return (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={image.machine ? `Foto ${index + 1}: ${image.machine}` : `Foto ${index + 1}`}
                className={cn(
                  "service-detail__hero-dot",
                  isActive && "is-active",
                  isPlaying && "is-playing",
                )}
                onClick={() => goTo(index)}
              >
                {isPlaying ? (
                  <span key={active} className="service-detail__hero-dot-progress" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {machines.length > 0 ? (
        <section className="service-detail__photo-machines" aria-labelledby="service-equipment">
          <h2 id="service-equipment">{equipmentLabel}</h2>
          <ul className="service-detail__machine-switch">
            {machines.map((machine) => {
              const photoIndex = images.findIndex((image) => image.machine === machine.name);
              const isActive = activeMachine === machine.name;
              const label = (
                <>
                  <span className="service-detail__machine-name">{machine.name}</span>
                  {machine.tag ? (
                    <span className="service-detail__machine-tag">{machine.tag}</span>
                  ) : null}
                </>
              );

              return (
                <li key={machine.name}>
                  {photoIndex >= 0 ? (
                    <button
                      type="button"
                      className={cn("service-detail__machine-hit", isActive && "is-active")}
                      aria-pressed={isActive}
                      aria-label={`Ver foto: ${machine.name}`}
                      onClick={() => goTo(photoIndex)}
                    >
                      {label}
                    </button>
                  ) : (
                    <div className="service-detail__machine-hit is-static">{label}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function ServiceDetail({
  eyebrow,
  index,
  title,
  body,
  applications,
  audience,
  equipmentLabel,
  machines,
  cta,
  siblings,
  siblingsLabel,
  catalogCta,
  detailsLabel,
  currentLabel = "Você está aqui",
  images = [],
  siteUrl,
}: ServiceDetailProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const currentId = siblings.find((s) => s.current)?.id ?? "";

  const jsonLd = siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description: body,
        url: `${siteUrl}/services/${currentId}`,
        provider: {
          "@type": "Organization",
          name: "Centro de Excelência em Metrologia SENAI × ZEISS",
        },
        ...(machines.length > 0
          ? {
              additionalProperty: machines.map((m) => ({
                "@type": "PropertyValue",
                name: m.name,
                value: m.tag ?? "",
              })),
            }
          : {}),
      }
    : null;

  return (
    <Section sectionKey="service-detail" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="service-detail">
        {jsonLd ? (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}

        <div className="service-detail__stage">
          <div className="service-detail__masthead-text">
            <div className="service-detail__kicker">
              <div className="service-detail__kicker-label">
                <p className="service-detail__num" aria-hidden>
                  {padIndex(index)}
                </p>
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            </div>
            <h1 className="service-detail__title font-heading font-bold">{title}</h1>
            <p className="service-detail__lead type-lead">{body}</p>
          </div>

          <div className="service-detail__band">
            {images.length > 0 || machines.length > 0 ? (
              <div className="service-detail__photo-slot">
                <ServicePhoto
                  images={images}
                  machines={machines}
                  equipmentLabel={equipmentLabel}
                  reducedMotion={prefersReducedMotion}
                />
              </div>
            ) : null}

            <div className="service-detail__facts">
            <section
              className="service-detail__fact service-detail__fact--applications"
              aria-labelledby="service-applications"
            >
              <h2 id="service-applications">{applications.title}</h2>
              <ul>
                {applications.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="service-detail__fact" aria-labelledby="service-audience">
              <h2 id="service-audience">{audience.title}</h2>
              <p>{audience.text}</p>
            </section>

            <div className="service-detail__quote">
              <Button
                size="lg"
                variant="outline"
                className="service-detail__quote-btn"
                render={<Link href={cta.href} />}
              >
                {cta.label}
              </Button>
            </div>
            </div>
          </div>
        </div>

        <ServiceSiblingsCarousel
          key={currentId}
          items={siblings}
          label={siblingsLabel}
          detailsLabel={detailsLabel}
          currentLabel={currentLabel}
          catalogCta={catalogCta}
          reduceMotion={prefersReducedMotion}
        />
      </Container>
    </Section>
  );
}
