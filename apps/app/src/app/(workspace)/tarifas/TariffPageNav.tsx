"use client";

import { BarChart3, Calculator, LayoutGrid, TableProperties } from "lucide-react";
import { useTariffSectionNav } from "@/lib/use-tariff-section-nav";

const SECTIONS = [
  { id: "tariff-fleet-overview", label: "Comparativo geral", icon: BarChart3 },
  { id: "tariff-asset-picker", label: "Ativos", icon: LayoutGrid },
  { id: "tariff-detail-panel", label: "Planilha", icon: TableProperties },
  { id: "tariff-example", label: "Exemplo", icon: Calculator },
] as const;

const PAGE_SECTION_IDS = SECTIONS.map((section) => section.id);

export function TariffPageNav({ onNavigate }: { onNavigate?: () => boolean }) {
  const { activeId, scrollToSection } = useTariffSectionNav(PAGE_SECTION_IDS);

  function handleNavigate(id: string) {
    if (onNavigate && !onNavigate()) return;
    scrollToSection(id);
  }

  return (
    <nav className="tariffs-page-nav" aria-label="Navegação da página de tarifas">
      <span className="tariffs-page-nav__label">Navegar</span>
      <div className="tariffs-page-nav__inner">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const active = activeId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              className={`tariffs-page-nav__link${active ? " tariffs-page-nav__link--active" : ""}`}
              onClick={() => handleNavigate(section.id)}
              aria-current={active ? "location" : undefined}
            >
              <Icon aria-hidden="true" />
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
