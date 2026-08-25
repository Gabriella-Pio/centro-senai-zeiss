"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { institutionalLinks } from "@/config/navigation";
import { services } from "@/data/home-content";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground/70 border-t border-border">
      {/* Bloco editorial — chamada grande, no espírito do "Get in touch" da
          referência. Usa o token --text-display-md (fluido) em vez de uma
          classe fixa, então escala junto com o hero. */}
      <Container className="pt-24 md:pt-32 pb-16">
        <a
          href="/contact"
          className="group flex items-baseline gap-4 md:gap-6 text-display-md leading-[1.05] font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          Fale conosco
          <span className="hidden sm:inline text-accent/60">/</span>
          <span className="hidden sm:inline">Get in touch</span>
        </a>
      </Container>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 pt-4 border-t border-border relative">
          {/* Coluna 1: Identidade */}
          <div className="md:col-span-1 space-y-4">
            <Logo variant="footer" />
            <p className="text-xs text-foreground/50 leading-relaxed max-w-xs">
              Centro de Excelência em Metrologia de Alta Precisão, localizado
              no SENAI Ítalo Bologna (Goiânia/GO).
            </p>
          </div>

          {/* Coluna 2: Visite-nos */}
          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              Visite-nos
            </h4>
            <p className="text-xs leading-relaxed">
              SENAI Ítalo Bologna
              <br />
              Goiânia, GO
            </p>
          </div>

          {/* Coluna 3: Serviços — mesma fonte de dados usada na Navbar */}
          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              Serviços
            </h4>
            <ul className="space-y-3 text-xs">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.id}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Institucional */}
          <div>
            <h4 className="text-foreground text-xs font-bold mb-5 tracking-widest uppercase">
              Institucional
            </h4>
            <ul className="space-y-3 text-xs">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#top"
            aria-label="Voltar ao topo"
            className="hidden md:flex absolute right-0 -top-2 items-center justify-center w-11 h-11 rounded-full border border-border text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <ArrowUp size={18} />
          </a>
        </div>

        <div className="pt-8 pb-10 flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/40 gap-4 border-t border-border">
          <p>© 2026 Centro de Excelência em Metrologia SENAI × ZEISS. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Política de Privacidade</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
