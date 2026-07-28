import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import type {
  Student,
  StudentBalanceAdjustReason,
  StudentTelegramNotificationSettings,
} from '@interfaces';

export type { Student } from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('/students');

export type StudentTopupPayload = {
  lessons: number;
  money_amount?: number;
  paid_at?: string;
  send_receipt?: boolean;
};

export type StudentBalanceAdjustPayload = {
  balance_lessons: number;
  reason: StudentBalanceAdjustReason;
  notify_telegram?: boolean;
};

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  /** Shared list response until invalidated (dedupes concurrent + sequential callers). */
  private listShared$: Observable<Student[]> | null = null;

  getAll(options?: { force?: boolean }): Observable<Student[]> {
    if (options?.force) {
      this.invalidateListCache();
    }
    if (!this.listShared$) {
      this.listShared$ = this.http.get<Student[]>(API).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.listShared$;
  }

  /** Drop shared list so the next getAll hits the network. */
  invalidateListCache(): void {
    this.listShared$ = null;
  }

  getOne(id: string) {
    return this.http.get<Student>(`${API}/${id}`);
  }
  create(data: Partial<Student>) {
    return this.http.post<Student>(API, data).pipe(tap(() => this.invalidateListCache()));
  }
  update(id: string, data: Partial<Student>) {
    return this.http.put<Student>(`${API}/${id}`, data).pipe(tap(() => this.invalidateListCache()));
  }
  /** POST /api/students/:id/resync-lesson-snapshots — переснять ставку на всех уроках. */
  resyncLessonSnapshots(id: string) {
    return this.http.post<{ updated: number }>(`${API}/${id}/resync-lesson-snapshots`, {});
  }
  remove(id: string) {
    return this.http.delete(`${API}/${id}`).pipe(tap(() => this.invalidateListCache()));
  }
  disconnectTelegram(id: string) {
    return this.http
      .post<Student>(`${API}/${id}/telegram-disconnect`, {})
      .pipe(tap(() => this.invalidateListCache()));
  }
  linkTelegramManual(id: string, chatId: string, role: 'student' | 'parent' = 'student') {
    return this.http
      .post<Student>(`${API}/${id}/telegram-link-manual`, {
        chat_id: chatId,
        role,
      })
      .pipe(tap(() => this.invalidateListCache()));
  }
  saveTelegramSettings(id: string, settings: StudentTelegramNotificationSettings) {
    return this.http
      .put<Student>(`${API}/${id}/telegram-settings`, settings)
      .pipe(tap(() => this.invalidateListCache()));
  }
  topup(id: string, payload: StudentTopupPayload) {
    return this.http
      .post<Student & { telegram_receipt_sent?: boolean }>(`${API}/${id}/topup`, payload)
      .pipe(tap(() => this.invalidateListCache()));
  }
  adjustBalance(id: string, payload: StudentBalanceAdjustPayload) {
    return this.http
      .post<Student & { telegram_notified?: boolean }>(`${API}/${id}/balance-adjust`, payload)
      .pipe(tap(() => this.invalidateListCache()));
  }
}
