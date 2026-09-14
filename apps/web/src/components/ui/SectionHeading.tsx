import React from "react";
import { cn } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import "./section-heading.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Use 1 on page titles (contato, serviços, orçamento). */
  level?: 1 | 2;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  level = 2,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const TitleTag = level === 1 ? "h1" : "h2";

  return (
    <div className={cn("section-heading flex max-w-3xl flex-col", alignment, className)}>
      {eyebrow ? <Eyebrow className="mb-(--sh-eyebrow-gap)">{eyebrow}</Eyebrow> : null}
      <TitleTag className="section-heading__title font-heading font-bold">
        {title}
      </TitleTag>
      {description ? (
        <p className="section-heading__description type-lead mt-(--sh-desc-gap) font-light">
          {description}
        </p>
      ) : null}
    </div>
  );
}
