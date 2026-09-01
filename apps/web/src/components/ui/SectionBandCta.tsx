import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface SectionBandCtaProps {
  href: string;
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

export function SectionBandCta({
  href,
  title,
  eyebrow = "Ver tudo",
  description,
  className,
}: SectionBandCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col items-center gap-4 rounded-(--radius) border border-dashed border-primary/30 bg-card/45 px-6 py-6 text-center backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card/65 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7 sm:text-left",
        className,
      )}
    >
      <div className="min-w-0 flex flex-col gap-2">
        <Eyebrow className="mx-auto sm:mx-0">{eyebrow}</Eyebrow>
        <p className="font-heading text-band-title font-bold tracking-tight text-foreground">{title}</p>
        {description ? (
          <p className="max-w-xl text-caption leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/35 text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowRight size={20} strokeWidth={1.75} />
      </span>
    </Link>
  );
}
