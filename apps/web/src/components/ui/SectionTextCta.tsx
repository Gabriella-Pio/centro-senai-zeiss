import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@cem/ui";
import "./section-text-cta.css";

interface SectionTextCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ctaClassName =
  "section-text-cta group inline-flex shrink-0 items-center gap-2 self-start font-semibold text-primary transition-colors hover:text-primary/80 lg:self-end";

function isExternalHref(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

export function SectionTextCta({ href, children, className }: SectionTextCtaProps) {
  const icon = (
    <ArrowUpRight
      size={20}
      strokeWidth={1.75}
      className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
    />
  );

  if (isExternalHref(href)) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={cn(ctaClassName, className)}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(ctaClassName, className)}>
      {children}
      {icon}
    </Link>
  );
}
