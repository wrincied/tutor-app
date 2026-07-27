import { Injectable, inject, signal } from '@angular/core';
import type { Student } from '@interfaces';
import { StudentService } from './student.service';

export type BotUnlinkAlert = {
  studentId: string;
  studentName: string;
  telegramUsername: string | null;
};

/**
 * Показывает репетитору модалку, когда ученик сам отвязал Telegram-бота.
 */
@Injectable({ providedIn: 'root' })
export class BotUnlinkAlertService {
  private readonly students = inject(StudentService);
  readonly alert = signal<BotUnlinkAlert | null>(null);
  private checking = false;

  /** Проверить список учеников на pending unlink (идемпотентно). */
  ingestStudents(list: Student[]): void {
    if (this.alert()) {
      return;
    }
    const pending = list.find((s) => s.telegram_unlink_pending);
    if (!pending) {
      return;
    }
    this.alert.set({
      studentId: pending._id,
      studentName: pending.name,
      telegramUsername: pending.telegram_unlinked_username || null,
    });
  }

  refreshFromApi(): void {
    if (this.checking || this.alert()) {
      return;
    }
    this.checking = true;
    this.students.getAll().subscribe({
      next: (list) => {
        this.checking = false;
        this.ingestStudents(list);
      },
      error: () => {
        this.checking = false;
      },
    });
  }

  dismiss(): void {
    const current = this.alert();
    if (!current) {
      return;
    }
    this.alert.set(null);
    this.students.update(current.studentId, { telegram_unlink_pending: false }).subscribe({
      error: () => {
        /* ignore — модалка уже закрыта */
      },
    });
  }
}
