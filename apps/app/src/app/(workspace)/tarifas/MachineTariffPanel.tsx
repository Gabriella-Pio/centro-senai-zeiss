"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Label } from "@cem/ui";
import { updateDemoState, updateMachineTariffInputs } from "@/lib/demo-store";
import { MACHINE_EQUIPMENT_IMAGES } from "@/lib/machine-equipment-images";
import {
  FIXED_COST_ROWS,
  FINAL_COST_ROWS,
  INPUT_FIELD_HELP,
  VARIABLE_COST_ROWS,
} from "@/lib/machine-tariff-help";
import {
  computeMachineCost,
  type MachineCostComputed,
  type MachineCostInputs,
  type MachineTariff,
} from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";
import { Calculator } from "lucide-react";
import { TariffFieldHelp } from "./TariffFieldHelp";

type BasicTab = "acquisition" | "installation" | "operation" | "labor";

type FieldDef = { key: keyof MachineCostInputs; label: string; step?: string };

const BASIC_TABS: { id: BasicTab; label: string; fields: FieldDef[] }[] = [
  {
    id: "acquisition",
    label: "Aquisição",
    fields: [
      { key: "acquisitionCost", label: "Custo total de aquisição", step: "0.01" },
      { key: "usefulLifeYears", label: "Tempo de uso (anos)", step: "1" },
      { key: "inflationRate", label: "Taxa de inflação (%)", step: "0.01" },
      { key: "adoptedReplacementCost", label: "Custo de reposição adotado", step: "0.01" },
      { key: "interestRatePercent", label: "Taxa de juros por ano (%)", step: "0.01" },
    ],
  },
  {
    id: "installation",
    label: "Instalação",
    fields: [
      { key: "physicalSpaceSqm", label: "Espaço físico ocupado (m²)", step: "0.01" },
      { key: "rentPerSqmMonthly", label: "Aluguel do m² mensal", step: "0.01" },
      { key: "maintenancePercent", label: "Custo de manutenção (%)", step: "0.01" },
    ],
  },
  {
    id: "operation",
    label: "Operação",
    fields: [
      { key: "machinePowerKw", label: "Potência da máquina (kW)", step: "0.01" },
      { key: "operationTimePercent", label: "Tempo de operação (%)", step: "0.01" },
      { key: "electricityCostPerKwh", label: "Custo da energia elétrica", step: "0.0001" },
      { key: "toolingCostPerYear", label: "Custo de ferramental/ano", step: "0.01" },
    ],
  },
  {
    id: "labor",
    label: "Mão de obra",
    fields: [
      { key: "hourlySalary", label: "Salário hora dos turnos", step: "0.01" },
      { key: "variableSalaryHourly", label: "Salário hora nos custos variáveis", step: "0.01" },
      { key: "extraSalaryPercent", label: "Custos extras de salário (%)", step: "0.01" },
      { key: "administrativeOverheadPercent", label: "Overhead administrativo (%)", step: "0.01" },
      { key: "machineCount", label: "Total de máquinas", step: "1" },
      { key: "usefulHoursPerYear", label: "Horas úteis por ano", step: "1" },
    ],
  },
];

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
}

function formatComputedValue(value: number, hourly?: boolean) {
  const formatted = hourly ? `${formatCurrency(value)}/h` : formatCurrency(value);
  return formatted;
}

