"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MachineStackRow } from "@/lib/tariff-chart-data";
import { formatCurrency } from "@/lib/pricing";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_HEIGHT_COMPACT, CHART_MARGIN_LEFT, truncateLabel } from "./recharts-theme";

function handleMachineBarClick(
  payload: { id?: string } | undefined,
  onMachineSelect?: (machineId: string) => void,
) {
  if (payload?.id && onMachineSelect) {
    onMachineSelect(payload.id);
  }
}

export function MachineCostStackChart({
  rows,
  highlightId,
  onMachineSelect,
  dense = false,
  showLegend = true,
}: {
  rows: MachineStackRow[];
  highlightId?: string;
  onMachineSelect?: (machineId: string) => void;
  dense?: boolean;
  showLegend?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <ChartCard title="Composição do parque" subtitle="Como cada item 32 se divide entre fixo, variável, mão de obra e administrativo">
        <p className="chart-card__empty">Cadastre ativos para comparar composições.</p>
      </ChartCard>
    );
  }

  const segmentKeys = rows[0]?.segments.map((segment) => segment.id) ?? [];
  const segmentMeta = rows[0]?.segments ?? [];
  const data = rows.map((row) => ({
    name: row.label,
    id: row.id,
    total: row.total,
    ...Object.fromEntries(row.segments.map((segment) => [segment.id, segment.value])),
  }));
  const height = dense ? Math.max(120, data.length * 30) : CHART_HEIGHT_COMPACT;
  const subtitle = onMachineSelect
    ? "Clique em uma barra para abrir a planilha do ativo"
    : "Proporção do item 32 (R$/h) em cada ativo";

  return (
    <ChartCard title="Composição do parque" subtitle={subtitle} className="chart-card--interactive">
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
          {showLegend ? <Legend /> : null}
          {segmentKeys.map((key) => {
            const segment = segmentMeta.find((item) => item.id === key);
            return (
              <Bar
                key={key}
                dataKey={key}
                name={segment?.label ?? key}
                stackId="cost"
                fill={segment?.color}
                barSize={dense ? 12 : 16}
                opacity={highlightId ? 0.92 : 1}
                cursor={onMachineSelect ? "pointer" : undefined}
                onClick={(bar) => handleMachineBarClick(bar?.payload as { id?: string }, onMachineSelect)}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
