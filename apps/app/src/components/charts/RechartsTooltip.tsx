"use client";

import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export type RechartsTooltipPayload = NonNullable<TooltipProps<ValueType, NameType>["payload"]>[number];

type RechartsTooltipContentProps = {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: string | number;
  formatValue?: (value: number) => string;
};

export function RechartsTooltipContent({
  active,
  payload,
  label,
  formatValue,
}: RechartsTooltipContentProps) {
  if (!active || !payload?.length) return null;

  if (payload.length > 1) {
    return (
      <div className="recharts-tooltip">
        {label ? <p className="recharts-tooltip__label">{label}</p> : null}
        {payload.map((item) => {
          const numericValue = typeof item.value === "number" ? item.value : Number(item.value ?? 0);
          const formatted = formatValue ? formatValue(numericValue) : String(item.value ?? 0);
          const fill =
            item.payload && typeof item.payload === "object" && "fill" in item.payload
              ? String(item.payload.fill)
              : item.color;
          return (
            <p
              key={String(item.name ?? formatted)}
              className="recharts-tooltip__value"
              style={{ color: fill }}
            >
              {item.name ? `${item.name}: ` : ""}
              {formatted}
            </p>
          );
        })}
      </div>
    );
  }

  const item = payload[0];
  const numericValue = typeof item.value === "number" ? item.value : Number(item.value ?? 0);
  const formatted = formatValue ? formatValue(numericValue) : String(item.value ?? 0);
  const percent =
    item.payload && typeof item.payload === "object" && "percent" in item.payload
      ? item.payload.percent
      : undefined;
  const fill =
    item.payload && typeof item.payload === "object" && "fill" in item.payload
      ? String(item.payload.fill)
      : item.color;

  return (
    <div className="recharts-tooltip">
      <p className="recharts-tooltip__label">{label ?? item.name}</p>
      <p className="recharts-tooltip__value" style={{ color: fill }}>
        {formatted}
        {percent !== undefined ? ` · ${percent}%` : ""}
      </p>
    </div>
  );
}
