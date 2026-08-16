/** CIS members routed to Tribute. Ukraine is not CIS → Stripe. */
export const CIS_PAYMENT_COUNTRIES = Object.freeze([
  'AM',
  'AZ',
  'BY',
  'KZ',
  'KG',
  'MD',
  'RU',
  'TJ',
  'TM',
  'UZ',
] as const);

export type CisPaymentCountry = (typeof CIS_PAYMENT_COUNTRIES)[number];
export type PaymentProviderId = 'stripe' | 'tribute';

const CIS_SET = new Set<string>(CIS_PAYMENT_COUNTRIES);

export function normalizePaymentCountry(country: string | null | undefined): string {
  return String(country ?? 'AT')
    .trim()
    .toUpperCase();
}

export function isCisPaymentCountry(country: string | null | undefined): boolean {
  return CIS_SET.has(normalizePaymentCountry(country));
}

/** Preferred rail by country: СНГ → Tribute, остальные → Stripe. */
export function paymentProviderForCountry(
  country: string | null | undefined,
): PaymentProviderId {
  return isCisPaymentCountry(country) ? 'tribute' : 'stripe';
}

/**
 * Effective rail: preferred Tribute only when Shop/API is ready; otherwise Stripe fallback.
 */
export function resolvePaymentProvider(
  country: string | null | undefined,
  options: { tributeReady: boolean; stripeReady?: boolean },
): PaymentProviderId {
  const preferred = paymentProviderForCountry(country);
  const stripeReady = options.stripeReady !== false;
  if (preferred === 'tribute' && options.tributeReady) {
    return 'tribute';
  }
  if (stripeReady) {
    return 'stripe';
  }
  return preferred;
}

/** Tribute Shop API only accepts eur / rub / usd. */
export function tributeCurrencyForCountry(country: string | null | undefined): 'eur' | 'rub' | 'usd' {
  return normalizePaymentCountry(country) === 'RU' ? 'rub' : 'eur';
}
