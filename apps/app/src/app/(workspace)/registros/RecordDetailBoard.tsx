"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { UserRole } from "@/lib/api";

import { RecordBlockA } from "./RecordBlockA";
import { RecordBlockB } from "./RecordBlockB";
import { RecordBlockC } from "./RecordBlockC";
import { RecordBlockPanel } from "./RecordBlockPanel";
import { RecordBlockStepper } from "./RecordBlockStepper";
import { RECORD_BLOCK_COPY } from "./record-block-copy";
import { RecordDetailAside } from "./RecordDetailAside";
import { RecordDetailHeader } from "./RecordDetailHeader";
import { RecordDetailNotices } from "./RecordDetailNotices";
import { useRecordDetailBoard } from "./use-record-detail-board";

import "./records.css";
import "./record-detail.css";

export function RecordDetailBoard({
  recordId,
  userRole,
  userName,
}: {
  recordId: string;
  userRole: UserRole;
  userName: string;
}) {
  const board = useRecordDetailBoard(
    recordId,
    userRole,
    userName
  );

  if (!board.record) {
    return (
      <main className="record-detail-page">
        <Link
          href="/registros"
          className="record-detail-page__back"
        >
          <ArrowLeft aria-hidden="true" />
          Voltar aos registros
        </Link>

        <p>Registro não encontrado.</p>
      </main>
    );
  }

  const record = board.record;
  const blockCopy = RECORD_BLOCK_COPY[board.activeTab];

  return (
    <main className="record-detail-page">
      <Link
        href="/registros"
        className="record-detail-page__back"
      >
        <ArrowLeft aria-hidden="true" />
        Voltar aos registros
      </Link>

      <RecordDetailHeader record={record} />

      <RecordDetailNotices notices={board.detailNotices} />

      {board.notice ? (
        <div
          className="record-detail-page__feedback"
          role="status"
          aria-live="polite"
        >
          {board.notice}
        </div>
      ) : null}

      <RecordBlockStepper
        record={record}
        activeTab={board.activeTab}
        onSelect={board.selectBlock}
        onBlockedSelect={board.handleBlockedSelect}
      />

      <div className="record-detail-page__layout record-detail-page__layout--split">
        <section className="record-detail-page__form">
          <RecordBlockPanel
            block={board.activeTab}
            title={blockCopy.title}
            description={blockCopy.description}
          >
            {board.activeTab === "A" ? (
              <RecordBlockA
                record={record}
                readOnly={board.readOnly}
                canEditQuoteMode={board.canEditQuoteMode}
                serviceTypes={board.serviceTypes}
                partTraits={board.partTraits}
                resources={board.resources}
                suggestedPrice={board.suggestedPrice}
                suggestedUnitPrice={board.suggestedUnitPrice}
                needsPriceOverride={Boolean(
                  board.needsPriceOverride
                )}
                onUpdate={board.updateRecord}
                onSave={board.saveBlockA}
              />
            ) : null}

            {board.activeTab === "B" ? (
              <RecordBlockB
                record={record}
                readOnly={board.readOnly}
                serviceTypes={board.serviceTypes}
                resources={board.resources}
                actualCost={board.actualCost}
                onUpdate={board.updateRecord}
                onSave={board.saveBlockB}
              />
            ) : null}

            {board.activeTab === "C" ? (
              <RecordBlockC
                record={record}
                readOnly={board.readOnly}
                deviationCauses={board.deviationCauses}
                vocabulary={board.vocabulary}
                onUpdate={board.updateRecord}
                onCreateDeviationCause={board.createDeviationCause}
                onComplete={board.completeService}
              />
            ) : null}
          </RecordBlockPanel>

          {board.formError ? (
            <div
              className="record-detail-page__error-banner"
              role="alert"
              aria-live="assertive"
            >
              {board.formError}
            </div>
          ) : null}
        </section>

        <aside className="record-detail-page__aside">
          <RecordDetailAside
            record={record}
            activeTab={board.activeTab}
            costBreakdown={board.costBreakdown}
            actualBreakdown={board.actualBreakdown}
            priceHistory={board.priceHistory}
            frozenTariff={board.frozenTariff}
            quoteOutdated={board.quoteOutdated}
            costDonut={board.costDonut}
            financialSummary={board.financialSummary}
          />
        </aside>
      </div>
    </main>
  );
}