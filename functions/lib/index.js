"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyBillingWorker = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const lesson_billing_js_1 = require("./lesson-billing.js");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
/**
 * Scheduled billing worker (Gen 2).
 *
 * Runs every day at midnight Europe/Vienna.
 * Retry is enabled for transient errors (max 3 retries).
 */
exports.dailyBillingWorker = (0, scheduler_1.onSchedule)({
    schedule: '0 0 * * *',
    timeZone: 'Europe/Vienna',
    retryCount: 3,
    memory: '256MiB',
}, async () => {
    const runStartedAt = new Date().toISOString();
    firebase_functions_1.logger.info('[dailyBillingWorker] started', { runStartedAt });
    const now = firestore_1.Timestamp.now();
    const lessonsSnap = await db
        .collection('lessons')
        .where('status', '==', 'completed')
        .where('billing_processed', '==', false)
        .get();
    firebase_functions_1.logger.info('[dailyBillingWorker] candidate lessons loaded', {
        count: lessonsSnap.size,
    });
    for (const lessonRef of lessonsSnap.docs.map((d) => d.ref)) {
        try {
            await db.runTransaction(async (tx) => {
                await (0, lesson_billing_js_1.processLessonTransaction)({
                    tx,
                    lessonRef,
                    getStudentRef: (studentId) => db.collection('students').doc(studentId),
                    getBalanceLogRef: () => db.collection('balance_logs').doc(),
                    nowIso: new Date().toISOString(),
                    serverTimestamp: firestore_1.FieldValue.serverTimestamp(),
                    logger: firebase_functions_1.logger,
                });
            });
            firebase_functions_1.logger.info('[dailyBillingWorker] lesson processed', { lessonId: lessonRef.id });
        }
        catch (error) {
            firebase_functions_1.logger.error('[dailyBillingWorker] transaction failed', {
                lessonId: lessonRef.id,
                error: error instanceof Error ? error.message : String(error),
            });
            // Rethrow so Cloud Functions marks the run as failed and retryCount can apply.
            throw error;
        }
    }
    firebase_functions_1.logger.info('[dailyBillingWorker] completed', {
        processedLessons: lessonsSnap.size,
        runAt: now.toDate().toISOString(),
    });
});
