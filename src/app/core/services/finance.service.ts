import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Expense, FinanceSummary } from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('/finance');

export interface FinancePeriodQuery {
  from?: string;
  to?: string;
  currency?: string;
}

export interface ExpensePayload {
  title: string;
  amount: number;
  currency?: string;
  expense_date?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly http = inject(HttpClient);

  getSummary(period?: FinancePeriodQuery) {
    let params = new HttpParams();
    if (period?.from) {
      params = params.set('from', period.from);
    }
    if (period?.to) {
      params = params.set('to', period.to);
    }
    if (period?.currency) {
      params = params.set('currency', period.currency);
    }
    return this.http.get<FinanceSummary>(`${API}/summary`, { params });
  }

  getExpenses() {
    return this.http.get<Expense[]>(`${API}/expenses`);
  }

  createExpense(payload: ExpensePayload) {
    return this.http.post<Expense>(`${API}/expenses`, payload);
  }

  updateExpense(id: string, payload: Partial<ExpensePayload>) {
    return this.http.put<Expense>(`${API}/expenses/${id}`, payload);
  }

  removeExpense(id: string) {
    return this.http.delete(`${API}/expenses/${id}`);
  }
}
