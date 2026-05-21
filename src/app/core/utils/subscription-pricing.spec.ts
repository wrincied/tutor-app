import { describe, expect, it } from 'vitest';
import { formatSubscriptionPrice, getSubscriptionPricing } from './subscription-pricing';

describe('subscription-pricing', () => {
  it('returns country-specific pricing', () => {
    const pl = getSubscriptionPricing('PL');
    expect(pl.currency).toBe('PLN');
    expect(pl.monthly).toBe(79);
  });

  it('falls back to AT for unknown country', () => {
    expect(getSubscriptionPricing('XX').currency).toBe('EUR');
  });

  it('formats price with currency', () => {
    const formatted = formatSubscriptionPrice(19, 'EUR', 'de-DE');
    expect(formatted).toContain('19');
  });
});
