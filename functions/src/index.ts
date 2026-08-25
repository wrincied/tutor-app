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

    const trialSnap = await db.collection('users').where('subscription_status', '==', 'trial').get();
    let expiredTrials = 0;
    const nowMs = Date.now();
    for (const doc of trialSnap.docs) {
      const data = doc.data();
      if (String(data.stripe_subscription_id || '').trim()) {
        continue;
      }
      const raw = data.trial_ends_at;
      const endsMs =
        raw && typeof raw.toDate === 'function'
          ? raw.toDate().getTime()
          : Date.parse(String(raw || ''));
      if (!Number.isFinite(endsMs) || endsMs > nowMs) {
        continue;
      }
      await doc.ref.update({
        subscription_status: 'free',
        trial_ends_at: FieldValue.delete(),
        billing_provider: FieldValue.delete(),
        cancel_at_period_end: false,
        subscription_cancel_at: FieldValue.delete(),
        subscription_updated_at: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      expiredTrials += 1;
    }
    if (expiredTrials > 0) {
      logger.info('[dailyBillingWorker] expired admin trials', { expiredTrials });
    }

    const proSnap = await db.collection('users').where('subscription_status', '==', 'pro').get();
    let expiredPro = 0;
    for (const doc of proSnap.docs) {
      const data = doc.data();
      if (String(data.stripe_subscription_id || '').trim()) {
        continue;
      }
      const raw = data.proExpiresAt;
      const endsMs =
        raw && typeof raw.toDate === 'function'
          ? raw.toDate().getTime()
          : Date.parse(String(raw || ''));
      if (!Number.isFinite(endsMs) || endsMs > nowMs) {
        continue;
      }
      await doc.ref.update({
        subscription_status: 'free',
        trial_ends_at: FieldValue.delete(),
        proExpiresAt: FieldValue.delete(),
        billing_provider: FieldValue.delete(),
        cancel_at_period_end: false,
        subscription_cancel_at: FieldValue.delete(),
        subscription_updated_at: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      expiredPro += 1;
    }
    if (expiredPro > 0) {
      logger.info('[dailyBillingWorker] expired manual Pro', { expiredPro });
    }
  },
);
