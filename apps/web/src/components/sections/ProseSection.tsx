import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

interface ProseSectionProps {
  title: string;
  paragraphs: string[];
  variant?: "default" | "muted" | "surface";
  clearNav?: boolean;
}

export function ProseSection({ title, paragraphs, variant = "default", clearNav = false }: ProseSectionProps) {
  return (
    <Section variant={variant} clearNav={clearNav}>
      <Container className="flex max-w-3xl flex-col gap-6">
        <h1 className="type-display-sm font-heading font-bold text-foreground">
          {title}
        </h1>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="type-body text-muted-foreground font-light"
          >
            {paragraph}
          </p>
        ))}
      </Container>
    </Section>
  );
}
