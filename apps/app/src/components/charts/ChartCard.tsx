import type { ReactNode } from "react";
import type { FieldHelpContent } from "@/components/FieldHelp";
import { FieldHelp } from "@/components/FieldHelp";
import "./charts.css";

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  help,
  helpId,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  help?: FieldHelpContent;
  helpId?: string;
}) {
  return (
    <article className={`chart-card${className ? ` ${className}` : ""}`}>
      <div className="chart-card__head">
        <div>
          <h3 className="chart-card__title">
            {title}
            {help ? (
              <FieldHelp label={title} hint={help.hint} formula={help.formula} id={helpId} />
            ) : null}
          </h3>
          {subtitle ? <p className="chart-card__subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </article>
  );
}
