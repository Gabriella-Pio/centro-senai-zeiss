"use client";

import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@cem/ui";
import { nav } from "@/copy/site";

interface LanguageSwitchProps {
  className?: string;
}

/** Só o controle visual. A troca real de idioma entra quando o copy estiver fechado. */
export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(nav.languages.defaultCode);
  const current = nav.languages.options.find((option) => option.code === code);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={nav.languages.ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors",
          className,
        )}
      >
        <Globe size={16} strokeWidth={1.75} />
        <span className="uppercase tracking-wide">{current?.code ?? code}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={nav.languages.ariaLabel}
          className="absolute top-full right-0 mt-1 min-w-44 overflow-hidden rounded-[var(--radius)] border border-border bg-popover py-1 shadow-2xl"
        >
          {nav.languages.options.map((option) => {
            const selected = option.code === code;
            return (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setCode(option.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full px-4 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "text-foreground bg-muted"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
