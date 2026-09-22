import type { QuoteMode, ServiceRecord, ServiceStage } from '@/app/(workspace)/registros/types';
import type { QuoteRequest } from '@/app/(workspace)/solicitacoes/types';
import {
  buildStageQuoteSnapshot,
  computeStageQuoteCost,
} from '../../pricing';
import { DEFAULT_LAB_SETTINGS } from '../../demo/demo-store-types';
import { deriveRelatedTopicIds } from '../../record-helpers';
import { SEED_VOCABULARY } from './vocabulary';
import type { CatalogStage, RealProposal } from './proposals-catalog';
import { REAL_PROPOSALS } from './proposals-catalog';

function proposalYear(proposal: RealProposal) {
  return proposal.proposalDate.slice(0, 4);
}

function sequenceNumber(proposals: RealProposal[], proposal: RealProposal) {
  const year = proposalYear(proposal);
  const index = proposals.filter((item) => proposalYear(item) === year).indexOf(proposal);
  return String(index + 1).padStart(4, '0');
}

function requestNumber(proposal: RealProposal) {
  return `SO-${proposalYear(proposal)}-${sequenceNumber(REAL_PROPOSALS, proposal)}`;
}

function recordNumber(proposal: RealProposal) {
  return `RS-${proposalYear(proposal)}-${sequenceNumber(REAL_PROPOSALS, proposal)}`;
}

function toServiceStages(proposal: RealProposal): ServiceStage[] {
  if (!proposal.stages?.length) {
    return [];
  }
  return proposal.stages.map((stage, index) => ({
    id: `${proposal.id}-stage-${index + 1}`,
    serviceTypeId: stage.serviceTypeId,
    label: stage.label,
    resourceId: stage.resourceId,
    resourceIds: [stage.resourceId],
    estimatedHours: stage.estimatedHours,
    actualHours: stage.actualHours ?? null,
  }));
}

function priceFromStages(
  stages: ServiceStage[],
  options: {
    quantity?: number;
    savedAt?: string;
    hoursField?: 'estimatedHours' | 'actualHours';
  } = {},
) {
  const quantity = options.quantity ?? 1;
  const snapshot = buildStageQuoteSnapshot({
    vocabulary: SEED_VOCABULARY,
    stages,
    labSettings: DEFAULT_LAB_SETTINGS,
  });
  if (options.savedAt) {
    snapshot.savedAt = options.savedAt;
  }
  const breakdown = computeStageQuoteCost({
    vocabulary: SEED_VOCABULARY,
    stages,
    labSettings: DEFAULT_LAB_SETTINGS,
    quantity,
    hoursField: options.hoursField,
  });
  return {
    quoteSnapshot: { ...snapshot, breakdown },
    tariffPrice: breakdown.suggestedPrice,
  };
}

function sumStageHours(stages: CatalogStage[], field: 'estimatedHours' | 'actualHours') {
  const total = stages.reduce((sum, stage) => sum + (stage[field] ?? 0), 0);
  return total > 0 ? total : null;
}

function resolveQuoteMode(proposal: RealProposal): QuoteMode {
  if (proposal.quoteMode) {
    return proposal.quoteMode;
  }
  if (proposal.hoursPackageRef) {
    return 'hourly_package';
  }
  return 'commercial_fixed';
}

