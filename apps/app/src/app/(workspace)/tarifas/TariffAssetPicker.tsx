"use client";

import { useMemo, useState } from "react";
import { Package, Plus, Search, SearchX } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import { getMachineHourlyRate, type MachineTariff } from "@/lib/machine-tariff";
import {
  filterTariffsByStatus,
  isMachineTariffActive,
  type TariffAssetFilter,
} from "@/lib/machine-tariff-utils";
import { formatCurrency } from "@/lib/pricing";
import { TariffEmptyState } from "./TariffEmptyState";

export type AssetFilter = TariffAssetFilter;
export type AssetSort = "name" | "rate-desc" | "rate-asc";

export function TariffAssetPicker({
  machineTariffs,
  selectedId,
  canEdit,
  assetFilter,
  onAssetFilterChange,
  onSelect,
  onAddMachine,
}: {
  machineTariffs: MachineTariff[];
  selectedId?: string;
  canEdit: boolean;
  assetFilter: AssetFilter;
  onAssetFilterChange: (filter: AssetFilter) => void;
  onSelect: (tariffId: string) => void;
  onAddMachine: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AssetSort>("name");

  const filteredByStatus = useMemo(
    () => filterTariffsByStatus(machineTariffs, assetFilter),
    [assetFilter, machineTariffs],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    const list = needle
      ? filteredByStatus.filter((tariff) => tariff.label.toLocaleLowerCase("pt-BR").includes(needle))
      : filteredByStatus;

    return [...list].sort((a, b) => {
      if (sort === "rate-desc") return getMachineHourlyRate(b) - getMachineHourlyRate(a);
      if (sort === "rate-asc") return getMachineHourlyRate(a) - getMachineHourlyRate(b);
      return a.label.localeCompare(b.label, "pt-BR");
    });
  }, [filteredByStatus, query, sort]);

  const hasActiveFilters = query.trim().length > 0 || assetFilter !== "active";

  function clearFilters() {
    setQuery("");
    onAssetFilterChange("active");
  }

  const filters: { id: AssetFilter; label: string }[] = [
    { id: "active", label: "Ativos" },
    { id: "archived", label: "Arquivados" },
    { id: "all", label: "Todos" },
  ];

  return (
    <div className="tariffs-asset-picker" id="tariff-asset-picker">
      <div className="tariffs-asset-picker__toolbar">
        <div className="tariffs-segmented-bar tariffs-segmented-bar--compact tariffs-segmented-bar--inline">
          <span className="tariffs-segmented-bar__label">Mostrar</span>
          <div className="tariffs-segmented-bar__track tariffs-asset-picker__filters" role="tablist" aria-label="Filtrar ativos">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={assetFilter === item.id}
              className={`tariffs-asset-picker__filter${assetFilter === item.id ? " tariffs-asset-picker__filter--active" : ""}`}
              onClick={() => onAssetFilterChange(item.id)}
            >
              {item.label}
            </button>
          ))}
          </div>
        </div>
        <div className="tariffs-asset-picker__search-row">
          <div className="tariffs-asset-picker__search">
            <Search aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar ativo"
              aria-label="Buscar ativo"
              className="h-10 pl-9"
            />
          </div>
          <div className="tariffs-asset-picker__sort">
            <Label htmlFor="tariff-asset-sort" className="sr-only">Ordenar ativos</Label>
            <select
              id="tariff-asset-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as AssetSort)}
              className="tariffs-asset-picker__sort-select"
            >
              <option value="name">Nome A–Z</option>
              <option value="rate-desc">Tarifa maior</option>
              <option value="rate-asc">Tarifa menor</option>
            </select>
          </div>
        </div>
        <p className="tariffs-asset-picker__count">
          {filtered.length} de {filteredByStatus.length} ativo{filteredByStatus.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="tariffs-compare-grid" role="radiogroup" aria-label="Selecionar ativo">
        {filtered.length === 0 ? (
          machineTariffs.length === 0 ? (
            <TariffEmptyState
              className="tariffs-empty-state--grid"
              icon={Package}
              title="Nenhum ativo cadastrado"
              description={
                canEdit
                  ? "Cadastre o primeiro ativo para começar a montar as planilhas hora-máquina."
                  : "Ainda não há ativos disponíveis neste laboratório."
              }
            />
          ) : (
            <TariffEmptyState
              className="tariffs-empty-state--grid"
              icon={SearchX}
              title="Nenhum ativo encontrado"
              description="Tente outro termo de busca ou ajuste os filtros de exibição."
              action={
                hasActiveFilters ? (
                  <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : null
              }
            />
          )
        ) : null}
        {filtered.map((tariff) => {
          const selected = tariff.id === selectedId;
          const archived = !isMachineTariffActive(tariff);
          return (
            <button
              key={tariff.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`tariffs-compare__card tariffs-compare__card--compact${selected ? " tariffs-compare__card--active" : ""}${archived ? " tariffs-compare__card--archived" : ""}`}
              onClick={() => onSelect(tariff.id)}
            >
              <span className="tariffs-compare__name">
                {tariff.label}
                {archived ? <span className="tariffs-compare__archived-badge">Arquivado</span> : null}
              </span>
              <span className="tariffs-compare__rate">{formatCurrency(getMachineHourlyRate(tariff))}/h</span>
            </button>
          );
        })}
        {canEdit && assetFilter !== "archived" ? (
          <button
            type="button"
            className="tariffs-compare__add tariffs-compare__add--compact"
            onClick={onAddMachine}
          >
            <span className="tariffs-compare__add-icon" aria-hidden="true">
              <Plus />
            </span>
            <span className="tariffs-compare__name">Novo ativo</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
