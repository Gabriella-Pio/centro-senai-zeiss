import { cn } from "@cem/ui";
import "./eyebrow.css";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export const eyebrowClassName =
  "ui-eyebrow inline-flex w-fit border-b border-primary/30 pb-0.5 font-medium uppercase text-primary";

export function Eyebrow({ children, className }: EyebrowProps) {
  return <div className={cn(eyebrowClassName, className)}>{children}</div>;
}
