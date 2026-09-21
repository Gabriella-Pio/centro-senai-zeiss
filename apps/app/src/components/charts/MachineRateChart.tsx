"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MachineRateRow } from "@/lib/tariff-chart-data";
import { formatCurrency } from "@/lib/pricing";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT_COMPACT, CHART_MARGIN_LEFT, truncateLabel } from "./recharts-theme";

function handleMachineBarClick(
  payload: { id?: string } | undefined,
  onMachineSelect?: (machineId: string) => void,
) {
  if (payload?.id && onMachineSelect) {
    onMachineSelect(payload.id);
  }
}

export function MachineRateChart({
  rows,
  highlightId,
  onMachineSelect,
  dense = false,
}: {
  rows: MachineRateRow[];
  highlightId?: string;
  onMachineSelect?: (machineId: string) => void;
  dense?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <ChartCard title="Tarifa hora do parque" subtitle="Item 32 — usada nos orçamentos">
        <p className="chart-card__empty">Cadastre ativos para comparar tarifas.</p>
      </ChartCard>
    );
  }

  const data = rows.map((row) => ({
    name: row.label,
    value: row.rate,
    id: row.id,
  }));
  const height = dense ? Math.max(120, data.length * 28) : CHART_HEIGHT_COMPACT;
  const subtitle = onMachineSelect
    ? "Item 32 (com administrativo) — clique em uma barra para abrir a planilha"
    : "Item 32 (com administrativo) — maior para menor";

  return (
    <ChartCard title="Tarifa hora do parque" subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={dense ? 72 : 96}
            tick={{ fontSize: dense ? 9 : 11 }}
            tickFormatter={(value) => truncateLabel(String(value), dense ? 10 : 14)}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={(value) => `${formatCurrency(value)}/h`}
              />
            )}
          />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            barSize={dense ? 12 : 16}
            cursor={onMachineSelect ? "pointer" : undefined}
            onClick={(bar) => handleMachineBarClick(bar?.payload as { id?: string }, onMachineSelect)}
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.id === highlightId ? CHART_COLORS.primary : "color-mix(in srgb, var(--color-primary) 55%, #3b82f6)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
