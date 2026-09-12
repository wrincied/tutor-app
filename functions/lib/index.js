"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyBillingWorker = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
const scheduler_1 = require("firebase-functions/v2/scheduler");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
/**
 * Daily subscription housekeeping only.
 * Lesson auto-complete + 30m billing run on App Hosting (lessonBotNotify / billingWorker).
 */
exports.dailyBillingWorker = (0, scheduler_1.onSchedule)({
    schedule: '0 0 * * *',
    timeZone: 'Europe/Vienna',
    retryCount: 3,
    memory: '256MiB',
}, async () => {
    const runStartedAt = new Date().toISOString();
    firebase_functions_1.logger.info('[dailyBillingWorker] started (subscriptions only)', { runStartedAt });
    const trialSnap = await db.collection('users').where('subscription_status', '==', 'trial').get();
    let expiredTrials = 0;
    const nowMs = Date.now();
    for (const doc of trialSnap.docs) {
        const data = doc.data();
        if (String(data.stripe_subscription_id || '').trim()) {
            continue;
        }
        const raw = data.trial_ends_at;
        const endsMs = raw && typeof raw.toDate === 'function'
            ? raw.toDate().getTime()
            : Date.parse(String(raw || ''));
        if (!Number.isFinite(endsMs) || endsMs > nowMs) {
            continue;
        }
        await doc.ref.update({
            subscription_status: 'free',
            trial_ends_at: firestore_1.FieldValue.delete(),
            billing_provider: firestore_1.FieldValue.delete(),
            cancel_at_period_end: false,
            subscription_cancel_at: firestore_1.FieldValue.delete(),
            subscription_updated_at: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        expiredTrials += 1;
    }
    if (expiredTrials > 0) {
        firebase_functions_1.logger.info('[dailyBillingWorker] expired admin trials', { expiredTrials });
    }
    const proSnap = await db.collection('users').where('subscription_status', '==', 'pro').get();
    let expiredPro = 0;
    for (const doc of proSnap.docs) {
        const data = doc.data();
        if (String(data.stripe_subscription_id || '').trim()) {
            continue;
        }
        const raw = data.proExpiresAt;
        const endsMs = raw && typeof raw.toDate === 'function'
            ? raw.toDate().getTime()
            : Date.parse(String(raw || ''));
        if (!Number.isFinite(endsMs) || endsMs > nowMs) {
            continue;
        }
        await doc.ref.update({
            subscription_status: 'free',
            trial_ends_at: firestore_1.FieldValue.delete(),
            proExpiresAt: firestore_1.FieldValue.delete(),
            billing_provider: firestore_1.FieldValue.delete(),
            cancel_at_period_end: false,
            subscription_cancel_at: firestore_1.FieldValue.delete(),
            subscription_updated_at: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        expiredPro += 1;
    }
    if (expiredPro > 0) {
        firebase_functions_1.logger.info('[dailyBillingWorker] expired manual Pro', { expiredPro });
    }
    firebase_functions_1.logger.info('[dailyBillingWorker] completed', { expiredTrials, expiredPro });
});
