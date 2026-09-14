import Link from "next/link";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { BackToTop } from "@/components/layout/BackToTop";
import { cn } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { CopyValueButton } from "@/components/ui/CopyValueButton";
import { contactCopyActions } from "@/copy/contact";
import { footer, location, nav } from "@/copy/site";
import { services } from "@/copy/services";
import { getLocationLinks } from "@/lib/location-links";
import "./footer.css";

const footerLinkClass =
  "text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground";

const mapLinks = getLocationLinks(location.mapsQuery);
const addressText = [location.name, ...location.lines].join("\n");

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
              <li className="footer-contact__row">
                <a
                  href={`tel:${location.phoneTel}`}
                  aria-label={footer.phoneAria}
                  className={cn("footer-contact__item font-medium", footerLinkClass)}
                >
                  <Phone size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                  {location.phone}
                </a>
                <CopyValueButton
                  value={location.phone}
                  ariaLabel={contactCopyActions.phone}
                  copiedAriaLabel={contactCopyActions.phoneDone}
                />
              </li>
              <li className="footer-contact__row">
                <a
                  href={`mailto:${location.email}`}
                  aria-label={footer.emailAria}
                  className={cn("footer-contact__item font-medium", footerLinkClass)}
                >
                  <Mail size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                  <span className="break-all">{location.email}</span>
                </a>
                <CopyValueButton
                  value={location.email}
                  ariaLabel={contactCopyActions.email}
                  copiedAriaLabel={contactCopyActions.emailDone}
                />
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Eyebrow className="mb-6">{footer.visitTitle}</Eyebrow>
            <address className="space-y-1.5 text-sm not-italic leading-relaxed text-primary-foreground/75 md:text-base">
              <p className="font-medium text-primary-foreground">{location.name}</p>
              {location.lines.map((line, index) => {
                const last = index === location.lines.length - 1;
                return (
                  <p key={line} className={last ? "footer-address-line" : undefined}>
                    {line}
                    {last ? (
                      <CopyValueButton
                        value={addressText}
                        ariaLabel={contactCopyActions.address}
                        copiedAriaLabel={contactCopyActions.addressDone}
                      />
                    ) : null}
                  </p>
                );
              })}
            </address>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={mapLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInGoogleMaps}
                className="footer-nav-link footer-nav-link--meta"
              >
                <MapPin size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.googleMaps}
              </a>
              <a
                href={mapLinks.waze}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInWaze}
                className="footer-nav-link footer-nav-link--meta"
              >
                <Navigation size={15} strokeWidth={1.75} className="shrink-0" />
                {footer.mapsLinks.waze}
              </a>
            </div>

            <p className="footer-contact__item mt-5 text-primary-foreground/55">
              <Clock size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
              {location.hours}
            </p>
          </div>

          <div className="lg:col-span-3">
            <Eyebrow className="mb-6">{footer.servicesTitle}</Eyebrow>
            <ul className="space-y-3.5 text-sm md:text-base">
              <li>
                <Link href={nav.servicesHref} className="footer-nav-link">
                  {nav.servicesAllLabel}
                </Link>
              </li>
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="footer-nav-link">
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
                  <Link href={link.href} className="footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer-legal site-footer-divider">
          <p>{footer.copyright}</p>
          <nav className="site-footer-legal__nav" aria-label="Documentos legais">
            <Link href={footer.legal.termsHref} className="footer-legal-link">
              {footer.legal.terms}
            </Link>
            <span className="site-footer-legal__rule" aria-hidden />
            <Link href={footer.legal.privacyHref} className="footer-legal-link">
              {footer.legal.privacy}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
