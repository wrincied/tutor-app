import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../config/api-url';

const PRESENCE_THROTTLE_MS = 15 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private readonly http = inject(HttpClient);
  private lastPingAt = 0;

  /** Обновляет last_login_at на бэкенде (не чаще раза в 15 мин). */
  ping(): void {
    const now = Date.now();
    if (now - this.lastPingAt < PRESENCE_THROTTLE_MS) {
      return;
    }
    this.lastPingAt = now;
    this.http.post(`${apiUrl('auth')}/presence`, {}).subscribe({
      error: () => {
        this.lastPingAt = 0;
      },
    });
  }
}
