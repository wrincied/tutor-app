import type { Expense, FinanceSummary } from '@interfaces';

/** Hard-coded preview for Free-plan finance teaser (not real tutor data). */
export function createFinanceTeaserDemo(currency = 'EUR'): {
  summary: FinanceSummary;
  expenses: Expense[];
} {
  const code = (currency || 'EUR').toUpperCase();
  const rates: Record<string, number> = {
    EUR: 1,
    USD: 1.08,
    PLN: 4.3,
    RUB: 98,
    BYN: 3.5,
    KZT: 520,
    UAH: 42,
  };
  if (!rates[code]) {
    rates[code] = 1;
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const day = (d: number) => `${y}-${m}-${String(Math.min(d, 28)).padStart(2, '0')}`;
  const asOf = day(Math.min(now.getDate(), 28));

  const expenses: Expense[] = [
    {
      _id: 'demo-exp-1',
      title: 'Zoom Pro',
      amount: 15.99,
      currency: code,
      expense_date: day(1),
      category: 'Software',
      createdAt: `${day(1)}T10:00:00.000Z`,
    },
    {
      _id: 'demo-exp-2',
      title: 'Arbeitsmaterial',
      amount: 42.5,
      currency: code,
      expense_date: day(8),
      category: 'Material',
      createdAt: `${day(8)}T10:00:00.000Z`,
    },
    {
      _id: 'demo-exp-3',
      title: 'Coworking',
      amount: 89,
      currency: code,
      expense_date: day(12),
      category: 'Raum',
      createdAt: `${day(12)}T10:00:00.000Z`,
    },
  ];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = 1840;
  const scheduledIncome = 620;
  const grossProfit = totalIncome - totalExpenses;
  const socialInsuranceRate = 0.185;
  const socialInsurance = Math.round(grossProfit * socialInsuranceRate * 100) / 100;
  const taxableBase = Math.round((grossProfit - socialInsurance) * 100) / 100;
  const incomeTax = Math.round(taxableBase * 0.2 * 100) / 100;
  const netProfit = Math.round((grossProfit - socialInsurance - incomeTax) * 100) / 100;

  const summary: FinanceSummary = {
    currency: code,
    defaultCurrency: code,
    country: 'AT',
    tax_mode: 'at-self-employed',
    period: { from: null, to: null },
    exchangeRates: {
      base: 'EUR',
      reportCurrency: code,
      asOf,
      source: 'Demo',
      rates,
    },
    totals: {
      lessonCount: 32,
      scheduledLessonCount: 8,
      completedLessonCount: 24,
      missedLessonCount: 1,
      canceledLessonCount: 2,
      totalLessonHours: 28,
      completedLessonHours: 22,
      scheduledLessonHours: 6,
      expenseCount: expenses.length,
    },
    income: {
      totalIncome,
      scheduledIncome,
      combinedIncome: totalIncome + scheduledIncome,
      totalExpenses,
      grossProfit,
      byCurrency: { [code]: totalIncome },
      scheduledByCurrency: { [code]: scheduledIncome },
      combinedByCurrency: { [code]: totalIncome + scheduledIncome },
    },
    tax: {
      mode: 'at-self-employed',
      socialInsuranceRate,
      socialInsurance,
      taxableBase,
      incomeTax,
      netProfit,
    },
    austria: {
      mode: 'at-self-employed',
      socialInsuranceRate,
      socialInsurance,
      taxableBase,
      incomeTax,
      netProfit,
    },
    lessonsBreakdown: [
      {
        id: 'demo-lesson-1',
        studentId: 'demo-s1',
        studentName: 'Anna M.',
        scheduledAt: `${day(10)}T15:00:00.000Z`,
        occurrenceDate: day(10),
        status: 'completed',
        durationMinutes: 60,
        amountReport: 45,
        amountOriginal: 45,
        currency: code,
        visibleInCalendar: true,
        isRecurring: true,
        incomeType: 'completed',
      },
      {
        id: 'demo-lesson-2',
        studentId: 'demo-s2',
        studentName: 'Jonas K.',
        scheduledAt: `${day(11)}T17:00:00.000Z`,
        occurrenceDate: day(11),
        status: 'completed',
        durationMinutes: 90,
        amountReport: 68,
        amountOriginal: 68,
        currency: code,
        visibleInCalendar: true,
        isRecurring: false,
        incomeType: 'completed',
      },
      {
        id: 'demo-lesson-3',
        studentId: 'demo-s3',
        studentName: 'Sofia R.',
        scheduledAt: `${day(18)}T16:00:00.000Z`,
        occurrenceDate: day(18),
        status: 'scheduled',
        durationMinutes: 60,
        amountReport: 50,
        amountOriginal: 50,
        currency: code,
        visibleInCalendar: true,
        isRecurring: true,
        incomeType: 'scheduled',
      },
    ],
    expensesBreakdown: expenses.map((e) => ({
      id: e._id,
      title: e.title,
      amount: e.amount,
      currency: e.currency ?? code,
      amountReport: e.amount,
      expense_date: e.expense_date,
      category: e.category ?? '',
    })),
  };

  return { summary, expenses };
}
