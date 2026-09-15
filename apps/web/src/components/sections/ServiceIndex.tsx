import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { mediaFrameClass, mediaPhotoCoverClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import { equipment } from "@/copy/equipment";
import { servicesCatalog } from "@/copy/services";
import type { SectionCopy, ServiceContent } from "@/copy/types";
import "./service-index.css";

interface ServiceIndexProps {
  heading: SectionCopy;
  items: ServiceContent[];
}

function machinesForService(serviceId: string) {
  return equipment
    .filter((item) => item.href === `/services/${serviceId}`)
    .map((item) => item.title.replace(/^ZEISS\s+/, ""));
}

export function ServiceIndex({ heading, items }: ServiceIndexProps) {
  return (
    <Section id="servicos" sectionKey="services-index" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="service-index">
        <div className="service-index__intro">
          <SectionHeading align="left" level={1} {...heading} />
        </div>

        <ol className="service-index__list">
          {items.map((item, index) => (
            <ServiceIndexRow key={item.id} item={item} index={index} />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function ServiceIndexRow({ item, index }: { item: ServiceContent; index: number }) {
  const href = `/services/${item.id}`;
  const machines = machinesForService(item.id);

  return (
    <li className="service-index__item">
      <div className="service-index__body">
        <div className="service-index__head">
          <p className="service-index__num" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="service-index__title">
            <Link href={href}>{item.label}</Link>
          </h2>
        </div>
        <p className="service-index__blurb">{item.shortDescription}</p>
        <div className="service-index__foot">
          {machines.length > 0 ? (
            <p className="service-index__machines">{machines.join(" · ")}</p>
          ) : null}
          <SectionTextCta className="service-index__cta" href={href}>
            {servicesCatalog.detailsLabel}
          </SectionTextCta>
        </div>
      </div>
      {item.cardImage ? (
        <Link href={href} className={mediaFrameClass("service-index__photo")} tabIndex={-1} aria-hidden>
          <Image
            src={publicAsset(item.cardImage)}
            alt=""
            fill
            className={mediaPhotoCoverClass}
            style={item.cardImagePosition ? { objectPosition: item.cardImagePosition } : undefined}
            sizes="(min-width: 64rem) 12rem, (min-width: 48rem) 9.5rem, 9.5rem"
          />
        </Link>
      ) : null}
    </li>
  );
}
