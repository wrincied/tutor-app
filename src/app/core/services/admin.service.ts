import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  AdminDashboardPayload,
  AdminPreferences,
  AdminStats,
  AdminUserRow,
  AdminUserSummary,
  LegalCmsDocId,
  LegalCmsDocument,
  SubscriptionStatus,
} from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('admin');

export interface UpdateSubscriptionPayload {
  subscription_status: SubscriptionStatus;
  trial_ends_at?: string;
}

export interface AdminSubscriptionResponse {
  ok: boolean;
  user: AdminUserRow;
  days?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${API}/stats`);
  }

  getDashboard(): Observable<AdminDashboardPayload> {
    return this.http.get<AdminDashboardPayload>(`${API}/dashboard`);
  }

  getPreferences(): Observable<AdminPreferences> {
    return this.http.get<AdminPreferences>(`${API}/preferences`);
  }

  savePreferences(payload: AdminPreferences): Observable<{ ok: boolean; dashboard_widgets: AdminPreferences['dashboard_widgets'] }> {
    return this.http.put<{ ok: boolean; dashboard_widgets: AdminPreferences['dashboard_widgets'] }>(
      `${API}/preferences`,
      payload,
    );
  }

  getUserSummary(userId: string): Observable<AdminUserSummary> {
    return this.http.get<AdminUserSummary>(`${API}/users/${userId}/summary`);
  }

  getUsers(): Observable<AdminUserRow[]> {
    return this.http.get<AdminUserRow[]>(`${API}/users`);
  }

  updateSubscription(
    userId: string,
    payload: UpdateSubscriptionPayload,
  ): Observable<AdminSubscriptionResponse> {
    return this.http.put<AdminSubscriptionResponse>(`${API}/users/${userId}/subscription`, payload);
  }

  grantTrial(userId: string, trialEndsAt?: string): Observable<AdminSubscriptionResponse> {
    return this.http.post<AdminSubscriptionResponse>(`${API}/users/${userId}/grant-trial`, {
      trial_ends_at: trialEndsAt,
    });
  }

  getLandingLegal(doc: LegalCmsDocId): Observable<LegalCmsDocument> {
    return this.http.get<LegalCmsDocument>(`${API}/landing/legal/${doc}`);
  }

  saveLandingLegal(
    doc: LegalCmsDocId,
    payload: { title: string; body: string },
  ): Observable<LegalCmsDocument & { ok: boolean }> {
    return this.http.put<LegalCmsDocument & { ok: boolean }>(`${API}/landing/legal/${doc}`, payload);
  }
}
