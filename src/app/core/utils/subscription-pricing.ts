export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

/** Цены Pro по стране (можно вынести на бэкенд позже). */
const PRICING_BY_COUNTRY: Record<string, SubscriptionPricing> = {
  AT: { country: 'AT', currency: 'EUR', monthly: 9.99, yearly: 89.99 },
  DE: { country: 'DE', currency: 'EUR', monthly: 9.99, yearly: 89.99 },
  PL: { country: 'PL', currency: 'PLN', monthly: 79, yearly: 790 },
  RU: { country: 'RU', currency: 'RUB', monthly: 1490, yearly: 14900 },
  BY: { country: 'BY', currency: 'BYN', monthly: 39, yearly: 390 },
  KZ: { country: 'KZ', currency: 'KZT', monthly: 8900, yearly: 89000 },
  US: { country: 'US', currency: 'USD', monthly: 22, yearly: 220 },
};

const DEFAULT_PRICING = PRICING_BY_COUNTRY['AT'];

export function getSubscriptionPricing(country: string | null | undefined): SubscriptionPricing {
  const code = String(country ?? 'AT')
    .trim()
    .toUpperCase();
  return PRICING_BY_COUNTRY[code] ?? DEFAULT_PRICING;
}

export function formatSubscriptionPrice(amount: number, currency: string, locale: string): string {
  const code = String(currency || 'USD')
    .trim()
    .toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'code',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${code}`;
  }
}
