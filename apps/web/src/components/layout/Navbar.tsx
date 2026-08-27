"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { nav } from "@/copy/site";
import { services } from "@/copy/services";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const hidden = useHideOnScroll({ disabled: mobileOpen });

  useEffect(() => {
    if (hidden) setServicesOpen(false);
  }, [hidden]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b border-border bg-background",
        "transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex h-[96px] max-w-[1280px] items-center justify-between px-6 sm:px-8">
        <BrandLockup variant="nav" />

        <nav className="hidden lg:flex items-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors">
              {nav.servicesLabel}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 overflow-hidden rounded-[var(--radius)] py-2 bg-popover border border-border shadow-2xl">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <Button size="lg" render={<Link href={nav.cta.href} />} className="px-6 h-11 text-sm">
            {nav.cta.label}
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-2">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.id}`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-base text-foreground/70 hover:text-foreground"
            >
              {s.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-base text-foreground/70"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Button
              render={<Link href={nav.cta.href} />}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-sm"
            >
              {nav.cta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
