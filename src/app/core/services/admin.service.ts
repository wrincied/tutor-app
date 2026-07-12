import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { AdminRecentActivityItem, AdminStats, AdminUserRow, SubscriptionStatus } from '@interfaces';

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

  getUsers(): Observable<AdminUserRow[]> {
    return this.http.get<AdminUserRow[]>(`${API}/users`);
  }

  getRecentActivity(limit = 50): Observable<AdminRecentActivityItem[]> {
    return this.http.get<AdminRecentActivityItem[]>(`${API}/recent-activity`, {
      params: { limit: String(limit) },
    });
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
}
