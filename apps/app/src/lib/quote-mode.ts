import type { QuoteMode, ServiceRecord } from '@/app/(workspace)/registros/types';

export const QUOTE_MODE_LABELS: Record<QuoteMode, string> = {
  tariff: 'Tarifa',
  commercial_fixed: 'Valor fechado (proposta)',
  hourly_package: 'Pacote / contrato de horas',
};

export const QUOTE_MODE_DESCRIPTIONS: Record<QuoteMode, string> = {
  tariff: 'Orçamento calculado pelas tarifas cadastradas. Valor divergente exige justificativa.',
  commercial_fixed: 'Valor comercial fechado da proposta (FO-022). A tarifa serve apenas como referência.',
  hourly_package: 'Contrato ou pacote de horas com taxa e volume definidos (ex.: Cargill, crédito Gabitec).',
};

export function getRecordQuoteMode(record: ServiceRecord): QuoteMode {
  return record.quoteMode ?? 'tariff';
}

export function needsPriceOverrideReason(
  record: ServiceRecord,
  suggestedPrice: number,
): boolean {
  if (getRecordQuoteMode(record) !== 'tariff') {
    return false;
  }
  if (!record.proposedValue || suggestedPrice <= 0) {
    return false;
  }
  return Math.abs(record.proposedValue - suggestedPrice) > suggestedPrice * 0.05;
}

export function isHourlyPackageMode(record: ServiceRecord) {
  return getRecordQuoteMode(record) === 'hourly_package';
}
