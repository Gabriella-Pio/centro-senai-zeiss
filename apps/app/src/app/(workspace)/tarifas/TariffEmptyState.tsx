"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function TariffEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`tariffs-empty-state${className ? ` ${className}` : ""}`}
      role="status"
    >
      <span className="tariffs-empty-state__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="tariffs-empty-state__copy">
        <strong className="tariffs-empty-state__title">{title}</strong>
        {description ? <p className="tariffs-empty-state__text">{description}</p> : null}
      </div>
      {action ? <div className="tariffs-empty-state__action">{action}</div> : null}
    </div>
  );
}
