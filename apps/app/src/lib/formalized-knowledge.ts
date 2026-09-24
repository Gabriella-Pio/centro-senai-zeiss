import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { UserRole } from '@/lib/api';

/**
 * Base demo formalizada usada por Indicadores e Assistente:
 * concluída, lição validada, seed de demonstração.
 */
export function isDemoFormalizedCase(record: ServiceRecord): boolean {
  return (
    record.isDemo &&
    record.lessonStatus === 'FORMALIZED' &&
    record.serviceStatus === 'COMPLETED'
  );
}

export function canViewRestrictedRecord(role: UserRole): boolean {
  return role === 'VALIDADOR' || role === 'ADMIN';
}

export function canViewRecord(record: ServiceRecord, role: UserRole): boolean {
  if (record.visibility === 'RESTRICTED' && !canViewRestrictedRecord(role)) {
    return false;
  }
  return true;
}

export function canUseCaseInKnowledge(record: ServiceRecord, viewerRole?: UserRole): boolean {
  if (record.visibility !== 'RESTRICTED') {
    return true;
  }
  if (!viewerRole) {
    return false;
  }
  return canViewRestrictedRecord(viewerRole);
}

/** Lições concluídas aguardando formalização em Validação (Home + Indicadores). */
export function countPendingFormalizationLessons(records: ServiceRecord[], role: UserRole): number {
  return records.filter(
    (record) =>
      canViewRecord(record, role) &&
      record.lessonStatus === 'PENDING' &&
      record.serviceStatus === 'COMPLETED',
  ).length;
}
