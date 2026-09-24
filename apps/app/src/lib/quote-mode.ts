import type { QuoteMode, ServiceRecord } from '@/app/(workspace)/registros/types';

export const QUOTE_MODE_LABELS: Record<QuoteMode, string> = {
  tariff: 'Tarifa',
  commercial_fixed: 'Valor fechado (proposta)',
  hourly_package: 'Pacote / contrato de horas',
};

export const QUOTE_MODE_DESCRIPTIONS: Record<QuoteMode, string> = {
  tariff:
    'Orçamento calculado pelas tarifas cadastradas para mão de obra e recursos do laboratório.',
  commercial_fixed:
    'Valor comercial definido na proposta. A tarifa pode servir como referência de custo, mas não determina o preço final.',
  hourly_package:
    'Contrato ou pacote com quantidade de horas e condições comerciais previamente definidas.',
};

export function getRecordQuoteMode(record: ServiceRecord): QuoteMode {
  return record.quoteMode ?? 'tariff';
}

/**
 * Verifica se o valor informado deve ser justificado por divergir
 * da sugestão calculada pelo modelo de tarifa.
 *
 * A regra se aplica somente ao modo Tarifa.
 * Nos modos Valor fechado e Pacote de horas, o valor comercial
 * não precisa coincidir com a tarifa calculada.
 */
export function needsPriceOverrideReason(record: ServiceRecord, suggestedPrice: number): boolean {
  if (getRecordQuoteMode(record) !== 'tariff') {
    return false;
  }

  if (!record.proposedValue || suggestedPrice <= 0) {
    return false;
  }

  return Math.abs(record.proposedValue - suggestedPrice) > suggestedPrice * 0.05;
}

export function isTariffMode(record: ServiceRecord): boolean {
  return getRecordQuoteMode(record) === 'tariff';
}

export function isCommercialFixedMode(record: ServiceRecord): boolean {
  return getRecordQuoteMode(record) === 'commercial_fixed';
}

export function isHourlyPackageMode(record: ServiceRecord): boolean {
  return getRecordQuoteMode(record) === 'hourly_package';
}
