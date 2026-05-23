import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { AdminStats, AdminUserRow } from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('admin');

export interface GrantTrialResponse {
  ok: boolean;
  days: number;
  user: Pick<AdminUserRow, '_id' | 'email' | 'subscription_status'> & {
    trial_ends_at?: string;
  };
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

  grantTrial(userId: string): Observable<GrantTrialResponse> {
    return this.http.post<GrantTrialResponse>(`${API}/users/${userId}/grant-trial`, {});
  }
}
