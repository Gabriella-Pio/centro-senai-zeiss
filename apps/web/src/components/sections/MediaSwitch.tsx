"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@cem/ui";
import { getIcon } from "@/lib/icons";
import type { FeatureItem, SectionCopy } from "@/copy/types";

interface MediaSwitchProps {
  heading: SectionCopy;
  items: FeatureItem[];
  ctaLabel?: string;
  /** A seta promete outra página. Desligue quando o switcher só troca
   *  o conteúdo em tela, como no parque de equipamentos. */
  showArrow?: boolean;
}

export function MediaSwitch({ heading, items, ctaLabel, showArrow = true }: MediaSwitchProps) {
  const [active, setActive] = useState(0);
  const current = items[active];
  const Icon = getIcon(current?.icon);

  return (
    <Section variant="default">
      <Container className="flex flex-col gap-(--section-stack)">
        <SectionHeading align="left" {...heading} />

        <div className="grid grid-cols-1 gap-x-16 gap-y-4 lg:grid-cols-2">
          <div
            className={cn(
              "relative aspect-square overflow-hidden rounded-(--radius) border border-border lg:col-start-1 lg:row-start-1",
              current.image && current.imageFit === "contain" ? "bg-card" : "bg-muted",
            )}
          >
            {current.image ? (
              <Image
                src={current.image}
                alt={current.imageAlt ?? current.title}
                fill
                className={current.imageFit === "contain" ? "object-contain p-8" : "object-cover"}
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                {Icon && <Icon size={72} strokeWidth={1.25} className="text-primary" />}
              </div>
            )}
          </div>

          <ul className="flex flex-col max-lg:order-last max-lg:mt-8 lg:col-start-2 lg:row-start-1 lg:h-0 lg:min-h-full">
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item.title}
                  className={cn(
                    "flex border-b lg:min-h-0 lg:flex-1",
                    isActive ? "border-foreground" : "border-border",
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(index)}
                    className="flex h-full w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "font-heading text-xl font-semibold tracking-tight sm:text-2xl",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                    {showArrow ? (
                      <ArrowRight
                        size={20}
                        strokeWidth={1.75}
                        className={cn("shrink-0", isActive ? "text-foreground" : "text-muted-foreground")}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className={cn(
                          "font-mono text-xs tracking-widest tabular-nums shrink-0",
                          isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
            <p className="text-sm leading-relaxed text-muted-foreground">{current.description}</p>
            {current.href && ctaLabel ? (
              <Link
                href={current.href}
                className="relative inline-flex w-fit pb-0.5 text-sm font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:bg-foreground after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.45,0,0.55,1)] hover:after:scale-x-0 focus-visible:after:scale-x-0 motion-reduce:after:transition-none"
              >
                {ctaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
