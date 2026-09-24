import type { QuoteRequest, RequestStatus } from '@/app/(workspace)/solicitacoes/types';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { UserRole } from './api';

export type RequestAction = 'convert' | 'archive' | 'openRecord';

const TERMINAL_STATUSES = new Set<RequestStatus>(['CONVERTED', 'ARCHIVED']);

export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  if (from === to || TERMINAL_STATUSES.has(from)) {
    return false;
  }
  if (to === 'ON_GOING') {
    return from === 'NEW';
  }
  if (to === 'CONVERTED') {
    return from === 'ON_GOING';
  }
  if (to === 'ARCHIVED') {
    return from === 'NEW' || from === 'ON_GOING';
  }
  return false;
}

export function getAllowedActions(
  request: QuoteRequest,
  _currentUserRole?: UserRole,
): RequestAction[] {
  switch (request.status) {
    case 'NEW':
    case 'ON_GOING':
      return ['convert', 'archive'];
    case 'CONVERTED':
      return request.linkedRecordId ? ['openRecord'] : [];
    default:
      return [];
  }
}

export function startRequestState(request: QuoteRequest): QuoteRequest {
  if (!canTransition(request.status, 'ON_GOING')) {
    throw new Error(`Cannot start request in status ${request.status}`);
  }
  return {
    ...request,
    status: 'ON_GOING',
  };
}

export function archiveRequestState(request: QuoteRequest, reason: string): QuoteRequest {
  if (!canTransition(request.status, 'ARCHIVED')) {
    throw new Error(`Cannot archive request in status ${request.status}`);
  }
  return {
    ...request,
    status: 'ARCHIVED',
    archiveReason: reason.trim(),
  };
}

export function convertRequestState(request: QuoteRequest, record: ServiceRecord): QuoteRequest {
  if (!canTransition(request.status, 'CONVERTED')) {
    throw new Error(`Cannot convert request in status ${request.status}`);
  }
  return {
    ...request,
    status: 'CONVERTED',
    linkedRecordNumber: record.recordNumber,
    linkedRecordId: record.id,
  };
}

type LegacyQuoteRequest = Omit<QuoteRequest, 'status'> & {
  status?: string;
  assignedToUserId?: string;
  assignedToName?: string;
};

function normalizeLegacyStatus(status: string | undefined): RequestStatus {
  if (
    status === 'NEW' ||
    status === 'ON_GOING' ||
    status === 'CONVERTED' ||
    status === 'ARCHIVED'
  ) {
    return status;
  }
  if (status === 'ASSIGNED' || status === 'IN_REVIEW') {
    return 'ON_GOING';
  }
  return 'NEW';
}

export function upgradeQuoteRequest(request: LegacyQuoteRequest): QuoteRequest {
  const { assignedToUserId: _userId, assignedToName: _userName, status, ...rest } = request;
  const normalizedStatus = normalizeLegacyStatus(status);

  if (
    request.id === 'request-3' &&
    request.linkedRecordNumber === 'RS-2026-0001' &&
    !request.linkedRecordId
  ) {
    return {
      ...rest,
      status: normalizedStatus,
      linkedRecordId: 'record-1',
    };
  }

  return {
    ...rest,
    status: normalizedStatus,
  };
}
