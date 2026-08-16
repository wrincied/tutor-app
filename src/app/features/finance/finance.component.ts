import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import {
  FINANCE_REPORT_CURRENCIES,
  type Expense,
  type FinanceExpenseBreakdown,
  type FinanceSummary,
} from '@interfaces';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  financePeriodRange,
  type FinancePeriodPreset,
} from '../../core/utils/finance-period';
import { convertWithEurRates } from '../../core/utils/finance-currency';
import {
  expenseAmountInReportCurrency,
  remapFinanceSummary,
} from '../../core/utils/finance-summary-currency';
import {
  FINANCE_CURRENCY_STORAGE_KEY,
  financeRouteQueryParams,
  isFinancePeriodPreset,
  type FinanceBreakdownPanel,
} from '../../core/utils/finance-route';
import { getExchangeRateSourceLink } from '../../core/constants/exchange-rate-sources';
import { formatMoneyWithCode } from '../../core/utils/format-currency';
import { createFinanceTeaserDemo } from '../../core/utils/finance-teaser-demo';
import { planEntitlementsFromProfile } from '../../core/utils/user-profile.utils';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';

function expensesFromSummaryBreakdown(rows: FinanceExpenseBreakdown[] | undefined): Expense[] {
  return (rows ?? []).map((row) => ({
    _id: row.id,
    title: row.title,
    amount: row.amount,
    currency: row.currency,
    expense_date: row.expense_date,
    category: row.category || '',
  }));
}

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [FormsModule, RouterLink, AppDialogComponent, AppSelectComponent, DecimalPipe],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss',
})
export class FinanceComponent implements OnInit {
  private readonly financeSvc = inject(FinanceService);
  private readonly userSvc = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(I18nService);

  loading = signal(true);
  readonly skeletonKpiSlots = [0, 1, 2, 3];
  readonly skeletonLineSlots = [0, 1, 2];
  error = signal<string | null>(null);
  summary = signal<FinanceSummary | null>(null);
  expenses = signal<Expense[]>([]);
  /** Free plan: demo preview + paywall overlay. */
  isTeaser = signal(false);
  upgradeModalOpen = signal(false);

  periodPreset = signal<FinancePeriodPreset>('month');
  reportCurrency = signal(this.readStoredReportCurrency());

  displayCurrency = computed(() => this.reportCurrency() || this.summary()?.currency || 'EUR');
  expenseFormOpen = signal(false);
  expenseEditTarget = signal<Expense | null>(null);
  expenseDeleteId = signal<string | null>(null);
  expenseSaving = signal(false);

  expenseForm = {
    title: '',
    amount: 0,
    currency: 'EUR',
    expense_date: new Date().toISOString().slice(0, 10),
    category: '',
  };

  incomeByCurrencyRows = computed(() => {
    const by = this.summary()?.income.byCurrency ?? {};
    return Object.entries(by)
      .filter(([, amount]) => amount > 0)
      .sort(([a], [b]) => a.localeCompare(b));
  });

  showMixedCurrencyNote = computed(() => {
    const codes = Object.keys(this.summary()?.income.byCurrency ?? {});
    const report = this.displayCurrency();
    return codes.length > 1 || codes.some((c) => c !== report);
  });

  combinedIncome = computed(() => {
    const s = this.summary();
    if (!s) {
      return 0;
    }
    return s.income.combinedIncome ?? s.income.totalIncome + s.income.scheduledIncome;
  });

  hasLessonsInPeriod = computed(() => (this.summary()?.totals.lessonCount ?? 0) > 0);

  hiddenCalendarLessons = computed(() =>
    (this.summary()?.lessonsBreakdown ?? []).filter(
      (lesson) =>
        Boolean(lesson.hiddenReason) ||
        (!lesson.visibleInCalendar && !lesson.scheduleDerived),
    ),
  );

  periodPresetLabel = computed(() => {
    const preset = this.periodPreset();
    if (preset === 'month') {
      return this.t.periodMonth;
    }
    if (preset === 'year') {
      return this.t.periodYear;
    }
    return this.t.periodAll;
  });

