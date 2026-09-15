"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button, cn, Sheet, SheetContent, SheetTitle } from "@cem/ui";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { NavTray, navTrayRowClass } from "@/components/layout/NavTray";
import { useCopy } from "@/copy/CopyProvider";
import { Link, usePathname } from "@/i18n/navigation";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { useSectionBackdrop } from "@/hooks/useSectionBackdrop";
import "./navbar.css";

const navLinkClass =
  "site-nav-link px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-muted";

function navPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type OpenTray = "services" | "languages" | null;

export default function Navbar() {
  const { nav, services } = useCopy();
  const pathname = usePathname();
  const navTextLinks = nav.links.filter(
    (link) => link.href !== nav.cta.href && link.href !== nav.contactCta.href,
  );
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

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 90rem)");
    const close = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

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

  const setMenuOpen = (open: boolean) => {
    setOpenTray(null);
    setMobileOpen(open);
  };

  return (
    <>
      <header
      ref={headerRef}
      className={cn(
        "site-header fixed top-0 right-0 left-0 z-50",
        solid ? "bg-background" : "bg-transparent",
        "transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.45,0,0.55,1)] motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      data-on-dark={inverted ? "" : undefined}
      data-solid={solid ? "" : undefined}
      style={!mobileOpen && solid && backdrop ? { backgroundColor: backdrop } : undefined}
    >
      <div className="site-header-bar flex h-(--nav-height) items-center justify-between">
        <div className="site-header-brand min-w-0">
          <BrandLockup variant="nav" inverted={inverted} />
        </div>

        <nav className="site-header-nav items-center gap-8">
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
          <div className="site-header-cta">
            <Button size="lg" render={<Link href={nav.cta.href} />} className="h-11 px-6 text-base">
              {nav.cta.label}
            </Button>
          </div>
          <LanguageSwitch
            align="end"
            open={tray === "languages"}
            onOpenChange={setLanguageOpen}
          />
          <button
            type="button"
            className="site-nav-toggle p-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMenuOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="site-nav-drawer"
            aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
          >
            <span className="site-nav-toggle__icon" aria-hidden>
              <span className="site-nav-toggle__bar" />
              <span className="site-nav-toggle__bar" />
              <span className="site-nav-toggle__bar" />
            </span>
          </button>
        </div>
      </div>
    </header>

      <Sheet open={mobileOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          id="site-nav-drawer"
          side="right"
          showCloseButton={false}
          overlayClassName="site-nav-scrim z-40 bg-foreground/40 supports-backdrop-filter:backdrop-blur-[16px]"
          className="site-nav-sheet"
        >
          <SheetTitle className="sr-only">{nav.menuLabel}</SheetTitle>
          <nav className="site-nav-sheet__body" aria-label={nav.menuLabel}>
            <Link
              href={nav.home.href}
              onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
              aria-current={navPathActive(pathname, nav.contactCta.href) ? "page" : undefined}
              className={cn(
                "px-3 py-2.5 text-base font-medium hover:text-foreground",
                navPathActive(pathname, nav.contactCta.href) ? "text-primary" : "text-foreground/70",
              )}
            >
              {nav.contactCta.label}
            </Link>
            <div className="site-nav-sheet__catalog">
              <p className="site-nav-sheet__kicker type-meta font-medium text-primary uppercase">
                {nav.servicesLabel}
              </p>
              <Link
                href={nav.servicesHref}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === nav.servicesHref ? "page" : undefined}
                className={cn(
                  "site-nav-sheet__all",
                  pathname === nav.servicesHref && "site-nav-sheet__all--current",
                )}
              >
                {nav.servicesAllLabel}
              </Link>
              <ol className="site-nav-sheet__index">
                {services.map((s, index) => {
                  const href = `/services/${s.id}`;
                  const current = pathname === href;
                  return (
                    <li key={s.id}>
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "site-nav-sheet__row",
                          current && "site-nav-sheet__row--current",
                        )}
                      >
                        <span className="site-nav-sheet__num" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{s.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
          <div className="site-nav-sheet__cta">
            <Button
              render={<Link href={nav.cta.href} />}
              onClick={() => setMenuOpen(false)}
              className="h-12 w-full text-base"
            >
              {nav.cta.label}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
