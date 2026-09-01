"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { NavTray, navTrayRowClass } from "@/components/layout/NavTray";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { useSectionBackdrop } from "@/hooks/useSectionBackdrop";
import { nav } from "@/copy/site";
import { services } from "@/copy/services";

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openTray, setOpenTray] = useState<"services" | null>(null);
  const { hidden, atTop } = useHideOnScroll({ disabled: mobileOpen });
  const backdrop = useSectionBackdrop(headerRef, pathname);
  const tray = hidden ? null : openTray;
  const solid = mobileOpen || !atTop;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 right-0 left-0 z-50",
        solid ? "bg-background" : "bg-transparent",
        "transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.45,0,0.55,1)] motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      style={!mobileOpen && solid && backdrop ? { backgroundColor: backdrop } : undefined}
    >
      <div className="mx-auto flex h-(--nav-height) w-full max-w-(--max-width-content) items-center justify-between px-6 sm:px-8">
        <BrandLockup variant="nav" />

        <nav className="hidden lg:flex items-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setOpenTray("services")}
            onMouseLeave={() => setOpenTray((current) => (current === "services" ? null : current))}
          >
            <button
              type="button"
              aria-expanded={tray === "services"}
              aria-haspopup="menu"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors",
                tray === "services" && "bg-muted text-foreground",
              )}
            >
              {nav.servicesLabel}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${tray === "services" ? "rotate-180" : ""}`}
              />
            </button>

            {tray === "services" && (
              <NavTray role="menu" aria-label={nav.servicesLabel}>
                {services.map((s, index) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    role="menuitem"
                    onClick={() => setOpenTray(null)}
                    className={navTrayRowClass(pathname === `/services/${s.id}`)}
                  >
                    <span className="w-6 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{s.label}</span>
                  </Link>
                ))}
              </NavTray>
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

        <div className="hidden lg:flex items-center gap-2">
          <Button size="lg" render={<Link href={nav.cta.href} />} className="px-6 h-11 text-base">
            {nav.cta.label}
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href={nav.contactCta.href} />}
            className="px-6 h-11 text-base"
          >
            {nav.contactCta.label}
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
        <div className="lg:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-200 motion-reduce:animate-none">
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
          <div className="flex flex-col gap-2 pt-4">
            <Button
              render={<Link href={nav.cta.href} />}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-base"
            >
              {nav.cta.label}
            </Button>
            <Button
              variant="outline"
              render={<Link href={nav.contactCta.href} />}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-base"
            >
              {nav.contactCta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
