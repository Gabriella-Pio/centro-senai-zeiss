import { cn } from "@cem/ui";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export const eyebrowClassName =
  "inline-flex w-fit border-b border-border pb-0.5 text-[11.5px] font-medium tracking-[0.18em] uppercase text-muted-foreground";

export function Eyebrow({ children, className }: EyebrowProps) {
  return <div className={cn(eyebrowClassName, className)}>{children}</div>;
}
