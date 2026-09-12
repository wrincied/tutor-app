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
  type FinanceStrings,
  type FinanceSummary,
} from '@interfaces';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  financeAnchorFromQuery,
  financeCanShiftForward,
  financeCurrentAnchor,
  financeIsCurrentPeriod,
  financePeriodRange,
  financeShiftAnchor,
  type FinancePeriodAnchor,
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
import { LocaleRouter } from '../../core/i18n/locale-router.service';
import { Auth } from '@angular/fire/auth';
import {
  EXPENSE_CATEGORY_PALETTE,
  loadExpenseHiddenCategories,
  loadExpenseQuickCategories,
  mergeExpenseCategoryOptions,
  normalizeExpenseCategoryLabel,
  rememberExpenseQuickCategory,
  removeExpenseQuickCategory,
  resolveExpenseCategoryColor,
  type ExpenseQuickCategory,
} from '../../core/utils/expense-quick-categories';

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
  private readonly localeRouter = inject(LocaleRouter);
  /** Locale-aware absolute path for routerLink. */
  lp(path: string): string {
    return this.localeRouter.path(path);
  }
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(I18nService);
  private readonly auth = inject(Auth);

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
  periodAnchor = signal<FinancePeriodAnchor>(financeCurrentAnchor());
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

  /** Saved categories for chips (presets merged in computed). */
  private quickCategoriesSaved = signal<ExpenseQuickCategory[]>([]);
  private quickCategoriesHidden = signal<string[]>([]);
  readonly expenseCategoryPalette = EXPENSE_CATEGORY_PALETTE;
  readonly normalizeExpenseCategoryLabel = normalizeExpenseCategoryLabel;

  expenseCategoryChips = computed(() => {
    this.i18n.lang();
    const t = this.t;
    const presets = [
      t.expenseCatSoftware,
      t.expenseCatMaterials,
      t.expenseCatSpace,
      t.expenseCatTransport,
    ];
    const fromExpenses = this.expenses()
      .map((e) => e.category ?? '')
      .filter(Boolean);
    return mergeExpenseCategoryOptions(
      presets,
      this.quickCategoriesSaved(),
      fromExpenses,
      this.quickCategoriesHidden(),
    );
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
    if (preset === 'all') {
      return this.t.periodAll;
    }
    if (financeIsCurrentPeriod(preset, this.periodAnchor())) {
      return preset === 'month' ? this.t.periodMonth : this.t.periodYear;
    }
    return this.periodNavLabel();
  });

  periodNavLabel = computed(() => {
    this.i18n.lang();
    const preset = this.periodPreset();
    if (preset === 'all') {
      return '';
    }
    const anchor = this.periodAnchor();
    if (financeIsCurrentPeriod(preset, anchor)) {
      return preset === 'month' ? this.t.periodMonth : this.t.periodYear;
    }
    const locale = this.i18n.localeId();
    if (preset === 'year') {
      return String(anchor.year);
    }
    return new Date(anchor.year, anchor.month - 1, 1).toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    });
  });

  canShiftPeriodForward = computed(() =>
    financeCanShiftForward(this.periodPreset(), this.periodAnchor()),
  );

  periodRangeLabel = computed(() => {
    this.i18n.lang();
    const preset = this.periodPreset();
    if (preset === 'all') {
      return '';
    }
    const range = financePeriodRange(preset, this.periodAnchor());
    if (!range.from || !range.to) {
      return '';
    }
    if (preset === 'year') {
      return '';
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
    const range = financePeriodRange(this.periodPreset(), this.periodAnchor());
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
    const atParam = this.route.snapshot.queryParamMap.get('at');
    const parsedAnchor = financeAnchorFromQuery(atParam, this.periodPreset());
    if (parsedAnchor) {
      this.periodAnchor.set(parsedAnchor);
    }
    const currencyParam = this.route.snapshot.queryParamMap.get('currency');
    if (currencyParam) {
      this.reportCurrency.set(currencyParam);
    }
    this.syncRouteQuery();
    this.reloadQuickCategories();
    this.reload();
  }

  private financeUserId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  private reloadQuickCategories(): void {
    const uid = this.financeUserId();
    this.quickCategoriesSaved.set(loadExpenseQuickCategories(uid));
    this.quickCategoriesHidden.set(loadExpenseHiddenCategories(uid));
  }

  isExpenseCategorySelected(category: string): boolean {
    return (
      normalizeExpenseCategoryLabel(this.expenseForm.category).toLowerCase() ===
      normalizeExpenseCategoryLabel(category).toLowerCase()
    );
  }

  selectExpenseCategory(category: string): void {
    const label = normalizeExpenseCategoryLabel(category);
    if (!label) {
      return;
    }
    if (this.isExpenseCategorySelected(label)) {
      this.expenseForm.category = '';
      return;
    }
    this.expenseForm.category = label;
    // Persist chip so color edits stick for presets / used-on-expense labels.
    this.quickCategoriesSaved.set(
      rememberExpenseQuickCategory(
        this.financeUserId(),
        label,
        resolveExpenseCategoryColor(label, this.quickCategoriesSaved()),
      ),
    );
  }

  removeExpenseCategoryChip(category: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const label = normalizeExpenseCategoryLabel(category);
    if (!label) {
      return;
    }
    const next = removeExpenseQuickCategory(this.financeUserId(), label);
    this.quickCategoriesSaved.set(next.categories);
    this.quickCategoriesHidden.set(next.hidden);
    if (this.isExpenseCategorySelected(label)) {
      this.expenseForm.category = '';
    }
  }

  expenseCategoryColor(label: string): string {
    return resolveExpenseCategoryColor(label, this.quickCategoriesSaved());
  }

  setExpenseCategoryColor(color: string): void {
    const label = normalizeExpenseCategoryLabel(this.expenseForm.category);
    if (!label) {
      return;
    }
    this.quickCategoriesSaved.set(
      rememberExpenseQuickCategory(this.financeUserId(), label, color),
    );
  }

  formatExpenseDate(isoDate: string): string {
    const raw = String(isoDate ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }
    return new Date(`${raw}T12:00:00`).toLocaleDateString(this.i18n.localeId(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  get t(): FinanceStrings {
    return this.i18n.financeUi();
  }

  setPeriod(preset: FinancePeriodPreset): void {
    if (preset !== 'all' && this.periodPreset() === 'all') {
      this.periodAnchor.set(financeCurrentAnchor());
    }
    this.periodPreset.set(preset);
    this.syncRouteQuery();
    this.reload();
  }

  shiftPeriod(delta: -1 | 1): void {
    const preset = this.periodPreset();
    if (preset === 'all') {
      return;
    }
    if (delta === 1 && !this.canShiftPeriodForward()) {
      return;
    }
    this.periodAnchor.set(financeShiftAnchor(preset, this.periodAnchor(), delta));
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
      queryParams: financeRouteQueryParams(
        this.periodPreset(),
        this.reportCurrency(),
        this.periodAnchor(),
      ),
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
    const range = financePeriodRange(this.periodPreset(), this.periodAnchor());
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
      void this.localeRouter.navigate(`/app/finance/breakdown/${panel}`, {
        queryParams: financeRouteQueryParams(
        this.periodPreset(),
        this.reportCurrency(),
        this.periodAnchor(),
      ),
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
      category: normalizeExpenseCategoryLabel(this.expenseForm.category) || undefined,
    };

    if (payload.category) {
      this.quickCategoriesSaved.set(
        rememberExpenseQuickCategory(this.financeUserId(), payload.category),
      );
    }

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
    void this.localeRouter.navigate('/app/pricing');
  }
}
