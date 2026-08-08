import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { UserProfile } from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('');

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);

  createCheckoutSession(
    interval: 'monthly' | 'yearly' = 'monthly',
    plan: 'basis' | 'pro' = 'pro',
  ): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${API}/billing/checkout-session`, { interval, plan });
  }

  cancelSubscription(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/cancel-subscription`, {});
  }

  /** Downgrade Pro/Trial → Basis on the existing Stripe subscription. */
  changePlan(plan: 'basis'): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/change-plan`, { plan });
  }

  resumeSubscription(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/resume-subscription`, {});
  }

  /** After Checkout return — pull Stripe plan into Firestore if webhook lagged. */
  syncSubscription(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/sync-subscription`, {});
  }

  /** Ручное подтверждение оплаты (прод: admin secret в .env бэкенда). */
  confirmPayment(plan: 'pro' | 'trial', adminSecret: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/confirm-payment`, {
      plan,
      adminSecret,
    });
  }
}
