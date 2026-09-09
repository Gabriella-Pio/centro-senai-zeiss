import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/copy/services";
import "./service-chips.css";

export type ServiceChipLink = {
  id: string;
  href: string;
  label: string;
};

interface ServiceChipsProps {
  label: string;
  links: ServiceChipLink[];
  ariaLabel?: string;
  interactive?: boolean;
}

export function chipForServiceId(id: string): ServiceChipLink | null {
  const service = services.find((entry) => entry.id === id);
  if (!service) return null;
  return {
    id,
    href: `/services/${id}`,
    label: service.label,
  };
}

export function chipForServiceHref(href?: string): ServiceChipLink | null {
  if (!href) return null;
  return chipForServiceId(href.replace(/^\/services\//, ""));
}

export function ServiceChips({
  label,
  links,
  ariaLabel,
  interactive = true,
}: ServiceChipsProps) {
  if (links.length === 0) return null;

  return (
    <nav className="service-chips" aria-label={ariaLabel ?? label}>
      <p className="service-chips__label">{label}</p>
      <div className="service-chips__list">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="service-chips__chip"
            tabIndex={interactive ? undefined : -1}
          >
            {link.label}
            <ArrowUpRight className="service-chips__icon" strokeWidth={1.75} aria-hidden />
          </Link>
        ))}
      </div>
    </nav>
  );
}
