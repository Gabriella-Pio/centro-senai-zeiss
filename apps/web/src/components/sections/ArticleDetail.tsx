import Image from "next/image";
import Link from "next/link";
import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@cem/ui";
import type { CtaCopy } from "@/copy/types";

type DetailGroup =
  | { title: string; items: string[] }
  | { title: string; text: string };

interface ArticleDetailImage {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
}

interface ArticleDetailProps {
  eyebrow: string;
  title: string;
  body: string;
  groups: DetailGroup[];
  cta: CtaCopy;
  image?: ArticleDetailImage;
}

export function ArticleDetail({ eyebrow, title, body, groups, cta, image }: ArticleDetailProps) {
  const isContain = image?.fit === "contain";

  return (
    <Section variant="default" clearNav>
      <Container className="flex max-w-3xl flex-col gap-10">
        {image ? (
          <div
            className={mediaFrameClass(
              cn(
                "relative -mx-6 aspect-21/9 w-[calc(100%+3rem)] max-w-none sm:mx-0 sm:w-full sm:max-w-none",
                isContain ? "bg-foreground" : undefined,
              ),
            )}
          >
            <Image
              src={publicAsset(image.src)}
              alt={image.alt}
              fill
              className={isContain ? "object-contain p-6" : mediaPhotoCoverClass}
              style={image.position ? { objectPosition: image.position } : undefined}
              sizes={mediaPhotoSizes.split}
              priority
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="type-display-sm font-heading font-bold text-foreground">
            {title}
          </h1>
          <p className="type-lead text-muted-foreground font-light">{body}</p>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="type-meta font-bold uppercase text-muted-foreground">
              {group.title}
            </h2>
            {"items" in group ? (
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="type-caption flex items-center gap-3 text-foreground/80">
                    <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="type-caption text-foreground/80">{group.text}</p>
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
