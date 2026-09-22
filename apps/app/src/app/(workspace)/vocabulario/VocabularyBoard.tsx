"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Ban,
  BookOpen,
  CheckCircle2,
  FilterX,
  Link2,
  Pencil,
  Plus,
  Search,
  SearchX,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@cem/ui";

import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import { updateDemoState } from "@/lib/demo/demo-store";
import { formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";

import { VocabularyForm } from "./VocabularyForm";
import {
  VOCABULARY_CLASS_LABELS,
  VOCABULARY_CLASSES,
  type VocabularyClass,
  type VocabularyTerm,
} from "./types";
import {
  findTariffForResource,
  getTariffHref,
  isTariffManagedResource,
} from "./vocabulary-utils";

import "../registros/records.css";
import "./vocabulary.css";

const STATUS_TABS: Array<{ id: "ALL" | "ACTIVE" | "INACTIVE"; label: string }> = [
  { id: "ALL", label: "Todos" },
  { id: "ACTIVE", label: "Ativos" },
  { id: "INACTIVE", label: "Inativos" },
];

const CLASS_TABS: Array<{ id: "ALL" | VocabularyClass; label: string }> = [
  { id: "ALL", label: "Todas" },
  ...VOCABULARY_CLASSES.map((value) => ({
    id: value,
    label: VOCABULARY_CLASS_LABELS[value],
  })),
];

export function VocabularyBoard({ canEdit }: { canEdit: boolean }) {
  const { vocabulary: terms, machineTariffs } = useDemoStore();

  const [query, setQuery] = useState("");
  const [termClass, setTermClass] = useState<"ALL" | VocabularyClass>("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [editing, setEditing] = useState<VocabularyTerm | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return terms.filter((term) => {
      if (termClass !== "ALL" && term.class !== termClass) {
        return false;
      }

      if (status === "ACTIVE" && !term.active) {
        return false;
      }

      if (status === "INACTIVE" && term.active) {
        return false;
      }

      return (
        !needle ||
        term.label.toLowerCase().includes(needle) ||
        term.guidance.toLowerCase().includes(needle)
      );
    });
  }, [query, status, termClass, terms]);

  const filtering =
    Boolean(query.trim()) || termClass !== "ALL" || status !== "ALL";

  const activeCount = terms.filter((term) => term.active).length;
  const tariffResourceCount = terms.filter((term) =>
    isTariffManagedResource(term, machineTariffs),
  ).length;

  const statusCounts = useMemo(
    () => ({
      ALL: terms.length,
      ACTIVE: terms.filter((term) => term.active).length,
      INACTIVE: terms.filter((term) => !term.active).length,
    }),
    [terms],
  );

  const classCounts = useMemo(() => {
    const counts: Record<"ALL" | VocabularyClass, number> = {
      ALL: terms.length,
      SERVICE_TYPE: 0,
      PART_TRAIT: 0,
      RESOURCE: 0,
      DEVIATION_CAUSE: 0,
    };
    terms.forEach((term) => {
      counts[term.class] += 1;
    });
    return counts;
  }, [terms]);

  function saveTerms(nextTerms: VocabularyTerm[], message: string) {
    updateDemoState((state) => ({
      ...state,
      vocabulary: nextTerms,
    }));

    setNotice(message);
    setCreating(false);
    setEditing(null);
  }

  function clearFilters() {
    setQuery("");
    setTermClass("ALL");
    setStatus("ALL");
  }

  function toggleActive(term: VocabularyTerm) {
    saveTerms(
      terms.map((item) =>
        item.id === term.id
          ? {
              ...item,
              active: !item.active,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
      term.active ? "Termo desativado." : "Termo ativado.",
    );
  }

  return (
    <main className="vocabulary-page">
      <header className="vocabulary-page__header">
        <div className="vocabulary-page__heading">
          <p className="vocabulary-page__eyebrow">
            <BookOpen aria-hidden="true" />
            Base de conhecimento
          </p>

          <h1 className="vocabulary-page__title">Vocabulário</h1>

          <p className="vocabulary-page__intro">
            Organize os termos usados pela equipe nos registros. Recursos com
            planilha em Tarifas entram aqui automaticamente com a tarifa item 32.
          </p>
        </div>

        {canEdit ? (
          <Button
            type="button"
            size="lg"
            onClick={() => setCreating(true)}
          >
            <Plus aria-hidden="true" />
            Novo termo
          </Button>
        ) : null}
      </header>

      <section className="vocabulary-page__flow-banner" aria-label="Integração com tarifas">
        <div className="vocabulary-page__flow-icon" aria-hidden="true">
          <Link2 />
        </div>
        <div className="vocabulary-page__flow-copy">
          <strong>Novo ativo em Tarifas → recurso no vocabulário</strong>
          <p>
            Ao cadastrar uma planilha hora-máquina em{" "}
            <Link href="/tarifas">Tarifas</Link>, o sistema cria o recurso aqui
            automaticamente, com tarifa sincronizada. Arquivar o ativo desativa o
            termo; renomear atualiza o nome nos dois lugares.
          </p>
        </div>
        <Link href="/tarifas" className="vocabulary-page__flow-link">
          Ir para tarifas
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section
        className="vocabulary-page__content"
        aria-labelledby="vocabulary-list-heading"
      >
        <div className="vocabulary-page__content-header">
          <div>
            <p className="vocabulary-page__section-eyebrow">
              Termos cadastrados
            </p>

            <h2 id="vocabulary-list-heading">
              Base de termos da equipe
            </h2>

            <p>
              Consulte, filtre e mantenha os termos disponíveis para os
              registros de serviço.
            </p>
          </div>

          <span className="vocabulary-page__result-count">
            {filtered.length} {filtered.length === 1 ? "termo" : "termos"}
          </span>
        </div>

        <div className="vocabulary-page__toolbar">
          <div className="vocabulary-page__search">
            <Search aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar termo ou orientação"
              aria-label="Pesquisar termo ou orientação"
              className="h-12 pl-10 text-base"
            />
          </div>

          <div className="vocabulary-page__filters">
            <div
              className="records-segmented-bar records-segmented-bar--compact"
              role="tablist"
              aria-label="Filtrar por classe"
            >
              <span className="records-segmented-bar__label">Classe</span>
              <div className="records-segmented-bar__track">
                {CLASS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={termClass === tab.id}
                    className={`records-segmented-bar__filter${
                      termClass === tab.id ? " records-segmented-bar__filter--active" : ""
                    }`}
                    onClick={() => setTermClass(tab.id)}
                  >
                    {tab.label}
                    <span className="records-segmented-bar__count">
                      {classCounts[tab.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div
              className="records-segmented-bar records-segmented-bar--compact"
              role="tablist"
              aria-label="Filtrar por situação"
            >
              <span className="records-segmented-bar__label">Situação</span>
              <div className="records-segmented-bar__track">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={status === tab.id}
                    className={`records-segmented-bar__filter${
                      status === tab.id ? " records-segmented-bar__filter--active" : ""
                    }`}
                    onClick={() => setStatus(tab.id)}
                  >
                    {tab.label}
                    <span className="records-segmented-bar__count">
                      {statusCounts[tab.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtering ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
              <FilterX aria-hidden="true" />
              Limpar filtros
            </Button>
          ) : null}
        </div>

        {notice ? (
          <p
            className="vocabulary-page__notice"
            role="status"
          >
            {notice}
          </p>
        ) : null}

        <div className="vocabulary-page__table-wrap">
          {filtered.length === 0 ? (
            <WorkspaceEmptyState
              icon={SearchX}
              title="Nenhum termo encontrado"
              description="Tente outro termo ou ajuste os filtros de classe e situação."
              action={
                filtering ? (
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : undefined
              }
              className="workspace-empty-state--panel vocabulary-page__empty"
            />
          ) : (
            <table className="vocabulary-page__table">
              <thead>
                <tr>
                  <th>Termo</th>
                  <th>Classe</th>
                  <th>Tarifa</th>
                  <th>Situação</th>
                  <th className="vocabulary-page__actions-heading">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((term) => {
                  const linkedTariff = findTariffForResource(machineTariffs, term.id);

                  return (
                  <tr key={term.id}>
                    <td>
                      <div className="vocabulary-page__term-head">
                        <strong>{term.label}</strong>
                        {linkedTariff ? (
                          <Badge variant="outline" className="vocabulary-page__tariff-badge">
                            Planilha
                          </Badge>
                        ) : null}
                      </div>

                      <span>
                        {term.guidance || "Sem orientação de uso"}
                      </span>
                    </td>

                    <td>
                      <Badge variant="outline">
                        {VOCABULARY_CLASS_LABELS[term.class]}
                      </Badge>
                    </td>

                    <td>
                      {term.class === "RESOURCE" && term.hourlyRate ? (
                        <div className="vocabulary-page__rate-cell">
                          <span className="vocabulary-page__rate">
                            {formatCurrency(term.hourlyRate)}/h
                          </span>
                          {linkedTariff ? (
                            <Link
                              href={getTariffHref(linkedTariff)}
                              className="vocabulary-page__tariff-link"
                            >
                              Ver planilha
                            </Link>
                          ) : null}
                        </div>
                      ) : (
                        <span className="vocabulary-page__dash">
                          —
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          term.active
                            ? "vocabulary-status vocabulary-status--active"
                            : "vocabulary-status vocabulary-status--inactive"
                        }
                      >
                        {term.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td className="vocabulary-page__actions">
                      <div className="vocabulary-page__action-group">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title={`Editar ${term.label}`}
                          onClick={() => setEditing(term)}
                        >
                          <Pencil aria-hidden="true" />
                          <span className="sr-only">Editar {term.label}</span>
                        </Button>

                        {canEdit ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className={
                              term.active
                                ? "vocabulary-page__toggle vocabulary-page__toggle--deactivate"
                                : "vocabulary-page__toggle vocabulary-page__toggle--activate"
                            }
                            title={term.active ? `Desativar ${term.label}` : `Ativar ${term.label}`}
                            onClick={() => toggleActive(term)}
                          >
                            {term.active ? (
                              <Ban aria-hidden="true" />
                            ) : (
                              <CheckCircle2 aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {term.active ? `Desativar ${term.label}` : `Ativar ${term.label}`}
                            </span>
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Dialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Editar termo" : "Novo termo"}
            </DialogTitle>

            <DialogDescription className="text-base text-muted-foreground">
              Use classes consistentes para que o vocabulário ajude
              nos próximos registros.
            </DialogDescription>
          </DialogHeader>

          <VocabularyForm
            term={editing ?? undefined}
            tariffLinked={
              editing
                ? isTariffManagedResource(editing, machineTariffs)
                : false
            }
            tariffHref={
              editing
                ? (() => {
                    const tariff = findTariffForResource(machineTariffs, editing.id);
                    return tariff ? getTariffHref(tariff) : undefined;
                  })()
                : undefined
            }
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSave={(saved) =>
              saveTerms(
                editing
                  ? terms.map((term) =>
                      term.id === saved.id ? saved : term,
                    )
                  : [...terms, saved],
                editing
                  ? "Termo atualizado."
                  : "Termo criado com sucesso.",
              )
            }
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}