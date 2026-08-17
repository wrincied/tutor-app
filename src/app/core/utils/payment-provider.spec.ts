import { describe, expect, it } from 'vitest';
import {
  allowedPaymentProviders,
  isCisPaymentCountry,
  isMixedPaymentCountry,
  isPaymentProviderAllowed,
  paymentProviderForCountry,
  paymentRailForCountry,
  resolvePaymentProvider,
  tributeCurrencyForCountry,
} from './payment-provider';

describe('paymentProvider', () => {
  it('routes CIS to Tribute', () => {
    expect(paymentProviderForCountry('RU')).toBe('tribute');
    expect(paymentProviderForCountry('by')).toBe('tribute');
    expect(isCisPaymentCountry('UZ')).toBe(true);
    expect(isCisPaymentCountry('KZ')).toBe(false);
  });

  it('routes KZ to mixed with Stripe preferred', () => {
    expect(paymentRailForCountry('KZ')).toBe('mixed');
    expect(isMixedPaymentCountry('kz')).toBe(true);
    expect(paymentProviderForCountry('KZ')).toBe('stripe');
    expect(
      allowedPaymentProviders('KZ', { tributeReady: true, stripeReady: true }),
    ).toEqual(['stripe', 'tribute']);
    expect(
      isPaymentProviderAllowed('KZ', 'stripe', { tributeReady: true, stripeReady: true }),
    ).toBe(true);
    expect(
      isPaymentProviderAllowed('KZ', 'tribute', { tributeReady: true, stripeReady: true }),
    ).toBe(true);
  });

  it('routes non-CIS including UA to Stripe', () => {
    expect(paymentProviderForCountry('AT')).toBe('stripe');
    expect(paymentProviderForCountry('DE')).toBe('stripe');
    expect(paymentProviderForCountry('UA')).toBe('stripe');
    expect(paymentProviderForCountry('US')).toBe('stripe');
  });

  it('falls back to Stripe when Tribute is not ready for CIS', () => {
    expect(resolvePaymentProvider('RU', { tributeReady: false, stripeReady: true })).toBe(
      'stripe',
    );
    expect(resolvePaymentProvider('BY', { tributeReady: true, stripeReady: true })).toBe(
      'tribute',
    );
    expect(resolvePaymentProvider('AT', { tributeReady: false, stripeReady: true })).toBe(
      'stripe',
    );
  });

  it('Tribute currency is rub only for RU', () => {
    expect(tributeCurrencyForCountry('RU')).toBe('rub');
    expect(tributeCurrencyForCountry('BY')).toBe('eur');
    expect(tributeCurrencyForCountry('KZ')).toBe('eur');
  });
});
