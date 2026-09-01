import { cn } from "@cem/ui";

interface ScrollDotsProps {
  count: number;
  active: number;
  className?: string;
}

export function ScrollDots({ count, active, className }: ScrollDotsProps) {
  if (count < 2) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === active ? "w-5 bg-primary" : "w-1.5 bg-border",
          )}
        />
      ))}
    </div>
  );
}
