import React from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import "./section-heading.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`section-heading flex max-w-3xl flex-col ${alignment} ${className}`}>
      {eyebrow ? <Eyebrow className="mb-(--sh-eyebrow-gap)">{eyebrow}</Eyebrow> : null}
      <h2 className="section-heading__title font-heading font-bold text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="section-heading__description type-lead mt-(--sh-desc-gap) text-muted-foreground font-light">
          {description}
        </p>
      ) : null}
    </div>
  );
}