function buildRecord(proposal: RealProposal, requestId: string, requestNum: string): ServiceRecord {
  const quoteMode = resolveQuoteMode(proposal);
  const stages = toServiceStages(proposal);
  const quantity = proposal.quantity ?? 1;
  const hasStages = stages.length > 0;
  const estimatedPerPiece = hasStages
    ? sumStageHours(proposal.stages!, 'estimatedHours')
    : proposal.totalHours ?? null;
  const actualPerPiece = hasStages
    ? sumStageHours(proposal.stages!, 'actualHours')
    : proposal.actualHours ?? null;

  let quoteSnapshot = undefined;
  let estimatedCost: number | null = null;

  if (hasStages) {
    const priced = priceFromStages(stages, {
      quantity: proposal.recordKind === 'batch' ? quantity : 1,
      savedAt: proposal.proposalDate,
    });
    quoteSnapshot = priced.quoteSnapshot;
    estimatedCost = priced.tariffPrice;
  }

  const recordStatus = proposal.recordStatus ?? 'DRAFT';
  const isCompleted = recordStatus === 'COMPLETED';

  let actualCost = null;
  if (isCompleted && hasStages && actualPerPiece) {
    actualCost = priceFromStages(stages, {
      quantity: proposal.recordKind === 'batch' ? quantity : 1,
      hoursField: 'actualHours',
    }).tariffPrice;
    if (quoteMode !== 'tariff') {
      actualCost = proposal.totalValue;
    }
  } else if (isCompleted) {
    actualCost = proposal.totalValue;
  }

  const serviceLabel =
    proposal.stages && proposal.stages.length > 1
      ? proposal.stages.map((stage) => stage.label).join(' + ')
      : proposal.service;

  const record: ServiceRecord = {
    id: `record-${proposal.id.replace('proposal-', '')}`,
    recordNumber: recordNumber(proposal),
    requestId,
    requestNumber: requestNum,
    company: proposal.company,
    service: serviceLabel,
    requester: proposal.requester,
    createdAt: proposal.proposalDate,
    isDemo: true,
    recordKind: proposal.recordKind,
    quantity: proposal.recordKind === 'batch' ? quantity : proposal.quantity,
    batchLabel: proposal.batchLabel,
    hoursPackageRef: proposal.hoursPackageRef,
    quoteMode,
    stages: hasStages ? stages : undefined,
    serviceTypeId: proposal.serviceTypeId,
    partTraitIds: proposal.partTraitIds,
    resourceIds: proposal.resourceIds,
    estimatedHours: estimatedPerPiece ?? proposal.totalHours ?? null,
    estimatedCost,
    proposedValue: proposal.totalValue,
    priceOverrideReason: quoteMode === 'tariff' ? proposal.priceOverrideReason : undefined,
    quoteSnapshot,
    assumptions: [proposal.assumptions, proposal.paymentTerms ? `Pagamento: ${proposal.paymentTerms}` : '']
      .filter(Boolean)
      .join(' '),
    estimatedBy: proposal.recordStatus && proposal.recordStatus !== 'DRAFT' ? 'João' : undefined,
    equipment: proposal.equipment,
    serviceStatus: recordStatus,
    actualHours: isCompleted ? (actualPerPiece ?? proposal.actualHours ?? estimatedPerPiece) : null,
    actualCost: isCompleted ? actualCost : null,
    billedValue: isCompleted ? proposal.totalValue : null,
    deliveredAt: isCompleted ? proposal.deliveredAt ?? null : null,
    rework: false,
    scopeChange: proposal.scopeChange ?? false,
    deviationCauseId: isCompleted ? (proposal.deviationCauseId ?? null) : null,
    lesson: isCompleted ? (proposal.lesson ?? '') : '',
    relatedTopicIds: [],
    visibility: 'PUBLIC',
    lessonStatus: isCompleted ? (proposal.lessonStatus ?? 'DRAFT') : 'DRAFT',
  };

  record.relatedTopicIds = deriveRelatedTopicIds(record);
  return record;
}

function buildRequest(proposal: RealProposal): QuoteRequest {
  const reqNum = requestNumber(proposal);
  const recordId = proposal.hasRecord
    ? `record-${proposal.id.replace('proposal-', '')}`
    : undefined;

  const request: QuoteRequest = {
    id: `request-${proposal.id.replace('proposal-', '')}`,
    requestNumber: reqNum,
    requester: proposal.requester,
    company: proposal.company,
    email: proposal.email,
    phone: proposal.phone,
    service: proposal.service,
    message: proposal.message,
    receivedAt: proposal.proposalDate,
    status: proposal.requestStatus,
    assignedToUserId: proposal.assignedToUserId,
    assignedToName: proposal.assignedToName,
    linkedRecordId: recordId,
    linkedRecordNumber: recordId ? recordNumber(proposal) : undefined,
  };

  return request;
}

export function buildSeedRequests(): QuoteRequest[] {
  return REAL_PROPOSALS.map(buildRequest);
}

export function buildSeedRecords(): ServiceRecord[] {
  return REAL_PROPOSALS.filter((proposal) => proposal.hasRecord).map((proposal) => {
    const requestId = `request-${proposal.id.replace('proposal-', '')}`;
    const requestNum = requestNumber(proposal);
    return buildRecord(proposal, requestId, requestNum);
  });
}
