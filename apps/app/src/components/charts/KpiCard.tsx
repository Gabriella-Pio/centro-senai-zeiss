"use client";

import type { LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { FieldHelpContent } from "@/components/FieldHelp";
import { FieldHelp } from "@/components/FieldHelp";
import "./charts.css";
import { CHART_COLORS } from "./recharts-theme";

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  highlight,
  sparkline,
  help,
  helpId,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
  highlight?: boolean;
  sparkline?: number[];
  help?: FieldHelpContent;
  helpId?: string;
}) {
  const sparkData = sparkline?.map((point, index) => ({ index, value: point })) ?? [];

  return (
    <article className={`dashboard-kpi${highlight ? " dashboard-kpi--highlight" : ""}`}>
      <div className="dashboard-kpi__top">
        <span className="dashboard-kpi__label">
          {label}
          {help ? (
            <FieldHelp label={label} hint={help.hint} formula={help.formula} id={helpId} />
          ) : null}
        </span>
        {Icon ? <span className="dashboard-kpi__icon"><Icon aria-hidden="true" /></span> : null}
      </div>
      <strong className="dashboard-kpi__value">{value}</strong>
      <span className="dashboard-kpi__detail">{detail}</span>
      {sparkData.length > 1 ? (
        <div className="dashboard-kpi__spark" aria-hidden="true">
          <ResponsiveContainer width="100%" height={32}>
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </article>
  );
}
