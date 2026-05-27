"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLessonTransaction = processLessonTransaction;
function normalizeBillingType(raw) {
    const value = String(raw ?? 'package').trim().toLowerCase();
    if (value === 'postpaid' || value === 'per_lesson' || value === 'single') {
        return 'postpaid';
    }
    return 'package';
}
/**
 * Idempotent lesson billing transaction.
 * Returns status for observability.
 */
async function processLessonTransaction({ tx, lessonRef, getStudentRef, getBalanceLogRef, nowIso, serverTimestamp, logger, }) {
    const lessonSnap = await tx.get(lessonRef);
    if (!lessonSnap.exists) {
        logger.warn('[dailyBillingWorker] lesson missing, skip', { lessonId: lessonRef.id });
        return 'skipped';
    }
    const lesson = lessonSnap.data();
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
    const student = studentSnap.data();
    const billingType = normalizeBillingType(student.billing_type);
    let studentPatch;
    let amount;
    let reason;
    let balanceDebited;
    if (billingType === 'package') {
        const current = Number(student.balance_lessons) || 0;
        studentPatch = { balance_lessons: current - 1 };
        amount = -1;
        reason = 'lesson_completed_delayed';
        balanceDebited = true;
    }
    else {
        const current = Number(student.unpaid_lessons_count) || 0;
        studentPatch = { unpaid_lessons_count: current + 1 };
        amount = 1;
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
        billing_processed_at: serverTimestamp,
        paidAt: nowIso,
        updatedAt: serverTimestamp,
    });
    return 'processed';
}
