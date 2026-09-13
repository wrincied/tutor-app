import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();
const db = getFirestore();

/**
 * Daily subscription housekeeping only.
 * Lesson auto-complete + 30m billing run on App Hosting (lessonBotNotify / billingWorker).
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
    logger.info('[dailyBillingWorker] started (subscriptions only)', { runStartedAt });

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

    logger.info('[dailyBillingWorker] completed', { expiredTrials, expiredPro });
  },
);
