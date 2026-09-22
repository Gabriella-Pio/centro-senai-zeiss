import type { QuoteRequest, RequestStatus } from '@/app/(workspace)/solicitacoes/types';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { UserRole } from './api';
import { DEMO_USERS } from './demo/seed/users';

export type RequestAction = 'assign' | 'reassign' | 'convert' | 'archive' | 'openRecord';

const TERMINAL_STATUSES = new Set<RequestStatus>(['CONVERTED', 'ARCHIVED']);

export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  if (from === to || TERMINAL_STATUSES.has(from)) {
    return false;
  }
  if (to === 'ASSIGNED') {
    return from === 'NEW' || from === 'ASSIGNED';
  }
  if (to === 'CONVERTED') {
    return from === 'NEW' || from === 'ASSIGNED';
  }
  if (to === 'ARCHIVED') {
    return from === 'NEW' || from === 'ASSIGNED';
  }
  return false;
}

export function getAllowedActions(
  request: QuoteRequest,
  _currentUserRole?: UserRole,
): RequestAction[] {
  switch (request.status) {
    case 'NEW':
      return ['assign', 'convert', 'archive'];
    case 'ASSIGNED':
      return ['reassign', 'convert', 'archive'];
    case 'CONVERTED':
      return request.linkedRecordId ? ['openRecord'] : [];
    default:
      return [];
  }
}

export function getAssignableUsers() {
  return DEMO_USERS.filter(
    (user) => user.active && (user.role === 'VALIDADOR' || user.role === 'TECNICO'),
  );
}

export function assignRequest(
  request: QuoteRequest,
  userId: string,
  userName: string,
): QuoteRequest {
  if (!canTransition(request.status, 'ASSIGNED') && request.status !== 'ASSIGNED') {
    throw new Error(`Cannot assign request in status ${request.status}`);
  }
  return {
    ...request,
    status: 'ASSIGNED',
    assignedToUserId: userId,
    assignedToName: userName,
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

type LegacyQuoteRequest = Omit<QuoteRequest, 'status'> & { status?: string };

export function upgradeQuoteRequest(request: LegacyQuoteRequest): QuoteRequest {
  const status = request.status ?? 'NEW';
  if (status === 'IN_REVIEW') {
    return {
      ...request,
      status: 'ASSIGNED',
    };
  }
  if (
    request.id === 'request-3' &&
    request.linkedRecordNumber === 'RS-2026-0001' &&
    !request.linkedRecordId
  ) {
    return {
      ...request,
      status: status as RequestStatus,
      linkedRecordId: 'record-1',
    };
  }
  return {
    ...request,
    status: status as RequestStatus,
  };
}
