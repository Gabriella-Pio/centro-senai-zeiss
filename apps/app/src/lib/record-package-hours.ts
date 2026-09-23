import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import { getRecordQuoteMode } from '@/lib/quote-mode';
import { getRecordStages, sumStageEstimatedHours } from '@/lib/record-stages';
import type { VocabularyTerm } from '@/app/(workspace)/vocabulario/types';

/** Sincroniza horas do pacote com a soma das etapas (modo hourly_package). */
export function syncPackageHoursFromStages(
  record: ServiceRecord,
  serviceTypes: VocabularyTerm[],
): number | null {
  if (getRecordQuoteMode(record) !== 'hourly_package') {
    return null;
  }
  const stages = getRecordStages(record, serviceTypes);
  const stageHours = sumStageEstimatedHours(stages);
  if (!stages.length || !stageHours) {
    return null;
  }
  return stageHours;
}
