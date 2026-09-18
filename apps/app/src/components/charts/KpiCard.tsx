import type { LucideIcon } from "lucide-react";
import "./charts.css";

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  highlight,
  sparkline,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
  highlight?: boolean;
  sparkline?: number[];
}) {
  const sparkMax = sparkline ? Math.max(...sparkline, 1) : 1;

  return (
    <article className={`dashboard-kpi${highlight ? " dashboard-kpi--highlight" : ""}`}>
      <div className="dashboard-kpi__top">
        <span className="dashboard-kpi__label">{label}</span>
        {Icon ? <span className="dashboard-kpi__icon"><Icon aria-hidden="true" /></span> : null}
      </div>
      <strong className="dashboard-kpi__value">{value}</strong>
      <span className="dashboard-kpi__detail">{detail}</span>
      {sparkline && sparkline.length > 1 ? (
        <svg className="dashboard-kpi__spark" viewBox={`0 0 ${sparkline.length * 12} 32`} preserveAspectRatio="none" aria-hidden="true">
          <polyline
            fill="none"
            stroke="#0057b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sparkline
              .map((value, index) => `${index * 12},${32 - (value / sparkMax) * 28}`)
              .join(" ")}
          />
        </svg>
      ) : null}
    </article>
  );
}
