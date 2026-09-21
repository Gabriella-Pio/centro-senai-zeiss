"use client";

import {
  FIXED_COST_ROWS,
  FINAL_COST_ROWS,
  VARIABLE_COST_ROWS,
} from "@/lib/machine-tariff-help";
import type { MachineCostComputed } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";
import { TariffFieldHelp } from "./TariffFieldHelp";
import { TariffSection } from "./TariffSection";

const COMPUTED_VALUE_MAP: Record<string, (computed: MachineCostComputed) => number> = {
  depreciation: (c) => c.depreciationAnnual,
  interest: (c) => c.interestAnnual,
  space: (c) => c.spaceAnnual,
  maintenance: (c) => c.maintenanceAnnual,
  fixedAnnual: (c) => c.fixedCostAnnual,
  fixedHourly: (c) => c.fixedCostHourly,
  energy: (c) => c.energyHourly,
  tooling: (c) => c.toolingHourly,
  salary: (c) => c.salaryHourly,
  extraSalary: (c) => c.extraSalaryHourly,
  variableWithout: (c) => c.variableWithoutSalary,
  variableWith: (c) => c.variableWithSalary,
  withoutLabor: (c) => c.costWithoutLabor,
  withLabor: (c) => c.costWithLabor,
  withAdmin: (c) => c.costWithAdministrative,
};

function formatComputedValue(value: number, hourly?: boolean) {
  return hourly ? `${formatCurrency(value)}/h` : formatCurrency(value);
}

function ComputedTable({
  rows,
  computed,
}: {
  rows: typeof FIXED_COST_ROWS;
  computed: MachineCostComputed;
}) {
  return (
    <table className="machine-tariff-panel__table" aria-label="Custos calculados">
      <caption className="sr-only">Valores calculados automaticamente a partir dos dados da planilha</caption>
      <tbody>
        {rows.map((row) => {
          const value = COMPUTED_VALUE_MAP[row.id]?.(computed) ?? 0;
          return (
            <tr key={row.id} className={row.emphasize ? "machine-tariff-panel__table-row--emphasis" : undefined}>
              <th scope="row">
                <span className="machine-tariff-panel__row-label">
                  {row.label}
                  <TariffFieldHelp label={row.label} hint={row.hint} formula={row.formula} />
                </span>
                <span className="machine-tariff-panel__row-formula">{row.formula}</span>
              </th>
              <td>{formatComputedValue(value, row.hourly)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

type PanelSection = "fixed" | "variable" | "final";

export function MachineTariffComputedSections({
  computed,
  openSections,
  onToggleSection,
}: {
  computed: MachineCostComputed;
  openSections: Record<PanelSection, boolean>;
  onToggleSection: (section: PanelSection) => void;
}) {
  return (
    <>
      <TariffSection
        id="tariff-section-fixed"
        title="2. Custos fixos"
        badge={formatComputedValue(computed.fixedCostHourly, true)}
        open={openSections.fixed}
        onToggle={() => onToggleSection("fixed")}
      >
        <ComputedTable rows={FIXED_COST_ROWS} computed={computed} />
      </TariffSection>

      <TariffSection
        id="tariff-section-variable"
        title="3. Custos variáveis"
        badge={formatComputedValue(computed.variableWithSalary, true)}
        open={openSections.variable}
        onToggle={() => onToggleSection("variable")}
      >
        <ComputedTable rows={VARIABLE_COST_ROWS} computed={computed} />
      </TariffSection>

      <TariffSection
        id="tariff-section-final"
        title="4. Custo hora máquina"
        badge={formatComputedValue(computed.costWithAdministrative, true)}
        open={openSections.final}
        onToggle={() => onToggleSection("final")}
        variant="highlight"
      >
        <div className="machine-tariff-final">
          {FINAL_COST_ROWS.map((row) => {
            const value = COMPUTED_VALUE_MAP[row.id]?.(computed) ?? 0;
            const isHighlight = row.id === "withAdmin";
            return (
              <div key={row.id} className={isHighlight ? "machine-tariff-final__highlight" : undefined}>
                <span className="machine-tariff-final__label">
                  {row.label}
                  <TariffFieldHelp label={row.label} hint={row.hint} formula={row.formula} />
                </span>
                <code className="machine-tariff-final__formula">{row.formula}</code>
                <strong>{formatComputedValue(value, true)}</strong>
              </div>
            );
          })}
        </div>
      </TariffSection>
    </>
  );
}

export type { PanelSection };
