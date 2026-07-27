export type LessonDoc = {
  status?: string;
  billing_processed?: boolean;
  student_id?: string | null;
  tutor?: string | null;
  lesson_duration?: number | string;
};

export type StudentDoc = {
  name?: string;
  billing_type?: string;
  rate_unit?: string;
  balance_lessons?: number | string;
  unpaid_lessons_count?: number | string;
};

type DocRef = { id: string };
type DocSnap<T> = { exists: boolean; data(): T };

type TransactionLike = {
  get(ref: DocRef): Promise<DocSnap<unknown>>;
  set(ref: DocRef, data: Record<string, unknown>): void;
  update(ref: DocRef, patch: Record<string, unknown>): void;
};

type LoggerLike = {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
};

type ProcessArgs = {
  tx: TransactionLike;
  lessonRef: DocRef;
  getStudentRef: (studentId: string) => DocRef;
  getBalanceLogRef: () => DocRef;
  nowIso: string;
  serverTimestamp: unknown;
  logger: LoggerLike;
};

function normalizeBillingType(raw: unknown): 'package' | 'postpaid' {
  const value = String(raw ?? 'package').trim().toLowerCase();
  if (value === 'postpaid' || value === 'per_lesson' || value === 'single') {
    return 'postpaid';
  }
  return 'package';
}

function normalizeRateUnit(raw: unknown): 'hour' | 'lesson' {
  return String(raw ?? 'hour').trim().toLowerCase() === 'lesson' ? 'lesson' : 'hour';
}

function packageDebitAmount(rateUnit: 'hour' | 'lesson', lessonDuration: unknown): number {
  if (rateUnit === 'lesson') {
    return 1;
  }
  const minutes = Number(lessonDuration);
  const safe = Number.isFinite(minutes) && minutes > 0 ? minutes : 60;
  return Math.round((safe / 60) * 100) / 100;
}

/**
 * Idempotent lesson billing transaction.
 * Returns status for observability.
 */
export async function processLessonTransaction({
  tx,
  lessonRef,
  getStudentRef,
  getBalanceLogRef,
  nowIso,
  serverTimestamp,
  logger,
}: ProcessArgs): Promise<'processed' | 'skipped'> {
  const lessonSnap = await tx.get(lessonRef);
  if (!lessonSnap.exists) {
    logger.warn('[dailyBillingWorker] lesson missing, skip', { lessonId: lessonRef.id });
    return 'skipped';
  }

  const lesson = lessonSnap.data() as LessonDoc;
  if (lesson.billing_processed === true) {
    logger.info('[dailyBillingWorker] lesson already billed, idempotent skip', {
      lessonId: lessonRef.id,
    });
    return 'skipped';
  }

  if (lesson.status !== 'completed') {
    logger.info('[dailyBillingWorker] lesson is not completed, skip', { lessonId: lessonRef.id });
    return 'skipped';
  }

  // Defensive path: close lesson billing even if student is missing.
  if (!lesson.student_id) {
    tx.update(lessonRef, {
      billing_processed: true,
      balance_debited: false,
      billing_processed_at: serverTimestamp,
      updatedAt: serverTimestamp,
    });
    return 'processed';
  }

  const studentRef = getStudentRef(lesson.student_id);
  const studentSnap = await tx.get(studentRef);
  if (!studentSnap.exists) {
    throw new Error(`Student ${lesson.student_id} not found for lesson ${lessonRef.id}`);
  }

  const student = studentSnap.data() as StudentDoc;
  const billingType = normalizeBillingType(student.billing_type);
  const rateUnit = normalizeRateUnit(student.rate_unit);
  const units = packageDebitAmount(rateUnit, lesson.lesson_duration);

  let studentPatch: Record<string, unknown>;
  let amount: number;
  let reason: string;
  let balanceDebited: boolean;

  if (billingType === 'package') {
    const current = Number(student.balance_lessons) || 0;
    studentPatch = { balance_lessons: Math.round((current - units) * 100) / 100 };
    amount = -units;
    reason = 'lesson_completed_delayed';
    balanceDebited = true;
  } else {
    const current = Number(student.unpaid_lessons_count) || 0;
    studentPatch = { unpaid_lessons_count: Math.round((current + units) * 100) / 100 };
    amount = units;
    reason = 'lesson_completed_postpaid';
    balanceDebited = false;
  }

  tx.update(studentRef, {
    ...studentPatch,
    updatedAt: serverTimestamp,
  });

  const logRef = getBalanceLogRef();
  tx.set(logRef, {
    tutor: lesson.tutor ?? null,
    studentId: lesson.student_id,
    lessonId: lessonRef.id,
    amount,
    reason,
    createdAt: serverTimestamp,
  });

  tx.update(lessonRef, {
    billing_processed: true,
    balance_debited: balanceDebited,
    balance_units_debited: units,
    billing_processed_at: serverTimestamp,
    paidAt: nowIso,
    updatedAt: serverTimestamp,
  });

  return 'processed';
}
