import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { Expense, FinanceSummary } from '@interfaces';
import { FinanceService } from '../../core/services/finance.service';
import { I18nService } from '../../core/services/i18n.service';
import {
  financePeriodRange,
  type FinancePeriodPreset,
} from '../../core/utils/finance-period';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [FormsModule, RouterLink, AppDialogComponent],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss',
})
export class FinanceComponent implements OnInit {
  private readonly financeSvc = inject(FinanceService);
  readonly i18n = inject(I18nService);

  loading = signal(true);
  error = signal<string | null>(null);
  summary = signal<FinanceSummary | null>(null);
  expenses = signal<Expense[]>([]);

  periodPreset = signal<FinancePeriodPreset>('all');
  expenseFormOpen = signal(false);
  expenseEditTarget = signal<Expense | null>(null);
  expenseDeleteId = signal<string | null>(null);
  expenseSaving = signal(false);

  expenseForm = {
    title: '',
    amount: 0,
    expense_date: new Date().toISOString().slice(0, 10),
    category: '',
  };

  incomeByCurrencyRows = computed(() => {
    const by = this.summary()?.income.byCurrency ?? {};
    return Object.entries(by)
      .filter(([, amount]) => amount > 0)
      .sort(([a], [b]) => a.localeCompare(b));
  });

  combinedByCurrencyRows = computed(() => {
    const by = this.summary()?.income.combinedByCurrency ?? {};
    return Object.entries(by)
      .filter(([, amount]) => amount > 0)
      .sort(([a], [b]) => a.localeCompare(b));
  });

  showMixedCurrencyNote = computed(() => this.combinedByCurrencyRows().length > 1);

  combinedIncome = computed(() => {
    const s = this.summary();
    if (!s) {
      return 0;
    }
    return s.income.combinedIncome ?? s.income.totalIncome + s.income.scheduledIncome;
  });

  hasLessonsInPeriod = computed(() => (this.summary()?.totals.lessonCount ?? 0) > 0);

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
    this.reload();
  }

  get t() {
    return this.i18n.financeUi();
  }

  setPeriod(preset: FinancePeriodPreset): void {
    this.periodPreset.set(preset);
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    const range = financePeriodRange(this.periodPreset());
    let pending = 2;
    const finish = () => {
      pending -= 1;
      if (pending === 0) {
        this.loading.set(false);
      }
    };

    this.financeSvc.getSummary(range).subscribe({
      next: (data) => {
        this.summary.set(data);
        finish();
      },
      error: () => {
        this.error.set(this.t.loadError);
        finish();
      },
    });

    this.financeSvc.getExpenses().subscribe({
      next: (list) => {
        this.expenses.set(list);
        finish();
      },
      error: () => {
        this.error.set(this.t.loadError);
        finish();
      },
    });
  }

  formatMoney(amount: number, currencyCode?: string): string {
    const code = currencyCode ?? this.summary()?.currency ?? 'EUR';
    return new Intl.NumberFormat(this.i18n.localeId(), {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
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

  openExpenseCreate(): void {
    this.expenseEditTarget.set(null);
    this.expenseForm = {
      title: '',
      amount: 0,
      expense_date: new Date().toISOString().slice(0, 10),
      category: '',
    };
    this.expenseFormOpen.set(true);
  }

  openExpenseEdit(expense: Expense): void {
    this.expenseEditTarget.set(expense);
    this.expenseForm = {
      title: expense.title,
      amount: expense.amount,
      expense_date: expense.expense_date || new Date().toISOString().slice(0, 10),
      category: expense.category ?? '',
    };
    this.expenseFormOpen.set(true);
  }

  closeExpenseForm(): void {
    this.expenseFormOpen.set(false);
    this.expenseEditTarget.set(null);
  }

  saveExpense(): void {
    const title = this.expenseForm.title.trim();
    const amount = Number(this.expenseForm.amount);
    if (!title || Number.isNaN(amount) || amount < 0) {
      return;
    }

    const payload = {
      title,
      amount,
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
    this.expenseDeleteId.set(id);
  }

  cancelDeleteExpense(): void {
    this.expenseDeleteId.set(null);
  }

  deleteExpense(): void {
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
}
