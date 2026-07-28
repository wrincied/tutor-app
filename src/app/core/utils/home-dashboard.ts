import type {
  CalendarLesson,
  FinanceLessonBreakdown,
  Student,
} from '@interfaces';

export interface HomeLessonRow {
  lesson: CalendarLesson;
  studentName: string;
  studentColor: string;
}

/**
 * Агенда home из finance/summary (уже развёрнутые occurrence за период),
 * без второго GET /lessons.
 */
export function lessonsFromFinanceBreakdown(
  breakdown: readonly FinanceLessonBreakdown[],
  students: readonly Student[],
): HomeLessonRow[] {
  const studentMap = new Map(students.map((student) => [student._id, student]));

  return breakdown
    .filter(
      (row) =>
        Boolean(row.scheduledAt) &&
        row.visibleInCalendar !== false &&
        !row.hiddenReason,
    )
    .slice()
    .sort((left, right) =>
      String(left.scheduledAt ?? '').localeCompare(String(right.scheduledAt ?? '')),
    )
    .map((row) => {
      const student = row.studentId ? studentMap.get(row.studentId) : undefined;
      const lessonId = row.lessonId ?? row.id.split(':')[0] ?? row.id;
      const lesson = {
        _id: lessonId,
        student_id: row.studentId,
        student_name: row.studentName,
        status: row.status as CalendarLesson['status'],
        scheduledAt: row.scheduledAt as string,
        lesson_duration: row.durationMinutes,
        lesson_price: row.amountOriginal,
        lesson_currency: row.currency,
        reminder_sent: false,
        occurrenceKey: row.id,
        isRecurring: row.isRecurring,
      } as CalendarLesson;

      return {
        lesson,
        studentName: student?.name?.trim() || row.studentName?.trim() || '—',
        studentColor: student?.color_hex ?? '#94a3b8',
      };
    });
}

/** Ближайший запланированный урок (ещё не начался). */
export function findNextLesson(rows: readonly HomeLessonRow[], now = new Date()): HomeLessonRow | null {
  return (
    rows.find(
      (row) =>
        row.lesson.status === 'scheduled' && new Date(row.lesson.scheduledAt).getTime() >= now.getTime(),
    ) ?? null
  );
}

/** Уроки сегодня в прошлом, но всё ещё «запланированы». */
export function overdueLessonCount(rows: readonly HomeLessonRow[], now = new Date()): number {
  return rows.filter(
    (row) =>
      row.lesson.status === 'scheduled' && new Date(row.lesson.scheduledAt).getTime() < now.getTime(),
  ).length;
}

/** Предоплатные ученики с остатком ≤ maxBalance занятий. */
export function studentsLowBalance(students: readonly Student[], maxBalance = 1): Student[] {
  return [...students]
    .filter((student) => {
      const billing = student.billing_type ?? 'package';
      if (billing === 'postpaid') {
        return false;
      }
      return student.balance_lessons <= maxBalance;
    })
    .sort((left, right) => left.balance_lessons - right.balance_lessons);
}
