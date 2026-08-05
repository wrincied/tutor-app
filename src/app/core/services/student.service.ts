import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
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
  private readonly fireAuth = inject(Auth);
  /** Shared list response until invalidated (dedupes concurrent + sequential callers). */
  private listShared$: Observable<Student[]> | null = null;
  private cachedUid: string | null = null;

  constructor() {
    authState(this.fireAuth).subscribe((user) => {
      const uid = user?.uid ?? null;
      if (uid !== this.cachedUid) {
        this.invalidateListCache();
        this.cachedUid = uid;
      }
    });
  }

  getAll(options?: { force?: boolean }): Observable<Student[]> {
    const uid = this.fireAuth.currentUser?.uid ?? null;
    if (options?.force || (this.listShared$ && this.cachedUid !== uid)) {
      this.invalidateListCache();
    }
    if (!this.listShared$) {
      this.cachedUid = uid;
      this.listShared$ = this.http.get<Student[]>(API).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.listShared$;
  }

  /** Drop shared list so the next getAll hits the network (logout / account switch). */
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
  linkTelegramManual(
    id: string,
    chatId: string,
    role: 'student' | 'parent' = 'student',
    options?: { confirmRecipientConsent?: boolean },
  ) {
    return this.http
      .post<Student>(`${API}/${id}/telegram-link-manual`, {
        chat_id: chatId,
        role,
        confirm_recipient_consent: options?.confirmRecipientConsent === true,
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
