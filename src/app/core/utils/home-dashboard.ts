import type {
  CalendarLesson,
  FinanceLessonBreakdown,
  Student,
} from '@interfaces';

export interface HomeLessonRow {
  lesson: CalendarLesson;
  studentName: string;
  studentColor: string;
  student: Student | null;
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
        student: student ?? null,
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

export type HomePaymentBadge = { kind: 'package' | 'unpaid'; text: string };

/** Бейдж оплаты для карточки урока на дашборде. */
export function paymentBadgeForStudent(
  student: Student | null | undefined,
  labels: { package: string; packageProgress: string; unpaid: string },
): HomePaymentBadge {
  if (!student) {
    return { kind: 'unpaid', text: labels.unpaid };
  }

  const billing = student.billing_type ?? 'package';
  const balance = Number(student.balance_lessons) || 0;
  const unpaid = Number(student.unpaid_lessons_count) || 0;
  const packSize = Number(student.last_topup?.units) || 0;

  if (billing === 'postpaid') {
    return unpaid > 0
      ? { kind: 'unpaid', text: labels.unpaid }
      : { kind: 'package', text: labels.package };
  }

  if (balance <= 0) {
    return { kind: 'unpaid', text: labels.unpaid };
  }

  if (packSize > 0) {
    const left = formatBalance(balance);
    const total = formatBalance(packSize);
    return {
      kind: 'package',
      text: labels.packageProgress.replace('{left}', left).replace('{total}', total),
    };
  }

  return {
    kind: 'package',
    text: `${labels.package} ${formatBalance(balance)}`,
  };
}

function formatBalance(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(1).replace(/\.0$/, '');
}
