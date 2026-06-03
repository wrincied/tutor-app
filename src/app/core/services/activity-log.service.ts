import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { ActivityLogEntry } from '@interfaces';

import { apiUrl } from '../config/api-url';

export type ActivityLogCategory = 'finance' | 'students' | 'all';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private readonly http = inject(HttpClient);

  getLogs(category: ActivityLogCategory, limit = 50) {
    const params = new HttpParams().set('limit', String(limit));
    if (category === 'all') {
      return this.http.get<ActivityLogEntry[]>(`${apiUrl('/account')}/activity-logs`, { params });
    }
    const base = category === 'finance' ? apiUrl('/finance') : apiUrl('/students');
    return this.http.get<ActivityLogEntry[]>(`${base}/activity-logs`, { params });
  }
}
