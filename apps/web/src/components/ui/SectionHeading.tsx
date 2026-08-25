import React from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 max-w-3xl ${alignment} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
}
