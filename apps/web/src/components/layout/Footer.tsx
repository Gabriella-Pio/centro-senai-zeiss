"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { footer, location, nav } from "@/copy/site";
import { services } from "@/copy/services";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground/70 border-t border-border">
      <Container className="pt-24 md:pt-32 pb-16">
        <Link
          href={footer.cta.href}
          className="group flex items-baseline gap-4 md:gap-6 font-heading text-display-md leading-[1.05] font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          {footer.cta.label}
        </Link>
      </Container>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 pt-4 border-t border-border relative">
          <div className="md:col-span-1 space-y-4">
            <BrandLockup variant="footer" />
            <p className="text-xs text-foreground/50 leading-relaxed max-w-xs">{footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              {footer.visitTitle}
            </h4>
            <p className="text-xs leading-relaxed">
              {location.name}
              <br />
              {location.lines[1]}
            </p>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              {footer.servicesTitle}
            </h4>
            <ul className="space-y-3 text-xs">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="hover:text-foreground transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              {footer.institutionalTitle}
            </h4>
            <ul className="space-y-3 text-xs">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#top"
            aria-label={footer.backToTop}
            className="hidden md:flex absolute right-0 -top-2 items-center justify-center w-11 h-11 rounded-full border border-border text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <ArrowUp size={18} />
          </a>
        </div>

        <div className="pt-8 pb-10 flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/40 gap-4 border-t border-border">
          <p>{footer.copyright}</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              {footer.legal.terms}
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              {footer.legal.privacy}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
