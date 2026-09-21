import { FilterX, Search } from "lucide-react";
import { Button, Input } from "@cem/ui";
import { REQUEST_STATUS_TABS, type RequestStatus } from "./types";

export function RequestsToolbar({
  query,
  status,
  statusCounts,
  filtering,
  filteredCount,
  onQueryChange,
  onStatusChange,
  onClearFilters,
}: {
  query: string;
  status: "ALL" | RequestStatus;
  statusCounts: Record<"ALL" | RequestStatus, number>;
  filtering: boolean;
  filteredCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (status: "ALL" | RequestStatus) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="requests-page__toolbar">
      <div className="requests-page__search">
        <Search aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Pesquisar empresa, pessoa ou serviço"
          aria-label="Pesquisar empresa, pessoa ou serviço"
          className="h-12 pl-10 text-base"
        />
      </div>
      <div className="requests-page__status-tabs">
        <div className="requests-segmented-bar requests-segmented-bar--compact" role="tablist" aria-label="Filtrar por situação">
          <span className="requests-segmented-bar__label">Situação</span>
          <div className="requests-segmented-bar__track">
            {REQUEST_STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={status === tab.id}
                className={`requests-segmented-bar__filter${status === tab.id ? " requests-segmented-bar__filter--active" : ""}`}
                onClick={() => onStatusChange(tab.id)}
              >
                {tab.label}
                <span className="requests-segmented-bar__count">{statusCounts[tab.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {filtering ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
          <FilterX aria-hidden="true" />
          Limpar
        </Button>
      ) : (
        <p className="requests-page__count">{filteredCount} solicitações</p>
      )}
    </div>
  );
}
