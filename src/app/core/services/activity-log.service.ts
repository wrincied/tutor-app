import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { ActivityLogEntry } from '@interfaces';

import { apiUrl } from '../config/api-url';

export type ActivityLogCategory = 'finance' | 'students';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private readonly http = inject(HttpClient);

  getLogs(category: ActivityLogCategory, limit = 50) {
    const base = category === 'finance' ? apiUrl('/finance') : apiUrl('/students');
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<ActivityLogEntry[]>(`${base}/activity-logs`, { params });
  }
}
