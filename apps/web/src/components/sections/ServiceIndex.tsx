import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import { servicesCatalog } from "@/copy/services";
import type { SectionCopy, ServiceContent } from "@/copy/types";
import "./service-index.css";

interface ServiceIndexProps {
  heading: SectionCopy;
  items: ServiceContent[];
}

export function ServiceIndex({ heading, items }: ServiceIndexProps) {
  return (
    <Section id="servicos" sectionKey="services-index" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="service-index">
        <SectionHeading align="left" level={1} {...heading} />

        <ol className="service-index__list">
          {items.map((item, index) => (
            <li key={item.id} className="service-index__item">
              <p className="service-index__num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="service-index__body">
                <div className="service-index__head">
                  <h2 className="service-index__title">
                    <Link href={`/services/${item.id}`}>{item.label}</Link>
                  </h2>
                  <SectionTextCta className="service-index__cta !self-start lg:!self-start" href={`/services/${item.id}`}>
                    {servicesCatalog.detailsLabel}
                  </SectionTextCta>
                </div>
                <p className="service-index__blurb">{item.shortDescription}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
