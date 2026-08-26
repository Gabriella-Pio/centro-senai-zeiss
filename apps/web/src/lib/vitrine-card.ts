import { cn } from "@cem/ui";

/** Receita da vitrine: borda 1px, --radius do token, sem sombra.
 *  text-sm no card (14px) — o primitivo permanece text-xs para o app. */
export function vitrineCardClass(className?: string) {
  return cn(
    "border border-border bg-card p-2 text-sm shadow-none ring-0",
    "hover:bg-muted/40",
    className
  );
}