function ComputedTable({
  rows,
  computed,
}: {
  rows: typeof FIXED_COST_ROWS;
  computed: MachineCostComputed;
}) {
  return (
    <table className="machine-tariff-panel__table">
      <tbody>
        {rows.map((row) => {
          const value = COMPUTED_VALUE_MAP[row.id]?.(computed) ?? 0;
          return (
            <tr key={row.id} className={row.emphasize ? "machine-tariff-panel__table-row--emphasis" : undefined}>
              <td>
                <span className="machine-tariff-panel__row-label">
                  {row.label}
                  <TariffFieldHelp hint={row.hint} formula={row.formula} />
                </span>
                <span className="machine-tariff-panel__row-formula">{row.formula}</span>
              </td>
              <td>{formatComputedValue(value, row.hourly)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function FieldLabel({
  fieldKey,
  label,
}: {
  fieldKey: keyof MachineCostInputs;
  label: string;
}) {
  const help = INPUT_FIELD_HELP[fieldKey];
  return (
    <span className="machine-tariff-panel__field-label">
      <Label>{label}</Label>
      {help ? <TariffFieldHelp hint={help.hint} formula={help.formula} /> : null}
    </span>
  );
}

export function MachineTariffPanel({
  tariff,
  canEdit,
  embedded = false,
}: {
  tariff: MachineTariff;
  canEdit: boolean;
  embedded?: boolean;
}) {
  const { machineTariffs } = useDemoStore();
  const current = machineTariffs.find((item) => item.id === tariff.id) ?? tariff;
  const [draft, setDraft] = useState<MachineCostInputs | null>(null);
  const [basicTab, setBasicTab] = useState<BasicTab>("acquisition");
  const inputs = draft ?? current.inputs;
  const computed = useMemo(() => computeMachineCost(inputs), [inputs]);
  const equipmentImage = MACHINE_EQUIPMENT_IMAGES[current.id];
  const activeCategory = BASIC_TABS.find((tab) => tab.id === basicTab) ?? BASIC_TABS[0];

  useEffect(() => {
    setBasicTab("acquisition");
    setDraft(null);
  }, [current.id]);

  function updateField(key: keyof MachineCostInputs, raw: string) {
    setDraft({
      ...inputs,
      [key]: raw === "" ? undefined : Number(raw),
    } as MachineCostInputs);
  }

  function save() {
    if (!draft) return;
    updateDemoState((state) => updateMachineTariffInputs(state, tariff.id, draft));
    setDraft(null);
  }

  const hero = (
    <div className={`machine-tariff-hero${equipmentImage ? "" : " machine-tariff-hero--no-photo"}`}>
      {equipmentImage ? (
        <div className="machine-tariff-hero__visual" aria-hidden="true">
          <div className="machine-tariff-hero__photo-frame">
            <Image
              src={equipmentImage.src}
              alt={equipmentImage.alt}
              width={168}
              height={252}
              className="machine-tariff-hero__photo-img"
              priority
            />
          </div>
        </div>
      ) : null}
      <div className="machine-tariff-hero__content">
        <div className="machine-tariff-hero__heading">
          <p className="machine-tariff-hero__eyebrow">
            <Calculator aria-hidden="true" />
            Planilha hora-máquina
          </p>
          <h3 className="machine-tariff-hero__title">{current.label}</h3>
          <p className="machine-tariff-hero__subtitle">Item 1 editável · itens 2 e 3 calculados automaticamente</p>
        </div>
        <div className="machine-tariff-hero__rates">
          <div className="machine-tariff-hero__rate machine-tariff-hero__rate--primary">
            <span className="machine-tariff-hero__rate-label">
              Item 32 · Orçamentos
              <TariffFieldHelp
                hint="Tarifa usada nos orçamentos — inclui overhead administrativo."
                formula="Item 31 × (1 + overhead administrativo ÷ 100)"
              />
            </span>
            <strong>{formatCurrency(computed.costWithAdministrative)}/h</strong>
            <small>Usada nos orçamentos</small>
          </div>
          <div className="machine-tariff-hero__rate">
            <span className="machine-tariff-hero__rate-label">
              Item 31 · Operacional
              <TariffFieldHelp
                hint="Custo operacional completo no chão de fábrica."
                formula="Custo fixo/h + variáveis com salário/h"
              />
            </span>
            <strong>{formatCurrency(computed.costWithLabor)}/h</strong>
            <small>Com mão de obra</small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`machine-tariff-panel${embedded ? " machine-tariff-panel--embedded" : ""}`}>
      {hero}

      <div className="machine-tariff-panel__grid">
        <section className="machine-tariff-panel__section machine-tariff-panel__section--basic">
          <h4>1. Dados básicos</h4>
          <div className="machine-tariff-tabs" role="tablist" aria-label="Categorias dos dados básicos">
            {BASIC_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={basicTab === tab.id}
                className={`machine-tariff-tabs__btn${basicTab === tab.id ? " machine-tariff-tabs__btn--active" : ""}`}
                onClick={() => setBasicTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="machine-tariff-tabpanel" role="tabpanel">
            <div className="machine-tariff-panel__inputs">
              {activeCategory.fields.map((field) => (
                <div key={field.key}>
                  <FieldLabel fieldKey={field.key} label={field.label} />
                  <Input
                    type="number"
                    step={field.step}
                    disabled={!canEdit}
                    value={inputs[field.key] ?? ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="h-11"
                  />
                </div>
              ))}
              {basicTab === "acquisition" ? (
                <div>
                  <span className="machine-tariff-panel__field-label">
                    <Label>Custo de reposição teórico (calculado)</Label>
                    <TariffFieldHelp
                      hint="Estimativa de quanto custaria repor a máquina hoje, considerando inflação."
                      formula="Aquisição × (1 + inflação %)^vida útil"
                    />
                  </span>
                  <Input disabled value={formatNumber(computed.theoreticalReplacementCost)} className="h-11" />
                </div>
              ) : null}
            </div>
          </div>
          {canEdit && draft ? (
            <div className="machine-tariff-panel__actions">
              <Button type="button" onClick={save}>Salvar máquina</Button>
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>Descartar</Button>
            </div>
          ) : null}
        </section>

        <div className="machine-tariff-panel__computed">
          <section className="machine-tariff-panel__section">
            <h4>2. Custos fixos</h4>
            <ComputedTable rows={FIXED_COST_ROWS} computed={computed} />
          </section>

          <section className="machine-tariff-panel__section">
            <h4>3. Custos variáveis</h4>
            <ComputedTable rows={VARIABLE_COST_ROWS} computed={computed} />
          </section>
        </div>

        <section className="machine-tariff-panel__section machine-tariff-panel__section--final">
          <h4>4. Custo hora máquina</h4>
          <div className="machine-tariff-final">
            {FINAL_COST_ROWS.map((row) => {
              const value = COMPUTED_VALUE_MAP[row.id]?.(computed) ?? 0;
              const isHighlight = row.id === "withAdmin";
              return (
                <div key={row.id} className={isHighlight ? "machine-tariff-final__highlight" : undefined}>
                  <span className="machine-tariff-final__label">
                    {row.label}
                    <TariffFieldHelp hint={row.hint} formula={row.formula} />
                  </span>
                  <code className="machine-tariff-final__formula">{row.formula}</code>
                  <strong>{formatComputedValue(value, true)}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
