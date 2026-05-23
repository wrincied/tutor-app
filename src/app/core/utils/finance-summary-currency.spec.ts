import { describe, expect, it } from 'vitest';
import type { FinanceSummary } from '@interfaces';
import { remapFinanceSummary } from './finance-summary-currency';

function baseSummary(currency: string, totalIncome: number): FinanceSummary {
  return {
    currency,
    country: 'AT',
    tax_mode: 'none',
    period: { from: null, to: null },
    exchangeRates: {
      base: 'EUR',
      reportCurrency: currency,
      asOf: '2026-05-01',
      source: 'test',
      rates: { EUR: 1, USD: 1.09, RUB: 98 },
    },
    totals: {
      lessonCount: 1,
      scheduledLessonCount: 0,
      completedLessonCount: 1,
      missedLessonCount: 0,
      canceledLessonCount: 0,
      totalLessonHours: 1,
      completedLessonHours: 1,
      scheduledLessonHours: 0,
      expenseCount: 0,
    },
    income: {
      totalIncome,
      scheduledIncome: 0,
      combinedIncome: totalIncome,
      totalExpenses: 0,
      grossProfit: totalIncome,
      byCurrency: { EUR: totalIncome },
      scheduledByCurrency: {},
      combinedByCurrency: { EUR: totalIncome },
    },
    austria: null,
  };
}

describe('remapFinanceSummary', () => {
  it('converts totals to target currency', () => {
    const summary = baseSummary('EUR', 100);
    const remapped = remapFinanceSummary(summary, 'USD');
    expect(remapped.currency).toBe('USD');
    expect(remapped.income.totalIncome).toBe(109);
  });

  it('returns same object when currency unchanged', () => {
    const summary = baseSummary('EUR', 100);
    expect(remapFinanceSummary(summary, 'EUR')).toBe(summary);
  });
});
