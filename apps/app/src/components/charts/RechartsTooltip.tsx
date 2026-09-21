"use client";

type TooltipPayload = {
  name?: string;
  value?: number;
  color?: string;
  payload?: { fill?: string; percent?: number };
};

export function RechartsTooltipContent({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatValue?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  if (payload.length > 1) {
    return (
      <div className="recharts-tooltip">
        {label ? <p className="recharts-tooltip__label">{label}</p> : null}
        {payload.map((item) => {
          const value = item.value ?? 0;
          const formatted = formatValue ? formatValue(value) : String(value);
          return (
            <p
              key={item.name ?? formatted}
              className="recharts-tooltip__value"
              style={{ color: item.payload?.fill ?? item.color }}
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
  const value = item.value ?? 0;
  const formatted = formatValue ? formatValue(value) : String(value);
  const percent = item.payload?.percent;

  return (
    <div className="recharts-tooltip">
      <p className="recharts-tooltip__label">{label ?? item.name}</p>
      <p className="recharts-tooltip__value" style={{ color: item.payload?.fill ?? item.color }}>
        {formatted}
        {percent !== undefined ? ` · ${percent}%` : ""}
      </p>
    </div>
  );
}
