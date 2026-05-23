import type { CalendarLesson, Lesson, Student } from '@interfaces';

/** Ученик на абонементе с одним оставшимся уроком на балансе. */
export function isPackageStudentWithLastBalance(student: Student): boolean {
  const billingType = String(student.billing_type ?? 'package');
  if (billingType !== 'package') {
    return false;
  }
  return Number(student.balance_lessons) === 1;
}

export function isLessonBillingProcessed(lesson: Lesson): boolean {
  if (lesson.billing_processed !== undefined) {
    return Boolean(lesson.billing_processed);
  }
  return Boolean(lesson.balance_debited);
}

/** Кандидат на маркер «последний оплаченный» в сетке. */
export function isEligibleForLastPaidMarker(lesson: Lesson): boolean {
  if (!lesson.scheduledAt?.trim()) {
    return false;
  }
  if (Number.isNaN(Date.parse(lesson.scheduledAt))) {
    return false;
  }
  if (lesson.status === 'scheduled') {
    return true;
  }
  if (lesson.status === 'completed') {
    return !isLessonBillingProcessed(lesson);
  }
  return false;
}

/** Урок в будущем или прямо сейчас (прошлые слоты не участвуют в маркере). */
export function isScheduledAtNowOrFuture(lesson: Lesson, now: Date): boolean {
  const startMs = Date.parse(lesson.scheduledAt);
  if (Number.isNaN(startMs)) {
    return false;
  }
  return startMs >= now.getTime();
}

function compareByScheduledAt(a: Lesson, b: Lesson): number {
  return Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt);
}

/**
 * Для каждого ученика (package, balance === 1) находит самый ранний подходящий урок
 * и проставляет `isLastPaid: true` только ему.
 */
export function enrichLessonsWithLastPaidMarker(
  lessons: readonly Lesson[],
  students: readonly Student[],
  asOf: Date = new Date(),
): CalendarLesson[] {
  const now = asOf;
  const studentsById = new Map(students.map((student) => [student._id, student]));
  const lastPaidIdByStudent = new Map<string, string>();
  const poolByStudent = new Map<string, Lesson[]>();

  for (const lesson of lessons) {
    const studentId = lesson.student_id;
    if (!studentId) {
      continue;
    }
    const student = studentsById.get(studentId);
    if (!student || !isPackageStudentWithLastBalance(student)) {
      continue;
    }
    if (!isEligibleForLastPaidMarker(lesson)) {
      continue;
    }
    if (!isScheduledAtNowOrFuture(lesson, now)) {
      continue;
    }
    const pool = poolByStudent.get(studentId) ?? [];
    pool.push(lesson);
    poolByStudent.set(studentId, pool);
  }

  for (const [studentId, pool] of poolByStudent) {
    const earliest = [...pool].sort(compareByScheduledAt)[0];
    if (earliest) {
      lastPaidIdByStudent.set(studentId, earliest._id);
    }
  }

  return lessons.map((lesson) => ({
    ...lesson,
    isLastPaid: Boolean(
      lesson.student_id && lastPaidIdByStudent.get(lesson.student_id) === lesson._id,
    ),
  }));
}
