import type { FinancePeriodPreset } from './finance-period';

export type FinanceBreakdownPanel = 'income' | 'expenses' | 'gross' | 'net' | 'lessons';

export const FINANCE_CURRENCY_STORAGE_KEY = 'finance_report_currency';

const PANELS = new Set<FinanceBreakdownPanel>(['income', 'expenses', 'gross', 'net', 'lessons']);

export function isFinanceBreakdownPanel(value: string | null | undefined): value is FinanceBreakdownPanel {
  return Boolean(value && PANELS.has(value as FinanceBreakdownPanel));
}

export function isFinancePeriodPreset(
  value: string | null | undefined,
): value is FinancePeriodPreset {
  return value === 'all' || value === 'month' || value === 'year';
}

export function financeRouteQueryParams(
  period: FinancePeriodPreset,
  currency: string,
): { period: FinancePeriodPreset; currency?: string } {
  return {
    period,
    ...(currency ? { currency } : {}),
  };
}
