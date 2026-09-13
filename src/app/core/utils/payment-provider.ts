/** Tribute-only CIS rails. Ukraine is not CIS → Stripe. */
export const CIS_PAYMENT_COUNTRIES = Object.freeze([
  'AM',
  'AZ',
  'BY',
  'KG',
  'MD',
  'RU',
  'TJ',
  'TM',
  'UZ',
] as const);

/** Both Stripe and Tribute offered when ready (user chooses). */
export const MIXED_PAYMENT_COUNTRIES = Object.freeze(['KZ'] as const);

export type CisPaymentCountry = (typeof CIS_PAYMENT_COUNTRIES)[number];
export type MixedPaymentCountry = (typeof MIXED_PAYMENT_COUNTRIES)[number];
export type PaymentProviderId = 'stripe' | 'tribute';
export type PaymentRail = 'stripe' | 'tribute' | 'mixed';

const CIS_SET = new Set<string>(CIS_PAYMENT_COUNTRIES);
const MIXED_SET = new Set<string>(MIXED_PAYMENT_COUNTRIES);

export function normalizePaymentCountry(country: string | null | undefined): string {
  return String(country ?? 'AT')
    .trim()
    .toUpperCase();
}

export function isCisPaymentCountry(country: string | null | undefined): boolean {
  return CIS_SET.has(normalizePaymentCountry(country));
}

export function isMixedPaymentCountry(country: string | null | undefined): boolean {
  return MIXED_SET.has(normalizePaymentCountry(country));
}

export function paymentRailForCountry(country: string | null | undefined): PaymentRail {
  const code = normalizePaymentCountry(country);
  if (MIXED_SET.has(code)) {
    return 'mixed';
  }
  if (CIS_SET.has(code)) {
    return 'tribute';
  }
  return 'stripe';
}

/** Preferred default rail: mixed → Stripe first, CIS → Tribute, else Stripe. */
export function paymentProviderForCountry(
  country: string | null | undefined,
): PaymentProviderId {
  const rail = paymentRailForCountry(country);
  if (rail === 'tribute') {
    return 'tribute';
  }
  return 'stripe';
}

/**
 * Providers the user may use for this country given readiness flags.
 * Mixed: both when ready. CIS: Tribute, Stripe only as fallback. Else: Stripe.
 */
export function allowedPaymentProviders(
  country: string | null | undefined,
  options: { tributeReady: boolean; stripeReady?: boolean },
): PaymentProviderId[] {
  const stripeReady = options.stripeReady !== false;
  const tributeReady = options.tributeReady === true;
  const rail = paymentRailForCountry(country);

  if (rail === 'mixed') {
    const out: PaymentProviderId[] = [];
    if (stripeReady) {
      out.push('stripe');
    }
    if (tributeReady) {
      out.push('tribute');
    }
    if (out.length) {
      return out;
    }
    return stripeReady ? ['stripe'] : ['tribute'];
  }

  if (rail === 'tribute') {
    if (tributeReady) {
      return ['tribute'];
    }
    if (stripeReady) {
      return ['stripe'];
    }
    return ['tribute'];
  }

  return stripeReady ? ['stripe'] : [];
}

export function isPaymentProviderAllowed(
  country: string | null | undefined,
  provider: PaymentProviderId,
  options: { tributeReady: boolean; stripeReady?: boolean },
): boolean {
  return allowedPaymentProviders(country, options).includes(provider);
}

/**
 * Default selected rail from allowed list (preferred first when present).
 */
export function resolvePaymentProvider(
  country: string | null | undefined,
  options: { tributeReady: boolean; stripeReady?: boolean },
): PaymentProviderId {
  const allowed = allowedPaymentProviders(country, options);
  const preferred = paymentProviderForCountry(country);
  if (allowed.includes(preferred)) {
    return preferred;
  }
  return allowed[0] ?? preferred;
}

/** Tribute Shop API only accepts eur / rub / usd. */
export function tributeCurrencyForCountry(country: string | null | undefined): 'eur' | 'rub' | 'usd' {
  return normalizePaymentCountry(country) === 'RU' ? 'rub' : 'eur';
}
