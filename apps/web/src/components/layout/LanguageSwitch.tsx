"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@cem/ui";
import { NavTray, navTrayRowClass } from "@/components/layout/NavTray";
import { useCopy } from "@/copy/CopyProvider";
import { usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

interface LanguageSwitchProps {
  className?: string;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function hrefForLocale(pathname: string, locale: AppLocale) {
  const path = pathname || "/";
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function LanguageSwitch({
  className,
  align = "end",
  open: openProp,
  onOpenChange,
}: LanguageSwitchProps) {
  const copy = useCopy();
  const locale = useLocale();
  const pathname = usePathname();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const controlled = onOpenChange != null;
  const open = controlled ? Boolean(openProp) : uncontrolledOpen;
  const languages = copy.nav.languages;
  const current = languages.options.find((option) => option.code === locale);

  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange(next);
    else setUncontrolledOpen(next);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, controlled, onOpenChange]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={languages.ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={cn(
          "site-nav-lang flex h-11 items-center gap-1.5 border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground transition-colors",
          open && "bg-muted",
          className,
        )}
      >
        <Globe size={16} strokeWidth={1.75} />
        <span className="site-nav-lang-code font-mono text-xs uppercase tracking-wide">
          {current?.code ?? locale}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn(
            "site-nav-lang-chevron transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <NavTray
          align={align}
          role="listbox"
          aria-label={languages.ariaLabel}
          className="site-nav-lang-menu w-40"
        >
          {languages.options.map((option) => {
            const code = option.code as AppLocale;
            const selected = code === locale;
            return (
              <a
                key={code}
                href={hrefForLocale(pathname, code)}
                hrefLang={code}
                role="option"
                aria-selected={selected}
                className={navTrayRowClass(selected)}
                onClick={(event) => {
                  if (selected) {
                    event.preventDefault();
                    setOpen(false);
                    return;
                  }
                  const search = window.location.search;
                  if (search) {
                    event.preventDefault();
                    window.location.assign(`${hrefForLocale(pathname, code)}${search}`);
                  }
                }}
              >
                <span className="w-7 font-mono text-xs text-muted-foreground">{code.toUpperCase()}</span>
                <span>{option.label}</span>
              </a>
            );
          })}
        </NavTray>
      )}
    </div>
  );
}
