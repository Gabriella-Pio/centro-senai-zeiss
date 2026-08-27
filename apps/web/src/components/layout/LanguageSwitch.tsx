"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@cem/ui";
import { NavTray, NavTrayRow } from "@/components/layout/NavTray";
import { nav } from "@/copy/site";

interface LanguageSwitchProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Só o controle visual. A troca real de idioma entra quando o copy estiver fechado. */
export function LanguageSwitch({ className, open: openProp, onOpenChange }: LanguageSwitchProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [code, setCode] = useState(nav.languages.defaultCode);
  const rootRef = useRef<HTMLDivElement>(null);
  const controlled = onOpenChange != null;
  const open = controlled ? Boolean(openProp) : uncontrolledOpen;
  const current = nav.languages.options.find((option) => option.code === code);

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
        aria-label={nav.languages.ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors",
          open && "bg-muted text-foreground",
          className,
        )}
      >
        <Globe size={16} strokeWidth={1.75} />
        <span className="font-mono text-xs uppercase tracking-wide">{current?.code ?? code}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <NavTray align="start" role="listbox" aria-label={nav.languages.ariaLabel} className="w-44">
          {nav.languages.options.map((option) => {
            const selected = option.code === code;
            return (
              <NavTrayRow
                key={option.code}
                role="option"
                aria-selected={selected}
                active={selected}
                onClick={() => {
                  setCode(option.code);
                  setOpen(false);
                }}
              >
                <span className="w-7 font-mono text-xs text-muted-foreground">{option.code.toUpperCase()}</span>
                <span>{option.label}</span>
              </NavTrayRow>
            );
          })}
        </NavTray>
      )}
    </div>
  );
}
