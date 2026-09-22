"use client";

import { useState } from "react";
import { Button, Input, Label } from "@cem/ui";
import { updateDemoState } from "@/lib/demo/demo-store";
import type { LabSettings } from "@/lib/demo-store-types";
import { useDemoStore } from "@/lib/use-demo-store";
import "./lab-settings.css";

export function LabSettingsPanel({ canEdit }: { canEdit: boolean }) {
  const { labSettings } = useDemoStore();
  const [draft, setDraft] = useState<LabSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const settings = draft ?? labSettings;

  function save() {
    if (!draft) return;
    updateDemoState((state) => ({
      ...state,
      labSettings: {
        ...state.labSettings,
        tariffTableLabel: draft.tariffTableLabel.trim() || state.labSettings.tariffTableLabel,
        teamHourlyRate: Number(draft.teamHourlyRate) || state.labSettings.teamHourlyRate,
        targetMarginPercent: Number(draft.targetMarginPercent) || state.labSettings.targetMarginPercent,
      },
    }));
    setDraft(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="lab-settings" aria-labelledby="lab-settings-heading">
      <div className="lab-settings__head">
        <h2 id="lab-settings-heading">Parâmetros de orçamento</h2>
        <p>
          Margem e tarifa de mão de obra técnica aplicadas no Assistente. Recursos com planilha (máquinas, ZRE etc.)
          usam a tarifa calculada em <a href="/tarifas">Tarifas</a>.
        </p>
      </div>
      <div className="lab-settings__grid">
        <div>
          <Label htmlFor="lab-tariff-label">Referência da planilha</Label>
          <Input
            id="lab-tariff-label"
            disabled={!canEdit}
            value={settings.tariffTableLabel}
            onChange={(event) => setDraft({ ...settings, tariffTableLabel: event.target.value })}
            className="h-11"
          />
        </div>
        <div>
          <Label htmlFor="lab-team-rate">Mão de obra técnica (R$/h)</Label>
          <Input
            id="lab-team-rate"
            type="number"
            min="0"
            disabled={!canEdit}
            value={settings.teamHourlyRate}
            onChange={(event) => setDraft({ ...settings, teamHourlyRate: Number(event.target.value) })}
            className="h-11"
          />
          <p className="lab-settings__hint">Horas fora dos recursos com planilha — preparo, análise, gestão.</p>
        </div>
        <div>
          <Label htmlFor="lab-target-margin">Margem alvo (%)</Label>
          <Input
            id="lab-target-margin"
            type="number"
            min="0"
            max="99"
            disabled={!canEdit}
            value={settings.targetMarginPercent}
            onChange={(event) => setDraft({ ...settings, targetMarginPercent: Number(event.target.value) })}
            className="h-11"
          />
        </div>
      </div>
      {canEdit && draft ? (
        <div className="lab-settings__actions">
          <Button type="button" size="lg" onClick={save}>Salvar parâmetros</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => setDraft(null)}>Descartar</Button>
        </div>
      ) : null}
      {saved ? <p className="lab-settings__saved" role="status">Parâmetros atualizados.</p> : null}
    </section>
  );
}
