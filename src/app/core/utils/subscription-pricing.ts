import { formatMoneyWithCode } from './format-currency';

export interface SubscriptionPricing {
  country: string;
  currency: string;
  monthly: number;
  yearly: number;
}

/** Цены Pro по стране (можно вынести на бэкенд позже). */
const PRICING_BY_COUNTRY: Record<string, SubscriptionPricing> = {
  // Еврозона (Австрия, Германия) — базовый платежеспособный рынок.
  // Оставляем стандартную психологическую цену для подписок начального уровня.
  AT: { country: 'AT', currency: 'EUR', monthly: 9.99, yearly: 99.99 },
  DE: { country: 'DE', currency: 'EUR', monthly: 9.99, yearly: 99.99 },

  // Польша — должна быть эквивалентна или чуть дешевле еврозоны.
  // 39 PLN — это около €9. Отличный порог входа для польского рынка.
  PL: { country: 'PL', currency: 'PLN', monthly: 39, yearly: 390 },

  // США — цена приведена к европейскому стандарту.
  // $11.99 — психологически комфортная цена для подписки в США.
  US: { country: 'US', currency: 'USD', monthly: 11.99, yearly: 119.99 },

  // Казахстан — 8900 KZT было слишком дорого.
  // 3900 KZT (около €8) — адекватная стоимость, сопоставимая с подпиской на местный софт.
  KZ: { country: 'KZ', currency: 'KZT', monthly: 3900, yearly: 39000 },

  // Беларусь — 39 BYN за B2B утилиту для физлиц многовато.
  // 19.99 BYN (около €5.5) — идеальный баланс, чтобы платили массово.
  BY: { country: 'BY', currency: 'BYN', monthly: 19.99, yearly: 199.99 },

  // Россия — 1490 RUB за узкую CRM блокирует конверсию.
  // 590 RUB (около €6) — стандартная цена для локальных сервисов учета/записи.
  RU: { country: 'RU', currency: 'RUB', monthly: 590, yearly: 5900 },

  // Украина — ~€9 в гривне, сопоставимо с PL/EU entry.
  UA: { country: 'UA', currency: 'UAH', monthly: 399, yearly: 3990 },
};

const DEFAULT_PRICING = PRICING_BY_COUNTRY['AT'];

export function getSubscriptionPricing(country: string | null | undefined): SubscriptionPricing {
  const code = String(country ?? 'AT')
    .trim()
    .toUpperCase();
  return PRICING_BY_COUNTRY[code] ?? DEFAULT_PRICING;
}

export function formatSubscriptionPrice(amount: number, currency: string, locale: string): string {
  const fractionDigits = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
  return formatMoneyWithCode(amount, currency, locale, fractionDigits);
}
