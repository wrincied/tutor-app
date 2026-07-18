import { describe, expect, it } from 'vitest';
import { formatSubscriptionPrice, getSubscriptionPricing } from './subscription-pricing';

describe('subscription-pricing', () => {
  it('returns country-specific pricing', () => {
    const pl = getSubscriptionPricing('PL');
    expect(pl.currency).toBe('PLN');
    expect(pl.monthly).toBe(39);
  });

  it('returns Ukraine pricing in UAH', () => {
    const ua = getSubscriptionPricing('UA');
    expect(ua.currency).toBe('UAH');
    expect(ua.monthly).toBe(399);
  });

  it('falls back to AT for unknown country', () => {
    expect(getSubscriptionPricing('XX').currency).toBe('EUR');
  });

  it('formats price with currency', () => {
    const formatted = formatSubscriptionPrice(19, 'EUR', 'de-DE');
    expect(formatted).toContain('19');
  });

  it('preserves cents for decimal subscription prices', () => {
    const formatted = formatSubscriptionPrice(9.99, 'EUR', 'de-DE');
    expect(formatted).toMatch(/9[.,]99/);
  });

  it('does not add decimals for whole-number prices', () => {
    const formatted = formatSubscriptionPrice(79, 'PLN', 'pl-PL');
    expect(formatted).toContain('79');
    expect(formatted).not.toMatch(/79[.,]00/);
  });
});
