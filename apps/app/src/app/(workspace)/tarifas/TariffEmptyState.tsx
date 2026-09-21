import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";

export function TariffEmptyState({
  icon,
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
  const mappedClass = className
    ?.replace("tariffs-empty-state--grid", "workspace-empty-state--grid")
    .replace("tariffs-empty-state--panel", "workspace-empty-state--panel");

  return (
    <WorkspaceEmptyState
      icon={icon}
      title={title}
      description={description}
      action={action}
      className={mappedClass}
    />
  );
}