  periodRangeLabel = computed(() => {
    this.i18n.lang();
    const preset = this.periodPreset();
    if (preset === 'all') {
      return '';
    }
    const range = financePeriodRange(preset);
    if (!range.from || !range.to) {
      return '';
    }
    if (preset === 'year') {
      return String(new Date(`${range.from}T12:00:00`).getFullYear());
    }
    const locale = this.i18n.localeId();
    const fmt = (iso: string) =>
      new Date(`${iso}T12:00:00`).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
      });
    if (range.from === range.to) {
      return fmt(range.from);
    }
    return `${fmt(range.from)} – ${fmt(range.to)}`;
  });

  filteredExpenses = computed(() => {
    const range = financePeriodRange(this.periodPreset());
    const items = this.expenses();
    if (!range.from && !range.to) {
      return items;
    }
    return items.filter((e) => {
      const d = e.expense_date || e.createdAt?.slice(0, 10);
      if (!d) {
        return true;
      }
      if (range.from && d < range.from) {
        return false;
      }
      if (range.to && d > range.to) {
        return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    const periodParam = this.route.snapshot.queryParamMap.get('period');
    if (isFinancePeriodPreset(periodParam)) {
      this.periodPreset.set(periodParam);
    }
    const currencyParam = this.route.snapshot.queryParamMap.get('currency');
    if (currencyParam) {
      this.reportCurrency.set(currencyParam);
    }
    this.syncRouteQuery();
    this.reload();
  }

  get t() {
    return this.i18n.financeUi();
  }

  setPeriod(preset: FinancePeriodPreset): void {
    this.periodPreset.set(preset);
    this.syncRouteQuery();
    this.reload();
  }

  currencySelectOptions(): AppSelectOption[] {
    return FINANCE_REPORT_CURRENCIES.map((code) => ({
      value: code,
      label: code,
    }));
  }

  setReportCurrency(code: string): void {
    if (!code || code === this.reportCurrency()) {
      return;
    }
    this.reportCurrency.set(code);
    localStorage.setItem(FINANCE_CURRENCY_STORAGE_KEY, code);
    const current = this.summary();
    if (current) {
      this.summary.set(remapFinanceSummary(current, code));
    }
    this.syncRouteQuery();
  }

  private readStoredReportCurrency(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }
    return localStorage.getItem(FINANCE_CURRENCY_STORAGE_KEY) ?? '';
  }

  private syncRouteQuery(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: financeRouteQueryParams(this.periodPreset(), this.reportCurrency()),
      replaceUrl: true,
    });
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);

    // Cached /me when available (Home/nav already warm it). Fresh fetch only if empty.
    this.userSvc
      .ensureProfile()
      .pipe(
        switchMap((profile) => {
          const unlocked = planEntitlementsFromProfile(profile).hasFinance;
          this.isTeaser.set(!unlocked);
          if (!unlocked) {
            this.applyTeaserDemo();
            return of(null);
          }
          return this.fetchLiveSummary$();
        }),
        catchError(() => {
          this.isTeaser.set(true);
          this.applyTeaserDemo();
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  private applyTeaserDemo(): void {
    const currency = this.reportCurrency() || 'EUR';
    const demo = createFinanceTeaserDemo(currency);
    this.reportCurrency.set(demo.summary.currency);
    this.summary.set(demo.summary);
    this.expenses.set(demo.expenses);
    this.error.set(null);
  }

  /** One /summary call — expenses come from expensesBreakdown (no second RTT). */
  private fetchLiveSummary$() {
    const range = financePeriodRange(this.periodPreset());
    const currency = this.reportCurrency();
    const summaryQuery = {
      ...range,
      ...(currency ? { currency } : {}),
    };
    return this.financeSvc.getSummary(summaryQuery).pipe(
      map((data) => {
        const target = this.reportCurrency() || data.currency;
        if (!this.reportCurrency()) {
          this.reportCurrency.set(target);
        }
        const remapped = remapFinanceSummary(data, target);
        this.summary.set(remapped);
        this.expenses.set(expensesFromSummaryBreakdown(remapped.expensesBreakdown));
        return remapped;
      }),
      catchError(() => {
        this.error.set(this.t.loadError);
        return of(null);
      }),
    );
  }

  formatMoney(amount: number, currencyCode?: string): string {
    const code = currencyCode ?? this.displayCurrency();
    return formatMoneyWithCode(amount, code, this.i18n.localeId());
  }

  formatExpenseAmount(expense: Expense): string {
    const summary = this.summary();
    if (!summary) {
      return this.formatMoney(expense.amount, this.expenseCurrency(expense));
    }
    return this.formatMoney(
      expenseAmountInReportCurrency(
        expense.amount,
        summary,
        this.displayCurrency(),
        this.expenseCurrency(expense),
      ),
    );
  }

  expenseOriginalLabel(expense: Expense): string | null {
    const from = this.expenseCurrency(expense);
    const report = this.displayCurrency();
    if (from === report) {
      return null;
    }
    return `(${this.formatMoney(expense.amount, from)} ${this.t.originalInCurrency})`;
  }

  private expenseCurrency(expense: Expense): string {
    return expense.currency ?? this.summary()?.defaultCurrency ?? this.displayCurrency();
  }

  private defaultExpenseCurrency(): string {
    return this.summary()?.defaultCurrency ?? this.displayCurrency();
  }

  formatHours(hours: number): string {
    return new Intl.NumberFormat(this.i18n.localeId(), {
      maximumFractionDigits: 1,
    }).format(hours);
  }

  formatPercent(rate: number): string {
    return new Intl.NumberFormat(this.i18n.localeId(), {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(rate);
  }

  convertToReport(amount: number, fromCurrency: string): number {
    const s = this.summary();
    if (!s?.exchangeRates?.rates) {
      return amount;
    }
    return convertWithEurRates(amount, fromCurrency, this.displayCurrency(), s.exchangeRates.rates);
  }

  exchangeRateAsOf(): string {
    return this.summary()?.exchangeRates?.asOf ?? '';
  }

  exchangeRateSourceLink() {
    return getExchangeRateSourceLink(this.displayCurrency());
  }

  exchangeRatesSource(): string {
    return this.summary()?.exchangeRates?.source ?? '';
  }

  exchangeRatesTable(): Array<{ code: string; perEur: number }> {
    const rates = this.summary()?.exchangeRates?.rates;
    if (!rates) {
      return [];
    }
    return Object.entries(rates)
      .map(([code, perEur]) => ({ code, perEur: Number(perEur) }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  private gateOrRun(action: () => void): void {
    if (this.isTeaser()) {
      this.upgradeModalOpen.set(true);
      return;
    }
    action();
  }

  openBreakdown(panel: FinanceBreakdownPanel): void {
    this.gateOrRun(() => {
      void this.router.navigate(['/app/finance/breakdown', panel], {
        queryParams: financeRouteQueryParams(this.periodPreset(), this.reportCurrency()),
      });
    });
  }

  openExpenseCreate(): void {
    this.gateOrRun(() => {
      this.expenseEditTarget.set(null);
      this.expenseForm = {
        title: '',
        amount: 0,
        currency: this.defaultExpenseCurrency(),
        expense_date: new Date().toISOString().slice(0, 10),
        category: '',
      };
      this.expenseFormOpen.set(true);
    });
  }

  openExpenseEdit(expense: Expense): void {
    this.gateOrRun(() => {
      this.expenseEditTarget.set(expense);
      this.expenseForm = {
        title: expense.title,
        amount: expense.amount,
        currency: this.expenseCurrency(expense),
        expense_date: expense.expense_date || new Date().toISOString().slice(0, 10),
        category: expense.category ?? '',
      };
      this.expenseFormOpen.set(true);
    });
  }

  closeExpenseForm(): void {
    this.expenseFormOpen.set(false);
    this.expenseEditTarget.set(null);
  }

  saveExpense(): void {
    if (this.isTeaser()) {
      this.upgradeModalOpen.set(true);
      return;
    }
    const title = this.expenseForm.title.trim();
    const amount = Number(this.expenseForm.amount);
    if (!title || Number.isNaN(amount) || amount < 0) {
      return;
    }

    const payload = {
      title,
      amount,
      currency: this.expenseForm.currency,
      expense_date: this.expenseForm.expense_date,
      category: this.expenseForm.category.trim() || undefined,
    };

    this.expenseSaving.set(true);
    const edit = this.expenseEditTarget();
    const req = edit
      ? this.financeSvc.updateExpense(edit._id, payload)
      : this.financeSvc.createExpense(payload);

    req.subscribe({
      next: () => {
        this.expenseSaving.set(false);
        this.closeExpenseForm();
        this.reload();
      },
      error: () => {
        this.expenseSaving.set(false);
        this.error.set(this.t.loadError);
      },
    });
  }

  confirmDeleteExpense(id: string): void {
    this.gateOrRun(() => this.expenseDeleteId.set(id));
  }

  cancelDeleteExpense(): void {
    this.expenseDeleteId.set(null);
  }

  deleteExpense(): void {
    if (this.isTeaser()) {
      this.upgradeModalOpen.set(true);
      return;
    }
    const id = this.expenseDeleteId();
    if (!id) {
      return;
    }
    this.financeSvc.removeExpense(id).subscribe({
      next: () => {
        this.expenseDeleteId.set(null);
        this.reload();
      },
      error: () => this.error.set(this.t.loadError),
    });
  }

  closeUpgradeModal(): void {
    this.upgradeModalOpen.set(false);
  }

  goToPricing(): void {
    this.upgradeModalOpen.set(false);
    void this.router.navigate(['/app/pricing']);
  }
}
