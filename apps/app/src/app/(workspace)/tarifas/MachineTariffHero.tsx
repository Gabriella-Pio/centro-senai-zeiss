"use client";

import Image from "next/image";
import Link from "next/link";
import { Archive, Calculator } from "lucide-react";
import { Button } from "@cem/ui";
import type { MachineCostComputed, MachineTariff } from "@/lib/machine-tariff";
import { isMachineTariffActive } from "@/lib/machine-tariff-utils";
import { formatCurrency } from "@/lib/pricing";
import { MachineTariffActionsMenu } from "./MachineTariffActionsMenu";
import { TariffFieldHelp } from "./TariffFieldHelp";

type EquipmentImage = {
  src: string;
  alt: string;
};

export function MachineTariffHero({
  tariff,
  computed,
  equipmentImage,
  hasDraft,
  savedMessage,
  canEdit,
  canUndo,
  onUndo,
  onArchived,
  onDeleted,
  onDuplicated,
  onRestore,
  onVocabularyNavigate,
}: {
  tariff: MachineTariff;
  computed: MachineCostComputed;
  equipmentImage?: EquipmentImage;
  hasDraft?: boolean;
  savedMessage?: string | null;
  canEdit?: boolean;
  canUndo?: boolean;
  onUndo?: () => void;
  onArchived?: () => void;
  onDeleted?: () => void;
  onDuplicated?: (tariffId: string) => void;
  onRestore?: () => void;
  onVocabularyNavigate?: () => void;
}) {
  const isArchived = !isMachineTariffActive(tariff);

  return (
    <div
      className={`machine-tariff-hero${equipmentImage ? "" : " machine-tariff-hero--no-photo"}${isArchived ? " machine-tariff-hero--archived" : ""}`}
    >
      {equipmentImage ? (
        <div className="machine-tariff-hero__visual">
          <div className="machine-tariff-hero__photo-frame">
            <Image
              src={equipmentImage.src}
              alt={equipmentImage.alt}
              width={168}
              height={252}
              className="machine-tariff-hero__photo-img"
              priority
            />
          </div>
        </div>
      ) : null}
      <div className="machine-tariff-hero__content">
        <div className="machine-tariff-hero__top">
          <div className="machine-tariff-hero__heading">
            <p className="machine-tariff-hero__eyebrow">
              <Calculator aria-hidden="true" />
              Planilha hora-máquina
              {hasDraft ? (
                <span className="machine-tariff-hero__draft-badge" role="status" aria-live="polite">
                  Alterações não salvas
                </span>
              ) : null}
            </p>
            <h3 className="machine-tariff-hero__title">{tariff.label}</h3>
            <p className="machine-tariff-hero__subtitle">Item 1 editável · itens 2 e 3 calculados automaticamente</p>
            <Link
              href="/vocabulario"
              className="machine-tariff-hero__vocab-link"
              onClick={(event) => {
                if (!onVocabularyNavigate) return;
                event.preventDefault();
                onVocabularyNavigate();
              }}
            >
              Ver no vocabulário
            </Link>
            {!canEdit ? (
              <p className="machine-tariff-hero__readonly-note">
                Somente administradores podem renomear, arquivar ou excluir ativos.
              </p>
            ) : null}
            {savedMessage ? (
              <p className="tariffs-card__saved" role="status">
                {savedMessage}
                {canUndo && onUndo ? (
                  <>
                    {" · "}
                    <button type="button" className="machine-tariff-hero__undo" onClick={onUndo}>
                      Desfazer
                    </button>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          <MachineTariffActionsMenu
            tariff={tariff}
            canEdit={canEdit ?? false}
            onArchived={onArchived}
            onDeleted={onDeleted}
            onDuplicated={onDuplicated}
          />
        </div>
        {isArchived ? (
          <div className="tariffs-archived-banner" role="status">
            <div className="tariffs-archived-banner__content">
              <span className="tariffs-archived-banner__icon" aria-hidden="true">
                <Archive />
              </span>
              <div className="tariffs-archived-banner__copy">
                <strong className="tariffs-archived-banner__title">Ativo arquivado</strong>
                <p className="tariffs-archived-banner__text">
                  Somente consulta. Este ativo não aparece em novos orçamentos.
                </p>
              </div>
            </div>
            {canEdit && onRestore ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="tariffs-archived-banner__action"
                onClick={onRestore}
              >
                Restaurar ativo
              </Button>
            ) : null}
          </div>
        ) : null}
        <div className="machine-tariff-hero__rates">
          <div className="machine-tariff-hero__rate machine-tariff-hero__rate--primary">
            <span className="machine-tariff-hero__rate-label">
              Item 32 · Orçamentos
              <TariffFieldHelp
                label="Item 32 · Orçamentos"
                hint="Tarifa usada nos orçamentos — inclui overhead administrativo."
                formula="Item 31 × (1 + overhead administrativo ÷ 100)"
              />
            </span>
            <strong>{formatCurrency(computed.costWithAdministrative)}/h</strong>
            <small>Usada nos orçamentos</small>
          </div>
          <div className="machine-tariff-hero__rate">
            <span className="machine-tariff-hero__rate-label">
              Item 31 · Operacional
              <TariffFieldHelp
                label="Item 31 · Operacional"
                hint="Custo operacional completo no chão de fábrica."
                formula="Custo fixo/h + variáveis com salário/h"
              />
            </span>
            <strong>{formatCurrency(computed.costWithLabor)}/h</strong>
            <small>Com mão de obra</small>
          </div>
        </div>
      </div>
    </div>
  );
}
