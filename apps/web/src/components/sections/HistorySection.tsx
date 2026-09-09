import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionCopy, StatItem } from "@/copy/types";
import "./history-section.css";

interface HistorySectionProps {
  heading: SectionCopy;
  facts: StatItem[];
  paragraphs: string[];
}

export function HistorySection({ heading, facts, paragraphs }: HistorySectionProps) {
  return (
    <Section id="historia" sectionKey="history" surface="tint" pattern="none" ambient="none">
      <Container className="history">
        <SectionHeading align="left" {...heading} />

        <div className="history-frame">
          <ol className="history-facts">
            {facts.map((fact, index) => (
              <li key={fact.label} className="history-facts__item">
                <span className="history-facts__index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="history-facts__value">{fact.value}</p>
                <p className="history-facts__label">{fact.label}</p>
              </li>
            ))}
          </ol>

          <div className="history-prose">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
