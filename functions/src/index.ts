import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { processLessonTransaction } from './lesson-billing.js';

initializeApp();
const db = getFirestore();

/**
 * Scheduled billing worker (Gen 2).
 *
 * Runs every day at midnight Europe/Vienna.
 * Retry is enabled for transient errors (max 3 retries).
 */
export const dailyBillingWorker = onSchedule(
  {
    schedule: '0 0 * * *',
    timeZone: 'Europe/Vienna',
    retryCount: 3,
    memory: '256MiB',
  },
  async () => {
    const runStartedAt = new Date().toISOString();
    logger.info('[dailyBillingWorker] started', { runStartedAt });

    const now = Timestamp.now();
    const lessonsSnap = await db
      .collection('lessons')
      .where('status', '==', 'completed')
      .where('billing_processed', '==', false)
      .get();

    logger.info('[dailyBillingWorker] candidate lessons loaded', {
      count: lessonsSnap.size,
    });

    for (const lessonRef of lessonsSnap.docs.map((d) => d.ref)) {
      try {
        await db.runTransaction(async (tx) => {
          await processLessonTransaction({
            tx,
            lessonRef,
            getStudentRef: (studentId) => db.collection('students').doc(studentId),
            getBalanceLogRef: () => db.collection('balance_logs').doc(),
            nowIso: new Date().toISOString(),
            serverTimestamp: FieldValue.serverTimestamp(),
            logger,
          });
        });

        logger.info('[dailyBillingWorker] lesson processed', { lessonId: lessonRef.id });
      } catch (error) {
        logger.error('[dailyBillingWorker] transaction failed', {
          lessonId: lessonRef.id,
          error: error instanceof Error ? error.message : String(error),
        });
        // Rethrow so Cloud Functions marks the run as failed and retryCount can apply.
        throw error;
      }
    }

    logger.info('[dailyBillingWorker] completed', {
      processedLessons: lessonsSnap.size,
      runAt: now.toDate().toISOString(),
    });
  },
);
