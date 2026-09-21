"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function TariffSection({
  title,
  badge,
  open,
  onToggle,
  children,
  variant = "default",
}: {
  title: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  variant?: "default" | "highlight";
}) {
  return (
    <section
      className={`tariff-section${open ? " tariff-section--open" : ""}${variant === "highlight" ? " tariff-section--highlight" : ""}`}
    >
      <button
        type="button"
        className="tariff-section__header"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="tariff-section__chevron" aria-hidden="true">
          <ChevronDown />
        </span>
        <span className="tariff-section__title">{title}</span>
        {badge ? <span className="tariff-section__badge">{badge}</span> : null}
      </button>
      {open ? <div className="tariff-section__body">{children}</div> : null}
    </section>
  );
}
