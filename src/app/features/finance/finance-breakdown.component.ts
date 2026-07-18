import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { FinanceExpenseBreakdown, FinanceLessonBreakdown, FinanceSummary } from '@interfaces';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import { financePeriodRange, type FinancePeriodPreset } from '../../core/utils/finance-period';
import {
  FINANCE_CURRENCY_STORAGE_KEY,
  financeRouteQueryParams,
  isFinanceBreakdownPanel,
  isFinancePdfExportPanel,
  isFinancePeriodPreset,
  type FinanceBreakdownPanel,
} from '../../core/utils/finance-route';
import { remapFinanceSummary } from '../../core/utils/finance-summary-currency';
import { formatMoneyWithCode } from '../../core/utils/format-currency';
import {
  downloadFinanceBreakdownPdf,
  type FinanceBreakdownPdfOptions,
  type FinanceBreakdownPdfSummaryLine,
} from '../../core/utils/finance-breakdown-pdf';

@Component({
  selector: 'app-finance-breakdown',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './finance-breakdown.component.html',
  styleUrl: './finance-breakdown.component.scss',
})
export class FinanceBreakdownComponent implements OnInit {
  private readonly financeSvc = inject(FinanceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly panel = signal<FinanceBreakdownPanel>('income');
  readonly periodPreset = signal<FinancePeriodPreset>('all');
  readonly reportCurrency = signal(this.readStoredReportCurrency());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly exportingPdf = signal(false);
  readonly summary = signal<FinanceSummary | null>(null);

  readonly displayCurrency = computed(() => this.reportCurrency() || this.summary()?.currency || 'EUR');
  readonly lessonsBreakdown = computed(() => this.summary()?.lessonsBreakdown ?? []);
  readonly expensesBreakdown = computed(() => this.summary()?.expensesBreakdown ?? []);

  readonly backLink = computed(() => ({
    path: ['/app/finance'] as const,
    queryParams: financeRouteQueryParams(this.periodPreset(), this.reportCurrency()),
  }));

  readonly periodPresetLabel = computed(() => {
    const preset = this.periodPreset();
    if (preset === 'month') {
      return this.t.periodMonth;
    }
    if (preset === 'year') {
      return this.t.periodYear;
    }
    return this.t.periodAll;
  });

  readonly periodRangeLabel = computed(() => {
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

  readonly showLessons = computed(() => {
    const panel = this.panel();
    return panel === 'income' || panel === 'gross' || panel === 'net' || panel === 'lessons';
  });

  readonly showExpenses = computed(() => {
    const panel = this.panel();
    return panel === 'expenses' || panel === 'gross' || panel === 'net';
  });

  readonly canExportPdf = computed(() => {
    if (!isFinancePdfExportPanel(this.panel())) {
      return false;
    }
    return !this.loading() && !this.error() && Boolean(this.summary());
  });

  ngOnInit(): void {
    const panelParam = this.route.snapshot.paramMap.get('panel');
    if (!isFinanceBreakdownPanel(panelParam)) {
      void this.router.navigate(['/app/finance']);
      return;
    }
    this.panel.set(panelParam);

    const periodParam = this.route.snapshot.queryParamMap.get('period');
    if (isFinancePeriodPreset(periodParam)) {
      this.periodPreset.set(periodParam);
    }

    const currencyParam = this.route.snapshot.queryParamMap.get('currency');
    if (currencyParam) {
      this.reportCurrency.set(currencyParam);
    }

    this.reload();
  }

  get t() {
    return this.i18n.financeUi();
  }

  pageTitle(): string {
    switch (this.panel()) {
      case 'income':
        return this.t.incomeBreakdownTitle;
      case 'expenses':
        return this.t.expensesBreakdownTitle;
      case 'gross':
        return this.t.grossProfitBreakdownTitle;
      case 'net':
        return this.t.netProfitBreakdownTitle;
      case 'lessons':
        return this.t.breakdownLessonsList;
      default:
        return this.i18n.nav().finance;
    }
  }

  pageIntro(): string {
    switch (this.panel()) {
      case 'income':
        return this.t.incomeBreakdownIntro;
      case 'expenses':
        return this.t.expensesBreakdownIntro;
      case 'gross':
        return this.t.grossProfitBreakdownIntro;
      case 'net':
        return this.t.netProfitBreakdownIntro;
      case 'lessons':
        return this.t.markCompletedHint;
      default:
        return '';
    }
  }

  private readStoredReportCurrency(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }
    return localStorage.getItem(FINANCE_CURRENCY_STORAGE_KEY) ?? '';
  }

  private reload(): void {
    this.loading.set(true);
    this.error.set(null);
    const range = financePeriodRange(this.periodPreset());
    const currency = this.reportCurrency();
    const summaryQuery = {
      ...range,
      ...(currency ? { currency } : {}),
    };

    this.financeSvc.getSummary(summaryQuery).subscribe({
      next: (data) => {
        const target = this.reportCurrency() || data.currency;
        if (!this.reportCurrency()) {
          this.reportCurrency.set(target);
        }
        this.summary.set(remapFinanceSummary(data, target));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.t.loadError);
        this.loading.set(false);
      },
    });
  }

  formatMoney(amount: number, currencyCode?: string): string {
    const code = currencyCode ?? this.displayCurrency();
    return formatMoneyWithCode(amount, code, this.i18n.localeId());
  }

  formatPercent(rate: number): string {
    return new Intl.NumberFormat(this.i18n.localeId(), {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(rate);
  }

  lessonStatusLabel(status: string): string {
    const c = this.i18n.calendarUi();
    switch (status) {
      case 'completed':
        return c.statusCompleted;
      case 'missed':
        return c.statusMissed;
      case 'canceled':
        return c.statusCanceled;
      default:
        return c.statusScheduled;
    }
  }

  formatLessonRowDate(lesson: FinanceLessonBreakdown): string {
    if (!lesson.scheduledAt) {
      return '—';
    }
    const hasTime = lesson.scheduledAt.includes('T');
    const date = new Date(hasTime ? lesson.scheduledAt : `${lesson.scheduledAt}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      return lesson.scheduledAt.slice(0, 10);
    }
    return date.toLocaleString(this.i18n.localeId(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(hasTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
    });
  }

  formatLessonRowAmount(lesson: FinanceLessonBreakdown): string {
    if (lesson.amountReport <= 0) {
      return '—';
    }
    const report = this.formatMoney(lesson.amountReport);
    if (lesson.currency === this.displayCurrency() || lesson.amountOriginal <= 0) {
      return report;
    }
    return `${report} (${this.formatMoney(lesson.amountOriginal, lesson.currency)})`;
  }

  expenseOriginalLabel(expense: FinanceExpenseBreakdown): string | null {
    const from = expense.currency || this.summary()?.defaultCurrency || this.displayCurrency();
    const report = this.displayCurrency();
    if (from === report) {
      return null;
    }
    return `${this.formatMoney(expense.amount, from)} (${this.t.originalInCurrency})`;
  }

  hiddenReasonLabel(reason: FinanceLessonBreakdown['hiddenReason']): string {
    if (reason === 'no_schedule') {
      return this.t.breakdownHiddenNoSchedule;
    }
    if (reason === 'broken_recurrence') {
      return this.t.breakdownHiddenBrokenRecurrence;
    }
    return this.t.breakdownHiddenInCalendar;
  }

  calendarLinkQuery(lesson: FinanceLessonBreakdown): { date?: string } {
    const date = lesson.occurrenceDate || lesson.scheduledAt?.slice(0, 10);
    return date ? { date } : {};
  }

  async exportPdf(): Promise<void> {
    if (!this.canExportPdf() || this.exportingPdf()) {
      return;
    }
    const summary = this.summary();
    if (!summary) {
      return;
    }

    this.exportingPdf.set(true);
    try {
      await downloadFinanceBreakdownPdf(this.buildPdfOptions(summary));
    } catch {
      this.error.set(this.t.exportPdfError);
    } finally {
      this.exportingPdf.set(false);
    }
  }

  private buildPdfOptions(summary: FinanceSummary): FinanceBreakdownPdfOptions {
    const panel = this.panel();
    const periodParts = [this.periodPresetLabel(), this.periodRangeLabel()].filter(Boolean);
    const generatedAt = new Date().toLocaleString(this.i18n.localeId(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const options: FinanceBreakdownPdfOptions = {
      filename: this.pdfFilename(),
      title: this.pageTitle(),
      periodLabel: periodParts.join(' · '),
      currency: this.displayCurrency(),
      intro: this.pageIntro(),
      generatedAtLabel: this.t.pdfGeneratedAt,
      generatedAt,
      summaryTitle: this.t.pdfSummary,
      summaryLines: this.pdfSummaryLines(summary, panel),
      lessonHeaders: [
        this.t.breakdownLessonDate,
        this.t.breakdownLessonStudent,
        this.t.breakdownLessonStatus,
        this.t.breakdownLessonDuration,
        this.t.breakdownLessonAmount,
      ],
      lessons: [],
      expenseHeaders: [
        this.t.expenseDate,
        this.t.expenseTitle,
        this.t.expenseCategory,
        this.t.expenseAmount,
      ],
      expenses: [],
    };

    if (this.showLessons()) {
      options.lessonsSectionTitle = this.t.breakdownLessonsList;
      options.lessonsEmpty = this.t.breakdownEmptyLessons;
      options.lessons = this.lessonsBreakdown().map((lesson) => ({
        date: this.formatLessonRowDate(lesson),
        student: lesson.studentName || '—',
        status: this.lessonStatusLabel(lesson.status),
        duration: `${lesson.durationMinutes} ${this.t.breakdownMinutes}`,
        amount: this.formatLessonRowAmount(lesson),
      }));
    }

    if (this.showExpenses()) {
      options.expensesSectionTitle = this.t.breakdownExpensesList;
      options.expensesEmpty = this.t.breakdownEmptyExpenses;
      options.expenses = this.expensesBreakdown().map((expense) => ({
        date: expense.expense_date,
        title: expense.title,
        category: expense.category || '—',
        amount: this.formatMoney(expense.amountReport),
        original: this.expenseOriginalLabel(expense) ?? undefined,
      }));
    }

    if (panel === 'net' && summary.tax) {
      const tax = summary.tax;
      options.taxSectionTitle = this.t.netProfit;
      options.taxLines = [
        { label: this.t.grossProfit, value: this.formatMoney(summary.income.grossProfit) },
        ...(tax.socialInsuranceRate > 0 || tax.socialInsurance > 0
          ? [
              {
                label: `${this.t.socialInsurance} (${this.formatPercent(tax.socialInsuranceRate)})`,
                value: `−${this.formatMoney(tax.socialInsurance)}`,
              },
            ]
          : []),
        { label: this.t.incomeTax, value: `−${this.formatMoney(tax.incomeTax)}` },
        {
          label: this.t.netProfit,
          value: this.formatMoney(tax.netProfit),
          highlight: true,
        },
      ];
    }

    return options;
  }

  private pdfSummaryLines(
    summary: FinanceSummary,
    panel: FinanceBreakdownPanel,
  ): FinanceBreakdownPdfSummaryLine[] {
    const income = summary.income;
    switch (panel) {
      case 'income':
        return [
          {
            label: this.t.totalIncomeCombined,
            value: this.formatMoney(income.combinedIncome),
            highlight: true,
          },
          { label: this.t.incomeCompletedPart, value: this.formatMoney(income.totalIncome) },
          { label: this.t.incomePlannedPart, value: this.formatMoney(income.scheduledIncome) },
        ];
      case 'expenses':
        return [
          {
            label: this.t.totalExpenses,
            value: this.formatMoney(income.totalExpenses),
            highlight: true,
          },
          { label: this.t.expensesCount, value: String(summary.totals.expenseCount) },
        ];
      case 'gross':
        return [
          {
            label: this.t.grossProfit,
            value: this.formatMoney(income.grossProfit),
            highlight: true,
          },
          { label: this.t.totalIncome, value: this.formatMoney(income.totalIncome) },
          { label: this.t.totalExpenses, value: this.formatMoney(income.totalExpenses) },
        ];
      case 'net':
        if (summary.tax) {
          return [
            {
              label: this.t.netProfit,
              value: this.formatMoney(summary.tax.netProfit),
              highlight: true,
            },
            { label: this.t.grossProfit, value: this.formatMoney(income.grossProfit) },
          ];
        }
        return [
          {
            label: this.t.grossProfit,
            value: this.formatMoney(income.grossProfit),
            highlight: true,
          },
        ];
      default:
        return [];
    }
  }

  private pdfFilename(): string {
    const panel = this.panel();
    const period = this.periodPreset();
    const currency = this.displayCurrency().toLowerCase();
    return `finance-${panel}-${period}-${currency}.pdf`;
  }
}
