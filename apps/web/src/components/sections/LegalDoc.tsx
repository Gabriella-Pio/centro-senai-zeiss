import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTextCta } from "@/components/ui/SectionTextCta";
import type { CtaCopy } from "@/copy/types";
import "./legal-doc.css";

interface LegalBlock {
  title: string;
  text: string;
  cta?: CtaCopy;
}

interface LegalDocProps {
  sectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  blocks: LegalBlock[];
  actions?: CtaCopy[];
}

export function LegalDoc({
  sectionKey,
  eyebrow,
  title,
  description,
  blocks,
  actions = [],
}: LegalDocProps) {
  return (
    <Section sectionKey={sectionKey} surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="legal-doc">
        <SectionHeading align="left" level={1} eyebrow={eyebrow} title={title} description={description} />

        <div className="legal-doc__body">
          <dl className="legal-doc__list">
            {blocks.map((block) => (
              <div key={block.title} className="legal-doc__item">
                <dt>{block.title}</dt>
                <dd>
                  <p>{block.text}</p>
                  {block.cta ? <SectionTextCta href={block.cta.href}>{block.cta.label}</SectionTextCta> : null}
                </dd>
              </div>
            ))}
          </dl>

          {actions.length > 0 ? (
            <div className="legal-doc__actions">
              {actions.map((action) => (
                <SectionTextCta key={action.href} href={action.href}>
                  {action.label}
                </SectionTextCta>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
