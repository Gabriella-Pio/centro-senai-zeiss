"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calculator, ChevronDown, MousePointerClick, TableProperties } from "lucide-react";
import { getMachineHourlyRate } from "@/lib/machine-tariff";
import {
  confirmDiscardDraft,
  filterActiveTariffs,
  filterTariffsByStatus,
  guardTariffDraft,
  isMachineTariffActive,
  type TariffAssetFilter,
} from "@/lib/machine-tariff-utils";
import { computeQuoteCost, formatCurrency } from "@/lib/pricing";
import { scrollToTariffSection } from "@/lib/tariff-scroll";
import { useDemoStore } from "@/lib/use-demo-store";
import { MachineTariffPanel } from "./MachineTariffPanel";
import { TariffFleetOverview } from "./TariffFleetOverview";
import { AddMachineTariffDialog } from "./AddMachineTariffDialog";
import { TariffAssetPicker } from "./TariffAssetPicker";
import { TariffPageNav } from "./TariffPageNav";
import { TariffEmptyState } from "./TariffEmptyState";
import "./tariffs.css";
import "@/components/charts/charts.css";

export function TariffBoard({ canEdit }: { canEdit: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { vocabulary, labSettings, machineTariffs } = useDemoStore();
  const activeTariffs = useMemo(() => filterActiveTariffs(machineTariffs), [machineTariffs]);
  const [selectedMachineId, setSelectedMachineId] = useState(activeTariffs[0]?.id ?? machineTariffs[0]?.id ?? "");
  const [addMachineOpen, setAddMachineOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [assetFilter, setAssetFilter] = useState<TariffAssetFilter>("active");
  const [includeArchivedInFleet, setIncludeArchivedInFleet] = useState(false);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const syncAtivoParam = useCallback(
    (tariffId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tariffId) {
        if (params.get("ativo") === tariffId) return;
        params.set("ativo", tariffId);
      } else {
        if (!params.has("ativo")) return;
        params.delete("ativo");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const ativoParam = searchParams.get("ativo");
    if (!ativoParam) return;
    const match = machineTariffs.find((tariff) => tariff.id === ativoParam);
    if (!match || match.id === selectedMachineId) return;
    if (!isMachineTariffActive(match)) {
      setAssetFilter("all");
    }
    setSelectedMachineId(match.id);
  }, [searchParams, machineTariffs, selectedMachineId]);

  const visibleTariffs = useMemo(
    () => filterTariffsByStatus(machineTariffs, assetFilter),
    [assetFilter, machineTariffs],
  );

  const selectedMachine =
    machineTariffs.find((tariff) => tariff.id === selectedMachineId) ??
    visibleTariffs[0] ??
    activeTariffs[0];

  useEffect(() => {
    if (!selectedMachine) return;
    if (assetFilter === "active" && !isMachineTariffActive(selectedMachine)) {
      const nextId = activeTariffs[0]?.id ?? "";
      setSelectedMachineId(nextId);
      syncAtivoParam(nextId || null);
    }
  }, [assetFilter, selectedMachine, activeTariffs, syncAtivoParam]);

  const fleetTariffs = useMemo(
    () => (includeArchivedInFleet ? machineTariffs : activeTariffs),
    [includeArchivedInFleet, machineTariffs, activeTariffs],
  );

  const example = useMemo(() => {
    const withResource = activeTariffs.filter((tariff) => tariff.resourceId);
    const first = withResource[0];
    const second = withResource[1];
    const resourceIds = [first?.resourceId, second?.resourceId].filter(Boolean) as string[];
    const fallbackZre = machineTariffs.find((tariff) => tariff.id === "machine-zre");
    const fallbackMachine = machineTariffs.find((tariff) => tariff.id === "machine-duramax");
    const resolvedIds =
      resourceIds.length > 0
        ? resourceIds
        : [fallbackZre?.resourceId, fallbackMachine?.resourceId].filter(Boolean) as string[];

    return computeQuoteCost({
      vocabulary,
      resourceIds: resolvedIds.length > 0 ? resolvedIds : ["vocab-19", "vocab-13"],
      teamHours: 2,
      equipmentHours: 8,
      labSettings,
    });
  }, [vocabulary, activeTariffs, machineTariffs, labSettings]);

  const exampleHint = useMemo(() => {
    const withResource = activeTariffs.filter((tariff) => tariff.resourceId);
    const first = withResource[0]?.label ?? "ZRE";
    const second = withResource[1]?.label ?? "ativo";
    return `2 h ${first} + 8 h ${second} + 2 h mão de obra técnica`;
  }, [activeTariffs]);

  const focusDetailPanel = useCallback(() => {
    requestAnimationFrame(() => {
      scrollToTariffSection("tariff-detail-panel");
      detailPanelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const guardDraft = useCallback(
    (action: () => void) => guardTariffDraft(hasDraft, action),
    [hasDraft],
  );

  const applySelection = useCallback(
    (tariffId: string, options?: { scroll?: boolean }) => {
      const match = machineTariffs.find((tariff) => tariff.id === tariffId);
      if (match && !isMachineTariffActive(match)) {
        setAssetFilter("all");
      }
      setSelectedMachineId(tariffId);
      syncAtivoParam(tariffId);
      if (options?.scroll) focusDetailPanel();
    },
    [focusDetailPanel, machineTariffs, syncAtivoParam],
  );

  const selectMachine = useCallback(
    (tariffId: string) => {
      if (tariffId === selectedMachineId) return;
      guardDraft(() => applySelection(tariffId, { scroll: true }));
    },
    [applySelection, guardDraft, selectedMachineId],
  );

  const handleArchived = useCallback(() => {
    const remaining = activeTariffs.filter((tariff) => tariff.id !== selectedMachineId);
    const nextId = remaining[0]?.id ?? "";
    setSelectedMachineId(nextId);
    syncAtivoParam(nextId || null);
  }, [activeTariffs, selectedMachineId, syncAtivoParam]);

  const handleDeleted = useCallback(() => {
    const next = activeTariffs.find((tariff) => tariff.id !== selectedMachineId);
    const nextId = next?.id ?? "";
    setSelectedMachineId(nextId);
    syncAtivoParam(nextId || null);
  }, [activeTariffs, selectedMachineId, syncAtivoParam]);

  const handleDuplicated = useCallback(
    (tariffId: string) => {
      setAssetFilter("active");
      applySelection(tariffId, { scroll: true });
    },
    [applySelection],
  );

  const handleAssetFilterChange = useCallback(
    (filter: TariffAssetFilter) => {
      if (filter === assetFilter) return;
      guardDraft(() => setAssetFilter(filter));
    },
    [assetFilter, guardDraft],
  );

  const handleVocabularyNavigate = useCallback(() => {
    guardDraft(() => router.push("/vocabulario"));
  }, [guardDraft, router]);

  const guardNavigation = useCallback(() => confirmDiscardDraft(hasDraft), [hasDraft]);

  return (
    <main className="tariffs-page">
      <header className="tariffs-page__header">
        <div>
          <p className="tariffs-page__eyebrow"><TableProperties aria-hidden="true" /> Planilha hora-máquina</p>
          <h1 className="tariffs-page__title">Folha de custos por ativo</h1>
          <p className="tariffs-page__intro">
            Ativos do laboratório (equipamentos e softwares) com planilha própria. Margem e mão de obra técnica ficam no Assistente.
            {canEdit ? " Alterações afetam apenas novos orçamentos — registros salvos mantêm o snapshot da tarifa vigente." : ""}
          </p>
        </div>
      </header>

      <TariffPageNav onNavigate={guardNavigation} />

      <TariffFleetOverview
        machineTariffs={fleetTariffs}
        highlightId={selectedMachine?.id}
        canEdit={canEdit}
        onAddMachine={() => setAddMachineOpen(true)}
        onMachineSelect={selectMachine}
        includeArchived={includeArchivedInFleet}
        onIncludeArchivedChange={setIncludeArchivedInFleet}
        hasArchived={machineTariffs.some((tariff) => !isMachineTariffActive(tariff))}
      />

      <section className="tariffs-workspace" aria-label="Editar planilha">
        {selectedMachine ? (
          <div className="tariffs-workspace__sticky-label" role="status" aria-live="polite">
            Editando: <strong>{selectedMachine.label}</strong>
            <span> · Custo hora/maq: {formatCurrency(getMachineHourlyRate(selectedMachine))}/h</span>
          </div>
        ) : null}

        <section className="tariffs-workspace__assets" aria-label="Ativos do laboratório">
          <div className="tariffs-workspace__assets-head">
            <h2>Ativos do laboratório</h2>
            <p>Selecione um ativo para ver e editar a planilha hora-máquina.</p>
          </div>
          <TariffAssetPicker
            machineTariffs={machineTariffs}
            selectedId={selectedMachine?.id}
            canEdit={canEdit}
            assetFilter={assetFilter}
            onAssetFilterChange={handleAssetFilterChange}
            onSelect={selectMachine}
            onAddMachine={() => setAddMachineOpen(true)}
          />
        </section>

        <div className="tariffs-workspace__detail">
          {canEdit ? (
            <AddMachineTariffDialog
              open={addMachineOpen}
              onOpenChange={setAddMachineOpen}
              existingLabels={activeTariffs.map((tariff) => tariff.label)}
              onCreated={(tariffId) => {
                setAssetFilter("active");
                applySelection(tariffId, { scroll: true });
              }}
            />
          ) : null}

          <div
            className="tariffs-workspace__panel"
            id="tariff-detail-panel"
            ref={detailPanelRef}
            tabIndex={-1}
          >
            {selectedMachine ? (
              <MachineTariffPanel
                key={selectedMachine.id}
                tariff={selectedMachine}
                canEdit={canEdit}
                onDraftChange={setHasDraft}
                onArchived={handleArchived}
                onDeleted={handleDeleted}
                onDuplicated={handleDuplicated}
                onVocabularyNavigate={handleVocabularyNavigate}
              />
            ) : (
              <TariffEmptyState
                className="tariffs-empty-state--panel"
                icon={MousePointerClick}
                title="Selecione um ativo"
                description="Escolha um ativo na grade acima para visualizar e editar a planilha hora-máquina."
              />
            )}
          </div>
        </div>
      </section>

      <details className="tariffs-card tariffs-card--example" id="tariff-example">
        <summary className="tariffs-card__summary">
          <span className="tariffs-card__summary-main">
            <span className="tariffs-card__chevron" aria-hidden="true">
              <ChevronDown />
            </span>
            <Calculator aria-hidden="true" />
            Exemplo de cálculo
          </span>
          <span className="tariffs-card__summary-hint">{exampleHint}</span>
        </summary>
        <div className="tariffs-card__body">
          <table className="tariffs-example" aria-label="Exemplo de cálculo de orçamento">
            <caption className="sr-only">Composição do exemplo de orçamento com tarifas dos ativos</caption>
            <tbody>
              {example.lines.map((line) => (
                <tr key={line.id}>
                  <th scope="row" className="tariffs-example__label">{line.label}</th>
                  <td className="tariffs-example__calc">{line.hours.toFixed(1)} h × {formatCurrency(line.rate)}/h</td>
                  <td className="tariffs-example__value">{formatCurrency(line.subtotal)}</td>
                </tr>
              ))}
              <tr className="tariffs-example__total">
                <th scope="row" colSpan={2}>Custo estimado</th>
                <td className="tariffs-example__value">{formatCurrency(example.totalCost)}</td>
              </tr>
              <tr className="tariffs-example__price">
                <th scope="row" colSpan={2}>Preço sugerido (margem {example.marginPercent}%)</th>
                <td className="tariffs-example__value">{formatCurrency(example.suggestedPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </main>
  );
}
