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

  createTributeCheckoutSession(
    interval: 'monthly' | 'yearly' = 'monthly',
    plan: 'basis' | 'pro' = 'pro',
  ): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${API}/billing/tribute/checkout-session`, {
      interval,
      plan,
    });
  }

  getPaymentOptions(plan: 'basis' | 'pro' = 'pro'): Observable<{
    country: string;
    provider: 'stripe' | 'tribute';
    preferredProvider?: 'stripe' | 'tribute';
    fallbackUsed?: boolean;
    tributeReady: boolean;
    stripeReady: boolean;
    trialDays: number;
  }> {
    return this.http.get<{
      country: string;
      provider: 'stripe' | 'tribute';
      preferredProvider?: 'stripe' | 'tribute';
      fallbackUsed?: boolean;
      tributeReady: boolean;
      stripeReady: boolean;
      trialDays: number;
    }>(`${API}/billing/payment-options`, { params: { plan } });
  }

  cancelSubscription(): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/cancel-subscription`, {});
  }

  /** Schedule Pro/Trial → Basis at period end (no immediate proration). */
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

  /** Verify Stripe Checkout session before showing Pro/Trial congrats. */
  confirmCheckoutSession(sessionId: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/confirm-checkout-session`, { sessionId });
  }

  /** Ручное подтверждение оплаты (прод: admin secret в .env бэкенда). */
  confirmPayment(plan: 'pro' | 'trial', adminSecret: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${API}/billing/confirm-payment`, {
      plan,
      adminSecret,
    });
  }
}
