import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

interface ProseSectionProps {
  title: string;
  paragraphs: string[];
  variant?: "default" | "muted" | "surface";
}

export function ProseSection({ title, paragraphs, variant = "default" }: ProseSectionProps) {
  return (
    <Section variant={variant}>
      <Container className="flex max-w-3xl flex-col gap-6">
        <h2 className="font-heading text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
          {title}
        </h2>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="text-base text-muted-foreground leading-relaxed font-light"
          >
            {paragraph}
          </p>
        ))}
      </Container>
    </Section>
  );
}
