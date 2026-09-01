import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { ScrollDots } from "@/components/ui/ScrollDots";

interface SnapCarouselShellProps {
  count: number;
  active: number;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
}

export function SnapCarouselShell({
  count,
  active,
  onPrev,
  onNext,
  children,
  className,
  trackClassName,
}: SnapCarouselShellProps) {
  if (count < 2) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative flex items-stretch gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Anterior"
          onClick={onPrev}
          className="relative z-20 size-12 shrink-0 touch-manipulation self-center"
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </Button>

        <div className={cn("relative z-0 min-w-0 flex-1", trackClassName)}>{children}</div>

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Próximo"
          onClick={onNext}
          className="relative z-20 size-12 shrink-0 touch-manipulation self-center"
        >
          <ChevronRight size={22} strokeWidth={1.75} />
        </Button>
      </div>

      <ScrollDots count={count} active={active} />
    </div>
  );
}
