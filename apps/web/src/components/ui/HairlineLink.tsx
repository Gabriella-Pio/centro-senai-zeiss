import { Link } from "@/i18n/navigation";
import { cn } from "@cem/ui";

interface HairlineLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function HairlineLink({ href, children, className }: HairlineLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex w-fit pb-0.5 type-link font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:bg-foreground after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.45,0,0.55,1)] hover:after:scale-x-0 focus-visible:after:scale-x-0 motion-reduce:after:transition-none",
        className,
      )}
    >
      {children}
    </Link>
  );
}
