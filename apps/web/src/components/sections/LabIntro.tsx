import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { StatItem } from "@/copy/types";

interface LabIntroProps {
  eyebrow: string;
  title: string;
  body: string;
  stats: StatItem[];
}

export function LabIntro({ eyebrow, title, body, stats }: LabIntroProps) {
  return (
    <Section variant="default">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-heading text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">{body}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 p-6 rounded-(--radius) border border-border bg-card shadow-none"
            >
              <span className="font-heading text-display-sm font-bold text-accent">{stat.value}</span>
              <span className="text-sm text-muted-foreground leading-relaxed">{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
