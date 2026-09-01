"use client";

import Link from "next/link";
import { ArrowUp, MapPin, Navigation, Phone } from "lucide-react";
import { cn } from "@cem/ui";
import { Container } from "@/components/ui/Container";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { footer, location, nav } from "@/copy/site";
import { services } from "@/copy/services";
import { getLocationLinks } from "@/lib/location-links";

const footerLinkClass =
  "text-primary-foreground/75 hover:text-primary-foreground transition-colors duration-200";

const footerHeadingClass =
  "type-meta font-bold mb-6 uppercase text-primary-foreground/50";

const mapLinks = getLocationLinks(location.mapsQuery);

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden">
      <div aria-hidden className="site-footer-glow pointer-events-none absolute inset-0" />

      <Container className="relative py-(--section-py) md:py-(--section-py-lg)">
        <div className="relative grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-4">
            <BrandLockup variant="footer" inverted />
        <p className="max-w-sm type-body text-primary-foreground/65">
              {footer.tagline}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className={footerHeadingClass}>{footer.visitTitle}</h4>
            <address className="space-y-2 text-sm not-italic leading-relaxed text-primary-foreground/80 md:text-base">
              <p className="font-medium text-primary-foreground">{location.name}</p>
              {location.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={mapLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInGoogleMaps}
                className={cn(
                  "inline-flex items-center gap-2 rounded-(--radius) border border-primary-foreground/20 px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary-foreground/35 hover:bg-primary-foreground/10",
                  footerLinkClass,
                )}
              >
                <MapPin size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.googleMaps}
              </a>
              <a
                href={mapLinks.waze}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInWaze}
                className={cn(
                  "inline-flex items-center gap-2 rounded-(--radius) border border-primary-foreground/20 px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary-foreground/35 hover:bg-primary-foreground/10",
                  footerLinkClass,
                )}
              >
                <Navigation size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.waze}
              </a>
            </div>

            <a
              href={`tel:${location.phoneTel}`}
              className={cn("mt-5 inline-flex items-center gap-2.5 text-sm font-medium md:text-base", footerLinkClass)}
            >
              <Phone size={16} strokeWidth={1.75} className="shrink-0" />
              {location.phone}
            </a>
            <p className="mt-2.5 text-sm text-primary-foreground/60 md:text-base">{location.hours}</p>
          </div>

          <div className="lg:col-span-3">
            <h4 className={footerHeadingClass}>{footer.servicesTitle}</h4>
            <ul className="space-y-3.5 text-sm md:text-base">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className={footerLinkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className={footerHeadingClass}>{footer.institutionalTitle}</h4>
            <ul className="space-y-3.5 text-sm md:text-base">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#top"
            aria-label={footer.backToTop}
            className="absolute right-0 top-0 hidden h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/70 transition-colors hover:border-primary-foreground/45 hover:bg-primary-foreground/10 hover:text-primary-foreground md:flex"
          >
            <ArrowUp size={20} />
          </a>
        </div>

        <div className="site-footer-divider mt-(--section-stack) flex flex-col items-center justify-between gap-5 border-t pt-10 text-sm text-primary-foreground/45 sm:flex-row md:pt-12 md:text-base">
          <p>{footer.copyright}</p>
          <div className="flex gap-8">
            <span className="cursor-pointer transition-colors hover:text-primary-foreground/80">
              {footer.legal.terms}
            </span>
            <span className="cursor-pointer transition-colors hover:text-primary-foreground/80">
              {footer.legal.privacy}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
