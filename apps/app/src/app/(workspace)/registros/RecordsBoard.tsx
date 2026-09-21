"use client";

import { ClipboardList, Plus } from "lucide-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import type { UserRole } from "@/lib/api";
import { RecordsList } from "./RecordsList";
import { RecordsToolbar } from "./RecordsToolbar";
import { useRecordsBoard } from "./use-records-board";
import "./records.css";

export function RecordsBoard({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const board = useRecordsBoard(userRole, userName);

  return (
    <main className="records-page">
      <header className="records-page__header">
        <div>
          <p className="records-page__eyebrow"><ClipboardList aria-hidden="true" /> Ciclo do serviço</p>
          <h1 className="records-page__title">Registros de serviço</h1>
          <p className="records-page__intro">
            Acompanhe o que foi orçado, realizado e aprendido em cada serviço do laboratório.
          </p>
        </div>
        {board.canCreate ? (
          <Button type="button" size="lg" onClick={() => board.setCreating(true)}>
            <Plus aria-hidden="true" />
            Novo registro
          </Button>
        ) : null}
      </header>

      <section className="records-page__content" aria-labelledby="records-heading">
        <RecordsToolbar
          query={board.query}
          status={board.status}
          company={board.company}
          companies={board.companies}
          statusCounts={board.statusCounts}
          filtering={board.filtering}
          filteredCount={board.filtered.length}
          onQueryChange={board.setQuery}
          onStatusChange={board.setStatus}
          onCompanyChange={board.setCompany}
          onClearFilters={board.clearFilters}
        />

        <h2 id="records-heading" className="sr-only">Registros cadastrados</h2>

        <div className="records-page__table-wrap">
          <RecordsList
            records={board.filtered}
            filtering={board.filtering}
            canCreate={board.canCreate}
            onClearFilters={board.clearFilters}
            onCreate={() => board.setCreating(true)}
          />
        </div>
      </section>

      <Dialog open={board.creating} onOpenChange={board.setCreating}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Novo registro de serviço</DialogTitle>
            <DialogDescription>
              Informe os dados básicos. O orçamento completo fica na página do registro.
            </DialogDescription>
          </DialogHeader>
          <div className="records-form">
            <div>
              <Label htmlFor="record-company">Empresa</Label>
              <Input
                id="record-company"
                value={board.draft.company}
                onChange={(event) => board.setDraft((current) => ({ ...current, company: event.target.value }))}
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="record-requester">Solicitante</Label>
              <Input
                id="record-requester"
                value={board.draft.requester}
                onChange={(event) => board.setDraft((current) => ({ ...current, requester: event.target.value }))}
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="record-service-type">Tipo de serviço</Label>
              <select
                id="record-service-type"
                value={board.draft.serviceTypeId}
                onChange={(event) => board.setDraft((current) => ({ ...current, serviceTypeId: event.target.value }))}
                className="records-page__company-select mt-2"
              >
                <option value="">Selecionar do vocabulário</option>
                {board.serviceTypes.map((term) => (
                  <option key={term.id} value={term.id}>{term.label}</option>
                ))}
              </select>
            </div>
            {board.formError ? <p className="text-sm text-destructive">{board.formError}</p> : null}
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => board.setCreating(false)}>
              Cancelar
            </Button>
            <Button type="button" size="lg" onClick={board.createRecord}>
              Criar e abrir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
