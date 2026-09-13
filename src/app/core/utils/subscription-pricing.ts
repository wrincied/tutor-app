import { formatMoneyWithCode } from './format-currency';

export type SubscriptionPlanId = 'basis' | 'pro';

export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

/** Цены Pro по стране (можно вынести на бэкенд позже). */
const PRO_PRICING_BY_COUNTRY: Record<string, SubscriptionPricing> = {
  AT: { country: 'AT', currency: 'EUR', monthly: 9.99, yearly: 99.99 },
  DE: { country: 'DE', currency: 'EUR', monthly: 9.99, yearly: 99.99 },
  PL: { country: 'PL', currency: 'PLN', monthly: 39, yearly: 390 },
  US: { country: 'US', currency: 'USD', monthly: 11.99, yearly: 119.99 },
  KZ: { country: 'KZ', currency: 'KZT', monthly: 3900, yearly: 39000 },
  BY: { country: 'BY', currency: 'BYN', monthly: 25.99, yearly: 259.99 },
  RU: { country: 'RU', currency: 'RUB', monthly: 790, yearly: 7900 },
  UA: { country: 'UA', currency: 'UAH', monthly: 399, yearly: 3990 },
};

/** Basis ≈ 60% of Pro entry (AT: 5.99 / 59.99). */
const BASIS_PRICING_BY_COUNTRY: Record<string, SubscriptionPricing> = {
  AT: { country: 'AT', currency: 'EUR', monthly: 5.99, yearly: 59.99 },
  DE: { country: 'DE', currency: 'EUR', monthly: 5.99, yearly: 59.99 },
  PL: { country: 'PL', currency: 'PLN', monthly: 23, yearly: 230 },
  US: { country: 'US', currency: 'USD', monthly: 6.99, yearly: 69.99 },
  KZ: { country: 'KZ', currency: 'KZT', monthly: 2300, yearly: 23000 },
  BY: { country: 'BY', currency: 'BYN', monthly: 15.99, yearly: 159.99 },
  RU: { country: 'RU', currency: 'RUB', monthly: 479, yearly: 4790 },
  UA: { country: 'UA', currency: 'UAH', monthly: 239, yearly: 2390 },
};

const DEFAULT_PRO = PRO_PRICING_BY_COUNTRY['AT'];
const DEFAULT_BASIS = BASIS_PRICING_BY_COUNTRY['AT'];

function normalizeCountry(country: string | null | undefined): string {
  return String(country ?? 'AT')
    .trim()
    .toUpperCase();
}

/** Pro pricing (default / backward-compatible). */
export function getSubscriptionPricing(country: string | null | undefined): SubscriptionPricing {
  const code = normalizeCountry(country);
  return PRO_PRICING_BY_COUNTRY[code] ?? DEFAULT_PRO;
}

export function getPlanPricing(
  plan: SubscriptionPlanId,
  country: string | null | undefined,
): SubscriptionPricing {
  const code = normalizeCountry(country);
  if (plan === 'basis') {
    return BASIS_PRICING_BY_COUNTRY[code] ?? DEFAULT_BASIS;
  }
  return PRO_PRICING_BY_COUNTRY[code] ?? DEFAULT_PRO;
}

export function formatSubscriptionPrice(amount: number, currency: string, locale: string): string {
  const fractionDigits = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
  return formatMoneyWithCode(amount, currency, locale, fractionDigits);
}

export const EARLY_ADOPTER_YEARLY_EUR = 59.99;
const STANDARD_YEARLY_EUR = 99.99;

export function getEarlyAdopterYearly(pricing: SubscriptionPricing): number {
  if (String(pricing.currency).toUpperCase() === 'EUR') {
    return EARLY_ADOPTER_YEARLY_EUR;
  }
  return Math.round(pricing.yearly * (EARLY_ADOPTER_YEARLY_EUR / STANDARD_YEARLY_EUR) * 100) / 100;
}
