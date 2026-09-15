import Link from "next/link";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyValueButton } from "@/components/ui/CopyValueButton";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { contactCopyActions, type ContactHeadingCopy } from "@/copy/contact";
import { footer, location } from "@/copy/site";
import { getLocationLinks } from "@/lib/location-links";
import "./contact-channels.css";

const linkIcon = { size: 16, strokeWidth: 1.75, "aria-hidden": true as const };
const addressText = [location.name, ...location.lines].join("\n");

interface ContactChannelsProps {
  heading: ContactHeadingCopy;
}

export function ContactChannels({ heading }: ContactChannelsProps) {
  const maps = getLocationLinks(location.mapsQuery);

  return (
    <Section id="contato" sectionKey="contact-channels" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="contact-channels">
        <SectionHeading
          className="contact-channels__heading"
          align="left"
          level={1}
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={
            <>
              {heading.description.before}
              <Link href={heading.description.href} className="contact-channels__action">
                {heading.description.link}
              </Link>
              {heading.description.after}
            </>
          }
        />

        <div className="contact-channels__details">
          <div className="contact-channels__place">
            <dl className="contact-channels__list">
              <div className="contact-channels__item">
                <dt>Endereço</dt>
                <dd>
                  <address>
                    <p>{location.name}</p>
                    {location.lines.map((line, index) => {
                      const last = index === location.lines.length - 1;
                      return (
                        <p key={line} className={last ? "contact-channels__address-line" : undefined}>
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
                  <div className="contact-channels__nav">
                    <a
                      href={maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={footer.mapsLinks.openInGoogleMaps}
                    >
                      <MapPin {...linkIcon} />
                      {footer.mapsLinks.googleMaps}
                    </a>
                    <a
                      href={maps.waze}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={footer.mapsLinks.openInWaze}
                    >
                      <Navigation {...linkIcon} />
                      {footer.mapsLinks.waze}
                    </a>
                  </div>
                </dd>
              </div>
            </dl>

            <MapEmbed />
          </div>

          <dl className="contact-channels__list contact-channels__list--reach">
            <div className="contact-channels__item">
              <dt>Telefone</dt>
              <dd className="contact-channels__value">
                <a
                  href={`tel:${location.phoneTel}`}
                  aria-label={footer.phoneAria}
                  className="contact-channels__action"
                >
                  <Phone {...linkIcon} />
                  {location.phone}
                </a>
                <CopyValueButton
                  value={location.phone}
                  ariaLabel={contactCopyActions.phone}
                  copiedAriaLabel={contactCopyActions.phoneDone}
                />
              </dd>
            </div>

            <div className="contact-channels__item">
              <dt>Horário</dt>
              <dd>
                <p>{location.hours}</p>
              </dd>
            </div>

            <div className="contact-channels__item">
              <dt>E-mail</dt>
              <dd className="contact-channels__value">
                <a
                  href={`mailto:${location.email}`}
                  aria-label={footer.emailAria}
                  className="contact-channels__action"
                >
                  <Mail {...linkIcon} />
                  {location.email}
                </a>
                <CopyValueButton
                  value={location.email}
                  ariaLabel={contactCopyActions.email}
                  copiedAriaLabel={contactCopyActions.emailDone}
                />
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </Section>
  );
}
