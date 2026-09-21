"use client";

import { useCallback, type ReactNode } from "react";
import { ChartRenderer, type ChartRendererContext, type RenderableChartConfig } from "@/components/charts/ChartRenderer";

type TariffChartPanelProps<T extends string> = {
  groups: { id: T; label: string; charts: RenderableChartConfig[] }[];
  activeGroup: T;
  onGroupChange: (group: T) => void;
  tablistLabel: string;
  context?: ChartRendererContext;
  footer?: ReactNode;
  className?: string;
};

export function TariffChartPanel<T extends string>({
  groups,
  activeGroup,
  onGroupChange,
  tablistLabel,
  context,
  footer,
  className,
}: TariffChartPanelProps<T>) {
  const active = groups.find((group) => group.id === activeGroup) ?? groups[0];

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + delta + groups.length) % groups.length;
      onGroupChange(groups[next].id);
    },
    [groups, onGroupChange],
  );

  return (
    <div className={`tariffs-analysis__charts-panel${className ? ` ${className}` : ""}`}>
      <div className="tariffs-segmented-bar tariffs-segmented-bar--compact">
        <span className="tariffs-segmented-bar__label">Visualizar</span>
        <div className="tariffs-segmented-bar__track tariffs-analysis__filter" role="tablist" aria-label={tablistLabel}>
        {groups.map((group, index) => {
          const selected = activeGroup === group.id;
          const tabId = `tariff-chart-tab-${group.id}`;
          const panelId = `tariff-chart-panel-${group.id}`;
          return (
            <button
              key={group.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={`tariffs-analysis__filter-btn${selected ? " tariffs-analysis__filter-btn--active" : ""}`}
              onClick={() => onGroupChange(group.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {group.label}
            </button>
          );
        })}
        </div>
      </div>

      <div
        id={`tariff-chart-panel-${active.id}`}
        className="tariffs-analysis__chart-stage"
        role="tabpanel"
        aria-labelledby={`tariff-chart-tab-${active.id}`}
      >
        {active.charts.map((chart) => (
          <div key={chart.id} className="tariffs-analysis__chart-slot">
            <ChartRenderer chart={chart} context={context} />
          </div>
        ))}
      </div>

      {footer}
    </div>
  );
}
