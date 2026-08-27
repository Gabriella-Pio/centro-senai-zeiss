import Link from "next/link";
import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CtaCopy } from "@/copy/types";

type DetailGroup =
  | { title: string; items: string[] }
  | { title: string; text: string };

interface ArticleDetailProps {
  eyebrow: string;
  title: string;
  body: string;
  groups: DetailGroup[];
  cta: CtaCopy;
}

export function ArticleDetail({ eyebrow, title, body, groups, cta }: ArticleDetailProps) {
  return (
    <Section variant="default" clearNav>
      <Container className="max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-heading text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">{body}</p>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="text-meta font-bold tracking-widest uppercase text-muted-foreground">
              {group.title}
            </h2>
            {"items" in group ? (
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/80">{group.text}</p>
            )}
          </div>
        ))}

        <div className="pt-4">
          <Button size="lg" render={<Link href={cta.href} />}>
            {cta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
