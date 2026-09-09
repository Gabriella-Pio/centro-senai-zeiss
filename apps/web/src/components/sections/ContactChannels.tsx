import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { footer, location } from "@/copy/site";
import { getLocationLinks } from "@/lib/location-links";
import type { SectionCopy } from "@/copy/types";
import "./contact-channels.css";

interface ContactChannelsProps {
  heading: SectionCopy;
}

export function ContactChannels({ heading }: ContactChannelsProps) {
  const maps = getLocationLinks(location.mapsQuery);

  return (
    <Section id="contato" sectionKey="contact-channels" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="contact-channels">
        <div className="contact-channels__copy">
          <SectionHeading align="left" level={1} {...heading} />

          <dl className="contact-channels__list">
            <div className="contact-channels__item">
              <dt>Endereço</dt>
              <dd>
                <address>
                  <p>{location.name}</p>
                  {location.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </address>
                <p className="contact-channels__nav">
                  <a href={maps.googleMaps} target="_blank" rel="noopener noreferrer">
                    {footer.mapsLinks.googleMaps}
                  </a>
                  <a href={maps.waze} target="_blank" rel="noopener noreferrer">
                    {footer.mapsLinks.waze}
                  </a>
                </p>
              </dd>
            </div>

            <div className="contact-channels__item">
              <dt>Telefone</dt>
              <dd>
                <a href={`tel:${location.phoneTel}`} aria-label={footer.phoneAria}>
                  {location.phone}
                </a>
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
              <dd>
                <a href={`mailto:${location.email}`} aria-label={footer.emailAria}>
                  {location.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <MapEmbed />
      </Container>
    </Section>
  );
}
