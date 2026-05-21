import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { UserProfile } from '@interfaces';

const API = 'http://localhost:3001/api';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);

  createCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${API}/billing/checkout-session`, {});
  }

  /** Ручное подтверждение оплаты (прод: admin secret в .env бэкенда). */
  confirmPayment(plan: 'pro' | 'trial', adminSecret: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/confirm-payment`, {
      plan,
      adminSecret,
    });
  }
}
