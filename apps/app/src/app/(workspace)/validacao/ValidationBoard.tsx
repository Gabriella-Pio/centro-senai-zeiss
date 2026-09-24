"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@cem/ui";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import { pushNotification, updateDemoState } from "@/lib/demo/demo-store";
import { getRecordDetailPath } from "@/lib/records-navigation";
import { useDemoStore } from "@/lib/use-demo-store";
import { RecordLessonDetailBadge } from "../registros/RecordStatusBadge";
import { VISIBILITY_LABELS } from "../registros/types";
import "./validation.css";

export function ValidationBoard() {
  const searchParams = useSearchParams();
  const highlightedRecordId = searchParams.get("registro");
  const { records, vocabulary } = useDemoStore();
  const [notice, setNotice] = useState<string | null>(null);

  const pending = useMemo(
    () => records.filter((record) => record.lessonStatus === "PENDING"),
    [records],
  );

  useEffect(() => {
    if (!highlightedRecordId) {
      return;
    }
    document
      .getElementById(`validation-record-${highlightedRecordId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedRecordId, pending]);

  function formalize(recordId: string) {
    const record = records.find((item) => item.id === recordId);
    if (!record) return;
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) =>
        item.id === recordId ? { ...item, lessonStatus: "FORMALIZED" } : item,
      ),
    }));
    pushNotification({
      roles: record.visibility === "RESTRICTED" ? ["VALIDADOR", "ADMIN"] : ["TECNICO", "VALIDADOR", "ADMIN", "CONSULTA"],
      message: `Nova lição formalizada sobre ${record.service}.`,
      href: getRecordDetailPath(recordId, "A"),
    });
    setNotice(`Lição de ${record.recordNumber} formalizada.`);
  }

  function supersede(recordId: string) {
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) =>
        item.id === recordId ? { ...item, lessonStatus: "SUPERSEDED" } : item,
      ),
    }));
    setNotice("Lição marcada como superada.");
  }

  return (
    <main className="validation-page">
      <header className="validation-page__header">
        <div>
          <p className="validation-page__eyebrow"><ShieldCheck aria-hidden="true" /> Conhecimento conferido</p>
          <h1 className="validation-page__title">Validação de lições</h1>
          <p className="validation-page__intro">Somente lições formalizadas entram nas recomendações do Assistente.</p>
        </div>
      </header>

      {notice ? (
        <div className="workspace-notice workspace-notice--success validation-page__notice" role="status">
          {notice}
        </div>
      ) : null}

      <section className="validation-page__content">
        {pending.length === 0 ? (
          <WorkspaceEmptyState
            icon={ShieldCheck}
            title="Nenhuma lição aguardando validação"
            description="Quando um registro tiver lição pendente de conferência, ela aparecerá aqui para formalização ou superação."
          />
        ) : (
          <div className="validation-list">
            {pending.map((record) => {
              const cause = vocabulary.find((term) => term.id === record.deviationCauseId)?.label ?? "—";
              const highlighted = highlightedRecordId === record.id;
              return (
                <article
                  key={record.id}
                  id={`validation-record-${record.id}`}
                  className={`validation-card${highlighted ? " validation-card--highlighted" : ""}`}
                >
                  <div>
                    <strong>{record.recordNumber}</strong>
                    <span>{record.company} · {record.service}</span>
                    <p>{record.lesson}</p>
                    <div className="validation-card__meta">
                      <RecordLessonDetailBadge status={record.lessonStatus} />
                      <span
                        className={`status-pill status-pill--${record.visibility === "RESTRICTED" ? "warning" : "neutral"}`}
                      >
                        {VISIBILITY_LABELS[record.visibility]}
                      </span>
                      <span className="validation-card__cause">Causa: {cause}</span>
                    </div>
                    <Link href={getRecordDetailPath(record.id, "C")} className="validation-card__record-link">
                      Abrir registro
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="validation-card__actions">
                    <Button type="button" size="lg" onClick={() => formalize(record.id)}>Formalizar</Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => supersede(record.id)}>Superar</Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
