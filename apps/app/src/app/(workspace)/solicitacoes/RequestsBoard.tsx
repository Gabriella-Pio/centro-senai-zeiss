"use client";

import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@cem/ui";
import { RequestArchiveDialog } from "./RequestArchiveDialog";
import { RequestConvertDialog } from "./RequestConvertDialog";
import { RequestDetailDialog } from "./RequestDetailDialog";
import { RequestsList } from "./RequestsList";
import { RequestsToolbar } from "./RequestsToolbar";
import { useRequestsBoard } from "./use-requests-board";
import "./requests.css";

export function RequestsBoard() {
  const board = useRequestsBoard();

  return (
    <main className="requests-page">
      <header className="requests-page__header">
        <div>
          <p className="requests-page__eyebrow">
            <Bell aria-hidden="true" />
            Entrada comercial
          </p>
          <h1 className="requests-page__title">Solicitações de orçamento</h1>
          <p className="requests-page__intro">
            Acompanhe o que chegou pelo site e transforme oportunidades aprovadas em registros do laboratório.
          </p>
        </div>
        <div className="requests-page__header-actions">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={board.syncingLeads}
            onClick={() => void board.refreshLeadsFromSite()}
          >
            <RefreshCw aria-hidden="true" className={board.syncingLeads ? "animate-spin" : undefined} />
            {board.syncingLeads ? "Atualizando…" : "Atualizar do site"}
          </Button>
        </div>
      </header>

      <section className="requests-page__content" aria-labelledby="requests-heading">
        <RequestsToolbar
          query={board.query}
          status={board.status}
          statusCounts={board.statusCounts}
          filtering={board.filtering}
          filteredCount={board.filtered.length}
          onQueryChange={board.setQuery}
          onStatusChange={board.setStatus}
          onClearFilters={board.clearFilters}
        />

        {board.notice ? (
          <div className="workspace-notice requests-page__notice" role="status" aria-live="polite">{board.notice}</div>
        ) : board.syncingLeads ? (
          <div className="workspace-notice workspace-notice--info requests-page__notice" role="status" aria-live="polite">
            Sincronizando solicitações recebidas pelo site…
          </div>
        ) : null}

        <h2 id="requests-heading" className="sr-only">Solicitações recebidas</h2>

        <div className="requests-page__table-wrap">
          <RequestsList
            requests={board.filtered}
            filtering={board.filtering}
            onView={board.openRequest}
            onClearFilters={board.clearFilters}
          />
        </div>
      </section>

      <RequestDetailDialog
        request={board.selected}
        open={board.selected !== null}
        onOpenChange={(open) => !open && board.closeRequest()}
        onConvert={board.handleStartConvert}
        onArchive={(request) => {
          board.setArchiveTarget(request);
          board.closeRequest();
        }}
      />

      <RequestConvertDialog
        request={board.convertTarget}
        open={board.convertTarget !== null}
        onOpenChange={(open) => !open && board.setConvertTarget(null)}
        serviceTypes={board.serviceTypes}
        onConfirm={board.handleConvert}
      />

      <RequestArchiveDialog
        request={board.archiveTarget}
        open={board.archiveTarget !== null}
        onOpenChange={(open) => !open && board.setArchiveTarget(null)}
        onConfirm={board.handleArchive}
      />
    </main>
  );
}
