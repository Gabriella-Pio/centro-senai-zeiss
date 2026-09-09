"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, cn } from "@cem/ui";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { NavTray, navTrayRowClass } from "@/components/layout/NavTray";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { useSectionBackdrop } from "@/hooks/useSectionBackdrop";
import { nav } from "@/copy/site";
import { services } from "@/copy/services";
import "./navbar.css";

const navLinkClass =
  "site-nav-link px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-muted";

const navTextLinks = nav.links.filter(
  (link) => link.href !== nav.cta.href && link.href !== nav.contactCta.href,
);

function navPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type OpenTray = "services" | "languages" | null;

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openTray, setOpenTray] = useState<OpenTray>(null);
  const trayTimer = useRef(0);
  const { hidden, atTop } = useHideOnScroll({ disabled: mobileOpen });
  const { color: backdrop, onDark } = useSectionBackdrop(headerRef, pathname);
  const tray = hidden ? null : openTray;
  const solid = mobileOpen || !atTop;
  const inverted = onDark && !mobileOpen;

  useEffect(() => () => window.clearTimeout(trayTimer.current), []);

  const openServicesTray = () => {
    window.clearTimeout(trayTimer.current);
    trayTimer.current = window.setTimeout(() => setOpenTray("services"), 160);
  };

  const closeServicesTray = () => {
    window.clearTimeout(trayTimer.current);
    setOpenTray((current) => (current === "services" ? null : current));
  };

  const setLanguageOpen = (next: boolean) => {
    window.clearTimeout(trayTimer.current);
    setOpenTray(next ? "languages" : null);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "site-header fixed top-0 right-0 left-0 z-50",
        solid ? "bg-background" : "bg-transparent",
        "transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.45,0,0.55,1)] motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      data-on-dark={inverted ? "" : undefined}
      style={!mobileOpen && solid && backdrop ? { backgroundColor: backdrop } : undefined}
    >
      <div className="site-header-bar flex h-(--nav-height) items-center justify-between">
        <div className="site-header-brand min-w-0">
          <BrandLockup variant="nav" inverted={inverted} />
        </div>

        <nav className="site-header-nav hidden items-center gap-8 lg:flex">
          <Link
            href={nav.home.href}
            aria-current={navPathActive(pathname, nav.home.href) ? "page" : undefined}
            className={cn(navLinkClass, navPathActive(pathname, nav.home.href) && "site-nav-link--current")}
          >
            {nav.home.label}
          </Link>

          {navTextLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={navPathActive(pathname, link.href) ? "page" : undefined}
              className={cn(navLinkClass, navPathActive(pathname, link.href) && "site-nav-link--current")}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={openServicesTray}
            onMouseLeave={closeServicesTray}
            onFocusCapture={() => setOpenTray("services")}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                closeServicesTray();
              }
            }}
          >
            <Link
              href={nav.servicesHref}
              aria-expanded={tray === "services"}
              aria-haspopup="menu"
              aria-current={navPathActive(pathname, nav.servicesHref) ? "page" : undefined}
              className={cn(
                "site-nav-link flex items-center gap-1.5 px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors",
                navPathActive(pathname, nav.servicesHref) && "site-nav-link--current",
                tray === "services" && !navPathActive(pathname, nav.servicesHref) && "bg-muted text-foreground",
              )}
            >
              {nav.servicesLabel}
              <ChevronDown
                size={16}
                aria-hidden
                className={`transition-transform duration-200 ${tray === "services" ? "rotate-180" : ""}`}
              />
            </Link>

            {tray === "services" && (
              <NavTray role="menu" aria-label={nav.servicesLabel}>
                <Link
                  href={nav.servicesHref}
                  role="menuitem"
                  onClick={() => setOpenTray(null)}
                  className={cn(navTrayRowClass(pathname === nav.servicesHref), "font-medium")}
                >
                  {nav.servicesAllLabel}
                </Link>
                <div className="mx-3 my-1 h-px bg-border" role="separator" />
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

          <Link
            href={nav.contactCta.href}
            aria-current={navPathActive(pathname, nav.contactCta.href) ? "page" : undefined}
            className={cn(
              navLinkClass,
              navPathActive(pathname, nav.contactCta.href) && "site-nav-link--current",
            )}
          >
            {nav.contactCta.label}
          </Link>
        </nav>

        <div className="site-header-actions flex items-center gap-3">
          <div className="hidden lg:block">
            <Button size="lg" render={<Link href={nav.cta.href} />} className="h-11 px-6 text-base">
              {nav.cta.label}
            </Button>
          </div>
          <LanguageSwitch open={tray === "languages"} onOpenChange={setLanguageOpen} />
          <button
            className="site-nav-toggle p-2 text-foreground/80 hover:text-foreground lg:hidden"
            onClick={() => {
              setOpenTray(null);
              setMobileOpen(!mobileOpen);
            }}
            aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-200 motion-reduce:animate-none">
          <Link
            href={nav.home.href}
            onClick={() => setMobileOpen(false)}
            aria-current={navPathActive(pathname, nav.home.href) ? "page" : undefined}
            className={cn(
              "px-3 py-2.5 text-base font-medium hover:text-foreground",
              navPathActive(pathname, nav.home.href) ? "text-primary" : "text-foreground/70",
            )}
          >
            {nav.home.label}
          </Link>
          {navTextLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              aria-current={navPathActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "px-3 py-2.5 text-base font-medium hover:text-foreground",
                navPathActive(pathname, link.href) ? "text-primary" : "text-foreground/70",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={nav.contactCta.href}
            onClick={() => setMobileOpen(false)}
            aria-current={navPathActive(pathname, nav.contactCta.href) ? "page" : undefined}
            className={cn(
              "px-3 py-2.5 text-base font-medium hover:text-foreground",
              navPathActive(pathname, nav.contactCta.href) ? "text-primary" : "text-foreground/70",
            )}
          >
            {nav.contactCta.label}
          </Link>
          <div className="h-px bg-border my-2" />
          <p className="px-3 pb-1 font-medium uppercase tracking-[0.12em] text-primary type-meta">
            {nav.servicesLabel}
          </p>
          <Link
            href={nav.servicesHref}
            onClick={() => setMobileOpen(false)}
            aria-current={pathname === nav.servicesHref ? "page" : undefined}
            className="px-3 py-2.5 text-base font-medium text-foreground/70 hover:text-foreground"
          >
            {nav.servicesAllLabel}
          </Link>
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
          <div className="flex flex-col gap-2 pt-4">
            <Button
              render={<Link href={nav.cta.href} />}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-base"
            >
              {nav.cta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
