import { FilterX, Search } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import { SERVICE_STATUS_TABS, type ServiceStatus } from "./types";

export function RecordsToolbar({
  query,
  status,
  company,
  companies,
  statusCounts,
  filtering,
  filteredCount,
  onQueryChange,
  onStatusChange,
  onCompanyChange,
  onClearFilters,
}: {
  query: string;
  status: "ALL" | ServiceStatus;
  company: string;
  companies: string[];
  statusCounts: Record<"ALL" | ServiceStatus, number>;
  filtering: boolean;
  filteredCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (status: "ALL" | ServiceStatus) => void;
  onCompanyChange: (company: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="records-page__toolbar">
      <div className="records-page__search">
        <Search aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Pesquisar empresa, serviço ou lote"
          aria-label="Pesquisar empresa, serviço ou lote"
          className="h-12 pl-10 text-base"
        />
      </div>

      <div className="records-page__status-tabs">
        <div className="records-segmented-bar records-segmented-bar--compact" role="tablist" aria-label="Filtrar por situação">
          <span className="records-segmented-bar__label">Situação</span>
          <div className="records-segmented-bar__track">
            {SERVICE_STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={status === tab.id}
                className={`records-segmented-bar__filter${status === tab.id ? " records-segmented-bar__filter--active" : ""}`}
                onClick={() => onStatusChange(tab.id)}
              >
                {tab.label}
                <span className="records-segmented-bar__count">{statusCounts[tab.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="records-page__company-filter">
        <Label htmlFor="record-company-filter" className="sr-only">Filtrar por empresa</Label>
        <select
          id="record-company-filter"
          value={company}
          onChange={(event) => onCompanyChange(event.target.value)}
          className="records-page__company-select"
        >
          <option value="ALL">Todas as empresas</option>
          {companies.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {filtering ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
          <FilterX aria-hidden="true" />
          Limpar
        </Button>
      ) : (
        <p className="records-page__count">{filteredCount} registros</p>
      )}
    </div>
  );
}
