import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { processLessonTransaction } from './lesson-billing.js';

function createLogger() {
  return {
    info: () => {},
    warn: () => {},
  };
}

describe('processLessonTransaction', () => {
  it('skips when lesson already billed', async () => {
    const updates: Array<{ ref: { id: string }; patch: Record<string, unknown> }> = [];
    const tx = {
      get: async (ref: { id: string }) => {
        if (ref.id === 'lesson_1') {
          return { exists: true, data: () => ({ status: 'completed', billing_processed: true }) };
        }
        return { exists: true, data: () => ({}) };
      },
      set: () => {},
      update: (ref: { id: string }, patch: Record<string, unknown>) => {
        updates.push({ ref, patch });
      },
    };

    const result = await processLessonTransaction({
      tx,
      lessonRef: { id: 'lesson_1' },
      getStudentRef: (id) => ({ id }),
      getBalanceLogRef: () => ({ id: 'log_1' }),
      nowIso: '2026-01-01T00:00:00.000Z',
      serverTimestamp: '__ts__',
      logger: createLogger(),
    });

    assert.equal(result, 'skipped');
    assert.equal(updates.length, 0);
  });

  it('updates lesson/student and creates log for package billing', async () => {
    const sets: Array<{ ref: { id: string }; data: Record<string, unknown> }> = [];
    const updates: Array<{ ref: { id: string }; patch: Record<string, unknown> }> = [];
    const tx = {
      get: async (ref: { id: string }) => {
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
      set: (ref: { id: string }, data: Record<string, unknown>) => {
        sets.push({ ref, data });
      },
      update: (ref: { id: string }, patch: Record<string, unknown>) => {
        updates.push({ ref, patch });
      },
    };

    const result = await processLessonTransaction({
      tx,
      lessonRef: { id: 'lesson_2' },
      getStudentRef: (id) => ({ id }),
      getBalanceLogRef: () => ({ id: 'log_2' }),
      nowIso: '2026-01-02T00:00:00.000Z',
      serverTimestamp: '__ts__',
      logger: createLogger(),
    });

    assert.equal(result, 'processed');
    assert.equal(sets.length, 1);
    assert.equal(updates.length, 2);
    assert.deepEqual(sets[0], {
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

  it('throws when student is missing', async () => {
    const tx = {
      get: async (ref: { id: string }) => {
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
      set: () => {},
      update: () => {},
    };

    await assert.rejects(
      () =>
        processLessonTransaction({
          tx,
          lessonRef: { id: 'lesson_3' },
          getStudentRef: (id) => ({ id }),
          getBalanceLogRef: () => ({ id: 'log_3' }),
          nowIso: '2026-01-03T00:00:00.000Z',
          serverTimestamp: '__ts__',
          logger: createLogger(),
        }),
      /not found/,
    );
  });
});
