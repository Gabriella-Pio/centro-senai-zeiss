import { describe, expect, it } from 'vitest';
import {
  extractCnpjFromMessage,
  formatCnpj,
  isValidCnpj,
} from '@/lib/contact-fields';

describe('contact-fields', () => {
  it('formats and validates CNPJ', () => {
    expect(formatCnpj('12345678000195')).toBe('12.345.678/0001-95');
    expect(isValidCnpj('12.345.678/0001-95')).toBe(true);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
  });

  it('extracts CNPJ from solicitation message', () => {
    expect(
      extractCnpjFromMessage('CNPJ: 19.852.082/0001-20\nServiços: Metrologia\nDetalhe'),
    ).toBe('19.852.082/0001-20');
  });
});
