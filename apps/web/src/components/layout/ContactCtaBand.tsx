"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { contactBand } from "@/copy/site";
import "./contact-cta-band.css";

export function ContactCtaBand() {
  return (
    <section aria-labelledby="contact-cta-heading" className="site-contact-cta py-(--section-py) md:py-(--section-py-lg)">
      <Container>
        <Link
          href={contactBand.href}
          className="group flex max-w-5xl flex-col gap-6 outline-none focus-visible:ring-1 focus-visible:ring-ring md:flex-row md:items-center md:justify-between md:gap-12"
        >
          <div className="flex min-w-0 flex-col gap-3">
            <Eyebrow>{contactBand.eyebrow}</Eyebrow>
            <h2
              id="contact-cta-heading"
              className="contact-cta-band__title font-heading font-bold text-foreground transition-colors group-hover:text-primary"
            >
              {contactBand.title}
            </h2>
            <p className="contact-cta-band__description max-w-2xl text-muted-foreground">
              {contactBand.description}
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-4 self-start md:self-center">
            <span className="contact-cta-band__action-label hidden font-medium uppercase text-muted-foreground transition-colors group-hover:text-primary sm:inline">
              {contactBand.linkLabel}
            </span>
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-300 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <ArrowRight size={24} strokeWidth={1.75} aria-hidden />
            </span>
          </span>
        </Link>
      </Container>
    </section>
  );
}
