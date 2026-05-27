"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const lesson_billing_js_1 = require("./lesson-billing.js");
function createLogger() {
    return {
        info: () => { },
        warn: () => { },
    };
}
(0, node_test_1.describe)('processLessonTransaction', () => {
    (0, node_test_1.it)('skips when lesson already billed', async () => {
        const updates = [];
        const tx = {
            get: async (ref) => {
                if (ref.id === 'lesson_1') {
                    return { exists: true, data: () => ({ status: 'completed', billing_processed: true }) };
                }
                return { exists: true, data: () => ({}) };
            },
            set: () => { },
            update: (ref, patch) => {
                updates.push({ ref, patch });
            },
        };
        const result = await (0, lesson_billing_js_1.processLessonTransaction)({
            tx,
            lessonRef: { id: 'lesson_1' },
            getStudentRef: (id) => ({ id }),
            getBalanceLogRef: () => ({ id: 'log_1' }),
            nowIso: '2026-01-01T00:00:00.000Z',
            serverTimestamp: '__ts__',
            logger: createLogger(),
        });
        strict_1.default.equal(result, 'skipped');
        strict_1.default.equal(updates.length, 0);
    });
    (0, node_test_1.it)('updates lesson/student and creates log for package billing', async () => {
        const sets = [];
        const updates = [];
        const tx = {
            get: async (ref) => {
                if (ref.id === 'lesson_2') {
                    return {
                        exists: true,
                        data: () => ({
                            status: 'completed',
                            billing_processed: false,
                            student_id: 'student_2',
                            tutor: 'tutor_2',
                        }),
                    };
                }
                if (ref.id === 'student_2') {
                    return {
                        exists: true,
                        data: () => ({ name: 'Mariia', billing_type: 'package', balance_lessons: 5 }),
                    };
                }
                return { exists: false, data: () => ({}) };
            },
            set: (ref, data) => {
                sets.push({ ref, data });
            },
            update: (ref, patch) => {
                updates.push({ ref, patch });
            },
        };
        const result = await (0, lesson_billing_js_1.processLessonTransaction)({
            tx,
            lessonRef: { id: 'lesson_2' },
            getStudentRef: (id) => ({ id }),
            getBalanceLogRef: () => ({ id: 'log_2' }),
            nowIso: '2026-01-02T00:00:00.000Z',
            serverTimestamp: '__ts__',
            logger: createLogger(),
        });
        strict_1.default.equal(result, 'processed');
        strict_1.default.equal(sets.length, 1);
        strict_1.default.equal(updates.length, 2);
        strict_1.default.deepEqual(sets[0], {
            ref: { id: 'log_2' },
            data: {
                tutor: 'tutor_2',
                studentId: 'student_2',
                lessonId: 'lesson_2',
                amount: -1,
                reason: 'lesson_completed_delayed',
                createdAt: '__ts__',
            },
        });
    });
    (0, node_test_1.it)('throws when student is missing', async () => {
        const tx = {
            get: async (ref) => {
                if (ref.id === 'lesson_3') {
                    return {
                        exists: true,
                        data: () => ({
                            status: 'completed',
                            billing_processed: false,
                            student_id: 'student_missing',
                        }),
                    };
                }
                return { exists: false, data: () => ({}) };
            },
            set: () => { },
            update: () => { },
        };
        await strict_1.default.rejects(() => (0, lesson_billing_js_1.processLessonTransaction)({
            tx,
            lessonRef: { id: 'lesson_3' },
            getStudentRef: (id) => ({ id }),
            getBalanceLogRef: () => ({ id: 'log_3' }),
            nowIso: '2026-01-03T00:00:00.000Z',
            serverTimestamp: '__ts__',
            logger: createLogger(),
        }), /not found/);
    });
});
