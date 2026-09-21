"use client";

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, Plus, TableProperties } from "lucide-react";
import { getMachineHourlyRate } from "@/lib/machine-tariff";
import { computeQuoteCost, formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";
import { MachineTariffPanel } from "./MachineTariffPanel";
import { TariffFleetOverview } from "./TariffFleetOverview";
import { AddMachineTariffDialog } from "./AddMachineTariffDialog";
import "./tariffs.css";
import "@/components/charts/charts.css";

export function TariffBoard({ canEdit }: { canEdit: boolean }) {
  const { vocabulary, labSettings, machineTariffs } = useDemoStore();
  const [selectedMachineId, setSelectedMachineId] = useState(machineTariffs[0]?.id ?? "");
  const [addMachineOpen, setAddMachineOpen] = useState(false);

  const selectedMachine = machineTariffs.find((tariff) => tariff.id === selectedMachineId) ?? machineTariffs[0];

  const example = useMemo(() => {
    const zre = machineTariffs.find((tariff) => tariff.id === "machine-zre");
    const machine = machineTariffs.find((tariff) => tariff.id === "machine-duramax");
    const resourceIds = [zre?.resourceId, machine?.resourceId].filter(Boolean) as string[];
    return computeQuoteCost({
      vocabulary,
      resourceIds: resourceIds.length > 0 ? resourceIds : ["vocab-19", "vocab-13"],
      teamHours: 2,
      equipmentHours: 8,
      labSettings,
    });
  }, [vocabulary, machineTariffs, labSettings]);

  const assetPicker = (
    <div className="tariffs-compare-grid" role="list" aria-label="Selecionar ativo">
      {machineTariffs.map((tariff) => {
        const selected = tariff.id === selectedMachine?.id;
        return (
          <button
            key={tariff.id}
            type="button"
            role="listitem"
            className={`tariffs-compare__card tariffs-compare__card--compact${selected ? " tariffs-compare__card--active" : ""}`}
            aria-pressed={selected}
            onClick={() => setSelectedMachineId(tariff.id)}
          >
            <span className="tariffs-compare__name">{tariff.label}</span>
            <span className="tariffs-compare__rate">{formatCurrency(getMachineHourlyRate(tariff))}/h</span>
          </button>
        );
      })}
      {canEdit ? (
        <button
          type="button"
          className="tariffs-compare__add tariffs-compare__add--compact"
          onClick={() => setAddMachineOpen(true)}
        >
          <span className="tariffs-compare__add-icon" aria-hidden="true">
            <Plus />
          </span>
          <span className="tariffs-compare__name">Novo ativo</span>
        </button>
      ) : null}
    </div>
  );

  return (
    <main className="tariffs-page">
      <header className="tariffs-page__header">
        <div>
          <p className="tariffs-page__eyebrow"><TableProperties aria-hidden="true" /> Planilha hora-máquina</p>
          <h1 className="tariffs-page__title">Folha de custos por máquina</h1>
          <p className="tariffs-page__intro">
            Equipamentos e softwares (ex.: ZRE) com planilha própria. Margem e mão de obra técnica ficam no Assistente.
            {canEdit ? " Alterações afetam apenas novos orçamentos — registros salvos mantêm o snapshot da tarifa vigente." : ""}
          </p>
        </div>
      </header>

      <TariffFleetOverview machineTariffs={machineTariffs} highlightId={selectedMachine?.id} />

      <section className="tariffs-workspace" aria-label="Planilhas por máquina">
        <section className="tariffs-workspace__assets" aria-label="Ativos do laboratório">
          <div className="tariffs-workspace__assets-head">
            <h2>Ativos do laboratório</h2>
            <p>Selecione um ativo para ver e editar a planilha hora-máquina.</p>
          </div>
          {assetPicker}
        </section>

        <div className="tariffs-workspace__detail">
          {canEdit ? (
            <AddMachineTariffDialog
              open={addMachineOpen}
              onOpenChange={setAddMachineOpen}
              existingLabels={machineTariffs.map((tariff) => tariff.label)}
              onCreated={setSelectedMachineId}
            />
          ) : null}

          <div className="tariffs-workspace__panel" id="tariff-detail-panel">
            {selectedMachine ? (
              <MachineTariffPanel tariff={selectedMachine} canEdit={canEdit} embedded />
            ) : (
              <p className="tariffs-workspace__empty">Cadastre ou selecione um ativo para editar a planilha.</p>
            )}
          </div>
        </div>
      </section>

      <details className="tariffs-card tariffs-card--example">
        <summary className="tariffs-card__summary">
          <span className="tariffs-card__summary-main">
            <span className="tariffs-card__chevron" aria-hidden="true">
              <ChevronDown />
            </span>
            <Calculator aria-hidden="true" />
            Exemplo de cálculo
          </span>
          <span className="tariffs-card__summary-hint">2 h ZRE + 8 h máquina + 2 h mão de obra técnica</span>
        </summary>
        <div className="tariffs-card__body">
          <table className="tariffs-example">
            <tbody>
              {example.lines.map((line) => (
                <tr key={line.id}>
                  <td className="tariffs-example__label">{line.label}</td>
                  <td className="tariffs-example__calc">{line.hours.toFixed(1)} h × {formatCurrency(line.rate)}/h</td>
                  <td className="tariffs-example__value">{formatCurrency(line.subtotal)}</td>
                </tr>
              ))}
              <tr className="tariffs-example__total">
                <td colSpan={2}>Custo estimado</td>
                <td className="tariffs-example__value">{formatCurrency(example.totalCost)}</td>
              </tr>
              <tr className="tariffs-example__price">
                <td colSpan={2}>Preço sugerido (margem {example.marginPercent}%)</td>
                <td className="tariffs-example__value">{formatCurrency(example.suggestedPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </main>
  );
}
