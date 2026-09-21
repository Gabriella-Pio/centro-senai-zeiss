"use client";

import { useCallback } from "react";
import { Button, Input, Label } from "@cem/ui";
import { INPUT_FIELD_HELP } from "@/lib/machine-tariff-help";
import type { MachineCostComputed, MachineCostInputs } from "@/lib/machine-tariff";
import type { MachineInputErrors } from "@/lib/machine-tariff-validation";
import { hasValidationErrors } from "@/lib/machine-tariff-validation";
import { TariffFieldHelp } from "./TariffFieldHelp";
import { TariffSection } from "./TariffSection";

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
}

function FieldLabel({
  fieldKey,
  label,
}: {
  fieldKey: keyof MachineCostInputs;
  label: string;
}) {
  const help = INPUT_FIELD_HELP[fieldKey];
  const fieldId = `tariff-field-${fieldKey}`;
  return (
    <span className="machine-tariff-panel__field-label">
      <Label htmlFor={fieldId}>{label}</Label>
      {help ? (
        <TariffFieldHelp
          fieldId={fieldId}
          label={label}
          hint={help.hint}
          formula={help.formula}
        />
      ) : null}
    </span>
  );
}

export function MachineTariffBasicForm({
  inputs,
  computed,
  canEdit,
  hasDraft,
  basicTab,
  onBasicTabChange,
  open,
  onToggle,
  onFieldChange,
  onSave,
  onDiscard,
  validationErrors = {},
  invalidTabs = new Set<string>(),
}: {
  inputs: MachineCostInputs;
  computed: MachineCostComputed;
  canEdit: boolean;
  hasDraft: boolean;
  basicTab: BasicTab;
  onBasicTabChange: (tab: BasicTab) => void;
  open: boolean;
  onToggle: () => void;
  onFieldChange: (key: keyof MachineCostInputs, raw: string) => void;
  onSave: () => void;
  onDiscard: () => void;
  validationErrors?: MachineInputErrors;
  invalidTabs?: Set<string>;
}) {
  const activeCategory = BASIC_TABS.find((tab) => tab.id === basicTab) ?? BASIC_TABS[0];

  const onTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + delta + BASIC_TABS.length) % BASIC_TABS.length;
      onBasicTabChange(BASIC_TABS[next].id);
    },
    [onBasicTabChange],
  );

  return (
    <TariffSection
      id="tariff-section-basic"
      title="1. Dados básicos"
      badge="Editável"
      open={open}
      onToggle={onToggle}
    >
      <div className="machine-tariff-tabs" role="tablist" aria-label="Categorias dos dados básicos">
        {BASIC_TABS.map((tab, index) => {
          const selected = basicTab === tab.id;
          const tabId = `machine-tariff-tab-${tab.id}`;
          const panelId = `machine-tariff-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={`machine-tariff-tabs__btn${selected ? " machine-tariff-tabs__btn--active" : ""}${invalidTabs.has(tab.id) ? " machine-tariff-tabs__btn--error" : ""}`}
              onClick={() => onBasicTabChange(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`machine-tariff-panel-${basicTab}`}
        className="machine-tariff-tabpanel"
        role="tabpanel"
        aria-labelledby={`machine-tariff-tab-${basicTab}`}
      >
        <div className="machine-tariff-panel__inputs">
          {activeCategory.fields.map((field) => {
            const fieldError = validationErrors[field.key];
            return (
              <div key={field.key}>
                <FieldLabel fieldKey={field.key} label={field.label} />
                <Input
                  id={`tariff-field-${field.key}`}
                  type="number"
                  step={field.step}
                  disabled={!canEdit}
                  value={inputs[field.key] ?? ""}
                  onChange={(event) => onFieldChange(field.key, event.target.value)}
                  className="h-11"
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={`tariff-field-help-${field.key}`}
                />
                {fieldError ? <p className="machine-tariff-panel__field-error" role="alert">{fieldError}</p> : null}
              </div>
            );
          })}
          {basicTab === "acquisition" ? (
            <div>
              <span className="machine-tariff-panel__field-label">
                <Label htmlFor="tariff-field-theoretical">Custo de reposição teórico (calculado)</Label>
                <TariffFieldHelp
                  fieldId="tariff-field-theoretical"
                  label="Custo de reposição teórico"
                  hint="Estimativa de quanto custaria repor a máquina hoje, considerando inflação."
                  formula="Aquisição × (1 + inflação %)^vida útil"
                />
              </span>
              <Input
                id="tariff-field-theoretical"
                disabled
                value={formatNumber(computed.theoreticalReplacementCost)}
                className="h-11"
              />
            </div>
          ) : null}
        </div>
      </div>
      {canEdit && hasDraft ? (
        <div className="machine-tariff-panel__actions">
          <Button type="button" onClick={onSave} disabled={hasValidationErrors(validationErrors)}>
            Salvar planilha
          </Button>
          <Button type="button" variant="outline" onClick={onDiscard}>Descartar</Button>
        </div>
      ) : null}
    </TariffSection>
  );
}

export type { BasicTab };
