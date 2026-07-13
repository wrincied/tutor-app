/**
 * Единый список валют приложения.
 * Используется для ставок учеников, Finance, workspace и конвертации.
 */
export const APP_CURRENCIES = ['EUR', 'USD', 'PLN', 'RUB', 'BYN', 'KZT'] as const;

export type AppCurrency = (typeof APP_CURRENCIES)[number];

/** @deprecated используйте AppCurrency */
export type RateCurrency = AppCurrency;

/** @deprecated используйте AppCurrency */
export type FinanceReportCurrency = AppCurrency;

/** @deprecated используйте AppCurrency */
export type WorkspaceCurrency = AppCurrency;

export const RATE_CURRENCIES: readonly AppCurrency[] = APP_CURRENCIES;
export const FINANCE_REPORT_CURRENCIES: readonly AppCurrency[] = APP_CURRENCIES;
export const WORKSPACE_CURRENCIES: readonly AppCurrency[] = APP_CURRENCIES;
