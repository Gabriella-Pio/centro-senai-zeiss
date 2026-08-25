"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, Logo } from "@cem/ui";
import { institutionalLinks } from "@/config/navigation";
import { services } from "@/data/home-content";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    // bg-background aponta para o mesmo token usado no <body> (globals.css),
    // então a navbar "acompanha" o fundo por definição — sem hex duplicado.
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-[96px] flex items-center justify-between">
        <Logo variant="nav" />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors">
              Serviços
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 overflow-hidden py-2 bg-popover border border-border shadow-2xl">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {institutionalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center">
          <Button size="lg" render={<Link href="/quote" />} className="px-6 h-11 text-sm">
            Solicitar Orçamento
          </Button>
        </div>

        {/* Mobile Trigger */}
        <button
          className="lg:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
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
          {institutionalLinks.map((link) => (
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
              render={<Link href="/quote" />}
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-sm"
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
