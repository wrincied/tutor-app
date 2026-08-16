import { describe, expect, it } from 'vitest';
import {
  isCisPaymentCountry,
  paymentProviderForCountry,
  resolvePaymentProvider,
  tributeCurrencyForCountry,
} from './payment-provider';

describe('payment-provider', () => {
  it('routes CIS countries to Tribute', () => {
    expect(paymentProviderForCountry('RU')).toBe('tribute');
    expect(paymentProviderForCountry('by')).toBe('tribute');
    expect(paymentProviderForCountry('KZ')).toBe('tribute');
    expect(isCisPaymentCountry('UZ')).toBe(true);
  });

  it('routes non-CIS (incl. UA, AT) to Stripe', () => {
    expect(paymentProviderForCountry('AT')).toBe('stripe');
    expect(paymentProviderForCountry('DE')).toBe('stripe');
    expect(paymentProviderForCountry('UA')).toBe('stripe');
    expect(paymentProviderForCountry('US')).toBe('stripe');
  });

  it('falls back to Stripe when Tribute is not ready', () => {
    expect(
      resolvePaymentProvider('RU', { tributeReady: false, stripeReady: true }),
    ).toBe('stripe');
    expect(
      resolvePaymentProvider('BY', { tributeReady: true, stripeReady: true }),
    ).toBe('tribute');
    expect(
      resolvePaymentProvider('AT', { tributeReady: false, stripeReady: true }),
    ).toBe('stripe');
  });

  it('uses RUB only for Russia in Tribute checkout', () => {
    expect(tributeCurrencyForCountry('RU')).toBe('rub');
    expect(tributeCurrencyForCountry('BY')).toBe('eur');
    expect(tributeCurrencyForCountry('KZ')).toBe('eur');
  });
});
