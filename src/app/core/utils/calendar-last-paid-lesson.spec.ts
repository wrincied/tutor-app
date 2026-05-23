import { describe, expect, it } from 'vitest';
import {
  enrichLessonsWithLastPaidMarker,
  isEligibleForLastPaidMarker,
  isPackageStudentWithLastBalance,
} from './calendar-last-paid-lesson';
import type { Lesson, Student } from '@interfaces';

function student(overrides: Partial<Student> = {}): Student {
  return {
    _id: 's1',
    name: 'Anna',
    rate_per_hour: 50,
    color_hex: '#ccc',
    balance_lessons: 1,
    timezone: 'UTC',
    auto_debit_enabled: true,
    bot_active: false,
    billing_type: 'package',
    createdAt: '',
    ...overrides,
  };
}

function lesson(overrides: Partial<Lesson> & { _id: string }): Lesson {
  return {
    student_id: 's1',
    status: 'scheduled',
    scheduledAt: '2026-05-20T10:00:00.000Z',
    lesson_duration: 60,
    lesson_price: 50,
    lesson_currency: 'EUR',
    reminder_sent: false,
    ...overrides,
  };
}

describe('calendar-last-paid-lesson', () => {
  it('requires package billing and balance 1', () => {
    expect(isPackageStudentWithLastBalance(student())).toBe(true);
    expect(isPackageStudentWithLastBalance(student({ balance_lessons: 2 }))).toBe(false);
    expect(isPackageStudentWithLastBalance(student({ billing_type: 'postpaid' }))).toBe(
      false,
    );
  });

  it('allows scheduled and completed-without-billing-processed', () => {
    expect(isEligibleForLastPaidMarker(lesson({ _id: 'a', status: 'scheduled' }))).toBe(
      true,
    );
    expect(
      isEligibleForLastPaidMarker(
        lesson({ _id: 'b', status: 'completed', billing_processed: false }),
      ),
    ).toBe(true);
    expect(
      isEligibleForLastPaidMarker(
        lesson({ _id: 'c', status: 'completed', billing_processed: true }),
      ),
    ).toBe(false);
  });

  const asOf = new Date('2026-05-20T12:00:00.000Z');

  it('marks only the earliest future-or-now lesson per student', () => {
    const students = [student()];
    const lessons = [
      lesson({ _id: 'late', scheduledAt: '2026-05-25T10:00:00.000Z' }),
      lesson({ _id: 'early', scheduledAt: '2026-05-21T10:00:00.000Z' }),
      lesson({ _id: 'mid', scheduledAt: '2026-05-22T10:00:00.000Z' }),
    ];
    const enriched = enrichLessonsWithLastPaidMarker(lessons, students, asOf);
    expect(enriched.find((l) => l._id === 'early')?.isLastPaid).toBe(true);
    expect(enriched.find((l) => l._id === 'mid')?.isLastPaid).toBe(false);
    expect(enriched.find((l) => l._id === 'late')?.isLastPaid).toBe(false);
  });

  it('ignores past scheduled lessons even if status is scheduled', () => {
    const students = [student()];
    const lessons = [
      lesson({ _id: 'past', scheduledAt: '2026-05-10T09:00:00.000Z', status: 'scheduled' }),
      lesson({ _id: 'future', scheduledAt: '2026-05-30T09:00:00.000Z', status: 'scheduled' }),
    ];
    const enriched = enrichLessonsWithLastPaidMarker(lessons, students, asOf);
    expect(enriched.find((l) => l._id === 'past')?.isLastPaid).toBe(false);
    expect(enriched.find((l) => l._id === 'future')?.isLastPaid).toBe(true);
  });

  it('does not move marker to a newly added later slot', () => {
    const students = [student()];
    const existing = [
      lesson({ _id: 'first', scheduledAt: '2026-05-21T09:00:00.000Z' }),
      lesson({ _id: 'new', scheduledAt: '2026-05-30T09:00:00.000Z' }),
    ];
    const enriched = enrichLessonsWithLastPaidMarker(existing, students, asOf);
    expect(enriched.find((l) => l._id === 'first')?.isLastPaid).toBe(true);
    expect(enriched.find((l) => l._id === 'new')?.isLastPaid).toBe(false);
  });
});
