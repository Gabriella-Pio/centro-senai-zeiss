"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import "./workspace-empty-state.css";

export function WorkspaceEmptyState({
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
    <div className={`workspace-empty-state${className ? ` ${className}` : ""}`} role="status">
      <span className="workspace-empty-state__icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="workspace-empty-state__copy">
        <strong className="workspace-empty-state__title">{title}</strong>
        {description ? <p className="workspace-empty-state__text">{description}</p> : null}
      </div>
      {action ? <div className="workspace-empty-state__action">{action}</div> : null}
    </div>
  );
}
