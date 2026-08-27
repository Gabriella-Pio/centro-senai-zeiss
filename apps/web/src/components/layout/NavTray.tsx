import type { ComponentProps } from "react";
import { cn } from "@cem/ui";

export function navTrayRowClass(active: boolean) {
  return cn(
    "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm",
    active ? "bg-muted text-primary" : "text-foreground/75 hover:bg-muted/50 hover:text-foreground",
  );
}

/** Painel da navbar: borda de vitrine, traço azul no topo enquanto aberto. */
export function NavTray({
  align = "start",
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  align?: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-px w-60 overflow-hidden rounded-(--radius) border border-border bg-card shadow-none",
        "origin-top-left animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 motion-reduce:animate-none",
        align === "end" ? "right-0 origin-top-right" : "left-0",
        className,
      )}
      {...props}
    >
      <div className="h-0.5 bg-primary" aria-hidden />
      <div className="py-1">{children}</div>
    </div>
  );
}

export function NavTrayRow({
  active = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button type="button" className={cn(navTrayRowClass(active), className)} {...props}>
      {children}
    </button>
  );
}
