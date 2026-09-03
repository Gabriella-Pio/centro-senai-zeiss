"use client";

import { useEffect, useState } from "react";
import {
  SECTION_FLOW_LABELS,
  SECTION_FLOW_SUGGESTED,
  SECTION_PATTERNS,
  SECTION_SURFACES,
  type SectionFlowKey,
  type SectionPattern,
  type SectionSurface,
  type SectionSurfaceConfig,
} from "@/lib/section-surfaces";

const STORAGE_KEY = "section-flow-overrides";

type Overrides = Partial<Record<SectionFlowKey, SectionSurfaceConfig>>;

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

function applyToDom(overrides: Overrides) {
  (Object.keys(SECTION_FLOW_LABELS) as SectionFlowKey[]).forEach((key) => {
    const el = document.querySelector<HTMLElement>(`[data-section-key="${key}"]`);
    if (!el) return;
    const config = overrides[key] ?? SECTION_FLOW_SUGGESTED[key];
    el.dataset.surface = config.surface;
    el.dataset.pattern = config.pattern;
  });
}

export function SectionSurfaceDevPanel() {
  const [open, setOpen] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    const stored = readOverrides();
    setOverrides(stored);
    applyToDom(stored);
  }, []);

  const updateSection = (key: SectionFlowKey, patch: Partial<SectionSurfaceConfig>) => {
    const next: Overrides = {
      ...overrides,
      [key]: {
        ...(overrides[key] ?? SECTION_FLOW_SUGGESTED[key]),
        ...patch,
      },
    };
    setOverrides(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyToDom(next);
  };

  const applyPreset = (preset: Record<SectionFlowKey, SectionSurfaceConfig>) => {
    setOverrides(preset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preset));
    applyToDom(preset);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-9999 max-h-[min(90vh,40rem)] font-sans text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-border bg-card/95 px-3 py-2 font-medium text-foreground shadow-lg backdrop-blur-sm"
      >
        Fundos por seção
      </button>
      {open ? (
        <div className="mt-2 flex w-72 flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-card/95 p-3 shadow-xl backdrop-blur-sm">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset(SECTION_FLOW_SUGGESTED)}
              className="rounded bg-primary px-2 py-1 text-primary-foreground"
            >
              Fluxo sugerido
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-border px-2 py-1 text-foreground hover:bg-muted"
            >
              Reset
            </button>
          </div>

          <ul className="space-y-3">
            {(Object.keys(SECTION_FLOW_LABELS) as SectionFlowKey[]).map((key) => {
              const config = overrides[key] ?? SECTION_FLOW_SUGGESTED[key];
              return (
                <li key={key} className="rounded border border-border/70 p-2">
                  <p className="mb-1.5 font-medium text-foreground">{SECTION_FLOW_LABELS[key]}</p>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Cor
                  </label>
                  <select
                    value={config.surface}
                    onChange={(e) =>
                      updateSection(key, { surface: e.target.value as SectionSurface })
                    }
                    className="mb-2 w-full rounded border border-border bg-background px-2 py-1 text-foreground"
                  >
                    {SECTION_SURFACES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Textura
                  </label>
                  <select
                    value={config.pattern}
                    onChange={(e) =>
                      updateSection(key, { pattern: e.target.value as SectionPattern })
                    }
                    className="w-full rounded border border-border bg-background px-2 py-1 text-foreground"
                  >
                    {SECTION_PATTERNS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
