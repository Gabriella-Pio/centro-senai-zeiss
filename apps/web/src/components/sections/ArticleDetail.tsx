import Image from "next/image";
import Link from "next/link";
import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { mediaFrameClass, mediaPhotoCoverClass, mediaPhotoSizes, mediaPlateClass } from "@/lib/media-frame";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@cem/ui";
import type { CtaCopy } from "@/copy/types";
import "./article-detail.css";

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
  back?: CtaCopy;
  title: string;
  body: string;
  groups: DetailGroup[];
  cta: CtaCopy;
  image?: ArticleDetailImage;
}

export function ArticleDetail({
  eyebrow,
  back,
  title,
  body,
  groups,
  cta,
  image,
}: ArticleDetailProps) {
  const isContain = image?.fit === "contain";

  return (
    <Section sectionKey="service-detail" surface="cream" pattern="none" ambient="none" clearNav>
      <Container className="article-detail">
        <div className="article-detail__copy">
          {back ? (
            <Link href={back.href} className="article-detail__back">
              {back.label}
            </Link>
          ) : null}

          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="article-detail__title font-heading font-bold">{title}</h1>
          <p className="article-detail__lead">{body}</p>

          {groups.map((group) => (
            <div key={group.title} className="article-detail__group">
              <h2>{group.title}</h2>
              {"items" in group ? (
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{group.text}</p>
              )}
            </div>
          ))}

          <Button size="lg" className="article-detail__cta" render={<Link href={cta.href} />}>
            {cta.label}
          </Button>
        </div>

        {image ? (
          <div className={mediaPlateClass("article-detail__photo")}>
            <div
              className={mediaFrameClass(
                cn("relative aspect-4/3 min-h-0 lg:aspect-auto lg:h-full", isContain && "bg-foreground"),
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
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
