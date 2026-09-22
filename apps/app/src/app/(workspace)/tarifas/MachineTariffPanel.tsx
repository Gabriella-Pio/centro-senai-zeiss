"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@cem/ui";
import { restoreMachineTariff, updateDemoState, updateMachineTariffInputs } from "@/lib/demo/demo-store";
import { MACHINE_EQUIPMENT_IMAGES } from "@/lib/machine-equipment-images";
import {
  computeMachineCost,
  type MachineCostInputs,
  type MachineTariff,
} from "@/lib/machine-tariff";
import {
  filterActiveTariffs,
  isMachineTariffActive,
} from "@/lib/machine-tariff-utils";
import {
  hasValidationErrors,
  tabsWithErrors,
  validateMachineInputs,
} from "@/lib/machine-tariff-validation";
import { useDemoStore } from "@/lib/use-demo-store";
import { BarChart3, ChevronDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { MachineTariffBasicForm, type BasicTab } from "./MachineTariffBasicForm";
import { MachineTariffComputedSections, type PanelSection } from "./MachineTariffComputedSections";
import { MachineTariffHero } from "./MachineTariffHero";
import { useTariffSectionNav } from "@/lib/use-tariff-section-nav";
import { TariffAssetAnalysis } from "./TariffAssetAnalysis";

type SectionKey = "basic" | PanelSection | "analysis";

const PANEL_SECTIONS: SectionKey[] = ["basic", "fixed", "variable", "final"];

const DEFAULT_OPEN: Record<SectionKey, boolean> = {
  basic: true,
  fixed: false,
  variable: false,
  final: false,
  analysis: false,
};

/** Ordem no DOM — usada pelo scroll spy. */
const PANEL_SECTION_IDS = [
  "tariff-section-analysis",
  "tariff-section-basic",
  "tariff-section-fixed",
  "tariff-section-variable",
  "tariff-section-final",
] as const;

const JUMP_LINKS: { id: string; label: string; section: SectionKey }[] = [
  { id: "tariff-section-analysis", label: "Análise", section: "analysis" },
  { id: "tariff-section-basic", label: "Dados", section: "basic" },
  { id: "tariff-section-fixed", label: "Fixos", section: "fixed" },
  { id: "tariff-section-variable", label: "Variáveis", section: "variable" },
  { id: "tariff-section-final", label: "Custo hora/maq", section: "final" },
];

export function MachineTariffPanel({
  tariff,
  canEdit,
  onDraftChange,
  onArchived,
  onDeleted,
  onDuplicated,
  onVocabularyNavigate,
}: {
  tariff: MachineTariff;
  canEdit: boolean;
  onDraftChange?: (hasDraft: boolean) => void;
  onArchived?: () => void;
  onDeleted?: () => void;
  onDuplicated?: (tariffId: string) => void;
  onVocabularyNavigate?: () => void;
}) {
  const { machineTariffs } = useDemoStore();
  const current = machineTariffs.find((item) => item.id === tariff.id) ?? tariff;
  const [draft, setDraft] = useState<MachineCostInputs | null>(null);
  const [basicTab, setBasicTab] = useState<BasicTab>("acquisition");
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(DEFAULT_OPEN);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [undoInputs, setUndoInputs] = useState<MachineCostInputs | null>(null);
  const analysisRef = useRef<HTMLDetailsElement>(null);
  const { activeId: activeJumpId, scrollToSection } = useTariffSectionNav(PANEL_SECTION_IDS);
  const inputs = draft ?? current.inputs;
  const computed = useMemo(() => computeMachineCost(inputs), [inputs]);
  const equipmentImage = MACHINE_EQUIPMENT_IMAGES[current.id];
  const hasDraft = draft !== null;
  const isArchived = !isMachineTariffActive(current);
  const canEditPanel = canEdit && !isArchived;
  const validationErrors = useMemo(() => validateMachineInputs(inputs), [inputs]);
  const invalidTabs = useMemo(() => tabsWithErrors(validationErrors), [validationErrors]);
  const activeFleet = useMemo(() => filterActiveTariffs(machineTariffs), [machineTariffs]);

  useEffect(() => {
    onDraftChange?.(hasDraft);
  }, [hasDraft, onDraftChange]);

  useEffect(() => {
    setBasicTab("acquisition");
    setDraft(null);
    setOpenSections(DEFAULT_OPEN);
    setSavedMessage(null);
    setUndoInputs(null);
  }, [current.id]);

  useEffect(() => {
    if (!savedMessage) return;
    const timer = window.setTimeout(() => {
      setSavedMessage(null);
      setUndoInputs(null);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [savedMessage]);

  useEffect(() => {
    if (!hasDraft) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasDraft]);

  const allExpanded = PANEL_SECTIONS.every((section) => openSections[section]);

  function toggleSection(section: SectionKey) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function setAllSections(open: boolean) {
    setOpenSections(
      PANEL_SECTIONS.reduce(
        (acc, section) => ({ ...acc, [section]: open }),
        {} as Record<SectionKey, boolean>,
      ),
    );
    if (analysisRef.current) {
      analysisRef.current.open = open;
    }
  }

  function updateField(key: keyof MachineCostInputs, raw: string) {
    setDraft({
      ...inputs,
      [key]: raw === "" ? undefined : Number(raw),
    } as MachineCostInputs);
  }

  function save() {
    if (!draft || hasValidationErrors(validationErrors)) return;
    const previous = current.inputs;
    updateDemoState((state) => updateMachineTariffInputs(state, tariff.id, draft));
    setDraft(null);
    setUndoInputs(previous);
    setSavedMessage("Planilha salva");
  }

  function undoSave() {
    if (!undoInputs) return;
    updateDemoState((state) => updateMachineTariffInputs(state, tariff.id, undoInputs));
    setUndoInputs(null);
    setSavedMessage(null);
  }

  function restoreAsset() {
    updateDemoState((state) => restoreMachineTariff(state, tariff.id));
  }

  function jumpToSection(sectionId: string, section: SectionKey) {
    if (section === "analysis") {
      if (analysisRef.current) analysisRef.current.open = true;
    } else {
      setOpenSections((prev) => ({ ...prev, [section]: true }));
    }

    requestAnimationFrame(() => {
      scrollToSection(sectionId);
    });
  }

  return (
    <div className="machine-tariff-panel machine-tariff-panel--embedded">
      <nav className="tariffs-segmented-bar tariffs-segmented-bar--panel" aria-label="Ir para seção da planilha">
        <span className="tariffs-segmented-bar__label">Seções</span>
        <div className="tariffs-segmented-bar__track machine-tariff-panel__jump-nav">
          {JUMP_LINKS.map((link) => {
            const active = activeJumpId === link.id;
            return (
              <button
                key={link.id}
                type="button"
                className={`machine-tariff-panel__jump-link${active ? " machine-tariff-panel__jump-link--active" : ""}`}
                onClick={() => jumpToSection(link.id, link.section)}
                aria-current={active ? "location" : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </nav>

      <MachineTariffHero
        tariff={current}
        computed={computed}
        equipmentImage={equipmentImage}
        hasDraft={hasDraft}
        savedMessage={savedMessage}
        canEdit={canEdit}
        canUndo={Boolean(undoInputs)}
        onUndo={undoSave}
        onArchived={onArchived}
        onDeleted={onDeleted}
        onDuplicated={onDuplicated}
        onRestore={restoreAsset}
        onVocabularyNavigate={onVocabularyNavigate}
      />

      <details ref={analysisRef} className="tariffs-card tariffs-card--analysis" id="tariff-section-analysis">
        <summary className="tariffs-card__summary">
          <span className="tariffs-card__summary-main">
            <span className="tariffs-card__chevron" aria-hidden="true">
              <ChevronDown />
            </span>
            <BarChart3 aria-hidden="true" />
            Análise do ativo · {current.label}
          </span>
          <span className="tariffs-card__summary-hint">
            Composição da tarifa e dos custos fixos
          </span>
        </summary>
        <div className="tariffs-card__body machine-tariff-panel__analysis">
          <TariffAssetAnalysis
            computed={computed}
            inputs={inputs}
            machineId={current.id}
            machineLabel={current.label}
            fleet={activeFleet.length > 0 ? activeFleet : machineTariffs}
          />
        </div>
      </details>

      <div className="machine-tariff-panel__sections-toolbar">
        <Button
          type="button"
          className="machine-tariff-panel__expand-btn"
          onClick={() => setAllSections(!allExpanded)}
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp aria-hidden="true" />
              Recolher todas
            </>
          ) : (
            <>
              <ChevronsUpDown aria-hidden="true" />
              Expandir todas
            </>
          )}
        </Button>
      </div>

      <div className="machine-tariff-panel__sections">
        <MachineTariffBasicForm
          inputs={inputs}
          computed={computed}
          canEdit={canEditPanel}
          hasDraft={hasDraft}
          basicTab={basicTab}
          onBasicTabChange={setBasicTab}
          open={openSections.basic}
          onToggle={() => toggleSection("basic")}
          onFieldChange={updateField}
          onSave={save}
          onDiscard={() => setDraft(null)}
          validationErrors={validationErrors}
          invalidTabs={invalidTabs}
        />

        <MachineTariffComputedSections
          computed={computed}
          openSections={{
            fixed: openSections.fixed,
            variable: openSections.variable,
            final: openSections.final,
          }}
          onToggleSection={(section) => toggleSection(section)}
        />
      </div>
    </div>
  );
}
