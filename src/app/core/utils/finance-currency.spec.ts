import { describe, expect, it } from 'vitest';
import { convertWithEurRates } from './finance-currency';

describe('convertWithEurRates', () => {
  const rates = { EUR: 1, RUB: 98, USD: 1.09, PLN: 4.3 };

  it('returns 0 for NaN or zero amount', () => {
    expect(convertWithEurRates(0, 'RUB', 'EUR', rates)).toBe(0);
    expect(convertWithEurRates(Number.NaN, 'RUB', 'EUR', rates)).toBe(0);
  });

  it('converts RUB to EUR', () => {
    expect(convertWithEurRates(9800, 'RUB', 'EUR', rates)).toBe(100);
  });

  it('converts EUR to USD', () => {
    expect(convertWithEurRates(100, 'EUR', 'USD', rates)).toBe(109);
  });

  it('returns rounded same currency amount', () => {
    expect(convertWithEurRates(10.556, 'eur', 'EUR', rates)).toBe(10.56);
  });

  it('returns original amount when rate is missing', () => {
    expect(convertWithEurRates(50, 'RUB', 'EUR', { EUR: 1 })).toBe(50);
  });

  it('converts between two non-EUR currencies via EUR base', () => {
    expect(convertWithEurRates(9800, 'RUB', 'USD', rates)).toBe(109);
  });
});
