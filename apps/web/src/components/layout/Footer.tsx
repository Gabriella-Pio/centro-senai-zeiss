import Link from "next/link";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { BackToTop } from "@/components/layout/BackToTop";
import { cn } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { footer, location, nav } from "@/copy/site";
import { services } from "@/copy/services";
import { getLocationLinks } from "@/lib/location-links";
import "./footer.css";

const footerLinkClass =
  "text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground";

const mapLinks = getLocationLinks(location.mapsQuery);

export default function Footer() {
  return (
    <footer className="site-footer section-surface relative" data-surface="dark" data-pattern="none">
      <div className="site-footer-inner relative py-(--section-py) md:py-(--section-py-lg)">
        <div className="footer-top-wrap">
          <BackToTop label={footer.backToTop} />
        </div>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
          <div className="space-y-5 lg:col-span-4">
            <BrandLockup variant="footer" inverted />
            <p className="max-w-sm type-body text-primary-foreground/60">{footer.tagline}</p>
            <ul className="footer-contact">
              <li>
                <a
                  href={`tel:${location.phoneTel}`}
                  aria-label={footer.phoneAria}
                  className={cn("footer-contact__item font-medium", footerLinkClass)}
                >
                  <Phone size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                  {location.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${location.email}`}
                  aria-label={footer.emailAria}
                  className={cn("footer-contact__item font-medium", footerLinkClass)}
                >
                  <Mail size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                  <span className="break-all">{location.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Eyebrow className="mb-6">{footer.visitTitle}</Eyebrow>
            <address className="space-y-1.5 text-sm not-italic leading-relaxed text-primary-foreground/75 md:text-base">
              <p className="font-medium text-primary-foreground">{location.name}</p>
              {location.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>

            <p className="footer-contact__item mt-5 text-primary-foreground/55">
              <Clock size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
              {location.hours}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={mapLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInGoogleMaps}
                className={cn("inline-flex items-center gap-2 text-sm", footerLinkClass)}
              >
                <MapPin size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.googleMaps}
              </a>
              <a
                href={mapLinks.waze}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInWaze}
                className={cn("inline-flex items-center gap-2 text-sm", footerLinkClass)}
              >
                <Navigation size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.waze}
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Eyebrow className="mb-6">{footer.servicesTitle}</Eyebrow>
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
            <Eyebrow className="mb-6">{footer.institutionalTitle}</Eyebrow>
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
        </div>

        <div className="site-footer-divider mt-(--section-stack) flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-primary-foreground/40 sm:flex-row md:pt-10">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href={footer.legal.termsHref} className="transition-colors hover:text-primary-foreground">
              {footer.legal.terms}
            </Link>
            <Link href={footer.legal.privacyHref} className="transition-colors hover:text-primary-foreground">
              {footer.legal.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
