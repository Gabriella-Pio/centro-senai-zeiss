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

        <div className="footer-grid">
          <div className="footer-lockup">
            <BrandLockup variant="footer" inverted />
          </div>

          <div className="footer-intro">
            <p className="type-body text-primary-foreground/60">{footer.tagline}</p>
            <nav className="footer-intro__icons" aria-label={footer.quickContactLabel}>
              <a className="footer-icon" href={`tel:${location.phoneTel}`} aria-label={footer.phoneAria}>
                <Phone size={16} strokeWidth={1.75} aria-hidden />
              </a>
              <a className="footer-icon" href={`mailto:${location.email}`} aria-label={footer.emailAria}>
                <Mail size={16} strokeWidth={1.75} aria-hidden />
              </a>
              <a
                className="footer-icon"
                href={mapLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.mapsLinks.openInGoogleMaps}
              >
                <MapPin size={16} strokeWidth={1.75} aria-hidden />
              </a>
            </nav>
          </div>

          <div className="footer-rule footer-rule--upper" aria-hidden="true" />
          <div className="footer-rule footer-rule--lower" aria-hidden="true" />

          <div className="footer-nav-cols">
            <div className="footer-services">
              <Eyebrow>{footer.servicesTitle}</Eyebrow>
              <ul className="footer-list">
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

            <div className="footer-centro">
              <Eyebrow>{footer.institutionalTitle}</Eyebrow>
              <ul className="footer-list">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
                    <span className="footer-contact__email">{location.email}</span>
                  </a>
                  <CopyValueButton
                    value={location.email}
                    ariaLabel={contactCopyActions.email}
                    copiedAriaLabel={contactCopyActions.emailDone}
                  />
                </li>
              </ul>
              <p className="footer-hours footer-contact__item">
                <Clock size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                {location.hours}
              </p>
            </div>
          </div>

          <div className="footer-visit">
            <Eyebrow>{footer.visitTitle}</Eyebrow>
            <address className="footer-visit__address">
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

            <div className="footer-visit__meta">
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
          </div>
        </div>

        <div className="site-footer-legal">
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
