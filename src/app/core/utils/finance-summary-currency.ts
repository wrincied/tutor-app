import type { FinanceSummary } from '@interfaces';
import { convertWithEurRates } from './finance-currency';

function convertField(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  return convertWithEurRates(amount, fromCurrency, toCurrency, rates);
}

/** Пересчитывает денежные поля summary в целевую валюту (fallback, если API не конвертировал). */
export function remapFinanceSummary(
  summary: FinanceSummary,
  targetCurrency: string,
): FinanceSummary {
  const target = String(targetCurrency).trim().toUpperCase();
  const from = String(summary.currency).trim().toUpperCase();
  if (!target || from === target) {
    return summary;
  }

  const rates = summary.exchangeRates?.rates;
  if (!rates) {
    return { ...summary, currency: target };
  }

  const convert = (amount: number) => convertField(amount, from, target, rates);
  const income = summary.income;

  return {
    ...summary,
    currency: target,
    exchangeRates: {
      ...summary.exchangeRates,
      reportCurrency: target,
    },
    income: {
      ...income,
      totalIncome: convert(income.totalIncome),
      scheduledIncome: convert(income.scheduledIncome),
      combinedIncome: convert(
        income.combinedIncome ?? income.totalIncome + income.scheduledIncome,
      ),
      totalExpenses: convert(income.totalExpenses),
      grossProfit: convert(income.grossProfit),
      combinedByCurrency: Object.fromEntries(
        Object.entries(income.combinedByCurrency ?? {}).map(([code, amount]) => [
          code,
          convertField(amount, code, target, rates),
        ]),
      ),
    },
    austria: summary.austria
      ? {
          ...summary.austria,
          socialInsurance: convert(summary.austria.socialInsurance),
          taxableBase: convert(summary.austria.taxableBase),
          incomeTax: convert(summary.austria.incomeTax),
          netProfit: convert(summary.austria.netProfit),
        }
      : null,
  };
}

/** Сумма расхода в валюте отчёта. */
export function expenseAmountInReportCurrency(
  amount: number,
  summary: FinanceSummary,
  targetCurrency: string,
  fromCurrency?: string,
): number {
  const target = String(targetCurrency).trim().toUpperCase();
  const from = String(fromCurrency ?? summary.defaultCurrency ?? summary.currency).trim().toUpperCase();
  const rates = summary.exchangeRates?.rates;
  if (!rates || from === target) {
    return amount;
  }
  return convertWithEurRates(amount, from, target, rates);
}
