"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { footer } from "@/copy/site";

export function ContactCtaBand() {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="site-contact-cta py-(--section-py) md:py-(--section-py-lg)"
    >
      <Container>
        <Link
          href={footer.cta.href}
          className="group inline-flex max-w-5xl flex-col gap-5 md:flex-row md:items-end md:gap-10"
        >
          <span
            id="contact-cta-heading"
            className="font-heading text-display-lg leading-[1.02] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary"
          >
            {footer.cta.label}
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-300 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <ArrowRight size={24} strokeWidth={1.75} />
          </span>
        </Link>
      </Container>
    </section>
  );
}
